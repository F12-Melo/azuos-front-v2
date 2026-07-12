"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "fa-chart-line", label: "Dashboard" },
  { href: "/formulario", icon: "fa-clipboard-list", label: "Formulário" },
  { href: "/historico", icon: "fa-clock-rotate-left", label: "Histórico" },
  { href: "/ranking", icon: "fa-trophy", label: "Ranking" },
  { href: "/relatorios", icon: "fa-file-lines", label: "Relatórios" },
];

const LIDER_ITEMS = [
  { href: "/equipe", icon: "fa-users", label: "Equipe" },
  { href: "/trilhas", icon: "fa-graduation-cap", label: "Trilhas" },
];

export function Sidebar({
  isOpen = false,
  onNavigate,
}: {
  isOpen?: boolean;
  onNavigate?: () => void;
}) {
  const { usuario, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    if (confirm("Tem certeza que deseja sair?")) {
      logout();
      router.push("/login");
    }
  }

  function isActive(href: string) {
    return pathname === href || pathname?.startsWith(href + "/");
  }

  return (
    <aside className={`sidebar${isOpen ? " is-open" : ""}`} id="sidebar">
      <div className="sidebar__brand">
        <Link className="brand brand--compact" href="/dashboard" onClick={onNavigate}>
          <img src="/icon.png" alt="Azuos" />
          <span className="brand__text">Azuos</span>
        </Link>
      </div>

      <nav className="sidebar__nav" aria-label="Principal">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`nav-item${isActive(item.href) ? " is-active" : ""}`}
          >
            <i className={`fa-solid ${item.icon}`} />
            <span>{item.label}</span>
          </Link>
        ))}

        {usuario?.lider && (
          <>
            <hr className="sidebar__divider" />
            <p className="sidebar__label">Liderança</p>
            {LIDER_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`nav-item${isActive(item.href) ? " is-active" : ""}`}
              >
                <i className={`fa-solid ${item.icon}`} />
                <span>{item.label}</span>
              </Link>
            ))}
          </>
        )}

        <hr className="sidebar__divider" />
        <Link
          href="/configuracoes"
          onClick={onNavigate}
          className={`nav-item${isActive("/configuracoes") ? " is-active" : ""}`}
        >
          <i className="fa-solid fa-gear" />
          <span>Configurações</span>
        </Link>
        <Link
          href="/notificacoes"
          onClick={onNavigate}
          className={`nav-item${isActive("/notificacoes") ? " is-active" : ""}`}
        >
          <i className="fa-solid fa-bell" />
          <span>Notificações</span>
        </Link>
      </nav>

      <div className="sidebar__footer">
        <div className="user-card">
          <div className="user-card__avatar">
            {usuario?.nome?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div className="user-card__meta">
            <p className="user-card__name">{usuario?.nome}</p>
            <p className="user-card__role">
              {usuario?.lider ? "Líder" : "Membro"}
            </p>
          </div>
          <button
            className="user-card__logout"
            type="button"
            onClick={handleLogout}
            aria-label="Sair"
          >
            <i className="fa-solid fa-sign-out-alt" />
          </button>
        </div>
      </div>
    </aside>
  );
}
