import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { ContractData } from '../types';
import { numberToWordsPTBR } from '../utils/numberToWords';
import { formatDate } from '../utils/date';

// Reusing same utility function
const parseCurrency = (val: string) => {
  if (!val) return 0;
  if (val.includes(',')) {
    const cleanStr = val.replace(/\./g, '').replace(',', '.');
    return Number(cleanStr) || 0;
  }
  return Number(val) || 0;
};

// We will use Helvetica/Times built-ins
const styles = StyleSheet.create({
  page: {
    paddingTop: '15mm',
    paddingBottom: '10mm',
    paddingLeft: '15mm',
    paddingRight: '10mm',
    fontFamily: 'Times-Roman',
    fontSize: 11,
    lineHeight: 1.3,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    height: 80,
    width: 150,
    marginBottom: 10,
    objectFit: 'contain',
  },
  placeholderLogo: {
    width: 60,
    height: 60,
    backgroundColor: '#10b981',
    marginBottom: 10,
    borderRadius: 16,
  },
  headerTitle: {
    fontSize: 13,
    textAlign: 'center',
    textDecoration: 'underline',
    fontFamily: 'Times-Bold',
  },
  sectionTitle: {
    textAlign: 'center',
    fontFamily: 'Times-Bold',
    marginVertical: 10,
  },
  paragraph: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  paragraphIndent: {
    marginBottom: 10,
    textAlign: 'justify',
    textIndent: 30,
  },
  bold: {
    fontFamily: 'Times-Bold',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  flexRow: {
    flexDirection: 'row',
    marginBottom: 10,
    textAlign: 'justify',
    paddingRight: 10,
  },
  flexColText: {
    flex: 1,
  },
  listPrefix: {
    fontFamily: 'Times-Bold',
    marginRight: 5,
  },
  borderBox: {
    border: '1pt solid black',
    padding: 10,
    marginBottom: 15,
  },
  centeredBoldBox: {
    border: '1px solid black',
    padding: 10,
    marginVertical: 15,
    marginHorizontal: 30,
    textAlign: 'center',
    fontFamily: 'Times-Bold',
  },
  centerText: {
    textAlign: 'center',
  },
  underline: {
    textDecoration: 'underline',
  },
  // Table-like structures inside Flex
  signatureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 40,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  signatureCol: {
    width: '45%',
    textAlign: 'center',
    marginBottom: 30,
  },
  signatureLine: {
    borderTop: '1px solid black',
    paddingTop: 5,
  },
  questionRow: {
    marginBottom: 15,
  },
  questionAnswer: {
    borderBottom: '1px solid black',
    minHeight: 20,
    marginTop: 5,
    fontFamily: 'Times-Bold',
  }
});

interface Props {
  data: ContractData;
  logoUrl?: string | null;
}

export const ContractPDFDocument = ({ data, logoUrl }: Props) => {
  const { contratante, acolhido, tratamento, questionario, data_assinatura } = data;
  const dataFormatada = formatDate(data_assinatura);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.logoContainer}>
          {logoUrl ? (
            <Image src={logoUrl} style={styles.logo} />
          ) : (
             <View style={styles.placeholderLogo}></View>
          )}
          <Text style={styles.headerTitle}>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</Text>
        </View>

        <Text style={styles.sectionTitle}>1 – DAS PARTES.</Text>

        <Text style={styles.paragraph}>
          A <Text style={styles.bold}>NUCLEVIDA</Text>, pessoa jurídica de direito privado, com sede na BR 365 km 461, 1,5 km a Direita, Zona Rural da cidade de Patrocínio-MG, CNPJ 47.197.993/0001-05, aqui representada na forma de seus atos constitutivos, doravante denominada <Text style={styles.bold}>CONTRATADA</Text>.
        </Text>

        <Text style={[styles.paragraph, styles.uppercase]}>
          NOME: <Text style={styles.bold}>{contratante.nome || '____________________________________'}</Text>, 
          inscrito sob o CPF: <Text style={styles.bold}>{contratante.cpf || '_______________________'}</Text>{' '}
          residente domiciliado no endereço <Text style={styles.bold}>{contratante.endereco || '_____________________________________'}</Text>{' '}
          Nº <Text style={styles.bold}>{contratante.numero || '_____'}</Text>{' '}
          BAIRRO: <Text style={styles.bold}>{contratante.bairro || '__________________'}</Text>{' '}
          CIDADE <Text style={styles.bold}>{contratante.cidade || '_________________________'}</Text>, doravante denominado (a) simplesmente <Text style={styles.bold}>CONTRATANTE</Text>.
        </Text>

        <Text style={[styles.paragraph, styles.uppercase, { marginBottom: 20 }]}>
          NOME: <Text style={styles.bold}>{acolhido.nome || '_____________________________________'}</Text>, 
          inscrito sob o CPF <Text style={styles.bold}>{acolhido.cpf || '________________________'}</Text>{' '}
          residente e domiciliado (a) no endereço <Text style={styles.bold}>{acolhido.endereco || '_____________________________________'}</Text>{' '}
          Nº <Text style={styles.bold}>{acolhido.numero || '_____'}</Text>{' '}
          BAIRRO <Text style={styles.bold}>{acolhido.bairro || '__________________'}</Text>{' '}
          CIDADE <Text style={styles.bold}>{acolhido.cidade || '________________________'}</Text>, doravante denominado (a) simplesmente <Text style={styles.bold}>ACOLHIDO</Text>.
        </Text>

        <Text style={styles.sectionTitle}>2 – DO OBJETO</Text>

        <Text style={styles.paragraphIndent}>
          Programa de reintegração baseado em Espiritualidade sem vínculo Religioso, da CONTRATADA ao ACOLHIDO, formado por Cronograma estabelecido pela instituição, acompanhamento Médico uma vez ao mês, acompanhamento terapêutico, psicológico, disciplinar, reuniões terapêuticas em grupos e individuais, sendo o atendimento individual realizado periodicamente, primariamente na triagem, e quando for constatada a necessidade por parte da equipe de atendimento.
        </Text>
        <Text style={[styles.paragraphIndent, { marginBottom: 20 }]}>
          Caso queira, o CONTRATANTE poderá contratar junto à CONTRATADA um atendimento mais complexo, poderá contratar um serviço extra para o ACOLHIDO, como acompanhamento extra de enfermagem, avaliações Médicas e psicológicas quantas vezes forem necessárias. Caso opte por assim fazer, o pagamento desse serviço extra deverá ser combinado interpartes, e efetuado de forma à vista para a pessoa da Nuclevida.
        </Text>

        <Text style={styles.sectionTitle}>3 – DO PRAZO</Text>

        <Text style={[styles.paragraphIndent, { marginBottom: 20 }]}>
          Fica estabelecido entre as partes que o tratamento terá o tempo determinado {tratamento.prazo_dias ? <Text style={styles.bold}>{tratamento.prazo_dias} dias</Text> : '______ dias'}, podendo ser prorrogado por igual período de tempo, mediante laudo médico da própria unidade. Sua forma será em regime de acolhimento. Em caso de necessidade/possibilidade de prolongamento desse prazo, o mesmo será feito segundo avaliação evolutiva da equipe Multidisciplinar da Contratada.
        </Text>

        <Text style={styles.sectionTitle}>4 – DAS CONDIÇÕES DE PAGAMENTO</Text>

        <Text style={[styles.paragraph, styles.uppercase]}>
          O CONTRATANTE promete pagar para a CONTRATADA a quantia de R$ <Text style={styles.bold}>{tratamento.valor_total || '_________'}</Text> {tratamento.valor_total ? `(${numberToWordsPTBR(parseCurrency(tratamento.valor_total))})` : '(__________________________________)'} pelo tratamento do acolhido.
        </Text>
        
        <Text style={[styles.paragraph, styles.bold]}>O pagamento citado acima será efetuado da seguinte forma:</Text>
        
        <Text style={[styles.paragraph, styles.uppercase]}>
          - A título de entrada o valor de R$ <Text style={styles.bold}>{tratamento.valor_entrada || '_________'}</Text> {tratamento.valor_entrada ? `(${numberToWordsPTBR(parseCurrency(tratamento.valor_entrada))})` : '(_________________________________________________)'}, mais <Text style={styles.bold}>{tratamento.num_parcelas || '____'} PARCELAS</Text> mensais no valor de R$ <Text style={styles.bold}>{tratamento.valor_parcela || '_________'}</Text> {tratamento.valor_parcela ? `(${numberToWordsPTBR(parseCurrency(tratamento.valor_parcela))})` : '(_______________________________________)'}, bem como as despesas com medicamentos, taxa de lavanderia de R$80,00 (oitenta reais mensais), taxa de corte de cabelo de R$20,00 (vinte reais) por cada vez que usar o serviço, produtos de limpeza, produtos de higiene pessoal e itens pessoais que o ACOLHIDO possa fazer ou precise fazer uso, durante os {tratamento.prazo_dias ? Math.floor(Number(tratamento.prazo_dias) / 30).toString().padStart(2, '0') : '06'} ({tratamento.prazo_dias ? numberToWordsPTBR(Math.floor(Number(tratamento.prazo_dias) / 30)).replace(' reais', '').toUpperCase() : 'SEIS'}) meses de tratamento.
        </Text>

        <View style={styles.borderBox}>
          <Text style={[styles.paragraph, styles.bold]}>A ENTRADA NÃO É MENSALIDADE, A PRIMEIRA MENSALIDADE É SEMPRE PAGA NO MÊS SUBSEQUENTE À DATA DE ACOLHIMENTO DO ACOLHIDO SUPRACITADO.</Text>
          <Text style={[styles.paragraph, styles.bold, { marginBottom: 0 }]}>O NÚMERO DE PARCELAS NÃO CORRESPONDE AO NÚMERO DE MESES DE TRATAMENTO. A TÍTULO DE EXEMPLO: SE O CONTRATO FOR DE 03 MESES, SERÁ FEITO O PAGAMENTO DE UMA ENTRADA MAIS 03 PARCELAS DE UM DETERMINADO VALOR</Text>
        </View>

        <Text style={styles.paragraphIndent}>
          A forma de pagamento será sempre em moeda corrente Nacional na conta bancária da Pessoa da CONTRATADA, ou via PIX, ou entregue em espécie ao Diretor da Instituição, qual seja, FABIANO DOS REIS, o qual deverá fornecer recibo a pessoa CONTRATANTE. Em qualquer uma das hipóteses acima, fica desde já o CONTRATANTE ciente que deverá guardar/manter em sua posse, a fim de comprovar os pagamentos sempre que solicitados pela CONTRATADA; caso não os apresente, serão considerados como pagamentos não efetuados. <Text style={styles.bold}>NÃO TRABALHAMOS COM CHEQUES, NEM CARTÃO DE CRÉDITO OU DÉBITO.</Text>
        </Text>

        <View style={styles.centeredBoldBox} wrap={false}>
          <Text style={[styles.centerText, { marginBottom: 5 }]}>DADOS EXCLUSIVOS PARA PAGAMENTO DAS PARCELAS E DEMAIS NECESSIDADES DO ACOLHIDO</Text>
          <Text style={styles.centerText}>NOME: NUCLEVIDA (NÚCLEO DE TRATAMENTO PARA DEPENDÊNCIA QUÍMICA E ALCOÓLICA LTDA)</Text>
          <Text style={styles.centerText}>BANCO ITAÚ, AGÊNCIA:1475, CONTA CORRENTE:99750-6</Text>
          <Text style={styles.centerText}>CNPJ:47.197.993/0001-05</Text>
          <Text style={styles.centerText}>OU</Text>
          <Text style={styles.centerText}>PIX EXCLUSIVO</Text>
          <Text style={[styles.centerText, { marginBottom: 5 }]}>CHAVE CNPJ EM NOME DE NUCLEVIDA</Text>
          <View style={{ borderTop: '1px solid black', width: '75%', marginHorizontal: 'auto', paddingTop: 5 }}>
            <Text style={[styles.centerText, { fontWeight: 'normal' }]}>47197993000105</Text>
          </View>
        </View>

        <View style={[styles.borderBox, styles.centerText, styles.bold]} wrap={false}>
          <Text style={{ marginBottom: 10 }}>SEMPRE QUE FIZER QUALQUER TIPO DE PAGAMENTO, FAVOR ENVIAR O COMPROVANTE EXCLUSIVAMENTE VIA WHATSAPP PARA O NÚMERO (34)99174-6088, SOB PENA DE SER CONSIDERADO INADIMPLENTE CASO NÃO O FAÇA.</Text>
          <Text>CASO FAÇA O PAGAMENTO EM CONTA OU PIX ADVERSO, SERÁ DESCONSIDERADA TAL TRANSAÇÃO, MESMO QUE O PAGAMENTO SEJA FEITO EM CONTA, PIX OU EM MÃOS DE ALGUM FUNCIONÁRIO OU COLABORADOR DA INSTITUIÇÃO CONTRATADA</Text>
        </View>

        <Text style={styles.paragraphIndent}>
          Fica estabelecido entre as partes citadas que sempre ao final do tratamento, a pessoa do(a) CONTRATANTE deverá apresentar todos os comprovantes de pagamento das parcelas à pessoa da CONTRATADA, a fim de que se considerem quitados todos os DÉBITOS do(a) CONTRATANTE para com a CONTRATADA; Caso não o faça, será considerado inacabado o contrato, podendo o CREDOR usar de todos os meios legais para garantir o pagamento e quitação dos valores pendentes
        </Text>

        <Text style={styles.paragraphIndent}>
          As PARTES declaram entre si, que têm ciência de que havendo o pagamento do tratamento ou parte dele de forma à vista, fica desde já a pessoa CONTRATADA EXONERADA DE DEVOLVER/REPOR QUALQUER VALOR PARA A PESSOA CONTRATANTE, OU TERCEIROS, SEJA POR QUALQUER CAUSA DE ABANDONO DE TRATAMENTO.
        </Text>

        <Text style={styles.paragraphIndent}>
          Havendo atraso do pagamento por parte do(a) CONTRATANTE acima de 05 dias úteis, fica desde já autorizado pelo(a) mesmo(a) a execução de TODAS as notas promissórias, tanto as vencidas quanto as vincendas, ou a execução/protesto de quaisquer outros títulos semelhantes dados em garantia para a pessoa da CONTRATADA, a fim de resguardar a correta manutenção do pagamento do tratamento destinado ao ACOLHIDO.
        </Text>

        <Text style={styles.paragraphIndent}>
          Em caso de desistência unilateral ou bilateral deste contrato firmado interpartes, ou em caso de evasão/retirada do acolhido pela família ou por vontade própria do mesmo, falta média, falta grave, desordem, xingamentos, desrespeitos ou qualquer outro ato que atinja de forma negativa a instituição, seus colaboradores, funcionários e/ou demais residentes da instituição por parte do ACOLHIDO, fica desde já DECLARADO E PROMETIDO PELO(A) CONTRATANTE que tais atos serão considerados como desistência do tratamento por parte do ACOLHIDO, neste caso, o CONTRATANTE deverá arcar de forma integral com a próxima parcela a vencer, bem como arcar com uma multa rescisória no valor de 30% (trinta por cento) dos valores a vencer.
        </Text>

        <Text style={[styles.paragraphIndent, styles.bold, styles.uppercase]}>
          TAL PAGAMENTO SERÁ SEMPRE FEITO DE FORMA À VISTA OU VIA PIX À VISTA, NÃO HAVENDO NENHUMA OUTRA FORMA DE PAGAMENTO ACEITA PELA CONTRATADA.
        </Text>

        <Text style={[styles.paragraphIndent, styles.bold, styles.uppercase, { marginBottom: 20 }]}>
          FICA DESDE JÁ DECLARADO PELAS PARTES DESTE CONTRATO QUE A PARTE CONTRATADA PODERÁ IMPOR A PESSOA DO ACOLHIDO, A QUALQUER TEMPO, MESMO QUE SEM MOTIVO JUSTO, ALTA ADMINISTRATIVA UNILATERAL, ALTA MÉDICA, ALTA TERAPÊUTICA HOLÍSTICA, TRANSFERÊNCIA PARA OUTRA INSTITUIÇÃO QUE TENHA A MESMA FINALIDADE, EXPULSÃO DA INSTITUIÇÃO SUPRACITADA, INDEPENDENTEMENTE DE HAVER O ACOLHIDO OU O(A) CONTRATANTE DADO CAUSA PARA TANTO; CASO ISSO ACONTEÇA, A PARTE CONTRATANTE EXONERA DESDE JÁ A PARTE CONTRATADA DO PAGAMENTO DE QUALQUER MULTA, DO PAGAMENTO DE QUALQUER VALOR, BEM COMO EXONERA A MESMA DE QUALQUER ÔNUS LEGAL, DE QUALQUER RESPONSABILIDADE CIVIL, PENAL, CRIMINAL E TRABALHISTA, EM OCORRENDO UMA OU MAIS SITUAÇÕES CITADAS ACIMA, A PESSOA DA CONTRATADA TERÁ O DIREITO DE RECEBER DE FORMA INTEGRAL O CONTRATADO INTERPARTES.
        </Text>

        <Text style={styles.sectionTitle}>5 - DA MORA</Text>

        <Text style={styles.paragraphIndent}>
          O atraso em quaisquer um dos pagamentos descritos acima acarretará multa no importe de 3% (três por cento), além de juros no valor de 0,33 (zero vírgula trinta e três por cento) ao dia, sem prejuízo dos honorários advocatícios e demais despesas de cobrança em que porventura incorrer a CONTRATADA.
        </Text>
        
        <Text style={[styles.paragraphIndent, styles.uppercase, { marginBottom: 20 }]}>
          <Text style={[styles.bold, styles.underline]}>OBSERVAÇÃO:</Text>{' '}
          Em caso de Mora (atraso) no pagamento em mais de 05 dias, fica desde já AUTORIZADA A CLÍNICA (CONTRATADA) A LIBERAR O ACOLHIDO, bastando para tanto abrir o portão e liberar o mesmo, NÃO SENDO NECESSÁRIO INFORMAR A FAMÍLIA E/OU A PESSOA CONTRATANTE, ficando a partir desse momento a responsabilidade EXCLUSIVA de qualquer evento que possa vir a acontecer por conta do agora ex-acolhido, de seus familiares e Contratante(s).
        </Text>

        <Text style={styles.sectionTitle}>6 - DAS OBRIGAÇÕES DAS PARTES</Text>

        <View style={styles.flexRow}>
          <Text style={styles.listPrefix}>a -</Text>
          <Text style={styles.flexColText}>
          Oferecer ao ACOLHIDO as acomodações necessárias para sua permanência e convívio, pelo tempo determinado, conforme cláusula citada anteriormente.{'\n'}
          As acomodações são compostas de quarto coletivo, áreas comuns tais como: sala de reuniões, refeitório, banheiros, área de lazer, Laborterapia, campo de esportes de areia, espaço para reuniões e refeições em grupo, dentre outras conforme o cronograma terapêutico da instituição.
          </Text>
        </View>

        <View style={styles.flexRow}>
          <Text style={styles.listPrefix}>b.</Text>
          <Text style={styles.flexColText}>
          A CONTRATADA se propõe a oferecer ao ACOLHIDO alimentação diária no período de acolhimento, da seguinte forma: café da manhã, almoço, café da tarde e jantar. (Estas refeições são estabelecidas pela clínica e em horários definidos pelo Cronograma da instituição, e desde já ficam a família e o Contratante cientes de que o cardápio e seus prazos variam de acordo com a disponibilidade do estoque da Própria Clínica/instituição).
          </Text>
        </View>

        <Text style={styles.paragraphIndent}>
          As demais necessidades do ACOLHIDO, tais como medicamentos, materiais de higiene pessoal, guloseimas, cigarros, dentre outros, serão supridos unicamente pelo responsável/CONTRATANTE.
        </Text>

        <Text style={styles.paragraphIndent}>
          Todo e qualquer procedimento a ser feito fora da instituição somente será feito em caso de URGÊNCIA, durante o tempo de acolhimento não será feito qualquer acompanhamento de tratamentos fora da instituição.
        </Text>

        <Text style={styles.paragraphIndent}>
          Em caso de evasão da instituição durante procedimentos realizados em âmbito EXTERNO, o contrato automaticamente será rescindido, acarretando a parte CONTRATANTE a responsabilidade de arcar com a multa rescisória.
        </Text>

        <Text style={styles.paragraphIndent}>
          Em caso de necessidade de serviços extras, fora da instituição, tais como translado, ou casos de internação hospitalar, URGÊNCIA médica, URGÊNCIA odontológica, a CONTRATADA NÃO se responsabiliza em oferecer acompanhamento, pagamento de honorários, pagamento de exames, pagamento de cirurgias, pagamento de translado, dentre outras necessidades decorrentes da mesma. Caso a CONTRATADA queira fornecer o serviço de acompanhante, fica desde já declarado pelo(a) CONTRATANTE que o valor da diária será pago de forma à vista e nas seguintes proporções:
        </Text>

        <View style={{ paddingLeft: 20 }}>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>a)</Text>
            <Text style={styles.flexColText}>Valor de serviço de acompanhante hospitalar ou similar: R$150,00 (cento e cinquenta reais) a cada 12 horas de acompanhamento;</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>b)</Text>
            <Text style={styles.flexColText}>Em caso de transporte para comarca distinta da sede da instituição, o valor cobrado é de R$3,50 (três reais e cinquenta centavos) por quilômetro rodado, somando para se obter o valor final a ser pago pelo(a) CONTRATANTE, a distância percorrida no trajeto de ida e volta ao ponto de origem;</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>c)</Text>
            <Text style={styles.flexColText}>Em caso de viagens, calcular a soma do valor do transporte acima, mais o valor do serviço de acompanhante da alínea "a", mais despesas de alimentação, hospedagem para todos os membros, caso necessário, valor de pedágios e aluguel do veículo, qual seja, R$250,00 (duzentos e cinquenta reais) a cada 24 horas.</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>d)</Text>
            <Text style={styles.flexColText}>O Valor do translado para dentro do mesmo município é de R$100,00 (cem reais) para cada destino, mais R$50,00 (cinquenta reais) por hora de espera pelo ACOLHIDO.</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>e)</Text>
            <Text style={styles.flexColText}>Para demais serviços, a combinação será feita exclusivamente via WhatsApp, a fim de que fiquem arquivadas as conversas, áudios e mensagens.</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>f)</Text>
            <Text style={styles.flexColText}>A CONTRATADA, solicitada, fornecerá ao CONTRATANTE informação sobre o ACOLHIDO, sempre nas TERÇAS-FEIRAS, das 09:00hrs às 17:00hrs, ou sempre que a CONTRATADA considerar necessário, sobre o tratamento do ACOLHIDO, da seguinte forma: conforme o bom comportamento do acolhido, este terá direito a ligações quinzenais e direito a visitas mensais, mas nunca podendo acumular tais direitos, ou seja, uma vez será a visita, outra vez será a ligação, com intervalo mínimo de 15 dias. As visitas terão no máximo 05 participantes visitantes. As visitas sempre serão monitoradas, que por sua vez deverá informar sobre a postura e comportamento do ACOLHIDO, devendo estas solicitações de agendamento de visitas e ligações ocorrer sempre em horário comercial de segunda a sexta-feira, exceto feriados.</Text>
          </View>
        </View>

        <Text style={[styles.paragraphIndent, styles.bold, { marginTop: 10 }]}>
          A primeira visita sempre será com 45 dias após a data de acolhimento do Acolhido, e a primeira ligação 15 dias após a primeira visita, e somente ocorrerá de segunda a sábado, em horário pré-agendado no número correspondente, e terá a visita duração de 01 hora e a ligação duração de 10 minutos. O contato com o ACOLHIDO pelos familiares acontecerá somente mediante comprovação de participação do grupo AMOR EXIGENTE.
        </Text>

        <View style={[styles.centeredBoldBox, styles.uppercase]}>
          <Text>AS VISITAS E LIGAÇÕES NUNCA SERÃO MARCADAS OU EXECUTADAS/FEITAS AOS DOMINGOS E FERIADOS, NEM TAMPOUCO SEM UM PRÉ AGENDAMENTO NO NÚMERO (34)99174-6088</Text>
        </View>

        <Text style={[styles.paragraphIndent, styles.bold, styles.uppercase]}>
          a. É DE COMPETÊNCIA EXCLUSIVA DA FAMÍLIA CONTRATANTE MANDAR MENSAGEM COM ANTECEDÊNCIA MÍNIMA DE 07 (SETE) DIAS NO NÚMERO DE WHATSAPP, (34)99174-6088 DE SEGUNDA A SEXTA-FEIRA EM HORÁRIO COMERCIAL, A FIM DE AGENDAR LIGAÇÕES E VISITAS PARA A PESSOA DO ACOLHIDO.
        </Text>

        <View style={{ paddingLeft: 20 }}>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>b.</Text>
            <Text style={styles.flexColText}>A CONTRATADA, fornece o serviço de ronda e/ou vigia noturno.</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>c.</Text>
            <Text style={styles.flexColText}>Em caso de Autoextermínio do acolhido durante o tratamento, esse ato por ser de vontade única e exclusiva do mesmo, a contratante bem como qualquer outro familiar assumirão todas as despesas que esse ato possa gerar, (exemplo: funeral, caixão, translado, etc...). E por ser ato egoísta e de vontade exclusiva de quem pratica tal atrocidade, os mesmos (CONTRATANTE e FAMILIARES) dão desde já plena e total exoneração e quitação das responsabilidades da CONTRATADA em relação a esse ato, por estarem cientes de que esse ato não é de responsabilidade dos integrantes dessa instituição, o mesmo ocorrerá em caso de acidentes e Morte do acolhido advinda de qualquer Natureza.</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, styles.uppercase]}>c - DAS OBRIGAÇÕES DO(A) CONTRATANTE E DO ACOLHIDO</Text>

        <View style={{ paddingRight: 10 }}>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>a.</Text>
            <Text style={styles.flexColText}>O ACOLHIDO e o CONTRATANTE, bem como familiares, deverão seguir o que determina o 'REGULAMENTO INTERNO' e respeitar as normas de comportamento estabelecidos, não interferindo no programa de acolhimento.</Text>
          </View>
          <View style={[styles.flexRow, styles.uppercase, styles.bold]}>
            <Text style={styles.listPrefix}>b.</Text>
            <Text style={styles.flexColText}>SOB NENHUMA HIPÓTESE PODERÁ O ACOLHIDO SE AUSENTAR DA INSTITUIÇÃO SEM SER ACOMPANHADO POR UM COLABORADOR DA INSTITUIÇÃO, SALVO QUANDO PREVIAMENTE AUTORIZADO PELA FAMÍLIA VIA MENSAGEM DE WHATSAPP POR ÁUDIO E ESCRITA NO NÚMERO (34)99174-6088 OU (34)99334-3463.</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>c.</Text>
            <Text style={styles.flexColText}>O CONTRATANTE se compromete em providenciar para o momento do acolhimento, tudo que estiver sendo solicitado pela CONTRATADA, conforme lista elaborada por esta.</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>d.</Text>
            <Text style={styles.flexColText}>O CONTRATANTE se compromete a suprir as necessidades de despesas pessoais do residente/ACOLHIDO, inclusive medicamentos e itens pessoais necessários para o bom tratamento do mesmo.</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>e.</Text>
            <Text style={styles.flexColText}>O CONTRATANTE se compromete a atender prontamente, quando solicitado, a todo e qualquer chamado feito pela CONTRATADA em caráter de urgência, seja via ligação, mensagem de texto SMS, mensagens eletrônicas, e até mesmo recados deixados com amigos e conhecidos deste.</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>f.</Text>
            <Text style={styles.flexColText}>O transporte do ACOLHIDO que por qualquer motivo esteja se desligando ou sendo desligado da CONTRATADA, é de inteira responsabilidade da CONTRATANTE/FAMÍLIA e/ou RESPONSÁVEIS.</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>g.</Text>
            <Text style={styles.flexColText}>É vedado levar para a instituição/clínica, quaisquer objetos de valor, como por exemplo celulares, computadores, adornos pessoais, bijuterias, joias e afins, e caso o faça, estará descumprindo esta cláusula, logo, em havendo furto, roubo ou até mesmo sumindo tal objeto(s), a responsabilidade é exclusiva do ACOLHIDO e do CONTRATANTE, ficando desde já exonerada a CONTRATADA da guarda e ressarcimento de qualquer objeto e/ou valor correspondente ao mesmo. Logo, é de obrigação exclusiva do(a) CONTRATANTE, recolher tais objetos, tanto de valores reais, quanto de valores sentimentais.</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>h.</Text>
            <Text style={styles.flexColText}>A CONTRATADA, não faz compromisso de receber qualquer tipo de auxílio Social. A CONTRATADA apenas se dispõe, a encargo do(a) CONTRATANTE a levar o ACOLHIDO se necessário a realizações de perícias, sendo, que para este tipo de serviço existe um custo adicional já citado anteriormente.</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>i.</Text>
            <Text style={styles.flexColText}>Fica a encargo do CONTRATANTE a responsabilidade de ressarcir de imediato todo e qualquer valor relativos a danos ao Patrimônio e bens da Instituição causados pelo ACOLHIDO, sob pena de poder ser cobrado judicialmente pelo mesmo.</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>j.</Text>
            <Text style={styles.flexColText}>A CONTRATANTE declara neste presente ato que leu e que recebeu cópia deste contrato no mesmo dia e horário que assinou este.{'\n'}Mas caso queira, poderá requerer outra via por e-mail ou foto via WhatsApp, desde que solicitado por escrito com no mínimo de 72 horas úteis na sede da CONTRATADA.</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>k.</Text>
            <Text style={styles.flexColText}>É de responsabilidade do CONTRATANTE passar as devidas informações do histórico clínico / comorbidades do ACOLHIDO diante da CONTRATADA, qualquer omissão em seu histórico de saúde pode acarretar rescisão unilateral do presente instrumento, sem devolução de qualquer valor já recebido. No momento do acolhimento é responsabilidade da CONTRATANTE o envio dos medicamentos de uso do ACOLHIDO, principalmente, relacionados à comorbidades e similares.</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.listPrefix}>l.</Text>
            <Text style={styles.flexColText}>É de responsabilidade do CONTRATANTE, prestar as devidas assistências para com o ACOLHIDO, fazendo o acompanhamento de sua evolução no tratamento, o pagamento correto dos serviços que a CONTRATADA fornece, bem como os medicamentos, e produtos de uso pessoal, conforme for apontada a necessidade. Caso haja descumprimentos nas obrigações de cuidado para com o ACOLHIDO, a CONTRATADA pode no ato, dar alta administrativa ao mesmo, por se qualificar como abandono, sem devolução de qualquer valor já recebido.</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>7 - DA RESCISÃO</Text>

        <Text style={[styles.paragraphIndent, { marginBottom: 20 }]}>
          Caso o CONTRATANTE ou ACOLHIDO der causa, por infração a cláusula deste contrato, ou qualquer outro motivo considerado grave pela equipe, ao descumprimento deste, deverá arcar com MULTA de 30% (trinta por cento) das parcelas Vincendas mais o valor da próxima parcela a vencer, bem como possíveis parcelas em atraso.
        </Text>

        <Text style={styles.sectionTitle}>8 - DO FORO</Text>

        <Text style={styles.paragraphIndent}>
          Fica eleito exclusivamente o Foro da Cidade de PATROCÍNIO-MG, para dirimir quaisquer dúvidas e litígios pendentes a esse Contrato, não podendo haver modificação deste, por qualquer que seja o motivo. {'\n'}
          E por estarem assim justos e contratados, assinam os presentes em duas vias de igual teor e forma, na presença de duas testemunhas.
        </Text>

        <View style={{ marginVertical: 30, textAlign: 'center' }}>
          <Text>PATROCÍNIO - MG, {dataFormatada}</Text>
        </View>

        <View style={styles.signatureGrid} wrap={false}>
          <View style={styles.signatureCol}>
            <Text style={styles.signatureLine}>CONTRATADA</Text>
          </View>
          <View style={styles.signatureCol}>
            <Text style={styles.signatureLine}>CONTRATANTE</Text>
          </View>
          <View style={styles.signatureCol}>
            <Text style={styles.signatureLine}>TESTEMUNHA 01</Text>
          </View>
          <View style={styles.signatureCol}>
            <Text style={styles.signatureLine}>TESTEMUNHA 02</Text>
          </View>
        </View>

        {/* Declaracao / Questionario will break to next page if it doesn't fit natively */}
        <Text style={styles.headerTitle} break>DECLARAÇÃO</Text>

        <Text style={[styles.paragraph, styles.uppercase, { lineHeight: 1.5, marginVertical: 20 }]}>
          EU, <Text style={styles.bold}>{contratante.nome || '___________________________________'}</Text>, PORTADOR(A) DO DOCUMENTO DE IDENTIFICAÇÃO: <Text style={styles.bold}>{contratante.rg || '_______________________'}</Text>, E DO CPF: <Text style={styles.bold}>{contratante.cpf || '____________________'}</Text> DECLARO PARA OS DEVIDOS FINS QUE EXONERO A NUCLEVIDA CNPJ 47.197.993/0001-05, NO QUE DIZ RESPEITO A QUALQUER SITUAÇÃO EM QUE O ACOLHIDO: <Text style={styles.bold}>{acolhido.nome || '__________________________'}</Text> ({contratante.grau_parentesco || "GRAU DE PARENTESCO"}) DER CAUSA POR SUA VONTADE, E QUE ARCAREI COM QUAISQUER PREJUÍZOS QUE TAL ATO POSSA CAUSAR A CLINICA BEM COMO A TERCEIROS QUE SE SENTIREM OU FOREM PREJUDICADOS DE QUALQUER FORMA.
        </Text>

        <Text style={[styles.headerTitle, { marginBottom: 20 }]}>QUESTIONÁRIO</Text>

        <View style={{ marginBottom: 30 }}>
          <View style={styles.questionRow}>
            <Text>1 - O ACOLHIDO SUPRACITADO JÁ TEVE PENSAMENTOS DE AUTOEXTERMÍNIO?</Text>
            <Text style={styles.questionAnswer}>{questionario.q1 || ''}</Text>
          </View>
          <View style={styles.questionRow}>
            <Text>2 - O ACOLHIDO JÁ TEVE COMPORTAMENTOS AGRESSIVOS CONTRA FAMILIARES OU TERCEIROS?</Text>
            <Text style={styles.questionAnswer}>{questionario.q2 || ''}</Text>
          </View>
          <View style={styles.questionRow}>
            <Text>3 - O ACOLHIDO JÁ REALIZOU AUTOLESÃO NÃO SUICIDA?</Text>
            <Text style={styles.questionAnswer}>{questionario.q3 || ''}</Text>
          </View>
          <View style={styles.questionRow}>
            <Text>4 - O ACOLHIDO TEM ALGUMA ALERGIA? SE SIM, QUAL?</Text>
            <Text style={styles.questionAnswer}>{questionario.q4 || ''}</Text>
          </View>
          <View style={styles.questionRow}>
            <Text>5 - O ACOLHIDO JÁ FUGIU DE ALGUMA INSTITUIÇÃO?</Text>
            <Text style={styles.questionAnswer}>{questionario.q5 || ''}</Text>
          </View>
          <View style={styles.questionRow}>
            <Text>6 - O ACOLHIDO JÁ COMETEU ALGUM ATO CRIMINOSO? SE SIM, QUAL?</Text>
            <Text style={styles.questionAnswer}>{questionario.q6 || ''}</Text>
          </View>
          <View style={styles.questionRow}>
            <Text>7 - O ACOLHIDO SEMPRE CUMPRIU O TEMPO TOTAL DOS TRATAMENTOS FEITOS ANTERIORMENTE? SE NÃO, POR QUAL MOTIVO?</Text>
            <Text style={styles.questionAnswer}>{questionario.q7 || ''}</Text>
          </View>
        </View>

        <Text style={[styles.paragraph, styles.bold, styles.uppercase, { marginBottom: 30 }]}>
          POR SEREM VERDADEIRAS AS INFORMAÇÕES CONTIDAS ACIMA, TANTO NA DECLARAÇÃO, BEM COMO NO QUESTIONÁRIO ACIMA PREENCHIDO, ASSINO ABAIXO NA PRESENÇA DE DUAS TESTEMUNHAS
        </Text>

        <View style={{ textAlign: 'center', marginBottom: 40 }}>
          <Text style={styles.bold}>PATROCÍNIO - MG {dataFormatada}</Text>
        </View>

        <View style={{ alignItems: 'center', marginBottom: 40 }} wrap={false}>
          <View style={{ width: '60%' }}>
            <Text style={[styles.signatureLine, styles.centerText]}>ASSINATURA DO(A) DECLARANTE</Text>
          </View>
        </View>

        <View style={styles.signatureGrid} wrap={false}>
          <View style={styles.signatureCol}>
            <Text style={styles.signatureLine}>TESTEMUNHA 01</Text>
            <Text style={{ textAlign: 'left', borderBottom: '1px solid black', marginTop: 15, paddingBottom: 2 }}>NOME:</Text>
            <Text style={{ textAlign: 'left', borderBottom: '1px solid black', marginTop: 15, paddingBottom: 2 }}>ASSINATURA:</Text>
          </View>
          <View style={styles.signatureCol}>
            <Text style={styles.signatureLine}>TESTEMUNHA 02</Text>
            <Text style={{ textAlign: 'left', borderBottom: '1px solid black', marginTop: 15, paddingBottom: 2 }}>NOME:</Text>
            <Text style={{ textAlign: 'left', borderBottom: '1px solid black', marginTop: 15, paddingBottom: 2 }}>ASSINATURA:</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};
