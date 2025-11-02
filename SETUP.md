# 🚀 Guia de Configuração - Sistema de Agendamentos

Este guia detalha passo a passo como configurar e executar o Sistema de Agendamentos.

## 📋 Pré-requisitos

- Node.js instalado (versão 14 ou superior)
- npm instalado (vem com Node.js)

## 🔧 ETAPA 1 - Configuração Inicial do Backend

### 1.1 Navegue até a pasta backend

```bash
cd backend
```

### 1.2 Instale as dependências

```bash
npm install express cors prisma @prisma/client body-parser
```

Isso instalará:
- **express**: Framework web para Node.js
- **cors**: Permite requisições de diferentes origens
- **prisma**: ORM para gerenciar o banco de dados
- **@prisma/client**: Cliente Prisma para acessar o banco
- **body-parser**: Processa dados JSON das requisições

### 1.3 Verifique o schema do Prisma

O arquivo `backend/prisma/schema.prisma` já está configurado com:
- Modelo `Usuario`
- Modelo `Cliente`
- Modelo `Servico`
- Modelo `Agendamento`

Com todos os relacionamentos definidos.

## 🗄️ ETAPA 2 - Configuração do Banco de Dados

### 2.1 Execute a migração do banco de dados

```bash
npx prisma migrate dev --name init
```

Este comando irá:
1. Criar o arquivo SQLite `dev.db` na pasta `prisma/`
2. Criar todas as tabelas conforme o schema
3. Gerar o Prisma Client que será usado no código

**Resultado esperado:**
- Arquivo `backend/prisma/dev.db` será criado
- Pasta `backend/prisma/migrations/` será criada com a migração

### 2.2 Visualize os dados no Prisma Studio

```bash
npx prisma studio
```

Isso abrirá uma interface gráfica em `http://localhost:5555` onde você pode:
- Visualizar todas as tabelas
- Adicionar dados manualmente
- Editar registros existentes
- Testar o banco antes de usar o frontend

## 🖥️ ETAPA 3 - Iniciar o Servidor Backend

### 3.1 Inicie o servidor

Ainda na pasta `backend`, execute:

```bash
node server.js
```

Ou se preferir usar npm:

```bash
npm start
```

**Você verá mensagens como:**
```
🚀 Servidor rodando em http://localhost:3000
📡 API disponível em http://localhost:3000/clientes
📡 API disponível em http://localhost:3000/servicos
📡 API disponível em http://localhost:3000/agendamentos
```

### 3.2 Teste se a API está funcionando

Abra seu navegador ou use curl:

```bash
curl http://localhost:3000
```

Deve retornar uma mensagem JSON confirmando que a API está funcionando.

## 🌐 ETAPA 4 - Abrir o Frontend

### Opção 1: Abrir diretamente no navegador

1. Navegue até a pasta `frontend`
2. Abra o arquivo `index.html` diretamente no navegador

**Nota:** Alguns recursos podem não funcionar por causa da política CORS ao abrir arquivos locais. Use a Opção 2 para melhor experiência.

### Opção 2: Usar um servidor HTTP local

#### Com Python (se instalado):

```bash
cd frontend
python -m http.server 8000
```

Acesse: `http://localhost:8000`

#### Com Node.js http-server:

Se você tem `http-server` instalado globalmente:

```bash
cd frontend
npx http-server -p 8000
```

Acesse: `http://localhost:8000`

#### Com VS Code:

1. Instale a extensão "Live Server"
2. Clique com botão direito em `index.html`
3. Selecione "Open with Live Server"

## 📝 ETAPA 5 - Criar Dados Iniciais (Opcional)

### 5.1 Usando Prisma Studio

1. Execute `npx prisma studio` na pasta `backend`
2. Clique na tabela `Usuario`
3. Adicione um usuário:
   - Nome: "Admin"
   - Email: "admin@teste.com"
   - Senha: "senha123" (por enquanto, sem criptografia)

### 5.2 Usando a API diretamente

Você pode criar dados via requisições HTTP:

```bash
# Criar um cliente
curl -X POST http://localhost:3000/clientes \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","telefone":"(11) 99999-9999","email":"joao@email.com"}'

# Criar um serviço
curl -X POST http://localhost:3000/servicos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Corte de Cabelo","preco":30.00,"duracao":30}'
```

## ✅ Verificação Final

### Checklist:

- [ ] Backend está rodando em `http://localhost:3000`
- [ ] Frontend está acessível
- [ ] Banco de dados SQLite foi criado (`backend/prisma/dev.db`)
- [ ] Prisma Studio está funcionando (opcional)
- [ ] Posso acessar `index.html` e ver o dashboard
- [ ] Posso navegar entre as páginas (Clientes, Serviços, Agendamentos)

## 🔍 Resolução de Problemas

### Erro: "Cannot find module 'express'"

**Solução:** Execute `npm install` na pasta `backend`

### Erro: "Prisma Client hasn't been generated yet"

**Solução:** Execute `npx prisma generate` na pasta `backend`

### Erro: "Port 3000 is already in use"

**Solução:** Altere a porta no arquivo `backend/server.js` (linha `const PORT = 3000;`)

### Frontend não consegue conectar ao backend

**Solução:** 
1. Verifique se o backend está rodando
2. Verifique se a URL no arquivo `frontend/js/api.js` está correta
3. Se estiver usando um servidor HTTP local, certifique-se de que está na mesma porta configurada

### Banco de dados não é criado

**Solução:**
1. Verifique se está na pasta `backend` ao executar os comandos do Prisma
2. Execute `npx prisma migrate dev --name init` novamente
3. Verifique as permissões da pasta

## 🎯 Próximos Passos

Após configurar tudo:

1. **Teste o sistema:**
   - Crie alguns clientes
   - Cadastre alguns serviços
   - Faça alguns agendamentos

2. **Explore o código:**
   - Veja como as rotas estão organizadas em `backend/routes/`
   - Entenda a lógica de negócio em `backend/controllers/`
   - Analise como o frontend faz as requisições em `frontend/js/`

3. **Melhore o sistema:**
   - Implemente autenticação JWT real
   - Adicione validações mais robustas
   - Implemente busca e filtros
   - Adicione paginação nas listagens

## 📚 Estrutura de Arquivos Explicada

```
backend/
├── prisma/
│   ├── schema.prisma      # Define os modelos do banco
│   └── dev.db             # Banco SQLite (criado após migração)
├── routes/                # Define os endpoints HTTP
│   ├── clientes.js        # Rotas /clientes
│   ├── servicos.js        # Rotas /servicos
│   └── agendamentos.js    # Rotas /agendamentos
├── controllers/           # Lógica de negócio
│   ├── clientesController.js
│   ├── servicosController.js
│   └── agendamentosController.js
├── server.js              # Servidor Express principal
└── package.json           # Dependências do projeto

frontend/
├── index.html             # Dashboard principal
├── login.html             # Tela de login
├── clientes.html          # Gerenciamento de clientes
├── servicos.html          # Gerenciamento de serviços
├── agendamentos.html      # Gerenciamento de agendamentos
├── css/                   # Estilos
│   ├── main.css           # Estilos globais
│   ├── login.css          # Estilos do login
│   └── dashboard.css      # Estilos do dashboard
└── js/                    # JavaScript
    ├── api.js             # Cliente HTTP
    ├── login.js           # Lógica de login
    ├── clientes.js        # Lógica de clientes
    ├── servicos.js        # Lógica de serviços
    └── agendamentos.js    # Lógica de agendamentos
```

---

**Pronto!** Seu sistema está configurado e pronto para uso. 🎉

