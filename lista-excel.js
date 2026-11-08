// A lista do pessoal em Excel (.xlsx), pronta pra imprimir: feita no próprio navegador, com o ExcelJS
// (que só é baixado quando o jm toca no botão). Abas: Lista, Fraldas e, se teve, Sorteio.
const LISTA_EXCEL = (() => {
  const EXCELJS = {
    src: "https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js",
    integrity: "sha512-dlPw+ytv/6JyepmelABrgeYgHI0O+frEwgfnPdXDTOIZz+eDgfW07QXG02/O8COfivBdGNINy+Vex+lYmJ5rxw==",
  };
  const COR = { escuro: "FF24395C", azul: "FF4F86C6", texto: "FF3A4F72", suave: "FF5B6F8F", listra: "FFF3F8FD", borda: "FFD3E2F1", rosa: "FFC2577A" };
  const FONTE = "Calibri";
  const SEM_FRALDA = "—";

  let carregando = null;
  function carregar() {
    if (window.ExcelJS) return Promise.resolve();
    if (!carregando) {
      carregando = new Promise((ok, falha) => {
        const s = document.createElement("script");
        s.src = EXCELJS.src;
        s.integrity = EXCELJS.integrity;
        s.crossOrigin = "anonymous";
        s.onload = ok;
        s.onerror = () => {
          carregando = null;
          falha(new Error("não baixou o ExcelJS"));
        };
        document.head.append(s);
      });
    }
    return carregando;
  }

  const doisDigitos = (n) => String(n).padStart(2, "0");
  const dataCurta = (d) => `${doisDigitos(d.getDate())}/${doisDigitos(d.getMonth() + 1)}/${d.getFullYear()}`;
  const hora = (d) => `${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}`;
  // o Excel não tem fuso: o ExcelJS grava a hora em UTC, então a data vai "de mentirinha" na hora do Brasil
  const paraExcel = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  const comMaiuscula = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : "");

  function dataDoCha() {
    const [ano, mes, dia] = CHA.data.split("-").map(Number);
    const t = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(ano, mes - 1, dia));
    return comMaiuscula(t);
  }

  const borda = { style: "thin", color: { argb: COR.borda } };
  const bordas = { top: borda, left: borda, bottom: borda, right: borda };

  // título e subtítulo em cima de cada aba
  function titulo(aba, ultimaColuna, texto, subtitulo) {
    aba.mergeCells(`A1:${ultimaColuna}1`);
    aba.mergeCells(`A2:${ultimaColuna}2`);
    const t = aba.getCell("A1");
    t.value = texto;
    t.font = { name: FONTE, size: 18, bold: true, color: { argb: COR.escuro } };
    t.alignment = { vertical: "middle" };
    aba.getRow(1).height = 30;
    const s = aba.getCell("A2");
    s.value = subtitulo;
    s.font = { name: FONTE, size: 11, color: { argb: COR.suave } };
    aba.getRow(2).height = 18;
  }

  function cabecalho(linha) {
    linha.height = 24;
    linha.eachCell((c) => {
      c.font = { name: FONTE, size: 11, bold: true, color: { argb: "FFFFFFFF" } };
      c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COR.escuro } };
      c.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      c.border = bordas;
    });
  }

  // colunas: [cabeçalho, largura, alinhamento]
  function corpo(aba, primeira, quantas, colunas) {
    for (let i = 0; i < quantas; i++) {
      const linha = aba.getRow(primeira + i);
      linha.height = 22;
      colunas.forEach(([, , alinhar], j) => {
        const c = linha.getCell(j + 1);
        c.font = Object.assign({ name: FONTE, size: 11, color: { argb: COR.texto } }, c.font && c.font.bold ? { bold: true, color: { argb: COR.escuro } } : {});
        c.alignment = { vertical: "middle", horizontal: alinhar, shrinkToFit: alinhar === "left" };
        c.border = bordas;
        if (i % 2) c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COR.listra } };
      });
    }
  }

  function impressao(aba, deitada, repetir) {
    aba.pageSetup = {
      paperSize: 9, // A4
      orientation: deitada ? "landscape" : "portrait",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      horizontalCentered: true,
      margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.6, header: 0.25, footer: 0.3 },
      printTitlesRow: repetir,
    };
    aba.headerFooter = { oddFooter: `&L&9${CHA.titulo}&R&9Página &P de &N` };
  }

  // pessoal = a lista que a planilha devolve (na ordem em que preencheram); sorteio = os prêmios deste aparelho
  async function baixar({ pessoal, sorteio = [] }) {
    await carregar();
    const agora = new Date();
    const wb = new window.ExcelJS.Workbook();
    wb.creator = CHA.titulo;
    wb.created = agora;
    wb.calcProperties.fullCalcOnLoad = true;
    const visual = { showGridLines: false, state: "frozen", xSplit: 0, ySplit: 4, activeCell: "A5" };

    // ---------- Lista: quem vai, o que leva e uma coluna pra marcar quem chegou ----------
    const lista = wb.addWorksheet("Lista", { views: [visual] });
    const colunas = [
      ["Nº", 6, "center"],
      ["Nome", 32, "left"],
      ["O Noah chama de", 16, "center"],
      ["WhatsApp", 17, "center"],
      ["Fralda", 9, "center"],
      ["Quem escolheu", 15, "center"],
      ["Mimo", 8, "center"],
      ["Cartinha nº", 11, "center"],
      ["Preencheu em", 17, "center"],
      ["Chegou ✓", 11, "center"],
    ];
    colunas.forEach(([, largura], j) => (lista.getColumn(j + 1).width = largura));
    const n = pessoal.length;
    titulo(lista, "J", `${CHA.titulo} · a lista do pessoal`,
      `${dataDoCha()} · ${n} ${n === 1 ? "pessoa" : "pessoas"} · lista tirada em ${dataCurta(agora)}, às ${hora(agora)}`);
    lista.getRow(4).values = colunas.map(([c]) => c);
    cabecalho(lista.getRow(4));
    pessoal.forEach((p, i) => {
      const quando = new Date(p.quando);
      const linha = lista.getRow(5 + i);
      linha.values = [
        i + 1,
        p.nome,
        comMaiuscula(p.chamado),
        p.whatsapp,
        p.fralda || SEM_FRALDA,
        p.fralda || p.quemEscolheu === "pix" ? p.quemEscolheu : "lista completa",
        p.mimo ? "Sim" : "",
        p.mensagem || "",
        isNaN(quando) ? "" : paraExcel(quando),
        "",
      ];
      linha.getCell(5).font = { bold: true };
    });
    corpo(lista, 5, n, colunas);
    lista.getColumn(9).numFmt = "dd/mm/yyyy hh:mm";
    if (n) lista.autoFilter = { from: "A4", to: `J${4 + n}` };
    impressao(lista, true, "4:4");

    // ---------- Fraldas: a contagem (com fórmulas: se mudar algo na Lista, aqui acompanha) ----------
    const fraldas = wb.addWorksheet("Fraldas", { views: [Object.assign({}, visual, { ySplit: 0, state: "normal", activeCell: "A4" })] });
    [10, 18, 12, 12, 12].forEach((l, j) => (fraldas.getColumn(j + 1).width = l));
    titulo(fraldas, "E", "Fraldas", `${dataDoCha()} · contagem de ${dataCurta(agora)}, às ${hora(agora)}`);
    const colunasFraldas = [["Tamanho", 10, "center"], ["Nome", 18, "left"], ["Na lista", 12, "center"], ["Pedidas", 12, "center"], ["Faltam", 12, "center"]];
    fraldas.getRow(4).values = colunasFraldas.map(([c]) => c);
    cabecalho(fraldas.getRow(4));
    const pedidas = (t) => pessoal.filter((p) => p.fralda === t).length;
    CHA.fraldas.forEach((f, i) => {
      const r = 5 + i;
      const linha = fraldas.getRow(r);
      linha.values = [
        f.tamanho,
        f.nome,
        f.pacotes,
        { formula: `COUNTIF(Lista!$E:$E,A${r})`, result: pedidas(f.tamanho) },
        { formula: `MAX(0,C${r}-D${r})`, result: Math.max(0, f.pacotes - pedidas(f.tamanho)) },
      ];
      linha.getCell(1).font = { bold: true };
    });
    corpo(fraldas, 5, CHA.fraldas.length, colunasFraldas);
    const ultima = 4 + CHA.fraldas.length;
    const rTotal = ultima + 1;
    const soma = (col, valor) => ({ formula: `SUM(${col}5:${col}${ultima})`, result: valor });
    const naLista = CHA.fraldas.reduce((s, f) => s + f.pacotes, 0);
    const totalPedidas = CHA.fraldas.reduce((s, f) => s + pedidas(f.tamanho), 0);
    const totalFaltam = CHA.fraldas.reduce((s, f) => s + Math.max(0, f.pacotes - pedidas(f.tamanho)), 0);
    fraldas.getRow(rTotal).values = ["Total", "", soma("C", naLista), soma("D", totalPedidas), soma("E", totalFaltam)];
    fraldas.getRow(rTotal).height = 24;
    fraldas.getRow(rTotal).eachCell({ includeEmpty: true }, (c, j) => {
      if (j > 5) return;
      c.font = { name: FONTE, size: 11, bold: true, color: { argb: COR.escuro } };
      c.alignment = { vertical: "middle", horizontal: j === 2 ? "left" : "center" };
      c.border = { top: { style: "medium", color: { argb: COR.escuro } }, bottom: borda, left: borda, right: borda };
    });
    const extras = [
      ["Pessoas na lista", { formula: "COUNT(Lista!$A:$A)", result: n }],
      ["Vão levar mimo", { formula: 'COUNTIF(Lista!$G:$G,"Sim")', result: pessoal.filter((p) => p.mimo).length }],
      ["Vão mandar pix (no lugar da fralda)", { formula: 'COUNTIF(Lista!$F:$F,"pix")', result: pessoal.filter((p) => p.quemEscolheu === "pix").length }],
      ["Sem fralda (lista já completa)", { formula: 'COUNTIF(Lista!$F:$F,"lista completa")', result: pessoal.filter((p) => !p.fralda && p.quemEscolheu !== "pix").length }],
    ];
    extras.forEach(([rotulo, valor], i) => {
      const r = rTotal + 2 + i;
      fraldas.mergeCells(`A${r}:C${r}`);
      const a = fraldas.getCell(`A${r}`);
      a.value = rotulo;
      a.font = { name: FONTE, size: 11, color: { argb: COR.texto } };
      a.alignment = { vertical: "middle" };
      const v = fraldas.getCell(`D${r}`);
      v.value = valor;
      v.font = { name: FONTE, size: 11, bold: true, color: { argb: COR.escuro } };
      v.alignment = { vertical: "middle", horizontal: "center" };
      fraldas.getRow(r).height = 20;
    });
    impressao(fraldas, false, "4:4");

    // ---------- Sorteio: o que foi sorteado e quem ganhou (o que ficou guardado neste aparelho) ----------
    if (sorteio.length) {
      const aba = wb.addWorksheet("Sorteio", { views: [visual] });
      const colunasSorteio = [["Ordem", 8, "center"], ["O que foi sorteado", 30, "left"], ["Nº", 6, "center"], ["Quem ganhou", 32, "left"], ["Quando", 17, "center"]];
      colunasSorteio.forEach(([, largura], j) => (aba.getColumn(j + 1).width = largura));
      titulo(aba, "E", "Sorteio", `${dataDoCha()} · ${sorteio.length} ${sorteio.length === 1 ? "prêmio" : "prêmios"}`);
      aba.getRow(4).values = colunasSorteio.map(([c]) => c);
      cabecalho(aba.getRow(4));
      sorteio.forEach((s, i) => {
        const quando = new Date(s.quando);
        aba.getRow(5 + i).values = [i + 1, s.premio || "(sem nome)", s.numero, s.nome, isNaN(quando) ? "" : paraExcel(quando)];
      });
      corpo(aba, 5, sorteio.length, colunasSorteio);
      aba.getColumn(5).numFmt = "dd/mm/yyyy hh:mm";
      impressao(aba, false, "4:4");
    }

    const buffer = await wb.xlsx.writeBuffer();
    const arquivo = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const nome = `${CHA.titulo} - lista ${agora.getFullYear()}-${doisDigitos(agora.getMonth() + 1)}-${doisDigitos(agora.getDate())} ${doisDigitos(agora.getHours())}h${doisDigitos(agora.getMinutes())}.xlsx`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(arquivo);
    link.download = nome;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 60000);
    return nome;
  }

  return { baixar };
})();
