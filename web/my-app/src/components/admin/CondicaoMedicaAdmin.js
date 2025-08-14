import { useEffect, useState } from 'react';
import { condicaoMedicaService } from '../../services/crudService';
import './Admin.css';

const CondicaoMedicaAdmin = () => {
  const [condicoes, setCondicoes] = useState([]);
  const [currentCondicao, setCurrentCondicao] = useState({
    nome: '',
    descricao: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCondicoes();
  }, []);

  const fetchCondicoes = async () => {
    try {
      setLoading(true);
      const response = await condicaoMedicaService.getAll();
      setCondicoes(response.data.data);
    } catch (error) {
      console.log('Erro ao carregar condições médicas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentCondicao.nome.trim()) {
      console.log('Nome da condição é obrigatório');
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await condicaoMedicaService.update(currentCondicao.id, currentCondicao);
        console.log('Condição médica atualizada com sucesso!');
      } else {
        await condicaoMedicaService.create(currentCondicao);
        console.log('Condição médica criada com sucesso!');
      }
      
      resetForm();
      fetchCondicoes();
    } catch (error) {
      console.log('Erro ao salvar condição médica: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (condicao) => {
    setCurrentCondicao(condicao);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta condição médica?')) return;

    try {
      setLoading(true);
      await condicaoMedicaService.delete(id);
      console.log('Condição médica excluída com sucesso!');
      fetchCondicoes();
    } catch (error) {
      console.log('Erro ao excluir condição médica: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentCondicao({
      nome: '',
      descricao: ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setCurrentCondicao({
      ...currentCondicao,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-container">
      <h2>Gerenciar Condições Médicas</h2>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="nome">Nome da Condição:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={currentCondicao.nome}
            onChange={handleInputChange}
            placeholder="Ex: Diabetes, Asma"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição:</label>
          <textarea
            id="descricao"
            name="descricao"
            value={currentCondicao.descricao}
            onChange={handleInputChange}
            placeholder="Descrição detalhada da condição médica"
            rows="4"
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
        <h3>Condições Médicas Cadastradas</h3>
        {loading && <p>Carregando...</p>}
        {condicoes.length === 0 ? (
          <p>Nenhuma condição médica cadastrada</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {condicoes.map((condicao) => (
                <tr key={condicao.id}>
                  <td>{condicao.id}</td>
                  <td>{condicao.nome}</td>
                  <td className="descricao-cell">
                    {condicao.descricao || 'Sem descrição'}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(condicao)} className="btn-edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(condicao.id)} className="btn-delete">
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

export default CondicaoMedicaAdmin;
