---
title: "Aula 02 — Comutação: a tabela MAC e os domínios"
disciplina: Redes de Computadores II
codigo: "49309"
aula: 2
tipo: teorica
turma: T (P11 + P12)
semana: 2
date: 2026-08-04
tags: [redes2, 2026-2, comutacao, tabela-mac, dominio-de-broadcast]
---

<div class="au-leitura" data-aula="s02">

# 🟢 Aula 02 — Comutação: a tabela MAC e os domínios

**Disciplina:** 49309 — Redes de Computadores II — Uniube<br>
**Professor:** Romualdo Mathias Filho · **romualdo.filho@uniube.br**<br>
**Semana:** 2 · Terça, 04/08/2026 · **VIA203** · 📘 Teórica (75 min)<br>
**Práticas da semana:** P11 segunda, 03/08 · VIA215 — P12 quinta, 06/08 · VIA216<br>
**Página de referência:** [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato)

---

<div class="au-caminho">
<b>Nosso caminho até aqui</b>

Responda **antes** de abrir. As três perguntas são do Lab 0, e as três respostas são usadas hoje — se você errar uma, acabou de descobrir o que prestar atenção nos próximos 70 minutos.

<details>
<summary>Você pinga o PC ao lado e funciona. O que o switch entre vocês fez?</summary>

Ele **encaminhou o quadro nas duas direções** — e ninguém configurou nada nele para isso. Você tirou o switch da caixa, ligou os cabos, e ele já sabia por qual porta mandar cada coisa.

Repare no tamanho dessa afirmação. O roteador do Lab 0 precisou de endereço em cada interface, digitado por alguém. O switch não precisou de nada.

**A pergunta de hoje é como.** Ele não adivinha e não pergunta a ninguém: ele observa. O Tópico 1 mostra o mecanismo inteiro, em dois quadros.

</details>

<details>
<summary>No Lab 0, o primeiro <code>ping</code> quase sempre dava <code>Request timed out</code>. Por quê?</summary>

**ARP.** Antes de enviar o primeiro pacote, o host precisa descobrir o endereço MAC correspondente ao IP de destino — e o pedido do ARP é enviado em **broadcast**, para todo mundo. O primeiro pacote do `ping` morre esperando essa resposta.

Naquele dia isso era só um ruído a ignorar na leitura do resultado. Hoje ele vira conteúdo.

**Por que importa agora:** esse broadcast do ARP é o primeiro quadro que a maioria das estações transmite. É ele que enche a tabela do switch. Sem ARP, a tabela nasceria e ficaria vazia.

</details>

<details>
<summary>No diagnóstico de terça: 40 hosts num switch só, e o broadcast de qualquer máquina chega a todas as outras. Trocar por um switch melhor resolve?</summary>

**Não** — e essa foi a questão que mais dividiu a sala.

Um switch melhor comuta mais rápido, tem mais portas e mais memória. Nada disso muda a regra: **encaminhar broadcast é o que um switch faz**, por definição, e não um defeito que um modelo superior corrige.

O Tópico 3 fecha essa conta. E a resposta — segmentar — é a aula da semana que vem.

</details>
</div>

> [!INFO] 🎯 Visão geral e recursos
> No Lab 0 você consertou uma rede inteira sem nunca perguntar como o switch decidia para onde mandar cada quadro. Não precisou: ele acertou sozinho, o tempo todo. Hoje você abre essa caixa.
>
> **O que você leva desta aula**
> - Como a tabela MAC se preenche — e por que ela é **estado aprendido**, não configuração.
> - O que o switch faz quando **não sabe** onde está o destino, e por que isso parece broadcast sem ser.
> - A diferença entre **domínio de colisão** e **domínio de broadcast**, e qual dos dois o switch corta.
> - O motivo técnico de a segmentação existir — que é a aula da S03.
>
> **📂 Recursos**
> - [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato) — calendário das três turmas, notas, prazos e regras
> - [Aula 01 — Lab 0: Resgate](./Aula-01---Lab-0-Resgate-(Pratica)) — o método de diagnóstico que continua valendo
> - **Packet Tracer** já instalado, na sua máquina — usamos nos últimos 15 minutos
> - Meia folha de papel — bilhete de saída, anônimo, recolhido na porta

