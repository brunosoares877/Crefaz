# Integração API Crefaz On

Este documento explica como usar a integração com a API Crefaz On implementada no projeto.

## 📋 Visão Geral

A integração com a API Crefaz On foi implementada com as seguintes funcionalidades:

- ✅ **Autenticação OAuth2** - Sistema seguro de autenticação
- ✅ **Cliente HTTP** - Axios com interceptors para requisições automáticas
- ✅ **Gestão de Leads** - CRUD completo de leads
- ✅ **Gestão de Documentos** - Upload, aprovação e download de documentos
- ✅ **Gestão de Propostas** - Criação, simulação e aprovação de propostas
- ✅ **Gestão de Contratos** - Contratos, parcelas e cobrança
- ✅ **Gestão de Clientes** - CRUD completo com análise de crédito
- ✅ **Gestão de Produtos** - Listagem e simulação de produtos financeiros
- ✅ **Gestão de Usuários** - Controle de acesso e permissões
- ✅ **Dashboard Executivo** - Métricas em tempo real e indicadores
- ✅ **Tipos TypeScript** - Tipagem completa para todas as entidades
- ✅ **Configuração de Ambiente** - Suporte para staging e production
- ✅ **Interface de Demonstração** - Componentes React para testar a API

## 🚀 Como Usar

### 1. Configuração das Credenciais

As credenciais estão configuradas em `src/config/env.ts`:

```typescript
export const ENV_CONFIG = {
  CREFAZ_STAGING_CLIENT_ID: '8f2cf2e0-f3f6-472f-808e-e9006a830090',
  CREFAZ_PRODUCTION_CLIENT_ID: '86feaeec-b8ca-4c9c-acb4-bb301e4165f1',
  CREFAZ_ENVIRONMENT: 'staging' // ou 'production'
}
```

### 2. Usando os Serviços

#### Importação Centralizada
```typescript
import { 
  leadsService, 
  clientsService, 
  proposalsService,
  contractsService,
  documentsService,
  productsService,
  usersService,
  setGlobalEnvironment 
} from './services'
```

#### Serviço de Leads
```typescript
// Criar um novo lead
const novoLead = await leadsService.createLead({
  nome: 'João Silva',
  cpf: '12345678901',
  email: 'joao@email.com',
  telefone: '(11) 99999-9999',
  origem: 'SITE_WEB'
})

// Buscar leads com filtros
const leads = await leadsService.getLeads({
  status: ['novo', 'contatado'],
  limit: 20
})

// Converter lead em cliente
await leadsService.convertLead(leadId)
```

#### Serviço de Clientes
```typescript
// Criar cliente
const cliente = await clientsService.createClient({
  nome: 'Maria Santos',
  cpf: '98765432100',
  email: 'maria@email.com',
  rendaMensal: 5000
})

// Analisar score de crédito
const score = await clientsService.analyzeCreditScore(clienteId)
```

#### Serviço de Propostas
```typescript
// Simular proposta
const simulacao = await proposalsService.simulateProposal({
  produtoId: 'prod-123',
  valorSolicitado: 10000,
  prazoMeses: 24
})

// Criar proposta
const proposta = await proposalsService.createProposal({
  clienteId: 'client-123',
  produtoId: 'prod-123',
  valorSolicitado: 10000,
  prazoMeses: 24,
  dataVencimento: '2024-12-31'
})
```

#### Serviço de Documentos
```typescript
// Upload de arquivo
const documento = await documentsService.uploadFile(
  file, // File object
  'comprovante_renda',
  'client-123',
  'cliente'
)

// Aprovar documento
await documentsService.approveDocument(documentoId, 'Documento aprovado')
```

#### Serviço de Contratos
```typescript
// Criar contrato a partir de proposta
const contrato = await contractsService.createContract({
  propostaId: 'prop-123',
  dataVencimento: '2025-12-31'
})

// Ativar contrato
await contractsService.activateContract(contratoId, '2024-01-15')

// Registrar pagamento de parcela
await contractsService.payInstallment(
  contratoId, 
  parcelaId, 
  {
    valorPago: 500.00,
    dataPagamento: '2024-01-10'
  }
)

// Obter parcelas em atraso
const atrasadas = await contractsService.getOverdueInstallments(30)

// Gerar boleto
const boleto = await contractsService.generateInstallmentBoleto(contratoId, parcelaId)
```

