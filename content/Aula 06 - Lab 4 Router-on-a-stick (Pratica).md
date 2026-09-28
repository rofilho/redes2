---
anatomia: sim
title: Lab 4 - Router-on-a-stick
---

<div class="au-leitura" data-aula="s06">

# 🟢 Lab 4 — Router-on-a-stick: o cabo que faltava para as duas redes se falarem

<b>Disciplina:</b> Redes de Computadores II · 49309<br>
<b>Semana:</b> S06 · <b>Data:</b> 28/09<br>
<b>Formato:</b> prática em Packet Tracer · 75 min<br>
<b>Pré-requisito:</b> a topologia do [[Aula 05 - Lab 3 Trunk entre switches (Pratica)|Lab 3]] de pé

---

<div class="au-caminho">
<details>
<summary>🧭 <b>Antes de abrir o Packet Tracer:</b> no Lab 3, o <code>ping</code> do PC-1 para o PC-4 falhou — e eu disse que <b>tinha</b> que falhar. O que exatamente estava faltando ali?</summary>

Faltava **alguém que lesse IP**.

O switch entregou tudo o que sabia fazer: separou as duas VLANs e ainda as carregou pelo mesmo
cabo, cada uma na sua etiqueta. Mas switch lê **MAC**, e MAC não tem noção de "outra rede". Para
o PC-1, o `192.168.20.14` está numa sub-rede que não é a dele, e a regra da pilha é clara: o que
não é meu vai para o **gateway**. O gateway estava em branco.

Por isso o erro foi `Destination host unreachable` **respondido pelo próprio PC-1**: ele nem
chegou a colocar quadro no cabo. A falha aconteceu antes do primeiro pacote existir.

Hoje você coloca no cabo quem lê IP — e preenche aquele campo que ficou vazio de propósito.
</details>
</div>

<figure class="au-fig">
<img src="assets/aula06_lab4_o_vao.svg" alt="O SW-1 com duas estacoes: o PC-1, 192.168.10.11, na Fa0/1, dentro do contorno da VLAN 10; e o PC-2, 192.168.20.12, na Fa0/2, dentro do contorno da VLAN 20. Uma linha laranja tracejada com um X separa as duas metades do switch: nao ha caminho entre elas">
<figcaption class="au-legenda">O SW-1 no estado em que o Lab 3 o deixou: o PC-1 e o PC-2 no mesmo switch, cada um na sua VLAN, e nenhum caminho entre os dois. A separação foi o <b>produto</b> que você entregou, não um defeito. O que falta é a peça que atravessa o vão de propósito, e o bloco 0 explica por que essa peça precisa ler IP. O X marca o que o switch não consegue fazer; no Lab 3, o <code>ping</code> nem chegou até ele, porque o PC-1 desistiu antes.</figcaption>
</figure>

---

## 📌 0. Antes do teclado: por que precisa de roteador, e como um cabo só atende duas VLANs [Conceito ⏳ 10 min]

Hoje você vai digitar comandos de roteador, e cada um deles responde a uma pergunta. Este bloco
faz as perguntas antes, para que nenhum comando seja decoreba. São quatro ideias, nesta ordem, e
a quarta é a que você vai ver acontecer na tela.

### 0.1 O PC desiste antes de mandar qualquer coisa

Dois termos primeiro, porque o resto do bloco depende deles:

> [!NOTE] 📖 Os dois termos
> **Gateway padrão** — o endereço IP para onde o PC manda **tudo o que não é da rede dele**. É o
> IP de um equipamento vizinho que se dispôs a encaminhar. Não é a rota de tudo: é a rota do
> **resto**.
>
> **ARP** — o protocolo com que o PC descobre o MAC correspondente a um IP. É **broadcast**, então
> só alcança quem está no mesmo domínio, ou seja, na mesma VLAN.

Quando o PC-1 (`192.168.10.11`) executa `ping 192.168.20.14`, ele decide três coisas **antes**
de colocar qualquer quadro no cabo:

| A decisão do PC | O que ele conclui |
| :--- | :--- |
| Aplicar a **máscara** ao destino e comparar com a própria rede | `192.168.20.0` ≠ `192.168.10.0` — **o destino está fora** |
| Escolher **de quem** pedir o MAC | não do destino, que está fora do alcance do ARP: do **gateway** |
| Procurar o gateway na própria configuração | o campo está em branco, e é aqui que a rede do Lab 3 para |

Nenhum quadro chegou ao switch e nenhum tronco foi usado: a conversa morreu dentro do PC-1. É por
isso que o erro do Lab 3 foi respondido **pelo próprio PC-1**.

