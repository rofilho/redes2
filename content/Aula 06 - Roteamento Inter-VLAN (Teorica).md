---
title: "Aula 06 - Roteamento Inter-VLAN"
publicar: true
tags: [redes2, 2026-2, aula06, inter-vlan, router-on-a-stick, svi]
---

<div class="au-leitura" data-aula="s06">

# 🟢 Aula 06 — Roteamento inter-VLAN: as duas redes voltam a conversar, de propósito

**Disciplina:** 49309 — Redes de Computadores II — Uniube<br>
**Professor:** Romualdo Mathias Filho · **romualdo.filho@uniube.br**<br>
**Data:** Terça, 08/09/2026 · **VIA203** · 📘 Teórica (75 min)<br>
**Turmas práticas:** P11 segunda · VIA215 — P12 quinta · VIA216<br>
**Página de referência:** [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato)

---

<div class="au-caminho">
<b>Nosso caminho até aqui</b>

Nas duas aulas passadas você levantou uma parede e ensinou essa parede a atravessar um cabo. Hoje alguém bate na parede e pede passagem — e você vai abrir uma porta, sem derrubar nada.

Quatro perguntas de retomada. As três primeiras são de 25/08; a quarta é da Aula 02, e é a que mais vai te servir no meio de hoje. Responda **antes** de abrir.

<details>
<summary>Um quadro sai da porta de acesso do FIN-1, atravessa o tronco e chega ao FIN-2. Em que ponto do percurso ele tem a etiqueta 802.1Q?</summary>

**Só dentro do tronco.** O switch de saída **insere** os quatro bytes ao encaminhar pelo tronco; o de entrada os **remove** antes de entregar na porta de acesso. A estação nunca vê etiqueta.

Guarde a forma disso, porque hoje vai acontecer de novo com outro equipamento no meio: **quem etiqueta e desetiqueta é sempre o equipamento, nas bordas do tronco.**

</details>

<details>
<summary>O que acontece com um quadro que chega ao tronco <b>sem</b> etiqueta nenhuma?</summary>

Ele **não é descartado**: cai na **VLAN nativa** daquela porta, que de fábrica é a VLAN 1. E tudo o que sai para a VLAN nativa sai limpo, sem etiqueta.

</details>

<details>
<summary>No pré-laboratório da aula passada, o campo <b>gateway</b> dos quatro PCs ficou em branco. Por que isso não impediu o <code>ping</code> entre FIN-1 e FIN-2 de funcionar?</summary>

Porque os dois estão na **mesma rede IP**. Quando origem e destino compartilham a sub-rede, a estação não precisa de gateway: ela descobre o MAC do destino por ARP e entrega direto.

O gateway só entra em cena quando o destino está **fora** da rede da origem — e é exatamente esse o caso de hoje. O campo que ficou em branco vai ser preenchido nesta aula, e é ele que faz a aula acontecer.

</details>

<details>
<summary>Da Aula 02: o FIN-1 (<code>192.168.10.11</code>) quer falar com o SRV-REC (<code>192.168.20.50</code>). Antes de o primeiro pacote existir, a estação faz uma conta. <b>Qual conta, e o que ela decide?</b></summary>

Ela aplica a **máscara** ao endereço de destino e compara com a própria rede. `192.168.20.50` com máscara `/24` está na rede `192.168.20.0`; ela está na `192.168.10.0`. **São redes diferentes.**

E essa conta decide **para quem ela vai pedir o MAC**. Se o destino estivesse na mesma rede, ela pediria por ARP o MAC do próprio destino. Como está fora, ela pede o MAC de **outra máquina**: a do gateway.

Escreveu "ela faz ARP do `192.168.20.50`"? É a resposta que quase todo mundo dá, e ela pula justamente a conta. A estação **nunca** faz ARP de um endereço fora da sua rede — ela não teria como, o ARP é broadcast e não sai do domínio.

A fatura de hoje é essa: **falta a máquina que responde por esse gateway.** A aula inteira é sobre colocá-la lá.

</details>
</div>

> [!INFO] 🎯 O que você leva desta aula
> - Por que duas VLANs no **mesmo** switch não se falam, e por que isso **não** é defeito.
> - Como uma interface física vira **várias** interfaces lógicas, uma por VLAN — a **subinterface**.
> - As linhas que fazem um roteador atender três VLANs por **um** cabo, e o preço disso.
> - Quando o roteamento acontece **dentro** do switch, pela **SVI**, e por que nem todo switch pode.
>
> **📂 Recursos**
> - [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato) — calendário, notas, prazos e regras
> - [Manual do IOS no Packet Tracer](./Manual-do-IOS-no-Packet-Tracer) — os modos do console, as teclas que economizam digitação e as mensagens de erro. O **anexo** tem os comandos do semestre por tema.
> - **Packet Tracer** — usado no pré-laboratório desta página e no laboratório da sua turma prática. O arquivo de partida é o que você salvou na aula passada.

### 🧭 A aula inteira é uma promessa e a fatura dela

| | A pergunta | A resposta |
| :-: | :--- | :--- |
| **1** | Duas VLANs no mesmo switch, e elas não se falam. De quem é a falta? | De ninguém: o switch decide por MAC, e a decisão de sair da rede é de **IP**. Falta o equipamento que lê IP. |
| **2** | Um roteador com uma placa só, e três VLANs para atender. Como? | A interface física se divide em **subinterfaces**, uma por VLAN, cada uma com o seu IP e a sua etiqueta. |
| **3** | E se o próprio switch soubesse rotear? | Aí ele ganha uma **SVI** por VLAN e o salto acontece por dentro. Mas isso exige um switch de **camada 3**. |

<aside class="au-antes">
<b class="au-nota-t">Antes de começar</b>

Lista de consulta, não de leitura corrida: passe os olhos antes da aula e volte aqui sempre que uma palavra travar. Nada nesta página é cobrado como "você já devia saber".

<b class="au-nota-t">Das aulas passadas, e você vai usar hoje o tempo todo</b>

**VLAN** — rede separada criada por configuração dentro de um switch. Duas VLANs são dois domínios de broadcast, e **cada uma é uma rede IP diferente**. Essa segunda metade da frase é o que hoje passa a importar.

**Tronco** — porta que carrega várias VLANs pelo mesmo cabo, etiquetando cada quadro. Hoje o tronco ganha um vizinho novo do outro lado: um roteador.

**Etiqueta 802.1Q** — os 4 bytes com o número da VLAN, que só existem dentro do tronco.

**VLAN nativa** — a VLAN em que cai o quadro que chega ao tronco sem etiqueta.

**Porta de acesso** — porta que serve uma VLAN só, onde se liga a estação. O quadro entra e sai limpo.

**Domínio de broadcast** — o conjunto de portas que recebe um quadro de broadcast. O **ARP** vive dentro dele, e é por isso que ele decide quem consegue falar com quem sem ajuda.

<b class="au-nota-t">De Redes I, e hoje é o dia em que isso volta a valer</b>

**Gateway padrão** — o endereço IP para onde a estação manda **tudo o que não é da rede dela**. Não é um endereço mágico: é o IP de um equipamento vizinho que se dispôs a encaminhar. Se ninguém tiver esse IP, a estação fica falando sozinha.

