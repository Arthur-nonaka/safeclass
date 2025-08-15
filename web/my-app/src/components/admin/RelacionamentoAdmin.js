import { useEffect, useState } from "react";
import {
    alunoService,
    condicaoMedicaService,
    relacionamentoService,
} from "../../services/relacionamentoService";
import "./Admin.css";

const RelacionamentoAdmin = () => {
  const [relacionamentos, setRelacionamentos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [condicoes, setCondicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedAluno, setSelectedAluno] = useState("");
  const [selectedCondicao, setSelectedCondicao] = useState("");

  const [alunoDetalhes, setAlunoDetalhes] = useState(null);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [relacionamentosRes, alunosRes, condicoesRes] = await Promise.all([
        relacionamentoService.getAll(),
        alunoService.getAll(),
        condicaoMedicaService.getAll(),
      ]);

      console.log(relacionamentosRes.data.data);

      setRelacionamentos(relacionamentosRes.data.data || []);
      setAlunos(alunosRes.data.data || []);
      setCondicoes(condicoesRes.data.data || []);
      setError("");
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Erro ao carregar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRelacionamento = async (e) => {
    e.preventDefault();

    if (!selectedAluno || !selectedCondicao) {
      setError("Selecione um aluno e uma condição médica");
      return;
    }

    const exists = relacionamentos.some(
      (rel) =>
        rel.aluno_id === parseInt(selectedAluno) &&
        rel.condicao_id === parseInt(selectedCondicao)
    );

    if (exists) {
      setError("Este relacionamento já existe");
      return;
    }

    try {
      setLoading(true);
      await relacionamentoService.create(selectedAluno, selectedCondicao);

      setSelectedAluno("");
      setSelectedCondicao("");
      setError("");

      fetchData();
    } catch (error) {
      console.error("Erro ao criar relacionamento:", error);
      setError("Erro ao criar relacionamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRelacionamento = async (alunoId, condicaoId) => {
    if (
      !window.confirm(
        "Tem certeza que deseja remover esta condição médica do aluno?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await relacionamentoService.delete(alunoId, condicaoId);

      fetchData();
    } catch (error) {
      console.error("Erro ao remover relacionamento:", error);
      setError("Erro ao remover relacionamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewAlunoDetalhes = async (alunoId) => {
    try {
      setLoading(true);
      const response = await relacionamentoService.getByAluno(alunoId);
      const aluno = alunos.find((a) => a.id === alunoId);

      setAlunoDetalhes({
        ...aluno,
        condicoes: response.data.data || [],
      });
      setShowDetalhesModal(true);
    } catch (error) {
      console.error("Erro ao carregar detalhes do aluno:", error);
      setError("Erro ao carregar detalhes do aluno");
    } finally {
      setLoading(false);
    }
  };

  // Agrupar relacionamentos por aluno
  const relacionamentosPorAluno = relacionamentos.reduce(
    (acc, rel) => {
      if (!acc[rel.aluno_id]) {
        acc[rel.aluno_id] = {
          aluno_id: rel.aluno_id,
          aluno_nome: rel.aluno_nome,
          condicoes: [],
        };
      }
      acc[rel.aluno_id].condicoes.push({
        condicao_id: rel.condicao_id,
        condicao_nome: rel.condicao_nome,
        condicao_descricao: rel.condicao_descricao,
      });
      return acc;
    },
    {}
  );

  return (
    <div className="admin-container">
      <h2>Gerenciar Condições Médicas dos Alunos</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-section">

        <form onSubmit={handleCreateRelacionamento} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="aluno">Aluno:</label>
              <select
                id="aluno"
                value={selectedAluno}
                onChange={(e) => setSelectedAluno(e.target.value)}
                required
              >
                <option value="">Selecione um aluno</option>
                {alunos.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.nome_completo} - {aluno.sala_nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="condicao">Condição Médica:</label>
              <select
                id="condicao"
                value={selectedCondicao}
                onChange={(e) => setSelectedCondicao(e.target.value)}
                required
              >
                <option value="">Selecione uma condição</option>
                {condicoes.map((condicao) => (
                  <option key={condicao.id} value={condicao.id}>
                    {condicao.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <button type="submit" disabled={loading}>
                {loading ? "Adicionando..." : "Adicionar Relacionamento"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="admin-list">

        {loading && <p>Carregando...</p>}

        {Object.keys(relacionamentosPorAluno).length === 0 ? (
          <div className="empty-state">
            <p>Nenhum relacionamento encontrado</p>
            <p>Adicione condições médicas aos alunos usando o formulário acima.</p>
          </div>
        ) : (
          <div className="alunos-cards-grid">
            {Object.values(relacionamentosPorAluno).map((grupo) => (
              <div key={grupo.aluno_id} className="aluno-card">
                <div className="aluno-card-header">
                  <h4>{grupo.aluno_nome}</h4>
                  <span className="condicoes-count">
                    {grupo.condicoes.length} condição{grupo.condicoes.length !== 1 ? 'ões' : ''}
                  </span>
                </div>

                <div className="condicoes-list-card">
                  {grupo.condicoes.map((condicao, index) => (
                    <div key={condicao.condicao_id} className="condicao-item-card">
                      <div className="condicao-info-card">
                        <span className="condicao-nome">{condicao.condicao_nome}</span>
                        {condicao.condicao_descricao && (
                          <p className="condicao-preview">
                            {condicao.condicao_descricao.substring(0, 80)}
                            {condicao.condicao_descricao.length > 80 && '...'}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          handleDeleteRelacionamento(
                            grupo.aluno_id,
                            condicao.condicao_id
                          )
                        }
                        className="btn-remove-small"
                        disabled={loading}
                        title="Remover condição"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RelacionamentoAdmin;
