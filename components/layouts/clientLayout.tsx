"use client";

import { ReactNode } from "react";
import StarfieldBackground from "../background-layout";
import HeaderNav from "../home/nav";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

const ClientLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const isAdmin = pathname.includes("admin");
  return (
    <>
      <StarfieldBackground className="fixed inset-0 z-0 pointer-events-none" />
      {isAdmin ? null : <HeaderNav />}
      <main
        className={`relative z-10 ${
          isAdmin
            ? "flex item-center justify-center"
            : "flex item-center justify-center"
        } font-sans`}
      >
        <main className="2xl:w-[1440px] w-full p-4">{children}</main>
      </main>

      <Toaster
        toastOptions={{
          style: {
            fontFamily: "'Jost', sans-serif",
            fontSize: "12px",
            fontWeight: "700",
          },
          success: {
            iconTheme: {
              primary: "#1a2433",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </>
  );
};

export default ClientLayout;
