// ============================================================================
//  NOAH PROJECT: tudo o que dá pra mudar no site do Chá do Noah fica AQUI.
//  Mude só o que está entre aspas "..." e os números.
//  Depois de salvar, peça pro Claude: "sobe o Chá do Noah" (ele publica no GitHub).
// ============================================================================
const CHA = {
  titulo: "Chá do Noah",
  bebe: "Noah",

  // data do chá: ano-mês-dia
  data: "2027-01-16",

  // o que ficar vazio ("") não aparece no lembrete
  horario: "",   // ex.: "15h"
  local: "",     // ex.: "Rua das Flores, 123 - Centro"
  observacao: "", // um aviso a mais, se quiser

  // o que cada pessoa leva (igual à lista de papel)
  levar: "1 pacote de fraldas descartáveis",

  // As 50 fraldas, na proporção que vocês querem. Com a planilha ligada, o site vai mostrando só
  // os tamanhos que ainda faltam (o que completar fica apagado). Quando as 50 completam, o site para de
  // pedir fralda e agradece. Pra abrir mais, é só aumentar os números aqui.
  fraldas: [
    { tamanho: "RN", nome: "Recém-nascido", pacotes: 2 },
    { tamanho: "P", nome: "Pequena", pacotes: 5 },
    { tamanho: "M", nome: "Média", pacotes: 15 },
    { tamanho: "G", nome: "Grande", pacotes: 15 },
    { tamanho: "GG", nome: "Extra grande", pacotes: 10 },
    { tamanho: "XG", nome: "Extra grande", pacotes: 3 },
  ],

  // A "memória" do site: o endereço da planilha do Google (App da Web do jm, ligado em 02/11).
  // Vazio = o site funciona sozinho, mas sem contar as fraldas e sem garantir mensagem única.
  planilha: "https://script.google.com/macros/s/AKfycbw4jPj1uy1fgVoDXOfl_OFDgzzkCgxKKQp-M0frp_ifP4J3CyXs3DI744ZdGMwyRfiT/exec",

  // O que o Noah fala na página (texto do jm)
  convite: {
    oi: "Oi, titia! Oi, titio! 🥹",
    barriguinha: "Ainda estou aqui na barriguinha da mamãe, mas já estou contando os dias pra conhecer vocês!",
    tituloAjudinha: "Uma ajudinha do Noah 💙",
    ajudinha: "Enquanto esse dia não chega, vocês podem me dar uma ajudinha? Escolham uma fraldinha pra mim com muito carinho. Vou precisar de muitas delas nas minhas primeiras aventuras! 👶🏻🩵",
    mamaeEscolhe: "E se vocês deixarem… a mamãe pode escolher o tamanho por vocês, pensando no que vou precisar quando chegar.",
    pedidoMamae: "Pode escolher por mim, mamãe! 🥰",
    botaoMamae: "Deixo a mamãe escolher 💙",
    // quando a lista inteira de fraldas completar: o site para de pedir fralda e agradece
    // (a pessoa ganha os cartões do mesmo jeito e não precisa trazer nada)
    tituloCompleta: "Minhas fraldas já estão garantidas 💙",
    completa: "Muita gente quis cuidar de mim, e a lista das fraldas ficou completa! 🥹 Então você não precisa trazer nada: o que eu mais quero é você lá no dia, conversando pertinho da barriga da mamãe pra eu ir decorando a sua voz.",
  },

  // O mimo é opcional. Quem marcar ganha um recadinho especial no lembrete (um destes).
  mimo: {
    convite: "Também quero levar um mimo",
    explicacao: "É opcional: do jeitinho do seu coração.",
    mensagens: [
      "Um mimo pra mim? Já estou curioso pra descobrir o que é!",
      "Mimo é um abraço que vem embrulhado. Obrigado pelo carinho a mais!",
      "Vou crescer sabendo que fui muito amado desde o comecinho. Obrigado pelo mimo!",
      "Com mimo e tudo? Assim eu fico mal-acostumado! Obrigado!",
      "Seu mimo vai ser surpresa, e eu adoro surpresas!",
      "Fralda e mimo: você pensou em tudo! Meu coraçãozinho agradece.",
      "Obrigado pelo mimo! Prometo retribuir com muitos sorrisos.",
      "Cada mimo vira uma lembrança bonita, e a sua eu vou guardar com carinho.",
    ],
  },

  // O pix: pra quem não teve tempo de comprar a fralda (jm, 08/11). Fica no lugar da fralda, como
  // 3º jeito de ajudar. Quem faz o pix escolhe uma aulinha em PDF de presente (pasta aulinhas/).
  pix: {
    chave: "jm.fufrj@gmail.com",
    tipoChave: "e-mail",
    banco: "Bradesco",
    valor: "Qualquer valor, a partir de R$ 5",
    pedido: "Não deu tempo de comprar a fraldinha? 🥹",
    botao: "Prefiro mandar um pix 💙",
    fala: "Sem problema nenhum! Pode mandar um pix de qualquer valor, a partir de R$ 5, que o papai e a mamãe compram as fraldinhas pra mim. E o meu papai preparou um presentinho de volta: uma aulinha curtinha em PDF, pra você escolher depois do pix. 🤓",
    obrigado: "Obrigado! 🥹 O meu papai separou umas aulinhas pra você. Escolha o assunto, que eu sorteio uma:",
  },

  // As aulinhas (presente de quem faz o pix), em PDF na pasta aulinhas/. A pessoa escolhe o assunto e o site
  // sorteia uma aulinha dele (ou ela toca em "Sorteia pra mim" e o assunto também é sorteado). Uma por assunto:
  // são pedacinhos, não tudo junto (jm, 08/11). Os PDFs saem do testes\aulinhas\gerar_aulinhas.py.
  aulinhas: [
    { icone: "📊", nome: "Excel", sobre: "fórmulas, tabelas e prazos", lista: [
      { titulo: "Excel sem medo: 5 fórmulas", arquivo: "aulinhas/excel-formulas.pdf" },
      { titulo: "Tabela dinâmica em 5 minutos", arquivo: "aulinhas/excel-tabela-dinamica.pdf" },
      { titulo: "Datas e prazos no Excel", arquivo: "aulinhas/excel-datas.pdf" },
    ] },
    { icone: "🚚", nome: "Logística", sobre: "estoque, inventário e expedição", lista: [
      { titulo: "Logística sem mistério", arquivo: "aulinhas/logistica-estoque.pdf" },
      { titulo: "Inventário sem dor de cabeça", arquivo: "aulinhas/logistica-inventario.pdf" },
      { titulo: "Expedição que não volta", arquivo: "aulinhas/logistica-expedicao.pdf" },
    ] },
    { icone: "🛢️", nome: "Operacional", sobre: "poços, elevação artificial e BCS", lista: [
      { titulo: "Como funciona um poço de petróleo", arquivo: "aulinhas/operacional-poco.pdf" },
      { titulo: "Elevação artificial", arquivo: "aulinhas/operacional-elevacao.pdf" },
      { titulo: "BCS por dentro: bomba, motor e selo", arquivo: "aulinhas/operacional-bcs.pdf" },
      { titulo: "Os inimigos do BCS", arquivo: "aulinhas/operacional-cuidados-bcs.pdf" },
    ] },
  ],

  // As 100 cartinhas do Noah: cada pessoa ganha uma diferente (com a planilha ligada, nunca repete).
  // O jeito (jm, 02/11: "enraiza isso", "pode e deve ser maior", "HUMANO", "tem que ter alma", "não pode
  // parecer venda", "eu gosto de todo mundo que vai"): o Noah, ainda na barriguinha, falando em primeira
  // pessoa com cada um; íntimo, com humor delicado; cada uma diferente; nada de cobrança.
  // Ver referencias/100_recadinhos_do_noah.md. {nome} vira como o Noah chama a pessoa ("titia Ana").
  mensagens: [
    { oi: "Oi, {nome}!", recado: "Daqui da barriguinha da mamãe eu escuto um monte de vozes, e cada uma tem um jeitinho diferente de dizer que me espera. Agora eu sei que uma delas é a sua. Ainda não conheço o seu rosto, nem o seu abraço, nem a sua risada, mas já sei o mais importante: você pensou em mim. Pra um bebê que ainda nem chegou, isso é um presente enorme. Obrigado por fazer parte dessa espera." },
    { oi: "Psiu, {nome}!", recado: "Vou te contar um segredo que só quem está aqui dentro sabe: toda vez que alguém pensa em mim, a mamãe sorri sem nem perceber. Hoje ela sorriu por sua causa. Eu ainda não consigo agradecer do jeito certo, então guardei esse sorriso dela pra te devolver quando eu chegar, em forma de um sorriso meu, banguela e cheio de amor." },
    { oi: "{nome}, sou eu!", recado: "Ainda estou aprendendo tudo: a crescer, a me esticar, a dar chutinhos na hora errada. Mas uma coisa eu já aprendi antes de nascer: tem gente que chega na vida da gente antes mesmo de a gente chegar. Você é uma dessas pessoas. Fico feliz de saber que, quando eu abrir os olhos pela primeira vez, você vai estar por perto." },
    { oi: "Toc, toc, {nome}!", recado: "Quem bate é o Noah, aqui de dentro! Ainda não dá pra abrir a porta, falta um pouquinho, mas eu queria te contar que o seu carinho chegou direitinho até mim. Aqui é quentinho e tranquilo, e mesmo assim dá pra sentir quando tem amor do lado de fora. E tem muito. Obrigado por ser parte disso." },
    { oi: "Ei, {nome}!", recado: "Me contaram que nos primeiros meses eu vou trocar de fralda um montão de vezes: de dia, de noite e de madrugada. Confesso que fiquei um pouco preocupado com os meus pais. Mas aí soube que você está pensando em mim, e fiquei mais tranquilo. Pode ter certeza: cada troquinha vai ter um pouquinho do seu carinho, mesmo que eu ainda não saiba." },
    { oi: "Oi, {nome}!", recado: "Eu ainda não sei falar, nem andar, nem segurar um dedo com força. Por enquanto só sei duas coisas: crescer e sentir. E o que eu sinto agora é que estou chegando num lugar cheio de gente que gosta de mim. Você faz o mundo lá fora parecer menos desconhecido e muito mais bonito. Obrigado, de coração." },
    { oi: "Olha só, {nome}!", recado: "Antes do primeiro banho, do primeiro colo e da primeira foto, chegou o seu carinho. Isso quer dizer que, na minha história, você aparece logo nas primeiras páginas. Quando eu crescer e alguém me contar como foi a minha chegada, vou fazer questão de perguntar: quem estava lá? E o seu nome vai estar na resposta." },
    { oi: "{nome}, chega mais perto!", recado: "Quero te dar um obrigado bem baixinho, do jeito que a gente fala perto de um bebê dormindo. Obrigado. Pronto, falei! Ele é pequeno porque eu ainda sou pequeno, mas é verdadeiro. E prometo que, quando eu aprender a falar de verdade, vou repetir bem alto, pra todo mundo ouvir." },
    { oi: "Bom dia, boa tarde ou boa noite, {nome}!", recado: "Aqui dentro eu ainda não sei que horas são, se é dia ou se é noite, se está calor ou se está frio. Mas tem uma coisa que eu percebo a qualquer hora: quando alguém pensa em mim com carinho. E hoje você pensou. Por isso eu quis te mandar este recadinho, pra você saber que o seu gesto fez diferença aqui dentro." },
    { oi: "Oi, {nome}!", recado: "A mamãe está preparando o meu cantinho com uma calma e um cuidado que dá até gosto de sentir. Cada coisinha que chega tem uma história, e agora uma delas é sua. Quando eu estiver lá, dormindo ou fazendo bagunça, vai ter um pedacinho de você comigo. Que bonito saber disso antes mesmo de chegar." },
    { oi: "Psiu, {nome}!", recado: "Estou treinando chutinhos aqui dentro, todo dia um pouco. Esse de agora foi especial: foi de alegria, porque eu soube que você está fazendo parte da minha chegada. Se a mamãe sentir um chutinho diferente hoje, pode contar pra ela que fui eu, agradecendo você do único jeito que eu sei por enquanto." },
    { oi: "Alô, {nome}!", recado: "Aqui é da barriguinha da mamãe, ligando com um pouco de chiado, porque a ligação daqui de dentro não é das melhores. Só queria dizer que estou chegando, que já sei que você me espera e que isso me deixa muito feliz. Pode desligar, mas guarda este recado: ele foi feito com todo o amor que cabe num bebê." },
    { oi: "{nome}, tenho uma coisa pra te contar!", recado: "Já tenho fralda, já tenho cantinho, já tenho nome e já tenho uma família que me ama. Mas tinha uma coisa que eu ainda não sabia que tinha: pessoas como você, me esperando do lado de fora. Descobri hoje e fiquei todo bobo. Acho que vou ser um bebê muito mal-acostumado com tanto carinho." },
    { oi: "Oi, {nome}!", recado: "Dizem que bebê não guarda lembrança dos primeiros dias. Então eu pedi pra mamãe e pro papai guardarem as minhas por mim, principalmente as das pessoas que me esperaram com tanto carinho. Um dia eles vão me contar tudo, e eu sei que você vai aparecer nessas histórias. Mal posso esperar pra ouvir." },
    { oi: "Ei, {nome}!", recado: "Sabe aquela sensação de abraço quentinho, daqueles que acalmam qualquer choro? Eu ainda não conheço, mas tenho certeza de que vou conhecer, e acho que muitos deles vão ser seus. Enquanto isso, fica com este cartão, que é o meu jeito de te abraçar de longe. Obrigado por me receber assim, de coração aberto." },
    { oi: "{nome}, sou eu, o Noah!", recado: "Ainda estou aqui no escurinho, crescendo de pouquinho em pouquinho, ouvindo o coração da mamãe bater pertinho de mim. É um lugar bom, mas eu já estou ficando curioso pra conhecer o mundo lá fora. E saber que você está nele me dá vontade de chegar logo. Obrigado por deixar a minha chegada mais bonita." },
    { oi: "Oi, {nome}!", recado: "Quando eu chegar, vou ter muita coisa pra aprender: mamar direitinho, sorrir, segurar a cabeça e, quem sabe um dia, dormir a noite inteira (dizem que essa vai demorar). Mas tem uma coisa que eu já trago aprendida: agradecer a quem cuida de mim. Então aqui vai o meu primeiro obrigado, só pra você." },
    { oi: "Psiu, {nome}!", recado: "Já vou avisando: vou chegar pequenininho, cheio de dobrinhas, com um choro bem alto e um cheirinho que dizem ser o melhor do mundo. Pode ser que eu chore quando você me pegar no colo pela primeira vez, mas não leva pro lado pessoal, tá? É que bebê chora até de emoção. E você vai me emocionar, eu tenho certeza." },
    { oi: "Olha só, {nome}!", recado: "Cada pessoa que me espera deixa o mundo lá fora um pouquinho mais bonito pra mim. Eu imagino esse mundo como um céu cheio de estrelinhas, e cada estrelinha é alguém que gosta de mim. Hoje acendeu mais uma, e ela brilha com o seu nome. Obrigado por deixar o meu céu tão bonito." },
    { oi: "Oi, {nome}!", recado: "Eu ainda não sei falar o seu nome, nem sei como ele soa na sua voz. Mas já sei que ele mora num lugar especial: na lista das pessoas que me esperam com amor. Quando eu aprender a falar, vou treinar bastante pra dizer direitinho. Até lá, vou te chamar do jeito que todo bebê chama quem ama: com um sorriso." },
    { oi: "Toc, toc, {nome}!", recado: "Quem é? É o Noah, mandando um obrigado lá de dentro! Ainda falta um pouquinho pra eu sair, porque estou caprichando nos últimos detalhes: as unhas, os cílios, as bochechas. Mas uma coisa já está prontinha faz tempo: o carinho por quem me espera. E esse carinho também é seu." },
    { oi: "{nome}, chega mais perto!", recado: "Se você encostar o ouvido na barriga da mamãe, vai ouvir um barulhinho rápido, tum-tum-tum. Sou eu! É o meu coração, que bate apressado porque está ansioso pra conhecer todo mundo. Hoje ele bateu um pouquinho mais forte, e eu sei o motivo: soube que você faz parte dessa espera." },
    { oi: "Ei, {nome}!", recado: "Estou montando uma listinha das minhas coisas favoritas, mesmo sem conhecer quase nada ainda. Por enquanto ela tem: o barulho do coração da mamãe, a voz do papai, os soluços (que eu adoro) e as pessoas que me esperam com carinho. Você entrou nela hoje, e tenho certeza de que vai ficar pra sempre." },
    { oi: "Oi, {nome}!", recado: "Eu ainda não sei direito o que é um chá, mas a mamãe falou que vai ter muita gente reunida, muita conversa boa e muito carinho por minha causa. Que responsabilidade pra um bebê tão pequeno! Mesmo aqui de dentro, eu vou estar sentindo tudo. E vou ficar muito feliz de saber que você esteve lá." },
    { oi: "Psiu, {nome}!", recado: "Aqui dentro está ficando apertadinho, sabia? Eu cresci tanto que já quase não dá pra me esticar. Mas, engraçado, quanto mais eu cresço, mais espaço sobra no meu coração. Acho que é porque ele vai abrindo lugar pra todo mundo que me ama. E já tem um cantinho guardado só pra você." },
    { oi: "Bom dia, boa tarde ou boa noite, {nome}!", recado: "Um dia eu vou te fazer rir, vou te fazer esquecer do celular por alguns minutos, vou babar no seu ombro e, quem sabe, vou até te fazer trocar uma fralda. Tudo isso faz parte de ter um bebê na vida. Por enquanto, fica só o meu obrigado por me esperar com tanto carinho." },
    { oi: "{nome}, tenho uma coisa pra te contar!", recado: "Estou crescendo! Ainda não sei medir, nem pesar, nem contar os dias, mas a mamãe sabe tudo direitinho e garante que falta pouco. Pouco pra eu chegar, pouco pra conhecer o mundo e pouco pra conhecer você. Enquanto isso, eu fico aqui me preparando pra ser um bebê à altura de tanto carinho." },
    { oi: "Oi, {nome}!", recado: "Ainda não posso te dar um abraço de verdade, desses que apertam e esquentam. Mas posso te mandar este cartão, que é o mais perto de um abraço que eu consigo agora. Considera ele um abraço guardado pra depois, com validade eterna. Quando a gente se encontrar, eu vou querer o meu de volta, tá?" },
    { oi: "Alô, {nome}!", recado: "É o Noah! Passei rapidinho só pra avisar que você já faz parte da minha história, mesmo antes do primeiro capítulo. Ainda estou aqui nas primeiras linhas, mas já dá pra ver que vai ser uma história cheia de amor, de família e de gente boa como você. Obrigado por estar nela desde o comecinho." },
    { oi: "Ei, {nome}!", recado: "Me disseram que quem cuida de um bebê ganha sorriso de presente. Os meus ainda estão em treinamento, porque aqui dentro não tem pra quem sorrir. Mas eu já estou guardando um dos primeiros pra você. Pode ser que ele saia meio torto e sem dente nenhum, mas vai ser sincero, isso eu garanto." },
    { oi: "Olha só, {nome}!", recado: "A espera de um bebê é cheia de coisas: ansiedade, sono, risada, preparativos e muita conversa sobre o futuro. Mas a mamãe diz que a melhor parte é ver quanta gente boa aparece pra fazer parte disso. Obrigado por deixar a espera dela mais leve e mais feliz. Pra mim, isso já vale muito." },
    { oi: "Oi, {nome}!", recado: "Eu sou pequeno demais pra entender quase tudo, mas grande o bastante pra sentir quando tem carinho no ar. E ultimamente tem tanto, mas tanto, que eu fico até meio bobo aqui dentro. Uma parte desse carinho é sua, e eu queria que você soubesse que ela chegou. Chegou e ficou." },
    { oi: "{nome}, sou eu!", recado: "Já estou imaginando o seu jeito de falar comigo: aquela voz fininha que todo mundo faz pra bebê, com as palavras todas no diminutivo. Pode fazer, viu? Eu vou adorar, mesmo que eu só responda com um olhar curioso ou uma careta. É assim que bebê conversa. E eu já quero muito conversar com você." },
    { oi: "Psiu, {nome}!", recado: "Não conta pra ninguém, mas acho que vou ser um bebê muito sortudo. Olha quanta gente boa me esperando! Eu ainda nem cheguei e já tenho colo garantido, gente torcendo, gente sonhando comigo, gente preparando tudo com carinho. E agora tenho você também. Sorte assim não se explica, só se agradece." },
    { oi: "Oi, {nome}!", recado: "Vou usar muitas fraldas até aprender a não precisar mais delas, e isso ainda vai demorar um tempinho. Mas tem uma coisa que eu nunca vou deixar de usar: o carinho das pessoas que cuidaram de mim desde o começo. Esse eu vou levar comigo pela vida inteira. E o seu já está separado." },
    { oi: "Toc, toc, {nome}!", recado: "Ainda não está na hora de abrir a porta, mas eu não aguentei e vim te dar um oi. Oi! Pronto. Agora preciso voltar a crescer, porque ainda tenho umas bochechas pra encher e uns quilinhos pra ganhar. Mas fica sabendo: daqui de dentro eu já estou torcendo pra gente se conhecer logo." },
    { oi: "Ei, {nome}!", recado: "Sabe o que eu mais quero quando chegar? Além de colo, leite e soninho, quero conhecer as pessoas que torceram por mim desde a barriguinha. Quero olhar pra cada uma e, mesmo sem saber falar, dizer obrigado com os olhos. Você está nessa lista, bem lá no começo." },
    { oi: "Oi, {nome}!", recado: "Aqui dentro eu fico sabendo de muita coisa, porque a mamãe conversa comigo. Ela me conta quem perguntou de mim, quem mandou carinho, quem está contando os dias. E eu fico ouvindo, todo quietinho, aprendendo os nomes das pessoas que me amam. O seu eu já decorei." },
    { oi: "{nome}, chega mais perto!", recado: "Quero te contar uma curiosidade de bebê: aqui da barriguinha a gente já começa a reconhecer vozes. Então, quando você falar comigo, eu vou prestar bastante atenção, mesmo que pareça que eu estou só dormindo. E quando eu chegar e ouvir a sua voz de novo, vou pensar: eu conheço essa pessoa, ela me esperou." },
    { oi: "Olha só, {nome}!", recado: "O meu enxoval está ficando lindo, cheio de roupinhas tão pequenininhas que nem parecem de verdade. Mas o que eu mais gosto nele não dá pra ver: é saber que cada coisinha veio de alguém especial, escolhida pensando em mim. Isso transforma qualquer fralda em carinho. Obrigado pelo seu." },
    { oi: "Oi, {nome}!", recado: "Ainda falta um tempinho pra gente se conhecer, mas eu já sinto que vai ser daqueles encontros que ficam guardados na memória. Pelo menos na sua, porque a minha ainda está pequenininha. Por isso, presta bastante atenção nesse dia e me conta tudo depois, tá bom? Eu vou adorar ouvir." },
    { oi: "Psiu, {nome}!", recado: "Estou deixando a mamãe com saudade de alguém que ela nem conhece ainda: eu! É estranho e bonito ao mesmo tempo. E agora descobri que tem mais gente nesse clube da saudade antecipada. Bem-vindo ao grupo, ou bem-vinda, tanto faz: o importante é que você está nele, esperando comigo." },
    { oi: "Bom dia, boa tarde ou boa noite, {nome}!", recado: "Por aqui é sempre hora de soninho, de boiar quietinho e de ouvir o mundo de longe. Mas hoje eu acordei rapidinho, me espreguicei como deu e vim só pra dizer: obrigado pelo carinho! Agora vou voltar a dormir, porque crescer dá um trabalho danado." },
    { oi: "Ei, {nome}!", recado: "Me contaram que fralda sequinha deixa bebê feliz, tranquilo e de bom humor. Então, de certa forma, você já está cuidando do meu bom humor antes mesmo de eu chegar. Quando eu estiver sorrindo à toa, sem motivo nenhum, pode ser que seja por sua causa. Obrigado por pensar no meu conforto." },
    { oi: "Oi, {nome}!", recado: "Eu ainda não tenho dente, não tenho palavras e não tenho ideia de como é o mundo lá fora. Mas tenho um coração batendo forte e um obrigado enorme guardado pra você. Ele é feito de tudo o que eu sinto aqui dentro quando sei que tem gente boa me esperando. E é todo seu." },
    { oi: "{nome}, tenho uma coisa pra te contar!", recado: "Já escolhi o meu presente preferido de todos, e não é brinquedo nem roupinha. É ter gente querida por perto. E sabe o que é mais bonito? O seu carinho chegou embrulhado em cuidado, e isso eu sinto daqui. Prometo crescer sabendo que fui recebido com muito amor." },
    { oi: "Alô, {nome}!", recado: "Aqui é o Noah, direto da barriguinha, numa ligação rapidinha, porque daqui de dentro o sinal é fraco. Só liguei pra perguntar uma coisa importante: você vai estar lá quando eu chegar? Porque eu vou querer conhecer todo mundo que me esperou. Vai, né? Então combinado." },
    { oi: "Oi, {nome}!", recado: "Pensei em muitas formas de te agradecer: um sorriso, um abraço, um desenho, uma música. Mas como eu ainda não sei fazer nada disso, pedi ajuda pra mamãe, e ela escreveu este cartão por mim. As palavras são dela, mas o sentimento é todinho meu. Obrigado de coração." },
    { oi: "Psiu, {nome}!", recado: "Um dia eu vou descobrir que tinha um monte de gente me esperando antes mesmo de eu nascer. Gente que preparou, que torceu, que se emocionou. Quando eu descobrir isso, acho que vou ficar todo bobo, do jeito que a gente fica quando sabe que é amado. Obrigado por me dar esse sentimento." },
    { oi: "Olha só, {nome}!", recado: "Lá fora tem muita coisa sendo preparada pra minha chegada: roupinha lavada, cantinho arrumado, colo treinado. Mas a parte que eu mais gosto é saber que você vai estar por perto. Não importa se de pertinho ou de longe: carinho chega de qualquer jeito. E o seu já chegou aqui." },
    { oi: "Oi, {nome}!", recado: "A mamãe diz que eu vou mudar a vida de muita gente. Fico até nervoso com essa responsabilidade! Mas, se eu puder escolher, quero mudar a sua com coisas boas: muitas risadas, alguns cochilos no seu colo e pouquíssimo choro. Não prometo, porque bebê não promete nada, mas vou tentar." },
    { oi: "Ei, {nome}!", recado: "Sabia que bebê sente quando é amado? Pois é, aqui dentro está todo mundo comentando. Quer dizer, só eu, porque não tem mais ninguém aqui. Mas eu sinto muito bem, e o que eu sinto é que tem um amor enorme me esperando lá fora. Um pedacinho dele tem o seu nome." },
    { oi: "{nome}, sou eu, o Noah!", recado: "Este cartão é pequenininho, mas o obrigado que vai dentro dele é do tamanho de uma barriga de nove meses. Ou seja: enorme! Guarda ele com carinho, porque um dia eu vou querer ver. Vou querer saber quem estava na minha vida antes de eu chegar. E você estava." },
    { oi: "Toc, toc, {nome}!", recado: "O Noah aqui, contando os dias junto com a mamãe. Ela conta nos dedos, no calendário e no coração. Eu conto nos chutinhos, que é o único jeito que eu sei. Mas a gente está na mesma conta: falta pouco. E quanto mais perto fica, mais feliz eu fico de saber que você vai estar lá." },
    { oi: "Oi, {nome}!", recado: "Antes do primeiro colo, do primeiro banho, da primeira foto e do primeiro choro, chegou o seu carinho. Você chegou antes de mim na minha própria história! Isso é tão bonito que eu nem sei explicar. Só sei agradecer, e é isso que eu estou fazendo agora, com todo o meu coraçãozinho." },
    { oi: "Psiu, {nome}!", recado: "Vou te confessar uma coisa: estou um pouco ansioso pra conhecer o mundo. Deve ser grande, barulhento e cheio de luz. Mas fico mais tranquilo quando lembro que vai ter gente boa lá fora pra me mostrar tudo com calma. Saber que você está entre essas pessoas me deixa em paz. Obrigado." },
    { oi: "Bom dia, boa tarde ou boa noite, {nome}!", recado: "Quando eu chegar, não vou ligar nem um pouco pro relógio. Vou querer colo às três da manhã, leite às cinco e atenção o dia inteiro. Já estou pedindo desculpas desde já pelo trabalho! Mas vou tentar compensar com momentos que ninguém vai esquecer. Obrigado por me esperar mesmo assim." },
    { oi: "Olha só, {nome}!", recado: "Nem nasci e já tenho uma torcida organizada, com bandeira, grito de guerra e tudo. Tá, talvez sem bandeira. Mas com muito amor, isso eu garanto. Se a minha torcida tivesse uniforme, o seu seria o abraço mais apertado. Obrigado por entrar nesse time desde o primeiro minuto." },
    { oi: "Oi, {nome}!", recado: "Eu ainda sou um segredinho guardado na barriga da mamãe, mas um segredinho que todo mundo já conhece e que é muito amado. Uma parte desse amor veio de você, e eu queria que você soubesse disso. Ainda não posso agradecer pessoalmente, então este cartão vai como prova." },
    { oi: "Ei, {nome}!", recado: "Me falaram que as primeiras semanas de um bebê são de muito sono, muito leite e muita, muita fralda. Pelo menos da última parte eu já estou bem servido, graças a gente como você. O sono e o leite eu deixo com a mamãe. Obrigado por cuidar de mim antes mesmo de me conhecer." },
    { oi: "{nome}, chega mais perto!", recado: "Fecha os olhos e imagina um bebê de bochechas redondas sorrindo pra você. Imaginou? Esse sou eu, daqui a pouquinho. Ainda não dá pra ver, mas já dá pra sentir. E o que eu sinto agora é gratidão por ter alguém como você me esperando. Pode abrir os olhos: eu estou chegando." },
    { oi: "Alô, {nome}!", recado: "Aqui dentro não pega sinal de jeito nenhum, mas o seu carinho chegou mesmo assim, direitinho, sem falhar. Deve ser porque carinho de verdade não precisa de sinal: chega pelo coração. Obrigado por mandar o seu. Ele foi recebido, guardado e muito comemorado aqui dentro." },
    { oi: "Oi, {nome}!", recado: "Eu vou crescer ouvindo as histórias de quem me esperou. Vou querer saber quem chorou de emoção, quem riu, quem ficou ansioso, quem já chegou querendo me pegar no colo. Espero que a sua história seja das mais divertidas. Mas, se for das mais emocionantes, também vou adorar." },
    { oi: "Psiu, {nome}!", recado: "A mamãe está montando tudo com calma e com amor, e eu fico aqui só supervisionando. É um trabalho importante, viu? Alguém precisa garantir que tudo fique perfeito. E, como supervisor oficial, aprovei o seu carinho com nota máxima. Obrigado por caprichar tanto." },
    { oi: "{nome}, tenho uma coisa pra te contar!", recado: "Ainda não sei qual vai ser a minha primeira palavra. Pode ser mamãe, pode ser papai, pode ser alguma coisa que ninguém vai entender. Mas a segunda eu já decidi: vai ser obrigado. E ela vai ser pra todo mundo que me esperou com carinho. Você vai estar entre os primeiros a ouvir." },
    { oi: "Oi, {nome}!", recado: "Por enquanto, o meu mundo inteiro cabe na barriguinha da mamãe. É um mundo pequeno, quentinho e bem tranquilo. Mas o seu carinho é tão grande que quase não coube aqui dentro! Tive que me encolher todo pra guardar. Obrigado por me dar um problema tão bom." },
    { oi: "Ei, {nome}!", recado: "Dizem que bebê dá trabalho. É verdade, eu sei, não vou mentir. Mas eu prefiro dizer que bebê junta a família, faz todo mundo se reunir, se emocionar e rir junto. E que bom que você vai estar nessa roda, nesse abraço coletivo. Já estou com saudade disso tudo." },
    { oi: "Olha só, {nome}!", recado: "Cada pacotinho de fralda que chega é uma noite um pouquinho mais tranquila pra mamãe e pro papai. E cada pessoa que me espera é um sorriso a mais pra mim, quando eu aprender a sorrir. Você me deu as duas coisas: tranquilidade pra eles e alegria pra mim. Obrigado em dobro." },
    { oi: "Oi, {nome}!", recado: "Eu ainda não tenho certidão de nascimento, nem documento, nem foto pra carteirinha. Mas já tenho uma coisa que muita gente demora a vida inteira pra ter: pessoas especiais que pensaram em mim antes de me conhecer. Que começo de vida bonito. Obrigado por fazer parte dele." },
    { oi: "Toc, toc, {nome}!", recado: "Estou batendo aqui de dentro só pra avisar que o seu carinho chegou direitinho. Entregue com sucesso, sem amassar, no endereço certo: o meu coração. Agora ele fica comigo, guardadinho, até o dia em que eu puder te agradecer olhando nos seus olhos." },
    { oi: "Psiu, {nome}!", recado: "Quando eu chegar, vou demorar um pouquinho pra entender quem é quem. Vai ter muita gente, muito rosto novo e muita voz diferente. Mas eu tenho um jeito de reconhecer as pessoas especiais: pelo carinho. E o seu eu vou reconhecer de longe, porque já conheço daqui de dentro." },
    { oi: "Bom dia, boa tarde ou boa noite, {nome}!", recado: "Eu ainda não sei a diferença entre o dia e a noite, e dizem que vou demorar pra aprender. Coitados dos meus pais! Mas tem uma diferença que eu já entendi muito bem: a diferença que faz ter gente como você esperando por mim. É enorme. Obrigado." },
    { oi: "{nome}, sou eu!", recado: "Fiz uma listinha do que vou precisar quando chegar: colo, leite, soninho, fralda e gente que me ama. A maioria eu deixo com a mamãe e o papai. Mas a última parte, a de gente que me ama, você já resolveu, e resolveu bonito. Obrigado por cuidar justo da parte mais importante." },
    { oi: "Oi, {nome}!", recado: "A mamãe vive dizendo que eu vou ser muito amado. No começo eu achava que era coisa de mãe, porque mãe acha tudo. Mas aí comecei a perceber quanta gente está me esperando, e entendi que ela tem razão. Você é uma das provas disso. Obrigado por me mostrar que é verdade." },
    { oi: "Ei, {nome}!", recado: "Estou de mudança: da barriguinha da mamãe pro mundo. Não é uma mudança qualquer, é a maior da minha vida! E, como toda mudança, precisa de ajuda pra arrumar a casa nova. Obrigado por ajudar a preparar a minha. Vou ser um vizinho bem barulhento, mas muito amoroso." },
    { oi: "Olha só, {nome}!", recado: "Ainda não posso agradecer olhando nos seus olhos, apertando a sua mão ou dando um sorriso. Então vai por escrito mesmo, do jeito que deu: muito obrigado. Por pensar em mim, por esperar por mim e por me receber com tanto carinho. Um dia eu agradeço de novo, ao vivo." },
    { oi: "Oi, {nome}!", recado: "Daqui de dentro, cada dia parece igual ao outro: quentinho, escurinho e tranquilo. Mas hoje foi diferente. Hoje eu senti que tinha mais alguém esperando por mim, e fiquei agitado de alegria. Se a mamãe sentiu alguma coisa, era eu, comemorando você na minha vida." },
    { oi: "Psiu, {nome}!", recado: "Vou chegar sem saber de nada: não sei comer, não sei andar, não sei nem pra que servem as mãos direito. Mas uma coisa eu já vou trazer aprendida da barriguinha: que tem muita gente boa me esperando. Essa lição eu aprendi com vocês. Obrigado pela minha primeira aula." },
    { oi: "Alô, {nome}!", recado: "Aqui é o Noah, ligando de um lugar bem quentinho e meio apertado. Estou ligando só pra dizer que não vejo a hora de te conhecer, de ver a sua cara de emoção e de ganhar o seu colo. Enquanto esse dia não chega, fica com o meu carinho, que vai na frente." },
    { oi: "{nome}, chega mais perto!", recado: "Vou te contar o meu plano pros primeiros dias: chegar, chorar um pouquinho pra causar impacto, conhecer todo mundo e depois dormir no colo de quem me esperou. É um plano simples, mas muito bem pensado. E você faz parte dele. Pode ir preparando o colo!" },
    { oi: "Oi, {nome}!", recado: "Eu ainda não sei contar, mas a mamãe sabe e diz que falta pouquinho. Às vezes eu acho que os dias passam devagar aqui dentro, mas aí lembro de quanta gente boa está me esperando lá fora, e o tempo passa mais rápido. Obrigado por deixar a minha espera tão gostosa." },
    { oi: "Ei, {nome}!", recado: "Brinquedo eu sei que vou ganhar um montão, e roupinha também. Mas carinho de verdade é o tipo de presente que não se compra em lugar nenhum: só se dá. E o seu chegou de um jeito tão bonito que eu já sei que vou guardar pra sempre. Obrigado por me dar o melhor tipo de presente." },
    { oi: "Olha só, {nome}!", recado: "O mundo lá fora deve ser enorme, cheio de cores, barulhos e cheiros que eu nem imagino. Confesso que dá um friozinho na barriga, mesmo eu estando dentro de uma. Mas fico tranquilo sabendo que vai ter gente querida pra me mostrar tudo devagarinho. O que você vai me mostrar primeiro?" },
    { oi: "Toc, toc, {nome}!", recado: "Ainda não posso sair pra brincar, mas já estou guardando energia pra quando chegar. Vou querer conhecer as suas caretas, as suas músicas e as suas histórias. Vou querer puxar o seu cabelo e babar na sua roupa. Já pode ir se preparando, porque o Noah vem com tudo!" },
    { oi: "Oi, {nome}!", recado: "Eu ainda vou demorar pra entender o que é gratidão. É uma palavra grande demais pra um bebê. Mas a mamãe já entendeu, o papai também, e os dois estão muito gratos por ter você por perto nesse momento. Então eu assino embaixo, mesmo sem saber escrever: obrigado." },
    { oi: "Psiu, {nome}!", recado: "Sabe o que é melhor que fralda nova? Saber que alguém pensou em mim antes de ela chegar. Que parou, lembrou do Noah e quis cuidar de mim. É isso que faz uma coisa simples virar uma coisa especial. Obrigado por transformar um pacotinho em carinho." },
    { oi: "{nome}, tenho uma coisa pra te contar!", recado: "Estou fazendo um curso intensivo de crescer, com aula todo dia, sem férias e sem fim de semana. Até agora estou indo muito bem, com nota ótima em chutinho e em soluço. E acho que o seu carinho me ajudou a passar de ano. Obrigado por torcer por mim nessa fase." },
    { oi: "Bom dia, boa tarde ou boa noite, {nome}!", recado: "Por enquanto eu durmo quase o tempo todo, sem preocupação nenhuma. Quando eu chegar, dizem que vai ser a vez de todo mundo ficar sem dormir. Por isso, aproveita bastante agora, tá? E já fica aqui o meu pedido de desculpas antecipado, com muito amor." },
    { oi: "Oi, {nome}!", recado: "Um dia eu vou olhar as fotos desse chá e perguntar quem é quem. E alguém vai apontar pra você e dizer: essa pessoa te esperou com muito amor. Eu vou olhar bem pra foto, guardar o seu rosto e pensar: que bom que eu tive gente assim desde o começo." },
    { oi: "Ei, {nome}!", recado: "Sou pequeno no tamanho, mas já sou grande em sorte. Olha quanta gente boa vai fazer parte da minha vida! Cada pessoa traz um jeito diferente de amar, e eu quero aprender com todas. Com você, quero aprender aquilo que só você sabe ensinar. Mal posso esperar pra descobrir o que é." },
    { oi: "Olha só, {nome}!", recado: "A mamãe está contando os dias, o papai também, e agora você entrou na contagem. Já somos um time inteiro esperando a mesma coisa! E, como em todo time, cada pessoa tem um papel. O seu é dos mais bonitos: gostar de mim antes de me conhecer. Obrigado por aceitar." },
    { oi: "{nome}, sou eu, o Noah!", recado: "Ainda não sei o que vou ser quando crescer. Pode ser médico, artista, jogador, cientista ou simplesmente uma pessoa feliz. Mas uma coisa eu já sei que vou ser: muito grato a quem cuidou de mim desde a barriguinha. E você vai estar nessa lista de agradecimentos." },
    { oi: "Psiu, {nome}!", recado: "Estou te mandando um beijinho daqui de dentro. Ele vai meio abafado, meio molhado e um pouco atrasado, porque o caminho daqui até aí é longo. Mas vai com muito carinho, pode ter certeza. Quando a gente se encontrar, eu te dou um beijo babado de verdade." },
    { oi: "Oi, {nome}!", recado: "Ainda falta um pouco pra gente se ver, mas eu já separei um sorriso especialmente pra você. Ele ainda não tem dente, ainda não sabe a hora certa de aparecer e às vezes vai sair só porque eu estou com cólica. Mas, quando sair de verdade, vai ser todinho seu." },
    { oi: "Toc, toc, {nome}!", recado: "É o Noah! Vim avisar que o seu carinho foi votado e aprovado aqui dentro por unanimidade. Tá bom, a votação só teve um eleitor, que sou eu. Mas foi unânime, emocionante e cheia de chutinhos de comemoração. Obrigado por ganhar o meu voto antes mesmo de eu saber votar." },
    { oi: "Alô, {nome}!", recado: "Se carinho tivesse cheiro, o seu teria cheirinho de bebê: aquele cheiro doce que todo mundo diz que é o melhor do mundo. Eu ainda não sei como é esse cheiro, mas já sei como é receber carinho. É quentinho, é bom e deixa a gente em paz. Obrigado por me dar esse sentimento." },
    { oi: "Ei, {nome}!", recado: "A mamãe me contou que eu ainda vou passar por muitas trocas de fralda, muitas noites agitadas e muitas descobertas. Parece muita coisa pra um bebê só! Mas com tanta gente boa por perto, eu já estou mais tranquilo. Vou chegar sabendo que nunca vou estar sozinho. Obrigado por isso." },
    { oi: "{nome}, chega mais perto!", recado: "Este é um recadinho só seu, escrito com tudo o que eu sei até agora: amor, espera e gratidão. Não é muita coisa, porque eu ainda sei pouco. Mas é tudo de verdade. Guarda com carinho, e quando a gente se encontrar, me lembra de te agradecer de novo." },
    { oi: "Oi, {nome}!", recado: "Estou chegando devagarinho, no meu tempo, do jeito que todo bebê chega. Não sei o dia certo, não sei a hora, não sei nem se vai ser de dia ou de noite. Mas sei que, quando chegar, vou encontrar um mundo preparado com muito amor. Obrigado por ajudar a preparar o meu." },
    { oi: "Olha só, {nome}!", recado: "Quando você me pegar no colo pela primeira vez, lembra deste cartão. Foi aqui que eu te disse obrigado pela primeira vez, antes mesmo de saber falar. E foi aqui que eu prometi crescer sabendo que fui esperado com amor. Até lá, o meu coração já é um pouquinho seu." },
  ],
  assinatura: "Com carinho,",
};
