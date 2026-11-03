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
  // os tamanhos que ainda faltam (o que completar some e os outros aparecem).
  fraldas: [
    { tamanho: "RN", nome: "Recém-nascido", pacotes: 2 },
    { tamanho: "P", nome: "Pequena", pacotes: 5 },
    { tamanho: "M", nome: "Média", pacotes: 15 },
    { tamanho: "G", nome: "Grande", pacotes: 15 },
    { tamanho: "GG", nome: "Extra grande", pacotes: 10 },
    { tamanho: "XG", nome: "Extra grande", pacotes: 3 },
  ],

  // A "memória" do site: o endereço da planilha do Google (o jm cria uma vez; ver o CLAUDE.md).
  // Vazio = o site funciona sozinho, mas sem contar as fraldas e sem garantir mensagem única.
  planilha: "",

  // O que o Noah fala na página (texto do jm)
  convite: {
    oi: "Oi, titia! Oi, titio! 🥹",
    barriguinha: "Ainda estou aqui na barriguinha da mamãe, mas já estou contando os dias pra conhecer vocês!",
    tituloAjudinha: "Uma ajudinha do Noah 💙",
    ajudinha: "Enquanto esse dia não chega, vocês podem me dar uma ajudinha? Escolham uma fraldinha pra mim com muito carinho. Vou precisar de muitas delas nas minhas primeiras aventuras! 👶🏻🩵",
    mamaeEscolhe: "E se vocês deixarem… a mamãe pode escolher o tamanho por vocês, pensando no que vou precisar quando chegar.",
    pedidoMamae: "Pode escolher por mim, mamãe! 🥰",
    botaoMamae: "Deixo a mamãe escolher 💙",
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

  // As 100 mensagens do Noah: cada pessoa ganha uma diferente (com a planilha ligada, nunca repete).
  // "oi" vai grande no cartão; {nome} vira como o Noah chama a pessoa (ex.: "titia Ana", "titio Carlos").
  mensagens: [
    { oi: "Oi, {nome}!", recado: "Aqui quem fala é o Noah, direto da barriguinha da mamãe. Eu sou pequenininho, mas já sei que você é muito especial na minha história. Obrigado por todo o carinho!" },
    { oi: "Psiu, {nome}!", recado: "Posso te contar um segredo? Daqui de dentro eu escuto todo mundo falando de você, e já fico todo feliz. Te espero no meu chá!" },
    { oi: "Oizinho, {nome}!", recado: "Ainda sou do tamanho de um abraço, mas já tenho espaço de sobra pra guardar todo o seu carinho. Obrigado de coração!" },
    { oi: "Olá, {nome}!", recado: "O papai e a mamãe me contaram que você faz parte da nossa história, e meu coraçãozinho ficou quentinho. Mal posso esperar pra te conhecer!" },
    { oi: "Cadê? Achou, {nome}!", recado: "Adivinha quem é? O Noah! Ainda estou escondidinho na barriguinha, mas já gosto muito de você. Um beijo babado!" },
    { oi: "Oi, oi, {nome}!", recado: "Minha família é grande no coração, e você tem um lugarzinho garantido nela. Que sorte a minha!" },
    { oi: "Tudo bem, {nome}?", recado: "Dizem que um bebê precisa de muito amor pra crescer forte. Com você por perto, isso não vai faltar. Obrigado!" },
    { oi: "Oiê, {nome}!", recado: "Eu vou crescer ouvindo histórias de quem esteve comigo desde o comecinho, e você vai estar em muitas delas." },
    { oi: "Oi, {nome}!", recado: "Vou precisar de muita fralda, muito colo e muitas pessoas queridas por perto. Que bom que você é uma delas!" },
    { oi: "Olá, {nome}!", recado: "Ainda nem cheguei e já aprendi uma coisa: gente boa como você deixa tudo mais bonito. Até o dia do chá!" },
    { oi: "Psiu, {nome}!", recado: "Meus amigos bichinhos já estão prontos pra festa, mas ela só fica completa com você lá. Conto com você!" },
    { oi: "Oi, {nome}!", recado: "Quando eu crescer, quero ouvir de você como foi esse dia tão especial. Guarda bem essa lembrança pra mim, tá?" },
    { oi: "Oizinho, {nome}!", recado: "Pedi pra mamãe escrever este cartão por mim, porque ainda não sei escrever. Mas o carinho é todinho meu!" },
    { oi: "Oi, {nome}!", recado: "Tenho muito pra aprender quando chegar, e vou ter muitas pessoas boas pra me ensinar. Você é uma delas!" },
    { oi: "Olá, {nome}!", recado: "Cada carinho que eu recebo vira uma lembrança guardada no coração, e o seu já tem um lugar especial lá." },
    { oi: "Ei, {nome}!", recado: "O Noah aqui, dando um chutinho de alegria só pra você! Obrigado por fazer parte desse momento." },
    { oi: "Oi, {nome}!", recado: "Ainda não sei falar, mas, se soubesse, a primeira coisa que eu diria era: obrigado por me esperar com tanto amor!" },
    { oi: "Tudo bem, {nome}?", recado: "Prometo distribuir muitos sorrisos pra quem gosta de mim, e você já está no topo da minha lista!" },
    { oi: "Oiê, {nome}!", recado: "Sabia que fralda vai ser a minha roupa preferida? Obrigado por cuidar do meu conforto antes mesmo de eu chegar!" },
    { oi: "Psiu, {nome}!", recado: "Tô te mandando um abraço do tamanho do meu coração. Ele ainda é pequeno, mas é todo cheio de amor por você!" },
    { oi: "Oi, {nome}!", recado: "Família é quem ama a gente de verdade. E eu já percebi que você me ama! Obrigado por isso." },
    { oi: "Olá, {nome}!", recado: "Vou chegar rodeado de amor, e um pedacinho dele vem de você. Obrigado por esse presente lindo!" },
    { oi: "Cadê? Achou, {nome}!", recado: "Esconde-esconde é comigo mesmo: estou escondidinho na barriguinha! Mas de você eu não quero me esconder nunca." },
    { oi: "Oizinho, {nome}!", recado: "Meu primeiro presente de verdade é saber que tenho gente como você esperando por mim. Obrigado!" },
    { oi: "Oi, oi, {nome}!", recado: "Se um sorriso de bebê valesse ouro, eu ia te dar um tesouro inteirinho. Obrigado por todo o carinho!" },
    { oi: "Oi, {nome}!", recado: "Ainda não sei amarrar o sapato nem contar até dez, mas já sei agradecer: obrigado por estar comigo!" },
    { oi: "Olá, {nome}!", recado: "Dizem que eu sou a novidade da família. Mas a melhor novidade pra mim é saber que você vai estar por perto!" },
    { oi: "Ei, {nome}!", recado: "Cada fralda que chega é um sorriso a mais pro papai e pra mamãe. E cada abraço seu vai ser um sorriso a mais pra mim!" },
    { oi: "Tudo bem, {nome}?", recado: "Daqui da barriguinha eu já sinto: amor se mede em cuidado, em colo e em gente que aparece. Obrigado por aparecer!" },
    { oi: "Oiê, {nome}!", recado: "Meu coraçãozinho bate mais forte quando sabe que tem gente especial esperando por mim. E você é muito especial!" },
    { oi: "Psiu, {nome}!", recado: "Vou te contar baixinho: você já é uma das minhas pessoas favoritas. Não conta pra ninguém!" },
    { oi: "Oi, {nome}!", recado: "Quando eu aprender a falar, uma das primeiras palavras vai ser “obrigado”. E ela vai ser pra você!" },
    { oi: "Olá, {nome}!", recado: "Hoje eu ainda nem sei engatinhar, mas um dia vou correr pra te dar um abraço. Pode me esperar!" },
    { oi: "Oizinho, {nome}!", recado: "Eu sou o Noah, e este recadinho é pra dizer que a minha vida já começa mais bonita com você nela." },
    { oi: "Cadê? Achou, {nome}!", recado: "Achei uma pessoa muito especial: você! Obrigado por fazer parte do meu comecinho." },
    { oi: "Oi, {nome}!", recado: "O papai diz que eu sou um bebê de sorte. Eu acho que ele está certo, porque eu tenho você! Até o dia do chá!" },
    { oi: "Ei, {nome}!", recado: "Ainda sou pequenininho, mas o meu agradecimento é gigante. Obrigado por pensar em mim!" },
    { oi: "Tudo bem, {nome}?", recado: "Fralda sequinha, colo quentinho e gente querida por perto: é tudo o que um bebê precisa. Obrigado por cuidar de mim!" },
    { oi: "Olá, {nome}!", recado: "A gente ainda não se conhece, mas já sinto que vai ser amor à primeira vista!" },
    { oi: "Oiê, {nome}!", recado: "Quero crescer cercado de gente boa, e você chegou primeiro na fila! Obrigado pelo carinho." },
    { oi: "Oi, oi, {nome}!", recado: "Já estou treinando um sorriso bem bonito aqui dentro. Ele vai ser todinho seu quando eu chegar!" },
    { oi: "Psiu, {nome}!", recado: "Aqui é o Noah. Vim avisar que o seu lugar no meu coração já está reservado. Obrigado por tudo!" },
    { oi: "Oi, {nome}!", recado: "Eu vou ganhar muitos presentes, mas o melhor deles é ter pessoas como você na minha vida." },
    { oi: "Olá, {nome}!", recado: "Cada pacote de fralda é um carinho que dura o dia inteiro. Obrigado pelo seu!" },
    { oi: "Oizinho, {nome}!", recado: "Quando eu ficar grandão, vou lembrar de quem cuidou de mim desde a barriguinha. E você vai estar nessa lembrança!" },
    { oi: "Ei, {nome}!", recado: "Um bebê feliz é um bebê sequinho e amado. Com você, eu vou ter os dois! Obrigado!" },
    { oi: "Tudo bem, {nome}?", recado: "O Noah aqui! Só passei pra dizer que você já faz parte da minha história, e isso me deixa muito feliz." },
    { oi: "Cadê? Achou, {nome}!", recado: "Achou o bebê mais feliz da barriguinha! E a culpa é sua, que me enche de carinho. Obrigado!" },
    { oi: "Oiê, {nome}!", recado: "A mamãe diz que amor de família é o melhor cobertor. Com você por perto, eu vou ficar sempre quentinho!" },
    { oi: "Oi, {nome}!", recado: "Ainda não sei dizer o seu nome, mas já sei que ele vai ser um dos meus preferidos. Até breve!" },
    { oi: "Olá, {nome}!", recado: "Quero te agradecer com o maior abraço que um bebê consegue dar. Assim que eu chegar, ele é seu!" },
    { oi: "Psiu, {nome}!", recado: "Um segredinho do Noah: o mundo fica mais bonito com gente como você nele. Mal posso esperar pra ver!" },
    { oi: "Oizinho, {nome}!", recado: "Ainda nem cheguei, mas já aprendi: quem cuida da gente com carinho vira família. Obrigado!" },
    { oi: "Oi, oi, {nome}!", recado: "Cada risadinha minha vai ter um pouquinho de você. Obrigado por fazer parte desse comecinho!" },
    { oi: "Ei, {nome}!", recado: "Papai e mamãe estão preparando tudo com muito amor, e você faz parte desse amor também. Obrigado!" },
    { oi: "Tudo bem, {nome}?", recado: "Eu ainda sou um bebezinho, mas já entendo de carinho. E o seu é dos bons! Até o dia do chá." },
    { oi: "Oiê, {nome}!", recado: "Se cada pessoa que me ama fosse uma estrelinha, você brilharia bem forte no meu céu." },
    { oi: "Oi, {nome}!", recado: "Obrigado por pensar em mim! Prometo crescer forte, feliz e cheio de histórias pra te contar." },
    { oi: "Olá, {nome}!", recado: "Quem ajuda a cuidar de um bebê ganha um lugar pra sempre no coração dele. O seu já está garantido!" },
    { oi: "Cadê? Achou, {nome}!", recado: "Brincadeira preferida: esconde-esconde. Pessoa preferida pra brincar comigo quando eu chegar: você!" },
    { oi: "Psiu, {nome}!", recado: "Ainda não sei bater palminha, mas, quando aprender, a primeira vai ser pra você!" },
    { oi: "Oizinho, {nome}!", recado: "Você entrou na minha vida antes mesmo de eu chegar ao mundo. Isso é muito bonito! Obrigado." },
    { oi: "Oi, oi, {nome}!", recado: "Eu sou pequeno, mas o meu obrigado é do tamanho do céu. Obrigado por me esperar com tanto carinho!" },
    { oi: "Ei, {nome}!", recado: "Meu soninho aqui na barriguinha fica mais tranquilo sabendo que tem tanta gente boa me esperando. Obrigado!" },
    { oi: "Tudo bem, {nome}?", recado: "Vou guardar o seu carinho no meu cantinho preferido do coração. Até o dia do chá!" },
    { oi: "Oiê, {nome}!", recado: "Uma fralda, um abraço e um sorriso: é assim que se conquista um bebê. Você conseguiu!" },
    { oi: "Oi, {nome}!", recado: "O ursinho, o coelhinho e o elefantinho mandaram dizer que estão te esperando. E eu também!" },
    { oi: "Olá, {nome}!", recado: "Daqui da barriguinha eu escuto o papai e a mamãe dizendo: “Que bom ter gente assim com a gente”. Eles falam de você!" },
    { oi: "Psiu, {nome}!", recado: "O Noah aqui, com um abraço quentinho e um obrigado bem grandão. Você mora no meu coração!" },
    { oi: "Oizinho, {nome}!", recado: "Já pensou? Um dia eu vou ver as fotos desse chá e vou saber que você estava lá. Que alegria!" },
    { oi: "Cadê? Achou, {nome}!", recado: "Te achei! E não vou mais te soltar: agora você faz parte da minha história." },
    { oi: "Oi, oi, {nome}!", recado: "Dizem que bebê traz alegria. Mas quem traz alegria pra mim é você! Obrigado pelo carinho." },
    { oi: "Ei, {nome}!", recado: "Vou crescer sabendo que tinha muita gente torcendo por mim. Obrigado por torcer também!" },
    { oi: "Tudo bem, {nome}?", recado: "Cada cuidado comigo é uma sementinha de amor. Com você por perto, vai nascer um jardim inteiro!" },
    { oi: "Oiê, {nome}!", recado: "Ainda estou crescendo aqui dentro, mas a parte mais importante já está prontinha: um coração cheio de amor por você." },
    { oi: "Oi, {nome}!", recado: "Quem me dá carinho ganha sorriso em dobro. Pode ir se preparando!" },
    { oi: "Olá, {nome}!", recado: "Fralda trocada, barriguinha cheia e gente querida por perto: o dia perfeito de um bebê. Obrigado por fazer parte dele!" },
    { oi: "Psiu, {nome}!", recado: "Quer saber um segredo? O papai e a mamãe ficam todos bobos quando falam de mim. E eu fico todo bobo quando penso em você!" },
    { oi: "Oizinho, {nome}!", recado: "Eu ainda não sei agradecer direitinho, então pedi ajuda: muito, muito, muito obrigado!" },
    { oi: "Cadê? Achou, {nome}!", recado: "Achou um bebê que já te ama de montão! Até o dia do chá." },
    { oi: "Oi, oi, {nome}!", recado: "Na minha família tem muito amor, muita risada e agora tem você também. Que alegria!" },
    { oi: "Ei, {nome}!", recado: "Um bebê não escolhe a família, mas tenho certeza de que eu escolheria você. Obrigado!" },
    { oi: "Tudo bem, {nome}?", recado: "Vou crescer, vou correr, vou fazer bagunça... e você vai poder dizer que estava lá desde o comecinho!" },
    { oi: "Oiê, {nome}!", recado: "Cada pessoa que me ama deixa um pouquinho de cor no meu mundo. A sua é uma das mais bonitas!" },
    { oi: "Oi, {nome}!", recado: "Eu prometo: quando chegar, vou te dar o abraço mais apertado que um bebê consegue. Por enquanto, aceita este cartão?" },
    { oi: "Olá, {nome}!", recado: "Com tanta gente boa me esperando, eu sou um bebê de muita sorte. Obrigado por fazer parte disso!" },
    { oi: "Psiu, {nome}!", recado: "Este é um recado secreto do Noah: você é demais! Pode contar pra todo mundo." },
    { oi: "Oizinho, {nome}!", recado: "Eu ainda não sei o que é um chá, mas, se tem você lá, já sei que vai ser incrível!" },
    { oi: "Cadê? Achou, {nome}!", recado: "Sabe o que eu mais gosto de achar? Gente que me enche de carinho, igualzinho a você!" },
    { oi: "Oi, oi, {nome}!", recado: "Um dia eu vou te contar todas as minhas aventuras. A primeira delas começa com você no meu chá!" },
    { oi: "Ei, {nome}!", recado: "Papai, mamãe e eu agradecemos de coração por todo o carinho. Você é especial pra nós três!" },
    { oi: "Tudo bem, {nome}?", recado: "Dizem que eu vou fazer muita gente sorrir. Mas quem já me faz sorrir é você! Obrigado." },
    { oi: "Oiê, {nome}!", recado: "Que o nosso laço seja forte como abraço de bebê: daqueles que não querem soltar nunca!" },
    { oi: "Oi, {nome}!", recado: "Eu já tenho um monte de motivos pra ser feliz, e você é um dos maiores. Obrigado!" },
    { oi: "Olá, {nome}!", recado: "Uma fralda de cada vez, um sorriso de cada vez, um abraço de cada vez. E muitos deles com você!" },
    { oi: "Psiu, {nome}!", recado: "Chega mais perto: é o Noah te mandando um beijinho estalado lá da barriguinha! Obrigado por todo o carinho." },
    { oi: "Oizinho, {nome}!", recado: "Eu vou crescer ouvindo que tive pessoas maravilhosas do meu lado. E você é uma delas!" },
    { oi: "Cadê? Achou, {nome}!", recado: "Achou o Noah, mandando um obrigado do tamanho de um elefante!" },
    { oi: "Oi, oi, {nome}!", recado: "Estou contando os dias pra chegar, e um dos motivos é poder te conhecer. Até breve!" },
    { oi: "Ei, {nome}!", recado: "Este cartão é só seu, e o meu carinho por você também. Até o dia do chá!" },
  ],
  assinatura: "Com carinho,",
};
