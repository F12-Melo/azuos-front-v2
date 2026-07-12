"use client";

import { useState } from "react";
import { notificacoesMock } from "@/lib/mockData";

const ICONE_POR_TIPO: Record<string, string> = {
  info: "fa-circle-info",
  sucesso: "fa-circle-check",
  alerta: "fa-triangle-exclamation",
};

const CHIP_POR_TIPO: Record<string, string> = {
  info: "chip--primary",
  sucesso: "chip--success",
  alerta: "chip--warning",
};

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState(notificacoesMock);

  function marcarComoLida(id: number) {
    setNotificacoes((prev) => prev.map((n) => (n.id === id ? { ...n, lida: true } : n)));
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar__left">
          <p className="topbar__eyebrow">Avisos</p>
          <h1>Notificações</h1>
          <p>Dados ilustrativos — em breve conectados ao backend.</p>
        </div>
      </header>

      <main className="app-content">
        <section className="panel panel-content">
          <div className="insight-list">
            {notificacoes.map((n) => (
              <div
                key={n.id}
                className="nav-item"
                style={{
                  alignItems: "flex-start",
                  padding: "14px 16px",
                  opacity: n.lida ? 0.6 : 1,
                }}
                onClick={() => marcarComoLida(n.id)}
              >
                <i className={`fa-solid ${ICONE_POR_TIPO[n.tipo]}`} style={{ marginTop: 3 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <strong style={{ color: "var(--color-text-strong)" }}>{n.titulo}</strong>
                    <span className={`chip ${CHIP_POR_TIPO[n.tipo]}`} style={{ flexShrink: 0 }}>
                      {n.data}
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0", color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                    {n.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