No exercício 2 você preenche o gateway **antes** de existir quem responda por ele. Aí o PC chega
mais longe: manda o ARP, que circula pela VLAN 10 inteira, e ninguém responde. **Os dois casos
falham, e falham em lugares diferentes.** Por isso a mensagem do `ping` pode mudar no meio da
aula, antes de o roteador entrar: não é defeito, é a falha mudando de lugar.

### 0.2 O switch lê MAC; atravessar de rede exige quem leia IP

O switch encaminha por MAC dentro de um domínio. Quem lê IP faz outra coisa: recebe um pacote,
consulta uma **tabela de rotas** e decide por qual interface ele sai, inclusive quando entrada e
saída são redes diferentes. É essa tabela que você confere no exercício 6.

| Quem decide | Olha o quê | Pergunta que responde | Fronteira que atravessa |
| :--- | :--- | :--- | :--- |
| Switch de camada 2 (o 2960 do lab) | o **MAC** de destino | "em qual porta deste domínio ele está?" | nenhuma: não sai da VLAN |
| Roteador (camada 3) | o **IP** de destino | "por qual interface eu chego nessa **rede**?" | é literalmente a função dele |

Nenhuma configuração faz o 2960 ler IP. Então o lab acrescenta **alguém que leia IP**: um
roteador, ligado por fora, no switch.

### 0.3 Uma porta física, várias interfaces lógicas: a subinterface

Um cabo por VLAN gastaria uma porta de roteador por VLAN, e roteador é o equipamento mais caro por
porta da rede. A saída reaproveita o que o Lab 3 construiu: **o cabo já sabe carregar várias VLANs
etiquetadas**. Falta o roteador saber recebê-las.

Dentro da porta física `g0/0` você cria **subinterfaces**, uma por VLAN (`g0/0.10`, `g0/0.20`).
Cada uma se comporta como uma placa de rede independente, com o seu próprio IP. O que amarra cada
subinterface à sua VLAN é uma linha só. `dot1Q` é o **802.1Q**, a mesma etiqueta que você viu no
`show interfaces trunk` do Lab 3, e a linha diz duas coisas:

| `encapsulation dot1Q 10` diz | Consequência |
| :--- | :--- |
| "quadro que chegar etiquetado com **10** é desta subinterface" | o roteador separa as VLANs que chegam pelo mesmo cabo |
| "o que sair por aqui sai etiquetado com **10**" | o switch, do outro lado, sabe em qual VLAN entregar |

Ou seja: **o roteador vira uma das pontas do tronco.** Por isso a porta do switch onde ele se liga
também precisa ser tronco, e é a linha que você configura no exercício 5.

### 0.4 O pacote sobe com uma etiqueta e desce com outra

<div class="au-slot">
<div class="au-slot-h"><b>Pare e responda</b> · antes de olhar a figura</div>
<div class="au-slot-c">

O **PC-1** (`192.168.10.11`, VLAN 10) manda um pacote para o **PC-2** (`192.168.20.12`, VLAN 20).
O gateway do PC-1 é `192.168.10.1`, a subinterface `.10` do roteador.

**No quadro que leva o `ping` para fora da placa de rede do PC-1, qual é o MAC de destino?**

1. O MAC do PC-2, que é o destino da conversa
2. O MAC do switch, que é quem vai encaminhar
3. O MAC da subinterface do roteador, o gateway da VLAN 10
4. Broadcast, porque o PC ainda não sabe por onde ir

Escolha um número **antes** de mexer na figura.

</div>
<p class="au-slot-b"><b>Se você está lendo fora da aula:</b> anote o número escolhido num canto do caderno antes de continuar.</p>
</div>

**A resposta é a 3.** O IP de destino é o do PC-2 do começo ao fim; o MAC de destino é o do
**próximo salto** (o próximo equipamento no caminho), e o próximo salto, para quem sai da própria
rede, é sempre o gateway.

