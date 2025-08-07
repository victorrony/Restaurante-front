# Deploy no Vercel - Instruções

## 📋 Pré-requisitos

1. **Backend funcionando**: Seu backend deve estar hospedado em algum serviço (Railway, Heroku, etc.)
2. **Banco de dados**: PostgreSQL configurado e acessível
3. **Conta no Vercel**: [vercel.com](https://vercel.com)

## 🚀 Passos para Deploy

### 1. Configurar Repositório

-  Certifique-se de que seu código está no GitHub
-  O arquivo `vercel.json` já está configurado

### 2. Conectar no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em "New Project"
3. Selecione seu repositório "Restaurante"
4. Configure conforme abaixo:

### 3. Configurações do Projeto

```
Framework Preset: Other
Root Directory: ./
Build Command: cd client && npm ci && npm run build
Output Directory: client/build
Install Command: cd client && npm ci
```

### 4. Variáveis de Ambiente

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

```bash
# URL do seu backend (substitua pela URL real)
REACT_APP_API_URL=https://seu-backend.railway.app/api
REACT_APP_SOCKET_URL=https://seu-backend.railway.app
```

### 5. Deploy

-  Clique em "Deploy"
-  Aguarde o build completar

## 🔧 Resolução de Problemas

### Erro "react-scripts: command not found" (Vercel)

-  **Causa**: Vercel está tentando executar build na raiz do projeto
-  **Solução**: O arquivo `vercel.json` já resolve isso

### Erro "No start command could be found" (Railway)

-  **Causa**: Railway não encontra comando de start
-  **Solução**: O arquivo `railway.json` e scripts do `package.json` já resolvem isso
-  **Se persistir**: No Railway, vá em Settings > Deploy e configure:
   -  Build Command: `cd server && npm ci && npm run build`
   -  Start Command: `cd server && npm start`

### Erro de API/CORS

-  **Causa**: Backend não configurado para aceitar requests do domínio Vercel
-  **Solução**: Configure CORS no backend para aceitar `*.vercel.app`

### Erro de Environment Variables

-  **Causa**: Variáveis não configuradas no Vercel/Railway
-  **Solução**: Configure as variáveis no painel do serviço

### Erro de Database Connection

-  **Causa**: DATABASE_URL incorreta ou banco não acessível
-  **Solução**: Verifique se o PostgreSQL está funcionando e a URL está correta

## 📝 Backend Deploy no Railway

### Método 1: Deploy do Monorepo (Recomendado)

1. **Conectar no Railway**:

   -  Acesse [railway.app](https://railway.app)
   -  Clique em "New Project"
   -  Selecione "Deploy from GitHub repo"
   -  Escolha seu repositório "Restaurante"

2. **Configurações do Projeto**:

   -  O Railway detectará automaticamente como projeto Node.js
   -  O arquivo `railway.json` já está configurado

3. **Variáveis de Ambiente**: No painel do Railway, configure:

   ```bash
   DATABASE_URL=postgresql://username:password@host:port/database
   JWT_SECRET=seu_jwt_secret_muito_seguro
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://seu-projeto.vercel.app
   PORT=5000
   ```

4. **Database PostgreSQL**:
   -  No Railway, clique em "+ New" > "Database" > "PostgreSQL"
   -  Copie a URL de conexão para `DATABASE_URL`

### Método 2: Deploy Separado (Apenas Backend)

Se quiser fazer deploy apenas do backend:

1. Crie um novo repositório só com a pasta `server`
2. Configure no Railway normalmente

## 🔗 URLs Exemplo

-  **Frontend**: `https://seu-projeto.vercel.app`
-  **Backend**: `https://seu-backend.railway.app`

## ⚠️ Importante

-  Sempre teste localmente antes de fazer deploy
-  Configure HTTPS no backend para evitar problemas de mixed content
-  Use variáveis de ambiente para URLs, nunca hardcode
