"use client";

import { useEffect, useState, use } from "react";
import { buscarSubmissao, buscarRelatorioPorSubmissao, ApiRequestError } from "@/lib/api";
import type { Submissao, Relatorio } from "@/lib/types";

export default function ResultadoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const submissaoId = Number(id);

  const [submissao, setSubmissao] = useState<Submissao | null>(null);
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      buscarSubmissao(submissaoId),
      buscarRelatorioPorSubmissao(submissaoId).catch(() => null),
    ])
      .then(([s, r]) => {
        setSubmissao(s);
        setRelatorio(r);
      })
      .catch((err) =>
        setErro(err instanceof ApiRequestError ? err.message : "Não foi possível carregar o resultado.")
      )
      .finally(() => setCarregando(false));
  }, [submissaoId]);

  return (
    <>
      <header className="topbar">
        <div className="topbar__left">
          <p className="topbar__eyebrow">Resultado</p>
          <h1>Avaliação #{submissaoId}</h1>
          <p>Pontuação e relatório gerado por IA.</p>
        </div>
      </header>

      <main className="app-content">
        {carregando && <div className="panel panel-content">Carregando resultado...</div>}

        {erro && (
          <div className="panel panel-content">
            <div className="error-banner is-visible">
              <i className="fa-solid fa-circle-exclamation" />
              <span>{erro}</span>
            </div>
          </div>
        )}

        {submissao && (
          <>
            <section className="panel panel--gradient dashboard-hero">
              <div className="score-ring">
                <svg viewBox="0 0 120 120">
                  <circle className="score-ring__bg" cx="60" cy="60" r="55" />
                  <circle
                    className="score-ring__fill"
                    cx="60"
                    cy="60"
                    r="55"
                    style={{
                      strokeDashoffset:
                        345.58 - (345.58 * Math.max(0, Math.min(100, submissao.pontuacao))) / 100,
                    }}
                  />
                </svg>
                <div className="score-ring__center">
                  <div className="score-ring__value">{submissao.pontuacao}</div>
                  <div className="score-ring__label">pontuação</div>
                </div>
              </div>
              <div>
                <h2 className="dashboard-hero__title">Relatório de perfil ético</h2>
                <p className="dashboard-hero__desc">
                  {relatorio
                    ? "Análise gerada automaticamente com base nas suas respostas."
                    : "O relatório ainda não está disponível para esta submissão."}
                </p>
              </div>
            </section>

            {relatorio && (
              <section className="panel panel-content">
                <div className="panel__header">
                  <span className="panel__title">Relatório gerado por IA</span>
                </div>
                <p style={{ whiteSpace: "pre-wrap", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
                  {relatorio.conteudo}
                </p>
              </section>
            )}

            {submissao.respostas && submissao.respostas.length > 0 && (
              <section className="panel panel-content">
                <div className="panel__header">
                  <span className="panel__title">Suas respostas</span>
                </div>
                <div className="insight-list">
                  {submissao.respostas.map((r) => (
                    <div key={r.resposta_id} className="nav-item" style={{ display: "block", padding: "14px 16px" }}>
                      {r.pergunta && (
                        <p style={{ color: "var(--color-text-strong)", fontWeight: 600, marginBottom: 4 }}>
                          {r.pergunta.pergunta}
                        </p>
                      )}
                      <p style={{ color: "var(--color-text-muted)" }}>{r.resposta}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
}
