import axios, { AxiosInstance, AxiosResponse } from "axios";
import { API_CONFIG } from "../config";
import {
  Aluno,
  ApiResponse,
  CondicaoMedica,
  Historico,
  LoginResponse,
  Remedio,
  Sala,
  Usuario,
} from "../types/api";

let authToken: string | null = null;

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.DEFAULT_HEADERS,
    });

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

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        console.error("API Error:", error);

        if (error.response) {
          console.error(
            "Response error:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          console.error("Network error:", error.request);
        } else {
          console.error("Request setup error:", error.message);
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

  async login(
    email: string,
    password: string,
    userType: "professor" | "responsavel"
  ): Promise<ApiResponse<LoginResponse>> {
    const response = await this.api.post("/auth/login", {
      email,
      senha: password,
      tipo: userType,
    });
    return this.formatResponse(response);
  }

  async saveAuthToken(token: string): Promise<void> {
    authToken = token;
  }

  async logout(): Promise<void> {
    authToken = null;
  }

  async getSalas(): Promise<ApiResponse<Sala[]>> {
    const response = await this.api.get("/salas");
    return this.formatResponse(response);
  }

  async getSala(id: number): Promise<ApiResponse<Sala>> {
    const response = await this.api.get(`/salas/${id}`);
    return this.formatResponse(response);
  }

  async getUsuarios(): Promise<ApiResponse<Usuario[]>> {
    const response = await this.api.get("/usuarios");
    return this.formatResponse(response);
  }

  async getUsuario(id: number): Promise<ApiResponse<Usuario>> {
    const response = await this.api.get(`/usuarios/${id}`);
    return this.formatResponse(response);
  }

  async getUserProfile(): Promise<ApiResponse<Usuario>> {
    const token = authToken;
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const decodedToken = this.decodeJWTPayload(token);

    const response = await this.api.get(`/usuarios/${decodedToken.id}`);
    return this.formatResponse(response);
  }

  async getAlunos(): Promise<ApiResponse<Aluno[]>> {
    const response = await this.api.get("/alunos");
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

  async getFilhos(responsavelId: number): Promise<ApiResponse<Aluno[]>> {
    const response = await this.api.get(
      `/responsavel-filho/responsavel/${responsavelId}`
    );
    return this.formatResponse(response);
  }

  async getCondicoesMedicas(): Promise<ApiResponse<CondicaoMedica[]>> {
    const response = await this.api.get("/condicoes-medicas");
    return this.formatResponse(response);
  }

  async getCondicoesByAluno(
    alunoId: number
  ): Promise<ApiResponse<CondicaoMedica[]>> {
    const response = await this.api.get(
      `/usuario-condicao-medica/aluno/${alunoId}`
    );
    return this.formatResponse(response);
  }

  async getRemedios(): Promise<ApiResponse<Remedio[]>> {
    const response = await this.api.get("/remedios");
    return this.formatResponse(response);
  }

  async getRemediosByAluno(alunoId: number): Promise<ApiResponse<Remedio[]>> {
    const response = await this.api.get(`/remedios/aluno/${alunoId}`);
    return this.formatResponse(response);
  }

  async createRemedio(
    remedio: Partial<Remedio>
  ): Promise<ApiResponse<Remedio>> {
    const response = await this.api.post("/remedios", remedio);
    return this.formatResponse(response);
  }

  async updateRemedio(
    id: number,
    remedio: Partial<Remedio>
  ): Promise<ApiResponse<Remedio>> {
    const response = await this.api.put(`/remedios/${id}`, remedio);
    return this.formatResponse(response);
  }

  async getHistorico(): Promise<ApiResponse<Historico[]>> {
    const response = await this.api.get("/historico");
    return this.formatResponse(response);
  }

  async getHistoricoByUsuario(
    usuarioId: number
  ): Promise<ApiResponse<Historico[]>> {
    const response = await this.api.get(`/historico/usuario/${usuarioId}`);
    return this.formatResponse(response);
  }

  async createHistorico(
    historico: Partial<Historico>
  ): Promise<ApiResponse<Historico>> {
    const response = await this.api.post("/historico", historico);
    return this.formatResponse(response);
  }

  async reportCrisis(
    alunoId: number,
    description: string,
    severity: "low" | "medium" | "high"
  ): Promise<ApiResponse<Historico>> {
    const response = await this.api.post("/historico", {
      usuario_id: alunoId,
      descricao: `CRISE - ${severity.toUpperCase()}: ${description}`,
      tipo_evento: "crise",
    });
    return this.formatResponse(response);
  }

  async reportMedicineAdministration(
    remedioId: number,
    alunoId: number,
    observacoes?: string
  ): Promise<ApiResponse<Historico>> {
    const response = await this.api.post("/historico", {
      usuario_id: alunoId,
      descricao: `Medicamento administrado - Remédio ID: ${remedioId}${
        observacoes ? ` - Obs: ${observacoes}` : ""
      }`,
      tipo_evento: "medicamento",
    });
    return this.formatResponse(response);
  }

  private decodeJWTPayload(token: string): any {
    try {
      const base64Url = token.split(".")[1];

      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }
}

export default new ApiService();
