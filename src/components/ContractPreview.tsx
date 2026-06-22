import { Leaf } from 'lucide-react';
import React from 'react';
import { ContractData } from '../types';
import { numberToWordsPTBR } from '../utils/numberToWords';
import { formatDate } from '../utils/date';

interface Props {
  data: ContractData;
  logoUrl?: string | null;
}

const parseCurrency = (val: string) => {
  if (!val) return 0;
  if (val.includes(',')) {
    const cleanStr = val.replace(/\./g, '').replace(',', '.');
    return Number(cleanStr) || 0;
  }
  return Number(val) || 0;
};

export function ContractPreview({ data, logoUrl }: Props) {
  const { contratante, acolhido, tratamento, questionario, data_assinatura } = data;

  const dataFormatada = formatDate(data_assinatura);

  return (
    <div className="font-[Times_New_Roman] text-[11pt] leading-tight text-justify bg-white text-black max-w-none w-full contract-pdf-content" id="contract-preview-content">
      
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        {logoUrl ? (
          <img src={logoUrl} alt="Núcle Vida" className="h-24 w-auto mb-2 object-contain" />
        ) : (
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl mx-auto mb-2 flex items-center justify-center">
            <Leaf className="w-10 h-10 text-white" />
          </div>
        )}
        <h1 className="text-[13pt] uppercase underline font-bold mt-2">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
      </div>

      <div className="text-center font-bold mb-4">
        <h2>1 – DAS PARTES.</h2>
      </div>

      <p className="mb-4">
        A <strong>NUCLEVIDA</strong>, pessoa jurídica de direito privado, com sede na BR 365 km 461, 1,5 km a Direita, Zona Rural da cidade de Patrocínio-MG, CNPJ 47.197.993/0001-05, aqui representada na forma de seus atos constitutivos, doravante denominada <strong>CONTRATADA</strong>.
      </p>

      <p className="mb-4 uppercase leading-relaxed">
        NOME: <strong>{contratante.nome || '____________________________________'}</strong>, 
        inscrito sob o CPF: <strong>{contratante.cpf || '_______________________'}</strong> 
        residente domiciliado no endereço <strong>{contratante.endereco || '_____________________________________'}</strong> 
        Nº <strong>{contratante.numero || '_____'}</strong> 
        BAIRRO: <strong>{contratante.bairro || '__________________'}</strong> 
        CIDADE <strong>{contratante.cidade || '_________________________'}</strong>, doravante denominado (a) simplesmente <strong>CONTRATANTE</strong>.
      </p>

      <p className="mb-6 uppercase leading-relaxed">
        NOME: <strong>{acolhido.nome || '_____________________________________'}</strong>, 
        inscrito sob o CPF <strong>{acolhido.cpf || '________________________'}</strong> 
        residente e domiciliado (a) no endereço <strong>{acolhido.endereco || '_____________________________________'}</strong> 
        Nº <strong>{acolhido.numero || '_____'}</strong> 
        BAIRRO <strong>{acolhido.bairro || '__________________'}</strong> 
        CIDADE <strong>{acolhido.cidade || '________________________'}</strong>, doravante denominado (a) simplesmente <strong>ACOLHIDO</strong>.
      </p>


      <div className="text-center font-bold mb-2">
        <h2>2 – DO OBJETO</h2>
      </div>

      <p className="mb-4 indent-8">
        Programa de reintegração baseado em Espiritualidade sem vínculo Religioso, da CONTRATADA ao ACOLHIDO, formado por Cronograma estabelecido pela instituição, acompanhamento Médico uma vez ao mês, acompanhamento terapêutico, psicológico, disciplinar, reuniões terapêuticas em grupos e individuais, sendo o atendimento individual realizado periodicamente, primariamente na triagem, e quando for constatada a necessidade por parte da equipe de atendimento.
      </p>
      <p className="mb-6 indent-8">
        Caso queira, o CONTRATANTE poderá contratar junto à CONTRATADA um atendimento mais complexo, poderá contratar um serviço extra para o ACOLHIDO, como acompanhamento extra de enfermagem, avaliações Médicas e psicológicas quantas vezes forem necessárias. Caso opte por assim fazer, o pagamento desse serviço extra deverá ser combinado interpartes, e efetuado de forma à vista para a pessoa da Nuclevida.
      </p>


      <div className="text-center font-bold mb-2">
        <h2>3 – DO PRAZO</h2>
      </div>

      <p className="mb-6 indent-8">
        Fica estabelecido entre as partes que o tratamento terá o tempo determinado {tratamento.prazo_dias ? <strong>{tratamento.prazo_dias} dias</strong> : '______ dias'}, podendo ser prorrogado por igual período de tempo, mediante laudo médico da própria unidade. Sua forma será em regime de acolhimento. Em caso de necessidade/possibilidade de prolongamento desse prazo, o mesmo será feito segundo avaliação evolutiva da equipe Multidisciplinar da Contratada.
      </p>


      <div className="text-center font-bold mb-2">
        <h2>4 – DAS CONDIÇÕES DE PAGAMENTO</h2>
      </div>

      <p className="mb-2 uppercase">
        O CONTRATANTE promete pagar para a CONTRATADA a quantia de R$ <strong>{tratamento.valor_total || '_________'}</strong> {tratamento.valor_total ? `(${numberToWordsPTBR(parseCurrency(tratamento.valor_total))})` : '(__________________________________)'} pelo tratamento do acolhido.
      </p>
      
      <p className="font-bold mb-2">O pagamento citado acima será efetuado da seguinte forma:</p>
      
      <p className="mb-6 uppercase">
        - A título de entrada o valor de R$ <strong>{tratamento.valor_entrada || '_________'}</strong> {tratamento.valor_entrada ? `(${numberToWordsPTBR(parseCurrency(tratamento.valor_entrada))})` : '(_________________________________________________)'}, mais <strong>{tratamento.num_parcelas || '____'} PARCELAS</strong> mensais no valor de R$ <strong>{tratamento.valor_parcela || '_________'}</strong> {tratamento.valor_parcela ? `(${numberToWordsPTBR(parseCurrency(tratamento.valor_parcela))})` : '(_______________________________________)'}, bem como as despesas com medicamentos, taxa de lavanderia de R$80,00 (oitenta reais mensais), taxa de corte de cabelo de R$20,00 (vinte reais) por cada vez que usar o serviço, produtos de limpeza, produtos de higiene pessoal e itens pessoais que o ACOLHIDO possa fazer ou precise fazer uso, durante os {tratamento.prazo_dias ? Math.floor(Number(tratamento.prazo_dias) / 30).toString().padStart(2, '0') : '06'} ({tratamento.prazo_dias ? numberToWordsPTBR(Math.floor(Number(tratamento.prazo_dias) / 30)).replace(' reais', '').toUpperCase() : 'SEIS'}) meses de tratamento.
      </p>

      <div className="border border-black p-2 mb-4 font-bold text-justify">
        <p>A ENTRADA NÃO É MENSALIDADE, A PRIMEIRA MENSALIDADE É SEMPRE PAGA NO MÊS SUBSEQUENTE À DATA DE ACOLHIMENTO DO ACOLHIDO SUPRACITADO.</p>
        <p>O NÚMERO DE PARCELAS NÃO CORRESPONDE AO NÚMERO DE MESES DE TRATAMENTO. A TÍTULO DE EXEMPLO: SE O CONTRATO FOR DE 03 MESES, SERÁ FEITO O PAGAMENTO DE UMA ENTRADA MAIS 03 PARCELAS DE UM DETERMINADO VALOR</p>
      </div>

      <p className="mb-4 indent-8">
        A forma de pagamento será sempre em moeda corrente Nacional na conta bancária da Pessoa da CONTRATADA, ou via PIX, ou entregue em espécie ao Diretor da Instituição, qual seja, FABIANO DOS REIS, o qual deverá fornecer recibo a pessoa CONTRATANTE. Em qualquer uma das hipóteses acima, fica desde já o CONTRATANTE ciente que deverá guardar/manter em sua posse, a fim de comprovar os pagamentos sempre que solicitados pela CONTRATADA; caso não os apresente, serão considerados como pagamentos não efetuados. <strong>NÃO TRABALHAMOS COM CHEQUES, NEM CARTÃO DE CRÉDITO OU DÉBITO.</strong>
      </p>

      <div className="border font-bold text-center p-2 mb-6 mx-8 italic border-black">
        <p>DADOS EXCLUSIVOS PARA PAGAMENTO DAS PARCELAS E DEMAIS NECESSIDADES DO ACOLHIDO</p>
        <p>NOME: NUCLEVIDA (NÚCLEO DE TRATAMENTO PARA DEPENDÊNCIA QUÍMICA E ALCOÓLICA LTDA)</p>
        <p>BANCO ITAÚ, AGÊNCIA:1475, CONTA CORRENTE:99750-6</p>
        <p>CNPJ:47.197.993/0001-05</p>
        <p>OU</p>
        <p>PIX EXCLUSIVO</p>
        <p>CHAVE CNPJ EM NOME DE NUCLEVIDA</p>
        <div className="border-t border-black mx-auto w-3/4 mt-2 pt-1 font-normal not-italic text-[13pt]">47197993000105</div>
      </div>

      <div className="border border-black p-3 font-bold text-center mb-6 no-break">
        <p className="mb-4">SEMPRE QUE FIZER QUALQUER TIPO DE PAGAMENTO, FAVOR ENVIAR O COMPROVANTE EXCLUSIVAMENTE VIA WHATSAPP PARA O NÚMERO (34)99174-6088, SOB PENA DE SER CONSIDERADO INADIMPLENTE CASO NÃO O FAÇA.</p>
        <p>CASO FAÇA O PAGAMENTO EM CONTA OU PIX ADVERSO, SERÁ DESCONSIDERADA TAL TRANSAÇÃO, MESMO QUE O PAGAMENTO SEJA FEITO EM CONTA, PIX OU EM MÃOS DE ALGUM FUNCIONÁRIO OU COLABORADOR DA INSTITUIÇÃO CONTRATADA</p>
      </div>

      <p className="mb-4 indent-8">
        Fica estabelecido entre as partes citadas que sempre ao final do tratamento, a pessoa do(a) CONTRATANTE deverá apresentar todos os comprovantes de pagamento das parcelas à pessoa da CONTRATADA, a fim de que se considerem quitados todos os DÉBITOS do(a) CONTRATANTE para com a CONTRATADA; Caso não o faça, será considerado inacabado o contrato, podendo o CREDOR usar de todos os meios legais para garantir o pagamento e quitação dos valores pendentes
      </p>

      <p className="mb-4 indent-8">
        As PARTES declaram entre si, que têm ciência de que havendo o pagamento do tratamento ou parte dele de forma à vista, fica desde já a pessoa CONTRATADA EXONERADA DE DEVOLVER/REPOR QUALQUER VALOR PARA A PESSOA CONTRATANTE, OU TERCEIROS, SEJA POR QUALQUER CAUSA DE ABANDONO DE TRATAMENTO.
      </p>

      <p className="mb-4 indent-8">
        Havendo atraso do pagamento por parte do(a) CONTRATANTE acima de 05 dias úteis, fica desde já autorizado pelo(a) mesmo(a) a execução de TODAS as notas promissórias, tanto as vencidas quanto as vincendas, ou a execução/protesto de quaisquer outros títulos semelhantes dados em garantia para a pessoa da CONTRATADA, a fim de resguardar a correta manutenção do pagamento do tratamento destinado ao ACOLHIDO.
      </p>

      <p className="mb-4 indent-8">
        Em caso de desistência unilateral ou bilateral deste contrato firmado interpartes, ou em caso de evasão/retirada do acolhido pela família ou por vontade própria do mesmo, falta média, falta grave, desordem, xingamentos, desrespeitos ou qualquer outro ato que atinja de forma negativa a instituição, seus colaboradores, funcionários e/ou demais residentes da instituição por parte do ACOLHIDO, fica desde já DECLARADO E PROMETIDO PELO(A) CONTRATANTE que tais atos serão considerados como desistência do tratamento por parte do ACOLHIDO, neste caso, o CONTRATANTE deverá arcar de forma integral com a próxima parcela a vencer, bem como arcar com uma multa rescisória no valor de 30% (trinta por cento) dos valores a vencer.
      </p>

      <p className="mb-4 text-justify font-bold uppercase indent-8">
        TAL PAGAMENTO SERÁ SEMPRE FEITO DE FORMA À VISTA OU VIA PIX À VISTA, NÃO HAVENDO NENHUMA OUTRA FORMA DE PAGAMENTO ACEITA PELA CONTRATADA.
      </p>

      <p className="mb-6 text-justify font-bold uppercase indent-8">
        FICA DESDE JÁ DECLARADO PELAS PARTES DESTE CONTRATO QUE A PARTE CONTRATADA PODERÁ IMPOR A PESSOA DO ACOLHIDO, A QUALQUER TEMPO, MESMO QUE SEM MOTIVO JUSTO, ALTA ADMINISTRATIVA UNILATERAL, ALTA MÉDICA, ALTA TERAPÊUTICA HOLÍSTICA, TRANSFERÊNCIA PARA OUTRA INSTITUIÇÃO QUE TENHA A MESMA FINALIDADE, EXPULSÃO DA INSTITUIÇÃO SUPRACITADA, INDEPENDENTEMENTE DE HAVER O ACOLHIDO OU O(A) CONTRATANTE DADO CAUSA PARA TANTO; CASO ISSO ACONTEÇA, A PARTE CONTRATANTE EXONERA DESDE JÁ A PARTE CONTRATADA DO PAGAMENTO DE QUALQUER MULTA, DO PAGAMENTO DE QUALQUER VALOR, BEM COMO EXONERA A MESMA DE QUALQUER ÔNUS LEGAL, DE QUALQUER RESPONSABILIDADE CIVIL, PENAL, CRIMINAL E TRABALHISTA, EM OCORRENDO UMA OU MAIS SITUAÇÕES CITADAS ACIMA, A PESSOA DA CONTRATADA TERÁ O DIREITO DE RECEBER DE FORMA INTEGRAL O CONTRATADO INTERPARTES.
      </p>

      <div className="text-center font-bold mb-4 print-page-break">
        <h2>5 - DA MORA</h2>
      </div>

      <p className="mb-4 indent-8">
        O atraso em quaisquer um dos pagamentos descritos acima acarretará multa no importe de 3% (três por cento), além de juros no valor de 0,33 (zero vírgula trinta e três por cento) ao dia, sem prejuízo dos honorários advocatícios e demais despesas de cobrança em que porventura incorrer a CONTRATADA.
      </p>
      
      <p className="mb-6 indent-8 text-justify uppercase">
        <span className="font-bold underline">OBSERVAÇÃO:</span> Em caso de Mora (atraso) no pagamento em mais de 05 dias, fica desde já AUTORIZADA A CLÍNICA (CONTRATADA) A LIBERAR O ACOLHIDO, bastando para tanto abrir o portão e liberar o mesmo, NÃO SENDO NECESSÁRIO INFORMAR A FAMÍLIA E/OU A PESSOA CONTRATANTE, ficando a partir desse momento a responsabilidade EXCLUSIVA de qualquer evento que possa vir a acontecer por conta do agora ex-acolhido, de seus familiares e Contratante(s).
      </p>

      <div className="text-center font-bold mb-4">
        <h2>6 - DAS OBRIGAÇÕES DAS PARTES</h2>
      </div>

      <div className="space-y-4 text-justify pr-2">
        <div className="flex">
          <span className="pr-2 font-bold">a -</span>
          <div>
            Oferecer ao ACOLHIDO as acomodações necessárias para sua permanência e convívio, pelo tempo determinado, conforme cláusula citada anteriormente.<br/>
            As acomodações são compostas de quarto coletivo, áreas comuns tais como: sala de reuniões, refeitório, banheiros, área de lazer, Laborterapia, campo de esportes de areia, espaço para reuniões e refeições em grupo, dentre outras conforme o cronograma terapêutico da instituição.
          </div>
        </div>

        <div className="flex">
          <span className="pr-2 font-bold">b.</span>
          <div>
            A CONTRATADA se propõe a oferecer ao ACOLHIDO alimentação diária no período de acolhimento, da seguinte forma: café da manhã, almoço, café da tarde e jantar. (Estas refeições são estabelecidas pela clínica e em horários definidos pelo Cronograma da instituição, e desde já ficam a família e o Contratante cientes de que o cardápio e seus prazos variam de acordo com a disponibilidade do estoque da Própria Clínica/instituição).
          </div>
        </div>

        <p className="indent-8">
          As demais necessidades do ACOLHIDO, tais como medicamentos, materiais de higiene pessoal, guloseimas, cigarros, dentre outros, serão supridos unicamente pelo responsável/CONTRATANTE.
        </p>

        <p className="indent-8">
          Todo e qualquer procedimento a ser feito fora da instituição somente será feito em caso de URGÊNCIA, durante o tempo de acolhimento não será feito qualquer acompanhamento de tratamentos fora da instituição.
        </p>

        <p className="indent-8">
          Em caso de evasão da instituição durante procedimentos realizados em âmbito EXTERNO, o contrato automaticamente será rescindido, acarretando a parte CONTRATANTE a responsabilidade de arcar com a multa rescisória.
        </p>

        <p className="indent-8">
          Em caso de necessidade de serviços extras, fora da instituição, tais como translado, ou casos de internação hospitalar, URGÊNCIA médica, URGÊNCIA odontológica, a CONTRATADA NÃO se responsabiliza em oferecer acompanhamento, pagamento de honorários, pagamento de exames, pagamento de cirurgias, pagamento de translado, dentre outras necessidades decorrentes da mesma. Caso a CONTRATADA queira fornecer o serviço de acompanhante, fica desde já declarado pelo(a) CONTRATANTE que o valor da diária será pago de forma à vista e nas seguintes proporções:
        </p>
        
        <div className="flex ml-6">
          <span className="pr-2 font-bold">a)</span>
          <p>Valor de serviço de acompanhante hospitalar ou similar: R$150,00 (cento e cinquenta reais) a cada 12 horas de acompanhamento;</p>
        </div>
        <div className="flex ml-6">
          <span className="pr-2 font-bold">b)</span>
          <p>Em caso de transporte para comarca distinta da sede da instituição, o valor cobrado é de R$3,50 (três reais e cinquenta centavos) por quilômetro rodado, somando para se obter o valor final a ser pago pelo(a) CONTRATANTE, a distância percorrida no trajeto de ida e volta ao ponto de origem;</p>
        </div>
        <div className="flex ml-6">
          <span className="pr-2 font-bold">c)</span>
          <p>Em caso de viagens, calcular a soma do valor do transporte acima, mais o valor do serviço de acompanhante da alínea "a", mais despesas de alimentação, hospedagem para todos os membros, caso necessário, valor de pedágios e aluguel do veículo, qual seja, R$250,00 (duzentos e cinquenta reais) a cada 24 horas.</p>
        </div>
        <div className="flex ml-6">
          <span className="pr-2 font-bold">d)</span>
          <p>O Valor do translado para dentro do mesmo município é de R$100,00 (cem reais) para cada destino, mais R$50,00 (cinquenta reais) por hora de espera pelo ACOLHIDO.</p>
        </div>
        <div className="flex ml-6">
          <span className="pr-2 font-bold">e)</span>
          <p>Para demais serviços, a combinação será feita exclusivamente via WhatsApp, a fim de que fiquem arquivadas as conversas, áudios e mensagens.</p>
        </div>
        <div className="flex ml-6">
          <span className="pr-2 font-bold">f)</span>
          <p>A CONTRATADA, solicitada, fornecerá ao CONTRATANTE informação sobre o ACOLHIDO, sempre nas TERÇAS-FEIRAS, das 09:00hrs às 17:00hrs, ou sempre que a CONTRATADA considerar necessário, sobre o tratamento do ACOLHIDO, da seguinte forma: conforme o bom comportamento do acolhido, este terá direito a ligações quinzenais e direito a visitas mensais, mas nunca podendo acumular tais direitos, ou seja, uma vez será a visita, outra vez será a ligação, com intervalo mínimo de 15 dias. As visitas terão no máximo 05 participantes visitantes. As visitas sempre serão monitoradas, que por sua vez deverá informar sobre a postura e comportamento do ACOLHIDO, devendo estas solicitações de agendamento de visitas e ligações ocorrer sempre em horário comercial de segunda a sexta-feira, exceto feriados.</p>
        </div>

        <p className="indent-8 font-bold mt-4">
          A primeira visita sempre será com 45 dias após a data de acolhimento do Acolhido, e a primeira ligação 15 dias após a primeira visita, e somente ocorrerá de segunda a sábado, em horário pré-agendado no número correspondente, e terá a visita duração de 01 hora e a ligação duração de 10 minutos. O contato com o ACOLHIDO pelos familiares acontecerá somente mediante comprovação de participação do grupo AMOR EXIGENTE.
        </p>

        <div className="border border-black p-2 font-bold text-center uppercase mx-auto mt-4 mb-4">
          AS VISITAS E LIGAÇÕES NUNCA SERÃO MARCADAS OU EXECUTADAS/FEITAS AOS DOMINGOS E FERIADOS, NEM TAMPOUCO SEM UM PRÉ AGENDAMENTO NO NÚMERO (34)99174-6088
        </div>
        
        <div className="font-bold uppercase mb-4 text-justify indent-8">
          a. É DE COMPETÊNCIA EXCLUSIVA DA FAMÍLIA CONTRATANTE MANDAR MENSAGEM COM ANTECEDÊNCIA MÍNIMA DE 07 (SETE) DIAS NO NÚMERO DE WHATSAPP, (34)99174-6088 DE SEGUNDA A SEXTA-FEIRA EM HORÁRIO COMERCIAL, A FIM DE AGENDAR LIGAÇÕES E VISITAS PARA A PESSOA DO ACOLHIDO.
        </div>

        <div className="flex ml-6">
          <span className="pr-2 font-bold">b.</span>
          <p>A CONTRATADA, fornece o serviço de ronda e/ou vigia noturno.</p>
        </div>
        <div className="flex ml-6 mt-2">
          <span className="pr-2 font-bold">c.</span>
          <p>Em caso de Autoextermínio do acolhido durante o tratamento, esse ato por ser de vontade única e exclusiva do mesmo, a contratante bem como qualquer outro familiar assumirão todas as despesas que esse ato possa gerar, (exemplo: funeral, caixão, translado, etc...). E por ser ato egoísta e de vontade exclusiva de quem pratica tal atrocidade, os mesmos (CONTRATANTE e FAMILIARES) dão desde já plena e total exoneração e quitação das responsabilidades da CONTRATADA em relação a esse ato, por estarem cientes de que esse ato não é de responsabilidade dos integrantes dessa instituição, o mesmo ocorrerá em caso de acidentes e Morte do acolhido advinda de qualquer Natureza.</p>
        </div>
      </div>

      <div className="font-bold my-4 uppercase print-page-break mb-4">
        <h2>c - DAS OBRIGAÇÕES DO(A) CONTRATANTE E DO ACOLHIDO</h2>
      </div>

      <div className="space-y-4 text-justify pr-2">
        <div className="flex">
          <span className="pr-2 font-bold">a.</span>
          <p>O ACOLHIDO e o CONTRATANTE, bem como familiares, deverão seguir o que determina o 'REGULAMENTO INTERNO' e respeitar as normas de comportamento estabelecidos, não interferindo no programa de acolhimento.</p>
        </div>
        <div className="flex uppercase font-bold">
          <span className="pr-2 font-bold">b.</span>
          <p>SOB NENHUMA HIPÓTESE PODERÁ O ACOLHIDO SE AUSENTAR DA INSTITUIÇÃO SEM SER ACOMPANHADO POR UM COLABORADOR DA INSTITUIÇÃO, SALVO QUANDO PREVIAMENTE AUTORIZADO PELA FAMÍLIA VIA MENSAGEM DE WHATSAPP POR ÁUDIO E ESCRITA NO NÚMERO (34)99174-6088 OU (34)99334-3463.</p>
        </div>
        <div className="flex">
          <span className="pr-2 font-bold">c.</span>
          <p>O CONTRATANTE se compromete em providenciar para o momento do acolhimento, tudo que estiver sendo solicitado pela CONTRATADA, conforme lista elaborada por esta.</p>
        </div>
        <div className="flex">
          <span className="pr-2 font-bold">d.</span>
          <p>O CONTRATANTE se compromete a suprir as necessidades de despesas pessoais do residente/ACOLHIDO, inclusive medicamentos e itens pessoais necessários para o bom tratamento do mesmo.</p>
        </div>
        <div className="flex">
          <span className="pr-2 font-bold">e.</span>
          <p>O CONTRATANTE se compromete a atender prontamente, quando solicitado, a todo e qualquer chamado feito pela CONTRATADA em caráter de urgência, seja via ligação, mensagem de texto SMS, mensagens eletrônicas, e até mesmo recados deixados com amigos e conhecidos deste.</p>
        </div>
        <div className="flex">
          <span className="pr-2 font-bold">f.</span>
          <p>O transporte do ACOLHIDO que por qualquer motivo esteja se desligando ou sendo desligado da CONTRATADA, e de inteira responsabilidade da CONTRATANTE/FAMÍLIA e/ou RESPONSÁVEIS.</p>
        </div>
        <div className="flex">
          <span className="pr-2 font-bold">g.</span>
          <p>É vedado levar para a instituição/clínica, quaisquer objetos de valor, como por exemplo celulares, computadores, adornos pessoais, bijuterias, joias e afins, e caso o faça, estará descumprindo esta cláusula, logo, em havendo furto, roubo ou até mesmo sumindo tal objeto(s), a responsabilidade é exclusiva do ACOLHIDO e do CONTRATANTE, ficando desde já exonerada a CONTRATADA da guarda e ressarcimento de qualquer objeto e/ou valor correspondente ao mesmo. Logo, é de obrigação exclusiva do(a) CONTRATANTE, recolher tais objetos, tanto de valores reais, quanto de valores sentimentais.</p>
        </div>
        <div className="flex">
          <span className="pr-2 font-bold">h.</span>
          <p>A CONTRATADA, não faz compromisso de receber qualquer tipo de auxílio Social. A CONTRATADA apenas se dispõe, a encargo do(a) CONTRATANTE a levar o ACOLHIDO se necessário a realizações de perícias, sendo, que para este tipo de serviço existe um custo adicional já citado anteriormente.</p>
        </div>
        <div className="flex">
          <span className="pr-2 font-bold">i.</span>
          <p>Fica a encargo do CONTRATANTE a responsabilidade de ressarcir de imediato todo e qualquer valor relativos a danos ao Patrimônio e bens da Instituição causados pelo ACOLHIDO, sob pena de poder ser cobrado judicialmente pelo mesmo.</p>
        </div>
        <div className="flex">
          <span className="pr-2 font-bold">j.</span>
          <p>A CONTRATANTE declara neste presente ato que leu e que recebeu cópia deste contrato no mesmo dia e horário que assinou este.<br/>
          Mas caso queira, poderá requerer outra via por e-mail ou foto via WhatsApp, desde que solicitado por escrito com no mínimo de 72 horas úteis na sede da CONTRATADA.</p>
        </div>
        <div className="flex">
          <span className="pr-2 font-bold">k.</span>
          <p>É de responsabilidade do CONTRATANTE passar as devidas informações do histórico clínico / comorbidades do ACOLHIDO diante da CONTRATADA, qualquer omissão em seu histórico de saúde pode acarretar rescisão unilateral do presente instrumento, sem devolução de qualquer valor já recebido. No momento do acolhimento é responsabilidade da CONTRATANTE o envio dos medicamentos de uso do ACOLHIDO, principalmente, relacionados à comorbidades e similares.</p>
        </div>
        <div className="flex">
          <span className="pr-2 font-bold">l.</span>
          <p>É de responsabilidade do CONTRATANTE, prestar as devidas assistências para com o ACOLHIDO, fazendo o acompanhamento de sua evolução no tratamento, o pagamento correto dos serviços que a CONTRATADA fornece, bem como os medicamentos, e produtos de uso pessoal, conforme for apontada a necessidade. Caso haja descumprimentos nas obrigações de cuidado para com o ACOLHIDO, a CONTRATADA pode no ato, dar alta administrativa ao mesmo, por se qualificar como abandono, sem devolução de qualquer valor já recebido.</p>
        </div>
      </div>

      <div className="text-center font-bold my-6">
        <h2>7 - DA RESCISÃO</h2>
      </div>

      <p className="mb-6 indent-8 text-justify">
        Caso o CONTRATANTE ou ACOLHIDO der causa, por infração a cláusula deste contrato, ou qualquer outro motivo considerado grave pela equipe, ao descumprimento deste, deverá arcar com MULTA de 30% (trinta por cento) das parcelas Vincendas mais o valor da próxima parcela a vencer, bem como possíveis parcelas em atraso.
      </p>

      <div className="text-center font-bold my-4">
        <h2>8 - DO FORO</h2>
      </div>

      <p className="mb-4 indent-8 text-justify">
        Fica eleito exclusivamente o Foro da Cidade de PATROCÍNIO-MG, para dirimir quaisquer dúvidas e litígios pendentes a esse Contrato, não podendo haver modificação deste, por qualquer que seja o motivo. <br/>
        E por estarem assim justos e contratados, assinam os presentes em duas vias de igual teor e forma, na presença de duas testemunhas.
      </p>

      <div className="text-center my-8">
        <p>PATROCÍNIO - MG, {dataFormatada}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-12 mt-12 mb-12">
        <div className="text-center">
          <div className="border-t border-black pt-1 mb-1">CONTRATADA</div>
        </div>
        <div className="text-center">
          <div className="border-t border-black pt-1 mb-1">CONTRATANTE</div>
        </div>
        <div className="text-center">
          <div className="border-t border-black pt-1 mb-1">TESTEMUNHA 01</div>
        </div>
        <div className="text-center">
          <div className="border-t border-black pt-1 mb-1">TESTEMUNHA 02</div>
        </div>
      </div>

      <div className="print-page-break"></div>

      <div className="text-center font-bold mb-6 underline">
        <h2>DECLARAÇÃO</h2>
      </div>

      <p className="text-justify uppercase mb-8 leading-loose">
        EU, <strong>{contratante.nome || '___________________________________'}</strong>, PORTADOR(A) DO DOCUMENTO DE IDENTIFICAÇÃO: <strong>{contratante.rg || '_______________________'}</strong>, E DO CPF: <strong>{contratante.cpf || '____________________'}</strong> DECLARO PARA OS DEVIDOS FINS QUE EXONERO A NUCLEVIDA CNPJ 47.197.993/0001-05, NO QUE DIZ RESPEITO A QUALQUER SITUAÇÃO EM QUE O ACOLHIDO: <strong>{acolhido.nome || '__________________________'}</strong> ({contratante.grau_parentesco || "GRAU DE PARENTESCO"}) DER CAUSA POR SUA VONTADE, E QUE ARCAREI COM QUAISQUER PREJUÍZOS QUE TAL ATO POSSA CAUSAR A CLINICA BEM COMO A TERCEIROS QUE SE SENTIREM OU FOREM PREJUDICADOS DE QUALQUER FORMA.
      </p>

      <div className="text-center font-bold mb-4 underline">
        <h2>QUESTIONÁRIO</h2>
      </div>

      <div className="space-y-6 mb-8 uppercase text-justify">
        <div>
          <p>1 - O ACOLHIDO SUPRACITADO JÁ TEVE PENSAMENTOS DE AUTOEXTERMÍNIO?</p>
          <div className="w-full border-b border-black mt-2 inline-block font-bold pb-1 min-h-[30px]">{questionario.q1 || ''}</div>
        </div>
        <div>
          <p>2 - O ACOLHIDO JÁ TEVE COMPORTAMENTOS AGRESSIVOS CONTRA FAMILIARES OU TERCEIROS?</p>
          <div className="w-full border-b border-black mt-2 inline-block font-bold pb-1 min-h-[30px]">{questionario.q2 || ''}</div>
        </div>
        <div>
          <p>3 - O ACOLHIDO JÁ REALIZOU AUTOLESÃO NÃO SUICIDA?</p>
          <div className="w-full border-b border-black mt-2 inline-block font-bold pb-1 min-h-[30px]">{questionario.q3 || ''}</div>
        </div>
        <div>
          <p>4 - O ACOLHIDO TEM ALGUMA ALERGIA? SE SIM, QUAL?</p>
          <div className="w-full border-b border-black mt-2 inline-block font-bold pb-1 min-h-[30px]">{questionario.q4 || ''}</div>
        </div>
        <div>
          <p>5 - O ACOLHIDO JÁ FUGIU DE ALGUMA INSTITUIÇÃO?</p>
          <div className="w-full border-b border-black mt-2 inline-block font-bold pb-1 min-h-[30px]">{questionario.q5 || ''}</div>
        </div>
        <div>
          <p>6 - O ACOLHIDO JÁ COMETEU ALGUM ATO CRIMINOSO? SE SIM, QUAL?</p>
          <div className="w-full border-b border-black mt-2 inline-block font-bold pb-1 min-h-[30px]">{questionario.q6 || ''}</div>
        </div>
        <div>
          <p>7 - O ACOLHIDO SEMPRE CUMPRIU O TEMPO TOTAL DOS TRATAMENTOS FEITOS ANTERIORMENTE? SE NÃO, POR QUAL MOTIVO?</p>
          <div className="w-full border-b border-black mt-2 inline-block font-bold pb-1 min-h-[30px]">{questionario.q7 || ''}</div>
        </div>
      </div>

      <p className="text-justify uppercase font-bold mb-8">
        POR SEREM VERDADEIRAS AS INFORMAÇÕES CONTIDAS ACIMA, TANTO NA DECLARAÇÃO, BEM COMO NO QUESTIONÁRIO ACIMA PREENCHIDO, ASSINO ABAIXO NA PRESENÇA DE DUAS TESTEMUNHAS
      </p>

      <div className="text-center font-bold mb-12 uppercase">
        <p>PATROCÍNIO - MG {dataFormatada}</p>
      </div>

      <div className="w-1/2 ml-auto mr-auto text-center mb-8">
        <div className="border-t border-black pt-1 mb-1">ASSINATURA DO(A) DECLARANTE</div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-8 mt-4">
        <div>
          <div className="border-t border-black pt-1 text-center">TESTEMUNHA 01</div>
          <div className="mt-4 border-b border-black w-full pb-1">NOME:</div>
          <div className="mt-4 border-b border-black w-full pb-1">ASSINATURA:</div>
        </div>
        <div>
          <div className="border-t border-black pt-1 text-center">TESTEMUNHA 02</div>
          <div className="mt-4 border-b border-black w-full pb-1">NOME:</div>
          <div className="mt-4 border-b border-black w-full pb-1">ASSINATURA:</div>
        </div>
      </div>

    </div>
  );
}
