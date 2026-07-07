# Google Analytics (GA4) e Google Search Console

O site já está preparado para os dois, mas **nada fica ativo enquanto não preencheres os
dados abaixo** — até lá, o site continua sem qualquer rastreio.

---

## 1. Google Analytics 4 (estatísticas de visitas)

1. Acede a [https://analytics.google.com](https://analytics.google.com) e cria uma conta
   (ou usa uma existente).
2. **Admin** → **Criar propriedade** → escolhe o nome (ex: "LEO Transportes & Mudanças").
3. Em **Fluxos de dados** → **Web**, regista o URL do site (`https://leotransportes.pt`).
4. Copia o **ID de métricas**, com o formato `G-XXXXXXXXXX`.
5. Abre `js/script.js`, localiza a secção **"CONFIGURAÇÃO GOOGLE ANALYTICS (GA4)"** perto do
   topo, e cola o ID:
   ```js
   const GA4_MEASUREMENT_ID = "G-XXXXXXXXXX";
   ```
6. Guarda e publica (`git add`, `git commit`, `git push`).

**Importante (RGPD):** o script do Analytics só carrega depois de o visitante clicar em
"Aceitar" no aviso de cookies do site (ou já ter aceitado numa visita anterior) — isto já
está tratado automaticamente no código, não precisas de fazer mais nada.

## 2. Google Search Console (indexação e erros técnicos)

1. Acede a [https://search.google.com/search-console](https://search.google.com/search-console).
2. **Adicionar propriedade** → tipo **"Prefixo do URL"** → `https://leotransportes.pt`.
3. Escolhe o método de verificação **"Etiqueta HTML"** — a Google dá-te uma linha parecida
   com:
   ```html
   <meta name="google-site-verification" content="abcXYZ123..." />
   ```
4. Abre `index.html`, localiza o comentário **"Verificação do Google Search Console"** no
   `<head>`, e substitui a linha comentada pela etiqueta real (remove os símbolos `<!--` e
   `-->` que a comentam).
5. Guarda, publica, e clica em "Verificar" no Search Console.
6. Depois de verificado, submete o `sitemap.xml` (já existe na raiz do site) em
   **Sitemaps** → cola `sitemap.xml` → **Enviar**.

---

### Notas

- Nenhum destes passos é obrigatório para o site funcionar — são apenas para quando o
  cliente quiser acompanhar tráfego (GA4) ou melhorar a indexação no Google (Search
  Console), incluindo antes de correr campanhas pagas (Google Ads/Meta Ads).
- Podes usar a tua própria conta Google para configurar tudo, e mais tarde adicionar o
  cliente como utilizador (Admin → Gestão de acesso à propriedade), tal como fizeste com o
  Cloudflare.
