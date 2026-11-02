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

  const PELE = "#FFDCC6";
  const PELE_FUNDA = "#F4AE95";
  const CABELO = "#8A5433";
  const BLUSA = "#5B93D3";
  const AZUL = "#4F86C6";
  const AZUL_ESCURO = "#24395C";
  const AMARELO = "#F5C451";

  const olho = (cx, cy) => [
    { d: circulo(cx, cy, 21), fill: "#3F7FCB" },
    { d: circulo(cx, cy, 21), stroke: "#2D5E9E", width: 3 },
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
      // fralda e blusa
      { d: "M140 318 C138 362 166 386 200 388 C234 386 262 362 260 318 Z", fill: "#FFFFFF", stroke: "#D6E3F1", width: 3 },
      { d: "M146 236 C134 270 132 308 138 340 C170 352 230 352 262 340 C268 308 266 270 254 236 C232 224 168 224 146 236 Z", fill: BLUSA },
      // pernas cruzadas e pezinhos
      { d: elipse(160, 378, 50, 24, 16), fill: PELE, stroke: "#F6C7AE", width: 3 },
      { d: elipse(240, 378, 50, 24, -16), fill: PELE, stroke: "#F6C7AE", width: 3 },
      { d: elipse(186, 393, 21, 14, 8), fill: "#FFD3BD", stroke: "#F3BBA0", width: 3 },
      { d: elipse(215, 393, 21, 14, -8), fill: "#FFD3BD", stroke: "#F3BBA0", width: 3 },
      { d: circulo(170, 386, 3.4), fill: "#F3BBA0" },
      { d: circulo(169, 394, 3), fill: "#F3BBA0" },
      { d: circulo(231, 386, 3.4), fill: "#F3BBA0" },
      { d: circulo(232, 394, 3), fill: "#F3BBA0" },
      // orelhas, cabeça e cabelo
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
      // rosto
      ...olho(164, 176),
      ...olho(236, 176),
      { d: elipse(138, 206, 18, 11), fill: "#FF8F8F", alpha: 0.45 },
      { d: elipse(262, 206, 18, 11), fill: "#FF8F8F", alpha: 0.45 },
      { d: elipse(200, 200, 7, 5), fill: PELE_FUNDA },
      { d: "M180 216 Q200 244 220 216 Q200 222 180 216 Z", fill: "#C24A5C" },
      { d: "M190 230 Q200 240 210 230 Q200 226 190 230 Z", fill: "#F28A98" },
    ],
  };

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

  function paraSvg(desenho, rotulo) {
    const partes = desenho.pecas.map((p) => {
      const a = [`d="${p.d}"`, `fill="${p.fill || "none"}"`];
      if (p.stroke) a.push(`stroke="${p.stroke}" stroke-width="${p.width}" stroke-linecap="round" stroke-linejoin="round"`);
      if (p.alpha != null) a.push(`opacity="${p.alpha}"`);
      return `<path ${a.join(" ")}/>`;
    });
    const acessivel = rotulo ? `role="img" aria-label="${rotulo}"` : 'aria-hidden="true"';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${desenho.largura} ${desenho.altura}" ${acessivel}>${partes.join("")}</svg>`;
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

  return { bebe, fralda, icones, paraSvg, desenhar, estrela };
})();
