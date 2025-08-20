# FinançasCRM - CRM Web Completo para Gestão Financeira

Um sistema CRM web moderno e completo para gestão de finanças pessoais e empresariais, com tema escuro elegante, dashboard interativo e gráficos financeiros avançados.

## ✨ Funcionalidades Principais

### 🔐 Autenticação e Usuários
- Cadastro, login e recuperação de senha
- Níveis de permissão (admin, usuário)
- Autenticação via JWT segura

### 💰 Gestão de Transações
- Cadastrar receitas e despesas
- Categorias personalizáveis
- Vincular transações a contas (banco, carteira, cartão)
- Importar extratos CSV/Excel
- Filtros avançados por data, categoria e conta

### Orçamentos
- Criar orçamentos mensais por categoria
- Comparar orçado x realizado
- Alertas automáticos ao atingir 80% e 100%

### 🎯 Metas Financeiras
- Criar metas com valor e prazo
- Acompanhar progresso em gráficos
- Notificações de conquistas

### 📈 Relatórios e Gráficos
- Fluxo de caixa mensal
- Gráfico de pizza por categorias
- Evolução de saldo no tempo
- Projeção de saldo para 24 meses
- Gráficos interativos com Recharts

### 🎨 Dashboard Interativo
- KPIs principais: Receitas, Despesas, Saldo líquido
- Cards interativos e responsivos
- Tema Dark Mode com preto (#0a0a0a) e azul marinho (#0b1b3b)
- Gráficos dinâmicos e responsivos

### 📤 Exportação e Backup
- Exportar dados em PDF e JSON
- Download de relatórios filtrados
- Backup automático dos dados

### ⚙️ Configurações
- Alterar tema da aplicação
- Gerenciar contas e categorias
- Definir moeda e formato de data
- Personalização completa

## Stack de Desenvolvimento

### Frontend
- **React 18** + TypeScript
- **TailwindCSS** para estilização
- **Recharts** para gráficos
- **React Router** para navegação
- **React Hook Form** para formulários
- **Axios** para requisições HTTP
- **Lucide React** para ícones

### Backend
- **Node.js** + Express
- **Prisma** como ORM
- **PostgreSQL** como banco de dados
- **JWT** para autenticação
- **Bcrypt** para hash de senhas
- **Multer** para upload de arquivos
- **Express Validator** para validações

## Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/financas-crm.git
cd financas-crm
```

### 2. Instale as dependências
```bash
npm run install:all
```

### 3. Configure o banco de dados
```bash
# Crie um banco PostgreSQL
createdb financas_crm

# Configure as variáveis de ambiente
cp backend/env.example backend/.env
```

Edite o arquivo `backend/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/financas_crm"
JWT_SECRET="sua-chave-secreta-aqui"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

### 4. Configure o banco de dados
```bash
# Gere o cliente Prisma
npm run db:generate

# Execute as migrações
npm run db:push

# Popule com dados de exemplo
npm run db:seed
```

### 5. Inicie o desenvolvimento
```bash
# Inicia backend e frontend simultaneamente
npm run dev
```

O sistema estará disponível em:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## Credenciais de Acesso

Após executar o seed, você pode acessar com:

### Usuário Admin
- **Email**: admin@financas.com
- **Senha**: admin123

### Usuário Teste
- **Email**: user@financas.com
- **Senha**: user123

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- 📱 Dispositivos móveis
- 💻 Tablets
- 🖥️ Desktops
- 🖥️ Telas grandes

## 🎨 Tema Visual

### Cores Principais
- **Fundo**: #0a0a0a (preto)
- **Azul marinho**: #0b1b3b
- **Azul claro**: #1e40af
- **Verde**: #059669 (sucesso)
- **Vermelho**: #dc2626 (erro)
- **Roxo**: #7c3aed (destaque)

### Características
- Design moderno e minimalista
- Animações suaves e responsivas
- Tipografia Inter para melhor legibilidade
- Ícones Lucide para consistência visual

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia backend e frontend
npm run dev:backend      # Apenas backend
npm run dev:frontend     # Apenas frontend

# Banco de dados
npm run db:generate      # Gera cliente Prisma
npm run db:push          # Executa migrações
npm run db:seed          # Popula com dados de exemplo

# Build
npm run build            # Build do frontend
npm run build:frontend   # Build do frontend
```

## 📁 Estrutura do Projeto

```
financas-crm/
├── backend/                 # Backend Node.js
│   ├── src/
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares
│   │   └── server.js       # Servidor principal
│   ├── prisma/             # Schema e migrações
│   └── package.json
├── frontend/                # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── contexts/       # Contextos React
│   │   ├── services/       # Serviços de API
│   │   └── App.tsx         # Componente principal
│   ├── public/              # Arquivos estáticos
│   └── package.json
├── package.json             # Scripts do monorepo
└── README.md
```

## 🌟 Recursos Avançados

### Gráficos Interativos
- Gráfico de pizza para categorias
- Gráfico de linha para evolução temporal
- Gráfico de barras para comparações
- Tooltips informativos
- Responsivos em todos os dispositivos

### Sistema de Alertas
- Alertas de orçamento (80% e 100%)
- Notificações em tempo real
- Sistema de cores para diferentes níveis

### Importação de Dados
- Suporte a arquivos CSV
- Suporte a arquivos Excel
- Validação automática de dados
- Mapeamento inteligente de colunas

### Exportação
- Relatórios em PDF
- Dados em JSON
- Filtros personalizáveis
- Histórico de exportações

## Segurança

- Autenticação JWT segura
- Hash de senhas com bcrypt
- Validação de entrada em todas as rotas
- Rate limiting para prevenir ataques
- CORS configurado adequadamente
- Headers de segurança com Helmet

## Deploy

### Backend
```bash
# Produção
npm run build:backend
npm start
```

### Frontend
```bash
# Build para produção
npm run build:frontend

# Os arquivos estarão em frontend/dist/
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Bruno Soares**
- Email: brunosoares877@gmail.com
- GitHub: [@brunosoares877](https://github.com/brunosoares877)

## 🙏 Agradecimentos

- Comunidade React
- Equipe do TailwindCSS
- Desenvolvedores do Recharts
- Comunidade Prisma
- Todos os contribuidores

---

⭐ **Se este projeto te ajudou, considere dar uma estrela!** ⭐
