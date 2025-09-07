# Tech Stack (Frontend)

Documento detalhado das tecnologias usadas no frontend do Sistema de Gestão de Restaurante.

## 1. Core da Aplicação

| Tecnologia         | Categoria     | Papel no Projeto                                  | Observações                                 |
| ------------------ | ------------- | ------------------------------------------------- | ------------------------------------------- |
| React 18           | UI Library    | Construção da interface em componentes funcionais | Hooks, Suspense, StrictMode                 |
| TypeScript         | Linguagem     | Tipagem estática, segurança e DX                  | Config `strict: true`                       |
| React Router DOM 6 | Rotas SPA     | Navegação entre páginas                           | Rotas aninhadas, lazy loading (se aplicado) |
| Redux Toolkit      | Estado Global | Gerencia slices (auth, menu, pedidos, etc.)       | Simplifica reducers e middleware            |
| React Redux        | Binding       | Conecta Redux aos componentes React               | Hooks `useSelector`, `useDispatch`          |
| Socket.IO Client   | Tempo Real    | Recebe eventos (pedidos, status) do backend       | WebSocket fallback                          |
| Axios              | HTTP Client   | Abstração de requisições REST                     | Interceptors (auth, erros)                  |

## 2. UI e Estilo

| Tecnologia               | Função           | Uso                                        |
| ------------------------ | ---------------- | ------------------------------------------ |
| Material UI (MUI)        | Componentes base | Botões, inputs, grid, diálogos, tema       |
| TailwindCSS              | Utilitários CSS  | Espaçamentos, cores, responsividade rápida |
| Emotion (styled / react) | CSS-in-JS        | Estilização dinâmica no MUI                |
| Recharts                 | Gráficos         | Visualização de métricas (relatórios)      |
| date-fns                 | Datas            | Formatação e cálculos de tempo             |

## 3. Qualidade e Build

| Tecnologia             | Função             | Detalhes                                       |
| ---------------------- | ------------------ | ---------------------------------------------- |
| react-scripts (CRA)    | Toolchain          | Webpack, Babel, Jest, ESLint integrados        |
| TypeScript Compiler    | Checagem de tipos  | Sem emissão de JS (`noEmit`)                   |
| Web Vitals             | Métricas           | Coleta métricas de performance (FCP, LCP, CLS) |
| Autoprefixer / PostCSS | CSS compatível     | Adiciona prefixos e processa diretivas         |
| Tailwind CLI           | Gerador utilitário | Purga classes não usadas no build              |

## 4. Organização de Código

```
src/
├── components/        # Componentes reutilizáveis (UI, formulários, cards)
├── pages/             # Páginas ligadas às rotas
├── services/          # API (axios instancia, chamadas)
├── store/             # Redux store + slices
├── types/             # Tipos globais e modelos
├── index.tsx          # Bootstrap da app
└── App.tsx            # Declaração principal de rotas/layout
```

### Diretórios Principais

-  components/Layout: Layout base, wrappers
-  components/menu: CRUD de itens do cardápio
-  components/orders: UI ligada a pedidos e fluxo de atendimento
-  pages/\*: Entrada de cada módulo funcional
-  services/api.ts: Base Axios e endpoints
-  store/slices: Domínios (auth, menu, orders, etc.)

## 5. Fluxos Importantes

### Autenticação

1. Usuário envia credenciais → endpoint /auth/login
2. Token JWT retornado armazenado (ex: localStorage) ou em slice
3. Interceptor Axios injeta Authorization
4. Slices reagem para atualizar UI

### Pedidos em Tempo Real

1. Conexão Socket.IO estabelecida com backend
2. Evento "order:update" recebido → dispatch em `ordersSlice`
3. UI atualiza grade/listas instantaneamente

### Gestão de Estado (Redux Toolkit)

-  Estrutura típica de slice:

```ts
interface OrdersState {
   list: Order[];
   loading: boolean;
   error?: string;
}
const initialState: OrdersState = { list: [], loading: false };
```

-  Ações assíncronas via `createAsyncThunk`
-  Selectors para derivar dados (ex: pedidos por status)

## 6. Convenções

-  Nomes de componentes: PascalCase
-  Hooks customizados: useAlgo.ts
-  Tipos globais exportados em `types/index.ts`
-  Evitar lógica em JSX extenso → extrair para função/hook

## 7. Estratégia de Estilos

| Camada                  | Uso                           |
| ----------------------- | ----------------------------- |
| MUI Theme               | Paleta, tipografia, overrides |
| Tailwind                | Layout rápido e spacing       |
| CSS Global (index.css)  | Reset/base                    |
| Emotion (`sx` / styled) | Ajustes específicos dinâmicos |

## 8. Performance

-  Code splitting automático (React.lazy se adicionado)
-  Purge Tailwind (remove classes não usadas)
-  Imagens otimizadas manualmente
-  Evitar re-render com memo/selectors

## 9. Acessibilidade (A11y)

-  Componentes MUI já acessíveis
-  Labels em inputs e aria-\* em elementos dinâmicos
-  Contraste mantido na paleta (primário e secundário)

## 10. Variáveis de Ambiente (Build Time)

| Chave                        | Função                |
| ---------------------------- | --------------------- |
| REACT_APP_API_URL            | Base da API REST      |
| REACT_APP_SOCKET_URL         | Endpoint Socket.IO    |
| REACT*APP_ENABLE*\*          | Toggles de features   |
| REACT_APP_MAX_FILE_SIZE      | Limite upload (bytes) |
| REACT_APP_ALLOWED_FILE_TYPES | Mídias permitidas     |
| REACT_APP_DEBUG / LOG_LEVEL  | Verbosidade de logs   |

## 11. Futuras Melhorias Sugeridas

-  Testes unitários (Jest + React Testing Library)
-  PWA (service worker custom)
-  Tema dark completo persistido
-  Internacionalização (i18n)
-  Otimizar bundles (analyzer + splitting por rota)

## 12. Como Extender

| Cenário                  | Passos                                            |
| ------------------------ | ------------------------------------------------- |
| Novo módulo (ex: Cupons) | Criar slice + página + rotas + componentes        |
| Novo gráfico             | Adicionar componente Recharts + selector derivado |
| Novo evento realtime     | Registrar listener Socket.IO + ação Redux         |

---

Se algo não estiver documentado, abra uma issue ou complemente este arquivo.