<figure class="au-fig au-switch" role="group" aria-label="Seletor das quatro etapas do percurso do pacote">
<input type="radio" name="lab4salto" id="l4-all" checked>
<input type="radio" name="lab4salto" id="l4-1">
<input type="radio" name="lab4salto" id="l4-2">
<input type="radio" name="lab4salto" id="l4-3">
<input type="radio" name="lab4salto" id="l4-4">
<div class="au-switch-lbl">
<label for="l4-all">TUDO</label>
<label for="l4-1">1 · sai limpo</label>
<label for="l4-2">2 · sobe com 10</label>
<label for="l4-3">3 · roteia</label>
<label for="l4-4">4 · desce com 20</label>
</div>
<svg class="au-camadas" viewBox="0 0 470 240" role="img" aria-label="O percurso do pacote entre duas VLANs, em quatro etapas isolaveis. O PC-1 da VLAN 10 esta embaixo a esquerda, o PC-2 da VLAN 20 embaixo a direita, o switch SW-1 entre os dois e o roteador R-BORDA acima do switch. Etapa 1: um traco laranja liga o PC-1 ao switch, e o quadro sai sem etiqueta com o MAC de destino do gateway. Etapa 2: um traco laranja sobe do switch ao roteador, e o switch insere a etiqueta 10 porque o quadro entrou por porta da VLAN 10. Etapa 3: um traco laranja curto dentro do roteador, onde a subinterface ponto 10 remove a etiqueta, o roteador le o IP, escolhe sair pela subinterface ponto 20 e reescreve os dois MACs. Etapa 4: um traco laranja desce do roteador ao switch e segue ate o PC-2, ja etiquetado com 20, e o switch remove a etiqueta antes de entregar">
<rect x="10" y="170" width="110" height="32" rx="5" fill="none" stroke="#2778c4" stroke-width="2"></rect>
<text x="65" y="190" text-anchor="middle" font-size="11" style="fill:#2778c4" font-family="monospace">PC-1 · v10</text>
<rect x="350" y="170" width="110" height="32" rx="5" fill="none" stroke="#2778c4" stroke-width="2"></rect>
<text x="405" y="190" text-anchor="middle" font-size="11" style="fill:#2778c4" font-family="monospace">PC-2 · v20</text>
<rect x="175" y="170" width="120" height="32" rx="5" fill="none" stroke="#8a8f98" stroke-width="2"></rect>
<text x="235" y="190" text-anchor="middle" font-size="11" style="fill:#8a8f98" font-family="monospace">SW-1</text>
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
<figcaption class="au-legenda">O percurso do PC-1 ao PC-2, os dois no SW-1, uma etapa de cada vez. Para o PC-4, que fica no SW-2, a etapa 4 segue etiquetada pelo tronco da Fa0/24, e quem tira a etiqueta é o SW-2. O mesmo cabo entre o SW-1 e o R-BORDA é percorrido nos <b>dois</b> sentidos, com etiquetas diferentes na ida e na volta. Isole a etapa <b>3</b>: é o único ponto do percurso em que alguém olha o <b>IP</b>, e é por isso que ela acontece dentro do roteador.</figcaption>
</figure>

Duas coisas para levar ao teclado:

- **Os IPs de origem e destino não mudam; os MACs mudam no roteador.** E o roteador
  desconta 1 do **TTL**, o número que aparece no fim de cada resposta do `ping`: é ele que o
  exercício 6 manda você olhar.
- **O tráfego atravessa o mesmo cabo duas vezes.** É daí que vem o nome *router-on-a-stick*, e
  é daí que vem a pergunta do fim da página.

<p class="au-pronto"><b>Pronto para o teclado quando:</b> você sabe dizer em voz alta, sem olhar, por que o <code>ping</code> do Lab 3 falhou <b>dentro do PC-1</b>, e o que a linha <code>encapsulation dot1Q 10</code> faz nos dois sentidos do cabo.</p>

---

## 📌 1. Prove o ponto de partida antes de acrescentar equipamento [Diagnóstico ⏳ 12 min]

Hoje não se monta topologia nova: a de hoje é a do Lab 3 mais **um roteador**. E o primeiro
trabalho é o mesmo de sempre — provar que a base está no estado que a aula pressupõe. Acrescentar
equipamento sobre rede que ninguém conferiu é como consertar no escuro.

### 1.1 Onde VOCÊ começa hoje — ache a sua linha antes de tocar no teclado

A sala não chega toda no mesmo estado, e é por isso que esta tabela existe. **Ache a sua linha,
faça o que ela manda, e me chame se não souber em qual você está.** Leva 30 segundos e evita
que você refaça o que já tem pronto.

| Você tem… | Comece em | O `show interfaces trunk` do SW-1 tem que mostrar |
|---|---|---|
| **(a) O Lab 3 salvo** — dois switches, tronco de pé, sem roteador | **1.2**, e siga na ordem | **uma** porta: `Fa0/24`, `Native vlan 99`, `Vlans allowed 10,20,99` — ou `10,20,30,99`, se você fez o dever de casa 4; a 30 não atrapalha nada hoje |
| **(b) Nada salvo** | a receita abaixo, **10 a 15 min**, e **depois o 1.3** — não pule, é lá que o gateway entra | nada ainda; é o que você vai construir |

**A receita mínima da linha (b)** — não são 4 minutos; conte de 10 a 15, e você vai andar atrás
da turma.

