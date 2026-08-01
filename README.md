# Impéria

Loja-vitrine de moda feminina (by Lorenna Evylin) com conversão via WhatsApp. Visual premium em
preto e dourado, catálogo completo com filtros, e painel da lojista para gerenciar os produtos.
Praticamente sem backend — dados mockados e persistência em `localStorage`, com uma única exceção:
cupons de uso único por CPF usam o Firebase Firestore para validar (ver seção própria abaixo).

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

Build de produção:

```bash
npm run build
npm run preview
```

## Rotas

| Rota | Função |
| --- | --- |
| `/` | Vitrine pública (hero, vantagens, categorias, destaques, grupo WhatsApp) |
| `/catalogo` | Catálogo completo com busca, filtros (categoria, tamanho, preço), ordenação |
| `/sobre` | Sobre a marca |
| `/trocas-e-devolucoes` | Política de trocas |
| `/politica-de-privacidade` | Política de privacidade |
| `/termos-de-uso` | Termos de uso e direitos autorais |
| `/fale-conosco` | Contato (WhatsApp/Instagram) |
| `/login` | Login mockado da lojista |
| `/admin` | CRUD de produtos (protegido, exige login) |

As páginas legais (`/sobre`, `/trocas-e-devolucoes`, `/politica-de-privacidade`,
`/termos-de-uso`) trazem conteúdo boilerplate adaptado ao modelo (sem pagamento/conta real) —
revise com um advogado antes de publicar em produção.

## Credenciais mock

- **Usuário:** `loja`
- **Senha:** `moda123`

A sessão fica salva em `localStorage` (`lorena:session`). Basta clicar em "Sair" no painel para
encerrar.

## O que trocar para usar com sua marca

Tudo fica centralizado em [`src/config/brand.ts`](src/config/brand.ts):

- `brand.name`, `brand.founder`, `brand.tagline` — identidade (hero, header, footer, login)
- `brand.whatsappNumber` — número de WhatsApp no formato internacional só com dígitos, ex.:
  `5511999999999`
- `brand.whatsappGroupLink` — link do grupo de WhatsApp (banner de comunidade na home)
- `brand.instagram` e `brand.city` — exibidos no footer e na barra de anúncio
- `categories` / `sizes` — categorias e tamanhos disponíveis em toda a loja
- `MAX_HIGHLIGHTS` — quantas peças podem ser marcadas como destaque da home (padrão: 6)
- `messages` — textos das mensagens enviadas ao WhatsApp (hero, produto, carrinho)

### Logo

Há duas versões em `public/`: [`Logo-imperia.jpeg`](public/Logo-imperia.jpeg) (quadrada, usada no
footer e no login) e [`logo-horizontal-lorena-loja.jpeg`](public/logo-horizontal-lorena-loja.jpeg)
(horizontal, usada no header). Ambas são renderizadas pelo componente
[`src/components/Logo.tsx`](src/components/Logo.tsx) com `mix-blend-mode: lighten` para o fundo
preto do arquivo se fundir com o fundo do site. Para trocar, substitua os arquivos (mesmo nome) ou
aponte para outro caminho em `LOGO_CONFIG` no componente.

### Cores e tipografia

O tema fica em [`src/index.css`](src/index.css), dentro do bloco `@theme` (Tailwind v4):

- `--color-noir-*` — preto/carvão do site (fundo, cards, bordas), usado na vitrine e no admin
- `--color-cream-*` — texto claro sobre fundo escuro
- `--color-gold-*` — dourado de marca (CTAs, destaques, ícones), extraído da paleta da logo oficial
  (`#F5D37A` → `#D4AF37` → `#B8860B` → `#7A5200` → `#4B2E05`)
- `--color-wine-600` — cor de erro/alerta (não é cor de marca)
- `--font-display` — Cinzel, para todos os títulos e textos de marca (aproximação livre da Trajan
  Pro usada na logo)
- `--font-decorative` — Cinzel Decorative, reservada para o headline do hero e o watermark
  decorativo em segundo plano (uso pontual, não para textos longos)
- `--font-body` — Manrope, para textos corridos

Todas carregadas via Google Fonts em `index.html`.

### Ícones dos produtos

