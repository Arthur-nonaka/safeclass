import { useEffect, useState } from 'react';
import { salaService, usuarioService } from '../../services/crudService';
import './Admin.css';

const UsuarioAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [salas, setSalas] = useState([]);
  const [currentUsuario, setCurrentUsuario] = useState({
    nome_completo: '',
    email: '',
    telefone: '',
    senha: '',
    tipo: 'aluno',
    sala_id: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsuarios();
    fetchSalas();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuarioService.getAll();
      setUsuarios(response.data.data);
    } catch (error) {
      console.log('Erro ao carregar usuários: ' + error.message);
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
    if (!currentUsuario.nome_completo.trim()) {
      console.log('Nome completo é obrigatório');
      return;
    }

    try {
      setLoading(true);
      const userData = {
        ...currentUsuario,
        sala_id: currentUsuario.sala_id || null
      };

      if (isEditing) {
        await usuarioService.update(currentUsuario.id, userData);
        console.log('Usuário atualizado com sucesso!');
      } else {
        await usuarioService.create(userData);
        console.log('Usuário criado com sucesso!');
      }

      resetForm();
      fetchUsuarios();
    } catch (error) {
      console.log('Erro ao salvar usuário: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (usuario) => {
    setCurrentUsuario({
      ...usuario,
      sala_id: usuario.sala_id || ''
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      setLoading(true);
      await usuarioService.delete(id);
      console.log('Usuário excluído com sucesso!');
      fetchUsuarios();
    } catch (error) {
      console.log('Erro ao excluir usuário: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentUsuario({
      nome_completo: '',
      email: '',
      telefone: '',
      tipo: 'aluno',
      sala_id: '',
      senha: ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setCurrentUsuario({
      ...currentUsuario,
      [e.target.name]: e.target.value
    });
  };

  const getSalaNome = (salaId) => {
    const sala = salas.find(s => s.id === salaId);
    return sala ? sala.nome : 'Nenhuma';
  };

  return (
    <div className="admin-container">
      <h2>Gerenciar Usuários</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="nome_completo">Nome Completo:</label>
          <input
            type="text"
            id="nome_completo"
            name="nome_completo"
            value={currentUsuario.nome_completo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={currentUsuario.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={currentUsuario.senha}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefone">Telefone:</label>
          <input
            type="text"
            id="telefone"
            name="telefone"
            value={currentUsuario.telefone}
            onChange={handleInputChange}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipo">Tipo:</label>
          <select
            id="tipo"
            name="tipo"
            value={currentUsuario.tipo}
            onChange={handleInputChange}
            required
          >
            <option value="professor">Professor</option>
            <option value="responsavel">Responsável</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="sala_id">Sala:</label>
          <select
            id="sala_id"
            name="sala_id"
            value={currentUsuario.sala_id}
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
        <h3>Usuários Cadastrados</h3>
        {loading && <p>Carregando...</p>}
        {usuarios.length === 0 ? (
          <p>Nenhum usuário cadastrado</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Tipo</th>
                <th>Sala</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nome_completo}</td>
                  <td>{usuario.email || 'N/A'}</td>
                  <td>{usuario.telefone || 'N/A'}</td>
                  <td className={`tipo-${usuario.tipo}`}>{usuario.tipo}</td>
                  <td>{getSalaNome(usuario.sala_id)}</td>
                  <td>
                    <button onClick={() => handleEdit(usuario)} className="btn-edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(usuario.id)} className="btn-delete">
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

export default UsuarioAdmin;
