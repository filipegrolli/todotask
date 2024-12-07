# TaskList - ReactJS

Este é um projeto de lista de tarefas (TaskList) desenvolvido com **ReactJS** e **Firebase**. Utilizando **Typescript**. Ele oferece uma interface simples e amigável para gerenciar suas tarefas diárias.

---

## 🚀 Recursos

- Adicionar, editar e excluir tarefas.
- Upload de arquivos e integração com o Firebase Storage.
- Autenticação com Firebase Authentication.
- Persistência de dados com Firestore.
- Interface amigável e responsiva.

---

## 📋 Pré-requisitos

Certifique-se de que você tenha os seguintes softwares instalados em seu ambiente:

- **Node.js** (v16 ou superior)
- **npm** ou **yarn**
- **Firebase Project** configurado

---

## 🛠️ Configuração do Ambiente

1. **Clone este repositório**:
   ```bash
   git clone https://github.com/filipegrolli/todotask.git
   cd todotask
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configuração do Firebase**:
   (É possível realizar o acesso mantendo os arquivos de configuração existentes. Contudo, o indicado é atualizar os acessos com seus dados próprios. Um usuário existente é "email=ttt@ttt.com" e "senha=ttt123". De qualquer forma, é possível cadastrar novos usuários e/ou realizar o login via Google.
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
   - Ative Firestore, Firebase Authentication e Storage.
   - Baixe o arquivo de configuração `firebaseConfig` do seu projeto e substitua as credenciais no arquivo `src/FirebaseConnection.ts`:
     ```typescript
     const firebaseConfig = {
       apiKey: "SUA_API_KEY",
       authDomain: "SEU_AUTH_DOMAIN",
       projectId: "SEU_PROJECT_ID",
       storageBucket: "SEU_STORAGE_BUCKET",
       messagingSenderId: "SEU_MESSAGING_SENDER_ID",
       appId: "SEU_APP_ID"
     };
     ```

---

## ▶️ Executando o Projeto

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

2. Abra o navegador e acesse:
   ```
   http://localhost:5173
   ```

---

## 🧪 Executando os Testes

O projeto utiliza **Jest** e **React Testing Library** para testes.

1. Execute os testes:
   ```bash
   npm test
   # ou
   yarn test
   ```

2. Certifique-se de que todos os testes estão passando antes de prosseguir.

---

## 🛠️ Estrutura do Projeto

- `src/`
  - `components/`: Componentes reutilizáveis.
  - `pages/`: Páginas principais da aplicação.
  - `FirebaseConnection.ts`: Configurações do Firebase.
  - `routes/`: Arquivos de rotas.
  - `__mocks__/`: Mocks de teste.

---


## 🔧 Problemas Conhecidos

1. **Erro com Jest e Firebase**: Caso enfrente erros relacionados a transformações de módulos, ajuste o arquivo `jest.config.js` conforme descrito abaixo:
   ```javascript
   module.exports = {
     transformIgnorePatterns: [
       'node_modules/(?!@firebase|firebase)',
     ],
   };
   ```

2. **Erro com ESM/ESM Modules**: Certifique-se de usar extensões apropriadas (`.cjs` ou `.mjs`) e ajustar o campo `"type"` no `package.json`, se necessário.

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🧑‍💻 Autor

Feito com ❤️ por **[Filipe Grolli](https://github.com/seu-usuario)**. Entre em contato para sugestões e feedbacks!

---
