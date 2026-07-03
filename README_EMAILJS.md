# Configuração do EmailJS — Formulário de Orçamento

Este site envia o formulário de orçamento diretamente do browser para o seu
email através do [EmailJS](https://www.emailjs.com), sem necessidade de
backend próprio nem servidor SMTP. Funciona em **Cloudflare Pages**, **GitHub
Pages** e também localmente (basta abrir o `index.html` no navegador).

Enquanto os passos abaixo não forem concluídos, o formulário funciona em
**modo de simulação**: valida os campos e mostra a mensagem de sucesso, mas
não envia nenhum email real. Isto permite testar o site sem já ter uma conta
EmailJS configurada.

---

## 1. Criar conta no EmailJS

1. Aceda a [https://www.emailjs.com](https://www.emailjs.com) e clique em
   **Sign Up** (pode registar-se com o email da empresa).
2. Confirme o email de ativação da conta.

## 2. Ligar uma conta Gmail

1. Dentro do painel da EmailJS, vá a **Email Services** → **Add New Service**.
2. Escolha **Gmail** e siga o processo de autorização (login com a conta
   `leomudancastransportespt@gmail.com` ou outra conta Gmail à sua escolha).
3. Depois de ligado, anote o **Service ID** gerado (algo como `service_xxxxxxx`).

## 3. Criar o template

1. Vá a **Email Templates** → **Create New Template**.
2. Defina o **Subject** (assunto) do email, por exemplo:
   ```
   [Novo Pedido de Orçamento] {{nome}}
   ```
3. No corpo do template, utilize as seguintes variáveis (correspondem
   exatamente aos campos enviados pelo formulário do site):
   ```
   Nome: {{nome}}
   Telefone: {{telefone}}
   Email: {{email}}
   Tipo de serviço: {{tipo_servico}}

   Mensagem:
   {{mensagem}}
   ```
4. Defina o campo **To Email** do template para o email onde quer receber os
   pedidos (ex.: `leomudancastransportespt@gmail.com`).
5. Guarde o template e anote o **Template ID** gerado (algo como
   `template_xxxxxxx`).

## 4. Obter as 3 chaves

No total precisa de 3 valores:

| Chave | Onde encontrar |
|---|---|
| **Public Key** | Account → General → Public Key |
| **Service ID** | Email Services → o serviço criado no passo 2 |
| **Template ID** | Email Templates → o template criado no passo 3 |

## 5. Colar as chaves no projeto

Abra o ficheiro `js/script.js` e localize, perto do início do ficheiro, a
secção assinalada com o comentário **"CONFIGURAÇÃO EMAILJS"**:

```js
const EMAILJS_PUBLIC_KEY = "";   // <-- colar aqui a Public Key da EmailJS
const EMAILJS_SERVICE_ID = "";   // <-- colar aqui o Service ID da EmailJS
const EMAILJS_TEMPLATE_ID = "";  // <-- colar aqui o Template ID da EmailJS
```

Substitua as aspas vazias pelos valores obtidos no passo 4, por exemplo:

```js
const EMAILJS_PUBLIC_KEY = "AbCdEfGhIjKlMnOp";
const EMAILJS_SERVICE_ID = "service_abc1234";
const EMAILJS_TEMPLATE_ID = "template_xyz5678";
```

Guarde o ficheiro. Não é preciso alterar mais nada — o resto do código já
está pronto para usar estas 3 constantes automaticamente.

## 6. Testar o formulário

1. Abra o site (localmente ou já publicado em Cloudflare Pages / GitHub
   Pages) e vá até à secção **"Peça o seu Orçamento Gratuito"**.
2. Preencha todos os campos obrigatórios e clique em **"Enviar Pedido de
   Orçamento"**.
3. Deve aparecer a mensagem verde de sucesso, e o email deve chegar em
   poucos segundos à caixa de entrada configurada no template.
4. Se aparecer a mensagem de erro, confirme que as 3 chaves foram coladas
   corretamente e que o serviço Gmail continua ligado no painel da EmailJS.

---

### Notas

- O plano gratuito da EmailJS permite um número limitado de emails por mês —
  suficiente para a maioria dos sites institucionais. Se o volume de pedidos
  de orçamento aumentar, poderá ser necessário atualizar o plano.
- Nunca é necessário expor uma "chave secreta" no código do site — a
  **Public Key** foi desenhada pela EmailJS para poder ser usada em
  JavaScript do lado do cliente em segurança.
- Se quiser trocar a conta Gmail associada ou o texto do email, basta
  repetir os passos 2 e/ou 3 e atualizar o Service ID / Template ID no
  ficheiro `js/script.js`.
