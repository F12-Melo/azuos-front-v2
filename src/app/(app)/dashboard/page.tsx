"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  listarSubmissoesUsuario,
  buscarRelatorioPorSubmissao,
  listarUsuarios,
} from "@/lib/api";
import type { Submissao } from "@/lib/types";

const RING_CIRCUMFERENCE = 345.58;

export default function DashboardPage() {
  const { usuario } = useAuth();

  const [submissoes, setSubmissoes] = useState<Submissao[]>([]);
  const [pendentes, setPendentes] = useState(0);
  const [prontas, setProntas] = useState(0);
  const [ultimaPontuacao, setUltimaPontuacao] = useState<number | null>(null);
  const [equipeCount, setEquipeCount] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!usuario) return;

    async function carregar() {
      try {
        const lista = await listarSubmissoesUsuario(usuario!.usuario_id);
        setSubmissoes(lista);

        let pend = 0;
        let pront = 0;
        for (const s of lista) {
          try {
            await buscarRelatorioPorSubmissao(s.submissao_id);
            pront++;
          } catch {
            pend++;
          }
        }
        setPendentes(pend);
        setProntas(pront);

        if (lista.length > 0) {
          const ultima = [...lista].sort((a, b) => b.submissao_id - a.submissao_id)[0];
          setUltimaPontuacao(ultima.pontuacao);
        }

        if (usuario!.lider) {
          const todos = await listarUsuarios();
          setEquipeCount(
            todos.filter(
              (u) => u.departamento_id === usuario!.departamento_id && !u.lider
            ).length
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [usuario]);

  const pctRing = Math.max(0, Math.min(100, ultimaPontuacao ?? 0));
  const dashOffset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * pctRing) / 100;

  return (
    <>
      <header className="topbar">
        <div className="topbar__left">
          <p className="topbar__eyebrow">Painel operacional</p>
          <h1>Visão geral</h1>
          <p>{carregando ? "Carregando sessão..." : `Olá, ${usuario?.nome}`}</p>
        </div>
        <div className="topbar__right">
          <Link className="btn btn-primary btn--sm" href="/formulario">
            <i className="fa-solid fa-plus" />
            Novo formulário
          </Link>
        </div>
      </header>

      <main className="app-content">
        <section className="panel panel--gradient dashboard-hero fade-in">
          <div className="score-ring">
            <svg viewBox="0 0 120 120">
              <circle className="score-ring__bg" cx="60" cy="60" r="55" />
              <circle
                className="score-ring__fill"
                cx="60"
                cy="60"
                r="55"
                style={{ strokeDashoffset: dashOffset }}
              />
            </svg>
            <div className="score-ring__center">
              <div className="score-ring__value">{ultimaPontuacao ?? "--"}</div>
              <div className="score-ring__label">última análise</div>
            </div>
          </div>

          <div>
            <h2 className="dashboard-hero__title">
              {submissoes.length === 0
                ? "Aguardando seu primeiro envio"
                : `Você já enviou ${submissoes.length} avaliação(ões)`}
            </h2>
            <p className="dashboard-hero__desc">
              Este painel mostra indicadores reais assim que você responde
              formulários e recebe análises geradas pela IA.
            </p>
            <div className="dashboard-tags">
              <span className="chip chip--primary">
                <span className="chip__dot" />
                {usuario?.lider ? "Líder" : "Membro"}
              </span>
              {pendentes > 0 && (
                <span className="chip chip--warning">
                  <span className="chip__dot" />
                  {pendentes} pendente(s)
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <article className="panel stat-card fade-in">
            <div className="stat-card__icon stat-card__icon--accent">
              <i className="fa-solid fa-clipboard-list" />
            </div>
            <div>
              <div className="stat-card__value">{submissoes.length}</div>
              <div className="stat-card__label">Formulários enviados</div>
              <div className="stat-card__delta">
                {submissoes.length === 0 ? "Sem dados ainda" : "Atualizado"}
              </div>
            </div>
          </article>

          <article className="panel stat-card fade-in">
            <div className="stat-card__icon stat-card__icon--primary">
              <i className="fa-solid fa-hourglass-half" />
            </div>
            <div>
              <div className="stat-card__value">{pendentes}</div>
              <div className="stat-card__label">Análises pendentes</div>
              <div className="stat-card__delta">Aguardando processamento</div>
            </div>
          </article>

          <article className="panel stat-card fade-in">
            <div className="stat-card__icon stat-card__icon--success">
              <i className="fa-solid fa-file-circle-check" />
            </div>
            <div>
              <div className="stat-card__value">{prontas}</div>
              <div className="stat-card__label">Análises prontas</div>
              <div className="stat-card__delta">
                {prontas === 0 ? "Sem relatórios liberados" : "Relatórios liberados"}
              </div>
            </div>
          </article>

          {usuario?.lider && (
            <article className="panel stat-card fade-in">
              <div className="stat-card__icon stat-card__icon--purple">
                <i className="fa-solid fa-users" />
              </div>
              <div>
                <div className="stat-card__value">{equipeCount}</div>
                <div className="stat-card__label">Equipe cadastrada</div>
                <div className="stat-card__delta">
                  {equipeCount === 0 ? "Cadastre pessoas para iniciar" : "No seu departamento"}
                </div>
              </div>
            </article>
          )}
        </section>

        <section className="dashboard-grid-3 fade-in">
          <article className="panel panel-content">
            <div className="panel__header">
              <span className="panel__title">Últimos envios</span>
              <Link className="panel__link" href="/historico">Ver histórico →</Link>
            </div>
            {submissoes.length === 0 ? (
              <p style={{ color: "var(--color-text-soft)", fontSize: "0.85rem" }}>
                Você ainda não enviou nenhuma avaliação.
              </p>
            ) : (
              <div className="insight-list">
                {submissoes.slice(0, 5).map((s) => (
                  <Link
                    key={s.submissao_id}
                    href={`/resultado/${s.submissao_id}`}
                    className="nav-item"
                    style={{ justifyContent: "space-between" }}
                  >
                    <span>Avaliação #{s.submissao_id}</span>
                    <span>{s.pontuacao} pts</span>
                  </Link>
                ))}
              </div>
            )}
          </article>

          <article className="panel panel-content">
            <div className="panel__header">
              <span className="panel__title">Status da análise</span>
              <Link className="panel__link" href="/historico">Ver detalhes →</Link>
            </div>
            <div className="insight-list">
              <div className="nav-item" style={{ justifyContent: "space-between" }}>
                <span>Prontas</span>
                <span className="chip chip--success">{prontas}</span>
              </div>
              <div className="nav-item" style={{ justifyContent: "space-between" }}>
                <span>Pendentes</span>
                <span className="chip chip--warning">{pendentes}</span>
              </div>
            </div>
          </article>
        </section>

        {usuario?.lider && (
          <section className="dashboard-grid-2 fade-in">
            <article className="panel panel-content">
              <div className="panel__header">
                <span className="panel__title">Equipe e acesso</span>
                <Link className="panel__link" href="/equipe">Abrir equipe →</Link>
              </div>
              <p style={{ color: "var(--color-text-soft)", fontSize: "0.85rem" }}>
                {equipeCount} pessoa(s) no seu departamento.
              </p>
            </article>

            <article className="panel panel-content">
              <div className="panel__header">
                <span className="panel__title">Próximos passos</span>
              </div>
              <div className="next-actions">
                <Link href="/trilhas" className="nav-item">
                  <i className="fa-solid fa-graduation-cap" />
                  <span>Revisar trilhas de capacitação</span>
                </Link>
                <Link href="/equipe" className="nav-item">
                  <i className="fa-solid fa-user-plus" />
                  <span>Cadastrar novo membro</span>
                </Link>
              </div>
            </article>
          </section>
        )}
      </main>
    </>
  );
}