1. Dois switches **2960** (`SW-1`, `SW-2`) e quatro PCs.
2. `PC-1` na `Fa0/1` do SW-1 · `PC-2` na `Fa0/2` do SW-1 · `PC-3` na `Fa0/1` do SW-2 · `PC-4` na
   `Fa0/2` do SW-2 — **cabo direto** nos quatro.
3. `Fa0/24` do SW-1 na `Fa0/24` do SW-2 com **cabo cruzado**.
4. Endereços, máscara `255.255.255.0`: `PC-1` `192.168.10.11` · `PC-2` `192.168.20.12` ·
   `PC-3` `192.168.10.13` · `PC-4` `192.168.20.14`. **Gateway ainda em branco** — ele é o
   assunto do **1.3**, que você faz logo depois desta receita.
5. Nos **dois** switches: VLAN 10 `FINANCEIRO`, VLAN 20 `RECEPCAO`, `Fa0/1` na 10, `Fa0/2` na 20,
   e a `Fa0/24` como tronco com `switchport trunk allowed vlan 10,20,99` e `native vlan 99` nos dois lados — foi onde o Lab 3 parou.

<p class="au-pronto"><b>Pronto quando:</b> <code>show interfaces trunk</code> nos <b>dois</b> switches mostra <code>Fa0/24</code> com <code>Status trunking</code>, <code>Native vlan 99</code> e <code>Vlans allowed 10,20,99</code> — o estado em que o Lab 3 terminou — e o <code>ping</code> do PC-1 para o <code>192.168.10.13</code> responde.</p>

### 1.2 Exercício 1 — as duas provas que autorizam começar [⏳ 5 min]

Duas telas, nesta ordem. Elas provam coisas diferentes.

<div class="au-term">
<div class="au-term-h"><b>PC-1</b> <span>· o que funciona e o que nao funciona, antes de mexer</span></div>
<div class="au-term-b"><span class="cm">! 1. dentro da propria VLAN, atravessando o tronco -- TEM que responder</span>
<span class="ps">PC&gt;</span> <span class="kw">ping</span> <span class="vl">192.168.10.13</span>
<span class="mark">Reply from 192.168.10.13: bytes=32 time&lt;1ms TTL=128</span>
<span class="cm">!</span>
<span class="cm">! 2. cruzando de VLAN -- ainda TEM que falhar, e do mesmo jeito do Lab 3</span>
<span class="ps">PC&gt;</span> <span class="kw">ping</span> <span class="vl">192.168.20.14</span>
<span class="mark">Reply from 192.168.10.11: Destination host unreachable.</span>
<span class="cm">! quem responde e o PROPRIO PC-1 -- guarde esta linha, ela vai mudar hoje</span></div>
</div>

A segunda tela é a **fotografia do antes**. No fim da aula você roda o mesmo comando e a linha
muda. Se você não tirar a foto agora, no fim não tem com o que comparar.

### 1.3 Exercício 2 — o campo que estava vazio de propósito [⏳ 4 min]

Em cada um dos quatro PCs, abra `Desktop` → `IP Configuration` e olhe o campo **`Default
Gateway`**. Ele está **em branco** nos quatro, desde o Lab 2.

<details class="au-aposta">
<summary>Aposte antes de ver: você vai preencher esse campo com um endereço que <b>ainda não existe na rede</b> — nenhum equipamento responde por ele hoje. O que acontece com os <code>ping</code>s que já funcionavam, no instante em que você preencher?</summary>

**Nada. Continuam respondendo exatamente igual.**

O gateway só entra na conversa quando o destino está **fora** da sua sub-rede. O `ping` do PC-1
para o `.13` é dentro da VLAN 10, mesma sub-rede: a pilha nem consulta o gateway. Você pode
apontar para um endereço inexistente que o tráfego local segue sem perceber.

Quem apostou "vai quebrar tudo" está tratando o gateway como se ele fosse rota de tudo. Ele é a
rota do **resto**.</details>

Agora preencha, nos quatro:

| PC | Endereço | Gateway |
|---|---|---|
| PC-1 | `192.168.10.11` | `192.168.10.1` |
| PC-2 | `192.168.20.12` | `192.168.20.1` |
| PC-3 | `192.168.10.13` | `192.168.10.1` |
| PC-4 | `192.168.20.14` | `192.168.20.1` |

**Repare no padrão:** cada VLAN tem o seu, e os dois terminam em `.1`. Não é obrigatório que
seja `.1` — é convenção, e convenção que se segue economiza a pergunta "qual era mesmo o
gateway daqui?" às três da manhã.

<p class="au-pronto"><b>Critério de pronto do exercício 2:</b> os quatro PCs com gateway preenchido, <b>e</b> o <code>ping</code> do PC-1 para o <code>.13</code> ainda respondendo — o tráfego de dentro da VLAN não mudou. O <code>ping</code> para o <code>.14</code> continua falhando: ninguém atende naqueles endereços <b>ainda</b>.</p>

