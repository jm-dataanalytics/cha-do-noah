# Chá do Noah 💙

**Link:** https://jm-dataanalytics.github.io/cha-do-noah/

A pessoa coloca o nome e o WhatsApp e ganha 2 cartões em PNG:

1. **um recado do Noah só pra ela**: o site junta uma saudação, um começo, um meio e um final (mais de 11 mil combinações), sempre com o nome dela;
2. **o lembrete da fralda que ela vai levar**: tamanho, data (e horário e endereço, se estiverem preenchidos).

No celular, o botão "Salvar ou mandar os cartões" abre o compartilhar com as 2 imagens: WhatsApp, salvar na galeria e outros. Também tem o "Baixar" embaixo de cada cartão e o botão que manda o lembrete em texto pro WhatsApp da própria pessoa.

## Mudar alguma coisa

Tudo o que dá pra mudar fica em **`config.js`**: data, horário, endereço, quantos pacotes de cada tamanho e os recados.

## Como o tamanho é escolhido

Cada pacote da lista vira uma "vaga" (50 pacotes = 50 vagas), e o telefone da pessoa escolhe uma. Por isso os tamanhos saem na mesma proporção da lista (30% M, 30% G...), e a mesma pessoa sempre tira o mesmo tamanho, mesmo se preencher de novo.

O site não guarda quem já preencheu. Então a conta bate na média, mas não fica exata pacote por pacote.

## Privacidade

O nome e o telefone não vão pra servidor nenhum: os cartões são desenhados no próprio aparelho da pessoa. O site só lembra o nome dela, no navegador dela, pra ela não precisar digitar de novo.

## Arquivos

| Arquivo | O que é |
|---|---|
| `config.js` | textos, data e tamanhos (é o que se edita) |
| `index.html`, `estilo.css` | a página |
| `app.js` | formulário, sorteio da fralda e escolha do recado |
| `cartoes.js` | desenha os 2 cartões PNG (1080 x 1350) e a imagem do link |
| `desenhos.js` | o bebê, a fralda e os ícones, desenhados em código |
| `img/previa.png` | a imagem que aparece quando o link é mandado no WhatsApp |
