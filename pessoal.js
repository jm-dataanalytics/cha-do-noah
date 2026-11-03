// Página do jm: quem já preencheu (e a lista em Excel), a contagem das fraldas, o link do sorteio,
// as 100 mensagens e o botão de limpar.
(() => {
  const $ = (seletor) => document.querySelector(seletor);
  const url = CHA.planilha;
  const MEMORIA = "cha-do-noah-pin";
  const SORTEIO = "cha-do-noah-sorteio"; // o que o sorteio deste aparelho guardou (entra no Excel)
  const metas = Object.fromEntries(CHA.fraldas.map((f) => [f.tamanho, f.pacotes]));
  let pin = "";
  let ultima = null; // a última lista que veio da planilha (pro Excel)

  $("#rostinho").innerHTML = DESENHOS.iconeSvg(true);
  const [ano, mes, dia] = CHA.data.split("-").map(Number);
  const data = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(ano, mes - 1, dia));
  $("#data").textContent = data.charAt(0).toUpperCase() + data.slice(1);

  const criar = (tag, classe, texto) => {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto) el.textContent = texto;
    return el;
  };

  // as 100 mensagens (sempre aparecem; com a planilha, mostra quem ganhou cada uma)
  function mostrarMensagens(quemGanhou) {
    const lista = $("#mensagens");
    lista.replaceChildren();
    CHA.mensagens.forEach((m, i) => {
      const item = criar("li");
      item.append(criar("b", "", m.oi.split("{nome}").join("(nome)")), document.createTextNode(` ${m.recado.split("{nome}").join("(nome)")}`));
      const quem = quemGanhou[i + 1];
      if (quem) item.append(criar("span", "usada", `✓ ${quem.join(", ")}`));
      lista.append(item);
    });
  }
  mostrarMensagens({});

  if (!url) {
    $("#sem-planilha").hidden = false;
    $("#form-pin").hidden = true;
    return;
  }

  async function pedir(corpo) {
    try {
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(corpo), cache: "no-store" });
      return await r.json();
    } catch (e) {
      return null;
    }
  }

  function mostrar(r) {
    const s = r.situacao;
    const contagem = $("#contagem");
    contagem.replaceChildren();
    for (const f of CHA.fraldas) {
      const tem = s.fraldas[f.tamanho] || 0;
      const barra = criar("div", `barra${tem >= f.pacotes ? " completa" : ""}`);
      const fundo = criar("div", "barra-fundo");
      const cheia = criar("div", "barra-cheia");
      cheia.style.width = `${Math.min(100, (100 * tem) / f.pacotes)}%`;
      fundo.append(cheia);
      barra.append(criar("span", "", f.tamanho), fundo, criar("small", "", `${tem} de ${f.pacotes}`));
      contagem.append(barra);
    }
    const soma = CHA.fraldas.reduce((t, f) => t + f.pacotes, 0);
    const semFralda = r.pessoal.filter((p) => !p.fralda).length;
    $("#total").textContent = `${r.pessoal.length} ${r.pessoal.length === 1 ? "pessoa preencheu" : "pessoas preencheram"} (das ${soma} fraldas da lista)` +
      (semFralda ? `, ${semFralda} sem fralda.` : ".");
    $("#nota-completa").hidden = !s.cheia;

    const lista = $("#lista");
    lista.replaceChildren();
    if (!r.pessoal.length) lista.append(criar("li", "vazio", "Ninguém preencheu ainda."));
    const quemGanhou = {};
    // a mais nova primeiro; o Nº é a ordem em que preencheram (o mesmo do Excel e do sorteio)
    r.pessoal.forEach((p, i) => (p.numero = i + 1));
    for (const p of r.pessoal.slice().reverse()) {
      const item = criar("li", "pessoa");
      item.append(criar("span", "numero", `${p.numero}. `), criar("strong", "", `${p.nome}${p.chamado ? ` (${p.chamado})` : ""}`));
      const quando = new Date(p.quando);
      const detalhes = [
        p.fralda ? `Fralda ${p.fralda}${p.quemEscolheu === "a mamãe" ? " (a mamãe escolheu)" : ""}` : "Sem fralda (a lista já estava completa)",
        p.mimo ? "+ mimo 🎁" : "",
        `mensagem nº ${p.mensagem}`,
        p.whatsapp,
        isNaN(quando) ? "" : quando.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
      ].filter(Boolean);
      // cada pedaço inteiro numa linha (o telefone não quebra no meio)
      const linhaDetalhes = criar("span", "detalhes");
      detalhes.forEach((d, j) => linhaDetalhes.append(...(j ? [document.createTextNode(" · ")] : []), criar("span", "", d)));
      item.append(linhaDetalhes);
      lista.append(item);
      (quemGanhou[p.mensagem] = quemGanhou[p.mensagem] || []).push(p.nome);
    }
    mostrarMensagens(quemGanhou);
    ultima = r;
    $("#painel-pessoal").hidden = false;
    $("#entrar").hidden = true;
  }

  async function entrar(senha) {
    $("#aviso-pin").textContent = "";
    const r = await pedir({ acao: "lista", pin: senha, metas });
    if (!r) return ($("#aviso-pin").textContent = "Não consegui falar com a planilha. Confira a internet e tente de novo.");
    if (!r.ok) return ($("#aviso-pin").textContent = "Senha errada.");
    pin = senha;
    try {
      localStorage.setItem(MEMORIA, senha);
    } catch (e) {
      // sem memória: pede a senha da próxima vez
    }
    mostrar(r);
  }

  $("#form-pin").addEventListener("submit", (e) => {
    e.preventDefault();
    entrar($("#pin").value.trim());
  });

  $("#baixar-excel").addEventListener("click", async () => {
    const botao = $("#baixar-excel");
    const texto = botao.textContent;
    $("#aviso-excel").textContent = "";
    botao.disabled = true;
    botao.textContent = "Fazendo a lista...";
    try {
      // pega a lista de novo, pra sair com quem acabou de preencher
      const r = (await pedir({ acao: "lista", pin, metas })) || ultima;
      if (r && r.ok) mostrar(r);
      let sorteio = [];
      try {
        sorteio = (JSON.parse(localStorage.getItem(SORTEIO) || "null") || {}).premios || [];
      } catch (e) {
        // sem memória: o Excel sai sem a aba do sorteio
      }
      await LISTA_EXCEL.baixar({ pessoal: ultima.pessoal, sorteio });
    } catch (e) {
      console.error(e);
      $("#aviso-excel").textContent = "Não consegui fazer o Excel. Confira a internet e tente de novo.";
    } finally {
      botao.disabled = false;
      botao.textContent = texto;
    }
  });

  $("#limpar").addEventListener("click", async () => {
    if (!confirm("Limpar o pessoal? Quem preencheu vai pro Arquivo da planilha e a contagem começa do zero.")) return;
    const r = await pedir({ acao: "limpar", pin });
    $("#aviso-limpar").textContent = r && r.ok ? `Pronto! ${r.limpos} ${r.limpos === 1 ? "pessoa foi" : "pessoas foram"} pro Arquivo. Pode mandar o link 💙` : "Não consegui limpar. Tente de novo.";
    entrar(pin);
  });

  try {
    const salvo = localStorage.getItem(MEMORIA);
    if (salvo) entrar(salvo);
  } catch (e) {
    // sem memória: a senha é digitada
  }
})();
