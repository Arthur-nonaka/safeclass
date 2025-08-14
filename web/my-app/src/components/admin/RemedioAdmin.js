import { useEffect, useState } from 'react';
import { alunoService, remedioService } from '../../services/crudService';
import './Admin.css';

const RemedioAdmin = () => {
  const [remedios, setRemedios] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [currentRemedio, setCurrentRemedio] = useState({
    aluno_id: '',
    nome: '',
    descricao: '',
    dosagem: '',
    horario: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRemedios();
    fetchAlunos();
  }, []);

  const fetchRemedios = async () => {
    try {
      setLoading(true);
      const response = await remedioService.getAll();
      setRemedios(response.data.data);
    } catch (error) {
      console.log('Erro ao carregar remédios: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlunos = async () => {
    try {
      const response = await alunoService.getAll();
      setAlunos(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentRemedio.nome.trim() || !currentRemedio.aluno_id || !currentRemedio.dosagem.trim()) {
      console.log('Nome do remédio, aluno e dosagem são obrigatórios');
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await remedioService.update(currentRemedio.id, currentRemedio);
        console.log('Remédio atualizado com sucesso!');
      } else {
        await remedioService.create(currentRemedio);
        console.log('Remédio criado com sucesso!');
      }
      
      resetForm();
      fetchRemedios();
    } catch (error) {
      console.log('Erro ao salvar remédio: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (remedio) => {
    setCurrentRemedio(remedio);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este remédio?')) return;

    try {
      setLoading(true);
      await remedioService.delete(id);
      console.log('Remédio excluído com sucesso!');
      fetchRemedios();
    } catch (error) {
      console.log('Erro ao excluir remédio: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentRemedio({
      aluno_id: '',
      nome: '',
      descricao: '',
      dosagem: '',
      horario: ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setCurrentRemedio({
      ...currentRemedio,
      [e.target.name]: e.target.value
    });
  };

  const getAlunoNome = (alunoId) => {
    const aluno = alunos.find(a => a.id === alunoId);
    return aluno ? aluno.nome_completo : 'Aluno não encontrado';
  };

  return (
    <div className="admin-container">
      <h2>Gerenciar Remédios</h2>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="aluno_id">Aluno:</label>
          <select
            id="aluno_id"
            name="aluno_id"
            value={currentRemedio.aluno_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecione um aluno</option>
            {alunos.map((aluno) => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.nome_completo}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="nome">Nome do Remédio:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={currentRemedio.nome}
            onChange={handleInputChange}
            placeholder="Ex: Insulina, Bombinha para Asma"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição:</label>
          <textarea
            id="descricao"
            name="descricao"
            value={currentRemedio.descricao}
            onChange={handleInputChange}
            placeholder="Para que serve o remédio"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dosagem">Dosagem:</label>
          <input
            type="text"
            id="dosagem"
            name="dosagem"
            value={currentRemedio.dosagem}
            onChange={handleInputChange}
            placeholder="Ex: 10 unidades, 1 comprimido"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="horario">Horário:</label>
          <input
            type="text"
            id="horario"
            name="horario"
            value={currentRemedio.horario}
            onChange={handleInputChange}
            placeholder="Ex: 08:00 e 18:00, Quando necessário"
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
        <h3>Remédios Cadastrados</h3>
        {loading && <p>Carregando...</p>}
        {remedios.length === 0 ? (
          <p>Nenhum remédio cadastrado</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Aluno</th>
                <th>Remédio</th>
                <th>Dosagem</th>
                <th>Horário</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {remedios.map((remedio) => (
                <tr key={remedio.id}>
                  <td>{remedio.id}</td>
                  <td>{getAlunoNome(remedio.aluno_id)}</td>
                  <td>{remedio.nome}</td>
                  <td>{remedio.dosagem}</td>
                  <td>{remedio.horario || 'N/A'}</td>
                  <td className="descricao-cell">
                    {remedio.descricao || 'Sem descrição'}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(remedio)} className="btn-edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(remedio.id)} className="btn-delete">
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

export default RemedioAdmin;
