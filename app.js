// Chá do Noah: a pessoa coloca o nome e o WhatsApp, diz como o Noah vai chamar ela (titia, titio...),
// escolhe a fraldinha (ou deixa a mamãe escolher) e, se quiser, o mimo. O site faz 2 cartões em PNG:
// o recado do Noah e o lembrete. Com a planilha ligada (CHA.planilha), o site conta as fraldas na
// proporção, não deixa a mensagem repetir e, quando a lista inteira completa, para de pedir fralda.

// ---------- regras ----------

function soDigitos(texto) {
  return String(texto || "").replace(/\D/g, "");
}

// aceita (21) 99999-9999, 21999999999, +55 21 99999-9999...; devolve DDD + número, ou null
function telefoneValido(texto) {
  let d = soDigitos(texto).replace(/^0+/, "");
  if ((d.length === 12 || d.length === 13) && d.startsWith("55")) d = d.slice(2);
  return d.length === 10 || d.length === 11 ? d : null;
}

function telefoneFormatado(d) {
  return d.length === 11
    ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
    : `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
}

const PALAVRAS_PEQUENAS = new Set(["da", "de", "do", "das", "dos", "e"]);
// "ana paula" e "ANA PAULA" viram "Ana Paula"; quem já escreveu com maiúsculas do seu jeito fica como escreveu
function nomeArrumado(texto) {
  const limpo = String(texto || "").replace(/\s+/g, " ").trim();
  if (limpo !== limpo.toLowerCase() && limpo !== limpo.toUpperCase()) return limpo;
  return limpo
    .toLowerCase()
    .split(" ")
    .map((p, i) => (i > 0 && PALAVRAS_PEQUENAS.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(" ");
}

function semAcento(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// um número fixo pra cada texto (cyrb53): a mesma pessoa sempre cai no mesmo resultado
function numeroDoTexto(texto) {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < texto.length; i++) {
    const c = texto.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function fraldaDoTamanho(tamanho) {
  return CHA.fraldas.find((f) => f.tamanho === tamanho) || null;
}

// sem a planilha, "a mamãe escolhe" pelo telefone, na proporção da lista (a mesma pessoa sempre tira o mesmo)
function fraldaPara(telefone) {
  const vagas = [];
  for (const f of CHA.fraldas) for (let i = 0; i < f.pacotes; i++) vagas.push(f);
  return vagas[numeroDoTexto(`fralda|${telefone}`) % vagas.length];
}

// sem a planilha: os tamanhos de que vocês mais precisam ganham o selinho
function maisPedidos() {
  const maior = Math.max(...CHA.fraldas.map((f) => f.pacotes));
  return new Set(CHA.fraldas.filter((f) => f.pacotes === maior).map((f) => f.tamanho));
}

// com a planilha: os que mais estão faltando, na proporção
function maisPrecisam(s) {
  const metas = Object.fromEntries(CHA.fraldas.map((f) => [f.tamanho, f.pacotes]));
  const parte = (t) => (s.faltam[t] || 0) / metas[t];
  const maior = Math.max(0, ...s.livres.map(parte));
  return new Set(maior > 0 ? s.livres.filter((t) => parte(t) === maior) : []);
}

// como o Noah chama a pessoa: "titia Ana", "titio Carlos"
function comoONoahChama(chamado, nome) {
  return chamado ? `${chamado} ${nome}` : nome;
}

// a mensagem nº n (de 1 a 100), já com o nome
function mensagem(n, chamadoENome) {
  const m = CHA.mensagens[(n - 1) % CHA.mensagens.length];
  const troca = (t) => t.split("{nome}").join(chamadoENome);
  return { saudacao: troca(m.oi), corpo: troca(m.recado) };
}

// sem a planilha, o número vem do telefone e do nome (aí pode repetir entre pessoas diferentes)
function mensagemLocal(telefone, nome) {
  return 1 + (numeroDoTexto(`recado|${telefone}|${semAcento(nome).toLowerCase()}`) % CHA.mensagens.length);
}

function mimoPara(telefone, nome) {
  const lista = CHA.mimo.mensagens;
  return lista[numeroDoTexto(`mimo|${telefone}|${semAcento(nome).toLowerCase()}`) % lista.length];
}

function dataPorExtenso() {
  const [ano, mes, dia] = CHA.data.split("-").map(Number);
  const texto = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    .format(new Date(ano, mes - 1, dia));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// tudo o que os cartões precisam
// semFralda: a pessoa preencheu depois que a lista completou (fralda = null: leva só o abraço)
function montarDados({ nome, chamado = "", telefone, tamanho = "*", mimo = false, numero = 0, mamaeEscolheu = false, semFralda = false }) {
  const chamadoENome = comoONoahChama(chamado, nome);
  const n = numero || mensagemLocal(telefone, nome);
  return {
    nome: chamadoENome,
    telefone,
    fralda: semFralda ? null : fraldaDoTamanho(tamanho) || fraldaPara(telefone),
    mamaeEscolheu: !semFralda && (mamaeEscolheu || tamanho === "*"),
    numero: n,
    mimo: mimo ? mimoPara(telefone, nome) : "",
    ...mensagem(n, chamadoENome),
    dataExtenso: dataPorExtenso(),
  };
}

function textoDoWhatsApp(d, link) {
  const linhas = [
    `*${CHA.titulo}* 💙`,
    "",
    `${d.saudacao} ${d.corpo}`,
    "",
    d.fralda
      ? `Lembrete: no dia do chá, levar *${CHA.levar}*, tamanho *${d.fralda.tamanho}* (${d.fralda.nome}).`
      : "Lembrete: as fraldas da lista já estão garantidas, então é só levar você! 💙",
  ];
  if (d.mimo) linhas.push(`🎁 E um mimo pro ${CHA.bebe}: ${d.mimo}`);
  linhas.push("", `📅 ${d.dataExtenso}`);
  if (CHA.horario) linhas.push(`⏰ ${CHA.horario}`);
  if (CHA.local) linhas.push(`📍 ${CHA.local}`);
  if (CHA.observacao) linhas.push("", CHA.observacao);
  linhas.push("", `Seus cartões: ${link}`);
  return linhas.join("\n");
}

// ---------- a planilha (a "memória" do site; opcional) ----------

const PLANILHA = (() => {
  const url = CHA.planilha;
  const metas = () => Object.fromEntries(CHA.fraldas.map((f) => [f.tamanho, f.pacotes]));
  const metasTexto = () => CHA.fraldas.map((f) => `${f.tamanho}:${f.pacotes}`).join(",");

  async function pedir(opcoes, ms) {
    const ctrl = new AbortController();
    const prazo = setTimeout(() => ctrl.abort(), ms);
    try {
      const r = await fetch(opcoes.url, { ...opcoes, signal: ctrl.signal, cache: "no-store" });
      return await r.json();
    } catch (e) {
      return null; // sem internet ou a planilha demorou: o site segue sozinho
    } finally {
      clearTimeout(prazo);
    }
  }

  return {
    ligada: !!url,
    metas,
    async situacao() {
      if (!url) return null;
      const r = await pedir({ url: `${url}?acao=situacao&metas=${encodeURIComponent(metasTexto())}` }, 10000);
      return r && r.ok ? r.situacao : null;
    },
    // texto puro (sem "application/json") pra o Google aceitar o pedido vindo de outro site
    enviar(corpo, ms = 25000) {
      if (!url) return Promise.resolve(null);
      return pedir({ url, method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(corpo) }, ms);
    },
  };
})();

// ---------- tela ----------

(() => {
  const $ = (seletor) => document.querySelector(seletor);
  const form = $("#form");
  const campoNome = $("#nome");
  const campoTelefone = $("#telefone");
  const campoMimo = $("#mimo");
  const aviso = $("#aviso");
  const botaoGerar = $("#gerar");
  const resultado = $("#resultado");
  const avisoResultado = $("#aviso-resultado");
  const MEMORIA = "cha-do-noah";
  const CHAMADOS = ["titia", "titio", "vovó", "vovô"];
  const TEXTO_BOTAO = botaoGerar.innerHTML;
  let arquivos = [];
  let enderecos = [];
  let dadosAtuais = null;
  // quando a pessoa escolhe titia/titio na mão, vale pra aquele primeiro nome; outro nome (outra pessoa no
  // mesmo celular) volta a adivinhar
  let chamadoManualPara = "";
  const primeiroNome = (texto) => semAcento((String(texto || "").trim().split(/\s+/)[0] || "").toLowerCase());

  const criar = (tag, classe, texto) => {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto) el.textContent = texto;
    return el;
  };

  document.title = CHA.titulo;
  $("#titulo").textContent = CHA.titulo;
  $("#data").textContent = dataPorExtenso();
  $("#bebe").innerHTML = DESENHOS.paraSvg(DESENHOS.bebe, `Desenho do ${CHA.bebe}`);
  $("#convite-oi").textContent = CHA.convite.oi;
  $("#convite-barriguinha").textContent = CHA.convite.barriguinha;
  $("#titulo-ajudinha").textContent = CHA.convite.tituloAjudinha;
  $("#convite-ajudinha").textContent = CHA.convite.ajudinha;
  $("#convite-mamae").textContent = CHA.convite.mamaeEscolhe;
  $("#pedido-mamae").textContent = CHA.convite.pedidoMamae;
  $("#botao-mamae").textContent = CHA.convite.botaoMamae;
  $("#mimo-convite").textContent = CHA.mimo.convite;
  $("#mimo-explicacao").textContent = CHA.mimo.explicacao;
  $("#mimo-presente").innerHTML = DESENHOS.paraSvg(DESENHOS.presente);
  $("#privacidade").textContent = PLANILHA.ligada
    ? `🔒 Seu nome e seu WhatsApp vão só pros pais do ${CHA.bebe}.`
    : "🔒 Seu nome e seu telefone não saem do seu aparelho.";
  CARTOES.carregarFontes(); // as letras dos cartões já vão baixando

  // os bichinhos espiando por cima do formulário (o CSS sobe cada desenho até a borda ficar no topo do painel)
  document.querySelectorAll("[data-bicho]").forEach((el) => {
    const bicho = DESENHOS[el.dataset.bicho];
    el.innerHTML = DESENHOS.paraSvg(DESENHOS.parte(bicho, el.dataset.parte));
    el.style.setProperty("--borda", (bicho.borda / bicho.largura).toFixed(4));
  });

  // como o Noah vai chamar a pessoa
  for (const c of CHAMADOS) {
    const opcao = criar("label", "chamado");
    const radio = criar("input");
    radio.type = "radio";
    radio.name = "chamado";
    radio.value = c;
    opcao.append(radio, criar("span", "chip", c.charAt(0).toUpperCase() + c.slice(1)));
    $("#chamados").append(opcao);
  }
  const chamadoMarcado = () => (form.querySelector('input[name="chamado"]:checked') || {}).value || "";
  function marcarChamado(c) {
    form.querySelectorAll('input[name="chamado"]').forEach((r) => (r.checked = r.value === c));
  }
  function atualizarPreviaOi() {
    const nome = NOMES.entender(nomeArrumado(campoNome.value)).nome;
    const c = chamadoMarcado();
    $("#previa-oi").textContent = nome && c ? `O ${CHA.bebe} vai dizer: “Oi, ${comoONoahChama(c, nome)}!” 🥹` : "";
  }
  campoNome.addEventListener("input", () => {
    if (primeiroNome(campoNome.value) !== chamadoManualPara) {
      chamadoManualPara = "";
      marcarChamado(NOMES.entender(nomeArrumado(campoNome.value)).chamado);
    }
    atualizarPreviaOi();
  });
  $("#chamados").addEventListener("change", () => {
    chamadoManualPara = primeiroNome(campoNome.value);
    atualizarPreviaOi();
  });

  // as fraldinhas (do config.js); com a planilha, o que já completou fica apagado
  const tamanhos = [];
  for (const f of CHA.fraldas) {
    const opcao = criar("label", "tamanho");
    const radio = criar("input");
    radio.type = "radio";
    radio.name = "tamanho";
    radio.value = f.tamanho;
    const chip = criar("span", "chip");
    const selo = criar("span", "selo");
    const faltam = criar("span", "faltam");
    chip.append(criar("span", "tamanho-letra", f.tamanho), criar("span", "tamanho-nome", f.nome), faltam, selo);
    opcao.append(radio, chip);
    $("#tamanhos").append(opcao);
    tamanhos.push({ tamanho: f.tamanho, opcao, radio, selo, faltam });
  }
  // a lista inteira completou: no lugar dos tamanhos, o Noah agradece e diz que não precisa trazer nada
  let listaCompleta = false;
  function mostrarListaCompleta(sim) {
    listaCompleta = sim;
    $("#escolha-fralda").classList.toggle("lista-completa", sim);
    $("#titulo-ajudinha").textContent = sim ? CHA.convite.tituloCompleta : CHA.convite.tituloAjudinha;
    $("#convite-ajudinha").textContent = sim ? CHA.convite.completa : CHA.convite.ajudinha;
    $("#tamanhos").hidden = sim;
    $("#convite-mamae").hidden = sim;
    $(".mamae-escolhe").hidden = sim;
  }

  function pintarTamanhos(s) {
    mostrarListaCompleta(!!(s && s.cheia));
    const destaque = s ? maisPrecisam(s) : maisPedidos();
    for (const t of tamanhos) {
      const completo = !!s && s.livres.indexOf(t.tamanho) < 0;
      t.radio.disabled = completo;
      if (completo && t.radio.checked) t.radio.checked = false;
      t.opcao.classList.toggle("completo", completo);
      t.selo.textContent = completo ? "completo 💙" : destaque.has(t.tamanho) ? (s ? "precisa mais" : "mais pedido") : "";
      t.selo.hidden = !t.selo.textContent;
      t.faltam.textContent = s && !completo ? `faltam ${s.faltam[t.tamanho]}` : "";
      t.faltam.hidden = !t.faltam.textContent;
    }
  }
  pintarTamanhos(null);
  if (PLANILHA.ligada) PLANILHA.situacao().then((s) => s && pintarTamanhos(s));

  const tamanhoMarcado = () => (form.querySelector('input[name="tamanho"]:checked') || {}).value || "";

  // quem já preencheu neste aparelho encontra tudo de volta
  try {
    const salvo = JSON.parse(localStorage.getItem(MEMORIA) || "null");
    if (salvo) {
      campoNome.value = salvo.nome || "";
      campoTelefone.value = salvo.telefone || "";
      campoMimo.checked = !!salvo.mimo;
      if (salvo.chamado) {
        marcarChamado(salvo.chamado);
        chamadoManualPara = primeiroNome(salvo.nome);
      }
      const radio = salvo.tamanho && form.querySelector(`input[name="tamanho"][value="${CSS.escape(salvo.tamanho)}"]`);
      if (radio && !radio.disabled) radio.checked = true;
      atualizarPreviaOi();
    }
  } catch (e) {
    // navegador sem memória (aba anônima): tudo bem
  }

  campoTelefone.addEventListener("blur", () => {
    const d = telefoneValido(campoTelefone.value);
    if (d) campoTelefone.value = telefoneFormatado(d);
  });

  function avisar(texto, campo) {
    aviso.textContent = texto;
    if (campo) {
      campo.focus({ preventScroll: true });
      campo.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    avisar("");
    const nomeCompleto = nomeArrumado(campoNome.value);
    if ((nomeCompleto.match(/\p{L}/gu) || []).length < 2) return avisar("Escreva o seu nome.", campoNome);
    const telefone = telefoneValido(campoTelefone.value);
    const chamado = chamadoMarcado();
    if (!chamado) return avisar(`Escolha como o ${CHA.bebe} vai te chamar.`, form.querySelector('input[name="chamado"]'));
    if (!telefone) return avisar("Confira o WhatsApp: DDD + número, ex.: (21) 99999-9999.", campoTelefone);
    const tamanho = listaCompleta ? "-" : tamanhoMarcado();
    if (!tamanho) return avisar("Escolha uma fraldinha pra mim (ou deixe a mamãe escolher!).", $("#escolha-fralda"));

    botaoGerar.disabled = true;
    botaoGerar.textContent = "Fazendo seus cartões...";
    try {
      const nome = NOMES.entender(nomeCompleto).nome;
      let pedido = { nome, chamado, telefone, tamanho, mimo: campoMimo.checked };
      let repetido = false;
      if (PLANILHA.ligada) {
        const r = await PLANILHA.enviar({
          acao: "registrar", nome: nomeCompleto, chamado, telefone, tamanho, mimo: campoMimo.checked,
          metas: PLANILHA.metas(), mensagens: CHA.mensagens.length,
        });
        if (r && r.erro === "completo") {
          pintarTamanhos(r.situacao);
          return avisar(`Ops! A fralda ${r.tamanho} acabou de completar 💙 Escolhe outra pra mim?`, $("#escolha-fralda"));
        }
        if (r && r.erro === "mudou") {
          pintarTamanhos(r.situacao);
          return avisar("A lista das fraldinhas mudou 💙 Escolhe uma pra mim?", $("#escolha-fralda"));
        }
        if (r && r.ok) {
          pedido = { ...pedido, tamanho: r.tamanho, semFralda: !!r.semFralda, numero: r.mensagem, mamaeEscolheu: r.mamaeEscolheu, mimo: r.mimo };
          repetido = !!r.repetido;
          if (r.situacao) pintarTamanhos(r.situacao);
        }
      }
      if (pedido.tamanho === "-") pedido = { ...pedido, semFralda: true };
      if (pedido.tamanho === "*") pedido = { ...pedido, tamanho: fraldaPara(telefone).tamanho, mamaeEscolheu: true };
      const dados = montarDados(pedido);
      const telas = [await CARTOES.recado(dados), await CARTOES.lembrete(dados)];
      const pngs = await Promise.all(telas.map((t) => new Promise((ok) => t.toBlob(ok, "image/png"))));
      mostrarResultado(dados, pngs, repetido);
      campoNome.value = nomeCompleto;
      campoTelefone.value = telefoneFormatado(telefone);
      try {
        localStorage.setItem(MEMORIA, JSON.stringify({ nome: nomeCompleto, telefone: telefoneFormatado(telefone), chamado, tamanho, mimo: campoMimo.checked }));
      } catch (e2) {
        // sem memória: só não lembra na próxima vez
      }
    } catch (erro) {
      console.error(erro);
      avisar("Não consegui fazer os cartões. Tente de novo.");
    } finally {
      botaoGerar.disabled = false;
      botaoGerar.innerHTML = TEXTO_BOTAO;
    }
  });

  function mostrarResultado(d, pngs, repetido) {
    dadosAtuais = d;
    enderecos.forEach((u) => URL.revokeObjectURL(u));
    const base = `cha-do-noah-${semAcento(d.nome).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "cartao"}`;
    arquivos = [
      new File([pngs[0]], `${base}-recado.png`, { type: "image/png" }),
      new File([pngs[1]], `${base}-lembrete.png`, { type: "image/png" }),
    ];
    enderecos = arquivos.map((a) => URL.createObjectURL(a));
    $("#img-recado").src = enderecos[0];
    $("#img-lembrete").src = enderecos[1];
    $("#baixar-recado").href = enderecos[0];
    $("#baixar-recado").download = arquivos[0].name;
    $("#baixar-lembrete").href = enderecos[1];
    $("#baixar-lembrete").download = arquivos[1].name;
    $("#resultado-titulo").textContent = `Prontinho, ${d.nome}!`;
    let leva;
    if (!d.fralda) leva = `As fraldas da lista já estão garantidas: você vai levar ${d.mimo ? "o seu abraço e um mimo 🎁" : "só o seu abraço 💙"}`;
    else {
      const fralda = `fralda ${d.fralda.tamanho} (${d.fralda.nome})${d.mimo ? " + um mimo 🎁" : ""}`;
      leva = d.mamaeEscolheu ? `A mamãe escolheu pra você: ${fralda}.` : `Você vai levar: ${fralda}.`;
    }
    $("#resultado-fralda").textContent = (repetido ? "Você já tinha feito seus cartões 💙 " : "") + leva;
    $("#lembrete-resumo").textContent = `${d.fralda ? `Fralda ${d.fralda.tamanho}` : "Seu abraço"}${d.mimo ? " + mimo" : ""} · ${d.dataExtenso.split(",")[0]}, ${CHA.data.split("-").reverse().slice(0, 2).join("/")}`;
    avisoResultado.textContent = "";
    resultado.hidden = false;
    resultado.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // as 2 fotos (o cartão e o lembrete) vão pro WhatsApp pelo "compartilhar" do celular;
  // onde não dá (alguns computadores), abre o WhatsApp com o recado em texto
  $("#compartilhar").addEventListener("click", async () => {
    avisoResultado.textContent = "";
    if (navigator.canShare && navigator.canShare({ files: arquivos })) {
      try {
        await navigator.share({ files: arquivos });
      } catch (erro) {
        if (erro && erro.name !== "AbortError") avisoResultado.textContent = "Não deu pra abrir o compartilhar. Use o Baixar e mande as fotos pelo WhatsApp.";
      }
      return;
    }
    window.open(`https://wa.me/55${dadosAtuais.telefone}?text=${encodeURIComponent(textoDoWhatsApp(dadosAtuais, location.href.split(/[?#]/)[0]))}`, "_blank", "noopener");
    avisoResultado.textContent = "Neste aparelho o WhatsApp só recebe o texto. Pra mandar as fotos, toque em Baixar e anexe na conversa.";
  });

  $("#outra").addEventListener("click", () => {
    resultado.hidden = true;
    form.reset();
    chamadoManualPara = "";
    atualizarPreviaOi();
    avisar("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    campoNome.focus({ preventScroll: true });
  });
})();
