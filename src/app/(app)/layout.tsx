"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { usuario, isLoading } = useAuth();
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    if (!isLoading && !usuario) {
      router.push("/login");
    }
  }, [isLoading, usuario, router]);

  if (isLoading || !usuario) {
    return (
      <div className="app-body">
        <div style={{ margin: "auto", color: "var(--color-text-soft)" }}>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="app-body">
      <button
        className="mobile-toggle"
        type="button"
        aria-label="Abrir menu lateral"
        onClick={() => setMenuAberto(true)}
      >
        <i className="fa-solid fa-bars" />
      </button>
      <div
        className={`overlay${menuAberto ? " is-visible" : ""}`}
        onClick={() => setMenuAberto(false)}
      />
      <Sidebar isOpen={menuAberto} onNavigate={() => setMenuAberto(false)} />

      <div className="main-shell">{children}</div>
    </div>
  );
}