**ARP** — o protocolo com que a estação descobre o MAC correspondente a um IP. É **broadcast**, então só alcança quem está no mesmo domínio — ou seja, na mesma VLAN.

**Roteamento** — decidir, olhando o **IP de destino**, por qual interface o pacote sai. Quem faz isso lê camada 3; o switch das aulas passadas lê camada 2.

**Tabela de rotas** — a lista que o roteador consulta para tomar essa decisão. Rede de destino, e por onde sair.

<b class="au-nota-t">Novo hoje</b>

**Roteamento inter-VLAN** — fazer o tráfego de uma VLAN alcançar outra, de propósito, sem apagar a separação que as VLANs criaram.

**Subinterface** — uma interface **lógica** criada dentro de uma interface física, escrita com um ponto e um número: `GigabitEthernet0/0.10`. O número depois do ponto é escolha sua e não obriga nada — a boa prática, que esta disciplina segue, é usá-lo igual ao ID da VLAN.

**`encapsulation dot1Q 10`** — o comando que amarra uma subinterface a uma VLAN. É ele que diz "o que chegar etiquetado com 10 é seu, e o que você mandar sai etiquetado com 10". **Sem ele a subinterface não pertence a VLAN nenhuma**, e o IOS nem aceita configurar endereço.

**Router-on-a-stick** — o arranjo em que um roteador atende várias VLANs por uma única interface física ligada a um tronco. "Roteador no palito": o palito é o cabo.

**SVI** (*switched virtual interface*) — a interface virtual de uma VLAN **dentro** de um switch, criada com `interface vlan 10`. É o que dá um endereço IP à VLAN no próprio equipamento.

**`ip routing`** — o comando que liga o encaminhamento de camada 3 num switch que sabe fazê-lo. Vem **desligado** de fábrica, e sem ele as SVIs existem, respondem ping e não encaminham nada de ninguém.

**Switch de camada 3**, ou *multicamada* — switch que, além de comutar quadros, roteia pacotes. É o equipamento que o T3 pede, e o 2960 da disciplina **não** é um deles.

<b class="au-nota-t">Você vai ouvir hoje, mas é das próximas semanas</b>

**Rota estática e rota dinâmica** — como o roteador aprende os caminhos que não estão diretamente ligados a ele. Hoje todas as nossas redes estão diretamente ligadas, e por isso ainda não precisamos disso.

**Redundância de gateway** — o que acontece quando o roteador que atende todas as VLANs cai. Ele é ponto único de falha, e hoje isso fica só apontado.

</aside>

---

## 📌 1. O switch não lê IP, e é por isso que as duas VLANs não se falam [Conceito ⏳ 13 min]

O tronco da aula passada resolveu a travessia: a VLAN 10 existe nos dois andares, a VLAN 20 também, e nenhuma delas atravessou para a outra. Isso era o objetivo. Hoje o objetivo mudou de lado.

O financeiro precisa alcançar o **SRV-REC**, um servidor de arquivos que fica na VLAN da recepção. Com autorização, de propósito, e sem que a recepção inteira passe a enxergar o financeiro.

<figure class="au-fig">
<img src="assets/aula06_o_vao_entre_duas_vlans.svg" alt="Um switch de camada 2 desenhado como uma caixa alta a direita, com duas estacoes a esquerda. A estacao FIN-1, no endereco 192.168.10.11, esta dentro de um contorno continuo verde-agua que representa o dominio de broadcast da VLAN 10 e que corta a metade de cima do switch. O servidor SRV-REC, no endereco 192.168.20.50, esta dentro de outro contorno verde-agua, o da VLAN 20, que corta a metade de baixo do mesmo switch. No meio do switch, separando as duas metades, ha uma linha tracejada laranja com um X laranja sobre ela, mostrando que nao existe caminho de uma metade para a outra dentro do equipamento">
<figcaption class="au-legenda">Os contornos verde-água são os mesmos das três últimas aulas e significam a mesma coisa. A novidade é a linha laranja: ela não é um cabo cortado nem um defeito — é a <b>ausência de caminho</b> dentro de um equipamento que decide por MAC. O switch tem as duas metades e não tem como ligá-las, porque ligá-las exigiria ler o <b>IP</b>.</figcaption>
</figure>

### 1.1 A falha acontece antes do primeiro pacote existir

Você já respondeu isso na abertura, e agora vale escrever a sequência inteira. O FIN-1 executa `ping 192.168.20.50`, e antes de qualquer coisa sair da placa ele decide três coisas:

| A decisão da estação | O que ela conclui |
| :--- | :--- |
| Aplicar a **máscara** ao destino e comparar com a própria rede | `192.168.20.0` ≠ `192.168.10.0` — **o destino está fora** |
| Escolher **de quem** pedir o MAC | não do destino, que está fora do alcance do ARP: do **gateway** |
| Procurar o gateway na própria configuração | e é aqui que a rede da aula passada quebra |

Repare no que **não** aconteceu: nenhum quadro chegou ao switch, nenhuma etiqueta foi inserida, nenhum tronco foi usado. A conversa morreu dentro do FIN-1.

E isso muda o diagnóstico. Com o campo de gateway **em branco**, a estação não tem para onde mandar e desiste sozinha. Com um gateway **preenchido apontando para um IP que ninguém tem**, ela chega mais longe: manda o ARP, que é broadcast e circula pela VLAN 10 inteira — e ninguém responde, porque naquela VLAN não existe máquina alguma com aquele endereço.

**Os dois casos falham, e falham em lugares diferentes.** Saber distinguir os dois é metade do diagnóstico de rede que esta disciplina ensina.

<details class="au-aposta">
<summary>Aposte antes de ver: e se você trocar o IP do SRV-REC para <code>192.168.10.50</code>, colocando-o na <b>mesma sub-rede</b> do FIN-1 — mas deixando a porta dele na VLAN 20?</summary>

**Continua sem funcionar, e agora sem nem a desculpa do gateway.**

Agora as duas máquinas estão na mesma rede IP, então o FIN-1 conclui que o destino é local e faz ARP direto do `192.168.10.50`. Só que o ARP é **broadcast**, e broadcast não atravessa a fronteira da VLAN. O pedido circula pela VLAN 10 inteira e nunca chega à VLAN 20.

A lição vale para o semestre: **a parede é de camada 2, e endereçar por cima dela não a remove.** Duas VLANs com a mesma sub-rede IP não é uma solução esperta — é uma rede que não funciona e ainda por cima confunde quem for diagnosticá-la, porque o `ipconfig` de todo mundo parece certo.

</details>

### 1.2 Quem lê IP toma uma decisão que o switch nunca tomou

O switch encaminha por MAC dentro de um domínio. Quem lê IP faz outra coisa: recebe um pacote, consulta uma **tabela de rotas** e decide por qual interface ele sai — inclusive quando entrada e saída são redes completamente diferentes.

| Quem decide | Olha o quê | Pergunta que responde | Fronteira que atravessa |
| :--- | :--- | :--- | :--- |
| Switch de camada 2 | o **MAC** de destino | "em qual porta deste domínio ele está?" | nenhuma — não sai da VLAN |
| Roteador (camada 3) | o **IP** de destino | "por qual interface eu chego nessa **rede**?" | é literalmente a função dele |

Só existem duas formas de colocar essa decisão na nossa rede: **um roteador ligado por fora**, no tronco que você já configurou, ou **um switch que também saiba rotear**. As duas são o resto da aula, nessa ordem.

