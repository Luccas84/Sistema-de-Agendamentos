# 🗓️ Sistema de Agendamentos (Local, Fullstack)

# Meu Projeto

Bem-vindo ao meu projeto!

![Logo do Projeto](https://github.com/Luccas84/Sistema-de-Agendamentos/blob/main/Projeto_17.png)

Projeto completo e funcional de um Sistema de Agendamentos para uso 100% local, com backend em Node/Express, banco SQLite via Prisma ORM e frontend em HTML/CSS/JS (Vanilla). O design utiliza paleta preto/cinza/azul e ícones Boxicons.

## 📁 Estrutura do Projeto

```
sistema-agendamentos/
│
├─ backend/                      # API REST com Express
│  ├─ prisma/
│  │  ├─ schema.prisma          # Schema do banco (Prisma + SQLite)
│  │  └─ seed.js                # Seed opcional com dados iniciais
│  ├─ routes/                   # Rotas HTTP (CRUD)
│  │  ├─ clientes.js
│  │  ├─ servicos.js
│  │  └─ agendamentos.js
│  ├─ controllers/              # Lógica de negócio (Prisma Client)
│  │  ├─ clientesController.js
│  │  ├─ servicosController.js
│  │  └─ agendamentosController.js
│  ├─ server.js                 # Servidor Express + middlewares
│  └─ package.json              # Dependências e scripts npm
│
├─ frontend/                    # Interface Web local
│  ├─ index.html                # Dashboard com métricas e navegação
│  ├─ login.html                # Login/Registro (simulado)
│  ├─ clientes.html             # CRUD de clientes
│  ├─ servicos.html             # CRUD de serviços
│  ├─ agendamentos.html         # CRUD de agendamentos
│  ├─ css/
│  │  ├─ main.css               # Estilos globais (cards, tabelas, botões)
│  │  ├─ login.css              # Estilos da tela de login
│  │  └─ dashboard.css          # Estilos do dashboard
│  └─ js/
│     ├─ api.js                 # Cliente HTTP centralizado
│     ├─ login.js               # Lógica de login/registro (simulada)
│     ├─ clientes.js            # Lógica da página de clientes
│     ├─ servicos.js            # Lógica da página de serviços
│     └─ agendamentos.js        # Lógica da página de agendamentos
│
├─ SETUP.md                     # Guia passo a passo (detalhado)
└─ README.md                    # Este guia completo de uso
```

## 🧰 Requisitos
- Node.js 16+ (recomendado 18+)
- npm (vem com o Node.js)

## 🚀 Como rodar (passo a passo)

1) Instalar dependências do backend:
```bash
cd backend
npm install
```

2) Inicializar banco e gerar Prisma Client:
```bash
npx prisma migrate dev --name init
```
Este comando cria o arquivo SQLite `backend/prisma/dev.db` e gera o Prisma Client.

3) (Opcional) Popular dados iniciais:
```bash
npm run seed
```
Cria um usuário admin, alguns clientes/serviços e 1 agendamento de exemplo.

4) Iniciar o servidor API:
```bash
npm start
```
Servidor em: `http://localhost:3000`

5) Abrir o frontend:
- Clique duas vezes em `frontend/index.html` (pode funcionar direto) ou
- Use um servidor local (recomendado) e acesse `http://localhost:8000`:
```bash
cd ../frontend
python -m http.server 8000  # se tiver Python instalado
# ou
npx http-server -p 8000     # se tiver http-server disponível
```

## 🔌 Endpoints da API (REST)

Base URL: `http://localhost:3000`

Clientes (`/clientes`):
- GET `/clientes` — Lista clientes
- GET `/clientes/:id` — Busca cliente por ID
- POST `/clientes` — Cria cliente `{ nome, telefone, email? }`
- PUT `/clientes/:id` — Atualiza cliente
- DELETE `/clientes/:id` — Remove cliente

Serviços (`/servicos`):
- GET `/servicos` — Lista serviços
- GET `/servicos/:id` — Busca serviço por ID
- POST `/servicos` — Cria serviço `{ nome, preco, duracao }`
- PUT `/servicos/:id` — Atualiza serviço
- DELETE `/servicos/:id` — Remove serviço

