// O sorteio da festa (jm, 03/11): só pro dia do chá, não aparece no site nem nos cartões.
// Todo mundo começa com a mesma chance. Cada vez que alguém ganha, o "peso" dessa pessoa cai pela metade:
// quem ganhou 1 vez tem a metade da chance de quem ainda não ganhou, quem ganhou 2 vezes tem um quarto...
// O que sobra se divide entre todo mundo, e as chances sempre somam 100%. O número sorteado vem do gerador
// do navegador feito pra segurança (crypto), e o que acontece fica guardado neste aparelho.

// ---------- regras ----------

function pesoDe(vitorias) {
  return Math.pow(0.5, vitorias);
}

// pessoas: [{ id, peso }] → { id: chance de 0 a 1 }
function chancesDe(pessoas) {
  const total = pessoas.reduce((s, p) => s + p.peso, 0);
  return Object.fromEntries(pessoas.map((p) => [p.id, total ? p.peso / total : 0]));
}

// um número de 0 a 1 que ninguém consegue prever nem repetir
function aleatorio() {
  const u = new Uint32Array(1);
  crypto.getRandomValues(u);
  return u[0] / 4294967296;
}

// cada pessoa ocupa um pedaço da "roleta" do tamanho do peso dela
function sortearUm(pessoas, r = aleatorio()) {
  let resto = r * pessoas.reduce((s, p) => s + p.peso, 0);
  for (const p of pessoas) {
    resto -= p.peso;
    if (resto < 0) return p;
  }
  return pessoas[pessoas.length - 1];
}

// ---------- tela ----------

