# Frontend – Sistema de Gestão de Restaurante

Aplicação web (SPA) desenvolvida em **React + TypeScript** para gestão operacional de um restaurante: pedidos, mesas,
cardápio, reservas, feedback, inventário, relatórios e usuários. Este README descreve APENAS o frontend.

## 🚀 Stack Principal

-  React 18 (CRA / react-scripts)
-  TypeScript
-  Redux Toolkit (estado global)
-  React Router DOM (navegação)
-  Material UI + TailwindCSS (UI & estilos utilitários)
-  Axios (HTTP)
-  Socket.IO Client (tempo real)

## ✅ Funcionalidades (Interface)

-  Autenticação e controle de sessão
-  Dashboard com visão geral (pedidos, mesas, faturamento, etc.)
-  Gestão de Cardápio (CRUD de itens)
-  Pedidos em tempo real (atualização via WebSocket)
-  Gestão de Mesas (estado: livre, ocupada, reservada)
-  Reservas (listagem e status)
-  Inventário / Estoque (itens e quantidades)
-  Relatórios (visão analítica – consumo, vendas)
-  Feedback de clientes
-  Tema customizado (MUI Theme)

## 🌐 Integração com Backend

O frontend consome uma API hospedada (ex: Railway). Configure as variáveis de ambiente (build-time) para apontar para o
backend correto.

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` (não versionado) dentro de `client/` (ou configure no painel da Vercel):

```
REACT_APP_API_URL=https://restaurante-back-production.up.railway.app/api
REACT_APP_SOCKET_URL=https://restaurante-back-production.up.railway.app
REACT_APP_NAME=Sistema de Gestão de Restaurante
REACT_APP_VERSION=1.0.0
REACT_APP_MAX_FILE_SIZE=5242880
REACT_APP_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_SOUND=true
REACT_APP_ENABLE_DARK_MODE=true
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=production
NODE_ENV=production
GENERATE_SOURCEMAP=false
```

Observação: Variáveis que começam com `REACT_APP_` são embutidas no bundle – não coloque segredos.

## � Estrutura

```
client/
├── public/                 # index.html, manifest, favicon
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Layout/
│   │   ├── menu/
│   │   └── orders/
│   ├── pages/              # Páginas (rotas)
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Menu/
│   │   ├── Orders/
│   │   ├── Inventory/
│   │   ├── Reports/
│   │   ├── Reservations/
│   │   ├── Tables/
│   │   └── Users/
│   ├── services/           # Axios / API abstraction
│   ├── store/              # Redux store + slices
│   ├── types/              # Tipagens globais
│   ├── index.tsx           # Entrada ReactDOM
│   └── App.tsx             # App root
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## 🔧 Scripts (dentro de `client/`)

```bash
npm start          # Desenvolvimento (http://localhost:3000)
npm run build      # Build produção (gera /build)
npm test           # Testes (se configurados)
npm run eject      # (Irreversível) expõe configs do CRA
```

## 🛠 Instalação Local

```bash
git clone https://github.com/victorrony/Restaurante-front.git
cd Restaurante-front/client
npm install
cp .env.example .env   # Ajuste as variáveis
npm start
```

## 🧪 Qualidade / Boas Práticas

-  Tipagem estrita (`strict: true` no TS)
-  Slices organizados por domínio (`store/slices/*`)
-  Evitar lógica pesada em componentes – preferir hooks ou services
-  Preferir componentes stateless + containers quando necessário

## 🤝 Contribuição

1. Fork
2. Branch: `feat/nome-da-feature`
3. Commit: `feat: descrição curta`
4. Pull Request

## � Licença

MIT – use livremente citando o autor.

---

Desenvolvido com ❤️ por **Victor Rony**
