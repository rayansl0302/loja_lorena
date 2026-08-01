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
          Este site não possui cadastro de conta nem checkout com pagamento integrado. Ao fechar
          um pedido, pedimos seu nome completo, CPF e celular — esses três dados ficam guardados
          de forma associada entre si, para que você não precise redigitá-los numa próxima compra
          (em qualquer aparelho, não só no navegador onde digitou da primeira vez). Endereço de
          entrega e forma de pagamento continuam sendo combinados diretamente na conversa do
          WhatsApp, fora deste site.
        </p>
        <p>
          Localmente, o navegador também guarda os itens da sua sacola e o que você digitou nesses
          campos, para preencher mais rápido da próxima vez — esses dados ficam no seu dispositivo
          (localStorage) e não substituem o registro guardado para o autopreenchimento entre
          aparelhos.
        </p>
      </LegalSection>
      <LegalSection heading="Nome, CPF e celular para agilizar seu pedido">
        <p>
          Nome, CPF e celular são armazenados de forma legível (não anonimizada), associados
          entre si pelo seu CPF, com uma única finalidade: preencher esses campos automaticamente
          quando você comprar novamente, em qualquer dispositivo. Não usamos esses dados para
          marketing, não os compartilhamos com terceiros, e eles não ficam visíveis para outros
          clientes da loja.
        </p>
        <p>
          Alguns cupons promocionais (por exemplo, de primeira compra) usam seu CPF para garantir
          que cada pessoa use o benefício apenas uma vez. Nesse controle específico, guardamos
          apenas um código criptográfico irreversível (hash) do CPF — não o CPF em si — então não
          é possível reconstruir o número a partir desse registro de uso de cupom.
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
          Você pode solicitar a qualquer momento a exclusão do seu histórico de conversa e dos
          dados associados ao seu pedido — incluindo o registro de nome, CPF e celular guardado
          para autopreenchimento —, entrando em contato pelo WhatsApp ou Instagram (
          {brand.instagram}).
        </p>
      </LegalSection>
    </LegalPage>
  )
}
