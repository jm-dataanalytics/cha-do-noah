// Chá do Noah: a pessoa coloca o nome e o WhatsApp, escolhe a fralda (e, se quiser, o mimo), e o site
// faz 2 cartões em PNG: o recado do Noah e o lembrete. Tudo acontece no aparelho dela.

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

// "Tanto faz": cada pacote da lista vira uma "vaga" e o telefone escolhe uma, então o sorteio sai
// na mesma proporção da lista (e a mesma pessoa sempre tira o mesmo)
function fraldaPara(telefone) {
  const vagas = [];
  for (const f of CHA.fraldas) for (let i = 0; i < f.pacotes; i++) vagas.push(f);
  return vagas[numeroDoTexto(`fralda|${telefone}`) % vagas.length];
}

// "*" = tanto faz
function fraldaEscolhida(tamanho, telefone) {
  if (tamanho === "*") return fraldaPara(telefone);
  return CHA.fraldas.find((f) => f.tamanho === tamanho) || null;
}

// os tamanhos de que vocês mais precisam ganham o selinho "mais pedido"
function maisPedidos() {
  const maior = Math.max(...CHA.fraldas.map((f) => f.pacotes));
  return new Set(CHA.fraldas.filter((f) => f.pacotes === maior).map((f) => f.tamanho));
}

function recadoPara(telefone, nome) {
  const r = CHA.recado;
  let n = numeroDoTexto(`recado|${telefone}|${semAcento(nome).toLowerCase()}`);
  const escolher = (lista) => {
    const frase = lista[n % lista.length];
    n = Math.floor(n / lista.length);
    return frase.split("{nome}").join(nome);
  };
  const saudacao = escolher(r.saudacoes);
  const corpo = [escolher(r.comecos), escolher(r.meios), escolher(r.finais)].join(" ");
  return { saudacao, corpo };
}

function mimoPara(telefone, nome) {
  const lista = CHA.mimo.mensagens;
  return lista[numeroDoTexto(`mimo|${telefone}|${semAcento(nome).toLowerCase()}`) % lista.length].split("{nome}").join(nome);
}

