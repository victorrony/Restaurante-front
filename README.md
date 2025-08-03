# Sistema de Gestão de Restaurante

Um sistema completo de gestão de restaurante com diferentes perfis de usuário (Recepcionista, Cozinheira, Administrador).

## Funcionalidades

### 👥 Perfis de Usuário
- **Recepcionista**: Registro de pedidos, gestão de mesas, fechamento de contas
- **Cozinheira**: Visualização de pedidos, atualização de status de preparação
- **Administrador**: Gestão completa do sistema, relatórios, configurações

### 🍽️ Funcionalidades Principais
- ✅ Gestão de mesas e pedidos
- ✅ Controle de estoque e inventário
- ✅ Sistema de pagamentos
- ✅ Gestão de reservas
- ✅ Cardápio digital com QR Code
- ✅ Feedback de clientes
- ✅ Relatórios e análises
- ✅ Integração com delivery
- ✅ Monitoramento em tempo real

## 🚀 Tecnologias Utilizadas

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT para autenticação
- Socket.IO para atualizações em tempo real

### Frontend
- React.js + TypeScript
- TailwindCSS + Material-UI
- Redux Toolkit para gerenciamento de estado
- React Router para navegação

## 📦 Instalação e Configuração

1. **Clone o repositório e instale as dependências:**
```bash
npm run install:all
```

2. **Configure o banco de dados:**
```bash
cd server
cp .env.example .env
# Configure as variáveis de ambiente no arquivo .env
npx prisma generate
npx prisma db push
```

3. **Execute o projeto:**
```bash
npm run dev
```

## 🌐 Acesso ao Sistema

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Usuários Padrão
- **Admin**: admin@restaurante.com / admin123
- **Recepcionista**: recepcao@restaurante.com / recepcao123
- **Cozinheira**: cozinha@restaurante.com / cozinha123

## 📱 Estrutura do Projeto

```
sistema-gestao-restaurante/
├── client/          # Frontend React
├── server/          # Backend Node.js
├── docs/           # Documentação
└── README.md
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa frontend e backend em modo desenvolvimento
- `npm run build` - Build de produção
- `npm run setup` - Configuração inicial completa

## 📄 Licença

MIT License - Victor Rony
