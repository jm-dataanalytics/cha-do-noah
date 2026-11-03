# Chá do Noah 💙

**Link:** https://jm-dataanalytics.github.io/cha-do-noah/

O Noah, ainda na barriguinha da mamãe, conversa com quem abre o link:

1. a pessoa coloca o nome e o WhatsApp, e o site já sabe se o Noah vai chamar de **titia** ou **titio** (dá pra trocar, e tem **vovó** e **vovô**);
2. escolhe uma fraldinha, ou toca em **"Deixo a mamãe escolher"**;
3. se quiser, marca que vai levar um **mimo**;
4. ganha 2 cartões em PNG:
   - **o recado do Noah**, só dela ("Oi, titia Ana!"), que é o principal;
   - **o lembrete**, mais discreto: a fralda, o mimo e a data.

O botão **"Mandar os cartões pro WhatsApp"** manda as 2 fotos (no celular, pelo compartilhar).

## A planilha (a memória do site)

Com a planilha do Google ligada (`CHA.planilha` no `config.js`):

- as **100 mensagens** nunca se repetem;
- as fraldas seguem a **proporção das 50**: o tamanho que completa fica apagado, e "a mamãe escolhe" pega o que mais está faltando;
- quando **as 50 completam**, o site para de pedir fralda: o Noah agradece, diz que a pessoa não precisa trazer nada, e ela ganha os cartões do mesmo jeito;
- a página **`pessoal.html`** (com senha) mostra quem preencheu, a contagem e as mensagens usadas, baixa **a lista em Excel** (pronta pra imprimir) e tem o botão **Limpar o pessoal**.

Sem a planilha, o site funciona sozinho, mas não conta as fraldas nem garante mensagem única.

## Mudar alguma coisa

Tudo fica em **`config.js`**: data, horário, endereço, fraldas, as falas do Noah, as 100 mensagens e os recadinhos do mimo.

## Arquivos

| Arquivo | O que é |
|---|---|
| `config.js` | textos, data, fraldas e mensagens (é o que se edita) |
| `index.html`, `estilo.css` | a página |
| `app.js` | formulário, titia/titio, fraldas, planilha e WhatsApp |
| `nomes.js` | adivinha titia ou titio pelo nome |
| `cartoes.js` | desenha os 2 cartões PNG (1080 x 1350) e a imagem do link |
| `desenhos.js` | o Noah, os bichinhos, a fralda, o presente e os ícones, desenhados em código |
| `pessoal.html`, `pessoal.js` | a página do pessoal (só pros pais) |
| `lista-excel.js` | a lista do pessoal em Excel (.xlsx), feita no navegador |
| `img/`, `manifest.webmanifest` | a imagem do link no WhatsApp e os ícones |