function dataPorExtenso() {
  const [ano, mes, dia] = CHA.data.split("-").map(Number);
  const texto = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    .format(new Date(ano, mes - 1, dia));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function montarDados(nome, telefone, tamanho = "*", comMimo = false) {
  return {
    nome,
    telefone,
    fralda: fraldaEscolhida(tamanho, telefone),
    tantoFaz: tamanho === "*",
    mimo: comMimo ? mimoPara(telefone, nome) : "",
    ...recadoPara(telefone, nome),
    dataExtenso: dataPorExtenso(),
  };
}

function textoDoWhatsApp(d, link) {
  const linhas = [
    `*${CHA.titulo}* 💙`,
    "",
    `Oi, ${d.nome}! Não esquece: no dia do chá, você vai levar *${CHA.levar}*, tamanho *${d.fralda.tamanho}* (${d.fralda.nome}).`,
  ];
  if (d.mimo) linhas.push(`🎁 E um mimo pro ${CHA.bebe}: ${d.mimo}`);
  linhas.push("", `📅 ${d.dataExtenso}`);
  if (CHA.horario) linhas.push(`⏰ ${CHA.horario}`);
  if (CHA.local) linhas.push(`📍 ${CHA.local}`);
  if (CHA.observacao) linhas.push("", CHA.observacao);
  linhas.push("", `Seus cartões: ${link}`);
  return linhas.join("\n");
}

// ---------- tela ----------

(() => {
  const $ = (seletor) => document.querySelector(seletor);
  const form = $("#form");
  const campoNome = $("#nome");
  const campoTelefone = $("#telefone");
  const campoMimo = $("#mimo");
  const listaTamanhos = $("#tamanhos");
  const aviso = $("#aviso");
  const botaoGerar = $("#gerar");
  const resultado = $("#resultado");
  const avisoResultado = $("#aviso-resultado");
  const MEMORIA = "cha-do-noah";
  const TEXTO_BOTAO = botaoGerar.innerHTML;
  let arquivos = [];
  let enderecos = [];

  document.title = CHA.titulo;
  $("#titulo").textContent = CHA.titulo;
  $("#data").textContent = dataPorExtenso();
  $("#bebe").innerHTML = DESENHOS.paraSvg(DESENHOS.bebe, `Desenho do ${CHA.bebe}`);
  CARTOES.carregarFontes(); // as letras dos cartões já vão baixando

  // os bichinhos espiando por cima do formulário: a cabeça atrás do painel, as patinhas na frente
  // (o CSS sobe cada desenho até a linha da borda ficar no topo do painel)
  document.querySelectorAll("[data-bicho]").forEach((el) => {
    const bicho = DESENHOS[el.dataset.bicho];
    el.innerHTML = DESENHOS.paraSvg(DESENHOS.parte(bicho, el.dataset.parte));
    el.style.setProperty("--borda", (bicho.borda / bicho.largura).toFixed(4));
  });

  // os tamanhos de fralda viram botões (do config.js)
  const destaque = maisPedidos();
  const criar = (tag, classe, texto) => {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto) el.textContent = texto;
    return el;
  };
  for (const f of CHA.fraldas) {
    const opcao = criar("label", "tamanho");
    const radio = criar("input");
    radio.type = "radio";
    radio.name = "tamanho";
    radio.value = f.tamanho;
    const chip = criar("span", "chip");
    chip.append(criar("span", "tamanho-letra", f.tamanho), criar("span", "tamanho-nome", f.nome));
    if (destaque.has(f.tamanho)) chip.append(criar("span", "selo", "mais pedido"));
    opcao.append(radio, chip);
    listaTamanhos.append(opcao);
  }
  $("#tanto-faz-texto").textContent = CHA.tantoFaz;
  $("#mimo-convite").textContent = CHA.mimo.convite;
  $("#mimo-explicacao").textContent = CHA.mimo.explicacao;
  $("#mimo-presente").innerHTML = DESENHOS.paraSvg(DESENHOS.presente);

  const tamanhoMarcado = () => {
    const marcado = form.querySelector('input[name="tamanho"]:checked');
    return marcado ? marcado.value : "";
  };

  // quem já preencheu neste aparelho encontra tudo de volta
  try {
    const salvo = JSON.parse(localStorage.getItem(MEMORIA) || "null");
    if (salvo) {
      campoNome.value = salvo.nome || "";
      campoTelefone.value = salvo.telefone || "";
      campoMimo.checked = !!salvo.mimo;
      const radio = salvo.tamanho && form.querySelector(`input[name="tamanho"][value="${CSS.escape(salvo.tamanho)}"]`);
      if (radio) radio.checked = true;
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
    const nome = nomeArrumado(campoNome.value);
    if ((nome.match(/\p{L}/gu) || []).length < 2) return avisar("Escreva o seu nome.", campoNome);
    const telefone = telefoneValido(campoTelefone.value);
    if (!telefone) return avisar("Confira o WhatsApp: DDD + número, ex.: (21) 99999-9999.", campoTelefone);
    const tamanho = tamanhoMarcado();
    if (!tamanho) return avisar("Escolha o tamanho da fralda.", form.querySelector('input[name="tamanho"]'));

    botaoGerar.disabled = true;
    botaoGerar.textContent = "Fazendo seus cartões...";
    try {
      const dados = montarDados(nome, telefone, tamanho, campoMimo.checked);
      const telas = [await CARTOES.recado(dados), await CARTOES.lembrete(dados)];
      const pngs = await Promise.all(telas.map((t) => new Promise((ok) => t.toBlob(ok, "image/png"))));
      mostrarResultado(dados, pngs);
      campoNome.value = nome;
      campoTelefone.value = telefoneFormatado(telefone);
      try {
        localStorage.setItem(MEMORIA, JSON.stringify({ nome, telefone: telefoneFormatado(telefone), tamanho, mimo: campoMimo.checked }));
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

  function mostrarResultado(d, pngs) {
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
    const fralda = `fralda tamanho ${d.fralda.tamanho} (${d.fralda.nome})${d.mimo ? " + um mimo 🎁" : ""}`;
    $("#resultado-fralda").textContent = d.tantoFaz ? `O Noah escolheu pra você: ${fralda}.` : `Você vai levar: ${fralda}.`;
    $("#whatsapp").href = `https://wa.me/55${d.telefone}?text=${encodeURIComponent(textoDoWhatsApp(d, location.href.split(/[?#]/)[0]))}`;
    // celular: abre o "compartilhar" com as 2 imagens (WhatsApp, salvar na galeria...)
    $("#compartilhar").hidden = !(navigator.canShare && navigator.canShare({ files: arquivos }));
    avisoResultado.textContent = "";
    resultado.hidden = false;
    resultado.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  $("#compartilhar").addEventListener("click", async () => {
    avisoResultado.textContent = "";
    try {
      await navigator.share({ files: arquivos });
    } catch (erro) {
      if (erro && erro.name !== "AbortError") avisoResultado.textContent = "Não deu pra abrir o compartilhar. Use o Baixar embaixo de cada cartão.";
    }
  });

  $("#outra").addEventListener("click", () => {
    resultado.hidden = true;
    form.reset();
    avisar("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    campoNome.focus({ preventScroll: true });
  });
})();
