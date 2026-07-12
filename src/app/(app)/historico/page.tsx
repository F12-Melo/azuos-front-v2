"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { listarSubmissoesUsuario, ApiRequestError } from "@/lib/api";
import type { Submissao } from "@/lib/types";

export default function HistoricoPage() {
  const { usuario } = useAuth();
  const [submissoes, setSubmissoes] = useState<Submissao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    listarSubmissoesUsuario(usuario.usuario_id)
      .then(setSubmissoes)
      .catch((err) =>
        setErro(err instanceof ApiRequestError ? err.message : "Não foi possível carregar seu histórico.")
      )
      .finally(() => setCarregando(false));
  }, [usuario]);

  return (
    <>
      <header className="topbar">
        <div className="topbar__left">
          <p className="topbar__eyebrow">Acompanhamento</p>
          <h1>Histórico</h1>
          <p>Suas avaliações enviadas e a pontuação de cada uma.</p>
        </div>
      </header>

      <main className="app-content">
        <section className="panel panel-content">
          {carregando && <p style={{ color: "var(--color-text-soft)" }}>Carregando...</p>}

          {erro && (
            <div className="error-banner is-visible">
              <i className="fa-solid fa-circle-exclamation" />
              <span>{erro}</span>
            </div>
          )}

          {!carregando && !erro && submissoes.length === 0 && (
            <p style={{ color: "var(--color-text-soft)" }}>
              Você ainda não enviou nenhuma avaliação.
            </p>
          )}

          <div className="insight-list">
            {submissoes.map((s) => (
              <Link
                key={s.submissao_id}
                href={`/resultado/${s.submissao_id}`}
                className="nav-item"
                style={{ justifyContent: "space-between", padding: "14px 16px" }}
              >
                <span>
                  <i className="fa-solid fa-clipboard-check" style={{ marginRight: 10 }} />
                  Avaliação #{s.submissao_id} · {s.data_fim}
                </span>
                <span className="chip chip--primary">{s.pontuacao} pts</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
