"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { listarSubmissoesUsuario, buscarRelatorioPorSubmissao } from "@/lib/api";
import type { Submissao, Relatorio } from "@/lib/types";

interface Item {
  submissao: Submissao;
  relatorio: Relatorio | null;
}

export default function RelatoriosPage() {
  const { usuario } = useAuth();
  const [itens, setItens] = useState<Item[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!usuario) return;
    listarSubmissoesUsuario(usuario.usuario_id)
      .then(async (submissoes) => {
        const resultado = await Promise.all(
          submissoes.map(async (submissao) => {
            const relatorio = await buscarRelatorioPorSubmissao(submissao.submissao_id).catch(() => null);
            return { submissao, relatorio };
          })
        );
        setItens(resultado);
      })
      .finally(() => setCarregando(false));
  }, [usuario]);

  return (
    <>
      <header className="topbar">
        <div className="topbar__left">
          <p className="topbar__eyebrow">Análises</p>
          <h1>Relatórios</h1>
          <p>Relatórios de perfil ético gerados pela IA para cada avaliação sua.</p>
        </div>
      </header>

      <main className="app-content">
        {carregando && <div className="panel panel-content">Carregando relatórios...</div>}

        {!carregando && itens.length === 0 && (
          <div className="panel panel-content">
            <p style={{ color: "var(--color-text-soft)" }}>
              Nenhum relatório disponível ainda. Responda um formulário para gerar o primeiro.
            </p>
          </div>
        )}

        {itens.map(({ submissao, relatorio }) => (
          <section key={submissao.submissao_id} className="panel panel-content">
            <div className="panel__header">
              <span className="panel__title">Avaliação #{submissao.submissao_id}</span>
              <Link className="panel__link" href={`/resultado/${submissao.submissao_id}`}>
                Ver completo →
              </Link>
            </div>
            {relatorio ? (
              <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>
                {relatorio.conteudo.slice(0, 260)}
                {relatorio.conteudo.length > 260 ? "…" : ""}
              </p>
            ) : (
              <span className="chip chip--warning">
                <span className="chip__dot" />
                Relatório ainda em processamento
              </span>
            )}
          </section>
        ))}
      </main>
    </>
  );
}