> [!NOTE] 💼 Pergunta de entrevista
> *"Duas VLANs no mesmo switch, e o cliente quer que elas se falem. Ele pergunta se dá para resolver só na configuração do switch, sem comprar equipamento nenhum. O que você responde?"*
>
> **Resposta esperada:** depende de **qual** switch, e é essa pergunta que o candidato precisa fazer antes de responder. Num switch de camada 2 — o 2960 do laboratório — não dá: ele não lê IP, e nenhuma configuração o faz ler. Num switch de camada 3, dá, e sem cabo novo: ele ganha uma SVI por VLAN e roteia internamente. Candidato que responde "é só criar uma rota no switch" não separou o que o equipamento **é** do que ele **está configurado para fazer**. Candidato que responde "impossível, precisa de roteador" acertou metade: precisa de **alguém que leia IP**, e esse alguém pode estar dentro do próprio switch.

---

## 📌 2. Uma interface física, várias interfaces lógicas: a subinterface [Configuração ⏳ 22 min]

O roteador da filial tem as interfaces Ethernet contadas, e as que existem já têm dono: uma vai para a operadora. Sobrou **uma** para atender a VLAN 10, a VLAN 20 e as três que vão nascer no ano que vem.

A saída ingênua é a mesma da aula passada, e morre do mesmo jeito: um cabo por VLAN, uma interface física por VLAN. Cinco VLANs, cinco portas de roteador — e roteador não tem porta sobrando, é o equipamento mais caro por porta da rede inteira.

A saída real reaproveita exatamente o que você construiu em 25/08: **o cabo já sabe carregar várias VLANs.** Falta o roteador saber recebê-las.

### 2.1 A interface se divide em lógicas, uma por VLAN

A interface física continua sendo uma. Dentro dela, você cria **subinterfaces** — uma por VLAN — e cada uma se comporta como se fosse uma placa de rede independente: tem o seu próprio endereço IP, o seu próprio MAC lógico e a sua própria entrada na tabela de rotas.

O que amarra cada subinterface à sua VLAN é uma linha só: `encapsulation dot1Q 10`. Ela diz duas coisas ao mesmo tempo, e é bom ler as duas:

| A linha diz | Consequência |
| :--- | :--- |
| "quadro que chegar etiquetado com **10** é desta subinterface" | é assim que o roteador separa o tráfego das VLANs que chegam pelo mesmo cabo |
| "o que sair por aqui sai etiquetado com **10**" | é assim que o switch, do outro lado, sabe em qual domínio entregar |

Ou seja: **o roteador passou a ser uma das duas pontas do tronco.** Ele etiqueta e desetiqueta exatamente como o switch da aula passada — e pelo mesmo motivo, que é a etiqueta ser a única informação de VLAN que atravessa o cabo.

> [!WARNING] ⚠️ Gotcha — o comando `encapsulation dot1q` que não existia no switch é obrigatório no roteador
> Na aula passada você viu que `switchport trunk encapsulation dot1q` **não existe** no 2960, e que o IOS devolve `Invalid input detected` quando alguém o digita seguindo tutorial da internet. A razão era simples: o 2960 fala só 802.1Q, não há o que escolher.
>
> No roteador, a mesma palavra é **obrigatória** — e por uma razão diferente: a subinterface não nasce pertencendo a VLAN nenhuma. Sem `encapsulation dot1Q 10`, ela é uma interface lógica órfã, e o IOS **recusa** o endereço IP que você tentar configurar nela, explicando que ela precisa antes pertencer a uma VLAN.
>
> **A lição não é decorar em qual equipamento o comando existe.** É que o mesmo termo pode ser desnecessário num lugar e indispensável noutro, e que ler a mensagem de erro custa menos que repetir a digitação.

### 2.2 O pacote sobe etiquetado, é roteado, e desce etiquetado com outro número

<div class="au-slot">
<div class="au-slot-h"><b>Pare e responda</b> · antes de continuar a leitura</div>
<div class="au-slot-c">

O **FIN-1** (`192.168.10.11`, VLAN 10) manda um pacote para o **SRV-REC** (`192.168.20.50`, VLAN 20). O gateway do FIN-1 está configurado como `192.168.10.1`, que é a subinterface do roteador.

**No quadro que sai da placa de rede do FIN-1, qual é o MAC de destino?**

1. O MAC do SRV-REC — é ele o destino da conversa
2. O MAC do switch, que é quem vai encaminhar
3. O MAC da subinterface do roteador — o gateway da VLAN 10
4. Broadcast, porque a estação ainda não sabe por onde ir

Escolha um número **antes** de rolar a página.

</div>
<p class="au-slot-b"><b>Se você está lendo fora da aula:</b> anote o número escolhido num canto do caderno antes de continuar.</p>
</div>

**A resposta é a 3.** E ela é a chave da aula: **o IP de destino é o do SRV-REC do começo ao fim, mas o MAC de destino é o do próximo salto** — e o próximo salto, para quem quer sair da própria rede, é sempre o gateway.

Use o seletor abaixo para isolar cada etapa do percurso:

<figure class="au-fig au-switch" role="group" aria-label="Seletor das quatro etapas do percurso do pacote">
<input type="radio" name="a06salto" id="s6-all" checked>
<input type="radio" name="a06salto" id="s6-1">
<input type="radio" name="a06salto" id="s6-2">
<input type="radio" name="a06salto" id="s6-3">
<input type="radio" name="a06salto" id="s6-4">
<div class="au-switch-lbl">
<label for="s6-all">TUDO</label>
<label for="s6-1">1 · sai limpo</label>
<label for="s6-2">2 · sobe com 10</label>
<label for="s6-3">3 · roteia</label>
<label for="s6-4">4 · desce com 20</label>
</div>
<svg class="au-camadas" viewBox="0 0 470 240" role="img" aria-label="O percurso do pacote entre duas VLANs, em quatro etapas isolaveis. A estacao FIN-1 da VLAN 10 esta embaixo a esquerda, o servidor SRV-REC da VLAN 20 embaixo a direita, o switch SW-ANDAR-1 entre os dois e o roteador R-BORDA acima do switch. Etapa 1: um traco laranja liga FIN-1 ao switch, e o quadro sai sem etiqueta com o MAC de destino do gateway. Etapa 2: um traco laranja sobe do switch ao roteador, e o switch insere a etiqueta 10 porque o quadro entrou por porta da VLAN 10. Etapa 3: um traco laranja curto dentro do roteador, onde a subinterface ponto 10 remove a etiqueta, o roteador le o IP, escolhe sair pela subinterface ponto 20 e reescreve os dois MACs. Etapa 4: um traco laranja desce do roteador ao switch e segue ate o servidor, ja etiquetado com 20, e o switch remove a etiqueta antes de entregar">
<rect x="10" y="170" width="110" height="32" rx="5" fill="none" stroke="#2778c4" stroke-width="2"></rect>
<text x="65" y="190" text-anchor="middle" font-size="11" style="fill:#2778c4" font-family="monospace">FIN-1 · v10</text>
<rect x="350" y="170" width="110" height="32" rx="5" fill="none" stroke="#2778c4" stroke-width="2"></rect>
<text x="405" y="190" text-anchor="middle" font-size="10" style="fill:#2778c4" font-family="monospace">SRV-REC · v20</text>
<rect x="175" y="170" width="120" height="32" rx="5" fill="none" stroke="#8a8f98" stroke-width="2"></rect>
<text x="235" y="190" text-anchor="middle" font-size="10" style="fill:#8a8f98" font-family="monospace">SW-ANDAR-1</text>
<rect x="175" y="25" width="120" height="50" rx="5" fill="none" stroke="#8a8f98" stroke-width="2"></rect>
<text x="235" y="42" text-anchor="middle" font-size="11" style="fill:#8a8f98" font-family="monospace">R-BORDA</text>
<line x1="120" y1="186" x2="175" y2="186" stroke="#8a8f98" stroke-width="1.5"></line>
<line x1="295" y1="186" x2="350" y2="186" stroke="#8a8f98" stroke-width="1.5"></line>
<line x1="235" y1="170" x2="235" y2="75" stroke="#8a8f98" stroke-width="1.5"></line>
<g class="c1">
<line x1="120" y1="186" x2="175" y2="186" stroke="#d9702a" stroke-width="3"></line>
<text x="95" y="220" text-anchor="middle" font-size="9" style="fill:#8a8f98" font-family="monospace">sai limpo, sem etiqueta</text>
<text x="95" y="232" text-anchor="middle" font-size="9" style="fill:#8a8f98" font-family="monospace">MAC de destino = o do gateway</text>
</g>
<g class="c2">
<line x1="205" y1="170" x2="205" y2="75" stroke="#d9702a" stroke-width="3"></line>
<text x="195" y="112" text-anchor="end" font-size="9" style="fill:#8a8f98" font-family="monospace">o switch insere a etiqueta 10</text>
<text x="195" y="124" text-anchor="end" font-size="9" style="fill:#8a8f98" font-family="monospace">porque entrou por porta da v10</text>
</g>
<g class="c3">
<line x1="207" y1="58" x2="263" y2="58" stroke="#d9702a" stroke-width="3"></line>
<text x="302" y="52" font-size="9" style="fill:#8a8f98" font-family="monospace">a .10 remove a etiqueta</text>
<text x="302" y="64" font-size="9" style="fill:#8a8f98" font-family="monospace">le o IP e sai pela .20</text>
</g>
<g class="c4">
<polyline points="265,75 265,186 350,186" fill="none" stroke="#d9702a" stroke-width="3"></polyline>
<text x="350" y="220" text-anchor="middle" font-size="9" style="fill:#8a8f98" font-family="monospace">desce etiquetado com 20</text>
<text x="350" y="232" text-anchor="middle" font-size="9" style="fill:#8a8f98" font-family="monospace">o switch tira a etiqueta e entrega</text>
</g>
</svg>
<figcaption class="au-legenda">As quatro etapas do salto, uma de cada vez. O mesmo cabo é percorrido nos <b>dois</b> sentidos, com etiquetas diferentes na ida e na volta. Isole a etapa <b>3</b>: é o único ponto do percurso inteiro em que alguém olha o <b>IP</b> — e é por isso que ele precisa acontecer dentro do roteador.</figcaption>
</figure>

Duas coisas que ficam do percurso e valem o resto do semestre:

- **O IP de origem e o de destino não mudaram em nenhum momento.** Os **MACs** mudaram no salto 3, e vão mudar de novo em cada roteador que houver adiante. Endereço de camada 3 identifica as pontas; endereço de camada 2 identifica o **próximo passo**.
- **O tráfego atravessou o mesmo cabo duas vezes.** Subiu etiquetado com 10 e desceu etiquetado com 20. É daí que vem o apelido do arranjo, e é daí que vem o defeito dele.

> [!TIP] 💡 Dica de produção
> Uma das VLANs do tronco é a **nativa**, e o tráfego dela chega ao roteador **sem etiqueta** — a subinterface comum não o reconhece. Na rede desta página isso não acontece, porque o tronco foi fechado em `allowed vlan 10,20` e a VLAN 1 não atravessa; o caso aparece assim que alguém abre o tronco ou esquece de restringi-lo. Para atender a VLAN nativa existe uma variação do comando, que declara justamente isso:
>
> ```ios
> R-BORDA(config-subif)# encapsulation dot1Q 1 native
> ```
>
> Na prática, a saída mais limpa é a mesma que a aula passada recomendou para a segurança: **usar uma VLAN nativa dedicada, sem estação nenhuma dentro**. Aí não há tráfego de usuário chegando sem etiqueta, e essa variação do comando vira desnecessária.

### 2.3 São três comandos por subinterface, e um tronco do outro lado do cabo

<div class="au-term">
<div class="au-term-h"><b>R-BORDA</b> <span>· uma interface física, duas subinterfaces</span></div>
<div class="au-term-b"><span class="cm">! a fisica primeiro: ela nao leva IP, mas precisa estar ligada</span>
<span class="ps">R-BORDA(config)#</span> <span class="kw">interface</span> gigabitEthernet 0/0
<span class="mark"><span class="ps">R-BORDA(config-if)#</span> <span class="kw">no shutdown</span></span>
<span class="ps">R-BORDA(config-if)#</span> <span class="kw">exit</span>
<span class="cm">!</span>
<span class="cm">! a subinterface do financeiro</span>
<span class="ps">R-BORDA(config)#</span> <span class="kw">interface</span> gigabitEthernet 0/0.<span class="vl">10</span>
<span class="ps">R-BORDA(config-subif)#</span> <span class="kw">encapsulation dot1Q</span> <span class="vl">10</span>
<span class="ps">R-BORDA(config-subif)#</span> <span class="kw">ip address</span> 192.168.10.1 255.255.255.0
<span class="ps">R-BORDA(config-subif)#</span> <span class="kw">exit</span>
<span class="cm">!</span>
<span class="cm">! a subinterface da recepcao</span>
<span class="ps">R-BORDA(config)#</span> <span class="kw">interface</span> gigabitEthernet 0/0.<span class="vl">20</span>
<span class="ps">R-BORDA(config-subif)#</span> <span class="kw">encapsulation dot1Q</span> <span class="vl">20</span>
<span class="ps">R-BORDA(config-subif)#</span> <span class="kw">ip address</span> 192.168.20.1 255.255.255.0</div>
</div>

A linha marcada é a que mais custa tempo em laboratório, e ela está fora das subinterfaces de propósito: **quem liga é a interface física.** As subinterfaces herdam o estado dela — se a física está desligada, todas nascem desligadas, com o IP configurado, o `encapsulation` certo e nenhum pacote passando.

E falta uma linha que **não é no roteador**. Do lado do switch, a porta onde o cabo do roteador está enfiado tem de ser um tronco — a mesma configuração de 25/08:

```ios
! no switch, na porta que vai para o roteador
SW-ANDAR-1(config)# interface fa0/23
SW-ANDAR-1(config-if)# switchport mode trunk
SW-ANDAR-1(config-if)# switchport trunk allowed vlan 10,20
```

Sem isso, aquela porta continua sendo de acesso: ela entrega ao roteador o tráfego de **uma** VLAN só, sem etiqueta, e as subinterfaces ficam esperando etiquetas que nunca chegam.

