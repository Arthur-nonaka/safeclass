import { useEffect, useState } from "react";
import {
    alunoService,
    salaService,
    usuarioService,
} from "../../services/crudService";
import "./Admin.css";

const AlunoAdmin = () => {
  const [alunos, setAlunos] = useState([]);
  const [salas, setSalas] = useState([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [currentAluno, setCurrentAluno] = useState({
    nome_completo: "",
    sala_id: "",
    alergias: "",
    responsavel_id: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAlunos();
    fetchSalas();
    fetchResponsaveis();
  }, []);

  const fetchAlunos = async () => {
    try {
      setLoading(true);
      const response = await alunoService.getAll();
      console.log("Alunos:", response.data.data);
      setAlunos(response.data.data);
    } catch (error) {
      console.log("Erro ao carregar alunos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalas = async () => {
    try {
      const response = await salaService.getAll();
      setSalas(response.data.data);
    } catch (error) {
      console.log("Erro ao carregar salas: " + error.message);
    }
  };

  const fetchResponsaveis = async () => {
    try {
      const response = await usuarioService.getAll();
      const responsaveisOnly = response.data.data.filter(
        (user) => user.tipo === "responsavel" || user.tipo === "parent"
      );
      setResponsaveis(responsaveisOnly);
    } catch (error) {
      console.error("Erro ao carregar responsáveis:", error);
      console.log("Erro ao carregar responsáveis: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !currentAluno.nome_completo ||
      !currentAluno.sala_id ||
      !currentAluno.responsavel_id
    ) {
      console.log(
        "Preencha todos os campos obrigatórios (nome, sala e responsável)"
      );
      return;
    }

    try {
      setLoading(true);

      if (isEditing) {
        await alunoService.update(currentAluno.id, currentAluno);
        console.log("Aluno atualizado com sucesso!");
      } else {
        await alunoService.create(currentAluno);
        console.log("Aluno criado com sucesso!");
      }

      resetForm();
      fetchAlunos();
    } catch (error) {
      console.log("Erro ao salvar aluno: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (aluno) => {
    setCurrentAluno({
      ...aluno,
      responsavel_id: aluno.responsavel_id || "",
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      try {
        setLoading(true);
        await alunoService.delete(id);
        console.log("Aluno excluído com sucesso!");
        fetchAlunos();
      } catch (error) {
        console.log("Erro ao excluir aluno: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setCurrentAluno({
      nome_completo: "",
      sala_id: "",
      alergias: "",
      responsavel_id: "",
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setCurrentAluno({
      ...currentAluno,
      [e.target.name]: e.target.value,
    });
  };

  const getResponsavelNome = (responsavelId) => {
    const responsavel = responsaveis.find((r) => r.id === responsavelId);
    return responsavel ? responsavel.nome_completo : "Não definido";
  };

  const getSalaNome = (salaId) => {
    const sala = salas.find((s) => s.id === salaId);
    return sala ? sala.nome : "Não definida";
  };

  return (
    <div className="admin-container">
      <h2>Gerenciar Alunos</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Nome Completo *</label>
            <input
              type="text"
              name="nome_completo"
              value={currentAluno.nome_completo}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Sala *</label>
            <select
              name="sala_id"
              value={currentAluno.sala_id}
              onChange={handleInputChange}
              required
              disabled={loading}
            >
              <option value="">Selecione uma sala</option>
              {salas.map((sala) => (
                <option key={sala.id} value={sala.id}>
                  {sala.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Responsável *</label>
            <select
              name="responsavel_id"
              value={currentAluno.responsavel_id}
              onChange={handleInputChange}
              required
              disabled={loading}
            >
              <option value="">Selecione um responsável</option>
              {responsaveis.map((responsavel) => (
                <option key={responsavel.id} value={responsavel.id}>
                  {responsavel.nome_completo} ({responsavel.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Alergias</label>
          <textarea
            name="alergias"
            value={currentAluno.alergias}
            onChange={handleInputChange}
            placeholder="Descreva as alergias do aluno (opcional)"
            rows="3"
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="btn-secondary"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="admin-table">
        <h3>Lista de Alunos</h3>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Sala</th>
                <th>Responsável</th>
                <th>Alergias</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Nenhum aluno encontrado
                  </td>
                </tr>
              ) : (
                alunos.map((aluno) => (
                  <tr key={aluno.id}>
                    <td>{aluno.nome_completo}</td>
                    <td>{getSalaNome(aluno.sala_id)}</td>
                    <td>
                      <span
                        style={{
                          color: aluno.responsavel_id ? "#000" : "#ff6b6b",
                          fontWeight: aluno.responsavel_id ? "normal" : "bold",
                        }}
                      >
                        {getResponsavelNome(aluno.responsavel_id)}
                      </span>
                    </td>
                    <td>
                      {aluno.alergias ? (
                        <span title={aluno.alergias}>
                          {aluno.alergias.length > 30
                            ? aluno.alergias.substring(0, 30) + "..."
                            : aluno.alergias}
                        </span>
                      ) : (
                        <span style={{ color: "#999" }}>Nenhuma</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(aluno)}
                        disabled={loading}
                        className="btn-edit"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(aluno.id)}
                        disabled={loading}
                        className="btn-delete"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AlunoAdmin;