### ⏱️ Os 75 minutos de hoje

| Min | Bloco | Onde está nesta página |
| :-- | :--- | :--- |
| 0–5 | Entrada, chamada e projetor | — |
| 5–12 | **Nosso caminho até aqui** — 3 perguntas do Lab 0 | bloco de abertura |
| 12–26 | **Como o switch aprende** — exemplo resolvido no projetor | Tópico 1 |
| 26–38 | **O que ele faz quando não sabe** | Tópico 2 |
| 38–50 | **Colisão e broadcast** — o que o switch corta | Tópico 3 |
| 50–65 | **Mão na massa** — ler a tabela MAC no Packet Tracer | Prática |
| 65–70 | Resumo, reflexão e bilhete de saída | Fechamento |
| **70–75** | Folga — máquina que não liga, dúvida longa | — |

<aside class="au-antes">
<b class="au-nota-t">Antes de começar</b>

**Quadro** — o pacote de dados como ele trafega na camada de enlace, com endereço MAC de origem e de destino. O switch trabalha nele; o roteador trabalha no que vai dentro.

**Tabela MAC** — a lista que o switch mantém na memória ligando cada endereço MAC à porta em que ele foi visto. Também chamada de tabela de comutação.

**Inundação** — quando o switch replica um quadro em todas as portas, menos naquela por onde ele entrou. Em inglês aparece como `flooding`.

**Domínio de colisão** — o conjunto de equipamentos que disputam o mesmo meio para transmitir.

**Domínio de broadcast** — o conjunto de portas que recebe um quadro de broadcast. Guarde este: é o conceito que organiza as próximas quatro semanas.

</aside>

---

## 📌 1. O switch aprende sozinho [Exemplo resolvido ⏳ 14 min]

Eu resolvo este inteiro no projetor, narrando cada passo. Não é para você decorar o resultado: é para você conseguir refazer a sequência sozinho, com outros endereços.

O cenário é o mínimo possível. Um switch **recém-ligado**, tabela vazia, e duas estações: PC-A na `Fa0/1`, PC-B na `Fa0/2`.

### 1.1 A sequência, quadro a quadro

| Passo | O que acontece | O que a tabela ganha |
| :-: | :--- | :--- |
| **1** | Um quadro de A chega na porta `Fa0/1` | o switch lê o **MAC de origem** e grava `PC-A ↔ Fa0/1` |
| **2** | Ele procura o **MAC de destino** (PC-B) na tabela | nada — PC-B ainda não está lá |
| **3** | Sem saber onde B está, ele **inunda** o quadro | nada |
| **4** | B responde; a resposta entra pela `Fa0/2` | grava `PC-B ↔ Fa0/2` |
| **5** | O próximo quadro de A para B | sai **só** pela `Fa0/2` |

O switch aprendeu duas coisas em dois quadros, e não perguntou nada a ninguém.

