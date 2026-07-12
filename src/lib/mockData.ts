// Dados mockados — usados apenas em telas cujo endpoint ainda não existe na API
// (notificações e trilhas). O ranking usa dados reais de usuários/submissões,
// mas complementamos com esses mocks quando não há submissões suficientes.

export interface Notificacao {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  lida: boolean;
  tipo: "info" | "sucesso" | "alerta";
}

export const notificacoesMock: Notificacao[] = [
  {
    id: 1,
    titulo: "Relatório disponível",
    descricao: "Sua última avaliação já tem um relatório gerado pela IA.",
    data: "Hoje",
    lida: false,
    tipo: "sucesso",
  },
  {
    id: 2,
    titulo: "Novo formulário atribuído",
    descricao: "Um novo formulário de avaliação ética foi liberado para o seu cargo.",
    data: "Ontem",
    lida: false,
    tipo: "info",
  },
  {
    id: 3,
    titulo: "Lembrete de avaliação",
    descricao: "Você ainda não respondeu a avaliação deste trimestre.",
    data: "3 dias atrás",
    lida: true,
    tipo: "alerta",
  },
];

export interface RankingEntry {
  posicao: number;
  nome: string;
  departamento: string;
  pontuacao: number;
}

export const rankingMock: RankingEntry[] = [
  { posicao: 1, nome: "Fernanda Alves", departamento: "Recursos Humanos", pontuacao: 96 },
  { posicao: 2, nome: "Ricardo Nunes", departamento: "Tecnologia", pontuacao: 91 },
  { posicao: 3, nome: "Camila Duarte", departamento: "Operações", pontuacao: 88 },
  { posicao: 4, nome: "Bruno Castro", departamento: "Tecnologia", pontuacao: 82 },
  { posicao: 5, nome: "Larissa Prado", departamento: "Vendas", pontuacao: 79 },
  { posicao: 6, nome: "Eduardo Lima", departamento: "Financeiro", pontuacao: 74 },
];

export interface Trilha {
  id: number;
  titulo: string;
  descricao: string;
  progresso: number;
  modulos: number;
  modulosConcluidos: number;
}

export const trilhasMock: Trilha[] = [
  {
    id: 1,
    titulo: "Liderança ética fundamentos",
    descricao: "Princípios básicos de liderança ética e combate ao capacitismo.",
    progresso: 75,
    modulos: 8,
    modulosConcluidos: 6,
  },
  {
    id: 2,
    titulo: "Comunicação inclusiva",
    descricao: "Como comunicar decisões e feedback de forma inclusiva e acessível.",
    progresso: 30,
    modulos: 6,
    modulosConcluidos: 2,
  },
  {
    id: 3,
    titulo: "Compliance na prática",
    descricao: "Estudos de caso de compliance aplicados ao dia a dia da liderança.",
    progresso: 0,
    modulos: 5,
    modulosConcluidos: 0,
  },
];
