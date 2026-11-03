// Os 2 cartões em PNG (1080 x 1350, o formato que o WhatsApp mostra inteiro), desenhados no próprio
// aparelho de quem preenche: o nome e o telefone não saem do celular da pessoa.
const CARTOES = (() => {
  const LARGURA = 1080;
  const ALTURA = 1350;
  const COR = {
    azul: "#4F86C6",
    azulEscuro: "#24395C",
    texto: "#3A4F72",
    suave: "#5B6F8F",
    amarelo: "#F5C451",
    azulClaro: "#C9DFF4",
    rosa: "#F29AAE",
    rosaForte: "#C2577A",
  };
  const fredoka = (peso, t) => `${peso} ${t}px Fredoka, Nunito, sans-serif`;
  const nunito = (peso, t) => `${peso} ${t}px Nunito, sans-serif`;
  const BRANCO_NUVEM = "rgba(255,255,255,0.95)";

  let fontesProntas = null;
  function carregarFontes() {
    if (!fontesProntas) {
      const pedidos = ["700 60px Fredoka", "600 60px Fredoka", "600 40px Nunito", "700 40px Nunito", "800 40px Nunito"];
      const carregar = document.fonts
        ? Promise.all(pedidos.map((f) => document.fonts.load(f, "Chá do Noah ãéíóúç"))).catch(() => {})
        : Promise.resolve();
      // sem internet a letra não chega: depois de 5 s desenha com a letra do aparelho mesmo
      fontesProntas = Promise.race([carregar, new Promise((ok) => setTimeout(ok, 5000))]);
    }
    return fontesProntas;
  }

  function novaTela(largura, altura) {
    const tela = document.createElement("canvas");
    tela.width = largura;
    tela.height = altura;
    return tela;
  }

  function retangulo(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function painel(ctx, x, y, w, h, r, cor = "#FFFFFF") {
    ctx.save();
    ctx.shadowColor = "rgba(36, 57, 92, 0.13)";
    ctx.shadowBlur = 44;
    ctx.shadowOffsetY = 14;
    ctx.fillStyle = cor;
    retangulo(ctx, x, y, w, h, r);
    ctx.fill();
    ctx.restore();
  }

  function fundo(ctx, largura, altura, cores) {
    const g = ctx.createLinearGradient(0, 0, 0, altura);
    cores.forEach((c, i) => g.addColorStop(i / (cores.length - 1), c));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, largura, altura);
  }

  function nuvem(ctx, x, y, s, cor = BRANCO_NUVEM) {
    ctx.save();
    ctx.fillStyle = cor;
    ctx.beginPath();
    for (const [dx, dy, r] of [[0, 0, 30], [40, -24, 40], [90, -14, 34], [124, 2, 26]]) {
      ctx.moveTo(x + (dx + r) * s, y + dy * s);
      ctx.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2);
    }
    ctx.rect(x, y - 8 * s, 124 * s, 36 * s);
    ctx.fill();
    ctx.restore();
  }

  function estrela(ctx, x, y, r, cor, pontas = 5, dentro = 0.5) {
    const caminho = new Path2D(DESENHOS.estrela(x, y, r, pontas, dentro));
    ctx.save();
    ctx.fillStyle = cor;
    ctx.strokeStyle = cor;
    ctx.lineJoin = "round";
    ctx.lineWidth = r * 0.3;
    ctx.fill(caminho);
    ctx.stroke(caminho);
    ctx.restore();
  }

  function coracao(ctx, x, y, tamanho, cor) {
    ctx.save();
    ctx.fillStyle = cor;
    ctx.fill(new Path2D(DESENHOS.coracao(x, y, tamanho)));
    ctx.restore();
  }

  // letras separadinhas ("C H Á  D O  N O A H"), centralizadas em x
  function espacado(ctx, texto, x, y, espaco) {
    const letras = [...texto];
    const larguras = letras.map((l) => ctx.measureText(l).width);
    const total = larguras.reduce((a, b) => a + b, 0) + espaco * (letras.length - 1);
    let cx = x - total / 2;
    ctx.save();
    ctx.textAlign = "left";
    letras.forEach((l, i) => {
      ctx.fillText(l, cx, y);
      cx += larguras[i] + espaco;
    });
    ctx.restore();
  }

  function quebrar(ctx, texto, largura) {
    const linhas = [];
    let atual = "";
    for (const palavra of texto.split(/\s+/).filter(Boolean)) {
      const teste = atual ? `${atual} ${palavra}` : palavra;
      if (!atual || ctx.measureText(teste).width <= largura) atual = teste;
      else {
        linhas.push(atual);
        atual = palavra;
      }
    }
    if (atual) linhas.push(atual);
    return linhas;
  }

  // texto em linhas, centralizado na caixa; a letra diminui até tudo caber
  function bloco(ctx, texto, { x, y, largura, altura, fonte, maior, menor, entrelinha = 1.42, cor }) {
    let tam = maior;
    let linhas;
    for (;;) {
      ctx.font = fonte(tam);
      linhas = quebrar(ctx, texto, largura);
      const cabe = linhas.length * tam * entrelinha <= altura && linhas.every((l) => ctx.measureText(l).width <= largura);
      if (cabe || tam <= menor) break;
      tam -= 2;
    }
    const passo = tam * entrelinha;
    let cy = y + (altura - linhas.length * passo) / 2 + passo / 2;
    ctx.fillStyle = cor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const l of linhas) {
      ctx.fillText(l, x + largura / 2, cy);
      cy += passo;
    }
    return { tam, linhas: linhas.length };
  }

  // uma linha só, centralizada; a letra diminui até caber
  function linha(ctx, texto, x, y, largura, fonte, maior, menor, cor) {
    let tam = maior;
    ctx.font = fonte(tam);
    while (tam > menor && ctx.measureText(texto).width > largura) {
      tam -= 2;
      ctx.font = fonte(tam);
    }
    ctx.fillStyle = cor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(texto, x, y);
    return tam;
  }

  // cartão 1: o recado do Noah, só daquela pessoa (o ursinho e o coelhinho espiam por cima).
  // Mais alto que o lembrete (1080 x 1620): as mensagens são cartinhas de verdade (jm: "pode e deve ser maior").
  const ALTURA_RECADO = 1620;
  async function recado(d) {
    await carregarFontes();
    const tela = novaTela(LARGURA, ALTURA_RECADO);
    const ctx = tela.getContext("2d");
    fundo(ctx, LARGURA, ALTURA_RECADO, ["#D3E8FA", "#EAF4FD", "#FFF3E3"]);
    nuvem(ctx, -40, 222, 1.7);
    nuvem(ctx, 850, 166, 1.3, "rgba(255,255,255,0.9)");
    nuvem(ctx, -60, 1612, 1.3, "rgba(255,255,255,0.9)");
    nuvem(ctx, 860, 1606, 1.4, "rgba(255,255,255,0.9)");
    estrela(ctx, 160, 72, 15, COR.amarelo);
    estrela(ctx, 930, 290, 13, COR.amarelo);
    estrela(ctx, 62, 410, 9, COR.azulClaro);
    estrela(ctx, 1012, 410, 10, COR.amarelo);
    estrela(ctx, 300, 146, 12, "#FFFFFF", 4, 0.35);
    estrela(ctx, 792, 90, 11, "#FFFFFF", 4, 0.35);
    estrela(ctx, 734, 318, 9, COR.azulClaro, 4, 0.35);

    ctx.fillStyle = COR.azul;
    ctx.font = nunito(800, 30);
    ctx.textBaseline = "middle";
    espacado(ctx, CHA.titulo.toUpperCase(), LARGURA / 2, 76, 7);
    DESENHOS.desenhar(ctx, DESENHOS.bebe, LARGURA / 2 - 160, 102, 320);

    const topo = 456;
    DESENHOS.espiar(ctx, DESENHOS.urso, "cabeca", 215, topo, 190);
    DESENHOS.espiar(ctx, DESENHOS.coelho, "cabeca", 870, topo, 170);
    painel(ctx, 60, topo, 960, 1040, 60);
    DESENHOS.espiar(ctx, DESENHOS.urso, "patas", 215, topo, 190);
    DESENHOS.espiar(ctx, DESENHOS.coelho, "patas", 870, topo, 170);

    bloco(ctx, d.saudacao, {
      x: 110, y: topo + 36, largura: 860, altura: 112,
      fonte: (t) => fredoka(700, t), maior: 72, menor: 40, entrelinha: 1.08, cor: COR.azulEscuro,
    });
    ctx.strokeStyle = "#D5E6F7";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(500, topo + 166);
    ctx.lineTo(580, topo + 166);
    ctx.stroke();
    bloco(ctx, d.corpo, {
      x: 110, y: topo + 190, largura: 860, altura: 690,
      fonte: (t) => nunito(600, t), maior: 50, menor: 30, entrelinha: 1.45, cor: COR.texto,
    });

    linha(ctx, CHA.assinatura, LARGURA / 2, topo + 920, 800, (t) => nunito(600, t), 36, 24, COR.suave);
    const tamNome = linha(ctx, CHA.bebe, LARGURA / 2 - 24, topo + 982, 700, (t) => fredoka(700, t), 70, 40, COR.azul);
    ctx.font = fredoka(700, tamNome);
    coracao(ctx, LARGURA / 2 - 24 + ctx.measureText(CHA.bebe).width / 2 + 36, topo + 984, 46, COR.rosa);

    linha(ctx, d.dataExtenso, LARGURA / 2, 1556, 940, (t) => nunito(700, t), 32, 24, COR.suave);
    return tela;
  }

  // cartão 2: o lembrete do que a pessoa leva (fralda e, se quiser, o mimo)
  async function lembrete(d) {
    await carregarFontes();
    const tela = novaTela(LARGURA, ALTURA);
    const ctx = tela.getContext("2d");
    fundo(ctx, LARGURA, ALTURA, ["#FFF3E3", "#F3F8FD", "#D3E8FA"]);
    nuvem(ctx, 940, 40, 0.95, "rgba(255,255,255,0.9)");
    estrela(ctx, 120, 86, 14, COR.amarelo);
    estrela(ctx, 1000, 236, 12, COR.amarelo);
    estrela(ctx, 58, 600, 9, COR.azulClaro);
    estrela(ctx, 1022, 660, 10, COR.amarelo);
    estrela(ctx, 250, 50, 10, COR.azulClaro, 4, 0.35);
    estrela(ctx, 790, 46, 9, COR.amarelo, 4, 0.35);

    ctx.fillStyle = COR.azul;
    ctx.font = nunito(800, 30);
    ctx.textBaseline = "middle";
    espacado(ctx, "LEMBRETE", LARGURA / 2, 72, 9);
    // o lembrete é mais discreto que o recado (o recado é o principal)
    bloco(ctx, `Não esquece, ${d.nome}!`, {
      x: 90, y: 100, largura: 900, altura: 124,
      fonte: (t) => fredoka(600, t), maior: 62, menor: 40, entrelinha: 1.1, cor: COR.texto,
    });
    linha(ctx, "No dia do chá, você vai levar:", LARGURA / 2, 260, 900, (t) => nunito(600, t), 40, 28, COR.texto);

    // ---- medidas do que vai embaixo do painel da fralda: o mimo (se tiver) e o quando/onde ----
    const xTexto = 192;
    const larguraTexto = 760;
    const itens = [{ icone: "calendario", forte: CHA.titulo, texto: d.dataExtenso }];
    if (CHA.horario) itens.push({ icone: "relogio", texto: CHA.horario });
    if (CHA.local) itens.push({ icone: "local", texto: CHA.local });
    ctx.font = nunito(700, 32);
    for (const item of itens) {
      item.linhas = quebrar(ctx, item.texto, larguraTexto).slice(0, 2);
      item.altura = (item.forte ? 44 : 0) + item.linhas.length * 42;
    }
    ctx.font = nunito(600, 29);
    const obs = CHA.observacao ? quebrar(ctx, CHA.observacao, 800).slice(0, 2) : [];
    const alturaInfo = 48 + itens.reduce((s, i) => s + i.altura, 0) + (itens.length - 1) * 14 + (obs.length ? 14 + obs.length * 38 : 0);
    ctx.font = nunito(600, 30);
    const linhasMimo = d.mimo ? quebrar(ctx, d.mimo, 640).slice(0, 3) : [];
    const alturaMimo = d.mimo ? Math.max(170, 30 + 44 + linhasMimo.length * 38 + 30) : 0;
    const embaixo = alturaInfo + (d.mimo ? alturaMimo + 18 : 0);

    // o painel da fralda encolhe um pouco quando tem mais coisa; embaixo fica o lugar dos bichinhos
    const topoPainel = 296;
    const limite = 1130;
    const alturaPainel = Math.max(380, Math.min(540, limite - topoPainel - 26 - embaixo));
    const sobra = limite - (topoPainel + alturaPainel + 26 + embaixo);
    painel(ctx, 100, topoPainel, 880, alturaPainel, 60);
    const larguraFralda = ((alturaPainel - 250) * 320) / 250;
    const xFralda = LARGURA / 2 - larguraFralda / 2;
    const yFralda = topoPainel + 14;
    const escala = DESENHOS.desenhar(ctx, DESENHOS.fralda, xFralda, yFralda, larguraFralda);
    const [cx, cy] = DESENHOS.fralda.centro;
    linha(ctx, d.fralda.tamanho, xFralda + cx * escala, yFralda + cy * escala + 8 * escala, 0.54 * larguraFralda,
      (t) => fredoka(700, t), Math.round((d.fralda.tamanho.length > 1 ? 110 : 134) * escala / 1.1875), 40, COR.azul);
    const fimPainel = topoPainel + alturaPainel;
    linha(ctx, `Tamanho ${d.fralda.tamanho}`, LARGURA / 2, fimPainel - 176, 800, (t) => fredoka(700, t), 72, 44, COR.azulEscuro);
    linha(ctx, d.fralda.nome, LARGURA / 2, fimPainel - 114, 800, (t) => nunito(800, t), 42, 28, COR.azul);
    linha(ctx, CHA.levar, LARGURA / 2, fimPainel - 54, 800, (t) => nunito(600, t), 38, 26, COR.texto);

    let y = fimPainel + 26 + Math.max(0, sobra / 2);
    if (d.mimo) {
      painel(ctx, 100, y, 880, alturaMimo, 40, "#FFF1F5");
      DESENHOS.desenhar(ctx, DESENHOS.presente, 126, y + (alturaMimo - 136) / 2, 136);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      let yTexto = y + (alturaMimo - (44 + linhasMimo.length * 38)) / 2 + 20;
      ctx.fillStyle = COR.rosaForte;
      ctx.font = nunito(800, 34);
      ctx.fillText("+ um mimo pro Noah", 290, yTexto);
      yTexto += 44;
      ctx.fillStyle = COR.texto;
      ctx.font = nunito(600, 30);
      for (const l of linhasMimo) {
        ctx.fillText(l, 290, yTexto);
        yTexto += 38;
      }
      y += alturaMimo + 18;
    }

    // quando e onde (o que estiver vazio no config.js não aparece)
    painel(ctx, 100, y, 880, alturaInfo, 40, "rgba(255,255,255,0.82)");
    let yItem = y + 24;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    for (const item of itens) {
      DESENHOS.desenhar(ctx, DESENHOS.icones[item.icone], 132, yItem + 1, 42);
      let yLinha = yItem + 21;
      if (item.forte) {
        ctx.fillStyle = COR.azulEscuro;
        ctx.font = nunito(800, 34);
        ctx.fillText(item.forte, xTexto, yLinha);
        yLinha += 44;
      }
      ctx.fillStyle = COR.texto;
      ctx.font = nunito(700, 32);
      for (const l of item.linhas) {
        ctx.fillText(l, xTexto, yLinha);
        yLinha += 42;
      }
      yItem += item.altura + 14;
    }
    if (obs.length) {
      ctx.fillStyle = COR.suave;
      ctx.font = nunito(600, 29);
      ctx.textAlign = "center";
      let yObs = yItem + 12;
      for (const l of obs) {
        ctx.fillText(l, LARGURA / 2, yObs);
        yObs += 38;
      }
    }
    const fimConteudo = y + alturaInfo;

    // embaixo: o coelhinho e o elefantinho espiando de trás das nuvens (só se couber sem encostar no texto)
    const comBichinhos = fimConteudo <= 1136;
    if (comBichinhos) {
      DESENHOS.espiar(ctx, DESENHOS.coelho, "cabeca", 128, 1268, 150);
      DESENHOS.espiar(ctx, DESENHOS.elefante, "cabeca", 958, 1266, 170);
    }
    nuvem(ctx, -50, 1340, 1.6);
    nuvem(ctx, 840, 1334, 1.3);
    if (comBichinhos) {
      DESENHOS.espiar(ctx, DESENHOS.coelho, "patas", 128, 1268, 150);
      DESENHOS.espiar(ctx, DESENHOS.elefante, "patas", 958, 1266, 170);
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = COR.azul;
    ctx.font = nunito(800, 30);
    const fim = "Guarde este lembrete";
    ctx.fillText(fim, LARGURA / 2 - 20, 1288);
    coracao(ctx, LARGURA / 2 - 20 + ctx.measureText(fim).width / 2 + 28, 1290, 34, COR.rosa);
    return tela;
  }

  // a imagem que aparece quando o link é mandado no WhatsApp (1200 x 630)
  async function previa(d) {
    await carregarFontes();
    const tela = novaTela(1200, 630);
    const ctx = tela.getContext("2d");
    fundo(ctx, 1200, 630, ["#D3E8FA", "#EAF4FD", "#FFF3E3"]);
    nuvem(ctx, -30, 150, 1.4);
    nuvem(ctx, 1010, 100, 1.1, "rgba(255,255,255,0.9)");
    estrela(ctx, 520, 64, 14, COR.amarelo);
    estrela(ctx, 1140, 260, 12, COR.amarelo);
    estrela(ctx, 70, 520, 10, COR.azulClaro);
    estrela(ctx, 440, 120, 10, "#FFFFFF", 4, 0.35);
    DESENHOS.desenhar(ctx, DESENHOS.bebe, 60, 96, 400);

    const xTexto = 815;
    linha(ctx, "VEM AÍ O", xTexto, 150, 640, (t) => nunito(800, t), 30, 20, COR.azul);
    linha(ctx, CHA.titulo, xTexto, 236, 660, (t) => fredoka(700, t), 104, 60, COR.azulEscuro);
    linha(ctx, d.dataExtenso, xTexto, 316, 660, (t) => nunito(700, t), 34, 22, COR.texto);
    ctx.save();
    ctx.shadowColor = "rgba(79, 134, 198, 0.35)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = COR.azul;
    retangulo(ctx, xTexto - 280, 364, 560, 88, 44);
    ctx.fill();
    ctx.restore();
    const convite = "Toque e pegue seu cartão";
    const tamConvite = linha(ctx, convite, xTexto - 20, 409, 460, (t) => fredoka(600, t), 38, 26, "#FFFFFF");
    ctx.font = fredoka(600, tamConvite);
    coracao(ctx, xTexto - 20 + ctx.measureText(convite).width / 2 + 30, 410, 30, "#FFFFFF");

    // os bichinhos espiando de trás das nuvens, embaixo
    DESENHOS.espiar(ctx, DESENHOS.urso, "cabeca", 640, 600, 150);
    DESENHOS.espiar(ctx, DESENHOS.coelho, "cabeca", 820, 600, 130);
    DESENHOS.espiar(ctx, DESENHOS.elefante, "cabeca", 1010, 600, 160);
    nuvem(ctx, 520, 660, 1.5);
    nuvem(ctx, 760, 668, 1.4);
    nuvem(ctx, 960, 660, 1.6);
    DESENHOS.espiar(ctx, DESENHOS.urso, "patas", 640, 600, 150);
    DESENHOS.espiar(ctx, DESENHOS.coelho, "patas", 820, 600, 130);
    DESENHOS.espiar(ctx, DESENHOS.elefante, "patas", 1010, 600, 160);
    return tela;
  }

  return { recado, lembrete, previa, carregarFontes };
})();
