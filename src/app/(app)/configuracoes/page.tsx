"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ApiRequestError } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export default function ConfiguracoesPage() {
  const { usuario, setUsuario } = useAuth();
  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  const [senha, setSenha] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario) return;
    setSalvando(true);
    setErro(null);
    setSucesso(false);
    try {
      const res = await fetch(`${API_URL}/usuarios/${usuario.usuario_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          ...(senha ? { senha } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new ApiRequestError(data?.error ?? "Erro ao salvar", res.status);
      setUsuario({ ...usuario, nome, email });
      setSenha("");
      setSucesso(true);
    } catch (err) {
      setErro(err instanceof ApiRequestError ? err.message : "Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar__left">
          <p className="topbar__eyebrow">Conta</p>
          <h1>Configurações</h1>
          <p>Atualize seus dados de acesso.</p>
        </div>
      </header>

      <main className="app-content">
        <section className="panel panel-content" style={{ maxWidth: 480 }}>
          <div className="panel__header">
            <span className="panel__title">Perfil</span>
          </div>

          <form className="team-form" onSubmit={handleSalvar}>
            <div className="field">
              <label className="field__label" htmlFor="nomeConfig">Nome</label>
              <div className="input-shell">
                <i className="fa-solid fa-user input-shell__icon" />
                <input
                  className="input-shell__control"
                  id="nomeConfig"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="emailConfig">Email</label>
              <div className="input-shell">
                <i className="fa-solid fa-at input-shell__icon" />
                <input
                  className="input-shell__control"
                  id="emailConfig"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="senhaConfig">Nova senha (opcional)</label>
              <div className="input-shell">
                <i className="fa-solid fa-lock input-shell__icon" />
                <input
                  className="input-shell__control"
                  id="senhaConfig"
                  type="password"
                  placeholder="Deixe em branco para manter"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
            </div>

            {erro && (
              <div className="error-banner is-visible">
                <i className="fa-solid fa-circle-exclamation" />
                <span>{erro}</span>
              </div>
            )}

            {sucesso && (
              <div className="chip chip--success">
                <span className="chip__dot" />
                Alterações salvas
              </div>
            )}

            <button className="btn btn-primary" type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
