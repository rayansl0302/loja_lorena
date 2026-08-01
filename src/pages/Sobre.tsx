import { LegalPage, LegalSection } from '@/components/LegalPage'
import { brand } from '@/config/brand'

export function Sobre() {
  return (
    <LegalPage
      title="Sobre nós"
      intro={`Conheça um pouco da história por trás da ${brand.name}.`}
    >
      <LegalSection heading="Nossa história">
        <p>
          A {brand.name} nasceu do olhar de {brand.founder} para uma moda feminina que une
          elegância, atitude e acessibilidade. Cada peça da nossa curadoria é pensada para mulheres
          que querem se vestir com confiança no dia a dia e em ocasiões especiais.
        </p>
      </LegalSection>
      <LegalSection heading="Como compramos com você">
        <p>
          Não temos um checkout automatizado: cada pedido é combinado diretamente pelo WhatsApp,
          para que você tire dúvidas, veja fotos reais das peças e receba um atendimento próximo,
          como em uma boutique de verdade.
        </p>
      </LegalSection>
      <LegalSection heading="Fale com a gente">
        <p>
          Está em {brand.city} ou em qualquer lugar do Brasil? Estamos disponíveis pelo WhatsApp e
          Instagram ({brand.instagram}) para ajudar você a encontrar a peça ideal.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
