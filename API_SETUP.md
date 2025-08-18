# Configuração da API

## 📋 Pré-requisitos

- Node.js instalado
- API backend rodando (seja local ou remota)

## 🌍 Ambientes Configurados

O projeto está configurado para trabalhar com 3 ambientes:

| Ambiente | URL | Descrição |
|----------|-----|-----------|
| **Development** | `http://localhost:3000/api` | Ambiente local para desenvolvimento |
| **Staging** | `https://8f2cf2e0-f3f6-472f-808e-e9006a830090.mock.pstmn.io` | Ambiente de testes |
| **Production** | `https://86feaeec-b8ca-4c9c-acb4-bb301e4165f1.mock.pstmn.io` | Ambiente de produção |

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# URL da sua API (opcional - o sistema detecta automaticamente)
VITE_API_URL=http://localhost:3000/api

# Ambiente (opcional - o sistema detecta automaticamente)
NODE_ENV=development
```

### 2. Troca de Ambiente

Para trocar entre ambientes, você pode:

1. **Usar variáveis de ambiente**:
   ```bash
   # Para staging
   NODE_ENV=staging npm run dev
   
   # Para produção
   NODE_ENV=production npm run dev
   ```

2. **Editar diretamente** no arquivo `src/config/environments.ts`

3. **Usar o indicador visual** - uma badge aparece no canto superior esquerdo mostrando o ambiente atual (DEV/STAGING)

### 3. Configuração da API

A API deve ter os seguintes endpoints:

#### POST `/api/leads`
Cadastra um novo lead.

**Request Body:**
```json
{
  "nome": "João Silva",
  "cpf": "12345678901",
  "dataNascimento": "19900101",
  "whatsapp": "11999999999",
  "companhiaEnergia": "Enel"
}
```

**Response (Sucesso):**
```json
{
  "success": true,
  "message": "Lead cadastrado com sucesso",
  "data": {
    "id": "123",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (Erro):**
```json
{
  "success": false,
  "message": "CPF já cadastrado"
}
```

#### POST `/api/validar-cpf` (Opcional)
Valida um CPF.

**Request Body:**
```json
{
  "cpf": "12345678901"
}
```

**Response:**
```json
{
  "success": true,
  "message": "CPF válido",
  "data": {
    "isValid": true
  }
}
```

#### GET `/api/health` (Opcional)
Verifica se a API está funcionando.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🚀 Como Usar

### Iniciar em diferentes ambientes:

```bash
# Development (localhost)
npm run dev

# Staging (testes)
npm run dev:staging

# Production (produção)
npm run dev:prod
```

### Trocar ambiente rapidamente:

```bash
# Trocar para development
npm run env:dev

# Trocar para staging
npm run env:staging

# Trocar para production
npm run env:prod
```

### Build para diferentes ambientes:

```bash
# Build para development
npm run build

# Build para staging
npm run build:staging

# Build para production
npm run build:prod
```

### Testar o formulário:
1. **Preencha os dados** no formulário
2. **Clique em "Simular Valor Liberado"**
3. **Verifique as notificações** de sucesso/erro
4. **Monitore o console** para logs de requisições

## 🔍 Debugging

### Verificar se a API está funcionando:
```javascript
// No console do navegador
import { checkApiHealth } from './src/config/api'
checkApiHealth().then(console.log)
```

### Logs de requisição:
- Abra o DevTools (F12)
- Vá para a aba Network
- Preencha e envie o formulário
- Verifique a requisição para `/api/leads`

## 📝 Estrutura dos Dados

O formulário envia os seguintes dados:

| Campo | Tipo | Formato | Exemplo |
|-------|------|---------|---------|
| nome | string | texto | "João Silva" |
| cpf | string | números | "12345678901" |
| dataNascimento | string | YYYYMMDD | "19900101" |
| whatsapp | string | números | "11999999999" |
| companhiaEnergia | string | texto | "Enel" |

## ⚠️ Observações

- Os dados são formatados automaticamente no frontend
- CPF, telefone e data são limpos antes do envio
- Validações são feitas no frontend e backend
- Notificações aparecem para sucesso e erro
- O formulário é limpo após sucesso

## 🛠️ Personalização

Para personalizar a API:

1. **Alterar endpoints**: Edite `src/config/api.ts`
2. **Modificar validações**: Edite `components/sections/LoanForm.tsx`
3. **Customizar notificações**: Edite `components/ui/Notification.tsx`
4. **Adicionar campos**: Atualize a interface `FormData` em `src/services/api.ts`
