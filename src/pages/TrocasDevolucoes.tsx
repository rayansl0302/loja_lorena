import { LegalPage, LegalSection } from '@/components/LegalPage'
import { brand } from '@/config/brand'

export function TrocasDevolucoes() {
  return (
    <LegalPage
      title="Trocas e devoluções"
      intro="Queremos que você ame sua peça. Veja como funcionam nossas trocas."
    >
      <LegalSection heading="Prazo">
        <p>
          Você tem até 7 dias corridos após o recebimento para solicitar troca ou devolução, desde
          que a peça esteja sem uso, com etiqueta e embalagem originais.
        </p>
      </LegalSection>
      <LegalSection heading="Como solicitar">
        <p>
          Basta chamar a gente no WhatsApp informando o número do pedido e o motivo da troca.
          Combinamos juntas a melhor forma de envio da peça de volta.
        </p>
      </LegalSection>
      <LegalSection heading="Reembolso">
        <p>
          Como o pagamento é combinado diretamente pelo WhatsApp, o reembolso ou crédito para nova
          compra também é acertado individualmente com cada cliente, sempre com transparência.
        </p>
      </LegalSection>
      <LegalSection heading="Dúvidas">
        <p>Fale com {brand.founder} pelo WhatsApp ou Instagram ({brand.instagram}) a qualquer momento.</p>
      </LegalSection>
    </LegalPage>
  )
}