---

## 📌 2. Uma interface física, duas lógicas: o roteador entra na topologia [Mão na massa ⏳ 17 min]

Agora existe um endereço de gateway em cada VLAN e **ninguém atende por ele**. Você vai colocar
quem atende.

### 2.1 Exercício 3 — o roteador no cabo [⏳ 4 min]

1. Arraste um roteador **2911** — o 1941 serve igual — e renomeie para `R-BORDA`.
2. Ligue a `GigabitEthernet0/0` do `R-BORDA` na **`Fa0/23`** do `SW-1` — **cabo direto**
   (roteador e switch são equipamentos de tipos diferentes; cruzado é switch com switch).
3. **Não configure nada ainda.**

> [!NOTE] 💡 Por que a `Fa0/23` e não outra porta qualquer
> Nenhuma razão técnica: a `Fa0/23` está livre e é vizinha da `Fa0/24`, que já é o tronco.
> Manter as duas portas de infraestrutura juntas, longe das portas de estação, é higiene de
> quem vai voltar nesse switch daqui a seis meses. **Documente a sua escolha** — no Packet
> Tracer, a nota na área de trabalho serve.

### 2.2 Exercício 4 — três comandos por subinterface [⏳ 10 min]

O cabo é um só, e ele precisa carregar **as duas** VLANs. Do lado do roteador, isso significa
dividir a interface física em interfaces **lógicas**, uma por VLAN.

<div class="au-term">
<div class="au-term-h"><b>R-BORDA</b> <span>· uma fisica, duas logicas</span></div>
<div class="au-term-b"><span class="cm">! a fisica primeiro: ela nao leva IP, mas precisa estar LIGADA</span>
<span class="ps">R-BORDA(config)#</span> <span class="kw">interface</span> gigabitEthernet 0/0
<span class="mark">R-BORDA(config-if)# no shutdown</span>
<span class="ps">R-BORDA(config-if)#</span> <span class="kw">exit</span>
<span class="cm">!</span>
<span class="cm">! a subinterface do FINANCEIRO -- o numero depois do ponto e convencao,</span>
<span class="cm">! mas usar o mesmo numero da VLAN poupa muito diagnostico depois</span>
<span class="ps">R-BORDA(config)#</span> <span class="kw">interface</span> gigabitEthernet 0/0.<span class="vl">10</span>
<span class="ps">R-BORDA(config-subif)#</span> <span class="kw">encapsulation dot1Q</span> <span class="vl">10</span>
<span class="ps">R-BORDA(config-subif)#</span> <span class="kw">ip address</span> 192.168.10.1 255.255.255.0
<span class="ps">R-BORDA(config-subif)#</span> <span class="kw">exit</span>
<span class="cm">!</span>
<span class="cm">! a subinterface da RECEPCAO</span>
<span class="ps">R-BORDA(config)#</span> <span class="kw">interface</span> gigabitEthernet 0/0.<span class="vl">20</span>
<span class="ps">R-BORDA(config-subif)#</span> <span class="kw">encapsulation dot1Q</span> <span class="vl">20</span>
<span class="ps">R-BORDA(config-subif)#</span> <span class="kw">ip address</span> 192.168.20.1 255.255.255.0
<span class="ps">R-BORDA(config-subif)#</span> <span class="kw">end</span></div>
</div>

**Os endereços não são novos:** `192.168.10.1` e `192.168.20.1` são exatamente os gateways que
você digitou nos PCs no exercício 2. Agora existe alguém atrás deles.

> [!WARNING] ⚠️ A ordem importa, e a recusa do IOS não parece uma recusa
> `encapsulation dot1Q 10` vem **antes** do `ip address`. A subinterface só aceita endereço
> depois de pertencer a uma VLAN.
>
> O problema é o formato da recusa: o IOS imprime uma explicação, o prompt volta normal, e quem
> digitava rápido não percebe. Cinco minutos depois a subinterface está **sem endereço** e
> ninguém entende por quê.
>
> **A régua: depois de configurar, leia de volta.** `show running-config interface
> gigabitEthernet 0/0.10` mostra o que **ficou**, não o que você quis.

### 2.3 Exercício 5 — a linha que não é no roteador [⏳ 3 min]

Falta uma configuração, e ela é **do outro lado do cabo**. A `Fa0/23` do SW-1 ainda é porta de
acesso: ela entrega ao roteador o tráfego de **uma** VLAN só, sem etiqueta. As subinterfaces
ficam esperando etiquetas que nunca chegam.

