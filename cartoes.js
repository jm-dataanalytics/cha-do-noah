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
  };
  const fredoka = (peso, t) => `${peso} ${t}px Fredoka, Nunito, sans-serif`;
  const nunito = (peso, t) => `${peso} ${t}px Nunito, sans-serif`;
  const CORACAO = "M20 35 C8 26 3 19 3 12.5 C3 7 7.5 3 12.5 3 C16 3 18.6 5 20 7.5 C21.4 5 24 3 27.5 3 C32.5 3 37 7 37 12.5 C37 19 32 26 20 35 Z";

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

  function nuvem(ctx, x, y, s, cor) {
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
    ctx.translate(x - tamanho / 2, y - tamanho / 2);
    ctx.scale(tamanho / 40, tamanho / 40);
    ctx.fillStyle = cor;
    ctx.fill(new Path2D(CORACAO));
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

  // cartão 1: o recado do Noah, só daquela pessoa
  async function recado(d) {
    await carregarFontes();
    const tela = novaTela(LARGURA, ALTURA);
    const ctx = tela.getContext("2d");
    fundo(ctx, LARGURA, ALTURA, ["#D3E8FA", "#EAF4FD", "#FFF3E3"]);
    nuvem(ctx, -40, 232, 1.7, "rgba(255,255,255,0.95)");
    nuvem(ctx, 850, 172, 1.3, "rgba(255,255,255,0.9)");
    nuvem(ctx, -60, 1342, 1.3, "rgba(255,255,255,0.9)");
    nuvem(ctx, 860, 1336, 1.4, "rgba(255,255,255,0.9)");
    estrela(ctx, 160, 72, 15, COR.amarelo);
    estrela(ctx, 930, 300, 13, COR.amarelo);
    estrela(ctx, 112, 420, 9, COR.azulClaro);
    estrela(ctx, 985, 452, 10, COR.amarelo);
    estrela(ctx, 300, 150, 12, "#FFFFFF", 4, 0.35);
    estrela(ctx, 792, 92, 11, "#FFFFFF", 4, 0.35);
    estrela(ctx, 820, 420, 9, COR.azulClaro, 4, 0.35);

    ctx.fillStyle = COR.azul;
    ctx.font = nunito(800, 30);
    ctx.textBaseline = "middle";
    espacado(ctx, CHA.titulo.toUpperCase(), LARGURA / 2, 78, 7);
    DESENHOS.desenhar(ctx, DESENHOS.bebe, LARGURA / 2 - 180, 106, 360);

    painel(ctx, 70, 500, 940, 720, 60);
    bloco(ctx, d.saudacao, {
      x: 120, y: 534, largura: 840, altura: 112,
      fonte: (t) => fredoka(700, t), maior: 76, menor: 40, entrelinha: 1.08, cor: COR.azulEscuro,
    });
    ctx.strokeStyle = "#D5E6F7";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(500, 662);
    ctx.lineTo(580, 662);
    ctx.stroke();
    bloco(ctx, d.corpo, {
      x: 120, y: 682, largura: 840, altura: 370,
      fonte: (t) => nunito(600, t), maior: 46, menor: 30, entrelinha: 1.45, cor: COR.texto,
    });

    linha(ctx, CHA.assinatura, LARGURA / 2, 1094, 800, (t) => nunito(600, t), 36, 24, COR.suave);
    const tamNome = linha(ctx, CHA.bebe, LARGURA / 2 - 24, 1156, 700, (t) => fredoka(700, t), 70, 40, COR.azul);
    ctx.font = fredoka(700, tamNome);
    coracao(ctx, LARGURA / 2 - 24 + ctx.measureText(CHA.bebe).width / 2 + 36, 1158, 46, COR.rosa);

    linha(ctx, d.dataExtenso, LARGURA / 2, 1284, 940, (t) => nunito(700, t), 32, 24, COR.suave);
    return tela;
  }

  // cartão 2: o lembrete do que a pessoa leva
  async function lembrete(d) {
    await carregarFontes();
    const tela = novaTela(LARGURA, ALTURA);
    const ctx = tela.getContext("2d");
    fundo(ctx, LARGURA, ALTURA, ["#FFF3E3", "#F3F8FD", "#D3E8FA"]);
    nuvem(ctx, 940, 40, 0.95, "rgba(255,255,255,0.9)");
    nuvem(ctx, -50, 1340, 1.6, "rgba(255,255,255,0.95)");
    nuvem(ctx, 840, 1334, 1.3, "rgba(255,255,255,0.9)");
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
    bloco(ctx, `Não esquece, ${d.nome}!`, {
      x: 90, y: 100, largura: 900, altura: 124,
      fonte: (t) => fredoka(700, t), maior: 80, menor: 44, entrelinha: 1.1, cor: COR.azulEscuro,
    });
    linha(ctx, "No dia do chá, você vai levar:", LARGURA / 2, 260, 900, (t) => nunito(600, t), 40, 28, COR.texto);

    painel(ctx, 100, 296, 880, 540, 60);
    const larguraFralda = 380;
    const xFralda = LARGURA / 2 - larguraFralda / 2;
    const yFralda = 310;
    const escala = DESENHOS.desenhar(ctx, DESENHOS.fralda, xFralda, yFralda, larguraFralda);
    const [cx, cy] = DESENHOS.fralda.centro;
    linha(ctx, d.fralda.tamanho, xFralda + cx * escala, yFralda + cy * escala + 8, 200, (t) => fredoka(700, t),
      d.fralda.tamanho.length > 1 ? 110 : 134, 56, COR.azul);
    linha(ctx, `Tamanho ${d.fralda.tamanho}`, LARGURA / 2, 660, 800, (t) => fredoka(700, t), 72, 44, COR.azulEscuro);
    linha(ctx, d.fralda.nome, LARGURA / 2, 722, 800, (t) => nunito(800, t), 42, 28, COR.azul);
    linha(ctx, CHA.levar, LARGURA / 2, 782, 800, (t) => nunito(600, t), 38, 26, COR.texto);

    // quando e onde (o que estiver vazio no config.js não aparece); a caixa cresce conforme o que tiver
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
    const alturaItens = itens.reduce((s, i) => s + i.altura, 0) + (itens.length - 1) * 14;
    const alturaCaixa = 48 + alturaItens + (obs.length ? 14 + obs.length * 38 : 0);
    // espaço entre o painel da fralda (até 836) e o "Guarde este lembrete" (1288)
    const yCaixa = 862 + Math.max(0, (374 - alturaCaixa) / 2);
    painel(ctx, 100, yCaixa, 880, alturaCaixa, 40, "rgba(255,255,255,0.82)");
    let y = yCaixa + 24;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    for (const item of itens) {
      DESENHOS.desenhar(ctx, DESENHOS.icones[item.icone], 132, y + 1, 42);
      let yLinha = y + 21;
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
      y += item.altura + 14;
    }
    if (obs.length) {
      ctx.fillStyle = COR.suave;
      ctx.font = nunito(600, 29);
      ctx.textAlign = "center";
      let yObs = y + 12;
      for (const l of obs) {
        ctx.fillText(l, LARGURA / 2, yObs);
        yObs += 38;
      }
    }

    ctx.textAlign = "center";
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
    nuvem(ctx, -30, 150, 1.4, "rgba(255,255,255,0.95)");
    nuvem(ctx, 1010, 110, 1.1, "rgba(255,255,255,0.9)");
    nuvem(ctx, 760, 640, 1.5, "rgba(255,255,255,0.9)");
    estrela(ctx, 520, 70, 14, COR.amarelo);
    estrela(ctx, 1130, 300, 12, COR.amarelo);
    estrela(ctx, 70, 520, 10, COR.azulClaro);
    estrela(ctx, 440, 120, 10, "#FFFFFF", 4, 0.35);
    DESENHOS.desenhar(ctx, DESENHOS.bebe, 60, 96, 400);

    const xTexto = 815;
    linha(ctx, "VEM AÍ O", xTexto, 176, 640, (t) => nunito(800, t), 30, 20, COR.azul);
    linha(ctx, CHA.titulo, xTexto, 264, 660, (t) => fredoka(700, t), 104, 60, COR.azulEscuro);
    linha(ctx, d.dataExtenso, xTexto, 346, 660, (t) => nunito(700, t), 34, 22, COR.texto);
    ctx.save();
    ctx.shadowColor = "rgba(79, 134, 198, 0.35)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = COR.azul;
    retangulo(ctx, xTexto - 280, 404, 560, 92, 46);
    ctx.fill();
    ctx.restore();
    const convite = "Toque e pegue seu cartão";
    const tamConvite = linha(ctx, convite, xTexto - 20, 451, 460, (t) => fredoka(600, t), 38, 26, "#FFFFFF");
    ctx.font = fredoka(600, tamConvite);
    coracao(ctx, xTexto - 20 + ctx.measureText(convite).width / 2 + 30, 453, 30, "#FFFFFF");
    return tela;
  }

  return { recado, lembrete, previa, carregarFontes };
})();