> [!WARNING] ⚠️ Gotcha — a ordem importa, e o IOS avisa de um jeito que ninguém lê
> `encapsulation dot1Q 10` vem **antes** de `ip address`. Não é preciosismo: a subinterface só pode receber endereço depois de pertencer a uma VLAN, e o IOS **recusa** o comando invertido.
>
> O problema é que a recusa não parece uma recusa: o IOS imprime uma explicação de duas linhas, o prompt volta normal, e quem estava digitando rápido não percebe. Cinco minutos depois, o `show running-config` mostra a subinterface **sem endereço nenhum** e ninguém entende por quê.
>
> A régua: depois de configurar, **leia de volta**. `show running-config interface gigabitEthernet 0/0.10` mostra o que ficou, não o que você quis.

> [!WARNING] ⚠️ Gotcha — as subinterfaces aparecem `administratively down` e a culpa é da interface de cima
> É o defeito mais comum desta aula inteira, e o sintoma engana porque a configuração está toda certa:
>
> <div class="au-term"><div class="au-term-h"><b>R-BORDA</b> <span>· antes do <code>no shutdown</code> na física</span></div><div class="au-term-b"><span class="ps">R-BORDA#</span> <span class="kw">show ip interface brief</span>
> Interface              IP-Address      OK? Method Status                Protocol
> GigabitEthernet0/0     unassigned      YES unset  administratively down down
> <span class="mark">GigabitEthernet0/0.10  192.168.10.1    YES manual administratively down down</span>
> GigabitEthernet0/0.20  192.168.20.1    YES manual administratively down down
> <span class="cm">!</span>
> <span class="cm">! saida recortada -- o comando lista todas as interfaces do equipamento.</span></div></div>
>
> O IP está lá, o método diz `manual`, e mesmo assim nada passa. **Uma interface lógica não sobe sozinha se a física que a hospeda está desligada** — e a de fábrica, num roteador, vem desligada. Um `no shutdown` na `gigabitEthernet 0/0` sobe as três de uma vez.

### 2.4 A prova de que funcionou está na tabela de rotas

Configurar não é funcionar. A verificação desta aula é a tabela de rotas do roteador, e o que se procura nela é bem específico:

<div class="au-term">
<div class="au-term-h"><b>R-BORDA</b> <span>· duas redes diretamente conectadas, uma por subinterface</span></div>
<div class="au-term-b"><span class="ps">R-BORDA#</span> <span class="kw">show ip route</span>
<span class="cm">! Codigos: C - connected, L - local</span>
      192.168.10.0/24 is variably subnetted, 2 subnets, 2 masks
<span class="mark">C        192.168.10.0/24 is directly connected, GigabitEthernet0/0.10</span>
L        192.168.10.1/32 is directly connected, GigabitEthernet0/0.10
      192.168.20.0/24 is variably subnetted, 2 subnets, 2 masks
C        192.168.20.0/24 is directly connected, GigabitEthernet0/0.20
L        192.168.20.1/32 is directly connected, GigabitEthernet0/0.20
<span class="cm">!</span>
<span class="cm">! saida recortada -- a legenda completa dos codigos vem antes da tabela.</span></div>
</div>

Duas linhas `C`, uma por VLAN, cada uma apontando para a **subinterface** correspondente. É isso que autoriza o roteador a encaminhar entre as duas: ele não precisa aprender rota nenhuma, porque as duas redes estão diretamente ligadas a ele.

E é por isso que **ainda não falamos de roteamento dinâmico**: enquanto tudo está diretamente conectado, não há caminho a descobrir. Quando houver uma terceira rede do outro lado de um segundo roteador, aí sim.

> [!NOTE] 💼 Pergunta de entrevista
> *"Numa filial com router-on-a-stick e cinco VLANs, o cliente reclama que a rede 'fica lenta na hora do backup'. O enlace do roteador é de 1 Gbps e nenhuma máquina passa de 300 Mbps. Onde você olha primeiro?"*
>
> **Resposta esperada:** no próprio cabo do router-on-a-stick, porque **todo** tráfego entre VLANs o atravessa **duas vezes** — sobe etiquetado com a VLAN de origem e desce etiquetado com a de destino. Um backup de 300 Mbps entre duas VLANs consome 600 Mbps daquele enlace, e ele é compartilhado por todas as cinco. O tráfego **dentro** de cada VLAN não passa por lá e não entra na conta, o que torna o sintoma intermitente e difícil de reproduzir. Candidato que vai direto para "a placa do servidor" não percebeu que a topologia tem um ponto por onde o mesmo pacote passa duas vezes.

---

## 📌 3. Quando o roteamento acontece dentro do switch: a SVI [Diagnóstico ⏳ 15 min]

O router-on-a-stick resolve com o que já existe: um roteador e um cabo. O preço está na resposta da entrevista acima — um enlace por onde tudo passa duas vezes.

Existe outro arranjo, e ele não tem cabo nenhum.

<figure class="au-fig">
<img src="assets/aula06_ros_vs_svi.svg" alt="Duas solucoes desenhadas lado a lado, separadas por uma linha vertical cinza. A esquerda, o router-on-a-stick: um switch de camada 2 embaixo e um roteador em cima, ligados por um unico cabo destacado em laranja, desenhado como dois tracos paralelos no mesmo enlace para mostrar que o pacote sobe e desce por ele. A porta do tronco no switch e a Fa0 barra 23. As subinterfaces G0-barra-0 ponto 10 e ponto 20 estao rotuladas no roteador. A direita, a solucao com SVI: um unico switch de camada 3, desenhado como uma caixa grande, com as interfaces virtuais interface vlan 10 e interface vlan 20 desenhadas dentro dele e um traco laranja curto ligando as duas por dentro do equipamento, sem nenhum cabo externo">
<figcaption class="au-legenda">A mesma rede, resolvida de dois jeitos. À esquerda o pacote sai do equipamento para ser roteado e volta; à direita ele nunca sai. O laranja marca, em cada painel, exatamente o mesmo assunto: <b>por onde o tráfego inter-VLAN passa</b> — e à direita a resposta é "por lugar nenhum que você possa medir com um cabo na mão".</figcaption>
</figure>

### 3.1 A SVI é a VLAN ganhando um endereço dentro do próprio switch

Um switch de camada 3 cria, para cada VLAN, uma interface virtual: a **SVI**. Ela não corresponde a tomada nenhuma no painel do equipamento — é a VLAN inteira vista como se fosse uma interface de roteador.

<div class="au-term">
<div class="au-term-h"><b>SW-NUCLEO</b> <span>· switch de camada 3 · uma SVI por VLAN</span></div>
<div class="au-term-b"><span class="cm">! sem esta linha, as SVIs existem e nao encaminham nada</span>
<span class="mark"><span class="ps">SW-NUCLEO(config)#</span> <span class="kw">ip routing</span></span>
<span class="cm">!</span>
<span class="ps">SW-NUCLEO(config)#</span> <span class="kw">interface</span> vlan <span class="vl">10</span>
<span class="ps">SW-NUCLEO(config-if)#</span> <span class="kw">ip address</span> 192.168.10.1 255.255.255.0
<span class="ps">SW-NUCLEO(config-if)#</span> <span class="kw">no shutdown</span>
<span class="ps">SW-NUCLEO(config-if)#</span> <span class="kw">exit</span>
<span class="cm">!</span>
<span class="ps">SW-NUCLEO(config)#</span> <span class="kw">interface</span> vlan <span class="vl">20</span>
<span class="ps">SW-NUCLEO(config-if)#</span> <span class="kw">ip address</span> 192.168.20.1 255.255.255.0
<span class="ps">SW-NUCLEO(config-if)#</span> <span class="kw">no shutdown</span></div>
</div>