Agendamentos (`/agendamentos`):
- GET `/agendamentos` — Lista agendamentos (inclui cliente, serviço e usuário)
- GET `/agendamentos/:id` — Busca agendamento por ID (com relações)
- POST `/agendamentos` — Cria agendamento `{ data, status?, clienteId, servicoId, usuarioId }`
- PUT `/agendamentos/:id` — Atualiza agendamento (data/status/cliente/serviço)
- DELETE `/agendamentos/:id` — Remove agendamento

## 🧪 Exemplos (curl)

Criar cliente:
```bash
curl -X POST http://localhost:3000/clientes \
  -H "Content-Type: application/json" \
  -d '{"nome":"João da Silva","telefone":"(11) 90000-0000","email":"joao@exemplo.com"}'
```

Criar serviço:
```bash
curl -X POST http://localhost:3000/servicos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Corte de Cabelo","preco":30.0,"duracao":30}'
```

Criar agendamento:
```bash
curl -X POST http://localhost:3000/agendamentos \
  -H "Content-Type: application/json" \
  -d '{"data":"2025-01-15T10:30:00.000Z","status":"pendente","clienteId":1,"servicoId":1,"usuarioId":1}'
```

## 🎨 Design do Frontend
- Paleta: preto, cinza, branco e azul.
- Tipografia: Poppins, Montserrat.
- Layout: cards com sombra, hover suave, dashboard com cabeçalho e navegação.
- Ícones: Boxicons (importados via CDN no `<head>` de cada página):
  ```html
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
  ```

## 🧱 Arquitetura do Backend
- `server.js`: configura o Express, `cors`, `body-parser` e registra rotas.
- `routes/*.js`: define endpoints por recurso, encaminhando para controllers.
- `controllers/*.js`: validações simples, uso do Prisma Client e tratamento de erros.
- `prisma/schema.prisma`: modelos `Usuario`, `Cliente`, `Servico`, `Agendamento` com relações.
- `prisma/seed.js`: cria dados iniciais (executado via `npm run seed`).

## 🗄️ Modelos (Prisma + SQLite)
- `Usuario(id, nome, email, senha)` 1—N `Agendamento`
- `Cliente(id, nome, telefone, email?)` 1—N `Agendamento`
- `Servico(id, nome, preco, duracao)` 1—N `Agendamento`
- `Agendamento(id, data, status, clienteId, servicoId, usuarioId)`

Gerar/atualizar client do Prisma:
```bash
npx prisma generate
```

Abrir o Prisma Studio (GUI local):
```bash
npx prisma studio
```

## 🔐 Autenticação
- Neste MVP o login é simulado no `frontend/login.html` e `frontend/js/login.js` (sem JWT).
- Futuro: implementar JWT no backend, rotas protegidas e persistência do usuário.

## 🧷 Scripts úteis (package.json)
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "seed": "node prisma/seed.js"
  },
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

## 🔍 Troubleshooting
- "Cannot find module 'express'": rode `npm install` em `backend`.
- "Prisma Client hasn't been generated yet": `npx prisma generate`.
- Porta 3000 ocupada: altere `const PORT = 3000;` em `backend/server.js`.
- Frontend não conversa com backend: verifique se a API está rodando e se as URLs em `frontend/js/api.js` e páginas estão apontando para `http://localhost:3000`.
- Banco não cria: rode `npx prisma migrate dev --name init` dentro de `backend`.

## ✅ Checklist de Execução
- [ ] Instalei dependências do backend (`npm install`)
- [ ] Migrei o banco (`npx prisma migrate dev --name init`)
- [ ] Rodei o seed (`npm run seed`) (opcional)
- [ ] Subi o backend (`npm start`)
- [ ] Abri o frontend (`index.html` ou via servidor local)
- [ ] Consigo criar clientes/serviços/agendamentos

## 📜 Licença
Projeto de exemplo educativo. Livre para adaptar e evoluir.

