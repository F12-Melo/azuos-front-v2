"use client";

import Link from "next/link";
import { useState } from "react";

const TEAM = [
  "Gabriel Toledo",
  "João V. Demarchi",
  "Mathias Basílio",
  "Nicolas Esteves",
  "Thiago Tesch",
];

export default function LandingPage() {
  const [navAberto, setNavAberto] = useState(false);

  return (
    <div className="home-body" data-page-type="landing">
      <header className="site-header">
        <div className="container site-header__inner">
          <a className="brand" href="#hero">
            <img src="/icon.png" alt="Azuos" />
            <span className="brand__text">
              Plataforma <span>Azuos</span>
            </span>
          </a>

          <nav className={`site-nav${navAberto ? " is-open" : ""}`} aria-label="Principal">
            <a href="#quem-somos" onClick={() => setNavAberto(false)}>Quem somos</a>
            <a href="#servicos" onClick={() => setNavAberto(false)}>Serviços</a>
            <a href="#como-funciona" onClick={() => setNavAberto(false)}>Como funciona</a>
            <a href="#contato" onClick={() => setNavAberto(false)}>Contato</a>
          </nav>

          <div className="site-header__actions">
            <button
              className="site-nav-toggle"
              type="button"
              aria-label="Abrir menu"
              onClick={() => setNavAberto((v) => !v)}
            >
              <i className="fa-solid fa-bars" />
            </button>
            <Link className="btn btn-secondary btn--sm" href="/login">
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="hero">
          <div className="container hero__content">
            <p className="hero__eyebrow">Compliance · Ética · Liderança</p>
            <h1 className="hero__title">AZUOS</h1>
            <p className="hero__subtitle">
              Capacitação de líderes éticos contra o capacitismo nas empresas.
            </p>

            <div className="hero__chips">
              <span className="chip chip--glass">
                <span className="chip__dot" />Análise de compliance
              </span>
              <span className="chip chip--accent">
                <span className="chip__dot" />Diagnóstico por IA
              </span>
              <span className="chip chip--primary">
                <span className="chip__dot" />Trilha de capacitação
              </span>
            </div>

            <div className="hero__actions">
              <Link className="btn btn-primary" href="/login">
                Acessar plataforma
              </Link>
              <a className="btn btn-secondary" href="#quem-somos">
                Saiba mais
              </a>
            </div>
          </div>
        </section>

        <section className="stats-strip">
          <div className="container stats-strip__grid">
            <article className="stat-item">
              <strong className="stat-number">50+</strong>
              <span className="stat-label">Usuários atingidos</span>
            </article>
            <article className="stat-item">
              <strong className="stat-number">5</strong>
              <span className="stat-label">Programadores</span>
            </article>
            <article className="stat-item">
              <strong className="stat-number">1</strong>
              <span className="stat-label">Plataforma integrada</span>
            </article>
            <article className="stat-item">
              <strong className="stat-number">100%</strong>
              <span className="stat-label">Foco em produtividade</span>
            </article>
          </div>
        </section>

        <section className="page-section" id="quem-somos">
          <div className="container about-grid">
            <div>
              <p className="section-kicker">Nossa história</p>
              <h2 className="section-title">Quem somos?</h2>
              <p className="section-desc section-desc--spaced">
                Somos um grupo de estudantes do Ensino Médio Técnico em
                Desenvolvimento de Sistemas, com o objetivo de melhorar o
                ambiente de trabalho por meio de tecnologia, ética e inclusão.
              </p>
              <p className="section-desc">
                Em 2025, participamos de uma competição para criar uma solução
                envolvendo IA e ética. Foi assim que nasceu a{" "}
                <strong>Azuos</strong>: uma plataforma pensada para combater o
                capacitismo dentro das empresas.
              </p>
            </div>

            <article className="panel panel--glass about-card">
              <p className="section-kicker">Time Azuos</p>
              <p className="about-card__meta">
                Estudantes e orientadoras em uma mesma construção.
              </p>
              <div className="team-grid">
                {TEAM.map((nome) => (
                  <span key={nome} className="team-chip">
                    {nome}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="page-section" id="servicos">
          <div className="container">
            <div className="services-header">
              <p className="section-kicker">O que oferecemos</p>
              <h2 className="section-title">Nossos serviços</h2>
              <p className="section-desc">
                Uma plataforma completa para diagnóstico, capacitação e
                acompanhamento de líderes e liderados.
              </p>
            </div>

            <div className="services-grid">
              <article className="panel panel--glass service-card">
                <div className="service-card__icon service-card__icon--accent">
                  <i className="fa-solid fa-clipboard-list" />
                </div>
                <h3 className="service-card__title">Formulário de diagnóstico</h3>
                <p className="service-card__desc">
                  Perguntas elaboradas para avaliar atitudes, linguagem e
                  tomada de decisão em relação à inclusão e ao capacitismo.
                </p>
                <span className="badge badge--accent service-card__badge">Líderes</span>
              </article>

              <article className="panel panel--glass service-card">
                <div className="service-card__icon service-card__icon--primary">
                  <i className="fa-solid fa-robot" />
                </div>
                <h3 className="service-card__title">Relatório por IA</h3>
                <p className="service-card__desc">
                  Análise inteligente das respostas com sugestões práticas,
                  pontos de atenção e recomendações alinhadas ao perfil da
                  liderança.
                </p>
                <span className="badge badge--primary service-card__badge">Automatizado</span>
              </article>

              <article className="panel panel--glass service-card">
                <div className="service-card__icon service-card__icon--dark">
                  <i className="fa-solid fa-chart-line" />
                </div>
                <h3 className="service-card__title">Histórico e evolução</h3>
                <p className="service-card__desc">
                  Acompanhe relatórios anteriores, compare resultados e
                  observe o crescimento ao longo do tempo com mais clareza.
                </p>
                <span className="badge badge--success service-card__badge">Acompanhamento</span>
              </article>
            </div>
          </div>
        </section>

        <section className="page-section" id="como-funciona">
          <div className="container">
            <div className="flow-header">
              <p className="section-kicker">Fluxo da plataforma</p>
              <h2 className="section-title">Como funciona?</h2>
              <p className="section-desc">
                Três perfis de usuário, um objetivo em comum: lideranças mais
                éticas, inclusivas e preparadas.
              </p>
            </div>

            <div className="flow-grid">
              <article className="panel panel--glass flow-step">
                <div className="flow-step__number flow-step__number--accent">A</div>
                <h3 className="flow-step__title">Administrador</h3>
                <p className="flow-step__desc">
                  Configura a plataforma, acompanha métricas gerais e organiza
                  a jornada da empresa.
                </p>
              </article>

              <article className="panel panel--glass flow-step">
                <div className="flow-step__number">G</div>
                <h3 className="flow-step__title">Gerentes</h3>
                <p className="flow-step__desc">
                  Respondem diagnósticos, recebem trilhas personalizadas e
                  acompanham a própria evolução.
                </p>
              </article>

              <article className="panel panel--glass flow-step">
                <div className="flow-step__number flow-step__number--dark">F</div>
                <h3 className="flow-step__title">Funcionários</h3>
                <p className="flow-step__desc">
                  Participam da avaliação e ajudam a tornar o ambiente mais
                  acessível, ético e acolhedor.
                </p>
              </article>

              <article className="panel panel--glass flow-step">
                <div className="flow-step__number flow-step__number--soft">IA</div>
                <h3 className="flow-step__title">Inteligência artificial</h3>
                <p className="flow-step__desc">
                  Conecta respostas, identifica padrões e apoia a criação de
                  ações práticas para capacitação.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="page-section" id="contato">
          <div className="container">
            <article className="panel panel--gradient contact-card">
              <p className="section-kicker">Entre em contato</p>
              <h2 className="section-title">Pronto para começar?</h2>
              <p className="section-desc section-desc--centered">
                Acesse a plataforma e dê o primeiro passo para uma liderança
                mais ética, inclusiva e preparada.
              </p>

              <Link className="btn btn-primary" href="/login">
                Quero conhecer
              </Link>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <a className="brand brand--compact" href="#hero">
            <img src="/icon.png" alt="Azuos" />
            <span className="brand__text">
              Plataforma <span>Azuos</span>
            </span>
          </a>

          <nav className="site-footer__links" aria-label="Rodapé">
            <a href="#quem-somos">Quem somos</a>
            <a href="#servicos">Serviços</a>
            <a href="#como-funciona">Como funciona</a>
            <Link href="/login">Login</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
