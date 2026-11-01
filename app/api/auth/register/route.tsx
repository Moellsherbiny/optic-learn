
import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validators/auth/register.schema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { sendInitialOTP } from "@/actions/verify";
import { UserRole } from "@/lib/generated/prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { name, email, password, role } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const useRole =
      role === "teacher" ? UserRole.TEACHER : UserRole.STUDENT;

    const user = await prisma.$transaction(async (tx) => {
      // Make sure the default course exists before creating the account.
      let courseId: string | undefined;

      if (useRole === UserRole.STUDENT) {
        courseId = process.env.DEFAULT_COURSE_ID;

        if (!courseId) {
          throw new Error("DEFAULT_COURSE_ID is not configured");
        }

        const course = await tx.course.findUnique({
          where: { id: courseId },
          select: { id: true },
        });

        if (!course) {
          throw new Error("Default course not found");
        }
      }

      // Create the user.
      const newUser = await tx.user.create({
        data: {
          name: name ?? null,
          email: normalizedEmail,
          password: hashedPassword,
          role: useRole,
          emailVerified: null,
          is_otp_verified: false,
        },
      });

      // Automatically enroll students in the default course.
      if (useRole === UserRole.STUDENT && courseId) {
        await tx.enrollment.upsert({
          where: {
            courseId_studentId: {
              courseId,
              studentId: newUser.id,
            },
          },
          create: {
            courseId,
            studentId: newUser.id,
          },
          update: {},
        });
      }

      return newUser;
    });

    // Send OTP after the transaction succeeds.
    await sendInitialOTP({
      email: normalizedEmail,
      mode: "register",
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration failed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
