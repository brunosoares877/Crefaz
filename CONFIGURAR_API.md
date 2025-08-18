# 🔧 Configurar Suas APIs Reais

## 📋 Passo a Passo

### 1. **Editar o arquivo `src/config/environments.ts`**

Localize as linhas 15-18 e substitua pelas suas URLs reais:

```typescript
export const REAL_API_URLS = {
  [ENVIRONMENTS.DEVELOPMENT]: 'http://localhost:3000/api',
  [ENVIRONMENTS.STAGING]: 'https://sua-api-staging.com/api', // ⚠️ SUBSTITUIR
  [ENVIRONMENTS.PRODUCTION]: 'https://sua-api-producao.com/api', // ⚠️ SUBSTITUIR
} as const
```

### 2. **Exemplo de configuração:**

```typescript
export const REAL_API_URLS = {
  [ENVIRONMENTS.DEVELOPMENT]: 'http://localhost:3000/api',
  [ENVIRONMENTS.STAGING]: 'https://api-staging.suaempresa.com/v1',
  [ENVIRONMENTS.PRODUCTION]: 'https://api.suaempresa.com/v1',
} as const
```

### 3. **Endpoints esperados:**

Sua API deve ter estes endpoints:

- **POST** `/leads` - Cadastrar lead
- **POST** `/validar-cpf` - Validar CPF  
- **GET** `/health` - Health check

### 4. **Formato dos dados:**

**POST /leads**
```json
{
  "nome": "João Silva",
  "cpf": "12345678901",
  "dataNascimento": "19900101",
  "whatsapp": "11999999999",
  "companhiaEnergia": "Enel"
}
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Lead cadastrado com sucesso",
  "data": {
    "id": "abc123",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

### 5. **Testar a configuração:**

Após configurar, reinicie o servidor:

```bash
npm run dev
```

E teste o formulário em: `http://localhost:3004`

## 🚨 **IMPORTANTE:**

1. **Substitua as URLs** pelas suas APIs reais
2. **Verifique se os endpoints** estão corretos
3. **Teste a API** antes de usar
4. **Configure CORS** se necessário

## 📞 **Precisa de ajuda?**

Se suas APIs têm formato diferente, me informe:
- URLs das suas APIs
- Formato dos dados
- Endpoints disponíveis
