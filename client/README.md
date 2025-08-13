# Sistema de Gestão de Restaurante

Um sistema completo de gestão de restaurante desenvolvido com React.js e Node.js, oferecendo diferentes perfis de
usuário e funcionalidades específicas para cada papel no restaurante.

## 🚀 Tecnologias Utilizadas

### Backend

-  **Node.js** com Express
-  **TypeScript** para tipagem estática
-  **PostgreSQL** como banco de dados
-  **Prisma ORM** para gerenciamento do banco
-  **JWT** para autenticação
-  **Socket.IO** para atualizações em tempo real
-  **bcryptjs** para criptografia de senhas

### Frontend

-  **React.js** com TypeScript
-  **Redux Toolkit** para gerenciamento de estado
-  **Material-UI** para componentes de interface
-  **TailwindCSS** para estilização
-  **Axios** para requisições HTTP

## 👥 Perfis de Usuário

### 🏨 Recepcionista

-  Registro e gestão de pedidos
-  Controle de mesas e ocupação
-  Fechamento de contas
-  Gestão de reservas
-  Atendimento ao cliente

### 👩‍🍳 Cozinheira

-  Visualização de pedidos em tempo real
-  Atualização de status de preparação
-  Controle de tempo de preparo
-  Gestão de prioridades

### 👨‍💼 Administrador

-  Gestão completa do sistema
-  Relatórios financeiros e operacionais
-  Gerenciamento de usuários
-  Configurações do sistema
-  Controle de estoque e inventário

## 🍽️ Funcionalidades Principais

-  ✅ **Gestão de Mesas**: Controle de ocupação e status das mesas
-  ✅ **Sistema de Pedidos**: Registro, acompanhamento e finalização
-  ✅ **Controle de Estoque**: Gestão de ingredientes e produtos
-  ✅ **Sistema de Pagamentos**: Múltiplas formas de pagamento
-  ✅ **Gestão de Reservas**: Reservas online e presenciais
-  ✅ **Cardápio Digital**: Interface moderna com categorias
-  ✅ **Relatórios**: Analytics e relatórios financeiros
-  ✅ **Feedback**: Sistema de avaliação dos clientes
-  ✅ **Notificações**: Atualizações em tempo real

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

-  **Node.js** (versão 16 ou superior)
-  **PostgreSQL** (versão 12 ou superior)
-  **npm** ou **yarn**

## 🛠️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/victorrony/Restaurante.git
cd Restaurante
```

### 2. Instale as dependências

```bash
# Instala dependências do backend e frontend
npm run install:all
```

### 3. Configure o banco de dados PostgreSQL

#### 3.1. Criar banco de dados

```sql
-- No PostgreSQL, execute:
CREATE DATABASE restaurante_db;
CREATE USER postgres WITH PASSWORD '123456';
GRANT ALL PRIVILEGES ON DATABASE restaurante_db TO postgres;
```

#### 3.2. Configurar variáveis de ambiente

```bash
cd server
```

Crie o arquivo `.env` (ou copie do exemplo):

```env
# Database
DATABASE_URL="postgresql://postgres:123456@localhost:5432/restaurante_db"

# JWT
JWT_SECRET="restaurante_jwt_secret_super_seguro_2024_key_desenvolvimento"
JWT_EXPIRE="7d"

# Server
PORT=5001
NODE_ENV="development"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# CORS
CORS_ORIGIN="http://localhost:3000"
```

### 4. Configure e popule o banco de dados

```bash
cd server

# Gerar cliente Prisma
npx prisma generate

# Criar tabelas no banco
npx prisma db push

# Popular banco com dados iniciais (usuários e mesas)
npm run seed
```

### 5. Execute o projeto

```bash
# Na raiz do projeto, execute ambos os serviços
npm run dev
```

**Ou execute separadamente:**

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm start
```

```bash
# Na raiz do projeto
npm run dev
```

## 🌐 Acesso ao Sistema

-  **Frontend**: http://localhost:3000
-  **Backend API**: http://localhost:5001

### 👤 Usuários de Teste

O sistema já vem com usuários pré-cadastrados para teste:

| Perfil            | Email                    | Senha       | Funcionalidades                  |
| ----------------- | ------------------------ | ----------- | -------------------------------- |
| **Administrador** | admin@restaurante.com    | admin123    | Acesso completo ao sistema       |
| **Recepcionista** | recepcao@restaurante.com | recepcao123 | Gestão de mesas e pedidos        |
| **Cozinheira**    | cozinha@restaurante.com  | cozinha123  | Visualização e status de pedidos |

## 📱 Estrutura do Projeto

```
Restaurante/
├── 📁 client/                 # Frontend React
│   ├── 📁 public/            # Arquivos públicos
│   ├── 📁 src/               # Código fonte
│   │   ├── 📁 components/    # Componentes reutilizáveis
│   │   ├── 📁 pages/         # Páginas da aplicação
│   │   ├── 📁 services/      # Serviços e APIs
│   │   ├── 📁 store/         # Redux store e slices
│   │   └── 📁 types/         # Definições TypeScript
│   └── package.json
├── 📁 server/                # Backend Node.js
│   ├── 📁 prisma/           # Schema e migrações
│   ├── 📁 src/              # Código fonte
│   │   ├── 📁 middleware/   # Middlewares personalizados
│   │   ├── 📁 routes/       # Rotas da API
│   │   └── 📁 lib/          # Configurações e utilitários
│   └── package.json
├── 📄 package.json          # Scripts do monorepo
├── 📄 install.sh            # Script de instalação
└── 📄 README.md
```

## 🔧 Scripts Disponíveis

Na raiz do projeto:

```bash
npm run dev              # Executa frontend e backend simultaneamente
npm run install:all      # Instala dependências de ambos os projetos
npm run build           # Build de produção
npm run start           # Inicia aplicação em produção
```

No diretório `server/`:

```bash
npm run dev             # Inicia servidor em modo desenvolvimento
npm run build           # Build do backend
npm run start           # Inicia servidor em produção
npx prisma studio       # Interface visual do banco de dados
```

No diretório `client/`:

```bash
npm start               # Inicia aplicação React
npm run build           # Build do frontend
npm test                # Executa testes
```

## 🔧 Solução de Problemas

### Erro "EADDRINUSE: address already in use"

```

## 🔌 API Endpoints

### Autenticação

-  `POST /api/auth/login` - Login de usuário
-  `POST /api/auth/register` - Registro de usuário
-  `GET /api/auth/me` - Dados do usuário logado

### Gestão

-  `GET /api/tables` - Listar mesas
-  `GET /api/orders` - Listar pedidos
-  `GET /api/menu` - Cardápio
-  `GET /api/reservations` - Reservas
-  `GET /api/inventory` - Estoque
-  `GET /api/reports` - Relatórios

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte e dúvidas:

-  Abra uma issue no GitHub
-  Entre em contato: victorrony89@gmail.com

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ por Victor Rony**