<figure class="au-fig">
<svg viewBox="0 0 660 320" role="img" aria-label="Switch SW-ACESSO-01 com tres PCs conectados nas portas Fa0/1, Fa0/2 e Fa0/3. A tabela MAC abaixo mostra apenas duas entradas, dos PCs 1 e 2, porque o PC-3 nunca transmitiu">
<rect x="250" y="16" width="170" height="34" rx="6" fill="none" stroke="#00aa9f" stroke-width="2.5"></rect>
<text x="335" y="38" text-anchor="middle" font-size="13" style="fill:#00aa9f" font-family="monospace" font-weight="bold">SW-ACESSO-01</text>
<line x1="290" y1="50" x2="90" y2="104" stroke="#2778c4" stroke-width="2"></line>
<text x="196" y="70" font-size="10" style="fill:#8a8f98" font-family="monospace">Fa0/1</text>
<line x1="335" y1="50" x2="335" y2="104" stroke="#2778c4" stroke-width="2"></line>
<text x="343" y="80" font-size="10" style="fill:#8a8f98" font-family="monospace">Fa0/2</text>
<line x1="380" y1="50" x2="575" y2="104" stroke="#8a8f98" stroke-width="2" stroke-dasharray="5 4"></line>
<text x="470" y="70" font-size="10" style="fill:#8a8f98" font-family="monospace">Fa0/3</text>
<rect x="25" y="104" width="130" height="30" rx="5" fill="none" stroke="#2778c4" stroke-width="2"></rect>
<text x="90" y="124" text-anchor="middle" font-size="12" style="fill:#2778c4" font-family="monospace">PC-1 · falou</text>
<rect x="270" y="104" width="130" height="30" rx="5" fill="none" stroke="#2778c4" stroke-width="2"></rect>
<text x="335" y="124" text-anchor="middle" font-size="12" style="fill:#2778c4" font-family="monospace">PC-2 · falou</text>
<rect x="510" y="104" width="130" height="30" rx="5" fill="none" stroke="#8a8f98" stroke-width="2" stroke-dasharray="5 4"></rect>
<text x="575" y="124" text-anchor="middle" font-size="12" style="fill:#8a8f98" font-family="monospace">PC-3 · só ouviu</text>
<line x1="40" y1="176" x2="620" y2="176" stroke="#8a8f98" stroke-width="1"></line>
<text x="40" y="170" font-size="11" style="fill:#8a8f98" font-family="monospace">MAC APRENDIDO</text>
<text x="330" y="170" font-size="11" style="fill:#8a8f98" font-family="monospace">PORTA</text>
<text x="500" y="170" font-size="11" style="fill:#8a8f98" font-family="monospace">COMO</text>
<text x="40" y="204" font-size="12" style="fill:#2778c4" font-family="monospace">0001.6440.a1b2</text>
<text x="330" y="204" font-size="12" style="fill:#2778c4" font-family="monospace">Fa0/1</text>
<text x="500" y="204" font-size="12" style="fill:#8a8f98" font-family="monospace">foi origem</text>
<text x="40" y="232" font-size="12" style="fill:#2778c4" font-family="monospace">000a.f3c1.7d09</text>
<text x="330" y="232" font-size="12" style="fill:#2778c4" font-family="monospace">Fa0/2</text>
<text x="500" y="232" font-size="12" style="fill:#8a8f98" font-family="monospace">foi origem</text>
<line x1="40" y1="248" x2="620" y2="248" stroke="#8a8f98" stroke-width="1" stroke-dasharray="4 4"></line>
<text x="40" y="276" font-size="12" style="fill:#8a8f98" font-family="monospace">(PC-3)</text>
<text x="330" y="276" font-size="12" style="fill:#8a8f98" font-family="monospace">—</text>
<text x="500" y="276" font-size="12" style="fill:#8a8f98" font-family="monospace">nunca transmitiu</text>
<text x="40" y="304" font-size="11" style="fill:#d9702a" font-family="monospace">o switch só aprende de quem fala, nunca de quem escuta</text>
</svg>
<figcaption class="au-legenda">Duas entradas para três estações ligadas. O PC-3 recebeu a inundação do passo 3 e ficou quieto — e o que o switch nunca vê como <b>origem</b>, ele nunca aprende. A tabela não é a lista de quem está conectado: é a lista de quem falou.</figcaption>
</figure>

### 1.2 O comando que mostra a tabela

<div class="au-term">
<div class="au-term-h"><b>SW-ACESSO-01</b> <span>· depois do primeiro ping</span></div>
<div class="au-term-b"><span class="cm">! quem esta na tabela, e por qual porta</span>
<span class="ps">SW-ACESSO-01#</span> <span class="kw">show mac address-table</span>
          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
<span class="mark">   1    0001.6440.a1b2    DYNAMIC     Fa0/1</span>
   1    000a.f3c1.7d09    DYNAMIC     Fa0/2
<span class="cm">!</span>
<span class="cm">! o PC-3 esta ligado, com cabo bom, e nao aparece.</span></div>
</div>

A linha marcada diz três coisas de uma vez: qual endereço, em qual porta, e — em `DYNAMIC` — que **ninguém digitou aquilo**. O switch aprendeu.

> [!WARNING] ⚠️ Gotcha — origem, nunca destino
> O switch aprende lendo o endereço de **origem** do quadro. Nunca o de destino.
>
> É o erro mais comum desta aula, e ele não fica parado: quem acredita que o switch "procura" o host vai errar de novo em VLAN, na S03, e em roteamento entre VLANs, na S05. A tabela não é uma busca. É um registro do que já passou.

