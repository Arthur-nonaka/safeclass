-- Script SQL para criar/alterar as tabelas necessárias

-- Tabela de usuários (responsáveis e professores)
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    tipo ENUM('professor', 'responsavel') NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de salas
CREATE TABLE IF NOT EXISTS sala (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    professor_id INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES usuario(id) ON DELETE SET NULL
);

-- Tabela de alunos (com conexão ao responsável)
CREATE TABLE IF NOT EXISTS aluno (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    sala_id INT,
    responsavel_id INT,
    alergias TEXT,
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sala_id) REFERENCES sala(id) ON DELETE SET NULL,
    FOREIGN KEY (responsavel_id) REFERENCES usuario(id) ON DELETE SET NULL,
    INDEX idx_sala_id (sala_id),
    INDEX idx_responsavel_id (responsavel_id)
);

-- Tabela de condições médicas
CREATE TABLE IF NOT EXISTS condicao_medica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de relacionamento aluno-condição médica
CREATE TABLE IF NOT EXISTS usuario_condicao_medica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    condicao_medica_id INT NOT NULL,
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES aluno(id) ON DELETE CASCADE,
    FOREIGN KEY (condicao_medica_id) REFERENCES condicao_medica(id) ON DELETE CASCADE,
    UNIQUE KEY unique_aluno_condicao (aluno_id, condicao_medica_id)
);

-- Tabela de remédios
CREATE TABLE IF NOT EXISTS remedio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    dosagem VARCHAR(100),
    horario VARCHAR(100),
    observacoes TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES aluno(id) ON DELETE CASCADE,
    INDEX idx_aluno_id (aluno_id)
);

-- Tabela de histórico
CREATE TABLE IF NOT EXISTS historico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    descricao TEXT NOT NULL,
    tipo_evento ENUM('crise', 'medicamento', 'observacao', 'ocorrencia') DEFAULT 'observacao',
    gravidade ENUM('baixa', 'media', 'alta') DEFAULT 'baixa',
    professor_id INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES aluno(id) ON DELETE CASCADE,
    FOREIGN KEY (professor_id) REFERENCES usuario(id) ON DELETE SET NULL,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_tipo_evento (tipo_evento),
    INDEX idx_criado_em (criado_em)
);

-- Inserir dados de exemplo

-- Inserir usuários de exemplo
INSERT IGNORE INTO usuario (id, nome_completo, email, senha, tipo) VALUES 
(1, 'Prof. Maria Silva', 'maria.silva@escola.com', '$2b$10$hash_exemplo', 'professor'),
(2, 'João Santos', 'joao.santos@email.com', '$2b$10$hash_exemplo', 'responsavel'),
(3, 'Ana Costa', 'ana.costa@email.com', '$2b$10$hash_exemplo', 'responsavel'),
(4, 'Prof. Carlos Oliveira', 'carlos.oliveira@escola.com', '$2b$10$hash_exemplo', 'professor');

-- Inserir salas de exemplo
INSERT IGNORE INTO sala (id, nome, descricao, professor_id) VALUES 
(1, '1º Ano A', 'Turma do primeiro ano', 1),
(2, '2º Ano B', 'Turma do segundo ano', 4),
(3, '3º Ano C', 'Turma do terceiro ano', 1);

-- Inserir alunos de exemplo (com conexão aos responsáveis)
INSERT IGNORE INTO aluno (id, nome_completo, sala_id, responsavel_id, alergias) VALUES 
(1, 'Pedro Santos', 1, 2, 'Alergia a amendoim'),
(2, 'Mariana Santos', 2, 2, NULL),
(3, 'Gabriel Costa', 1, 3, 'Alergia a lactose'),
(4, 'Isabela Silva', 3, NULL, NULL);

-- Inserir condições médicas de exemplo
INSERT IGNORE INTO condicao_medica (id, nome, descricao) VALUES 
(1, 'Asma', 'Condição respiratória crônica'),
(2, 'Diabetes Tipo 1', 'Diabetes insulino-dependente'),
(3, 'Epilepsia', 'Distúrbio neurológico');

-- Inserir remédios de exemplo
INSERT IGNORE INTO remedio (aluno_id, nome, dosagem, horario) VALUES 
(1, 'Bombinha para Asma', '2 puffs', '8:00 e 14:00'),
(3, 'Insulina', '10UI', 'Antes das refeições');

-- Inserir histórico de exemplo
INSERT IGNORE INTO historico (usuario_id, descricao, tipo_evento, professor_id) VALUES 
(1, 'Aluno teve crise de asma durante educação física', 'crise', 1),
(3, 'Administrada insulina conforme prescrição', 'medicamento', 1);

-- Script para adicionar a coluna responsavel_id na tabela aluno (caso já exista)
-- Descomente as linhas abaixo se a tabela aluno já existe sem a coluna responsavel_id

-- ALTER TABLE aluno ADD COLUMN responsavel_id INT;
-- ALTER TABLE aluno ADD FOREIGN KEY (responsavel_id) REFERENCES usuario(id) ON DELETE SET NULL;
-- ALTER TABLE aluno ADD INDEX idx_responsavel_id (responsavel_id);

-- Verificar os dados inseridos
-- SELECT a.nome_completo, a.alergias, s.nome as sala, u.nome_completo as responsavel 
-- FROM aluno a 
-- LEFT JOIN sala s ON a.sala_id = s.id 
-- LEFT JOIN usuario u ON a.responsavel_id = u.id;