Os ícones de cada peça usam a biblioteca [`solar-icon-set`](https://www.npmjs.com/package/solar-icon-set).
As opções disponíveis no formulário do admin ficam em
[`src/config/productIcons.ts`](src/config/productIcons.ts) — adicione mais importando outros
ícones do pacote.

### Catálogo inicial

O catálogo seed (8 peças) fica em [`src/data/seed.ts`](src/data/seed.ts). Edite, adicione ou
remova itens diretamente — ou use o botão "Restaurar catálogo" no painel para voltar a esse
estado a qualquer momento.

## Estrutura do projeto

```
src/
  components/   componentes de UI (Hero, ProductCard, CartDrawer, CatalogFilters, Footer...)
  config/       configuração central da marca, helpers (WhatsApp, BRL) e ícones de produto
  data/         catálogo, banners e cupons seed
  lib/          integração com Firebase/Firestore (perfil do cliente, uso único de cupom por CPF)
  pages/        Home, CatalogPage, Login, Admin, páginas legais
  store/        ShopContext (produtos, carrinho, cupons, banners, cliente, toast, drawer) e AuthContext
  types/        tipos de Produto, Banner, Cupom, filtros e item de carrinho
  utils/        helpers puros (cupom, CPF, celular, URL de imagem)
```

## Funcionamento

- **Produtos e carrinho** persistem em `localStorage` (`lorena:products`, `lorena:cart`) —
  cadastros feitos no painel aparecem imediatamente na vitrine e no catálogo.
- **Destaques da home**: até `MAX_HIGHLIGHTS` (6) peças podem ser marcadas como destaque no admin;
  elas aparecem na seção "Destaques da semana" da home.
- **Admin**: formulário de cadastro/edição abre em modal (botão "Nova peça"), a lista tem filtros
  de busca/categoria/status, e cada peça pode ser ativada/desativada (ícone de olho) em vez de
  excluída — peças inativas somem da vitrine e do catálogo, mas continuam no painel para reativar
  a qualquer momento. "Excluir" continua disponível para remoção permanente.
- **Catálogo completo** (`/catalogo`): busca por texto, filtro multi-seleção por categoria e
  tamanho, faixa de preço, toggles de novidade/best-seller, ordenação, chips de filtro ativo e
  drawer de filtros no mobile. Aceita `?categoria=NomeDaCategoria` na URL.
- **Carrinho**: monta uma mensagem com itens, tamanhos, quantidades e total, e abre o WhatsApp
  (`wa.me`) para fechar o pedido.
- **Produto individual**: botão "Comprar" abre o WhatsApp com uma mensagem de interesse na peça.

## Cliente (nome/CPF/celular) e cupom de uso único por CPF (Firebase)

Todo fechamento de pedido pede nome completo, CPF e celular do cliente — esses dados ficam
guardados no Firestore, associados pelo CPF, só para autopreencher os campos numa compra futura
(em qualquer aparelho, não só no navegador de origem). Digitar o CPF já cadastrado preenche
nome/celular sozinho.

Cupons marcados como "Exigir CPF" no admin (ex.: `PRIMEIRACOMPRA` no seed) usam esse mesmo CPF
pra garantir uso único por pessoa — mas esse controle específico guarda só um hash SHA-256 do
CPF, nunca o CPF em si (coleção `couponUsages`, separada da coleção `customers` acima). Não dá
pra burlar limpando o `localStorage` ou usando aba anônima; a validação é feita de verdade fora
do navegador.

**Trade-off de privacidade que vale saber**: como o site não tem login de cliente, não há como
restringir tecnicamente "só o dono do CPF pode consultar/editar seu próprio registro" na coleção
`customers` — as regras do Firestore validam só o formato dos dados, não a identidade de quem
escreve. Documentado com mais detalhe nos comentários de [`firestore.rules`](firestore.rules).

### Passo a passo para configurar

1. Crie um projeto em [console.firebase.google.com](https://console.firebase.google.com).
2. No menu lateral, ative o **Firestore Database** → "Criar banco de dados" → modo **produção**.
3. Em "Configurações do projeto" (ícone de engrenagem) → aba "Geral" → "Seus apps" → adicione um
   **app da Web** (`</>`). Copie os valores do objeto `firebaseConfig` gerado.
4. Preencha essas chaves no seu `.env` local (copie de [`.env.example`](.env.example)):
   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
   `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
5. Repita essas mesmas variáveis nas configurações do projeto na **Vercel** (Settings →
   Environment Variables), para os ambientes Production e Preview — sem isso, o site publicado
   não guarda nem autopreenche nada, e cupons com "Exigir CPF" ficam indisponíveis.
6. No console do Firebase, vá em Firestore Database → aba "Regras" e cole o conteúdo de
   [`firestore.rules`](firestore.rules) (substitua as regras padrão), depois publique. Essa é a
   trava de verdade — sem ela, qualquer app conectado à sua config do Firebase poderia escrever
   dados livremente nas coleções `customers` e `couponUsages`.

Sem essas variáveis configuradas, o restante do site funciona normalmente; só o autopreenchimento
e a validação de cupons com "Exigir CPF" ficam indisponíveis, sem quebrar o checkout.

## Limitações intencionais (fase inicial)

Não há backend, autenticação real, pagamento ou upload de imagem — tudo é mockado com
persistência local, propositalmente, para uma primeira fase enxuta do produto. As formas de
pagamento e informações de entrega exibidas são conteúdo informativo; o pedido é sempre fechado
e combinado diretamente pelo WhatsApp.
