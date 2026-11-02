# Chá do Noah 💙

**Link:** https://jm-dataanalytics.github.io/cha-do-noah/

A pessoa coloca o nome e o WhatsApp, escolhe a fralda que vai levar (e, se quiser, marca que vai levar um mimo) e ganha 2 cartões em PNG:

1. **um recado do Noah só pra ela**, sempre com o nome dela;
2. **o lembrete do que ela vai levar**: o tamanho da fralda, o mimo (com um recadinho especial), a data e, se estiverem preenchidos, o horário e o endereço.

No celular, o botão "Salvar ou mandar os cartões" abre o compartilhar com as 2 imagens: WhatsApp, salvar na galeria e outros. Também tem o "Baixar" embaixo de cada cartão e o botão que manda o lembrete em texto pro WhatsApp da própria pessoa.

## Mudar alguma coisa

Tudo o que dá pra mudar fica em **`config.js`**: data, horário, endereço, tamanhos das fraldas, os recados e as mensagens do mimo.

## A fralda

A pessoa escolhe o tamanho. Os tamanhos de que a família mais precisa ganham o selinho "mais pedido".

Quem toca em "Tanto faz" recebe um tamanho sorteado na proporção da lista: 50 pacotes viram 50 "vagas", e o telefone da pessoa escolhe uma. A mesma pessoa sempre tira o mesmo tamanho.

## Privacidade

O nome e o telefone não vão pra servidor nenhum: os cartões são desenhados no próprio aparelho da pessoa. O site só lembra o que ela preencheu, no navegador dela, pra ela não precisar digitar de novo.

## Arquivos

| Arquivo | O que é |
|---|---|
| `config.js` | textos, data, tamanhos e mensagens (é o que se edita) |
| `index.html`, `estilo.css` | a página |
| `app.js` | formulário, escolha da fralda e do recado |
| `cartoes.js` | desenha os 2 cartões PNG (1080 x 1350) e a imagem do link |
| `desenhos.js` | o Noah, os bichinhos (ursinho, coelhinho, elefantinho), a fralda, o presente e os ícones, desenhados em código |
| `img/` | a imagem do link no WhatsApp (`previa.png`) e os ícones |
| `manifest.webmanifest` | o ícone de quando alguém salva o site na tela inicial do celular |
