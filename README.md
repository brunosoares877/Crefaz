# Sistema de Captação de Leads - Empréstimo Consignado

Sistema completo para captação e gerenciamento de leads para empréstimo consignado, com integração multi-ambiente e painel administrativo.

## ✨ **Funcionalidades**

- **Formulário de Captação** - Interface responsiva para coleta de dados
- **Multi-Ambiente** - Suporte a Local, Staging e Produção
- **Painel Administrativo** - Gerenciamento completo de leads
- **Banco de Dados** - SQLite com Prisma ORM
- **Validações** - CPF duplicado, campos obrigatórios
- **Exportação** - CSV dos dados coletados
- **Responsivo** - Funciona em todos os dispositivos

## Arquitetura

```
├── Frontend (React + Vite)
│   ├── Formulário de captação
│   ├── Seletor de ambiente
│   └── Interface responsiva
├── Backend (Node.js + Express)
│   ├── API REST
│   ├── Validações
│   └── Integração com banco
├── Banco de Dados (SQLite + Prisma)
│   ├── Tabela de leads
│   └── Sistema de status
└── Painel Admin (HTML + JavaScript)
    ├── Visualização de leads
    ├── Atualização de status
    └── Exportação de dados
```

## Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Git

### **1. Clone o repositório**
```bash
git clone <URL_DO_REPOSITORIO>
cd novo-projeto-figma
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure o banco de dados**
```bash
npx prisma generate
npx prisma db push
```

### **4. Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz:
```env
DATABASE_URL="file:./dev.db"
```

## 🎯 **Como Usar**

### **Iniciar o Frontend (Porta 3000)**
```bash
npm run dev
```
Acesse: http://localhost:3000

### **Iniciar o Backend (Porta 3001)**
```bash
npm run server
```
Health Check: http://localhost:3001/health

### **Desenvolvimento com Auto-reload**
```bash
npm run server:dev
```

## Ambientes Disponíveis

| Ambiente | URL | Descrição |
|----------|-----|-----------|
| **Local** | http://localhost:3001 | Desenvolvimento local |
| **Staging** | https://8f2cf2e0-f3f6-472f-808e-e9006a830090.mock.pstmn.io | Testes e homologação |
| **Produção** | https://86feaeec-b8ca-4c9c-acb4-bb301e4165f1.mock.pstmn.io | Ambiente de produção |

## API Endpoints

### **Health Check**
```
GET /health
```

### **Leads**
```
POST /api/leads          # Criar novo lead
GET /api/leads           # Listar todos os leads
PATCH /api/leads/:id/status  # Atualizar status
```

### **Exemplo de Criação de Lead**
```json
{
  "nome": "João Silva",
  "whatsapp": "(11) 99999-9999",
  "cpf": "123.456.789-00",
  "dataNascimento": "15/03/1985",
  "companhiaEnergia": "Enel SP"
}
```

## 🎨 **Estrutura do Projeto**

```
src/
├── components/          # Componentes React
│   ├── layout/         # Header, Footer
│   ├── sections/       # Formulário principal
│   └── ui/            # Componentes reutilizáveis
├── config/             # Configurações
│   └── environments.ts # Configurações de ambiente
├── services/           # Serviços de API
│   └── api.ts         # Cliente HTTP
└── App.tsx            # Componente principal

server-robust.js        # Servidor Express
prisma/                 # Schema e migrações
admin-panel.html        # Painel administrativo
```

## Testes

### **Testar API Local**
```bash
node test-api.js
```

### **Testar APIs Externas**
```bash
node test-external-apis.js
```

## 📱 **Painel Administrativo**

Acesse: http://localhost:3001/admin-panel.html

**Funcionalidades:**
- Estatísticas dos leads
- Busca e filtros
- Atualização de status
- Exportação CSV
- Seletor de ambiente

## Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev              # Frontend
npm run server           # Backend
npm run server:dev       # Backend com nodemon

# Banco de dados
npm run db:generate      # Gerar cliente Prisma
npm run db:push          # Sincronizar schema
npm run db:studio        # Abrir Prisma Studio
npm run db:seed          # Popular banco com dados

# Build
npm run build            # Build de produção
npm run preview          # Preview do build
```

## Status dos Leads

- **PENDENTE** - Lead recém cadastrado
- **CONTATADO** - Lead em processo de contato
- **CONVERTIDO** - Lead convertido em cliente
- **DESCARTADO** - Lead descartado

## 🛡️ **Segurança**

- Validação de CPF duplicado
- Sanitização de dados de entrada
- Rate limiting (configurável)
- Headers de segurança

## Deploy

### **Frontend (Vercel/Netlify)**
```bash
npm run build
# Upload da pasta dist/
```

### **Backend (Railway/Render)**
```bash
# Configurar variáveis de ambiente
npm run server
```

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Suporte

Para dúvidas ou suporte, entre em contato através dos canais disponíveis no projeto.

---

**Desenvolvido com ❤️ para otimizar a captação de leads para empréstimo consignado** 