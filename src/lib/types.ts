// Tipos baseados no API_DOCS.md e na postman_collection.json do backend AzuOS.
// ⚠️ Os nomes exatos dos campos de ID (ex: "cargo_id" vs "id") não estavam
// visíveis nos arquivos de models (só os nomes dos arquivos). Ajuste aqui
// caso o to_dict() do backend use nomes diferentes dos assumidos abaixo.

export interface Cargo {
  cargo_id: number;
  nome: number | string; // docs indicam que "nome" do cargo é numérico no banco atual
}

export interface Departamento {
  departamento_id: number;
  nome: string;
}

export interface Usuario {
  usuario_id: number;
  nome: string;
  cpf: string;
  email: string;
  role_id: number;
  lider: boolean;
  departamento_id?: number | null;
  // "senha" nunca deve vir do backend, mas o campo existe no POST
}

export interface Pergunta {
  pergunta_id: number;
  pergunta: string;
  formulario_id: number;
  pontuacao?: number | null;
}

export interface Formulario {
  formulario_id: number;
  titulo: string;
  role_id: number;
  perguntas?: Pergunta[]; // presente quando buscado via GET /formularios/<id>
}

export interface RespostaUsuario {
  resposta_id: number;
  resposta: string;
  pergunta_id: number;
  submissao_id: number;
  pergunta?: Pergunta;
}

export interface Relatorio {
  relatorio_id: number;
  conteudo: string;
  submissao_id: number;
}

export interface Submissao {
  submissao_id: number;
  usuario_id: number;
  formulario_id: number;
  data_inicio: string;
  data_fim: string;
  pontuacao: number;
  respostas?: RespostaUsuario[];
  relatorio?: Relatorio;
}

export interface RespostaEnvio {
  pergunta_id: number;
  resposta: string;
}

export interface ApiError {
  error: string;
}
