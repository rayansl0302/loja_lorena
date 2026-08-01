import { LegalPage, LegalSection } from '@/components/LegalPage'
import { brand } from '@/config/brand'

export function TermosDeUso() {
  return (
    <LegalPage
      title="Termos de uso"
      intro="Ao navegar e comprar na nossa loja, você concorda com as condições abaixo."
    >
      <LegalSection heading="Sobre os pedidos">
        <p>
          Este site funciona como uma vitrine: preços, tamanhos e disponibilidade são informativos
          e confirmados na conversa pelo WhatsApp antes da finalização de qualquer pedido. Valores
          e condições podem ser atualizados sem aviso prévio.
        </p>
      </LegalSection>
      <LegalSection heading="Propriedade intelectual e direitos autorais">
        <p>
          A marca {brand.name}, seu logotipo, textos, fotos e demais conteúdos deste site são de
          propriedade de {brand.founder} e protegidos por direitos autorais. Não é permitida a
          reprodução, cópia ou uso comercial sem autorização prévia.
        </p>
      </LegalSection>
      <LegalSection heading="Responsabilidades">
        <p>
          Fazemos o possível para manter as informações do catálogo atualizadas, mas eventuais
          divergências de estoque são sempre confirmadas e resolvidas diretamente com você antes da
          confirmação do pedido.
        </p>
      </LegalSection>
      <LegalSection heading="Contato">
        <p>Dúvidas sobre estes termos podem ser enviadas pelo WhatsApp ou Instagram ({brand.instagram}).</p>
      </LegalSection>
    </LegalPage>
  )
}
