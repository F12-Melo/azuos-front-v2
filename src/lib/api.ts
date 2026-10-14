import type {
  Cargo,
  Departamento,
  Usuario,
  Formulario,
  Pergunta,
  Submissao,
  RespostaEnvio,
  Relatorio,
} from "./types";

const API_URL = process.env.API_AZUOS ?? "https://web-production-e3348.up.railway.app/api";

export class ApiRequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  } catch {
    // O fetch nem chegou a completar: normalmente é a API fora do ar,
    // endereço errado no NEXT_PUBLIC_API_URL, ou CORS bloqueando a
    // requisição no navegador (nesse caso o Chrome/Firefox mostram o
    // motivo real no console, mas não repassam pro JS por segurança).
    throw new ApiRequestError(
      "Não foi possível conectar à API. Verifique se ela está rodando em " +
        API_URL +
        " e se o CORS está liberado para este endereço.",
      0
    );
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message =
      body?.error ||
      (isJson
        ? `Erro ${res.status} ao chamar ${path}`
        : `Erro ${res.status} ao chamar ${path} (a API respondeu algo que não é JSON — provável erro 500 no servidor; veja o terminal do Flask para o traceback completo).`);
    throw new ApiRequestError(message, res.status);
  }

  return body as T;
}

// ---------- Auth ----------
export function login(email: string, senha: string) {
  return request<{ message: string; usuario: Usuario }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
}

export function registrarUsuario(payload: {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  role_id: number;
  departamento_id?: number;
  lider?: boolean;
}) {
  return request<Usuario>("/usuarios", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listarUsuarios() {
  return request<Usuario[]>("/usuarios");
}

export function buscarUsuario(id: number) {
  return request<Usuario>(`/usuarios/${id}`);
}

// ---------- Cargos ----------
export function listarCargos() {
  return request<Cargo[]>("/cargos");
}

export function criarCargo(nome: number | string) {
  return request<Cargo>("/cargos", {
    method: "POST",
    body: JSON.stringify({ nome }),
  });
}

// ---------- Departamentos ----------
export function listarDepartamentos() {
  return request<Departamento[]>("/departamentos");
}

export function criarDepartamento(nome: string) {
  return request<Departamento>("/departamentos", {
    method: "POST",
    body: JSON.stringify({ nome }),
  });
}

// ---------- Formulários & Perguntas ----------
export function buscarFormulario(id: number) {
  return request<Formulario>(`/formularios/${id}`);
}

export function buscarFormularioPorCargo(roleId: number) {
  return request<Formulario[]>(`/formularios/por-cargo/${roleId}`);
}

export function criarFormulario(titulo: string, role_id: number) {
  return request<Formulario>("/formularios", {
    method: "POST",
    body: JSON.stringify({ titulo, role_id }),
  });
}

export function criarPergunta(payload: {
  pergunta: string;
  formulario_id: number;
  pontuacao?: number;
}) {
  return request<Pergunta>("/perguntas", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---------- Submissões ----------
export function enviarSubmissao(payload: {
  usuario_id: number;
  formulario_id: number;
  respostas: RespostaEnvio[];
}) {
  return request<Submissao & { relatorio?: Relatorio }>("/submissoes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function buscarSubmissao(id: number) {
  return request<Submissao>(`/submissoes/${id}`);
}

export function listarSubmissoesUsuario(usuarioId: number) {
  return request<Submissao[]>(`/submissoes/usuario/${usuarioId}`);
}

// ---------- Relatórios ----------
export function buscarRelatorioPorSubmissao(submissaoId: number) {
  return request<Relatorio>(`/relatorios/submissao/${submissaoId}`);
}
