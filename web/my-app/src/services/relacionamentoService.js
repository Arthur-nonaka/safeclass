import api from "./api";

export const relacionamentoService = {
  async getAll() {
    return await api.get("/usuario-condicao");
  },

  async getByAluno(alunoId) {
    return await api.get(`/usuario-condicao/aluno/${alunoId}`);
  },

  async create(alunoId, condicaoId) {
    return await api.post("/usuario-condicao", {
      aluno_id: alunoId,
      condicao_id: condicaoId,
    });
  },

  async delete(alunoId, condicaoId) {
    return await api.delete(`/usuario-condicao/${alunoId}/${condicaoId}`);
  },
};

export const alunoService = {
  async getAll() {
    return await api.get("/alunos");
  },
};

export const condicaoMedicaService = {
  async getAll() {
    return await api.get("/condicoes-medicas");
  },

  async getById(id) {
    return await api.get(`/condicoes-medicas/${id}`);
  },

  async create(data) {
    return await api.post("/condicoes-medicas", data);
  },

  async update(id, data) {
    return await api.put(`/condicoes-medicas/${id}`, data);
  },

  async delete(id) {
    return await api.delete(`/condicoes-medicas/${id}`);
  },
};
