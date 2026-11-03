// Como o Noah chama cada pessoa: o site tenta adivinhar pelo nome (titia ou titio), e a pessoa
// pode trocar (também tem vovó e vovô). Quem escreve "Tia Bia" ou "Vovó Lúcia" já diz sozinho.
const NOMES = (() => {
  const lista = (texto) => new Set(texto.trim().split(/\s+/));
  const FEMININOS = lista(`
    ana maria juliana adriana marcia fernanda patricia aline sandra camila amanda bruna jessica leticia julia
    luciana vanessa mariana gabriela vera vitoria larissa claudia beatriz rita luana sonia renata eliane josefa
    simone natalia francisca raquel carla daniela debora isabela isabella lucia rosana sara sarah andreia andrea
    tatiane carolina cristiane cristina alice laura helena valentina sophia sofia manuela isadora livia lara
    heloisa cecilia eloa yasmin yasmim rafaela bianca michele michelle priscila kelly karina katia regina rosangela
    silvia tereza teresa vania viviane denise elaine edna gisele ingrid ivone joana jaqueline kamila lais luiza
    luisa marina milena monica nathalia paula poliana roberta sabrina samara tamires thais valeria vivian yara
    zelia bia bel bete beth cris dani fabi gabi ju lu mari nati rose val aparecida conceicao graca socorro rosa
    rosemary dayane daiane eduarda emanuelly emilly emily esther ester flavia geovana giovana glaucia iara irene
    isis iris ivete janaina jordana juliane keila lorena lorrane marta mirela mirella nadia neide nicole noemi
    olivia pamela rayane rebeca rute ruth sueli suelen taina thalita vanda vilma agatha antonella ayla catarina
    clara elisa emanuele giulia isabel isabelle joice lavinia maite malu melissa stella estela cintia rosimeire
    rosemeire edilene eliana elisangela gilmara josiane lidiane luciene marlene nilza rosilene solange tania
    tatiana valdirene kissila kessia keyla kellen karen karla kenia lilian liliane lucimar lucinda madalena
    margarete margarida marilene marisa marli mercedes miriam nair neusa nilda norma odete raissa regiane
    rosilda rosimar sheila shirley sirlene sueli sulamita tais tamara telma terezinha vivi zilda zuleide dandara
    alessandra fabiana fabiola franciele franciely gleice greice hellen helen jamile jamille jenifer jennifer
    kauane ketlyn kethelyn lorena maisa mayara mayra michaela nayara nicolly pietra rayssa rhayssa samira
    stefany stephanie tayna thayna vitoria yasmin anne ane anna lia mel nina luna maya mia zoe ane
  `);
  const MASCULINOS = lista(`
    joao jose antonio francisco carlos paulo pedro lucas luiz luis marcos gabriel rafael daniel marcelo bruno
    eduardo felipe raimundo rodrigo manoel manuel mateus matheus andre fernando fabio leonardo gustavo guilherme
    leandro tiago thiago anderson ricardo marcio jorge sebastiao alexandre roberto edson diego vitor victor
    sergio claudio cesar julio renato joaquim miguel arthur artur heitor bernardo davi david theo teo enzo
    lorenzo benicio samuel henrique isaac caio vinicius murilo nicolas otavio igor ivan jonas josue juan kaique
    levi luan mauricio nelson osvaldo oswaldo raul reinaldo ronaldo rogerio sandro silvio valdir wagner
    wellington william willian washington adriano alan allan alberto alex alisson benedito cicero cristiano
    denis edgar elias emerson everton fabricio flavio gilberto gilson helio hugo jair jefferson joel jean
    juliano kleber luciano marco mario moises nathan natan rubens sidnei tales ulisses vagner wesley yuri zeca
    ze beto cadu dudu guto juca tito noah benjamin bento gael joaquim matias mathias apolo valentim anthony
    antony emanuel emmanuel ezequiel gean geovane giovani jeferson jonathan jonatas kevin luca marlon michel
    nilton nivaldo orlando pablo patrick ramon renan robson rodolfo romulo sidney thales tomas tomaz ubirajara
    valdemar vanderlei vladimir walter wilson adilson ailton aldo amauri amilton antonio arnaldo augusto
    benedito celso cleber cleiton denilson dirceu edmilson edvaldo elton erick eric fausto gerson hamilton
    humberto irineu jadson jailson joelson josias juarez laercio lauro lindomar lourival luciano marcio
    milton mozart nelio ney nilo norberto otaviano paulino reginaldo ronald sebastiao severino teodoro
    valter vicente vilmar wanderley zacarias zezinho junior jr neto filho
  `);
  // quem já escreve como é chamado: "Tia Bia", "Vovó Lúcia", "Padrinho Zé"...
  const TITULOS = {
    tia: "titia", titia: "titia", tiazinha: "titia", madrinha: "titia", dinda: "titia", dona: "titia",
    tio: "titio", titio: "titio", tiozinho: "titio", padrinho: "titio", dindo: "titio",
    "vó": "vovó", "vovó": "vovó", "avó": "vovó", vozinha: "vovó",
    "vô": "vovô", "vovô": "vovô", "avô": "vovô", vozinho: "vovô", seu: "titio",
    vovo: "", avo: "", vo: "", // sem acento não dá pra saber se é vovó ou vovô: a pessoa escolhe
  };
  const ehTitulo = (palavra) => Object.prototype.hasOwnProperty.call(TITULOS, palavra.toLowerCase());
  const PEQUENAS = new Set(["da", "de", "do", "das", "dos", "e"]);
  const semAcento = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "");

  // "titia" | "titio" | "" (quando não dá pra saber pelo nome)
  function generoPeloNome(primeiro) {
    const n = semAcento(primeiro.toLowerCase());
    if (FEMININOS.has(n)) return "titia";
    if (MASCULINOS.has(n)) return "titio";
    if (n.length < 3) return "";
    if (/(a|inha|ete|ane|iane|ine|ice|ele|elle)$/.test(n) && !/(luca|joshua|elisha|nikita)$/.test(n)) return "titia";
    if (/(o|ao|son|ton|uel|iel|ardo|aldo|undo|berto)$/.test(n)) return "titio";
    return "";
  }

  // separa o título (se a pessoa escreveu) e encurta o nome pra como um bebê chamaria:
  // até 2 nomes, sem o sobrenome ("Ana Paula de Souza" -> "Ana Paula")
  function entender(nomeCompleto) {
    const palavras = String(nomeCompleto || "").trim().split(/\s+/).filter(Boolean);
    let chamado = "";
    let deTitulo = false;
    while (palavras.length > 1 && ehTitulo(palavras[0])) {
      chamado = TITULOS[palavras.shift().toLowerCase()];
      deTitulo = true;
    }
    const curto = [];
    for (const p of palavras) {
      if (PEQUENAS.has(p.toLowerCase()) || curto.length === 2) break;
      curto.push(p);
    }
    const nome = curto.join(" ") || palavras.join(" ");
    return { chamado: deTitulo ? chamado : generoPeloNome(palavras[0] || ""), nome, deTitulo };
  }

  return { entender, generoPeloNome };
})();
