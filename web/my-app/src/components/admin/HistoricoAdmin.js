import { useEffect, useState } from 'react';
import { historicoService, usuarioService } from '../../services/crudService';
import './Admin.css';

const HistoricoAdmin = () => {
  const [historicos, setHistoricos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [currentHistorico, setCurrentHistorico] = useState({
    usuario_id: '',
    descricao: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistoricos();
    fetchUsuarios();
  }, []);

  const fetchHistoricos = async () => {
    try {
      setLoading(true);
      const response = await historicoService.getAll();
      setHistoricos(response.data.data);
    } catch (error) {
      alert('Erro ao carregar históricos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await usuarioService.getAll();
      setUsuarios(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentHistorico.descricao.trim() || !currentHistorico.usuario_id) {
      alert('Usuário e descrição são obrigatórios');
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await historicoService.update(currentHistorico.id, currentHistorico);
        alert('Histórico atualizado com sucesso!');
      } else {
        await historicoService.create(currentHistorico);
        alert('Histórico criado com sucesso!');
      }
      
      resetForm();
      fetchHistoricos();
    } catch (error) {
      alert('Erro ao salvar histórico: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (historico) => {
    setCurrentHistorico(historico);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este histórico?')) return;

    try {
      setLoading(true);
      await historicoService.delete(id);
      alert('Histórico excluído com sucesso!');
      fetchHistoricos();
    } catch (error) {
      alert('Erro ao excluir histórico: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentHistorico({
      usuario_id: '',
      descricao: ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setCurrentHistorico({
      ...currentHistorico,
      [e.target.name]: e.target.value
    });
  };

  const getUsuarioNome = (usuarioId) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    return usuario ? usuario.nome_completo : 'Usuário não encontrado';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="admin-container">
      <h2>Gerenciar Histórico</h2>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="usuario_id">Usuário:</label>
          <select
            id="usuario_id"
            name="usuario_id"
            value={currentHistorico.usuario_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecione um usuário</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nome_completo} ({usuario.tipo})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição do Evento:</label>
          <textarea
            id="descricao"
            name="descricao"
            value={currentHistorico.descricao}
            onChange={handleInputChange}
            placeholder="Descreva o que aconteceu"
            rows="4"
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="admin-list">
        <h3>Histórico de Eventos</h3>
        {loading && <p>Carregando...</p>}
        {historicos.length === 0 ? (
          <p>Nenhum histórico cadastrado</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuário</th>
                <th>Descrição</th>
                <th>Data/Hora</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {historicos.map((historico) => (
                <tr key={historico.id}>
                  <td>{historico.id}</td>
                  <td>{getUsuarioNome(historico.usuario_id)}</td>
                  <td className="descricao-cell">
                    {historico.descricao}
                  </td>
                  <td>{formatDate(historico.criado_em)}</td>
                  <td>
                    <button onClick={() => handleEdit(historico)} className="btn-edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(historico.id)} className="btn-delete">
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
