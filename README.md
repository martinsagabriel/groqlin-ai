```markdown
# Groqlin

Aplicação web de chatbot inteligente com suporte a múltiplos modelos de linguagem (LLMs) via API Groq, desenvolvido com React.js e LangChain.

![Demo Chatbot](screenshot.png)

## ✨ Funcionalidades

- 🧠 Conversação com modelos de IA de última geração
- 🔄 Troca de modelos em tempo real (Mixtral, Llama2, Gemma)
- 💾 Histórico de conversas com armazenamento local
- ✏️ Renomeação de conversas salvas
- 🎨 Interface responsiva e moderna com Material UI
- 🛑 Tratamento de erros e loading states
- ⚙️ Configuração simples via arquivo .env

## 📋 Pré-requisitos

- Node.js >= 18.15.0
- npm >= 9.5.0
- Chave de API Groq (registre-se em [console.groq.com](https://console.groq.com))

## 🚀 Instalação

1. Clone o repositório:

   ```bash
   git clone 
   cd Groqlin
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie o arquivo `.env` na raiz do projeto:

   ```env
   REACT_APP_GROQ_API_KEY=sua_chave_aqui
   ```

4. Inicie a aplicação:

   ```bash
   npm start
   ```

   A aplicação estará disponível em: [http://localhost:3000](http://localhost:3000)

## 🖥 Como Usar

### Nova Conversa

- Clique no botão "+" na sidebar para iniciar nova conversa

### Enviar Mensagem

- Digite sua mensagem no campo de texto
- Pressione Enter ou clique no botão "Enviar"

### Trocar Modelo

- Selecione o modelo desejado no dropdown superior

### Gerenciar Conversas

- ✏️ Clique no ícone de lápis para renomear
- 🗑️ Clique no ícone de lixeira para excluir
- 💾 Histórico salvo automaticamente no localStorage

### Configuração do `.env`

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
REACT_APP_GROQ_API_KEY=sua_chave_groq_aqui
```

**Importante:** Nunca compartilhe ou faça commit deste arquivo!

## 🔧 Tecnologias Utilizadas

- React.js
- LangChain
- Groq API
- Material UI
- Day.js

## 🔍 Dicas

Para obter uma chave de API Groq:

- Acesse [console.groq.com](https://console.groq.com)
- Crie uma conta gratuita
- Gere uma nova chave em "API Keys"
- Mantenha sua chave de API em segurança
- Experimente diferentes modelos para comparar respostas

## ⚠️ Solução de Problemas

### Erro: "Missing API Key"

- Verifique se o arquivo `.env` existe na raiz do projeto
- Confira se o nome da variável está correto: `REACT_APP_GROQ_API_KEY`

### Erro: "Invalid API Key"

- Gere uma nova chave no console da Groq
- Atualize o arquivo `.env`

### Erros de Instalação

Limpe o cache do npm:

```bash
npm cache clean --force
rm -rf node_modules
npm install
```

## 🤝 Contribuição

Contribuições são bem-vindas! Siga estes passos:

1. Faça um fork do projeto
2. Crie uma branch com sua feature:

   ```bash
   git checkout -b feature/incrivel
   ```

3. Faça commit das mudanças:

   ```bash
   git commit -m 'Add incrivel feature'
   ```

4. Faça push para a branch:

   ```bash
   git push origin feature/incrivel
   ```

5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo `LICENSE` para detalhes.

---

**Nota:** Este projeto é para fins educacionais/demonstrativos. Para ambientes de produção, recomenda-se implementar um backend para gerenciar as chaves de API com segurança.
```