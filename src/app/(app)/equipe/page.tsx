"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  listarUsuarios,
  listarCargos,
  registrarUsuario,
  ApiRequestError,
} from "@/lib/api";
import type { Usuario, Cargo } from "@/lib/types";

export default function EquipePage() {
  const { usuario } = useAuth();
  const [membros, setMembros] = useState<Usuario[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [roleId, setRoleId] = useState("");

  const carregar = useCallback(() => {
    if (!usuario) return;
    setCarregando(true);
    listarUsuarios()
      .then((todos) =>
        setMembros(
          todos.filter(
            (u) =>
              u.usuario_id !== usuario.usuario_id &&
              (usuario.departamento_id == null || u.departamento_id === usuario.departamento_id)
          )
        )
      )
      .catch((err) =>
        setErro(err instanceof ApiRequestError ? err.message : "Não foi possível carregar a equipe.")
      )
      .finally(() => setCarregando(false));
  }, [usuario]);

  useEffect(() => {
    if (!usuario) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregar();
    listarCargos().then(setCargos).catch(() => setCargos([]));
  }, [usuario, carregar]);

  function nomeCargo(roleId: number) {
    return cargos.find((c) => c.cargo_id === roleId)?.nome ?? `Cargo #${roleId}`;
  }

  async function handleAdicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!roleId) {
      setErro("Selecione um cargo.");
      return;
    }
    setEnviando(true);
    setErro(null);
    try {
      await registrarUsuario({
        nome,
        cpf,
        email,
        senha,
        role_id: Number(roleId),
        departamento_id: usuario?.departamento_id ?? undefined,
        lider: false,
      });
      setNome("");
      setCpf("");
      setEmail("");
      setSenha("");
      setRoleId("");
      setMostrarForm(false);
      carregar();
    } catch (err) {
      setErro(err instanceof ApiRequestError ? err.message : "Não foi possível cadastrar o membro.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar__left">
          <p className="topbar__eyebrow">Liderança</p>
          <h1>Equipe</h1>
          <p>Pessoas do seu departamento cadastradas na plataforma.</p>
        </div>
        <div className="topbar__right">
          <button
            className="btn btn-primary btn--sm"
            type="button"
            onClick={() => setMostrarForm((v) => !v)}
          >
            <i className="fa-solid fa-user-plus" />
            {mostrarForm ? "Cancelar" : "Novo membro"}
          </button>
        </div>
      </header>

      <main className="app-content">
        {mostrarForm && (
          <section className="panel panel-content">
            <div className="panel__header">
              <span className="panel__title">Cadastrar novo membro</span>
            </div>
            <form className="team-form" onSubmit={handleAdicionar}>
              <div className="field">
                <label className="field__label" htmlFor="nomeMembro">Nome completo</label>
                <div className="input-shell">
                  <i className="fa-solid fa-user input-shell__icon" />
                  <input
                    className="input-shell__control"
                    id="nomeMembro"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="cpfMembro">CPF</label>
                <div className="input-shell">
                  <i className="fa-solid fa-id-card input-shell__icon" />
                  <input
                    className="input-shell__control"
                    id="cpfMembro"
                    required
                    maxLength={11}
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="emailMembro">Email</label>
                <div className="input-shell">
                  <i className="fa-solid fa-at input-shell__icon" />
                  <input
                    className="input-shell__control"
                    id="emailMembro"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="senhaMembro">Senha provisória</label>
                <div className="input-shell">
                  <i className="fa-solid fa-lock input-shell__icon" />
                  <input
                    className="input-shell__control"
                    id="senhaMembro"
                    type="password"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="cargoMembro">Cargo</label>
                <div className="input-shell">
                  <i className="fa-solid fa-briefcase input-shell__icon" />
                  <select
                    className="input-shell__control"
                    id="cargoMembro"
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                  >
                    <option value="">Selecione um cargo</option>
                    {cargos.map((c) => (
                      <option key={c.cargo_id} value={c.cargo_id}>{c.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              {erro && (
                <div className="error-banner is-visible">
                  <i className="fa-solid fa-circle-exclamation" />
                  <span>{erro}</span>
                </div>
              )}

              <button className="btn btn-primary" type="submit" disabled={enviando}>
                {enviando ? "Cadastrando..." : "Cadastrar membro"}
              </button>
            </form>
          </section>
        )}

        <section className="panel panel-content">
          <div className="panel__header">
            <span className="panel__title">Membros ({membros.length})</span>
          </div>

          {carregando && <p style={{ color: "var(--color-text-soft)" }}>Carregando...</p>}

          {!carregando && membros.length === 0 && (
            <div className="team-empty">
              Nenhum membro cadastrado no seu departamento ainda. Use o botão
              &quot;Novo membro&quot; para começar.
            </div>
          )}

          <div className="team-members">
            {membros.map((m) => (
              <article key={m.usuario_id} className="team-member-card">
                <div className="team-member-card__top">
                  <div>
                    <p className="team-member-card__name">{m.nome}</p>
                    <p className="team-member-card__meta">
                      {m.email} · {nomeCargo(m.role_id)}
                    </p>
                  </div>
                  <div className="team-member-card__status">
                    {m.lider && <span className="chip chip--primary">Líder</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
