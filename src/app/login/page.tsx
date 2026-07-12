"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  login,
  registrarUsuario,
  listarUsuarios,
  listarCargos,
  listarDepartamentos,
  criarCargo,
  criarDepartamento,
  ApiRequestError,
} from "@/lib/api";
import type { Cargo, Departamento } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

type Modo = "carregando" | "login" | "bootstrap" | "registro";

export default function LoginPage() {
  const { setUsuario } = useAuth();
  const router = useRouter();

  const [modo, setModo] = useState<Modo>("carregando");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  // login
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // registro / bootstrap
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [emailRegistro, setEmailRegistro] = useState("");
  const [senhaRegistro, setSenhaRegistro] = useState("");
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [departamentoId, setDepartamentoId] = useState("");
  const [novoDepartamento, setNovoDepartamento] = useState("");

  useEffect(() => {
    listarUsuarios()
      .then((usuarios) => setModo(usuarios.length === 0 ? "bootstrap" : "login"))
      .catch(() => setModo("login"));
  }, []);

  useEffect(() => {
    if (modo === "bootstrap" || modo === "registro") {
      listarCargos().then(setCargos).catch(() => setCargos([]));
      listarDepartamentos().then(setDepartamentos).catch(() => setDepartamentos([]));
    }
  }, [modo]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const { usuario } = await login(email, senha);
      setUsuario(usuario);
      router.push("/dashboard");
    } catch (err) {
      setErro(
        err instanceof ApiRequestError
          ? err.message
          : "Não foi possível conectar à API. Verifique se ela está rodando."
      );
    } finally {
      setCarregando(false);
    }
  }

  async function handleCriarDepartamentoRapido() {
    if (!novoDepartamento.trim()) return;
    try {
      const dep = await criarDepartamento(novoDepartamento.trim());
      setDepartamentos((prev) => [...prev, dep]);
      setDepartamentoId(String(dep.departamento_id));
      setNovoDepartamento("");
    } catch (err) {
      setErro(err instanceof ApiRequestError ? err.message : "Erro ao criar departamento.");
    }
  }

  async function handleRegistro(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      // O cargo não é mais escolhido pelo usuário no cadastro: usamos o
      // primeiro cargo já existente ou criamos um automaticamente.
      let cargoId = cargos[0]?.cargo_id;
      if (!cargoId) {
        const novoCargo = await criarCargo(1);
        cargoId = novoCargo.cargo_id;
        setCargos((prev) => [...prev, novoCargo]);
      }

      const usuario = await registrarUsuario({
        nome,
        cpf,
        email: emailRegistro,
        senha: senhaRegistro,
        role_id: cargoId,
        departamento_id: departamentoId ? Number(departamentoId) : undefined,
        lider: modo === "bootstrap" ? true : false,
      });
      setUsuario(usuario);
      router.push("/dashboard");
    } catch (err) {
      setErro(
        err instanceof ApiRequestError
          ? err.message
          : "Não foi possível conectar à API. Verifique se ela está rodando."
      );
    } finally {
      setCarregando(false);
    }
  }

  const ehFormularioRegistro = modo === "bootstrap" || modo === "registro";

  return (
    <div className="login-body">
      <main className="login-layout">
        <section className="login-layout__panel">
          <div className="login-layout__brand">
            <Link className="brand" href="/">
              <img src="/icon.png" alt="Azuos" />
              <span className="brand__text">
                Plataforma <span>Azuos</span>
              </span>
            </Link>
          </div>

          <div className="login-layout__panel-content">
            <p className="section-kicker">Fluxo operacional</p>
            <h1 className="login-layout__panel-title">
              Líderes cadastram equipes.
              <br />
              Equipes respondem <span>formulários</span>.
            </h1>
            <p className="login-layout__panel-desc">
              A plataforma envia tudo para o servidor, guarda cadastros reais
              e devolve relatórios de perfil ético gerados por IA.
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-item__icon">
                  <i className="fa-solid fa-user-tie" />
                </div>
                <span>Primeiro acesso cria a liderança inicial da plataforma</span>
              </div>
              <div className="feature-item">
                <div className="feature-item__icon">
                  <i className="fa-solid fa-users" />
                </div>
                <span>Cadastro real de funcionários pela página de equipe</span>
              </div>
              <div className="feature-item">
                <div className="feature-item__icon">
                  <i className="fa-solid fa-clipboard-list" />
                </div>
                <span>Formulários enviados ao backend com pontuação automática</span>
              </div>
              <div className="feature-item">
                <div className="feature-item__icon">
                  <i className="fa-solid fa-robot" />
                </div>
                <span>Histórico e ranking usam a análise devolvida pela IA</span>
              </div>
            </div>
          </div>

          <div className="login-layout__panel-footer">
            &copy; <span>{new Date().getFullYear()}</span> Plataforma Azuos
          </div>
        </section>

        <section className="login-layout__form-side">
          <div className="login-card">
            {modo === "carregando" && (
              <p style={{ color: "var(--color-text-soft)" }}>Carregando...</p>
            )}

            {modo === "bootstrap" && (
              <div className="empty-banner">
                Nenhuma liderança foi criada ainda. Preencha o formulário abaixo
                para iniciar a base da sua empresa.
              </div>
            )}

            {modo === "login" && (
              <>
                <div className="login-card__header">
                  <p className="section-kicker">Acesso</p>
                  <h2 className="login-card__title">Entrar na conta</h2>
                  <p className="login-card__desc">
                    Informe suas credenciais para acessar a plataforma.
                  </p>
                </div>

                <form className="login-form" onSubmit={handleLogin} noValidate>
                  <div className="field">
                    <label className="field__label" htmlFor="email">
                      Email
                    </label>
                    <div className="input-shell">
                      <i className="fa-solid fa-user input-shell__icon" />
                      <input
                        className="input-shell__control"
                        id="email"
                        type="email"
                        placeholder="voce@email.com"
                        autoComplete="username"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="password">
                      Senha
                    </label>
                    <div className="input-shell">
                      <i className="fa-solid fa-lock input-shell__icon" />
                      <input
                        className="input-shell__control"
                        id="password"
                        type={mostrarSenha ? "text" : "password"}
                        placeholder="Sua senha"
                        autoComplete="current-password"
                        required
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                      />
                      <button
                        className="password-toggle"
                        type="button"
                        aria-label="Mostrar ou esconder senha"
                        onClick={() => setMostrarSenha((v) => !v)}
                      >
                        <i className={`fa-solid ${mostrarSenha ? "fa-eye-slash" : "fa-eye"}`} />
                      </button>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn--block submit-btn"
                    type="submit"
                    disabled={carregando}
                  >
                    <span>{carregando ? "ENTRANDO..." : "ENTRAR"}</span>
                    <i className="fa-solid fa-arrow-right" />
                  </button>
                </form>

                <p style={{ marginTop: 16, fontSize: "0.82rem", color: "var(--color-text-soft)" }}>
                  Ainda não tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => setModo("registro")}
                    style={{ color: "var(--color-primary)", textDecoration: "underline", background: "none", border: 0, cursor: "pointer" }}
                  >
                    Criar conta
                  </button>
                </p>
              </>
            )}

            {ehFormularioRegistro && (
              <>
                <div className="login-card__header">
                  <p className="section-kicker">
                    {modo === "bootstrap" ? "Configuração inicial" : "Nova conta"}
                  </p>
                  <h2 className="login-card__title">
                    {modo === "bootstrap" ? "Criar liderança" : "Criar conta"}
                  </h2>
                  <p className="login-card__desc">
                    {modo === "bootstrap"
                      ? "Esse será o primeiro acesso administrador da plataforma."
                      : "Cadastre-se para iniciar sua avaliação de perfil ético."}
                  </p>
                </div>

                <form className="login-form" onSubmit={handleRegistro} noValidate>
                  <div className="field">
                    <label className="field__label" htmlFor="nome">Nome completo</label>
                    <div className="input-shell">
                      <i className="fa-solid fa-user-tie input-shell__icon" />
                      <input
                        className="input-shell__control"
                        id="nome"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="cpf">CPF (apenas números)</label>
                    <div className="input-shell">
                      <i className="fa-solid fa-id-card input-shell__icon" />
                      <input
                        className="input-shell__control"
                        id="cpf"
                        required
                        maxLength={11}
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="emailRegistro">Email</label>
                    <div className="input-shell">
                      <i className="fa-solid fa-at input-shell__icon" />
                      <input
                        className="input-shell__control"
                        id="emailRegistro"
                        type="email"
                        required
                        value={emailRegistro}
                        onChange={(e) => setEmailRegistro(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="senhaRegistro">Senha</label>
                    <div className="input-shell">
                      <i className="fa-solid fa-lock input-shell__icon" />
                      <input
                        className="input-shell__control"
                        id="senhaRegistro"
                        type="password"
                        required
                        value={senhaRegistro}
                        onChange={(e) => setSenhaRegistro(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="departamento">
                      Departamento (opcional)
                    </label>
                    <div className="input-shell">
                      <i className="fa-solid fa-building input-shell__icon" />
                      <select
                        className="input-shell__control"
                        id="departamento"
                        value={departamentoId}
                        onChange={(e) => setDepartamentoId(e.target.value)}
                      >
                        <option value="">Nenhum</option>
                        {departamentos.map((d) => (
                          <option key={d.departamento_id} value={d.departamento_id}>
                            {d.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="quick-add">
                      <input
                        className="input-shell__control quick-add__input"
                        placeholder="Ou crie um departamento novo"
                        value={novoDepartamento}
                        onChange={(e) => setNovoDepartamento(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary btn--sm"
                        onClick={handleCriarDepartamentoRapido}
                      >
                        Criar
                      </button>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn--block submit-btn"
                    type="submit"
                    disabled={carregando}
                  >
                    <span>
                      {carregando
                        ? "Enviando..."
                        : modo === "bootstrap"
                        ? "CRIAR LIDERANÇA"
                        : "CRIAR CONTA"}
                    </span>
                    <i className="fa-solid fa-arrow-right" />
                  </button>
                </form>

                {modo === "registro" && (
                  <p style={{ marginTop: 16, fontSize: "0.82rem", color: "var(--color-text-soft)" }}>
                    Já tem conta?{" "}
                    <button
                      type="button"
                      onClick={() => setModo("login")}
                      style={{ color: "var(--color-primary)", textDecoration: "underline", background: "none", border: 0, cursor: "pointer" }}
                    >
                      Entrar
                    </button>
                  </p>
                )}
              </>
            )}

            {erro && (
              <div className="error-banner is-visible">
                <i className="fa-solid fa-circle-exclamation" />
                <span>{erro}</span>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
