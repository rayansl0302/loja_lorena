import { LegalPage, LegalSection } from '@/components/LegalPage'
import { brand } from '@/config/brand'

export function PoliticaPrivacidade() {
  return (
    <LegalPage
      title="Política de privacidade"
      intro="Transparência sobre como tratamos as informações de quem visita e compra na nossa loja."
    >
      <LegalSection heading="Quais dados coletamos">
        <p>
          Este site não possui cadastro de conta nem checkout com pagamento integrado. As
          informações pessoais que você compartilha (nome, telefone, endereço, preferências de
          tamanho) são trocadas diretamente na nossa conversa no WhatsApp, fora deste site.
        </p>
        <p>
          Localmente, o navegador guarda apenas os itens da sua sacola e preferências de navegação,
          para facilitar sua próxima visita — esses dados ficam só no seu dispositivo (localStorage)
          e não são enviados a nenhum servidor.
        </p>
      </LegalSection>
      <LegalSection heading="Como usamos suas informações">
        <p>
          Os dados trocados via WhatsApp são usados exclusivamente para viabilizar seu pedido:
          confirmar peças, tamanhos, endereço de entrega e forma de pagamento combinada.
        </p>
      </LegalSection>
      <LegalSection heading="Compartilhamento com terceiros">
        <p>
          Não vendemos nem compartilhamos suas informações com terceiros para fins de marketing.
          Dados de entrega podem ser repassados à transportadora apenas para viabilizar o envio do
          seu pedido.
        </p>
      </LegalSection>
      <LegalSection heading="Seus direitos">
        <p>
          Você pode solicitar a qualquer momento a exclusão do seu histórico de conversa e dados
          associados ao seu pedido, entrando em contato pelo WhatsApp ou Instagram (
          {brand.instagram}).
        </p>
      </LegalSection>
    </LegalPage>
  )
}