Os endereços são **os mesmos** do router-on-a-stick: `192.168.10.1` e `192.168.20.1`. Do ponto de vista da estação, nada mudou — ela continua mandando para o gateway da rede dela e não faz ideia de onde ele mora. O que mudou é que agora o gateway está **dentro** do switch, e o salto entre VLANs não sai do equipamento.

> [!WARNING] ⚠️ Gotcha — a SVI sobe quando a VLAN tem vida, não quando você a configura
> Uma SVI configurada, com IP e sem `shutdown`, pode continuar aparecendo como `down`. Não é defeito: ela só entra em operação quando a **VLAN existe** na base de dados do switch **e** há pelo menos uma porta ativa naquela VLAN — uma porta de acesso com cabo, ou um tronco que a permita.
>
> O caso clássico é a VLAN nova, criada às 18h para uma sala que só recebe os computadores na semana seguinte: a SVI fica `down` e o técnico passa a tarde revisando a configuração dela, que está inteira certa.
>
> **A régua:** SVI que não sobe é uma pergunta sobre as **portas** da VLAN, não sobre a SVI.

### 3.2 Ter endereço IP não é rotear

<div class="au-slot">
<div class="au-slot-h"><b>Pare e responda</b> · antes de continuar a leitura</div>
<div class="au-slot-c">

No switch **2960** do laboratório — o mesmo das aulas passadas, de camada 2 — você configura `interface vlan 1`, dá a ele o endereço `192.168.1.10`, e ele passa a responder `ping`. Funciona.

**Esse switch roteia o tráfego entre a VLAN 10 e a VLAN 20?**

1. Sim — é uma SVI, e SVI é o que faz roteamento inter-VLAN
2. Não — aquela interface serve para administrar o switch, e ele não encaminha entre redes
3. Sim, desde que a VLAN 10 e a VLAN 20 também recebam SVI
4. Não, mas passa a rotear se você digitar `ip routing`

Escolha um número **antes** de rolar a página.

</div>
<p class="au-slot-b"><b>Se você está lendo fora da aula:</b> anote o número escolhido num canto do caderno antes de continuar.</p>
</div>

**A resposta é a 2.** Aquela interface existe para você alcançar o switch — abrir SSH nele, apontar o sistema de monitoramento, aplicar configuração remota. É **endereço de gerência**, e endereço de gerência não encaminha o pacote de mais ninguém.

A confusão é compreensível, porque a sintaxe é idêntica. A diferença não está no comando: está no **equipamento**. Um switch de camada 2 não tem a função de roteamento para ligar, e é por isso que a alternativa 4 também é falsa — no 2960 o `ip routing` simplesmente não é uma opção que exista.

> [!WARNING] ⚠️ Gotcha — no switch que **pode** rotear, o `ip routing` vem desligado
> Este é o outro lado do mesmo erro, e ele custa mais caro porque acontece no equipamento certo.
>
> Num switch de camada 3, você cria as duas SVIs, dá endereço às duas, as duas sobem `up/up`, e cada estação **alcança o gateway da própria VLAN**. Parece pronto. Só que o `ping` de uma VLAN para a outra falha, e todo mundo vai investigar VLAN, cabo e endereço.
>
> Falta uma linha: `ip routing`. Sem ela, o switch tem interfaces em duas redes e **não se dispõe a passar tráfego entre elas** — igual a uma máquina com duas placas de rede que não foi configurada para encaminhar. Nada indica isso na configuração das SVIs, porque o problema não está nelas.
>
> **A régua de diagnóstico:** se cada estação alcança o próprio gateway e nenhuma alcança a outra rede, o defeito está em **quem deveria encaminhar**, não nas pontas.

### 3.3 As duas soluções, lado a lado

| | **Router-on-a-stick** | **SVI em switch de camada 3** |
| :--- | :--- | :--- |
| **Onde o roteamento acontece** | num roteador, ligado por fora | dentro do próprio switch |
| **O que exige** | um roteador com uma interface livre e um tronco | um switch **de camada 3** — o 2960 não serve |
| **Cabo entre os equipamentos** | um, e todo tráfego inter-VLAN o atravessa **duas vezes** | nenhum |
| **Comando que amarra a VLAN** | `encapsulation dot1Q 10` na subinterface | o próprio `interface vlan 10` |
| **Onde se usa na prática** | filial pequena, laboratório, rede que já tem o roteador | núcleo de campus, prédio com muitas VLANs |
| **O que pode faltar e ninguém vê** | `no shutdown` na interface física | `ip routing` |

A última linha é a que vale levar: **as duas soluções falham em silêncio, e cada uma no seu lugar.** Diagnosticar rede é saber qual pergunta fazer em qual arranjo — e a pergunta muda com o equipamento, não com o sintoma.

> [!NOTE] 💼 Pergunta de entrevista
> *"Uma empresa tem 12 VLANs, um switch de camada 3 no núcleo e um roteador que só faz a saída para a internet. Onde você faz o roteamento entre as VLANs?"*
>
> **Resposta esperada:** no switch de camada 3, com uma SVI por VLAN, e o roteador fica só com a rota para fora. Levar 12 VLANs até o roteador por um tronco concentraria todo o tráfego interno num enlace que existe para tratar do tráfego externo — e o switch, que já tem o hardware para encaminhar, ficaria sem fazer o que sabe. Candidato que responde "router-on-a-stick porque é o padrão" não perguntou **quais equipamentos já existem**, que é a primeira pergunta de qualquer projeto de rede.

---

<div class="au-pratica">
<b>Pré-laboratório — faça em casa, antes da sua prática</b>

Isto **não é exercício de aula**: é a montagem que o laboratório da sua turma prática pressupõe pronta. **Abra o arquivo que você salvou no pré-lab da aula passada** — dois switches, quatro PCs, tronco de pé entre eles. São 20 minutos, e quem chegar com isto salvo começa o laboratório na parte que interessa.

