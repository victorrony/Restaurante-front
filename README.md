# Sistema de Gestão de Restaurante

Um sistema completo de gestão de restaurante desenvolvido com React.js e Node.js, oferecendo diferentes perfis de usuário e funcionalidades específicas para cada papel no restaurante.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com Express
- **TypeScript** para tipagem estática
- **PostgreSQL** como banco de dados
- **Prisma ORM** para gerenciamento do banco
- **JWT** para autenticação
- **Socket.IO** para atualizações em tempo real
- **bcryptjs** para criptografia de senhas

### Frontend
- **React.js** com TypeScript
- **Redux Toolkit** para gerenciamento de estado
- **Material-UI** para componentes de interface
- **TailwindCSS** para estilização
- **Axios** para requisições HTTP

## 👥 Perfis de Usuário

### 🏨 Recepcionista
- Registro e gestão de pedidos
- Controle de mesas e ocupação
- Fechamento de contas
- Gestão de reservas
- Atendimento ao cliente

### 👩‍🍳 Cozinheira
- Visualização de pedidos em tempo real
- Atualização de status de preparação
- Controle de tempo de preparo
- Gestão de prioridades

### 👨‍💼 Administrador
- Gestão completa do sistema
- Relatórios financeiros e operacionais
- Gerenciamento de usuários
- Configurações do sistema
- Controle de estoque e inventário

## 🍽️ Funcionalidades Principais

- ✅ **Gestão de Mesas**: Controle de ocupação e status das mesas
- ✅ **Sistema de Pedidos**: Registro, acompanhamento e finalização
- ✅ **Controle de Estoque**: Gestão de ingredientes e produtos
- ✅ **Sistema de Pagamentos**: Múltiplas formas de pagamento
- ✅ **Gestão de Reservas**: Reservas online e presenciais
- ✅ **Cardápio Digital**: Interface moderna com categorias
- ✅ **Relatórios**: Analytics e relatórios financeiros
- ✅ **Feedback**: Sistema de avaliação dos clientes
- ✅ **Notificações**: Atualizações em tempo real
## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **PostgreSQL** (versão 12 ou superior)
- **npm** ou **yarn**

## � Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd Restaurante
```

### 2. Instale as dependências
```bash
# Instala dependências do backend e frontend
npm run install:all
```

### 3. Configure o banco de dados

Crie um banco PostgreSQL e configure as variáveis de ambiente:

```bash
cd server
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/restaurante_db"
JWT_SECRET="seu_jwt_secret_aqui"
NODE_ENV="development"
PORT=5000
```

### 4. Execute as migrações do banco
```bash
cd server
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. Execute o projeto
```bash
# Na raiz do projeto
npm run dev
```

## 🌐 Acesso ao Sistema

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Documentação da API**: http://localhost:5000/api/docs

### 👤 Usuários de Teste

O sistema já vem com usuários pré-cadastrados para teste:

| Perfil | Email | Senha | Funcionalidades |
|--------|-------|-------|----------------|
| **Administrador** | admin@restaurante.com | admin123 | Acesso completo ao sistema |
| **Recepcionista** | recepcao@restaurante.com | recepcao123 | Gestão de mesas e pedidos |
| **Cozinheira** | cozinha@restaurante.com | cozinha123 | Visualização e status de pedidos |

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

## 🔌 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário
- `GET /api/auth/me` - Dados do usuário logado

### Gestão
- `GET /api/tables` - Listar mesas
- `GET /api/orders` - Listar pedidos
- `GET /api/menu` - Cardápio
- `GET /api/reservations` - Reservas
- `GET /api/inventory` - Estoque
- `GET /api/reports` - Relatórios

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Entre em contato: victor.rony@email.com

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ por Victor Rony**
