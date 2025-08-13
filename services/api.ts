import { API_CONFIG } from '../config';
import {
    Aluno,
    ApiResponse,
    CondicaoMedica,
    Historico,
    LoginResponse,
    Remedio,
    Sala,
    Usuario
} from '../types/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  requireAuth?: boolean;
}

// Simple storage for demo - replace with AsyncStorage in production
let authToken: string | null = null;

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getAuthToken(): Promise<string | null> {
    return authToken;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      requireAuth = true
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    };

    // Add auth token if required
    if (requireAuth) {
      const token = await this.getAuthToken();
      if (token) {
        defaultHeaders.Authorization = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      method,
      headers: defaultHeaders,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string, userType: 'professor' | 'responsavel'): Promise<ApiResponse<LoginResponse>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password, tipo: userType },
      requireAuth: false
    });
  }

  async saveAuthToken(token: string): Promise<void> {
    authToken = token;
  }

  async logout(): Promise<void> {
    authToken = null;
  }

  // Salas
  async getSalas(): Promise<ApiResponse<Sala[]>> {
    return this.request('/salas');
  }

  async getSala(id: number): Promise<ApiResponse<Sala>> {
    return this.request(`/salas/${id}`);
  }

  // Usuários
  async getUsuarios(): Promise<ApiResponse<Usuario[]>> {
    return this.request('/usuarios');
  }

  async getUsuario(id: number): Promise<ApiResponse<Usuario>> {
    return this.request(`/usuarios/${id}`);
  }

  async getUserProfile(): Promise<ApiResponse<Usuario>> {
    return this.request('/usuarios/profile');
  }

  // Alunos
  async getAlunos(): Promise<ApiResponse<Aluno[]>> {
    return this.request('/alunos');
  }

  async getAluno(id: number): Promise<ApiResponse<Aluno>> {
    return this.request(`/alunos/${id}`);
  }

  async getAlunosBySala(salaId: number): Promise<ApiResponse<Aluno[]>> {
    return this.request(`/alunos/sala/${salaId}`);
  }

  // Para responsáveis - obter filhos
  async getFilhos(responsavelId: number): Promise<ApiResponse<Aluno[]>> {
    return this.request(`/responsavel-filho/responsavel/${responsavelId}`);
  }

  // Condições médicas
  async getCondicoesMedicas(): Promise<ApiResponse<CondicaoMedica[]>> {
    return this.request('/condicoes-medicas');
  }

  async getCondicoesByAluno(alunoId: number): Promise<ApiResponse<CondicaoMedica[]>> {
    return this.request(`/usuario-condicao-medica/aluno/${alunoId}`);
  }

  // Remédios
  async getRemedios(): Promise<ApiResponse<Remedio[]>> {
    return this.request('/remedios');
  }

  async getRemediosByAluno(alunoId: number): Promise<ApiResponse<Remedio[]>> {
    return this.request(`/remedios/aluno/${alunoId}`);
  }

  async createRemedio(remedio: Partial<Remedio>): Promise<ApiResponse<Remedio>> {
    return this.request('/remedios', {
      method: 'POST',
      body: remedio
    });
  }

  async updateRemedio(id: number, remedio: Partial<Remedio>): Promise<ApiResponse<Remedio>> {
    return this.request(`/remedios/${id}`, {
      method: 'PUT',
      body: remedio
    });
  }

  // Histórico
  async getHistorico(): Promise<ApiResponse<Historico[]>> {
    return this.request('/historico');
  }

  async getHistoricoByUsuario(usuarioId: number): Promise<ApiResponse<Historico[]>> {
    return this.request(`/historico/usuario/${usuarioId}`);
  }

  async createHistorico(historico: Partial<Historico>): Promise<ApiResponse<Historico>> {
    return this.request('/historico', {
      method: 'POST',
      body: historico
    });
  }

  // Emergency/Crisis reporting
  async reportCrisis(alunoId: number, description: string, severity: 'low' | 'medium' | 'high'): Promise<ApiResponse<Historico>> {
    return this.request('/historico', {
      method: 'POST',
      body: {
        usuario_id: alunoId,
        descricao: `CRISE - ${severity.toUpperCase()}: ${description}`,
        tipo_evento: 'crise'
      }
    });
  }

  // Medicine administration
  async reportMedicineAdministration(remedioId: number, alunoId: number, observacoes?: string): Promise<ApiResponse<Historico>> {
    return this.request('/historico', {
      method: 'POST',
      body: {
        usuario_id: alunoId,
        descricao: `Medicamento administrado - Remédio ID: ${remedioId}${observacoes ? ` - Obs: ${observacoes}` : ''}`,
        tipo_evento: 'medicamento'
      }
    });
  }
}

export default new ApiService(API_BASE_URL);
