# 🖥️ AWLSRV Login Hub - UI

Interface administrativa para gerenciamento de infraestrutura do Identity Provider (IdP).
Este painel é utilizado exclusivamente pelo **Super Admin** para provisionar empresas (Tenants) e seus usuários iniciais.

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,ts,vite,bootstrap,html,css" />
  </a>
</p>

---

## 🏗️ Estrutura do Projeto

O sistema segue uma arquitetura modular baseada em **Componentes e Serviços**, garantindo separação de responsabilidades:

- **`src/pages`**: Telas principais (Login, Dashboard, Formulários).
- **`src/services`**: Camada de comunicação com a API (Axios). Interceptadores de token e tratamento de erros.
- **`src/components`**: Componentes reutilizáveis (Modais, Cards, Layouts).
- **`src/types`**: Definições de tipagem TypeScript compartilhadas (Interfaces de User, Company, DTOs).
- **`src/routes`**: Configuração de rotas e proteção de acesso (Guards).

---

## ✨ Funcionalidades Principais

### 🔐 1. Acesso Super Admin (Infraestrutura)
- Login seguro via **Master Key** (definida em variáveis de ambiente).
- Proteção de rotas via `SessionStorage` e `LocalStorage`.
- Logout seguro com confirmação visual.

### 🏢 2. Gestão de Multi-Tenants (Empresas)
- Listagem completa de empresas cadastradas.
- Visualização rápida de status (Ativo/Inativo).
- **Provisionamento:** Criação de nova empresa + Usuário Admin em um único fluxo.
- Métricas em tempo real (Total de Admins vs Usuários por empresa).

### 👥 3. Gestão de Usuários
- Listagem de usuários vinculados a uma empresa específica.
- Criação de credenciais de acesso (Email/Senha) para consumo em APIs externas.
- Diferenciação visual de cargos (Admin vs User).

---

## 🛠️ Tecnologias Utilizadas

| Tech | Função |
|------|--------|
| **Vite** | Build tool rápida e HMR (Hot Module Replacement) |
| **React** | Biblioteca de UI baseada em componentes |
| **TypeScript** | Tipagem estática para segurança do código |
| **Axios** | Cliente HTTP para consumo da API REST |
| **React Router** | Navegação SPA (Single Page Application) |
| **React Hook Form** | Gerenciamento performático de formulários |
| **Bootstrap 5** | Estilização responsiva e componentes base |
| **Bootstrap Icons** | Iconografia do sistema |

---

## 🚀 Instalação e Execução

### 1. Pré-requisitos
Certifique-se de que o Backend (`AWLSRV Login Hub API`) esteja rodando.

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto:
```bash
# URL do Backend (API Gateway)
VITE_API_URL=http://localhost:3000/api

# Chave Mestra para Login no Painel (Deve ser igual ao do Backend)
VITE_MASTER_KEY=sua_chave_secreta_aqui
```

### 4. Rodar o Projeto
```bash
npm run dev
```