### 3. Interfaces de Demonstração

#### Dashboard Executivo
Acesse através do botão "📊 Dashboard" no header da aplicação.

Funcionalidades:
- ✅ Métricas em tempo real de todos os serviços
- ✅ Indicadores de performance (conversão, aprovação, etc.)
- ✅ Leads recentes e propostas pendentes
- ✅ Status da conexão e informações do token
- ✅ Atualização automática dos dados

#### Demo da API de Leads
Acesse através do botão "🔗 API Demo" no header da aplicação.

Funcionalidades:
- ✅ Testar conexão com a API
- ✅ Criar novos leads
- ✅ Listar leads existentes
- ✅ Atualizar status dos leads
- ✅ Visualizar informações do token de autenticação

## 🏗️ Arquitetura da Integração

### Estrutura de Arquivos

```
src/
├── config/
│   ├── environments.ts      # Configurações de ambiente
│   └── env.ts              # Variáveis de ambiente
├── services/
│   ├── crefazApiClient.ts  # Cliente HTTP com OAuth2
│   ├── leadsService.ts     # Serviço de leads
│   ├── documentsService.ts # Serviço de documentos
│   ├── proposalsService.ts # Serviço de propostas
│   ├── clientsService.ts   # Serviço de clientes
│   ├── contractsService.ts # Serviço de contratos
│   ├── productsService.ts  # Serviço de produtos
│   ├── usersService.ts     # Serviço de usuários
│   └── index.ts           # Exportação centralizada
├── types/
│   └── crefazApi.ts        # Tipos TypeScript da API
├── components/
│   ├── CrefazLeadsDemo.tsx # Componente demo de leads
│   └── CrefazDashboard.tsx # Dashboard executivo
└── examples/
    └── leadsExample.ts     # Exemplos de uso
```

### Cliente HTTP (`crefazApiClient.ts`)

O cliente HTTP implementa:

- **Autenticação Automática**: OAuth2 com renovação automática de tokens
- **Interceptors**: Adiciona automaticamente o token Bearer nas requisições
- **Tratamento de Erros**: Retry automático em caso de token expirado
- **Logging**: Logs detalhados para desenvolvimento
- **Rate Limiting**: Respeita os limites da API (1000 req/min)

### Serviços Implementados

#### **Leads** (`leadsService.ts`)
- CRUD completo de leads
- Conversão para clientes
- Gestão de tags e status
- Métricas e relatórios

#### **Documentos** (`documentsService.ts`)
- Upload de arquivos (base64)
- Aprovação/rejeição
- Download e gestão
- Validações de tipo e tamanho

#### **Propostas** (`proposalsService.ts`)
- CRUD de propostas
- Simulações financeiras
- Aprovação/rejeição
- Geração de contratos

#### **Clientes** (`clientsService.ts`)
- CRUD completo
- Análise de score de crédito
- Comunicação (SMS/Email)
- Histórico e relacionamentos

#### **Contratos** (`contractsService.ts`)
- Gestão completa de contratos
- Controle de parcelas
- Pagamentos e cobrança
- Geração de boletos e extratos

#### **Produtos** (`productsService.ts`)
- Listagem e filtros
- Simulações de financiamento
- Categorização por tipos

#### **Usuários** (`usersService.ts`)
- Gestão de usuários
- Controle de roles e permissões
- Ativação/desativação

## 🔧 Configuração de Ambiente

### Staging
- **Client ID**: `8f2cf2e0-f3f6-472f-808e-e9006a830090`
- **Base URL**: `https://api.crefaz.com.br`
- **Logs**: Habilitados

### Production
- **Client ID**: `86feaeec-b8ca-4c9c-acb4-bb301e4165f1`
- **Base URL**: `https://api.crefaz.com.br`
- **Logs**: Desabilitados

### Alterar Ambiente

```typescript
import { setEnvironment } from './config/env'
import { leadsService } from './services/leadsService'

// Alterar para produção
setEnvironment('production')
leadsService.setEnvironment('production')
```

## 📝 Tipos TypeScript

Todos os tipos estão definidos em `src/types/crefazApi.ts`:

```typescript
interface Lead {
  id: string
  nome: string
  cpf: string
  email?: string
  telefone?: string
  whatsapp?: string
  status: LeadStatus
  origem: string
  observacoes?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

type LeadStatus = 'novo' | 'contatado' | 'interessado' | 'proposta_enviada' | 'convertido' | 'perdido' | 'descartado'
```

