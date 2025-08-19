# 🚀 API de Leads - Sistema Completo

## 📋 Visão Geral

Este sistema implementa uma API completa para cadastro e gerenciamento de leads, com suporte a múltiplos ambientes:
- **🏠 Local**: Banco SQLite com Prisma ORM
- **🧪 Staging**: API externa de desenvolvimento
- **🚀 Produção**: API externa de produção

## 🏗️ Arquitetura

- **Frontend**: React + Vite (porta 3000)
- **Backend Local**: Express.js + Prisma (porta 3001)
- **APIs Externas**: Staging e Produção configuradas
- **Banco Local**: SQLite com Prisma ORM
- **Interface Admin**: HTML + JavaScript puro

## 🚀 Como Usar

### 1. Iniciar o Sistema

```bash
# Terminal 1: Frontend (React)
npm run dev

# Terminal 2: Backend Local (opcional)
npm run server
```

### 2. Acessar as Interfaces

- **Formulário de Leads**: http://localhost:3000
- **Painel Administrativo**: http://localhost:3001/admin-panel.html
- **API Health Check**: http://localhost:3001/health

### 3. Alternar Entre Ambientes

No formulário e painel admin, você pode alternar entre:

- **🏠 Local**: Usa o banco SQLite local
- **🧪 Staging**: Usa a API de staging
- **🚀 Produção**: Usa a API de produção

## 📊 Funcionalidades

### Frontend (Formulário)
- ✅ Formulário responsivo com validação
- ✅ Formatação automática de CPF, telefone e data
- ✅ Checkbox de aceite de políticas
- ✅ Integração com WhatsApp
- ✅ Notificações de sucesso/erro
- ✅ **Seletor de ambiente** (Local/Staging/Produção)

### Backend (API)
- ✅ Cadastro de leads no banco local
- ✅ Validação de dados
- ✅ Verificação de CPF duplicado
- ✅ Rastreamento de IP e User-Agent
- ✅ Listagem de leads
- ✅ Atualização de status

### Painel Administrativo
- ✅ Visualização de todos os leads
- ✅ Estatísticas em tempo real
- ✅ Filtros de busca
- ✅ Atualização de status
- ✅ Exportação para CSV
- ✅ Interface responsiva
- ✅ **Seletor de ambiente**

## 🌐 APIs Configuradas

### Local (SQLite)
- **URL**: `http://localhost:3001`
- **Endpoint**: `/api/leads`
- **Banco**: SQLite local

### Staging
- **URL**: `https://8f2cf2e0-f3f6-472f-808e-e9006a830090.mock.pstmn.io`
- **Endpoint**: `/leads`
- **Status**: ✅ Configurado

### Produção
- **URL**: `https://86feaeec-b8ca-4c9c-acb4-bb301e4165f1.mock.pstmn.io`
- **Endpoint**: `/leads`
- **Status**: ✅ Configurado

## 🗄️ Estrutura do Banco

### Tabela: leads (Local)
```sql
- id: String (UUID)
- nome: String
- whatsapp: String
- cpf: String (único)
- dataNascimento: String
- companhiaEnergia: String
- createdAt: DateTime
- updatedAt: DateTime
- status: String (PENDENTE, CONTATADO, CONVERTIDO, DESCARTADO)
- ipAddress: String (opcional)
- userAgent: String (opcional)
- source: String (padrão: "FORMULARIO_WEB")
```

## 🔌 Endpoints da API

### POST /api/leads (Local) ou /leads (Externa)
Cadastra um novo lead

**Request Body:**
```json
{
  "nome": "João Silva",
  "whatsapp": "(11) 99999-9999",
  "cpf": "123.456.789-00",
  "dataNascimento": "15/03/1985",
  "companhiaEnergia": "Enel SP"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead cadastrado com sucesso!",
  "data": {
    "id": "uuid",
    "nome": "João Silva",
    "status": "PENDENTE"
  }
}
```

### GET /api/leads (Local) ou /leads (Externa)
Lista todos os leads

### PATCH /api/leads/:id/status (Local)
Atualiza o status de um lead

## 🛠️ Comandos Úteis

```bash
# Gerar cliente Prisma
npm run db:generate

# Sincronizar banco com schema
npm run db:push

# Abrir Prisma Studio (visualizador do banco)
npm run db:studio

# Iniciar servidor em modo desenvolvimento
npm run server:dev

# Testar APIs externas
node test-external-apis.js

# Testar API local
node test-api.js
```

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="file:./dev.db"
PORT=3001
NODE_ENV=development
```

### Configuração de APIs Externas
As URLs das APIs externas estão configuradas em `src/config/environments.ts`:

```typescript
export const ENVIRONMENTS = {
  staging: {
    url: 'https://8f2cf2e0-f3f6-472f-808e-e9006a830090.mock.pstmn.io',
    // ... outras configurações
  },
  production: {
    url: 'https://86feaeec-b8ca-4c9c-acb4-bb301e4165f1.mock.pstmn.io',
    // ... outras configurações
  }
}
```

## 📱 Fluxo do Sistema

1. **Usuário seleciona ambiente** → Local, Staging ou Produção
2. **Usuário preenche formulário** → Frontend valida dados
3. **Dados enviados para API** → Backend valida e salva
4. **Lead cadastrado com sucesso** → Redirecionamento para WhatsApp
5. **Equipe acessa painel admin** → Visualiza e gerencia leads
6. **Status atualizado** → Acompanhamento do funil de vendas

## 🚨 Tratamento de Erros

- **CPF duplicado**: Retorna erro 409 com mensagem específica
- **Dados inválidos**: Validação no frontend e backend
- **Erro de servidor**: Logs detalhados e mensagens amigáveis
- **Falha na API externa**: Fallback para API local (se configurado)

## 🔒 Segurança

- Validação de entrada em todos os campos
- Sanitização de dados antes de salvar
- Headers de segurança configurados
- CORS configurado para localhost
- Suporte a API keys para APIs externas

## 📈 Próximos Passos

- [x] ✅ Integração com APIs externas
- [x] ✅ Seletor de ambiente
- [ ] Autenticação JWT para painel admin
- [ ] Logs mais detalhados
- [ ] Backup automático do banco
- [ ] Integração com CRM externo
- [ ] Relatórios e analytics
- [ ] Notificações por email/SMS
- [ ] Sincronização entre ambientes

## 🆘 Suporte

Para problemas ou dúvidas:
1. Verifique se o servidor local está rodando
2. Confirme se o banco foi criado (`npm run db:push`)
3. Teste as APIs externas (`node test-external-apis.js`)
4. Verifique os logs do console
5. Teste a API local (`node test-api.js`)

## 🔄 Alternando Ambientes

### Via Interface
- Use os botões no formulário e painel admin
- Ambiente ativo é destacado visualmente
- Mudanças são aplicadas imediatamente

### Via Código
```typescript
import { switchEnvironment } from './src/config/environments'

// Alternar para staging
switchEnvironment('staging')

// Alternar para produção
switchEnvironment('production')

// Voltar para local
switchEnvironment('local')
```

---

**Desenvolvido com ❤️ usando Node.js, Express, Prisma e React**