> [!NOTE] 💼 Pergunta de entrevista
> *"Por que a tabela MAC de um switch de acesso costuma estar vazia às 8h da manhã, com o equipamento ligado a noite inteira?"*
>
> **Resposta esperada:** porque entrada dinâmica **expira por inatividade** — no IOS, 300 segundos por padrão. Com as estações desligadas, ninguém transmite, e a tabela se esvazia sozinha. Não é defeito: é a diferença entre **configuração**, que persiste, e **estado aprendido**, que tem prazo de validade.

---

## 📌 2. O que ele faz quando não sabe [Conceito ⏳ 12 min]

O switch toma exatamente quatro decisões, e duas delas produzem o mesmo efeito visível de fora. É aí que o diagnóstico costuma escorregar.

| MAC de destino do quadro | O que o switch faz | Nome |
| :--- | :--- | :--- |
| **está** na tabela, numa porta diferente da de entrada | manda só por aquela porta | encaminhamento |
| **está** na tabela, na **mesma** porta de entrada | descarta | filtragem |
| **não está** na tabela | replica em todas as portas do domínio, menos a de entrada | **inundação** |
| é `FFFF.FFFF.FFFF` | replica em todas as portas, menos a de entrada | **broadcast** |

<details class="au-aposta">
<summary>Aposte antes de ver: PC-A pinga PC-B pela primeira vez, mesmo switch, tabela vazia. Quantas portas veem esse primeiro quadro?</summary>

**Todas** — e por dois motivos empilhados, não um.

O primeiro quadro nem é o `ping`. É o **pedido do ARP**, que sai em broadcast porque o PC-A ainda não conhece o MAC do PC-B. Broadcast vai para todo mundo, por definição.

A **resposta** do ARP já é diferente. Ela é unicast, vem do PC-B, e quando chega ao switch ele já aprendeu as duas pontas: a origem A no quadro anterior, e agora a origem B. Então ela sai por uma porta só.

**O que isso te dá:** a rede "abre o leque" no começo de cada conversa e fecha logo depois. Se ela **continua** aberta, alguma coisa está impedindo o switch de aprender — e aí você tem um problema de verdade para investigar.

</details>

> [!WARNING] ⚠️ Gotcha — inundação não é broadcast
> Os dois enchem todas as portas. As causas não têm nada a ver uma com a outra.
>
> No **broadcast**, o quadro é endereçado a todos: replicar é o comportamento correto. Na **inundação**, o quadro tem um destino único e o switch é que não sabe onde ele está.
>
> Trocar um pelo outro no diagnóstico custa caro: você vai caçar loop de camada 2 — assunto da S06 — quando o problema era uma tabela que não conseguiu aprender.

> [!TIP] 💡 Dica de produção
> Inundação constante numa rede estável é sintoma, não normalidade. Vale investigar quando o tráfego de retorno some da tabela antes de a conversa terminar.
>
> A pista prática: se o `show mac address-table` de um switch de acesso movimentado mostra pouquíssimas entradas dinâmicas, ele está inundando muito mais do que deveria — e todas as portas estão pagando essa conta.

---

## 📌 3. Colisão e broadcast: o que o switch corta [Conceito ⏳ 12 min]

Os dois nomes têm "domínio" e a semelhança para aí. Um deles é sobre **disputar o meio** para conseguir transmitir; o outro é sobre **receber o que não é seu**. Confundir os dois é o que faz alguém comprar equipamento para resolver um problema de topologia.

| | Domínio de colisão | Domínio de broadcast |
| :--- | :--- | :--- |
| **O que reúne** | quem disputa o mesmo meio para transmitir | quem recebe um quadro de broadcast |
| **Num hub** | o hub inteiro é **um só** | o hub inteiro é um só |
| **Num switch** | **cada porta é um domínio** | o switch inteiro é **um só** |
| **Quem corta** | o switch — e em full-duplex a disputa deixa de existir | o roteador, ou a **VLAN** (S03) |

A linha que importa é a última da coluna da direita. **O switch resolveu completamente um dos dois problemas e não encostou no outro.**

