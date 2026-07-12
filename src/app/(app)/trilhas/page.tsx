"use client";

import { trilhasMock } from "@/lib/mockData";

export default function TrilhasPage() {
  return (
    <>
      <header className="topbar">
        <div className="topbar__left">
          <p className="topbar__eyebrow">Liderança</p>
          <h1>Trilhas de capacitação</h1>
          <p>Dados ilustrativos — em breve conectados ao backend.</p>
        </div>
      </header>

      <main className="app-content">
        <section className="stats-grid">
          {trilhasMock.map((t) => (
            <article key={t.id} className="panel panel-content">
              <div className="panel__header">
                <span className="panel__title">{t.titulo}</span>
                <span className="chip chip--primary">{t.progresso}%</span>
              </div>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.88rem", marginBottom: 14 }}>
                {t.descricao}
              </p>
              <div
                style={{
                  height: 8,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  overflow: "hidden",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${t.progresso}%`,
                    background: "var(--color-accent)",
                    borderRadius: 999,
                  }}
                />
              </div>
              <span style={{ fontSize: "0.78rem", color: "var(--color-text-soft)" }}>
                {t.modulosConcluidos} de {t.modulos} módulos concluídos
              </span>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
