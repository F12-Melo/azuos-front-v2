"use client";

import { rankingMock } from "@/lib/mockData";

export default function RankingPage() {
  const podio = rankingMock.slice(0, 3);
  const resto = rankingMock.slice(3);

  return (
    <>
      <header className="topbar">
        <div className="topbar__left">
          <p className="topbar__eyebrow">Comparativo</p>
          <h1>Ranking</h1>
          <p>Dados ilustrativos — em breve calculados a partir das submissões reais.</p>
        </div>
      </header>

      <main className="app-content">
        <section className="panel panel-content podium-card">
          <p className="panel__title podium-title">Top 3</p>
          <div className="podium-wrap">
            {podio.map((p) => (
              <div key={p.posicao} className="podium-item">
                <div className="podium-avatar">{p.nome.charAt(0)}</div>
                <span className="podium-medal">{p.posicao}º</span>
                <p className="podium-name">{p.nome}</p>
                <p className="podium-score">{p.pontuacao} pts</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel panel-content">
          <div className="panel__header">
            <span className="panel__title">Classificação geral</span>
            <span className="chip chip--glass">
              <span className="chip__dot" />
              Dados mockados
            </span>
          </div>

          <div className="insight-list">
            {resto.map((p) => (
              <div key={p.posicao} className="nav-item" style={{ justifyContent: "space-between", padding: "14px 16px" }}>
                <span className="employee-info">
                  <span className="rank-number">{p.posicao}º</span>
                  <span>
                    <span className="employee-name">{p.nome}</span>
                    <span className="employee-dept"> · {p.departamento}</span>
                  </span>
                </span>
                <span className="score-value">{p.pontuacao} pts</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