<figure class="au-fig">
<svg viewBox="0 0 660 250" role="img" aria-label="Um switch sem VLAN com quatro PCs. Cada enlace switch-PC esta cercado por um contorno tracejado, indicando quatro dominios de colisao separados. Um contorno continuo envolve tudo, indicando um unico dominio de broadcast">
<rect x="12" y="16" width="636" height="214" rx="10" fill="none" stroke="#00aa9f" stroke-width="2.5"></rect>
<text x="26" y="222" font-size="12" style="fill:#00aa9f" font-family="monospace" font-weight="bold">1 domínio de broadcast — contorno contínuo</text>
<rect x="60" y="32" width="540" height="34" rx="6" fill="none" stroke="#8a8f98" stroke-width="2"></rect>
<text x="330" y="54" text-anchor="middle" font-size="13" style="fill:#8a8f98" font-family="monospace" font-weight="bold">SW-ACESSO-01 · sem VLAN</text>
<rect x="28" y="74" width="124" height="112" rx="8" fill="none" stroke="#d9702a" stroke-width="2" stroke-dasharray="5 4"></rect>
<line x1="90" y1="66" x2="90" y2="110" stroke="#8a8f98" stroke-width="2"></line>
<rect x="38" y="110" width="104" height="28" rx="5" fill="none" stroke="#2778c4" stroke-width="2"></rect>
<text x="90" y="129" text-anchor="middle" font-size="12" style="fill:#2778c4" font-family="monospace">PC-1</text>
<text x="90" y="172" text-anchor="middle" font-size="11" style="fill:#d9702a" font-family="monospace">colisão</text>
<rect x="188" y="74" width="124" height="112" rx="8" fill="none" stroke="#d9702a" stroke-width="2" stroke-dasharray="5 4"></rect>
<line x1="250" y1="66" x2="250" y2="110" stroke="#8a8f98" stroke-width="2"></line>
<rect x="198" y="110" width="104" height="28" rx="5" fill="none" stroke="#2778c4" stroke-width="2"></rect>
<text x="250" y="129" text-anchor="middle" font-size="12" style="fill:#2778c4" font-family="monospace">PC-2</text>
<text x="250" y="172" text-anchor="middle" font-size="11" style="fill:#d9702a" font-family="monospace">colisão</text>
<rect x="348" y="74" width="124" height="112" rx="8" fill="none" stroke="#d9702a" stroke-width="2" stroke-dasharray="5 4"></rect>
<line x1="410" y1="66" x2="410" y2="110" stroke="#8a8f98" stroke-width="2"></line>
<rect x="358" y="110" width="104" height="28" rx="5" fill="none" stroke="#2778c4" stroke-width="2"></rect>
<text x="410" y="129" text-anchor="middle" font-size="12" style="fill:#2778c4" font-family="monospace">PC-3</text>
<text x="410" y="172" text-anchor="middle" font-size="11" style="fill:#d9702a" font-family="monospace">colisão</text>
<rect x="508" y="74" width="124" height="112" rx="8" fill="none" stroke="#d9702a" stroke-width="2" stroke-dasharray="5 4"></rect>
<line x1="570" y1="66" x2="570" y2="110" stroke="#8a8f98" stroke-width="2"></line>
<rect x="518" y="110" width="104" height="28" rx="5" fill="none" stroke="#2778c4" stroke-width="2"></rect>
<text x="570" y="129" text-anchor="middle" font-size="12" style="fill:#2778c4" font-family="monospace">PC-4</text>
<text x="570" y="172" text-anchor="middle" font-size="11" style="fill:#d9702a" font-family="monospace">colisão</text>
</svg>
<figcaption class="au-legenda">Quatro contornos <b>tracejados</b>, um por enlace: o switch criou quatro domínios de colisão onde um hub teria um só. O contorno <b>contínuo</b> em volta de tudo é o domínio de broadcast — e ele continua sendo <b>um</b>, por mais portas que o equipamento tenha. Comprar um switch maior desenha mais tracejados e não mexe no contínuo.</figcaption>
</figure>

<div class="au-slot">
<div class="au-slot-h"><b>Interativo</b> · Plickers · 3 min</div>
<div class="au-slot-c">

