# API de Leads - Sistema Completo

## Visão Geral

Este sistema implementa uma API completa para cadastro e gerenciamento de leads, com suporte a múltiplos ambientes:
- **Local**: Banco SQLite com Prisma ORM
- **Staging**: API externa de desenvolvimento
- **Produção**: API externa de produção

## Arquitetura

- **Frontend**: React + Vite (porta 3000)
- **Backend Local**: Express.js + Prisma (porta 3001)
- **APIs Externas**: Staging e Produção configuradas
- **Banco Local**: SQLite com Prisma ORM
- **Interface Admin**: HTML + JavaScript puro

## Como Usar

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

- **Local**: Usa o banco SQLite local
- **Staging**: Usa a API de staging
- **Produção**: Usa a API de produção

## Funcionalidades

### Frontend (Formulário)
- Formulário responsivo com validação
- Formatação automática de CPF, telefone e data
- Checkbox de aceite de políticas
- Integração com WhatsApp
- Notificações de sucesso/erro
- **Seletor de ambiente** (Local/Staging/Produção)

### Backend (API)
- Cadastro de leads no banco local
- Validação de dados
- Verificação de CPF duplicado
- Rastreamento de IP e User-Agent
- Listagem de leads
- Atualização de status

### Painel Administrativo
- Visualização de todos os leads
- Estatísticas em tempo real
- Filtros de busca
- Atualização de status
- Exportação para CSV
- Interface responsiva
- **Seletor de ambiente**

## APIs Configuradas

### Local (SQLite)
- **URL**: `http://localhost:3001`
- **Endpoint**: `/api/leads`
- **Banco**: SQLite local

### Staging
- **URL**: `https://8f2cf2e0-f3f6-472f-808e-e9006a830090.mock.pstmn.io`
- **Endpoint**: `/leads`
- **Status**: Configurado

### Produção
- **URL**: `https://86feaeec-b8ca-4c9c-acb4-bb301e4165f1.mock.pstmn.io`
- **Endpoint**: `/leads`
- **Status**: Configurado

## Estrutura do Banco

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
```
