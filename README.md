# Impéria

Loja-vitrine de moda feminina (by Lorenna Evylin) com conversão via WhatsApp. Visual premium em
preto e dourado, catálogo completo com filtros, e painel da lojista para gerenciar os produtos.
Sem backend — dados mockados e persistência em `localStorage`.

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
  data/         catálogo seed
  pages/        Home, CatalogPage, Login, Admin, páginas legais
  store/        ShopContext (produtos, carrinho, toast, drawer) e AuthContext (sessão mock)
  types/        tipos de Produto, filtros e item de carrinho
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

## Limitações intencionais (fase inicial)

Não há backend, autenticação real, pagamento ou upload de imagem — tudo é mockado com
persistência local, propositalmente, para uma primeira fase enxuta do produto. As formas de
pagamento e informações de entrega exibidas são conteúdo informativo; o pedido é sempre fechado
e combinado diretamente pelo WhatsApp.
