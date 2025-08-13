# SafeClass - Painel Administrativo Web

Sistema CRUD completo para gerenciamento escolar com foco em segurança e cuidados médicos dos alunos.

## 🚀 Funcionalidades

### Gerenciamento de Dados
- **Salas**: Criação e gerenciamento de salas de aula
- **Usuários**: Gestão de professores, alunos e responsáveis
- **Alunos**: Cadastro específico de alunos
- **Condições Médicas**: Registro de condições médicas dos alunos
- **Remédios**: Controle de medicamentos por aluno
- **Histórico**: Registro de eventos e ocorrências

### Características do Sistema
- Interface responsiva e intuitiva
- Validação de formulários
- Confirmação para exclusões
- Relacionamentos entre tabelas
- Busca e filtragem de dados

## 🛠️ Tecnologias Utilizadas

- **React** 19.1.1
- **Axios** para requisições HTTP
- **CSS3** com design responsivo
- **JavaScript ES6+**

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn
- API backend rodando (com as rotas configuradas)

## 🔧 Instalação e Configuração

1. **Clone o repositório**
   ```bash
   git clone [url-do-repositorio]
   cd safeclass/web/my-app
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure a URL da API**
   Edite o arquivo `src/services/api.js` e ajuste a URL base:
   ```javascript
   const API_BASE_URL = 'http://localhost:3001/api'; // Sua URL aqui
   ```

4. **Execute o projeto**
   ```bash
   npm start
   ```

   A aplicação será aberta em `http://localhost:3000`

## 🌐 Estrutura da API

O sistema espera que sua API tenha as seguintes rotas:

### Salas
- `GET /api/salas` - Listar todas as salas
- `POST /api/salas` - Criar nova sala
- `PUT /api/salas/:id` - Atualizar sala
- `DELETE /api/salas/:id` - Excluir sala

### Usuários
- `GET /api/usuarios` - Listar todos os usuários
- `POST /api/usuarios` - Criar novo usuário
- `PUT /api/usuarios/:id` - Atualizar usuário
- `DELETE /api/usuarios/:id` - Excluir usuário

### Alunos
- `GET /api/alunos` - Listar todos os alunos
- `POST /api/alunos` - Criar novo aluno
- `PUT /api/alunos/:id` - Atualizar aluno
- `DELETE /api/alunos/:id` - Excluir aluno

### Condições Médicas
- `GET /api/condicoes-medicas` - Listar condições
- `POST /api/condicoes-medicas` - Criar condição
- `PUT /api/condicoes-medicas/:id` - Atualizar condição
- `DELETE /api/condicoes-medicas/:id` - Excluir condição

### Remédios
- `GET /api/remedios` - Listar remédios
- `POST /api/remedios` - Criar remédio
- `PUT /api/remedios/:id` - Atualizar remédio
- `DELETE /api/remedios/:id` - Excluir remédio

### Histórico
- `GET /api/historico` - Listar histórico
- `POST /api/historico` - Criar entrada no histórico
- `PUT /api/historico/:id` - Atualizar histórico
- `DELETE /api/historico/:id` - Excluir entrada

## 📱 Interface do Usuário

### Dashboard Principal
- Navegação por abas para cada seção
- Design responsivo para mobile e desktop
- Indicadores visuais para tipos de usuário

### Formulários
- Validação em tempo real
- Campos obrigatórios marcados
- Seleção de relacionamentos (dropdowns)
- Modo de edição e criação

### Tabelas
- Listagem paginada de dados
- Ações de editar e excluir
- Responsividade para telas pequenas
- Formatação de dados (datas, tipos)

## 🎨 Personalização

### Cores e Tema
Os estilos podem ser personalizados editando:
- `src/components/admin/Admin.css` - Estilos dos componentes CRUD
- `src/components/admin/AdminDashboard.css` - Estilos do dashboard

### Adicionando Novas Seções
1. Crie o serviço em `src/services/crudService.js`
2. Crie o componente CRUD em `src/components/admin/`
3. Adicione a aba no `AdminDashboard.js`

## 🔒 Segurança

- Validação de dados no frontend
- Confirmação para ações destrutivas
- Tratamento de erros da API
- Sanitização de inputs

## 📚 Estrutura de Pastas

```
src/
├── components/
│   └── admin/
│       ├── AdminDashboard.js     # Dashboard principal
│       ├── AdminDashboard.css    # Estilos do dashboard
│       ├── Admin.css             # Estilos compartilhados
│       ├── SalaAdmin.js          # CRUD de salas
│       ├── UsuarioAdmin.js       # CRUD de usuários
│       ├── AlunoAdmin.js         # CRUD de alunos
│       ├── CondicaoMedicaAdmin.js # CRUD de condições
│       ├── RemedioAdmin.js       # CRUD de remédios
│       └── HistoricoAdmin.js     # CRUD de histórico
├── services/
│   ├── api.js                   # Configuração do Axios
│   └── crudService.js           # Serviços da API
├── App.js                       # Componente principal
├── App.css                      # Estilos globais
└── index.js                     # Entry point
```

## 🐛 Resolução de Problemas

### Erro de Conexão com API
- Verifique se a API está rodando
- Confirme a URL base no arquivo `api.js`
- Verifique CORS no backend

### Problemas de Estilo
- Limpe o cache do navegador
- Verifique importações dos CSS
- Teste em modo incógnito

### Dados não Carregam
- Abra o Console do desenvolvedor
- Verifique logs de erro
- Confirme estrutura de resposta da API

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Entre em contato com a equipe de desenvolvimento

---

**SafeClass** - Cuidando da segurança e bem-estar dos alunos através da tecnologia.