1. Acrescente um **roteador 2911** (ou o modelo equivalente disponível na sua versão) e ligue a `GigabitEthernet0/0` dele na porta `Fa0/23` do **SW-ANDAR-1**, com cabo **direto**.
2. No **SW-ANDAR-1**, transforme a `Fa0/23` em tronco: `switchport mode trunk` e `switchport trunk allowed vlan 10,20`. É a receita de 25/08, repetida na porta nova.
3. **Antes de configurar o roteador**, no PC-1 (VLAN 10) rode `ping 192.168.20.12`. **Deve falhar** — anote isto, é o estado "antes". *(No seu arquivo, quem faz o papel do `SRV-REC` da página é o **PC-2**: mesma VLAN 20, mesmo papel, endereço `192.168.20.12` em vez de `.20.50`. A página usa o nome do cenário; o Packet Tracer usa o que você montou em 25/08.)*
4. No roteador, rode `show ip interface brief`. Confira que a `GigabitEthernet0/0` está `administratively down`. **É esse o estado de fábrica**, e é ele que você vai reencontrar no passo 6, já com as subinterfaces configuradas.
5. Configure as **duas subinterfaces**, na ordem da página: `interface gigabitEthernet 0/0.10`, `encapsulation dot1Q 10`, `ip address 192.168.10.1 255.255.255.0`; depois a `.20` com `encapsulation dot1Q 20` e `ip address 192.168.20.1 255.255.255.0`.
6. Repita o `show ip interface brief`. As subinterfaces aparecem com IP e **ainda** `administratively down`. Não conserte ainda: **olhe**.
7. Agora sim: `interface gigabitEthernet 0/0` e `no shutdown`. Repita o comando do passo 6 e veja as três subirem juntas.
8. Nos **quatro PCs**, preencha o campo **gateway** que estava em branco: `192.168.10.1` nos da VLAN 10, `192.168.20.1` nos da VLAN 20. Cada um aponta para o gateway **da própria VLAN**.
9. Repita o `ping` do passo 3. **Agora responde.** Rode também `show ip route` no roteador e localize as **duas linhas `C`**, uma por subinterface.

<p class="au-pronto"><b>Critério de pronto do pré-lab:</b> no passo 3 o <code>ping</code> entre VLANs <b>falha</b>; no passo 6 as subinterfaces têm IP e estão <code>administratively down</code>; no passo 9 o <code>ping</code> entre VLANs <b>responde</b> e o <code>show ip route</code> mostra <code>C</code> para <code>192.168.10.0/24</code> e <code>192.168.20.0/24</code>, cada uma na sua subinterface. Se o passo 9 responde mas o passo 3 também respondia, alguma porta ficou na VLAN errada — reveja a topologia da aula passada antes de seguir.</p>
</div>

> [!IMPORTANT] 📌 O pré-lab não vale ponto — o laboratório da sua turma vale
> Ninguém confere o pré-lab. Ele existe para que o laboratório da sua prática comece onde esta aula parou. **A data do laboratório de cada turma é avisada no AVA**, junto com o cenário: o calendário das práticas está em reajuste por causa dos feriados de 31/08 e 07/09, e esta página não afirma data que ainda não veio da secretaria.
>
> A régua da correção está no contrato: **dez itens verificados, oito deles = o ponto (80% de acerto)**, apurado na sua tela durante a aula.

---

<div class="au-resumo">
<b>O que você viu acontecer hoje</b>

Seis coisas passaram na tela nesta aula. Tente responder o *porquê* antes de abrir — é o esforço de lembrar que fixa, não a releitura.

| O que você viu acontecer | |
| :--- | :--- |
| O `ping` entre duas VLANs falhou **sem nada sair da placa de rede** | <details><summary>por quê?</summary>Porque a estação aplica a máscara **antes** de transmitir, conclui que o destino está fora da rede dela, e procura um gateway que não existia. A conversa morreu dentro do próprio PC.</details> |
| Colocar as duas VLANs na mesma sub-rede IP **não** as fez conversar | <details><summary>por quê?</summary>Porque a parede é de **camada 2**. Com a mesma sub-rede, a estação faz ARP direto do destino — e o ARP é broadcast, que não atravessa a fronteira da VLAN. Endereçar por cima da parede não a remove.</details> |
| O quadro saiu do FIN-1 com o MAC do **roteador**, não o do servidor | <details><summary>por quê?</summary>Porque o MAC de destino é o do **próximo salto**, não o do destino final. O IP identifica as pontas e não muda no caminho; o MAC identifica o próximo passo e é reescrito a cada roteador.</details> |
| Uma interface física virou duas interfaces com IPs de redes diferentes | <details><summary>por quê?</summary>Porque a **subinterface** é uma interface lógica, e o `encapsulation dot1Q 10` a amarra a uma VLAN — o que chega etiquetado com 10 é dela, e o que sai por ela sai etiquetado com 10. O roteador virou a outra ponta do tronco.</details> |
| As subinterfaces tinham IP, `encapsulation` certo, e apareciam `administratively down` | <details><summary>por quê?</summary>Porque a interface **física** estava desligada, e interface lógica não sobe sem a física que a hospeda. Um `no shutdown` na `gigabitEthernet 0/0` subiu as três de uma vez.</details> |
| O 2960 aceitou `interface vlan 1` com IP, respondeu `ping` e **não** roteou nada | <details><summary>por quê?</summary>Porque aquela SVI é **endereço de gerência**: serve para você alcançar o switch, não para ele encaminhar o pacote dos outros. Ter endereço IP e rotear são coisas diferentes, e a segunda exige um equipamento de camada 3 — com o `ip routing` ligado.</details> |

**O fio para a próxima aula:** você tem duas VLANs conversando através de um roteador, e a rede inteira depende de **um** cabo e de **um** equipamento. Se alguém quiser redundância, vai puxar um segundo cabo entre os switches — e a aula passada já avisou o que dois cabos entre os mesmos dois switches formam.

</div>

<div class="au-podcast">
<p><b>🎧 Revisão em áudio (10 min)</b> — gerada por IA a partir desta página, para o trajeto. O áudio complementa; a página é a fonte.</p>
<p><i>Disponível em breve.</i></p>
</div>

<hr class="au-fim-aula">

<div class="au-reflexao">
<b>Para pensar até a próxima aula</b>

<p>Nas aulas 04 e 05 você usou VLANs e um tronco para <b>separar</b> duas redes que estavam juntas. Hoje usou três comandos por subinterface e um roteador para <b>reuni-las</b> — sem desfazer nada do que separou.</p>

<p>Repare que a separação não foi desfeita: as duas VLANs continuam sendo dois domínios de broadcast, e o broadcast de uma continua sem chegar na outra. O que passou a existir foi <b>uma porta única</b>, por onde tudo o que atravessa é obrigado a passar — e onde tudo o que atravessa pode ser visto, contado e barrado.</p>

<p><b>Se separar e reunir custam quase o mesmo, o que você ganhou de verdade ao separar primeiro?</b> E quem, na empresa, decide o que tem permissão de atravessar essa porta?</p>
</div>

## ✍️ Questões estilo Enade

Três questões no formato da prova. **As respostas não ficam nesta página** — elas voltam na correção em sala.

### Questão 1

Em um switch de camada 2, as VLANs 10 e 20 estão criadas e possuem estações em portas de acesso. Uma estação da VLAN 10, com endereço `192.168.10.11/24`, executa `ping` para uma estação da VLAN 20, com endereço `192.168.20.50/24`. O campo de gateway padrão de ambas está em branco.

Assinale a alternativa que descreve corretamente o que ocorre.

- **A)** O quadro é transmitido ao switch, que o descarta ao verificar que a porta de destino pertence a outra VLAN.
- **B)** O quadro é transmitido ao switch, que o encaminha à VLAN 20 por se tratarem de sub-redes distintas do mesmo equipamento.
- **C)** Nada é transmitido: a estação de origem determina, pela máscara, que o destino está em outra rede e não possui gateway para o qual encaminhar.
- **D)** A estação de origem emite um ARP Request para `192.168.20.50`, que é respondido pelo switch em nome do destino.
- **E)** A comunicação ocorre normalmente, pois estações no mesmo switch físico compartilham o mesmo domínio de broadcast.

### Questão 2

