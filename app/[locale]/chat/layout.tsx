import { ReactNode } from "react";

import {Navbar} from "@/components/landing/navbar";
import {Footer} from "@/components/landing/footer";

interface Props {
  children: ReactNode;
}

export default function ChatLayout({
  children,
}: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 sm:px-8 lg:px-12">
        {children}
      </main>

      <Footer />
    </div>
  );
}