<div class="au-term">
<div class="au-term-h"><b>SW-1</b> <span>· a porta do roteador tambem e tronco</span></div>
<div class="au-term-b"><span class="ps">SW-1(config)#</span> <span class="kw">interface fa0/23</span>
<span class="ps">SW-1(config-if)#</span> <span class="kw">switchport mode trunk</span>
<span class="ps">SW-1(config-if)#</span> <span class="kw">switchport trunk allowed vlan</span> <span class="vl">10,20</span>
<span class="ps">SW-1(config-if)#</span> <span class="kw">end</span>
<span class="cm">! mesma configuracao do Lab 3, em outra porta e com outro vizinho:</span>
<span class="cm">! la o tronco ia para um switch, aqui vai para um roteador.</span>
<span class="cm">! Para o switch nao faz diferenca nenhuma -- tronco e tronco.</span></div>
</div>

<p class="au-pronto"><b>Critério de pronto do bloco 2:</b> <code>show interfaces trunk</code> no SW-1 lista <b>duas</b> portas — a <code>Fa0/24</code> (para o SW-2, com <code>Vlans allowed 10,20,99</code>) e a <code>Fa0/23</code> (para o roteador, com <code>10,20</code>), ambas com <code>Status trunking</code>. Se a <code>Fa0/23</code> não aparecer, o roteador está falando etiquetado com uma porta que não escuta etiqueta.</p>

---

## 📌 3. A prova, e o defeito que engana [Mão na massa ⏳ 16 min]

### 3.1 Exercício 6 — a tabela de rotas, e o `ping` que muda [⏳ 8 min]

Configurar não é funcionar. A verificação de hoje é a **tabela de rotas**:

<div class="au-term">
<div class="au-term-h"><b>R-BORDA</b> <span>· duas redes diretamente conectadas</span></div>
<div class="au-term-b"><span class="ps">R-BORDA#</span> <span class="kw">show ip route</span>
<span class="cm">! Codigos: C - connected, L - local</span>
      192.168.10.0/24 is variably subnetted, 2 subnets, 2 masks
<span class="mark">C        192.168.10.0/24 is directly connected, GigabitEthernet0/0.10</span>
L        192.168.10.1/32 is directly connected, GigabitEthernet0/0.10
      192.168.20.0/24 is variably subnetted, 2 subnets, 2 masks
<span class="mark">C        192.168.20.0/24 is directly connected, GigabitEthernet0/0.20</span>
L        192.168.20.1/32 is directly connected, GigabitEthernet0/0.20
<span class="cm">! saida recortada -- a legenda dos codigos vem antes da tabela.</span></div>
</div>

**Duas linhas `C`, uma por VLAN**, cada uma apontando para a sua subinterface. É isso que
autoriza o roteador a encaminhar entre as duas: ele não precisa **aprender** rota nenhuma,
porque as duas redes estão ligadas diretamente nele.

Agora o comando do exercício 1, de novo:

<div class="au-term">
<div class="au-term-h"><b>PC-1</b> <span>· o mesmo ping de 30 minutos atras</span></div>
<div class="au-term-b"><span class="ps">PC&gt;</span> <span class="kw">ping</span> <span class="vl">192.168.20.14</span>
<span class="mark">Reply from 192.168.20.14: bytes=32 time&lt;1ms TTL=127</span>
<span class="cm">! Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)</span></div>
</div>

> [!TIP] 💡 Repare no `TTL=127`, e não `128`
> É a evidência mais barata da aula, e quase ninguém olha. O PC-4 respondeu com TTL 128, como
> sempre; o roteador **decrementou em um** ao encaminhar. Esse `127` é a assinatura de que o
> pacote **passou por um roteador** — e é ele que separa "chegou" de "chegou atravessando".
>
> No `ping` do PC-1 para o `.13`, que fica dentro da VLAN 10, o TTL volta `128`. Compare as
> duas telas: o número diz por onde o pacote andou.

<p class="au-pronto"><b>Critério de pronto do exercício 6:</b> as duas linhas <code>C</code> na tabela de rotas, <b>e</b> o <code>ping</code> do PC-1 para o <code>.14</code> com <code>Lost = 0</code> e <code>TTL=127</code>. As duas evidências juntas — a tabela prova a configuração, o <code>ping</code> prova a função.</p>

### 3.2 Exercício 7 — desligue a física e veja o que o sintoma esconde [⏳ 8 min]

Este é o defeito mais comum da aula inteira, e você vai **criá-lo de propósito** para reconhecer
o sintoma quando ele aparecer sozinho.