Um roteador atende às VLANs 10 e 20 por meio de uma única interface física conectada a um tronco 802.1Q. Um pacote é enviado de uma estação da VLAN 10 para uma estação da VLAN 20.

Assinale a alternativa que descreve corretamente os endereços do quadro que **sai da placa de rede da estação de origem**.

- **A)** MAC de destino da estação de destino e IP de destino da estação de destino.
- **B)** MAC de destino da subinterface do roteador e IP de destino da estação de destino.
- **C)** MAC de destino da subinterface do roteador e IP de destino da subinterface do roteador.
- **D)** MAC de destino do switch de acesso e IP de destino da estação de destino.
- **E)** MAC de destino em broadcast e IP de destino da estação de destino, por a origem desconhecer o caminho.

### Questão 3

Um técnico configura, em um switch de camada 3, as interfaces virtuais das VLANs 10 e 20, atribuindo a cada uma o endereço de gateway da respectiva sub-rede. Ambas as interfaces são exibidas como ativas, e cada estação alcança com sucesso o gateway da própria VLAN.

| | O cenário |
| :--- | :--- |
| **O sintoma relatado** | nenhuma estação da VLAN 10 alcança estações da VLAN 20, e vice-versa |
| **O que já foi verificado** | as duas SVIs estão ativas; cada estação alcança o próprio gateway; as portas estão nas VLANs corretas |
| **A hipótese do técnico** | há erro de configuração nas interfaces virtuais |

Assinale a alternativa que identifica corretamente a causa mais provável.

- **A)** A hipótese está correta: interfaces virtuais exigem o comando `encapsulation dot1Q` para associar-se às respectivas VLANs.
- **B)** A causa é a ausência do comando que habilita o encaminhamento de pacotes entre redes no switch, mantido desativado por padrão.
- **C)** A causa é a inexistência de um tronco entre o switch e um roteador externo, sem o qual não há roteamento entre VLANs.
- **D)** A causa é o uso de sub-redes distintas para cada VLAN, o que exige a configuração de rotas estáticas entre elas.
- **E)** A hipótese está correta: uma interface virtual não pode operar como gateway padrão de estações, função exclusiva de interfaces físicas.

### 🔬 Para ir além

CISCO SYSTEMS. **Configuring Routing Between VLANs with IEEE 802.1Q Encapsulation.** *LAN and WAN Configuration Guide, Cisco IOS XE 17.x.* Disponível em: https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/lan-wan/b-lan-wan/m_lnsw-conf-vlan-ieee.html. Acesso em: 8 set. 2026.

| | |
| :--- | :--- |
| O que é | a documentação do fabricante sobre subinterfaces e encapsulamento 802.1Q em roteadores |
| Acesso | gratuito, **sem login** — é o único caminho aberto desta lista para o conteúdo de hoje |
| Onde olhar | a seção **"Defining the VLAN Encapsulation Format"**, que é a fonte primária do `encapsulation dot1Q <vlan>` do bloco 2.3 |
| ⚠️ O que ela **não** tem | a variação `native` do bloco 2.2. Abri o documento para escrever esta linha: o `native` aparece só na explicação do padrão, nunca no procedimento de configuração. Para essa variação, a fonte é o módulo 4 do SRWE |

**Por que vale abrir:** esta aula ensina um arranjo com duas VLANs. A pergunta que a documentação responde e a aula não é o que muda quando são quarenta — e a resposta é menos óbvia do que "repetir quarenta vezes".

<div class="au-refs">
<b>Referências desta aula</b>

- KUROSE, J. F.; ROSS, K. W. **Redes de computadores e a internet: uma abordagem top-down.** 6. ed. São Paulo: Pearson, 2013. <span class="au-pag">seç. 5.4.4, p. 357–359</span> — redes locais virtuais: a separação entre VLANs e a interligação por tronco. É a mesma seção da aula passada, e ela é o **pré-requisito** de hoje, não o conteúdo de hoje.
- TANENBAUM, A. S.; FEAMSTER, N.; WETHERALL, D. J. **Redes de Computadores.** 6. ed. Porto Alegre: Bookman, 2021. <span class="au-pag">seç. 4.7.5, p. 221–225</span> — LANs virtuais: o formato do quadro 802.1Q e os campos da etiqueta.
- CISCO NETWORKING ACADEMY. **CCNA: Switching, Routing, and Wireless Essentials (SRWE).** Cisco Systems. Disponível em: https://www.netacad.com/. Acesso em: 8 set. 2026. <span class="au-pag">módulo 4</span> — roteamento entre VLANs: subinterfaces, `encapsulation dot1Q`, SVI e `ip routing`. A numeração das subseções não é citada porque o curso exige login e ela não foi conferida: procure pelo título dos tópicos dentro do módulo.
- CISCO SYSTEMS. **Configuring Routing Between VLANs with IEEE 802.1Q Encapsulation.** *LAN and WAN Configuration Guide, Cisco IOS XE 17.x.* Disponível em: https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/lan-wan/b-lan-wan/m_lnsw-conf-vlan-ieee.html. Acesso em: 8 set. 2026. <span class="au-pag">seç. "Defining the VLAN Encapsulation Format"</span> — a sintaxe do `encapsulation dot1Q` direto no fabricante, **sem login**. É o único caminho aberto para o terço da aula que o SRWE sustenta sozinho.

<b class="au-nota-t">Onde cada terço da aula se apoia</b>

| O que a aula afirma | Fonte que sustenta |
| :--- | :--- |
| Por que VLANs separadas não trocam tráfego sozinhas (T1) | Kurose 5.4.4 · Tanenbaum 4.7.5 |
| Máscara, ARP, gateway e o MAC do próximo salto (T1 e 2.2) | conteúdo de **Redes I**, revisto na Aula 02 desta disciplina |
| **Subinterface e `encapsulation dot1Q` no roteador** (T2) | SRWE mód. 4 **e** a doc. da Cisco, seç. *Defining the VLAN Encapsulation Format* — aberta, sem login |
| **SVI e `ip routing` no switch de camada 3** (T3) | **SRWE mód. 4, sozinho** |

A penúltima linha ganhou uma segunda fonte, aberta e conferida, em 08/09. A última continua sendo fragilidade declarada, não descuido: os dois livros da bibliografia tratam de VLANs e do quadro etiquetado, mas **não** trazem a sintaxe de configuração da Cisco, e a documentação de roteador citada acima não cobre SVI. Quem quiser conferir esse terço depende do SRWE, que exige login no NetAcad.

</div>

<div class="au-proxima">
<b>Na próxima aula</b>

<p>Sua rede agora tem uma porta entre as duas VLANs, e ela funciona. Repare no que isso custou: <b>um</b> cabo e <b>um</b> equipamento, e nenhum dos dois tem substituto se falhar. A reação natural de qualquer administrador é puxar um segundo cabo — só que a Aula 05 já avisou, num Gotcha, o que dois cabos entre os mesmos dois switches formam.</p>

<p>Na próxima aula esse caminho fechado ganha nome, ganha um protocolo que o desarma, e ganha uma eleição — porque alguém tem de decidir qual dos cabos fica de pé e qual fica esperando.</p>
</div>

---

*Última atualização: 08/09/2026 · Sujeito à confirmação institucional (ver aviso na aula teórica da S01).*

**◀ [Voltar ao índice da disciplina](./)**

</div>