## 🧪 Testando a Integração

### 1. Via Interface Web
- Acesse a página "API Demo" no header
- Teste a conexão com o botão "Testar Conexão"
- Crie leads de teste
- Observe os logs no console do navegador

### 2. Via Código
```typescript
import { executarExemplos } from './examples/leadsExample'

// Executar todos os exemplos
await executarExemplos()
```

### 3. Verificar Status da API
```typescript
import { crefazApi } from './services/crefazApiClient'

// Health check
const isHealthy = await crefazApi.healthCheck()

// Informações do token
const tokenInfo = crefazApi.getTokenInfo()
console.log('Token válido:', tokenInfo.isValid)
```

## 🚨 Tratamento de Erros

A integração inclui tratamento robusto de erros:

```typescript
try {
  const lead = await leadsService.createLead(dadosLead)
} catch (error) {
  // Erros são automaticamente formatados e logados
  console.error('Erro ao criar lead:', error.message)
}
```

Tipos de erro tratados:
- **401 Unauthorized**: Token expirado (renovação automática)
- **429 Too Many Requests**: Rate limiting
- **400 Bad Request**: Dados inválidos
- **500 Internal Server Error**: Erro do servidor
- **Network Error**: Problemas de conectividade

## 🔄 Próximos Passos

Para expandir a integração, implemente os outros serviços:

1. **Documentos** (`documentsService.ts`)
2. **Propostas** (`proposalsService.ts`)
3. **Clientes** (`clientsService.ts`)
4. **Contratos** (`contractsService.ts`)
5. **Usuários** (`usersService.ts`)
6. **Produtos** (`productsService.ts`)

Cada serviço seguirá o mesmo padrão do `leadsService.ts`.

## 📚 Recursos Adicionais

- **Documentação da API**: Fornecida pelo usuário
- **Postman Collection**: Pode ser criada baseada nos tipos TypeScript
- **Testes Unitários**: Implementar com Jest/Vitest
- **Monitoramento**: Adicionar métricas de performance

## 🔐 Segurança

- ✅ Tokens são armazenados apenas em memória
- ✅ HTTPS obrigatório para todas as requisições
- ✅ Client secrets não expostos no frontend
- ✅ Logs de desenvolvimento não incluem dados sensíveis
- ✅ Rate limiting respeitado automaticamente

## 🎯 Status da Implementação

### ✅ Concluído
- [x] **Estrutura base da API** - Cliente HTTP com OAuth2
- [x] **Autenticação OAuth2** - Renovação automática de tokens
- [x] **Cliente HTTP** - Interceptors e tratamento de erros
- [x] **Serviço de Leads** - CRUD completo com conversão
- [x] **Serviço de Documentos** - Upload, aprovação e download
- [x] **Serviço de Propostas** - Criação, simulação e aprovação
- [x] **Serviço de Clientes** - CRUD com análise de crédito
- [x] **Serviço de Produtos** - Listagem e simulação
- [x] **Serviço de Usuários** - Gestão de acesso
- [x] **Dashboard Executivo** - Métricas em tempo real
- [x] **Tipos TypeScript** - Tipagem completa
- [x] **Interfaces de demonstração** - Dashboard + API Demo
- [x] **Documentação completa** - Guias e referências
- [x] **Arquivo de índice** - Exportação centralizada

### 🔄 Próximos Passos Sugeridos
- [ ] **Testes unitários** - Jest/Vitest para todos os serviços
- [ ] **Cache de dados** - Redis ou localStorage
- [ ] **Sincronização offline** - Service Workers
- [ ] **Webhooks** - Eventos em tempo real
- [ ] **Exportação de dados** - Excel, PDF, CSV
- [ ] **Relatórios avançados** - Charts e gráficos
- [ ] **Notificações push** - Alertas em tempo real
- [ ] **Auditoria** - Log de ações dos usuários

### 📋 Melhorias Futuras
- [ ] **Performance** - Lazy loading e paginação otimizada
- [ ] **Segurança** - Criptografia adicional
- [ ] **Monitoramento** - Métricas de performance
- [ ] **Backup** - Estratégias de recuperação
- [ ] **Escalabilidade** - Suporte a múltiplas instâncias

---

**Desenvolvido por**: Sistema de Integração Crefaz On
**Versão**: 1.0.0
**Data**: Setembro 2024
