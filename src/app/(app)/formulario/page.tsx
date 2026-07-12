"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  buscarFormularioPorCargo,
  enviarSubmissao,
  ApiRequestError,
} from "@/lib/api";
import type { Formulario, RespostaEnvio } from "@/lib/types";

export default function FormularioPage() {
  const { usuario } = useAuth();
  const router = useRouter();

  const [formulario, setFormulario] = useState<Formulario | null>(null);
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    buscarFormularioPorCargo(usuario.role_id)
      .then((formularios) => {
        if (formularios.length === 0) {
          setErro("Nenhum formulário foi encontrado para o seu cargo ainda.");
          return;
        }
        setFormulario(formularios[0]);
      })
      .catch((err) =>
        setErro(err instanceof ApiRequestError ? err.message : "Não foi possível carregar o formulário.")
      )
      .finally(() => setCarregando(false));
  }, [usuario]);

  function handleChange(perguntaId: number, valor: string) {
    setRespostas((prev) => ({ ...prev, [perguntaId]: valor }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formulario || !usuario) return;

    setEnviando(true);
    setErro(null);
    try {
      const payload: RespostaEnvio[] = (formulario.perguntas ?? []).map((p) => ({
        pergunta_id: p.pergunta_id,
        resposta: respostas[p.pergunta_id] ?? "",
      }));

      const resultado = await enviarSubmissao({
        usuario_id: usuario.usuario_id,
        formulario_id: formulario.formulario_id,
        respostas: payload,
      });

      router.push(`/resultado/${resultado.submissao_id}`);
    } catch (err) {
      setErro(
        err instanceof ApiRequestError ? err.message : "Não foi possível enviar sua avaliação."
      );
      setEnviando(false);
    }
  }

  const perguntas = formulario?.perguntas ?? [];
  const todasRespondidas =
    perguntas.length > 0 &&
    perguntas.every((p) => (respostas[p.pergunta_id] ?? "").trim().length > 0);

  return (
    <>
      <header className="topbar">
        <div className="topbar__left">
          <p className="topbar__eyebrow">Avaliação</p>
          <h1>{formulario?.titulo ?? "Formulário"}</h1>
          <p>Responda com sinceridade — não existem respostas certas ou erradas.</p>
        </div>
      </header>

      <main className="app-content">
        {carregando && (
          <div className="panel panel-content">Carregando formulário...</div>
        )}

        {!carregando && erro && !formulario && (
          <div className="panel panel-content">
            <p style={{ color: "var(--color-text-muted)" }}>{erro}</p>
          </div>
        )}

        {formulario && (
          <form onSubmit={handleSubmit} className="form-steps">
            {perguntas.map((pergunta, i) => (
              <article key={pergunta.pergunta_id} className="panel panel-content form-question">
                <label className="field__label" htmlFor={`pergunta-${pergunta.pergunta_id}`}>
                  <span style={{ color: "var(--color-primary)", marginRight: 8 }}>{i + 1}.</span>
                  {pergunta.pergunta}
                </label>
                <textarea
                  id={`pergunta-${pergunta.pergunta_id}`}
                  className="form-textarea"
                  required
                  rows={3}
                  value={respostas[pergunta.pergunta_id] ?? ""}
                  onChange={(e) => handleChange(pergunta.pergunta_id, e.target.value)}
                  placeholder="Escreva sua resposta..."
                />
              </article>
            ))}

            {erro && (
              <div className="error-banner is-visible">
                <i className="fa-solid fa-circle-exclamation" />
                <span>{erro}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn--block"
              disabled={enviando || !todasRespondidas}
            >
              {enviando ? "Enviando respostas..." : "Enviar avaliação"}
            </button>
          </form>
        )}
      </main>
    </>
  );
}
