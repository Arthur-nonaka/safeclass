import { useEffect, useState } from "react";
import {
  condicaoMedicaService,
  historicoService,
  usuarioService,
} from "../../services/crudService";
import "./Admin.css";

const HistoricoAdmin = () => {
  const [historicos, setHistoricos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [condicoes, setCondicoes] = useState([]);
  const [currentHistorico, setCurrentHistorico] = useState({
    usuario_id: "",
    descricao: "",
    condicao_id: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistoricos();
    fetchUsuarios();
    fetchCondicoes();
  }, []);

  const fetchCondicoes = async () => {
    try {
      setLoading(true);
      const response = await condicaoMedicaService.getAll();
      setCondicoes(response.data.data);
    } catch (error) {
      console.log("Erro ao carregar condições médicas: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricos = async () => {
    try {
      setLoading(true);
      const response = await historicoService.getAll();
      setHistoricos(response.data.data);
    } catch (error) {
      console.log("Erro ao carregar históricos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await usuarioService.getAll();
      setUsuarios(response.data.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentHistorico.descricao.trim() || !currentHistorico.usuario_id) {
      console.log("Usuário e descrição são obrigatórios");
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await historicoService.update(currentHistorico.id, currentHistorico);
        console.log("Histórico atualizado com sucesso!");
      } else {
        await historicoService.create(currentHistorico);
        console.log("Histórico criado com sucesso!");
      }

      resetForm();
      fetchHistoricos();
    } catch (error) {
      console.log("Erro ao salvar histórico: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCondicao = (id) => {
    const condicao = condicoes.find((c) => c.id === id);
    return condicao ? condicao.nome : "Não definida";
  };

  const handleEdit = (historico) => {
    setCurrentHistorico(historico);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este histórico?"))
      return;

    try {
      setLoading(true);
      await historicoService.delete(id);
      console.log("Histórico excluído com sucesso!");
      fetchHistoricos();
    } catch (error) {
      console.log("Erro ao excluir histórico: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentHistorico({
      usuario_id: "",
      descricao: "",
      condicao_id: "",
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setCurrentHistorico({
      ...currentHistorico,
      [e.target.name]: e.target.value,
    });
  };

  const getUsuarioNome = (usuarioId) => {
    const usuario = usuarios.find((u) => u.id === usuarioId);
    return usuario ? usuario.nome_completo : "Usuário não encontrado";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  return (
    <div className="admin-container">
      <h2>Histórico</h2>

      <div className="admin-list">
        {loading && <p>Carregando...</p>}
        {historicos.length === 0 ? (
          <p>Nenhum histórico cadastrado</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Condicao</th>
                <th>Descrição</th>
                <th>Data/Hora</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {historicos.map((historico) => (
                <tr key={historico.id}>
                  <td>{historico.id}</td>
                  <td>{getCondicao(historico.condicao_id)}</td>
                  <td className="descricao-cell">{historico.descricao}</td>
                  <td>{formatDate(historico.criado_em)}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(historico.id)}
                      className="btn-delete"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoricoAdmin;