**Levante o cartão.** Duas perguntas, sem nota, respondidas com os cartões impressos — ninguém precisa de celular.

1. Um switch de 48 portas, com 30 estações ligadas e sem VLAN, tem quantos domínios de colisão e quantos de broadcast?
2. Se eu ligar um segundo switch neste, por um cabo, o número de domínios de **broadcast** aumenta?

Na pergunta em que a sala se dividir, vocês discutem em dupla por um minuto e votam de novo. A segunda votação é a que interessa.

</div>
<p class="au-slot-b"><b>Plano B:</b> se o escaneamento dos cartões falhar em VIA203, as mesmas duas perguntas vão na votação por dedos — 1 a 5, levantados ao mesmo tempo, no três. Mesma pergunta, mesmo tempo, mesma discussão em dupla.</p>
</div>

> [!NOTE] 💼 Pergunta de entrevista
> *"Um switch gerenciável de 48 portas, sem nenhuma VLAN configurada: quantos domínios de colisão e quantos de broadcast?"*
>
> **Resposta esperada:** um domínio de colisão por porta ativa, e **um** domínio de broadcast para o equipamento inteiro. Candidato que responde "48 e 48" está confundindo os dois conceitos; quem responde "1 e 1" ainda está pensando em hub. A resposta certa é a única que mostra que a pessoa sabe **o que o switch resolveu e o que ele deixou de pé**.

> [!TIP] 💡 Dica de produção
> Num enlace moderno entre switch e estação, em full-duplex, o domínio de colisão tem dois participantes e nenhuma disputa: cada lado transmite quando quer, por pares diferentes do cabo. A colisão simplesmente não acontece.
>
> Isso não torna o conceito obsoleto — torna-o **histórico**, e vale saber por quê. É exatamente o que a leitura recomendada no fim desta página mostra: o problema que o switch eliminou era tão sério que o Ethernet nasceu construído em volta dele.

---

<div class="au-pratica">
<b>Mão na massa — 15 min, em duplas</b>

Agora você faz o Tópico 1 acontecer na sua tela. Monte do zero: é rápido, e montar faz parte.

1. No Packet Tracer, ponha **um switch 2960** e **três PCs**. Ligue PC-1 na `Fa0/1`, PC-2 na `Fa0/2` e PC-3 na `Fa0/3`, com cabo de cobre direto.
2. Endereços: `192.168.1.11`, `192.168.1.12` e `192.168.1.13`, todos com máscara `255.255.255.0`. Sem gateway — hoje ninguém sai da rede.
3. No switch, aba `CLI`, entre em modo privilegiado com `enable` e rode `show mac address-table`. **Anote quantas entradas dinâmicas aparecem.**
4. Do PC-1, `ping 192.168.1.12`. Espere terminar.
5. Rode `show mac address-table` de novo. **Quantas entradas agora, e de quais estações?**
6. **A pergunta que vale a aula:** o PC-3 está ligado, com cabo bom, na mesma rede. Ele apareceu? Por quê?
7. Agora, do PC-2, `ping 192.168.1.13`. Rode o comando mais uma vez e confira o que mudou.

<p class="au-pronto"><b>Critério de pronto:</b> depois do passo 5 a tabela mostra <b>duas</b> entradas dinâmicas — PC-1 e PC-2 — e o PC-3 <b>não</b> está lá; depois do passo 7 ele aparece. E você consegue dizer, em voz alta para a sua dupla, <b>o que mudou para o PC-3 entre um momento e outro</b>. A resposta tem quatro palavras: ele passou a transmitir.</p>
</div>

> [!IMPORTANT] 📌 O laboratório desta semana
> A prática acontece **segunda 03/08 (P11)** e **quinta 06/08 (P12)**. As duas turmas se encontram nesta semana, então o laboratório vale ponto e é **o mesmo para todo mundo** — é a regra que impede que os feriados de segunda deixem a P11 para trás.
>
> **A régua é a de sempre:** 1 ponto da Atividade N1, apurado por **80% de acerto** na tela, durante a aula. São seis laboratórios valendo no semestre e contam os **cinco melhores**.
>
> **O cenário é avisado no AVA** antes da sua prática. Chegue com o Packet Tracer já instalado — não existe bloco de instalação nesta semana.

