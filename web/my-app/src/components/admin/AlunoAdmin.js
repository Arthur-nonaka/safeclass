import { useEffect, useState } from 'react';
import { alunoService, salaService } from '../../services/crudService';
import './Admin.css';

const AlunoAdmin = () => {
  const [alunos, setAlunos] = useState([]);
  const [salas, setSalas] = useState([]);
  const [currentAluno, setCurrentAluno] = useState({
    nome_completo: '',
    sala_id: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAlunos();
    fetchSalas();
  }, []);

  const fetchAlunos = async () => {
    try {
      setLoading(true);
      const response = await alunoService.getAll();
      setAlunos(response.data.data);
    } catch (error) {
      alert('Erro ao carregar alunos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalas = async () => {
    try {
      const response = await salaService.getAll();
      setSalas(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentAluno.nome_completo.trim()) {
      alert('Nome completo é obrigatório');
      return;
    }

    try {
      setLoading(true);
      const alunoData = {
        ...currentAluno,
        sala_id: currentAluno.sala_id || null
      };

      if (isEditing) {
        await alunoService.update(currentAluno.id, alunoData);
        alert('Aluno atualizado com sucesso!');
      } else {
        await alunoService.create(alunoData);
        alert('Aluno criado com sucesso!');
      }
      
      resetForm();
      fetchAlunos();
    } catch (error) {
      alert('Erro ao salvar aluno: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (aluno) => {
    setCurrentAluno({
      ...aluno,
      sala_id: aluno.sala_id || ''
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este aluno?')) return;

    try {
      setLoading(true);
      await alunoService.delete(id);
      alert('Aluno excluído com sucesso!');
      fetchAlunos();
    } catch (error) {
      alert('Erro ao excluir aluno: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentAluno({
      nome_completo: '',
      sala_id: ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setCurrentAluno({
      ...currentAluno,
      [e.target.name]: e.target.value
    });
  };

  const getSalaNome = (salaId) => {
    const sala = salas.find(s => s.id === salaId);
    return sala ? sala.nome : 'Nenhuma';
  };

  return (
    <div className="admin-container">
      <h2>Gerenciar Alunos</h2>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="nome_completo">Nome Completo:</label>
          <input
            type="text"
            id="nome_completo"
            name="nome_completo"
            value={currentAluno.nome_completo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="sala_id">Sala:</label>
          <select
            id="sala_id"
            name="sala_id"
            value={currentAluno.sala_id}
            onChange={handleInputChange}
          >
            <option value="">Nenhuma sala</option>
            {salas.map((sala) => (
              <option key={sala.id} value={sala.id}>
                {sala.nome}
              </option>
            ))}
          </select>
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
        <h3>Alunos Cadastrados</h3>
        {loading && <p>Carregando...</p>}
        {alunos.length === 0 ? (
          <p>Nenhum aluno cadastrado</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Sala</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.id}>
                  <td>{aluno.id}</td>
                  <td>{aluno.nome_completo}</td>
                  <td>{getSalaNome(aluno.sala_id)}</td>
                  <td>
                    <button onClick={() => handleEdit(aluno)} className="btn-edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(aluno.id)} className="btn-delete">
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

export default AlunoAdmin;
