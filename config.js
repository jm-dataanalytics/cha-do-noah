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
  // O jeito (jm, 02/11, "enraiza isso"): o Noah falando em primeira pessoa, íntimo e humano, com humor
  // delicado; cada uma diferente da outra; nada de cobrança. Ver referencias/100_recadinhos_do_noah.md.
  // "oi" vai grande no cartão; {nome} vira como o Noah chama a pessoa (ex.: "titia Ana", "titio Carlos").
  mensagens: [
    { oi: "Oi, {nome}!", recado: "Daqui da barriguinha eu ouço um monte de vozes, e agora sei que uma delas está torcendo por mim. Obrigado por fazer parte dessa espera tão gostosa." },
    { oi: "Psiu, {nome}!", recado: "Vou te contar um segredo: a mamãe sorri toda vez que alguém pensa em mim. Hoje foi a sua vez de fazer ela sorrir." },
    { oi: "Toc, toc, {nome}!", recado: "Sou eu, o Noah, batendo aqui de dentro. Ainda não dá pra abrir a porta, mas já deu pra sentir o seu carinho chegando." },
    { oi: "{nome}, sou eu!", recado: "Ainda não sei como é o seu rosto, mas já sei que você é daquelas pessoas que a gente quer por perto. Mal posso esperar pra conferir." },
    { oi: "Ei, {nome}!", recado: "Me contaram que vou trocar de fralda um montão de vezes. Pelo menos agora sei que cada troca vai ter um pouquinho de você." },
    { oi: "Oi, {nome}!", recado: "Ainda estou aprendendo a ser gente, então por enquanto só sei fazer duas coisas: crescer e agradecer. Obrigado!" },
    { oi: "Olha só, {nome}!", recado: "Antes mesmo de eu chegar, você já está cuidando de mim. Acho que isso tem um nome bonito: carinho de verdade." },
    { oi: "{nome}, chega mais perto!", recado: "Quero te dar um obrigado bem baixinho, do jeito que se fala perto de um bebê dormindo. Obrigado. Pronto, falei!" },
    { oi: "Bom dia, boa tarde ou boa noite, {nome}!", recado: "Aqui dentro eu ainda não sei que horas são, mas sei que qualquer hora é boa pra agradecer o seu carinho." },
    { oi: "Oi, {nome}!", recado: "A mamãe está arrumando o meu cantinho com todo o cuidado do mundo. Agora ele tem uma partezinha sua também." },
    { oi: "Psiu, {nome}!", recado: "Estou treinando chutinhos aqui dentro. Esse de agora foi de alegria, porque soube que você pensou em mim." },
    { oi: "Alô, {nome}!", recado: "Aqui é da barriguinha da mamãe. Liguei só pra dizer obrigado e avisar que estou chegando. Um beijo e até breve!" },
    { oi: "{nome}, tenho uma novidade!", recado: "Já tenho fralda, já tenho cantinho e agora tenho mais uma pessoa especial esperando por mim. Estou ficando mal-acostumado!" },
    { oi: "Oi, {nome}!", recado: "Dizem que bebê não guarda lembrança dos primeiros dias. Então pedi pra mamãe guardar a sua por mim." },
    { oi: "Ei, {nome}!", recado: "Sabe aquela sensação de abraço quentinho? Ainda não conheço, mas tenho certeza de que vou conhecer no seu colo." },
    { oi: "{nome}, sou eu, o Noah!", recado: "Ainda estou aqui no escurinho, crescendo de pouquinho em pouquinho. Mas o seu carinho chegou aqui dentro e iluminou tudo." },
    { oi: "Oi, {nome}!", recado: "Quando eu chegar, vou ter muito o que aprender: mamar, sorrir, dormir a noite toda (essa vai demorar). Mas agradecer eu já sei." },
    { oi: "Psiu, {nome}!", recado: "Vou chegar pequenininho, cheio de dobrinhas e com um choro bem alto. Já estou avisando pra ninguém se assustar!" },
    { oi: "Olha só, {nome}!", recado: "Cada pessoa que me espera deixa o mundo lá fora um pouquinho mais bonito. E você deixou ele bem mais bonito hoje." },
    { oi: "Oi, {nome}!", recado: "Ainda não sei falar o seu nome, mas já sei que ele está num lugar especial: na lista de quem me espera com amor." },
    { oi: "Toc, toc, {nome}!", recado: "Quem é? É o Noah, mandando um obrigado lá de dentro! Ainda falta um pouquinho, mas eu já estou quase pronto." },
    { oi: "{nome}, chega mais perto!", recado: "Encosta o ouvido na barriga da mamãe: o barulhinho que você vai ouvir é o meu coração dizendo obrigado." },
    { oi: "Ei, {nome}!", recado: "Fralda, colo, soninho e gente querida: minha listinha de coisas favoritas já está ficando grande. Você entrou nela!" },
    { oi: "Oi, {nome}!", recado: "Eu ainda não sei o que é um chá, mas a mamãe falou que vai ter muita gente feliz por minha causa. Que responsabilidade!" },
    { oi: "Psiu, {nome}!", recado: "Aqui dentro está apertadinho, mas o coração está espaçoso. Já tem um lugar guardado pra você." },
    { oi: "Bom dia, boa tarde ou boa noite, {nome}!", recado: "Um dia eu vou te fazer rir, te fazer babar de amor e talvez te fazer trocar uma fralda. Por enquanto, obrigado por esperar por mim." },
    { oi: "{nome}, tenho uma novidade!", recado: "Estou crescendo! Ainda não sei medir, mas a mamãe garante que falta pouquinho. Pouquinho pra eu te conhecer." },
    { oi: "Oi, {nome}!", recado: "Ainda não posso te dar um abraço, mas posso te mandar este cartão. Considera ele um abraço guardado pra depois." },
    { oi: "Alô, {nome}!", recado: "É o Noah! Passei só pra avisar que você já faz parte da minha história, mesmo antes do primeiro capítulo." },
    { oi: "Ei, {nome}!", recado: "Me disseram que quem cuida de bebê ganha sorriso de presente. Os meus ainda estão em treinamento, mas o primeiro pode ser seu." },
    { oi: "Olha só, {nome}!", recado: "A espera fica mais leve quando tem gente boa por perto. Obrigado por deixar a espera da mamãe mais gostosa." },
    { oi: "Oi, {nome}!", recado: "Eu sou pequeno demais pra entender tudo, mas grande o bastante pra sentir quando tem carinho no ar. E tem muito!" },
    { oi: "{nome}, sou eu!", recado: "Já estou imaginando o seu jeito de falar comigo: aquela voz fininha que todo mundo faz pra bebê. Pode fazer, eu vou adorar." },
    { oi: "Psiu, {nome}!", recado: "Não conta pra ninguém, mas eu acho que vou ser um bebê muito sortudo. Olha quanta gente boa me esperando!" },
    { oi: "Oi, {nome}!", recado: "Vou usar muitas fraldas até aprender a não precisar mais delas. Mas o carinho de quem cuidou de mim eu vou levar pra sempre." },
    { oi: "Toc, toc, {nome}!", recado: "Ainda não está na hora de abrir, mas eu já queria te dar um oi. Oi! Pronto. Agora volto a crescer." },
    { oi: "Ei, {nome}!", recado: "Sabe o que eu mais quero quando chegar? Conhecer as pessoas que torceram por mim desde a barriguinha. Você está na lista." },
    { oi: "Oi, {nome}!", recado: "A mamãe me conta tudo: quem perguntou de mim, quem mandou carinho, quem está contando os dias. Seu nome apareceu na conversa!" },
    { oi: "{nome}, chega mais perto!", recado: "Quero te contar que já sei reconhecer vozes. Quando você falar comigo, vou prestar bastante atenção." },
    { oi: "Olha só, {nome}!", recado: "Meu enxoval está ficando lindo, mas o que eu mais gosto nele é saber que cada coisinha veio de alguém especial." },
    { oi: "Oi, {nome}!", recado: "Ainda falta um tempinho pra gente se conhecer, mas já sinto que vai ser daqueles encontros que ficam na memória. Pelo menos na sua!" },
    { oi: "Psiu, {nome}!", recado: "Estou deixando a mamãe com saudade de alguém que ela nem conhece ainda: eu! E agora você entrou no grupo dos ansiosos também." },
    { oi: "Bom dia, boa tarde ou boa noite, {nome}!", recado: "Por aqui é sempre hora de soninho. Mas acordei rapidinho só pra dizer: obrigado pelo carinho!" },
    { oi: "Ei, {nome}!", recado: "Me contaram que fralda limpinha deixa bebê feliz. Então, de certa forma, você já está me deixando feliz!" },
    { oi: "Oi, {nome}!", recado: "Eu ainda não tenho dente nem nada pra falar. Mas tenho um obrigado bem grande guardado pra você." },
    { oi: "{nome}, tenho uma novidade!", recado: "Já escolhi meu presente preferido: gente querida por perto. E o seu chegou embrulhado em carinho!" },
    { oi: "Alô, {nome}!", recado: "Aqui é o Noah, direto da barriguinha. Só liguei pra saber se você vai estar lá quando eu chegar. Vai, né?" },
    { oi: "Oi, {nome}!", recado: "Pensei em muitas formas de agradecer, mas como ainda não sei escrever, a mamãe escreveu por mim: obrigado de coração!" },
    { oi: "Psiu, {nome}!", recado: "Um dia eu vou descobrir que tinha um monte de gente me esperando antes de eu nascer. E vou ficar todo bobo com isso." },
    { oi: "Olha só, {nome}!", recado: "Lá fora tem muita coisa sendo preparada pra mim. A minha preferida é saber que você vai estar por perto." },
    { oi: "Oi, {nome}!", recado: "A mamãe disse que eu vou mudar a vida de muita gente. Espero começar pela sua, com muitos sorrisos e pouquíssimo choro. Vou tentar!" },
    { oi: "Ei, {nome}!", recado: "Sabia que bebê sente quando é amado? Pois é, aqui dentro está todo mundo comentando. Quer dizer, só eu. Mas eu sinto!" },
    { oi: "{nome}, sou eu, o Noah!", recado: "Este cartão é pequenininho, mas o obrigado que vai dentro dele é enorme. Pode guardar com carinho?" },
    { oi: "Toc, toc, {nome}!", recado: "O Noah aqui, contando os dias com a mamãe. Ela conta nos dedos; eu conto nos chutinhos." },
    { oi: "Oi, {nome}!", recado: "Antes do primeiro colo, do primeiro banho e da primeira foto, veio o seu carinho. Obrigado por chegar antes de mim!" },
    { oi: "Psiu, {nome}!", recado: "Vou te confessar: estou um pouco ansioso pra conhecer o mundo. Saber que você está nele já me deixa mais tranquilo." },
    { oi: "Bom dia, boa tarde ou boa noite, {nome}!", recado: "Quando eu chegar, não vou ligar pro relógio: vou querer colo a qualquer hora. Já pode ir se preparando!" },
    { oi: "Olha só, {nome}!", recado: "Nem nasci e já tenho uma torcida organizada. Se tiver uniforme, quero que o seu seja de abraço." },
    { oi: "Oi, {nome}!", recado: "Eu ainda sou um segredinho da barriga da mamãe, mas um segredinho muito amado. E uma parte desse amor veio de você." },
    { oi: "Ei, {nome}!", recado: "Me falaram que as primeiras semanas são de muito sono, muito leite e muita fralda. Pelo menos da última parte eu já estou bem servido!" },
    { oi: "{nome}, chega mais perto!", recado: "Fecha os olhos e imagina um bebê sorrindo pra você. Esse sou eu, daqui a pouquinho. Obrigado pelo carinho!" },
    { oi: "Alô, {nome}!", recado: "Aqui dentro não pega sinal, mas o seu carinho chegou mesmo assim. Deve ser coisa do coração!" },
    { oi: "Oi, {nome}!", recado: "Eu vou crescer ouvindo histórias de quem me esperou. Espero que a sua tenha muitas risadas." },
    { oi: "Psiu, {nome}!", recado: "A mamãe está montando tudo com calma e com amor. Eu fico aqui só supervisionando. E aprovando o seu carinho!" },
    { oi: "{nome}, tenho uma novidade!", recado: "Ainda não sei qual vai ser a minha primeira palavra. Mas a segunda, com certeza, vai ser obrigado." },
    { oi: "Oi, {nome}!", recado: "Por enquanto, o meu mundo cabe na barriguinha da mamãe. Mas o seu carinho é tão grande que quase não coube!" },
    { oi: "Ei, {nome}!", recado: "Dizem que bebê dá trabalho. Eu prefiro dizer que bebê junta a família. E que bom que você vai estar junto!" },
    { oi: "Olha só, {nome}!", recado: "Cada fraldinha que chega é uma noite mais tranquila pra mamãe. E cada pessoa que me espera é um sorriso a mais pra mim." },
    { oi: "Oi, {nome}!", recado: "Ainda não tenho nem certidão de nascimento, mas já tenho uma pessoa especial que pensou em mim. Que começo!" },
    { oi: "Toc, toc, {nome}!", recado: "Estou batendo pra avisar que o seu carinho chegou direitinho aqui dentro. Entregue com sucesso!" },
    { oi: "Psiu, {nome}!", recado: "Quando eu chegar, vou demorar um pouquinho pra entender quem é quem. Mas vou reconhecer você pelo carinho." },
    { oi: "Bom dia, boa tarde ou boa noite, {nome}!", recado: "Eu ainda não sei a diferença entre o dia e a noite. Mas já sei a diferença que você faz!" },
    { oi: "{nome}, sou eu!", recado: "Fiz uma listinha do que vou precisar: colo, leite, soninho e gente que me ama. A última parte você já resolveu." },
    { oi: "Oi, {nome}!", recado: "A mamãe diz que eu vou ser muito amado. Eu acho que ela está certa, e você é a prova disso." },
    { oi: "Ei, {nome}!", recado: "Estou de mudança: da barriguinha pro mundo. Obrigado por ajudar a preparar a casa nova!" },
    { oi: "Olha só, {nome}!", recado: "Ainda não posso agradecer olhando nos seus olhos, então vai por escrito mesmo: muito obrigado!" },
    { oi: "Oi, {nome}!", recado: "Daqui de dentro, cada dia parece igual: quentinho, escurinho e tranquilo. Mas hoje foi diferente, porque chegou o seu carinho." },
    { oi: "Psiu, {nome}!", recado: "Vou chegar sem saber de nada, mas uma coisa eu já vou trazer aprendida: que tem muita gente boa me esperando." },
    { oi: "Alô, {nome}!", recado: "Aqui é o Noah. Estou ligando de um lugar bem quentinho pra dizer que não vejo a hora de te conhecer!" },
    { oi: "{nome}, chega mais perto!", recado: "Vou te contar o meu plano: chegar, conhecer todo mundo e dormir no colo de quem me esperou. Você está no plano." },
    { oi: "Oi, {nome}!", recado: "Eu ainda não sei contar, mas a mamãe sabe: falta pouquinho! E com gente como você por perto, os dias passam mais rápido." },
    { oi: "Ei, {nome}!", recado: "Brinquedo eu vou ganhar muitos, mas carinho de verdade é presente que não se compra. Obrigado pelo seu!" },
    { oi: "Olha só, {nome}!", recado: "O mundo lá fora deve ser enorme. Ainda bem que vai ter gente querida pra me mostrar tudo devagarinho." },
    { oi: "Toc, toc, {nome}!", recado: "Ainda não posso sair pra brincar, mas já estou guardando energia pra quando chegar. Prepara o colo!" },
    { oi: "Oi, {nome}!", recado: "Eu ainda vou demorar pra entender o que é gratidão. Mas a mamãe já entendeu, e ela está muito grata a você." },
    { oi: "Psiu, {nome}!", recado: "Sabe o que é melhor que fralda nova? Saber que alguém pensou em mim antes de ela chegar. Obrigado!" },
    { oi: "{nome}, tenho uma novidade!", recado: "Estou fazendo um curso intensivo de crescer. Até agora estou indo muito bem, e o seu carinho ajudou bastante!" },
    { oi: "Bom dia, boa tarde ou boa noite, {nome}!", recado: "Por enquanto eu durmo quase o tempo todo. Quando eu chegar, vai ser a vez de todo mundo ficar sem dormir. Desculpa desde já!" },
    { oi: "Oi, {nome}!", recado: "Um dia vou olhar as fotos desse chá e perguntar quem é quem. Alguém vai apontar pra você e dizer: essa pessoa te esperou com muito amor." },
    { oi: "Ei, {nome}!", recado: "Sou pequeno no tamanho, mas já sou grande em sorte: olha quanta gente boa vai fazer parte da minha vida!" },
    { oi: "Olha só, {nome}!", recado: "A mamãe está contando os dias, o papai também, e agora você. Já somos um time!" },
    { oi: "{nome}, sou eu, o Noah!", recado: "Ainda não sei o que vou ser quando crescer, mas já sei que vou ser muito grato a quem cuidou de mim desde já." },
    { oi: "Psiu, {nome}!", recado: "Estou te mandando um beijinho daqui de dentro. Ele vai meio abafado, mas vai com muito carinho." },
    { oi: "Oi, {nome}!", recado: "Ainda falta um pouco pra gente se ver, mas eu já guardei um sorriso sem dentes especialmente pra você." },
    { oi: "Toc, toc, {nome}!", recado: "É o Noah! Vim avisar que o seu carinho foi aprovado aqui dentro por unanimidade. Tá, a votação só teve eu. Mas foi unânime!" },
    { oi: "Alô, {nome}!", recado: "Se carinho tivesse cheiro, o seu teria cheirinho de bebê. Obrigado por cuidar de mim antes mesmo de eu chegar." },
    { oi: "Ei, {nome}!", recado: "A mamãe me contou que ainda vou passar por muitas trocas de fralda. Com tanta gente boa ajudando, já estou mais tranquilo." },
    { oi: "{nome}, chega mais perto!", recado: "Este é um recadinho só seu, escrito com o pouquinho que eu sei: amor, espera e obrigado." },
    { oi: "Oi, {nome}!", recado: "Estou chegando devagarinho, no meu tempo. Obrigado por esperar comigo e por deixar tudo pronto com tanto carinho." },
    { oi: "Olha só, {nome}!", recado: "Quando você me pegar no colo pela primeira vez, lembra deste cartão: foi aqui que eu te disse obrigado pela primeira vez." },
  ],
  assinatura: "Com carinho,",
};