---

<div class="au-resumo">
<b>Resumo da aula</b>

| Item | O que você precisa lembrar |
| :--- | :--- |
| **Como o switch aprende** | Lendo o **MAC de origem** de cada quadro que chega, e gravando o par endereço ↔ porta. Nunca pelo destino. |
| **O que a tabela é** | **Estado aprendido**, não configuração. Ninguém digita, e ela expira sozinha. |
| **Envelhecimento** | Entrada dinâmica expira por inatividade — no IOS, **300 s** por padrão. Tabela vazia de manhã não é defeito. |
| **Quem entra na tabela** | Só quem **transmitiu**. Estação ligada que nunca falou não aparece. |
| **Encaminhamento** | Destino na tabela, porta diferente da de entrada: manda só por aquela porta. |
| **Filtragem** | Destino na tabela, na **mesma** porta de entrada: descarta. |
| **Inundação** | Destino **não** está na tabela: replica em todas as portas, menos a de entrada. |
| **Broadcast** | Destino `FFFF.FFFF.FFFF`: replica em todas as portas, menos a de entrada. |
| **Inundação ≠ broadcast** | Mesmo efeito visível, causas diferentes. Confundir manda você caçar loop onde havia tabela vazia. |
| **Domínio de colisão** | Quem disputa o mesmo meio. No switch, **um por porta**; em full-duplex, sem disputa. |
| **Domínio de broadcast** | Quem recebe o broadcast. Um switch sem VLAN é **um domínio só**. |
| **O que o switch corta** | Colisão, completamente. Broadcast, **nada**. |
| **Quem corta broadcast** | O roteador — ou a VLAN, que é a próxima aula. |
| **Comando do dia** | `show mac address-table` — endereço, porta e o tipo `DYNAMIC`, que denuncia o aprendizado. |
| **Por que trocar o switch não resolve** | Encaminhar broadcast é comportamento definido, não limitação de capacidade. |

</div>

<div class="au-reflexao">
<b>Para pensar até a próxima aula</b>

<p>O switch aprende olhando o endereço de origem do quadro. Ele confia no que leu — <b>não confere se é verdade</b>, porque não tem como: quem escreve o campo de origem é a própria estação que enviou.</p>

<p>Hoje isso foi conveniente: a rede se organizou sozinha, sem ninguém configurar nada. Mas convém a quem?</p>

<p><b>O que impede uma estação de afirmar que é outra?</b> E se nada impede, o que muda na tabela do switch quando ela faz isso — e quem passa a receber o tráfego que não era dele?</p>
</div>

## ✍️ Questões estilo Enade

Três questões no formato da prova, para você testar sozinho. **As respostas não ficam nesta página** — elas voltam na correção em sala, que é quando elas ensinam alguma coisa.

### Questão 1

Três estações estão ligadas ao `SW-ACESSO-01`: PC-1 na `Fa0/1`, PC-2 na `Fa0/2` e PC-3 na `Fa0/3`. As três estão ligadas, na mesma sub-rede, e nenhuma VLAN foi criada. Logo após um `ping` bem-sucedido do PC-1 para o PC-2, o técnico executa:

```text
SW-ACESSO-01#show mac address-table
          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   1    0001.6440.a1b2    DYNAMIC     Fa0/1
   1    000a.f3c1.7d09    DYNAMIC     Fa0/2
```

O PC-3 está ligado e operante, mas não consta na tabela. Assinale a alternativa que explica corretamente a ausência.

- **A)** O PC-3 está em outra VLAN e, por isso, não é aprendido pelo switch.
- **B)** O switch registra apenas endereços de estações que transmitiram um quadro; o PC-3 recebeu a inundação do ARP, mas não respondeu, então nunca foi origem de nada.
- **C)** A porta `Fa0/3` está administrativamente desativada.
- **D)** O switch aprende pelo endereço de destino dos quadros, e o PC-3 nunca foi destino.
- **E)** A tabela armazena no máximo duas entradas dinâmicas por VLAN.

### Questão 2

Uma rede tem esta topologia:

