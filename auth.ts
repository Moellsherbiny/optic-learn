
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma/client";

import { callbacks } from "@/lib/auth/callbacks";
import { providers } from "@/lib/auth/providers";

const uri = process.env.DATABASE_URL || "";

if (!uri) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  providers,
  callbacks,

  events: {
    async createUser({ user }) {
      if (!user.id) return;

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true },
      });

      // Enroll students only
      if (dbUser?.role !== UserRole.STUDENT) return;

      const courseId = process.env.DEFAULT_COURSE_ID;

      if (!courseId) {
        throw new Error("DEFAULT_COURSE_ID is not configured");
      }

      await prisma.enrollment.upsert({
        where: {
          courseId_studentId: {
            courseId,
            studentId: user.id,
          },
        },
        create: {
          courseId,
          studentId: user.id,
        },
        update: {},
      });
    },
  },

  pages: {
    signIn: "/auth/login",
  },
});
