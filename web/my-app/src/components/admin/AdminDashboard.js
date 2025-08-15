import { useState } from 'react';
import './AdminDashboard.css';
import AlunoAdmin from './AlunoAdmin';
import CondicaoMedicaAdmin from './CondicaoMedicaAdmin';
import HistoricoAdmin from './HistoricoAdmin';
import RelacionamentoAdmin from './RelacionamentoAdmin';
import RemedioAdmin from './RemedioAdmin';
import SalaAdmin from './SalaAdmin';
import UsuarioAdmin from './UsuarioAdmin';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('relacionamentos');

  const tabs = [
    { id: 'salas', label: 'Salas', component: SalaAdmin },
    { id: 'usuarios', label: 'Usuários', component: UsuarioAdmin },
    { id: 'alunos', label: 'Alunos', component: AlunoAdmin },
    { id: 'relacionamentos', label: 'Relacionamentos Aluno-Condição', component: RelacionamentoAdmin },
    { id: 'condicoes', label: 'Condições Médicas', component: CondicaoMedicaAdmin },
    { id: 'remedios', label: 'Remédios', component: RemedioAdmin },
    { id: 'historico', label: 'Histórico', component: HistoricoAdmin },
  ];

  const renderActiveComponent = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    if (activeTabData) {
      const Component = activeTabData.component;
      return <Component />;
    }
    return null;
  };

  return (
    <div className="admin-dashboard">
      <nav className="dashboard-nav">
        <div className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="dashboard-content">
        {renderActiveComponent()}
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2025 SafeClass - Sistema de Gerenciamento Escolar</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
