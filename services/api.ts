import axios, { AxiosInstance, AxiosResponse } from 'axios';
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

// Simple storage for demo - replace with AsyncStorage in production
let authToken: string | null = null;

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.DEFAULT_HEADERS,
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        if (authToken) {
          config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        console.error('API Error:', error);
        
        // Handle specific error cases
        if (error.response) {
          // Server responded with error status
          console.error('Response error:', error.response.status, error.response.data);
        } else if (error.request) {
          // Request made but no response received
          console.error('Network error:', error.request);
        } else {
          // Something else happened
          console.error('Request setup error:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  private formatResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      message: response.statusText,
    };
  }

  // Auth methods
  async login(email: string, password: string, userType: 'professor' | 'responsavel'): Promise<ApiResponse<LoginResponse>> {
    const response = await this.api.post('/auth/login', { 
      email, 
      password, 
      tipo: userType 
    });
    return this.formatResponse(response);
  }

  async saveAuthToken(token: string): Promise<void> {
    authToken = token;
  }

  async logout(): Promise<void> {
    authToken = null;
  }

  // Salas
  async getSalas(): Promise<ApiResponse<Sala[]>> {
    const response = await this.api.get('/salas');
    return this.formatResponse(response);
  }

  async getSala(id: number): Promise<ApiResponse<Sala>> {
    const response = await this.api.get(`/salas/${id}`);
    return this.formatResponse(response);
  }

  // Usuários
  async getUsuarios(): Promise<ApiResponse<Usuario[]>> {
    const response = await this.api.get('/usuarios');
    return this.formatResponse(response);
  }

  async getUsuario(id: number): Promise<ApiResponse<Usuario>> {
    const response = await this.api.get(`/usuarios/${id}`);
    return this.formatResponse(response);
  }

  async getUserProfile(): Promise<ApiResponse<Usuario>> {
    const response = await this.api.get('/usuarios/profile');
    return this.formatResponse(response);
  }

  // Alunos
  async getAlunos(): Promise<ApiResponse<Aluno[]>> {
    const response = await this.api.get('/alunos');
    return this.formatResponse(response);
  }

  async getAluno(id: number): Promise<ApiResponse<Aluno>> {
    const response = await this.api.get(`/alunos/${id}`);
    return this.formatResponse(response);
  }

  async getAlunosBySala(salaId: number): Promise<ApiResponse<Aluno[]>> {
    const response = await this.api.get(`/alunos/sala/${salaId}`);
    return this.formatResponse(response);
  }

  // Para responsáveis - obter filhos
  async getFilhos(responsavelId: number): Promise<ApiResponse<Aluno[]>> {
    const response = await this.api.get(`/responsavel-filho/responsavel/${responsavelId}`);
    return this.formatResponse(response);
  }

  // Condições médicas
  async getCondicoesMedicas(): Promise<ApiResponse<CondicaoMedica[]>> {
    const response = await this.api.get('/condicoes-medicas');
    return this.formatResponse(response);
  }

  async getCondicoesByAluno(alunoId: number): Promise<ApiResponse<CondicaoMedica[]>> {
    const response = await this.api.get(`/usuario-condicao-medica/aluno/${alunoId}`);
    return this.formatResponse(response);
  }

  // Remédios
  async getRemedios(): Promise<ApiResponse<Remedio[]>> {
    const response = await this.api.get('/remedios');
    return this.formatResponse(response);
  }

  async getRemediosByAluno(alunoId: number): Promise<ApiResponse<Remedio[]>> {
    const response = await this.api.get(`/remedios/aluno/${alunoId}`);
    return this.formatResponse(response);
  }

  async createRemedio(remedio: Partial<Remedio>): Promise<ApiResponse<Remedio>> {
    const response = await this.api.post('/remedios', remedio);
    return this.formatResponse(response);
  }

  async updateRemedio(id: number, remedio: Partial<Remedio>): Promise<ApiResponse<Remedio>> {
    const response = await this.api.put(`/remedios/${id}`, remedio);
    return this.formatResponse(response);
  }

  // Histórico
  async getHistorico(): Promise<ApiResponse<Historico[]>> {
    const response = await this.api.get('/historico');
    return this.formatResponse(response);
  }

  async getHistoricoByUsuario(usuarioId: number): Promise<ApiResponse<Historico[]>> {
    const response = await this.api.get(`/historico/usuario/${usuarioId}`);
    return this.formatResponse(response);
  }

  async createHistorico(historico: Partial<Historico>): Promise<ApiResponse<Historico>> {
    const response = await this.api.post('/historico', historico);
    return this.formatResponse(response);
  }

  // Emergency/Crisis reporting
  async reportCrisis(alunoId: number, description: string, severity: 'low' | 'medium' | 'high'): Promise<ApiResponse<Historico>> {
    const response = await this.api.post('/historico', {
      usuario_id: alunoId,
      descricao: `CRISE - ${severity.toUpperCase()}: ${description}`,
      tipo_evento: 'crise'
    });
    return this.formatResponse(response);
  }

  // Medicine administration
  async reportMedicineAdministration(remedioId: number, alunoId: number, observacoes?: string): Promise<ApiResponse<Historico>> {
    const response = await this.api.post('/historico', {
      usuario_id: alunoId,
      descricao: `Medicamento administrado - Remédio ID: ${remedioId}${observacoes ? ` - Obs: ${observacoes}` : ''}`,
      tipo_evento: 'medicamento'
    });
    return this.formatResponse(response);
  }
}

export default new ApiService();
