import api from './api';

export const salaService = {
  getAll: () => api.get('/salas'),
  getById: (id) => api.get(`/salas/${id}`),
  create: (data) => api.post('/salas', data),
  update: (id, data) => api.put(`/salas/${id}`, data),
  delete: (id) => api.delete(`/salas/${id}`),
};

export const usuarioService = {
  getAll: () => api.get('/usuarios'),
  getById: (id) => api.get(`/usuarios/${id}`),
  create: (data) => api.post('/usuarios', data),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  delete: (id) => api.delete(`/usuarios/${id}`),
};

export const alunoService = {
  getAll: () => api.get('/alunos'),
  getById: (id) => api.get(`/alunos/${id}`),
  create: (data) => api.post('/alunos', data),
  update: (id, data) => api.put(`/alunos/${id}`, data),
  delete: (id) => api.delete(`/alunos/${id}`),
};

export const condicaoMedicaService = {
  getAll: () => api.get('/condicoes-medicas'),
  getById: (id) => api.get(`/condicoes-medicas/${id}`),
  create: (data) => api.post('/condicoes-medicas', data),
  update: (id, data) => api.put(`/condicoes-medicas/${id}`, data),
  delete: (id) => api.delete(`/condicoes-medicas/${id}`),
};

export const remedioService = {
  getAll: () => api.get('/remedios'),
  getById: (id) => api.get(`/remedios/${id}`),
  create: (data) => api.post('/remedios', data),
  update: (id, data) => api.put(`/remedios/${id}`, data),
  delete: (id) => api.delete(`/remedios/${id}`),
};

export const historicoService = {
  getAll: () => api.get('/historico'),
  getById: (id) => api.get(`/historico/${id}`),
  create: (data) => api.post('/historico', data),
  update: (id, data) => api.put(`/historico/${id}`, data),
  delete: (id) => api.delete(`/historico/${id}`),
};

export const relacionamentoService = {
  linkResponsavelFilho: (responsavelId, filhoId) => 
    api.post('/responsavel-filho', { responsavelId, filhoId }),
  unlinkResponsavelFilho: (responsavelId, filhoId) => 
    api.delete(`/responsavel-filho/${responsavelId}/${filhoId}`),
  
  linkUsuarioCondicao: (alunoId, condicaoId) => 
    api.post('/usuario-condicao-medica', { alunoId, condicaoId }),
  unlinkUsuarioCondicao: (alunoId, condicaoId) => 
    api.delete(`/usuario-condicao-medica/${alunoId}/${condicaoId}`),
};