<details class="au-aposta">
<summary>Aposte antes de ver: você vai dar <code>shutdown</code> na <code>gigabitEthernet 0/0</code> — a interface <b>física</b>, que não tem endereço IP nenhum. As duas subinterfaces continuam com IP, <code>encapsulation</code> e tudo mais. O que o <code>show ip interface brief</code> vai mostrar nelas?</summary>

**As três aparecem `administratively down`** — a física e as duas lógicas.

Uma interface lógica não sobe sozinha se a física que a hospeda está desligada. Ela **herda** o
estado. E o que engana é que o IP continua listado, o método continua `manual`, a configuração
continua perfeita no `running-config` — e nada passa.

Quem apostou "só a física cai" está tratando a subinterface como equipamento independente. Ela
é uma divisão lógica de algo que continua sendo um cabo só.

**A pergunta que fica:** o `show running-config` da subinterface, nesse estado, está **idêntico** ao de
uma subinterface funcionando. Se a configuração não distingue as duas situações, **qual comando
distingue?**
</details>

<div class="au-term">
<div class="au-term-h"><b>R-BORDA</b> <span>· o defeito, e a tela que o denuncia</span></div>
<div class="au-term-b"><span class="ps">R-BORDA(config)#</span> <span class="kw">interface</span> gigabitEthernet 0/0
<span class="ps">R-BORDA(config-if)#</span> <span class="kw">shutdown</span>
<span class="ps">R-BORDA(config-if)#</span> <span class="kw">end</span>
<span class="ps">R-BORDA#</span> <span class="kw">show ip interface brief</span>
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     unassigned      YES unset  administratively down down
<span class="mark">GigabitEthernet0/0.10  192.168.10.1    YES manual administratively down down</span>
<span class="mark">GigabitEthernet0/0.20  192.168.20.1    YES manual administratively down down</span>
<span class="cm">! saida recortada -- o comando lista todas as interfaces do equipamento.</span></div>
</div>

Repita o `ping` do PC-1 para o `.14`: volta a falhar. Agora **conserte** com um `no shutdown` na
física — as três sobem de uma vez, e o `ping` volta sem você tocar nas subinterfaces.

<p class="au-pronto"><b>Critério de pronto do exercício 7:</b> você tem as <b>duas</b> telas do <code>show ip interface brief</code> — uma com as três <code>administratively down</code> e outra com as três <code>up</code> — e sabe dizer qual linha de configuração separou uma da outra.</p>

---

<div class="au-slot">
<b>🔌 Slot interativo — a topologia de conferência</b>

Quem terminar antes abre o `.pkt` de conferência que eu deixo no AVA e roda o roteiro de
verificação nele: são as mesmas telas dos exercícios 6 e 7, numa topologia com **três** VLANs em
vez de duas. A terceira subinterface é sua para configurar.

<p class="au-slot-b"><b>Plano B — se o AVA não abrir ou a internet do campus cair:</b> acrescente você mesmo a VLAN 30 <code>SUPORTE</code> — a mesma do dever de casa do Lab 3 — em <code>192.168.30.0/24</code>, gateway <code>.1</code> à topologia que já está na sua tela: VLAN nos dois switches, uma porta de acesso, a VLAN na lista dos <b>dois</b> troncos e a terceira subinterface no roteador. O exercício é o mesmo e não depende de arquivo nenhum.</p>
</div>

---

<div class="au-pratica">
<b>A conferência — os 8 itens que eu passo olhando</b>

Eu passo nas bancadas durante os blocos 2 e 3 e confiro estes oito na sua tela. Todos são
**re-executáveis**: eu peço o comando e leio o resultado, você não precisa ter anotado nada.

1. A topologia do Lab 3 de pé, mais o `R-BORDA` ligado na `Fa0/23` do SW-1 com **cabo direto**, sem ponta vermelha.
2. Os quatro PCs com `Default Gateway` preenchido, e cada um com o da **sua** VLAN.
3. `show interfaces trunk` no SW-1 listando **duas** portas: `Fa0/23` e `Fa0/24`.
4. `show running-config interface gigabitEthernet 0/0.10` mostrando `encapsulation dot1Q 10` **e** o endereço — na ordem certa.
5. `show ip interface brief` com as três interfaces do roteador em `up/up` — a `g0/0` e as duas subinterfaces. As outras portas do 2911 continuam `administratively down`, e está certo: ninguém as usa hoje.
6. `show ip route` com as **duas** linhas `C`, cada uma apontando para a sua subinterface.
7. `ping` do PC-1 para o `192.168.20.14` com `Lost = 0` e **`TTL=127`**.
8. As duas telas do exercício 7, e você dizendo qual comando separou uma da outra.