```text
                    ┌──────────────┐
                    │   ROTEADOR   │
                    └──┬────────┬──┘
                  G0/0 │        │ G0/1
              ┌────────┴──┐  ┌──┴────────┐
              │  SWITCH   │  │    HUB    │
              │ 8 portas  │  │ 4 portas  │
              └─┬─┬─┬─┬───┘  └─┬──┬──┬───┘
                │ │ │ │        │  │  │
              PC1 ... PC4     PC5 PC6 PC7
```

O switch usa 5 das 8 portas — quatro estações e o enlace ao roteador — todas em full-duplex. O hub usa as 4 portas: três estações e o enlace ao roteador. Nenhuma VLAN foi configurada.

Quantos domínios de colisão e quantos domínios de broadcast existem nessa rede?

- **A)** 6 domínios de colisão e 2 domínios de broadcast.
- **B)** 2 domínios de colisão e 2 domínios de broadcast.
- **C)** 8 domínios de colisão e 1 domínio de broadcast.
- **D)** 6 domínios de colisão e 1 domínio de broadcast.
- **E)** 1 domínio de colisão e 2 domínios de broadcast.

### Questão 3

Uma empresa tem 60 estações distribuídas em dois switches gerenciáveis, sem nenhuma segmentação. Os usuários reclamam de lentidão nos horários de pico. A medição aponta volume elevado de tráfego de broadcast. O fornecedor propõe substituir os dois equipamentos por um único modelo de maior capacidade de comutação.

Avalie a proposta do fornecedor.

- **A)** Resolve: switches de maior capacidade filtram broadcast por padrão.
- **B)** Resolve: o gargalo está na matriz de comutação, que o modelo superior elimina.
- **C)** Não resolve: encaminhar broadcast é comportamento definido do switch e independe da capacidade do equipamento; reduzir o domínio exige segmentação por VLAN ou um roteador entre os segmentos.
- **D)** Não resolve: apenas a migração do cabeamento para fibra reduziria o broadcast.
- **E)** Resolve parcialmente: o volume de broadcast cai pela metade a cada switch acrescentado.

### 🔬 Para ir além

METCALFE, R. M.; BOGGS, D. R. Ethernet: distributed packet switching for local computer networks. **Communications of the ACM**, v. 19, n. 7, p. 395–404, 1976. DOI: [10.1145/360248.360253](https://doi.org/10.1145/360248.360253)

**Por que ler:** é o artigo em que o domínio de colisão foi inventado — a rede em que todas as estações disputavam literalmente o mesmo cabo. Ler os autores descrevendo o problema deixa claro que o switch não "melhorou" o Ethernet: ele eliminou a razão de o CSMA/CD ter existido.

<div class="au-refs">
<b>Referências desta aula</b>

**Bibliografia da disciplina** — biblioteca virtual da Uniube:

- KUROSE, J. F.; ROSS, K. W. **Redes de computadores e a internet: uma abordagem top-down.** 8. ed. São Paulo: Pearson, 2021. <span class="au-pag">cap. 6, seç. 6.4.3 — comutadores de camada de enlace: filtragem, encaminhamento e autoaprendizagem</span>
- CISCO NETWORKING ACADEMY. **CCNA: Switching, Routing, and Wireless Essentials (SRWE).** Cisco Systems, 2026. Disponível em: https://www.netacad.com/. <span class="au-pag">módulo 2 — conceitos de comutação: encaminhamento de quadros, tabela de endereços MAC e domínios de colisão e broadcast</span>

**De onde vem o formato desta aula:**

- SWELLER, J.; AYRES, P.; KALYUGA, S. **Cognitive Load Theory.** New York: Springer, 2011. <span class="au-pag">cap. 8 — The worked example effect</span>

</div>

<div class="au-proxima">
<b>Na próxima aula</b>

<p>Hoje o switch inundou a rede inteira porque não sabia para onde mandar — e você viu que comprar um equipamento melhor não muda isso em nada. Na próxima aula você resolve o problema pelo outro lado: em vez de ensinar mais ao switch, você <b>corta o domínio em dois</b>, com uma linha de configuração. É a VLAN.</p>
</div>

---

*Última atualização: 30/07/2026 · Sujeito à confirmação institucional (ver aviso na aula teórica da S01).*

**◀ [Voltar ao índice da disciplina](./)**

</div>