(() => {
  const $ = (seletor) => document.querySelector(seletor);
  const url = CHA.planilha;
  const PIN = "cha-do-noah-pin"; // a mesma senha da página do pessoal
  const GUARDADO = "cha-do-noah-sorteio"; // { extras, fora, premios }
  const LISTA_SALVA = "cha-do-noah-sorteio-lista"; // a última lista da planilha (se a festa ficar sem internet)
  const SOM = "cha-do-noah-sorteio-som";
  const metas = Object.fromEntries(CHA.fraldas.map((f) => [f.tamanho, f.pacotes]));
  const porcento = new Intl.NumberFormat("pt-BR", { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const semAnimacao = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const palco = $("#palco");
  let pin = "";
  let lista = []; // [{ id, nome, chamado, final }] na ordem em que preencheram o site
  let girando = false;
  let ultimo = null; // { id, premio } do último sorteado (pro "Não está aqui?")

  const criar = (tag, classe, texto) => {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto) el.textContent = texto;
    return el;
  };
  const soDigitos = (t) => String(t || "").replace(/\D/g, "");
  const normal = (t) => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
  const comMaiuscula = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : "");
  const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms));

  function ler(chave) {
    try {
      return JSON.parse(localStorage.getItem(chave) || "null");
    } catch (e) {
      return null;
    }
  }
  function gravar(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch (e) {
      // sem memória: o sorteio funciona, só não sobrevive a recarregar a página
    }
  }

  let estado = Object.assign({ extras: [], fora: [], premios: [] }, ler(GUARDADO) || {});
  const guardar = () => gravar(GUARDADO, estado);

  $("#rostinho").innerHTML = DESENHOS.iconeSvg(true);
  const [ano, mes, dia] = CHA.data.split("-").map(Number);
  $("#data").textContent = comMaiuscula(new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(ano, mes - 1, dia)));

  // ---------- quem está no sorteio ----------

  function pessoas() {
    return lista.concat(estado.extras).map((p, i) => {
      const vitorias = estado.premios.filter((g) => g.id === p.id).length;
      return { ...p, numero: i + 1, vitorias, peso: pesoDe(vitorias), fora: estado.fora.includes(p.id) };
    });
  }

  // os nomes ficam sempre nos mesmos quadradinhos: assim a barrinha de quem ganha encolhe devagar, na frente de todo mundo
  const itens = new Map();
  function itemDe(p) {
    let item = itens.get(p.id);
    if (!item) {
      item = { li: criar("li", "chance"), num: criar("span", "chance-num"), nome: criar("span", "chance-nome"), pct: criar("span", "chance-pct"), barra: criar("i") };
      const botao = criar("button");
      botao.type = "button";
      const barra = criar("span", "chance-barra");
      barra.append(item.barra);
      const rodape = criar("span", "chance-rodape");
      rodape.append(barra, item.pct);
      botao.append(item.num, item.nome, rodape);
      item.li.append(botao);
      item.li.dataset.id = p.id;
      item.botao = botao;
      itens.set(p.id, item);
    }
    return item;
  }

  function mostrarChances() {
    const todas = pessoas();
    const aqui = todas.filter((p) => !p.fora);
    const chance = chancesDe(aqui);
    const maior = Math.max(0, ...aqui.map((p) => p.peso));
    const ul = $("#chances");
    const ids = todas.map((p) => p.id);
    if (ids.join("\n") !== [...ul.children].map((li) => li.dataset.id).join("\n")) {
      ul.replaceChildren(...todas.map((p) => itemDe(p).li));
    }
    for (const p of todas) {
      const item = itemDe(p);
      item.li.classList.toggle("ganhou", p.vitorias > 0);
      item.li.classList.toggle("fora", p.fora);
      item.num.textContent = p.numero;
      item.nome.textContent = `${p.nome}${p.vitorias ? ` ${"🎁".repeat(Math.min(p.vitorias, 3))}` : ""}`;
      item.pct.textContent = p.fora ? "não veio" : porcento.format(chance[p.id]);
      item.barra.style.width = p.fora || !maior ? "0%" : `${(100 * p.peso) / maior}%`;
      item.botao.setAttribute("aria-label", `Nº ${p.numero}, ${p.nome}: ${p.fora ? "fora do sorteio (tocar pra pôr de volta)" : `${porcento.format(chance[p.id])} de chance (tocar pra tirar)`}`);
    }
    explicar(aqui, chance);
  }

  // o texto que o jm lê no microfone: quantas pessoas e quanto de chance cada uma tem agora
  function explicar(aqui, chance) {
    const p = $("#explicacao");
    p.replaceChildren();
    const texto = (t) => p.append(document.createTextNode(t));
    const forte = (t) => p.append(criar("b", "", t));
    if (!aqui.length) return texto("Ninguém no sorteio ainda. Os nomes aparecem aqui quando as pessoas preenchem o site (ou dá pra pôr à mão aqui embaixo).");
    const n = aqui.length;
    const porVitoria = {};
    for (const x of aqui) porVitoria[x.vitorias] = chance[x.id];
    const grupos = Object.keys(porVitoria).map(Number).sort((a, b) => a - b);
    if (grupos.length === 1 && grupos[0] === 0) {
      texto("Hoje temos ");
      forte(`${n} ${n === 1 ? "pessoa" : "pessoas"}`);
      texto(" no sorteio: cada uma tem ");
      forte(porcento.format(porVitoria[0]));
      texto(" de chance. Quem ganhar fica com a metade da chance de quem ainda não ganhou, e o resto se divide entre todo mundo.");
      return;
    }
    forte(`${n} ${n === 1 ? "pessoa" : "pessoas"}`);
    texto(" no sorteio.");
    for (const v of grupos) {
      texto(v === 0 ? " Quem ainda não ganhou: " : ` Quem já ganhou ${v} ${v === 1 ? "vez" : "vezes"}: `);
      forte(porcento.format(porVitoria[v]));
      texto(".");
    }
    texto(" Somando todo mundo, dá 100%.");
  }

  function mostrarGanhadores() {
    const ol = $("#ganhadores");
    ol.replaceChildren();
    if (!estado.premios.length) ol.append(criar("li", "vazio", "Ninguém ainda. O primeiro sorteio vem aí! 🎁"));
    for (const g of estado.premios) {
      const li = criar("li");
      li.append(criar("span", "premio", g.premio || "Prêmio"), document.createTextNode(" → "), criar("b", "", `Nº ${g.numero} · ${g.nome}`));
      ol.append(li);
    }
    $("#desfazer").disabled = !estado.premios.length;
  }

  function mostrarTudo() {
    mostrarChances();
    mostrarGanhadores();
  }

  function mostrarNoPalco(p, detalhe) {
    $("#sorteado-numero").textContent = p ? `Nº ${p.numero}` : "";
    $("#sorteado-nome").textContent = p ? p.nome : "Quem será? 🥁";
    $("#sorteado-detalhe").textContent = detalhe || "";
  }

  function acender(id, classe = "luz") {
    for (const [chave, item] of itens) item.li.classList.toggle(classe, chave === id);
  }

  function travar(sim) {
    girando = sim;
    for (const b of document.querySelectorAll("#sortear, #nao-esta, .ferramenta, #form-extra button")) b.disabled = sim;
    if (!sim) $("#desfazer").disabled = !estado.premios.length;
  }

  // ---------- o sorteio ----------

  async function sortear(premio) {
    const aqui = pessoas().filter((p) => !p.fora);
    if (!aqui.length) {
      $("#aviso-sorteio").textContent = "Ninguém no sorteio: ponha os nomes à mão ou toque em Atualizar a lista.";
      return;
    }
    $("#aviso-sorteio").textContent = "";
    travar(true);
    const chance = chancesDe(aqui);
    const ganhador = sortearUm(aqui); // já está decidido aqui; a roleta embaixo é só o suspense
    $("#premio-atual").textContent = `🎁 ${premio || "Sorteio"}`;
    $("#nao-esta").hidden = true;
    acender(null, "vencedor");
    palco.classList.remove("revelado");
    palco.classList.add("girando");
    if (!semAnimacao && aqui.length > 1) {
      let espera = 55;
      let anterior = null;
      while (espera < 420) {
        let p;
        do p = aqui[Math.floor(Math.random() * aqui.length)];
        while (p.id === anterior);
        anterior = p.id;
        acender(p.id);
        mostrarNoPalco(p, "");
        som("tique");
        await esperar(espera);
        espera *= 1.085;
      }
    }
    acender(null);
    estado.premios.push({ id: ganhador.id, numero: ganhador.numero, nome: ganhador.nome, premio, quando: new Date().toISOString() });
    guardar();
    ultimo = { id: ganhador.id, premio };
    palco.classList.remove("girando");
    palco.classList.add("revelado");
    const quem = [comMaiuscula(ganhador.chamado), ganhador.final ? `WhatsApp final ${ganhador.final}` : ""].filter(Boolean).join(" · ");
    mostrarNoPalco(ganhador, `${quem ? `${quem}\n` : ""}tinha ${porcento.format(chance[ganhador.id])} de chance`);
    acender(ganhador.id, "vencedor");
    som("tada");
    confete();
    $("#premio").value = "";
    travar(false);
    mostrarTudo();
    $("#nao-esta").hidden = false;
  }

  $("#form-sortear").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!girando) sortear($("#premio").value.replace(/\s+/g, " ").trim());
  });

  // a pessoa sorteada não está na festa: o prêmio não conta pra ela, ela sai do sorteio e roda de novo
  $("#nao-esta").addEventListener("click", () => {
    const g = estado.premios[estado.premios.length - 1];
    if (girando || !ultimo || !g || g.id !== ultimo.id) return;
    if (!confirm(`Tirar ${g.nome} do sorteio e sortear de novo?`)) return;
    estado.premios.pop();
    if (!estado.fora.includes(g.id)) estado.fora.push(g.id);
    guardar();
    mostrarTudo();
    sortear(ultimo.premio);
  });

  $("#desfazer").addEventListener("click", () => {
    const g = estado.premios[estado.premios.length - 1];
    if (girando || !g) return;
    if (!confirm(`Desfazer o último sorteio (${g.premio || "Prêmio"} → ${g.nome})?`)) return;
    estado.premios.pop();
    guardar();
    ultimo = null;
    $("#premio").value = g.premio || "";
    $("#premio-atual").textContent = "";
    palco.classList.remove("revelado");
    mostrarNoPalco(null);
    acender(null, "vencedor");
    $("#nao-esta").hidden = true;
    $("#aviso-sorteio").textContent = "Desfeito: a chance de quem tinha ganhado voltou.";
    mostrarTudo();
  });

  $("#recomecar").addEventListener("click", () => {
    if (girando) return;
    if (!confirm("Recomeçar o sorteio? Quem ganhou, quem saiu e os nomes postos à mão são apagados deste aparelho. A lista do site continua igual.")) return;
    estado = { extras: [], fora: [], premios: [] };
    guardar();
    ultimo = null;
    $("#premio-atual").textContent = "";
    palco.classList.remove("revelado");
    mostrarNoPalco(null);
    acender(null, "vencedor");
    $("#nao-esta").hidden = true;
    $("#aviso-sorteio").textContent = "Pronto: todo mundo com a mesma chance de novo.";
    mostrarTudo();
  });

  // tocar num nome: tira quem não veio (ou põe de volta)
  $("#chances").addEventListener("click", (e) => {
    const li = e.target.closest(".chance");
    if (!li || girando) return;
    const i = estado.fora.indexOf(li.dataset.id);
    if (i >= 0) estado.fora.splice(i, 1);
    else estado.fora.push(li.dataset.id);
    guardar();
    mostrarChances();
  });

  $("#form-extra").addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = $("#extra").value.replace(/\s+/g, " ").trim();
    if ((nome.match(/\p{L}/gu) || []).length < 2 || girando) return;
    estado.extras.push({ id: `extra-${Date.now()}`, nome: comMaiuscula(nome), chamado: "", final: "" });
    guardar();
    $("#extra").value = "";
    mostrarTudo();
  });

  // ---------- a lista (da planilha, com a senha do pessoal) ----------

  async function pedir(corpo) {
    try {
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(corpo), cache: "no-store" });
      return await r.json();
    } catch (e) {
      return null;
    }
  }

  // devolve false só quando a senha está errada
  async function carregarLista() {
    const aviso = $("#aviso-lista");
    if (!url) {
      aviso.textContent = "A planilha não está ligada: ponha os nomes à mão aqui embaixo.";
      return true;
    }
    const r = await pedir({ acao: "lista", pin, metas });
    if (r && r.ok) {
      lista = r.pessoal.map((p) => ({ id: `${soDigitos(p.whatsapp)}|${normal(p.nome)}`, nome: p.nome, chamado: p.chamado || "", final: soDigitos(p.whatsapp).slice(-4) }));
      gravar(LISTA_SALVA, { lista, quando: new Date().toISOString() });
      aviso.textContent = "";
      return true;
    }
    if (r && r.erro === "pin") return false;
    // sem internet na festa: usa a última lista que veio neste aparelho
    const salva = ler(LISTA_SALVA);
    if (salva && salva.lista) {
      lista = salva.lista;
      const quando = new Date(salva.quando);
      aviso.textContent = `Sem internet agora: usando a lista guardada neste aparelho${isNaN(quando) ? "" : ` (de ${quando.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })})`}.`;
    } else {
      aviso.textContent = "Não consegui falar com a planilha. Confira a internet e toque em Atualizar a lista.";
    }
    return true;
  }

  async function entrar(senha) {
    pin = senha;
    $("#aviso-pin").textContent = "";
    if (!(await carregarLista())) {
      $("#entrar").hidden = false;
      $("#mesa").hidden = true;
      $("#aviso-pin").textContent = "Senha errada.";
      return;
    }
    try {
      if (senha) localStorage.setItem(PIN, senha);
    } catch (e) {
      // sem memória: pede a senha da próxima vez
    }
    $("#entrar").hidden = true;
    $("#mesa").hidden = false;
    mostrarTudo();
  }

  $("#form-pin").addEventListener("submit", (e) => {
    e.preventDefault();
    entrar($("#pin").value.trim());
  });

  $("#atualizar").addEventListener("click", async () => {
    if (girando) return;
    const b = $("#atualizar");
    b.disabled = true;
    await carregarLista();
    b.disabled = false;
    mostrarTudo();
    if (!$("#aviso-lista").textContent) $("#aviso-sorteio").textContent = `Lista atualizada: ${lista.length} ${lista.length === 1 ? "pessoa" : "pessoas"} do site.`;
  });

  // ---------- som, confete e tela cheia ----------

  let somLigado = ler(SOM) !== false;
  let audio = null;
  const botaoSom = $("#som");
  function pintarSom() {
    botaoSom.textContent = somLigado ? "🔊" : "🔇";
    botaoSom.setAttribute("aria-pressed", String(somLigado));
    botaoSom.setAttribute("aria-label", somLigado ? "Som ligado (tocar pra desligar)" : "Som desligado (tocar pra ligar)");
  }
  pintarSom();
  botaoSom.addEventListener("click", () => {
    somLigado = !somLigado;
    gravar(SOM, somLigado);
    pintarSom();
  });

  function som(tipo) {
    if (!somLigado) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      const agora = audio.currentTime;
      const notas = tipo === "tique" ? [[1320, 0, 0.045, 0.05]] : [[523.25, 0, 0.16, 0.16], [659.25, 0.12, 0.16, 0.16], [783.99, 0.24, 0.16, 0.16], [1046.5, 0.38, 0.6, 0.2]];
      for (const [freq, inicio, duracao, volume] of notas) {
        const osc = audio.createOscillator();
        const ganho = audio.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        ganho.gain.setValueAtTime(0.0001, agora + inicio);
        ganho.gain.exponentialRampToValueAtTime(volume, agora + inicio + 0.01);
        ganho.gain.exponentialRampToValueAtTime(0.0001, agora + inicio + duracao);
        osc.connect(ganho).connect(audio.destination);
        osc.start(agora + inicio);
        osc.stop(agora + inicio + duracao + 0.02);
      }
    } catch (e) {
      // sem som neste aparelho: o sorteio segue
    }
  }

  function confete() {
    if (semAnimacao) return;
    const tela = $("#confete");
    const ctx = tela.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    tela.width = innerWidth * dpr;
    tela.height = innerHeight * dpr;
    const cores = ["#4F86C6", "#F29AAE", "#F5C451", "#9CC8F0", "#C2577A", "#FFFFFF"];
    const pecas = Array.from({ length: 170 }, () => ({
      x: Math.random() * tela.width,
      y: -Math.random() * tela.height * 0.6,
      vx: (Math.random() - 0.5) * 3 * dpr,
      vy: (2 + Math.random() * 3) * dpr,
      giro: Math.random() * Math.PI,
      vg: (Math.random() - 0.5) * 0.25,
      w: (7 + Math.random() * 6) * dpr,
      h: (9 + Math.random() * 8) * dpr,
      cor: cores[Math.floor(Math.random() * cores.length)],
      coracao: Math.random() < 0.3,
    }));
    const coracao = new Path2D(DESENHOS.coracao(0, 0, 14));
    const inicio = performance.now();
    function quadro(t) {
      const passou = t - inicio;
      ctx.clearRect(0, 0, tela.width, tela.height);
      ctx.globalAlpha = passou > 3400 ? Math.max(0, 1 - (passou - 3400) / 900) : 1;
      for (const p of pecas) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.035 * dpr;
        p.giro += p.vg;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.giro);
        ctx.fillStyle = p.cor;
        if (p.coracao) {
          ctx.scale(dpr * 1.3, dpr * 1.3);
          ctx.fill(coracao);
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * 0.6);
        }
        ctx.restore();
      }
      if (passou < 4300) requestAnimationFrame(quadro);
      else ctx.clearRect(0, 0, tela.width, tela.height);
    }
    requestAnimationFrame(quadro);
  }

  const botaoTela = $("#tela-cheia");
  if (!document.documentElement.requestFullscreen) botaoTela.remove();
  else {
    botaoTela.addEventListener("click", () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen().catch(() => {});
    });
    document.addEventListener("fullscreenchange", () => {
      botaoTela.textContent = document.fullscreenElement ? "Sair da tela cheia" : "⛶ Tela cheia";
    });
  }

  // ---------- começo ----------

  const salvo = (() => {
    try {
      return localStorage.getItem(PIN) || "";
    } catch (e) {
      return "";
    }
  })();
  if (!url || salvo) entrar(salvo);
  else $("#entrar").hidden = false;
})();