<p class="au-pronto"><b>Critério de pronto:</b> <b>7 destes 8 itens</b> conferidos na sua tela. O contrato pede 80%; 7 de 8 dá 87,5%, então fica acima da régua, não abaixo. Os itens <b>7 e 8</b> são os que eu mais peço para explicar em voz alta, porque nos dois a evidência é uma <b>comparação</b>, não um valor isolado: o TTL contra o TTL de dentro da VLAN, e a tela quebrada contra a tela consertada.</p>
</div>

---

<hr class="au-fim-aula">

<div class="au-resumo">
<b>📋 Resumo — a folha de consulta</b>


| O que você quer saber | O comando | O que procurar |
|---|---|---|
| A subinterface ficou como eu quis? | `show running-config interface g0/0.10` | `encapsulation dot1Q` **antes** do `ip address` |
| As interfaces subiram? | `show ip interface brief` | `up / up` nas três que você configurou; as outras portas ficam `administratively down` |
| O roteador sabe encaminhar? | `show ip route` | uma linha `C` por VLAN, na subinterface certa |
| A porta do switch entrega etiqueta? | `show interfaces trunk` | a porta do roteador listada, `Status trunking` |
| O pacote atravessou mesmo? | `ping` de uma VLAN para a outra | `TTL=127`, não `128` |

| O erro | Como ele se apresenta |
|---|---|
| Esqueceu `no shutdown` na física | tudo configurado, três interfaces `administratively down` |
| Inverteu `ip address` e `encapsulation` | subinterface sem endereço, e o IOS "não reclamou" |
| Porta do switch continuou em acesso | uma VLAN atravessa, a outra não |
| Gateway errado no PC | só aquele PC não atravessa; os vizinhos da mesma VLAN vão bem |

</div>

---

<div class="au-reflexao">
<b>🤔 Para pensar até a próxima aula</b>


Todo o tráfego entre as suas duas VLANs passa por **um** cabo, e passa por ele **duas vezes** —
sobe etiquetado com a VLAN de origem, desce etiquetado com a de destino.

Agora imagine essa mesma filial com **cinco** VLANs e um backup noturno de 300 Mbps entre duas
delas, num enlace de 1 Gbps. **Quanto daquele cabo o backup consome, e por que o sintoma que o
cliente relata é "a rede fica lenta" em vez de "o backup está lento"?**

*Não há resposta nesta página de propósito. Traga a sua na próxima aula.*

</div>

---

<div class="au-refs-wrap">
<b>📚 O que sustenta esta prática, com página</b>

<div class="au-refs">

São as mesmas quatro da [[Aula 06 - Roteamento Inter-VLAN (Teorica)|teórica de Roteamento Inter-VLAN]].
Para aprofundar o bloco 0, leia a teórica: ela também mostra a outra forma de rotear entre VLANs,
dentro do próprio switch, que este lab não usa.

- **KUROSE, J. F.; ROSS, K. W.** *Redes de computadores e a internet: uma abordagem top-down.* 6. ed. São Paulo: Pearson, 2013. <span class="au-pag">seç. 5.4.4, p. 357–359</span> — a separação entre VLANs e a interligação por tronco. É **pré-requisito** deste lab, não o conteúdo dele.
- **TANENBAUM, A. S.; FEAMSTER, N.; WETHERALL, D. J.** *Redes de Computadores.* 6. ed. Porto Alegre: Bookman, 2021. <span class="au-pag">seç. 4.7.5, p. 221–225</span> — o formato do quadro 802.1Q, que é o que sobe e desce pelas subinterfaces.
- **CISCO SYSTEMS.** *Configuring Routing Between VLANs with IEEE 802.1Q Encapsulation.* LAN and WAN Configuration Guide, Cisco IOS XE 17.x. Disponível em: https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/lan-wan/b-lan-wan/m_lnsw-conf-vlan-ieee.html. Acesso em: 9 set. 2026. <span class="au-pag">seç. "Defining the VLAN Encapsulation Format"</span> — a sintaxe do `encapsulation dot1Q` no fabricante, **sem login**.
- **CISCO NETWORKING ACADEMY.** *CCNA: Switching, Routing, and Wireless Essentials (SRWE).* Disponível em: https://www.netacad.com/. Acesso em: 9 set. 2026. <span class="au-pag">módulo 4</span> — subinterfaces e `encapsulation dot1Q`. A numeração das subseções **não é citada porque não foi conferida** (o curso exige login): procure pelo título dos tópicos dentro do módulo.

</div>
</div>

<div class="au-proxima">
<b>➡️ Na próxima aula</b>


Você acabou de criar um caminho único por onde tudo passa duas vezes. Na próxima aula a gente pergunta
o que acontece quando existe **mais de um** caminho entre dois switches — e por que a rede, em
vez de ficar mais rápida, para completamente.

</div>

</div>

---

