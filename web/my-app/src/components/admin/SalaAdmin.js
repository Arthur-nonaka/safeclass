import { useEffect, useState } from 'react';
import { salaService } from '../../services/crudService';
import './Admin.css';

const SalaAdmin = () => {
  const [salas, setSalas] = useState([]);
  const [currentSala, setCurrentSala] = useState({ nome: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSalas();
  }, []);

  const fetchSalas = async () => {
    try {
      setLoading(true);
      const response = await salaService.getAll();
      setSalas(response.data.data);
    } catch (error) {
      alert('Erro ao carregar salas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentSala.nome.trim()) {
      alert('Nome da sala é obrigatório');
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await salaService.update(currentSala.id, currentSala);
        alert('Sala atualizada com sucesso!');
      } else {
        await salaService.create(currentSala);
        alert('Sala criada com sucesso!');
      }
      
      resetForm();
      fetchSalas();
    } catch (error) {
      alert('Erro ao salvar sala: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sala) => {
    setCurrentSala(sala);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta sala?')) return;

    try {
      setLoading(true);
      await salaService.delete(id);
      alert('Sala excluída com sucesso!');
      fetchSalas();
    } catch (error) {
      alert('Erro ao excluir sala: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentSala({ nome: '' });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setCurrentSala({
      ...currentSala,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-container">
      <h2>Gerenciar Salas</h2>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="nome">Nome da Sala:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={currentSala.nome}
            onChange={handleInputChange}
            placeholder="Ex: 1º Ano A"
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
        <h3>Salas Cadastradas</h3>
        {loading && <p>Carregando...</p>}
        {salas.length === 0 ? (
          <p>Nenhuma sala cadastrada</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {salas.map((sala) => (
                <tr key={sala.id}>
                  <td>{sala.id}</td>
                  <td>{sala.nome}</td>
                  <td>
                    <button onClick={() => handleEdit(sala)} className="btn-edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(sala.id)} className="btn-delete">
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

export default SalaAdmin;
