# SafeClass Mobile App - Integração com API

Este documento explica como configurar e usar o aplicativo mobile SafeClass com integração à API.

## 🚀 Funcionalidades Implementadas

### Para Professores
- **Login**: Autenticação via email/senha
- **Visualização de Salas**: Lista todas as salas de aula
- **Alunos por Sala**: Visualiza alunos de uma sala específica
- **Histórico do Aluno**: Mostra o histórico médico/eventos de cada aluno
- **Logout**: Encerra a sessão

### Para Responsáveis
- **Login**: Autenticação via email/senha
- **Filhos**: Lista todos os filhos vinculados ao responsável
- **Remédios**: Visualiza medicamentos de todos os filhos
- **Crises**: Mostra histórico de crises/emergências dos filhos
- **Logout**: Encerra a sessão

## 🔧 Configuração

### 1. Configurar URL da API

Edite o arquivo `config/index.ts` e altere a URL base da API:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://SEU_SERVIDOR:PORTA/api', // Altere aqui
  TIMEOUT: 10000,
  // ...
};
```

**Exemplos de URLs:**
- Desenvolvimento local: `http://localhost:3001/api`
- Servidor de teste: `http://192.168.1.100:3001/api`
- Produção: `https://api.safeclass.com/api`

### 2. Instalar Dependências (se necessário)

```bash
npm install
# ou
yarn install
```

### 3. Executar o App

```bash
npx expo start
```

## 📱 Como Usar

### Tela de Login
1. Selecione o tipo de usuário (Professor ou Responsável)
2. Digite email e senha
3. Toque em "ENTRAR"

### Professor - Fluxo de Navegação
1. **Turmas** → Lista salas disponíveis
2. **Alunos** → Mostra alunos da sala selecionada
3. **Histórico** → Exibe eventos do aluno selecionado

### Responsável - Fluxo de Navegação
1. **Filhos** → Lista filhos vinculados
2. **Remédios** → Medicamentos de todos os filhos
3. **Crises** → Histórico de emergências

## 🛠️ Estrutura de Arquivos

```
services/
├── api.ts              # Serviço principal da API
types/
├── api.ts              # Interfaces TypeScript
config/
├── index.ts            # Configurações do app
app/
├── index.tsx           # Tela de login
├── teacher/
│   └── index.tsx       # Dashboard do professor
└── parent/
    └── index.tsx       # Dashboard do responsável
```

## 🔌 Endpoints da API Utilizados

### Autenticação
- `POST /api/auth/login` - Login de usuário

### Dados do Usuário
- `GET /api/usuarios/profile` - Perfil do usuário logado

### Para Professores
- `GET /api/salas` - Lista salas
- `GET /api/alunos/sala/:id` - Alunos por sala
- `GET /api/historico/usuario/:id` - Histórico do aluno

### Para Responsáveis
- `GET /api/responsavel-filho/responsavel/:id` - Filhos do responsável
- `GET /api/remedios/aluno/:id` - Remédios por aluno
- `GET /api/historico/usuario/:id` - Histórico/crises do aluno

## ⚠️ Importante

### Autenticação
- O token JWT é armazenado temporariamente na memória
- Para produção, implemente AsyncStorage:

```typescript
// Instalar primeiro: npm install @react-native-async-storage/async-storage

import AsyncStorage from '@react-native-async-storage/async-storage';

// No lugar do authToken simples, use:
await AsyncStorage.setItem('authToken', token);
const token = await AsyncStorage.getItem('authToken');
```

### Tratamento de Erros
- Verifique se a API está rodando
- Confirme a URL no arquivo de configuração
- Veja os logs no console para debugs

### Dados Mock vs Reais
- O app agora usa dados reais da API
- Removidos os arrays estáticos de teste
- Implementado loading states

## 🐛 Resolução de Problemas

### "Network request failed"
- Verifique se a API está rodando
- Confirme a URL base no `config/index.ts`
- Para emulador Android, use IP da máquina: `http://10.0.2.2:3001/api`

### "Login failed"
- Verifique credenciais no banco de dados
- Confirme se o endpoint `/auth/login` existe
- Veja logs da API para erros

### Dados não carregam
- Verifique se o usuário tem permissões
- Confirme relacionamentos no banco (responsavel_filho, etc.)
- Veja console para logs de erro

## 🔐 Segurança

### Produção
1. Use HTTPS na API
2. Implemente refresh tokens
3. Configure timeouts adequados
4. Valide dados do usuário

### Desenvolvimento
1. Nunca commite senhas no código
2. Use variáveis de ambiente para URLs
3. Implemente logs para debugging

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs do console
2. Confirme se a API está respondendo
3. Teste endpoints manualmente (Postman/Insomnia)

---

**SafeClass Mobile** - Conectando escola, professores e famílias através da tecnologia.
