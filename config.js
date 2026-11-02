// ============================================================================
//  CHÁ DO NOAH: tudo o que dá pra mudar no site fica AQUI.
//  Mude só o que está entre aspas "..." e os números.
//  Depois de salvar, peça pro Claude: "sobe o Chá do Noah" (ele publica no GitHub).
// ============================================================================
const CHA = {
  titulo: "Chá do Noah",
  bebe: "Noah",

  // data do chá: ano-mês-dia
  data: "2026-11-27",

  // o que ficar vazio ("") não aparece no lembrete
  horario: "",   // ex.: "15h"
  local: "",     // ex.: "Rua das Flores, 123 - Centro"
  observacao: "", // um aviso a mais, se quiser

  // o que cada pessoa leva (igual à lista de papel)
  levar: "1 pacote de fraldas descartáveis",

  // Quantos pacotes de cada tamanho vocês querem no total.
  // O site sorteia o tamanho de cada pessoa nessa mesma proporção, pelo telefone:
  // a mesma pessoa sempre tira o mesmo tamanho, mesmo se preencher de novo.
  fraldas: [
    { tamanho: "RN", nome: "Recém-nascido", pacotes: 2 },
    { tamanho: "P", nome: "Pequena", pacotes: 5 },
    { tamanho: "M", nome: "Média", pacotes: 15 },
    { tamanho: "G", nome: "Grande", pacotes: 15 },
    { tamanho: "GG", nome: "Extra grande", pacotes: 10 },
    { tamanho: "XG", nome: "Extra grande", pacotes: 3 },
  ],

  // O recado do Noah: o site junta 1 saudação + 1 começo + 1 meio + 1 final,
  // escolhidos pelo nome e pelo telefone, então cada pessoa ganha o seu.
  // {nome} vira o nome que a pessoa escreveu.
  recado: {
    saudacoes: [
      "Oi, {nome}!",
      "Olá, {nome}!",
      "Psiu, {nome}!",
      "Oi, oi, {nome}!",
      "Ei, {nome}!",
      "Oiê, {nome}!",
      "Tudo bem, {nome}?",
      "{nome}, oi!",
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
      "O Noah passando pra deixar um recado.",
    ],
    meios: [
      "Eu sou pequenininho, mas já sei que você é uma pessoa muito especial na minha história.",
      "Ainda estou aprendendo tudo sobre o mundo, mas uma coisa eu já sei: gente boa como você deixa tudo mais bonito.",
      "O papai e a mamãe me contaram que você faz parte da nossa história, e eu fiquei muito feliz em saber disso.",
      "Cada carinho que eu recebo vira uma lembrança guardada no coração, e o seu já tem um lugar especial lá.",
      "Dizem que um bebê precisa de muito amor pra crescer forte. Com você por perto, isso não vai faltar.",
      "Minha família é grande no coração, e você tem um lugarzinho garantido nela.",
      "Eu vou crescer ouvindo histórias de quem esteve comigo desde o começo, e você vai estar em muitas delas.",
      "Ainda sou do tamanho de um abraço, mas já tenho espaço de sobra pra guardar todo o seu carinho.",
      "Vou precisar de muita fralda, muito colo e muitas pessoas queridas por perto. Que bom que você é uma delas!",
      "Cada pacotinho de fralda vai virar um dia de conforto pra mim, e cada abraço vai virar uma lembrança boa.",
      "Tenho muito pra aprender, e vou ter muitas pessoas boas pra me ensinar. Você é uma delas!",
      "Quando eu crescer, quero ouvir de você como foi esse dia tão especial.",
    ],
    finais: [
      "Obrigado por todo o carinho!",
      "Te espero no meu chá, tá?",
      "Obrigado por fazer parte desse momento tão especial!",
      "Um beijo babado e um abraço bem apertado!",
      "Conto com você no meu chá!",
      "Obrigado de coração, de um coração bem pequenininho!",
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
