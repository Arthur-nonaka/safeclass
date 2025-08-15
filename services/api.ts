import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { API_CONFIG } from "../config";
import {
  Aluno,
  AlunoCondicaoMedica,
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

  async uploadProfilePicture(
    id: Number,
    imageData: string,
    fileName: string
  ): Promise<ApiResponse<Usuario>> {
    try {
      console.log("🔍 Processing image data...");
      console.log("Platform:", Platform.OS);

      let imageUri = imageData;

      // Se for base64, tratar diferente para web e mobile
      if (
        imageData.startsWith("data:image/") ||
        imageData.startsWith("base64,")
      ) {
        console.log("📝 Converting base64...");

        if (Platform.OS === "web") {
          // No web, enviar base64 diretamente
          console.log("🌐 Web platform detected - sending base64 directly");
          return this.uploadBase64Web(id, imageData, fileName);
        } else {
          // No mobile, converter para file
          console.log("📱 Mobile platform detected - converting to file");

          const base64Data = imageData.replace(
            /^data:image\/[a-z]+;base64,/,
            ""
          );
          const fileUri = `${
            FileSystem.documentDirectory
          }temp_profile_${Date.now()}.jpg`;

          await FileSystem.writeAsStringAsync(fileUri, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          console.log("✅ Base64 converted to file:", fileUri);
          imageUri = fileUri;
        }
      }

      console.log("📁 Final image URI:", imageUri);

      const formData = new FormData();
      formData.append("profile_picture", {
        uri: imageUri,
        type: "image/jpeg",
        name: fileName || "profile.jpg",
      } as any);

      const response = await this.api.post(`/usuarios/upload/${id}`, formData, {
        headers: {
          Accept: "application/json",
        },
      });

      // Limpar arquivo temporário no mobile
      if (Platform.OS !== "web" && imageData.startsWith("data:image/")) {
        try {
          await FileSystem.deleteAsync(imageUri);
          console.log("🗑️ Temporary file deleted");
        } catch (deleteError) {
          console.log("⚠️ Could not delete temp file:", deleteError);
        }
      }

      return this.formatResponse(response);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  }

  private async uploadBase64Web(
    id: number,
    base64Data: string,
    fileName?: string
  ): Promise<ApiResponse<Usuario>> {
    try {
      const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, "");

      const requestData = {
        profile_picture: cleanBase64,
        filename: fileName || "profile.jpg",
        mimetype: "image/jpeg",
      };

      const response = await this.api.post(
        `/usuarios/upload/${id}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return this.formatResponse(response);
    } catch (error) {
      console.error("❌ Base64 upload error:", error);
      throw error;
    }
  }

  async getUserProfile(): Promise<ApiResponse<Usuario>> {
    try {
      let token = authToken;
      if (!token) {
        token = await AsyncStorage.getItem("@App:token");
      }

      if (!token) {
        throw new Error("Token is required to decode JWT payload.");
      }

      const decodedToken = this.decodeJWTPayload(token);

      const response = await this.api.get(`/usuarios/${decodedToken.id}`);
      return this.formatResponse(response);
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
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

  async getAlunosByResponsavel(
    responsavelId: number
  ): Promise<ApiResponse<Aluno[]>> {
    const response = await this.api.get(`/alunos/responsavel/${responsavelId}`);
    return this.formatResponse(response);
  }

  async getAllAlunos(): Promise<ApiResponse<Aluno[]>> {
    const response = await this.api.get("/alunos");
    return this.formatResponse(response);
  }

  async createAluno(aluno: Partial<Aluno>): Promise<ApiResponse<Aluno>> {
    const response = await this.api.post("/alunos", aluno);
    return this.formatResponse(response);
  }

  async updateAluno(
    id: number,
    aluno: Partial<Aluno>
  ): Promise<ApiResponse<Aluno>> {
    const response = await this.api.put(`/alunos/${id}`, aluno);
    return this.formatResponse(response);
  }

  async deleteAluno(id: number): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/alunos/${id}`);
    return this.formatResponse(response);
  }

  async getAllResponsaveis(): Promise<ApiResponse<Usuario[]>> {
    const response = await this.api.get("/usuarios?tipo=responsavel");
    return this.formatResponse(response);
  }

  async getFilhos(responsavelId: number): Promise<ApiResponse<Aluno[]>> {
    const response = await this.api.get(`/alunos/responsavel/${responsavelId}`);
    return this.formatResponse(response);
  }

  // Método para vincular aluno a responsável (se não estiver vinculado via responsavel_id)
  async vincularResponsavelFilho(
    responsavelId: number,
    filhoId: number
  ): Promise<ApiResponse<any>> {
    const response = await this.api.post("/responsavel-filho", {
      responsavelId,
      filhoId,
    });
    return this.formatResponse(response);
  }

  // Método para desvincular aluno de responsável
  async desvincularResponsavelFilho(
    responsavelId: number,
    filhoId: number
  ): Promise<ApiResponse<any>> {
    const response = await this.api.delete(
      `/responsavel-filho/${responsavelId}/${filhoId}`
    );
    return this.formatResponse(response);
  }

  // Método para buscar salas do professor (se necessário)
  async getSalasByProfessor(professorId: number): Promise<ApiResponse<Sala[]>> {
    const response = await this.api.get(`/salas/professor/${professorId}`);
    return this.formatResponse(response);
  }

  // Método para vincular usuário a condição médica
  async vincularUsuarioCondicao(
    alunoId: number,
    condicaoId: number
  ): Promise<ApiResponse<any>> {
    const response = await this.api.post("/usuario-condicao-medica", {
      alunoId,
      condicaoId,
    });
    return this.formatResponse(response);
  }

  // Método para desvincular usuário de condição médica
  async desvincularUsuarioCondicao(
    alunoId: number,
    condicaoId: number
  ): Promise<ApiResponse<any>> {
    const response = await this.api.delete(
      `/usuario-condicao-medica/${alunoId}/${condicaoId}`
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

  async deleteRemedio(id: number): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/remedios/${id}`);
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

  async getCondicoesMedicasByAluno(
    alunoId: number
  ): Promise<ApiResponse<AlunoCondicaoMedica[]>> {
    const response = await this.api.get(`/usuario-condicao/aluno/${alunoId}`);
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
      const cleanToken = token.replace("Bearer ", "");

      const parts = cleanToken.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }

      const payload = parts[1];

      const paddedPayload =
        payload + "=".repeat((4 - (payload.length % 4)) % 4);

      const decoded = atob(paddedPayload);

      return JSON.parse(decoded);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      throw new Error("Failed to decode JWT token");
    }
  }
}

export default new ApiService();
