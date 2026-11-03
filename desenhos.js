// Desenhos do Chá do Noah, feitos só com "caminhos" (sem imagem de fora): o mesmo desenho
// vai pra página (SVG) e pros cartões PNG (canvas), sempre nítido e sem marca d'água.
const DESENHOS = (() => {
  const n = (v) => Math.round(v * 100) / 100;
  const circulo = (cx, cy, r) => `M${n(cx - r)} ${n(cy)}a${r} ${r} 0 1 0 ${n(2 * r)} 0a${r} ${r} 0 1 0 ${n(-2 * r)} 0Z`;
  const elipse = (cx, cy, rx, ry, graus = 0) => {
    const t = (graus * Math.PI) / 180;
    const dx = rx * Math.cos(t);
    const dy = rx * Math.sin(t);
    return `M${n(cx - dx)} ${n(cy - dy)}A${rx} ${ry} ${graus} 1 0 ${n(cx + dx)} ${n(cy + dy)}A${rx} ${ry} ${graus} 1 0 ${n(cx - dx)} ${n(cy - dy)}Z`;
  };
  const arredondado = (x, y, w, h, r) =>
    `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}` +
    `H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  const estrela = (cx, cy, r, pontas = 5, dentro = 0.5) => {
    let d = "";
    for (let i = 0; i < pontas * 2; i++) {
      const raio = i % 2 ? r * dentro : r;
      const ang = -Math.PI / 2 + (i * Math.PI) / pontas;
      d += `${i ? "L" : "M"}${n(cx + raio * Math.cos(ang))} ${n(cy + raio * Math.sin(ang))}`;
    }
    return d + "Z";
  };
  // coração com centro em (cx, cy) e largura t
  const coracao = (cx, cy, t) => {
    const s = t / 40;
    const x = (v) => n(cx + (v - 20) * s);
    const y = (v) => n(cy + (v - 19) * s);
    return `M${x(20)} ${y(35)}C${x(8)} ${y(26)} ${x(3)} ${y(19)} ${x(3)} ${y(12.5)}C${x(3)} ${y(7)} ${x(7.5)} ${y(3)} ${x(12.5)} ${y(3)}` +
      `C${x(16)} ${y(3)} ${x(18.6)} ${y(5)} ${x(20)} ${y(7.5)}C${x(21.4)} ${y(5)} ${x(24)} ${y(3)} ${x(27.5)} ${y(3)}` +
      `C${x(32.5)} ${y(3)} ${x(37)} ${y(7)} ${x(37)} ${y(12.5)}C${x(37)} ${y(19)} ${x(32)} ${y(26)} ${x(20)} ${y(35)}Z`;
  };

  const PELE = "#F3C7A3"; // um pouquinho moreno, ainda clarinho (jm, 02/11)
  const PELE_FUNDA = "#DDA083";
  const CABELO = "#8A5433";
  const BLUSA = "#5B93D3";
  const AZUL = "#4F86C6";
  const AZUL_ESCURO = "#24395C";
  const AMARELO = "#F5C451";

  // ---------- o Noah (olhos verdes) ----------
  const olho = (cx, cy) => [
    { d: circulo(cx, cy, 21), fill: "#4AAE78" },
    { d: circulo(cx, cy, 21), stroke: "#2D8257", width: 3 },
    { d: circulo(cx, cy + 1, 11), fill: "#1D2B45" },
    { d: circulo(cx - 7, cy - 8, 7), fill: "#FFFFFF" },
    { d: circulo(cx + 7, cy + 7, 3.2), fill: "#FFFFFF" },
  ];
  // mão aberta: lado -1 = a da esquerda, 1 = a da direita
  const mao = (x, y, lado) => {
    const pecas = [];
    for (const base of [-14, 4, 22, 40]) {
      const a = lado * base;
      const t = (a * Math.PI) / 180;
      pecas.push({ d: elipse(x + Math.sin(t) * 19, y - Math.cos(t) * 19, 10, 7.5, a + 90), fill: PELE });
    }
    pecas.push({ d: elipse(x - lado * 19, y + 4, 10, 7.5, -lado * 50), fill: PELE });
    pecas.push({ d: circulo(x, y + 4, 19), fill: PELE });
    return pecas;
  };
  const TRONCO = { d: "M146 236 C134 270 132 308 138 340 C170 352 230 352 262 340 C268 308 266 270 254 236 C232 224 168 224 146 236 Z", fill: BLUSA };
  // só a cabeça (vai também no ícone do site)
  const ROSTO = [
    { d: circulo(104, 168, 21), fill: PELE },
    { d: elipse(106, 169, 10, 12), fill: PELE_FUNDA, alpha: 0.6 },
    { d: circulo(296, 168, 21), fill: PELE },
    { d: elipse(294, 169, 10, 12), fill: PELE_FUNDA, alpha: 0.6 },
    { d: elipse(200, 160, 98, 92), fill: PELE },
    {
      d: "M104 160 C96 92 142 56 202 56 C262 56 306 94 296 160 C288 138 272 122 250 114 C244 130 222 140 198 136 C176 132 160 122 152 112 C134 124 114 140 104 160 Z",
      fill: CABELO,
    },
    { d: "M200 60 C190 40 204 26 220 34", stroke: CABELO, width: 11 },
    { d: "M146 92 C166 76 194 70 222 74", stroke: "#A8714A", width: 7, alpha: 0.8 },
    ...olho(164, 176),
    ...olho(236, 176),
    { d: elipse(138, 206, 18, 11), fill: "#FF8F8F", alpha: 0.45 },
    { d: elipse(262, 206, 18, 11), fill: "#FF8F8F", alpha: 0.45 },
    { d: elipse(200, 200, 7, 5), fill: PELE_FUNDA },
    { d: "M180 216 Q200 244 220 216 Q200 222 180 216 Z", fill: "#C24A5C" },
    { d: "M190 230 Q200 240 210 230 Q200 226 190 230 Z", fill: "#F28A98" },
  ];
  const bebe = {
    largura: 400,
    altura: 420,
    pecas: [
      { d: elipse(200, 404, 118, 11), fill: AZUL_ESCURO, alpha: 0.08 },
      // braços pra cima (atrás do corpo)
      { d: "M164 262 Q108 244 72 176", stroke: BLUSA, width: 40 },
      { d: "M236 262 Q292 244 328 176", stroke: BLUSA, width: 40 },
      ...mao(62, 158, -1),
      ...mao(338, 158, 1),
      // fralda e blusa (com um coraçãozinho)
      { d: "M140 318 C138 362 166 386 200 388 C234 386 262 362 260 318 Z", fill: "#FFFFFF", stroke: "#D6E3F1", width: 3 },
      TRONCO,
      { d: coracao(200, 296, 30), fill: "#FFFFFF", alpha: 0.9 },
      // pernas cruzadas e pezinhos
      { d: elipse(160, 378, 50, 24, 16), fill: PELE, stroke: "#E3B08C", width: 3 },
      { d: elipse(240, 378, 50, 24, -16), fill: PELE, stroke: "#E3B08C", width: 3 },
      { d: elipse(186, 393, 21, 14, 8), fill: "#EEBF99", stroke: "#DCA683", width: 3 },
      { d: elipse(215, 393, 21, 14, -8), fill: "#EEBF99", stroke: "#DCA683", width: 3 },
      { d: circulo(170, 386, 3.4), fill: "#DCA683" },
      { d: circulo(169, 394, 3), fill: "#DCA683" },
      { d: circulo(231, 386, 3.4), fill: "#DCA683" },
      { d: circulo(232, 394, 3), fill: "#DCA683" },
      ...ROSTO,
    ],
  };

  // ---------- os bichinhos ----------
  // Eles "espiam" por cima de uma borda (painel ou nuvem): a cabeça vai ANTES da borda e as
  // patinhas DEPOIS, por cima dela. `borda` é a altura, no desenho, onde a borda passa.
  const olhinho = (cx, cy) => [
    { d: elipse(cx, cy, 8, 10), fill: "#2A2A3A" },
    { d: circulo(cx + 2.5, cy - 3.5, 3), fill: "#FFFFFF" },
  ];
  const urso = {
    largura: 220,
    altura: 180,
    borda: 150,
    cabeca: [
      { d: circulo(54, 52, 30), fill: "#C98D5B" },
      { d: circulo(54, 52, 16), fill: "#EFC9A5" },
      { d: circulo(166, 52, 30), fill: "#C98D5B" },
      { d: circulo(166, 52, 16), fill: "#EFC9A5" },
      { d: elipse(110, 114, 84, 72), fill: "#DBA371" },
      { d: elipse(110, 136, 36, 26), fill: "#F7E3CC" },
      { d: elipse(110, 125, 12, 8.5), fill: "#5B3A29" },
      { d: elipse(106, 122, 4, 2.2), fill: "#FFFFFF", alpha: 0.5 },
      { d: "M110 133 Q110 142 101 143 M110 133 Q110 142 119 143", stroke: "#5B3A29", width: 3.5 },
      ...olhinho(80, 104),
      ...olhinho(140, 104),
      { d: elipse(62, 128, 13, 8), fill: "#FF9E9E", alpha: 0.45 },
      { d: elipse(158, 128, 13, 8), fill: "#FF9E9E", alpha: 0.45 },
    ],
    patas: [
      { d: elipse(62, 152, 25, 16), fill: "#C98D5B" },
      { d: elipse(158, 152, 25, 16), fill: "#C98D5B" },
      { d: "M56 146 v9 M68 146 v9 M152 146 v9 M164 146 v9", stroke: "#AD7647", width: 2.5 },
    ],
  };
  const coelho = {
    largura: 220,
    altura: 220,
    borda: 182,
    cabeca: [
      { d: elipse(80, 68, 22, 58, -12), fill: "#FFFDF9", stroke: "#E8DDD0", width: 3 },
      { d: elipse(81, 72, 11, 42, -12), fill: "#F9C5CF" },
      { d: elipse(140, 68, 22, 58, 12), fill: "#FFFDF9", stroke: "#E8DDD0", width: 3 },
      { d: elipse(139, 72, 11, 42, 12), fill: "#F9C5CF" },
      { d: elipse(110, 152, 72, 62), fill: "#FFFDF9", stroke: "#E8DDD0", width: 3 },
      ...olhinho(84, 146),
      ...olhinho(136, 146),
      { d: elipse(110, 163, 7.5, 5.5), fill: "#F49AAE" },
      { d: "M110 168 Q110 175 102 177 M110 168 Q110 175 118 177", stroke: "#C98A93", width: 3 },
      { d: elipse(68, 168, 13, 8), fill: "#FFB3C1", alpha: 0.6 },
      { d: elipse(152, 168, 13, 8), fill: "#FFB3C1", alpha: 0.6 },
    ],
    patas: [
      { d: elipse(78, 186, 22, 14), fill: "#FFFDF9", stroke: "#E8DDD0", width: 3 },
      { d: elipse(142, 186, 22, 14), fill: "#FFFDF9", stroke: "#E8DDD0", width: 3 },
    ],
  };
  const TROMBA = "M120 120 C120 150 120 176 130 192 C138 204 154 202 156 190";
  const elefante = {
    largura: 240,
    altura: 210,
    borda: 168,
    cabeca: [
      { d: elipse(54, 104, 46, 54, -14), fill: "#A7C0DD" },
      { d: elipse(58, 106, 30, 38, -14), fill: "#F6C9D4" },
      { d: elipse(186, 104, 46, 54, 14), fill: "#A7C0DD" },
      { d: elipse(182, 106, 30, 38, 14), fill: "#F6C9D4" },
      { d: elipse(120, 110, 68, 62), fill: "#BED2E9" },
      { d: "M114 52 Q114 36 126 42 Q128 30 138 38", stroke: "#A7C0DD", width: 5 },
      ...olhinho(98, 104),
      ...olhinho(142, 104),
      { d: elipse(82, 130, 12, 8), fill: "#FF9EB0", alpha: 0.5 },
      { d: elipse(158, 130, 12, 8), fill: "#FF9EB0", alpha: 0.5 },
    ],
    // a tromba vem pra frente, por cima da borda, com a pontinha enrolada pra cima
    patas: [
      { d: elipse(66, 170, 24, 15), fill: "#BED2E9" },
      { d: elipse(174, 170, 24, 15), fill: "#BED2E9" },
      { d: `${circulo(57, 179, 3.5)}${circulo(66, 181, 3.5)}${circulo(75, 179, 3.5)}`, fill: "#FFFFFF", alpha: 0.9 },
      { d: `${circulo(165, 179, 3.5)}${circulo(174, 181, 3.5)}${circulo(183, 179, 3.5)}`, fill: "#FFFFFF", alpha: 0.9 },
      { d: TROMBA, stroke: "#A7C0DD", width: 28 },
      { d: TROMBA, stroke: "#BED2E9", width: 22 },
      { d: circulo(120, 121, 15), fill: "#BED2E9" },
      { d: "M109 150 q11 4 22 0 M110 164 q10 4 20 0", stroke: "#A7C0DD", width: 2.5 },
    ],
  };

  // ---------- a fralda, o presente (mimo) e os ícones ----------
  // frente de uma fralda (formato de calcinha): cós largo em cima e as aberturas das pernas curvando pra dentro
  const CORPO_FRALDA = "M30 40 H290 V112 C252 122 214 156 202 214 Q160 222 118 214 C106 156 68 122 30 112 Z";
  const fralda = {
    largura: 320,
    altura: 250,
    // o tamanho (M, G...) vai escrito no meio da frente
    centro: [160, 128],
    pecas: [
      { d: elipse(160, 236, 110, 8), fill: AZUL_ESCURO, alpha: 0.07 },
      { d: CORPO_FRALDA, fill: "#FFFFFF" },
      { d: "M30 40 H290 V74 H30 Z", fill: "#E4EFFB" },
      { d: "M38 120 C74 132 104 162 116 206", stroke: "#DCE9F7", width: 7 },
      { d: "M282 120 C246 132 216 162 204 206", stroke: "#DCE9F7", width: 7 },
      { d: CORPO_FRALDA, stroke: "#C9DCF0", width: 5 },
      { d: arredondado(4, 46, 50, 28, 10), fill: AMARELO },
      { d: arredondado(266, 46, 50, 28, 10), fill: AMARELO },
      { d: estrela(64, 94, 8), fill: "#CFE2F6" },
      { d: estrela(258, 96, 7), fill: "#CFE2F6" },
      { d: estrela(136, 192, 6), fill: "#CFE2F6" },
      { d: estrela(190, 190, 6), fill: "#CFE2F6" },
    ],
  };
  const presente = {
    largura: 200,
    altura: 200,
    pecas: [
      { d: elipse(100, 188, 70, 7), fill: AZUL_ESCURO, alpha: 0.07 },
      { d: arredondado(32, 88, 136, 94, 12), fill: "#F7B6C5" },
      { d: "M32 104 H168", stroke: "#EE9DB1", width: 5, alpha: 0.55 },
      { d: "M88 88 H112 V182 H88 Z", fill: "#FFFFFF" },
      { d: arredondado(22, 64, 156, 34, 10), fill: "#F9C6D2" },
      { d: "M88 64 H112 V98 H88 Z", fill: "#FFFFFF" },
      { d: `${circulo(56, 138, 6)}${circulo(140, 152, 5)}${circulo(62, 164, 4)}${circulo(146, 120, 4)}`, fill: "#FFFFFF", alpha: 0.55 },
      { d: elipse(74, 50, 26, 15, -28), fill: "#FFFFFF", stroke: "#F2A3B5", width: 3 },
      { d: elipse(126, 50, 26, 15, 28), fill: "#FFFFFF", stroke: "#F2A3B5", width: 3 },
      { d: circulo(100, 60, 11), fill: "#FFFFFF", stroke: "#F2A3B5", width: 3 },
    ],
  };

  const icones = {
    calendario: {
      largura: 40,
      altura: 40,
      pecas: [
        { d: arredondado(4, 8, 32, 28, 6), fill: AZUL },
        { d: arredondado(8, 17, 24, 15, 3), fill: "#FFFFFF" },
        { d: "M13 5 V11", stroke: AZUL_ESCURO, width: 4 },
        { d: "M27 5 V11", stroke: AZUL_ESCURO, width: 4 },
      ],
    },
    relogio: {
      largura: 40,
      altura: 40,
      pecas: [
        { d: circulo(20, 20, 16), fill: AZUL },
        { d: circulo(20, 20, 12), fill: "#FFFFFF" },
        { d: "M20 13 V20 L25 23", stroke: AZUL_ESCURO, width: 3.5 },
      ],
    },
    local: {
      largura: 40,
      altura: 40,
      pecas: [
        { d: "M20 37 C13 28 7 22 7 15 A13 13 0 0 1 33 15 C33 22 27 28 20 37 Z", fill: AZUL },
        { d: circulo(20, 15, 5.5), fill: "#FFFFFF" },
      ],
    },
  };

  function atributos(p) {
    const a = [`d="${p.d}"`, `fill="${p.fill || "none"}"`];
    if (p.stroke) a.push(`stroke="${p.stroke}" stroke-width="${p.width}" stroke-linecap="round" stroke-linejoin="round"`);
    if (p.alpha != null) a.push(`opacity="${p.alpha}"`);
    return `<path ${a.join(" ")}/>`;
  }

  function paraSvg(desenho, rotulo) {
    const acessivel = rotulo ? `role="img" aria-label="${rotulo}"` : 'aria-hidden="true"';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${desenho.largura} ${desenho.altura}" ${acessivel}>` +
      `${desenho.pecas.map(atributos).join("")}</svg>`;
  }

  // a cabeça ou as patinhas de um bichinho, como desenho separado (mesmo tamanho, pra encaixar uma na outra)
  const parte = (bicho, qual) => ({ largura: bicho.largura, altura: bicho.altura, pecas: bicho[qual] });

  // ícone do site e do atalho: o rostinho do Noah num quadrado azul-clarinho (redondo = pra aba do navegador)
  function iconeSvg(redondo) {
    const fundo = redondo ? '<circle cx="256" cy="256" r="256" fill="#DCEEFB"/>' : '<rect width="512" height="512" fill="#DCEEFB"/>';
    const corte = redondo ? '<clipPath id="c"><circle cx="256" cy="256" r="256"/></clipPath>' : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${corte}${fundo}` +
      `<g${redondo ? ' clip-path="url(#c)"' : ""}><g transform="translate(-44 31) scale(1.5)">` +
      `${[TRONCO, { d: coracao(200, 296, 30), fill: "#FFFFFF", alpha: 0.9 }, ...ROSTO].map(atributos).join("")}</g></g></svg>`;
  }

  // desenha no canvas com a largura pedida (a altura acompanha); devolve a escala usada
  function desenhar(ctx, desenho, x, y, largura) {
    const s = largura / desenho.largura;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    for (const p of desenho.pecas) {
      const caminho = new Path2D(p.d);
      ctx.globalAlpha = p.alpha != null ? p.alpha : 1;
      if (p.fill) {
        ctx.fillStyle = p.fill;
        ctx.fill(caminho);
      }
      if (p.stroke) {
        ctx.strokeStyle = p.stroke;
        ctx.lineWidth = p.width;
        ctx.stroke(caminho);
      }
    }
    ctx.restore();
    return s;
  }

  // bichinho espiando: (xCentro, yBorda) é onde a borda passa no canvas
  function espiar(ctx, bicho, qual, xCentro, yBorda, largura) {
    const s = largura / bicho.largura;
    desenhar(ctx, parte(bicho, qual), xCentro - largura / 2, yBorda - bicho.borda * s, largura);
  }

  return {
    bebe, urso, coelho, elefante, fralda, presente, icones,
    paraSvg, parte, iconeSvg, desenhar, espiar, estrela, coracao,
  };
})();
