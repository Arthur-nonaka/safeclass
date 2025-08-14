// Types for the SafeClass application

export interface Sala {
  id: number;
  nome: string;
}

export interface Usuario {
  id: number;
  nome_completo: string;
  email?: string;
  telefone?: string;
  tipo: 'professor' | 'aluno' | 'responsavel';
  sala_id?: number;
}

export interface Aluno {
  id: number;
  alergias: string;
  nome_completo: string;
  sala_id?: number;
  sala?: Sala;
}

export interface CondicaoMedica {
  id: number;
  nome: string;
  descricao?: string;
}

export interface Remedio {
  id: number;
  aluno_id: number;
  nome: string;
  descricao?: string;
  dosagem: string;
  horario?: string;
  aluno?: Aluno;
}

export interface Historico {
  id: number;
  usuario_id: number;
  descricao: string;
  criado_em: string;
  usuario?: Usuario;
}

export interface ResponsavelFilho {
  responsavel_id: number;
  filho_id: number;
  responsavel?: Usuario;
  filho?: Aluno;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  tipo: 'professor' | 'responsavel';
}

export interface LoginResponse {
  token: string;
  user: Usuario;
}
