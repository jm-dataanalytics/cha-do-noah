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

  // Os tamanhos que a pessoa pode escolher. "pacotes" é quantos vocês querem de cada um:
  // os que vocês mais querem ganham o selinho "mais pedido", e quem tocar em
  // "Tanto faz" recebe um tamanho sorteado nessa mesma proporção.
  fraldas: [
    { tamanho: "RN", nome: "Recém-nascido", pacotes: 2 },
    { tamanho: "P", nome: "Pequena", pacotes: 5 },
    { tamanho: "M", nome: "Média", pacotes: 15 },
    { tamanho: "G", nome: "Grande", pacotes: 15 },
    { tamanho: "GG", nome: "Extra grande", pacotes: 10 },
    { tamanho: "XG", nome: "Extra grande", pacotes: 3 },
  ],
  tantoFaz: "Tanto faz: o Noah escolhe",

  // O mimo é opcional. Quem marcar ganha um recadinho especial no lembrete (um destes, diferente pra cada um).
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

  // O recado do Noah: o site junta 1 saudação + 1 começo + 1 meio + 1 final,
  // escolhidos pelo nome e pelo telefone, então cada pessoa ganha o seu.
  // {nome} vira o nome que a pessoa escreveu.
  recado: {
    saudacoes: [
      "Oi, {nome}!",
      "Olá, {nome}!",
      "Psiu, {nome}!",
      "Oi, oi, {nome}!",
      "Oizinho, {nome}!",
      "Oiê, {nome}!",
      "Tudo bem, {nome}?",
      "Cadê? Achou, {nome}!",
    ],
    comecos: [
      "Aqui quem fala é o Noah.",
      "Sou eu, o Noah!",
      "Adivinha quem é? O Noah!",
      "É o Noah, com um recadinho só seu.",
      "O Noah aqui, todo feliz.",
      "Posso te contar um segredo? Sou eu, o Noah!",
      "Este cartão é só seu, e quem escreve é o Noah.",
      "Quem está falando é o Noah, o mais novo da família.",
      "Pedi pra escreverem este cartão por mim, porque ainda não sei escrever.",
      "O Noah passando pra deixar um recadinho.",
    ],
    meios: [
      "Eu sou pequenininho, mas já sei que você é uma pessoa muito especial na minha história.",
      "Ainda estou aprendendo tudo sobre o mundo, mas uma coisa eu já sei: gente boa como você deixa tudo mais bonito.",
      "O papai e a mamãe me contaram que você faz parte da nossa história, e meu coraçãozinho ficou quentinho.",
      "Cada carinho que eu recebo vira uma lembrança guardada no coração, e o seu já tem um lugar especial lá.",
      "Dizem que um bebê precisa de muito amor pra crescer forte. Com você por perto, isso não vai faltar.",
      "Minha família é grande no coração, e você tem um lugarzinho garantido nela.",
      "Eu vou crescer ouvindo histórias de quem esteve comigo desde o comecinho, e você vai estar em muitas delas.",
      "Ainda sou do tamanho de um abraço, mas já tenho espaço de sobra pra guardar todo o seu carinho.",
      "Vou precisar de muita fralda, muito colo e muitas pessoas queridas por perto. Que bom que você é uma delas!",
      "Cada pacotinho de fralda vai virar um dia de conforto pra mim, e cada abraço vai virar uma lembrança boa.",
      "Tenho muito pra aprender, e vou ter muitas pessoas boas pra me ensinar. Você é uma delas!",
      "Quando eu crescer, quero ouvir de você como foi esse dia tão especial.",
      "Meus amigos bichinhos já estão prontos pra festa, mas ela só fica completa com você lá.",
    ],
    finais: [
      "Obrigado por todo o carinho!",
      "Te espero no meu chá, tá?",
      "Obrigado por fazer parte desse momento tão especial!",
      "Um beijo babado e um abraço bem apertado!",
      "Conto com você no meu chá!",
      "Um obrigado do tamanho do meu coração!",
      "Mal posso esperar pra gente comemorar junto!",
      "Até o dia do chá!",
      "Obrigado por cuidar de mim desde já!",
      "Você é muito importante pra mim. Obrigado!",
      "Te mando um cheirinho de bebê!",
      "Que alegria ter você na minha vida!",
    ],
  },
  assinatura: "Com carinho,",
};
