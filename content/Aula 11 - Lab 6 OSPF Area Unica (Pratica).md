---
title: "Lab 6 — OSPF área única: a rede aprende sozinha o caminho"
publicar: true
tags: [redes2, lab, ospf, roteamento-dinamico]
---

<div class="au-leitura" data-aula="s11">

# 🟢 Lab 6 — OSPF área única: a rede aprende sozinha o caminho

<b>Disciplina:</b> Redes de Computadores II · 49309<br>
<b>Semana:</b> S11 · <b>Data:</b> 05/10<br>
<b>Formato:</b> prática em Packet Tracer · 75 min · <b>formativo (sem nota)</b><br>
<b>Pré-requisito de Redes I:</b> ler uma tabela de rotas e saber o que é máscara de sub-rede

---

<div class="au-caminho">
<details>
<summary>🧭 <b>Antes de abrir o Packet Tracer:</b> no Lab 4, o roteador encaminhava entre as duas VLANs porque as duas redes estavam <b>diretamente conectadas</b> nele. E se a rede que você quer alcançar está do outro lado de <b>outro</b> roteador — uma rede que o seu roteador nunca viu? Como ele fica sabendo que ela existe?</summary>

Ele **não fica** sabendo sozinho. Um roteador só conhece de nascença as redes ligadas direto nas
interfaces dele — as linhas `C` da tabela, como no Lab 4. Qualquer rede além disso ele precisa que
**alguém conte**.

Hoje você vai ver duas formas de contar, e por que uma delas não escala: ou **você** escreve a
rota à mão em cada roteador (rota estática), ou os roteadores **conversam entre si** e descobrem
sozinhos (roteamento dinâmico). O bloco 0 mostra a dor da primeira; o resto da aula monta a segunda.
</details>
</div>

<figure class="au-fig">
<img src="assets/aula11_lab6_duas_ilhas.svg" alt="Dois roteadores, R1 e R2, ligados por um link central. Sob o R1, uma LAN 10.0.0.0 com um PC; sob o R2, uma LAN 20.0.0.0 com um PC. Cada roteador tem um balao de pensamento: o do R1 lista so a propria LAN 10 e o link; o do R2 lista so a propria LAN 20 e o link. Nenhum dos dois conhece a LAN do outro. Uma seta tracejada laranja com uma interrogacao atravessa o link central, representando a pergunta: como o R1 descobre a LAN 20?">
<figcaption class="au-legenda">Dois roteadores, cada um com a sua LAN. De nascença, o R1 só conhece a LAN 10 e o link do meio; o R2 só conhece a LAN 20 e o link. A LAN do outro é uma <b>ilha</b> que ele não vê. O OSPF é o barco: cada roteador conta ao vizinho as redes que conhece, e no fim os dois têm o mapa inteiro. O que você vai montar hoje é essa conversa — e no bloco 2 vai <b>ver</b> a rota do outro aparecer na tabela, marcada com <code>O</code>.</figcaption>
</figure>

---

## 📌 0. A teoria mínima para hoje: por que a rede precisa aprender sozinha [Conceito ⏳ 12 min]

Hoje a prática vem **antes** da teoria completa — a aula teórica de OSPF é amanhã. Então este bloco
dá só o chão: o suficiente para cada comando que você vai digitar fazer sentido. O aprofundamento
(como o OSPF escolhe o melhor caminho, o que é custo, quem é o roteador designado) é a aula de amanhã.

### 0.1 A rota estática funciona — até a rede crescer

No Lab 4 o roteador encaminhava entre duas redes **diretamente conectadas**. Quando a rede do
destino está longe, atrás de outros roteadores, alguém tem de ensinar o caminho. A primeira forma é
você escrever à mão:

> [!NOTE] 📖 Dois termos primeiro
> **Rota estática** — uma linha que **você** digita no roteador dizendo "para chegar na rede X, mande
> para o roteador Y". O roteador obedece, não pensa.
>
> **Rota dinâmica** — uma linha que **apareceu sozinha** na tabela porque os roteadores se contaram
> as redes que conhecem. Ninguém a digitou.

A rota estática é simples e **não escala**. Faça a conta: numa rede com 10 roteadores, cada um
precisa saber chegar nas redes dos outros 9. São dezenas de linhas escritas à mão. E quando um link
cai, nenhuma delas se corrige sozinha — você sai de madrugada reescrevendo rota em cada equipamento.

| | Rota estática | Rota dinâmica (OSPF) |
| :-- | :-- | :-- |
| Quem escreve | você, à mão, em cada roteador | os roteadores, conversando entre si |
| Rede com 10 roteadores | dezenas de linhas manuais | você liga o protocolo e eles se acertam |
| Um link cai | você conserta à mão | a rede recalcula sozinha |
| Onde dói | manutenção e erro humano | configuração inicial um pouco maior |

### 0.2 O que um protocolo de roteamento faz, em uma frase

> **OSPF (Open Shortest Path First):** cada roteador anuncia aos vizinhos as redes que conhece, e
> escuta o que os vizinhos anunciam. No fim, todos têm o mapa completo e cada um calcula o melhor
> caminho para cada rede.

Três coisas que você vai **ver acontecer** hoje, e que a aula de amanhã explica por dentro:

1. **Adjacência (vizinhança):** antes de trocar rotas, dois roteadores precisam se reconhecer como
   vizinhos OSPF. Quando isso dá certo, o IOS imprime na tela, sozinho, uma linha com a palavra
   `FULL`. Essa linha é o momento em que a conversa começou.
2. **Área:** o OSPF organiza os roteadores em áreas. Hoje a rede inteira fica numa **área única**, a
   **área 0**. O que você precisa saber agora: **dois roteadores só viram vizinhos se estiverem na
   mesma área.** Área diferente = eles não se falam. (Por que existem áreas, e o que a área 0 tem de
   especial, é amanhã.)
3. **A rota `O`:** quando o OSPF funciona, a rota que o vizinho anunciou aparece na tabela marcada
   com a letra **`O`** — de OSPF. É o equivalente do `C` do Lab 4, mas para rede que o roteador
   **aprendeu**, não para rede ligada direto nele.

### 0.3 Os dois comandos que ligam o OSPF

Ligar o OSPF básico são **dois** comandos, e você vai repeti-los em cada roteador:

> [!NOTE] 📖 O que cada comando diz
> **`router ospf 1`** — "ligue o OSPF neste roteador". O `1` é um número local de processo; não
> precisa ser igual entre os roteadores (ao contrário da área, que precisa).
>
> **`network 10.0.0.0 0.0.0.255 area 0`** — "a interface que cai nesta faixa participa do OSPF, na
> área 0". Faz duas coisas: ativa o OSPF naquela interface **e** anuncia aquela rede aos vizinhos.

O `0.0.0.255` é a **wildcard** — por enquanto, leia como "o inverso da máscara": onde a máscara
`255.255.255.0` tem 255, a wildcard tem 0, e vice-versa. Hoje você copia o padrão; o porquê da
wildcard é amanhã.

| Comando | O que faz | Repete em |
| :-- | :-- | :-- |
| `router ospf 1` | liga o OSPF no roteador; o `1` é local | cada roteador |
| `network 10.0.0.0 0.0.0.255 area 0` | ativa o OSPF na interface do link **e** anuncia essa rede | cada roteador, por rede |
| `network 192.168.X.0 0.0.0.255 area 0` | anuncia a LAN daquele roteador | cada roteador, pela sua LAN |

> [!WARNING] ⚠️ A área é a parte que precisa bater — o resto perdoa
> O número do processo (`router ospf 1`) pode ser diferente em cada roteador que **nada acontece**.
> Mas se você digitar `area 0` num roteador e `area 1` no outro, **a adjacência não sobe** — e a
> tela não grita, simplesmente nada aparece. É o defeito nº 1 do fim desta aula, e o erro mais comum
> de quem está começando. **Área igual nos dois, sempre.**

<p class="au-pronto"><b>Pronto para o teclado quando:</b> você sabe dizer, sem olhar, por que uma rota estática não escala, o que a letra <code>O</code> significa numa tabela de rotas, e por que dois roteadores em áreas diferentes não viram vizinhos.</p>

---

## 📌 1. Passo a passo: ligue o OSPF e veja a adjacência subir [Mão na massa ⏳ 25 min]

Aqui a gente constrói junto. **Eu monto o R1 na tela, narrando cada comando; você reproduz nos
dois roteadores.** Não corra na frente: o momento mais importante da aula é uma linha que o IOS
imprime sozinho, e se você estiver digitando outra coisa, vai perder.

### 1.1 Exercício 1 — a topologia e o estado inicial [⏳ 6 min]

Monte (ou abra o `.pkt` que eu passo) esta topologia:

- **R1** e **R2**, dois roteadores **2911**, ligados entre si pela **GigabitEthernet0/0** de cada um
  (cabo direto, no Packet Tracer serve).
- **R1:** `g0/0` = `10.0.0.1 /24` (link para o R2) · `g0/1` = `192.168.10.1 /24` (a LAN dele, com o PC-1 `192.168.10.10`).
- **R2:** `g0/0` = `10.0.0.2 /24` (link para o R1) · `g0/1` = `192.168.20.1 /24` (a LAN dele, com o PC-2 `192.168.20.10`).
- **Dê `no shutdown`** nas interfaces usadas dos dois roteadores, e configure os dois PCs com IP,
  máscara `255.255.255.0` e **gateway** apontando para a `g0/1` do roteador da sua LAN.

Antes de ligar o OSPF, prove o ponto de partida:

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· o que o roteador conhece ANTES do OSPF</span></div>
<div class="au-term-b"><span class="ps">R1#</span> <span class="kw">show ip route</span>
<span class="cm">! Codigos: C - connected, L - local, O - OSPF</span>
<span class="mark">C    10.0.0.0/24 is directly connected, GigabitEthernet0/0</span>
<span class="mark">C    192.168.10.0/24 is directly connected, GigabitEthernet0/1</span>
<span class="cm">! so duas redes: as duas ligadas direto no R1. A LAN 20 do R2 NAO aparece.</span></div>
</div>

<details class="au-aposta">
<summary>Aposte antes de ver: do PC-1 (na LAN 10 do R1), você tenta <code>ping 192.168.20.10</code> (o PC-2, na LAN do R2). O link entre os roteadores está de pé. O <code>ping</code> funciona?</summary>

**Não.** O R1 não tem a menor ideia de que a rede `192.168.20.0` existe — ela não está na tabela
dele. Quando o pacote do PC-1 chega ao R1 pedindo o caminho para a LAN 20, o R1 consulta a tabela,
não acha nada, e **descarta** o pacote.

O link físico estar de pé não basta: faltam as **rotas**. É exatamente o buraco que o OSPF vai
preencher — e no bloco 2 você roda este mesmo `ping` de novo e ele passa.</details>

<p class="au-pronto"><b>Pronto quando:</b> os dois roteadores têm, cada um, <b>duas</b> linhas <code>C</code> (o link do meio e a própria LAN), e o <code>ping</code> entre as duas LANs <b>falha</b> — é a fotografia do antes.</p>

### 1.2 Exercício 2 — ligue o OSPF no R1 (eu faço na tela) [⏳ 8 min]

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· dois comandos ligam o OSPF; o network anuncia cada rede</span></div>
<div class="au-term-b"><span class="ps">R1(config)#</span> <span class="kw">router ospf</span> <span class="vl">1</span>
<span class="cm">! anuncia o link para o R2 (participa do OSPF por aqui)</span>
<span class="ps">R1(config-router)#</span> <span class="kw">network</span> 10.0.0.0 <span class="vl">0.0.0.255</span> <span class="kw">area</span> <span class="vl">0</span>
<span class="cm">! anuncia a LAN do R1</span>
<span class="mark">R1(config-router)# network 192.168.10.0 0.0.0.255 area 0</span>
<span class="ps">R1(config-router)#</span> <span class="kw">end</span></div>
</div>

Nada de dramático acontece ainda — o R1 está anunciando para um vizinho que **ainda não liga o
OSPF**. É esperado. A conversa precisa dos dois lados.

### 1.3 Exercício 3 — ligue o OSPF no R2 e ESPERE a linha aparecer [⏳ 7 min]

Agora o outro lado. Depois do segundo `network`, **pare de digitar e olhe a tela.**

<div class="au-term">
<div class="au-term-h"><b>R2</b> <span>· o mesmo par de comandos; a area 0 TEM que bater com o R1</span></div>
<div class="au-term-b"><span class="ps">R2(config)#</span> <span class="kw">router ospf</span> <span class="vl">1</span>
<span class="ps">R2(config-router)#</span> <span class="kw">network</span> 10.0.0.0 <span class="vl">0.0.0.255</span> <span class="kw">area</span> <span class="vl">0</span>
<span class="ps">R2(config-router)#</span> <span class="kw">network</span> 192.168.20.0 <span class="vl">0.0.0.255</span> <span class="kw">area</span> <span class="vl">0</span>
<span class="cm">! ... segundos depois, o IOS imprime SOZINHO:</span>
<span class="mark">%OSPF-5-ADJCHG: Process 1, Nbr 10.0.0.1 on GigabitEthernet0/0 from LOADING to FULL, Loading Done</span></div>
</div>

> [!TIP] 💡 Essa linha é o coração da aula
> `from LOADING to FULL` é o OSPF dizendo: "reconheci o vizinho e terminamos de trocar o que cada um
> sabe". **`FULL` é o estado de uma adjacência saudável.** A partir deste segundo, os dois roteadores
> têm o mapa um do outro. Se essa linha não apareceu em nenhum dos dois, pare: ou falta um `network`,
> ou as áreas não batem — e é o que você vai diagnosticar no bloco 2.

<p class="au-pronto"><b>Critério de pronto do bloco 1:</b> a linha <code>%OSPF ... to FULL</code> apareceu (no R1, no R2, ou nos dois), <b>e</b> o <code>show ip ospf neighbor</code> lista o vizinho no estado <code>FULL</code>. Se não apareceu, você tem um defeito para caçar — chame-me antes de refazer tudo.</p>

---

## 📌 2. A prova, e o defeito da área [Mão na massa ⏳ 23 min]

### 2.1 Exercício 4 — as três provas de que funcionou [⏳ 10 min]

Configurar não é funcionar. Três telas, nesta ordem, provam coisas diferentes:

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· 1) o vizinho esta FULL</span></div>
<div class="au-term-b"><span class="ps">R1#</span> <span class="kw">show ip ospf neighbor</span>
Neighbor ID     Pri   State      Dead Time   Address     Interface
<span class="mark">10.0.0.2          1   FULL/BDR    00:00:38   10.0.0.2    GigabitEthernet0/0</span>
<span class="cm">! um vizinho, estado FULL. Se a lista vier vazia, nao ha adjacencia.</span></div>
</div>

> [!NOTE] 👉 Ignore o que vem depois da barra, por hoje
> O `/BDR` (ou `/DR`) ao lado do `FULL` é um **papel** que o OSPF elegeu sozinho neste enlace. O que
> esse papel significa é a aula de amanhã — **por hoje, olhe só a palavra `FULL`**: ela é a prova de
> que o vizinho subiu.

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· 2) a rota da LAN do R2 apareceu sozinha, marcada com O</span></div>
<div class="au-term-b"><span class="ps">R1#</span> <span class="kw">show ip route</span>
<span class="cm">! Codigos: C - connected, L - local, O - OSPF</span>
C    10.0.0.0/24 is directly connected, GigabitEthernet0/0
C    192.168.10.0/24 is directly connected, GigabitEthernet0/1
<span class="mark">O    192.168.20.0/24 [110/2] via 10.0.0.2, 00:02:11, GigabitEthernet0/0</span>
<span class="cm">! a linha O e a rede do R2. Ninguem a digitou -- o OSPF a trouxe.</span></div>
</div>

> [!NOTE] 💼 Pergunta de entrevista
> *"O que significam os números `[110/2]` na linha de uma rota OSPF?"* — O `110` é a **distância
> administrativa** do OSPF (o quanto o IOS confia nessa fonte de rota); o `2` é o **custo acumulado**
> até a rede. Hoje basta reconhecer que a linha `O` carrega esses dois números; **como o custo é
> calculado, e como o OSPF o usa para escolher caminho, é a aula de amanhã.**

<div class="au-term">
<div class="au-term-h"><b>PC-1</b> <span>· 3) o mesmo ping do inicio da aula -- agora passa</span></div>
<div class="au-term-b"><span class="ps">PC&gt;</span> <span class="kw">ping</span> <span class="vl">192.168.20.10</span>
<span class="mark">Reply from 192.168.20.10: bytes=32 time&lt;1ms TTL=126</span>
<span class="cm">! TTL=126: saiu com 128, dois roteadores no caminho, menos 2. Como no Lab 4.</span></div>
</div>

<p class="au-pronto"><b>Critério de pronto do exercício 4:</b> as <b>três</b> telas — vizinho <code>FULL</code>, a rota <code>O</code> na tabela, e o <code>ping</code> entre LANs com <code>Lost = 0</code>. A tabela prova que a rede aprendeu; o <code>ping</code> prova que ela encaminha.</p>

### 2.2 Exercício 5 — quebre a área e veja o silêncio [⏳ 13 min]

Este é o erro conceitual mais comum do OSPF, e você vai **criá-lo de propósito** para reconhecer o
sintoma — que é justamente **não ter sintoma gritado**.

<details class="au-aposta">
<summary>Aposte antes de ver: no R2, você remove o <code>network</code> do link e o recoloca com <code>area 1</code> em vez de <code>area 0</code>. A configuração continua "parecendo certa". O que acontece com a adjacência e com a rota <code>O</code>?</summary>

**A adjacência cai e a rota `O` some.** Os dois roteadores param de ser vizinhos, porque agora estão
em áreas diferentes no mesmo link — e o OSPF **não** forma adjacência entre áreas diferentes no
mesmo enlace. O `show ip ospf neighbor` volta a ficar **vazio**, e a linha `O` desaparece da tabela
do R1.

O que engana é que **nenhuma mensagem de erro aparece**. O comando foi aceito, o prompt voltou
normal, a configuração está lá no `running-config`. Só que não funciona. Quem trata "o comando foi
aceito" como "está certo" fica perdido aqui.</details>

<div class="au-term">
<div class="au-term-h"><b>R2</b> <span>· o defeito: mesma rede, area errada</span></div>
<div class="au-term-b"><span class="ps">R2(config)#</span> <span class="kw">router ospf</span> 1
<span class="ps">R2(config-router)#</span> <span class="kw">no network</span> 10.0.0.0 0.0.0.255 area 0
<span class="ps">R2(config-router)#</span> <span class="kw">network</span> 10.0.0.0 0.0.0.255 <span class="vl">area 1</span>
<span class="ps">R2(config-router)#</span> <span class="kw">end</span>
<span class="ps">R2#</span> <span class="kw">show ip ospf neighbor</span>
<span class="mark">! (vazio -- nenhum vizinho. O R1 sumiu da lista.)</span></div>
</div>

Agora **conserte**: volte o `network` do link para `area 0` no R2. Em segundos a linha
`%OSPF ... to FULL` reaparece e a rota `O` volta sozinha para a tabela do R1 — sem você tocar em mais
nada.

<p class="au-pronto"><b>Critério de pronto do exercício 5:</b> você viu a lista de vizinhos <b>esvaziar</b> com a área errada e <b>repovoar</b> ao corrigir, e sabe dizer em voz alta por que "o comando foi aceito" não quer dizer "a rede funciona".</p>

---

<div class="au-slot">
<b>🔌 Slot interativo — o terceiro roteador</b>

Quem terminar antes acrescenta um **R3** com a sua própria LAN (`192.168.30.0/24`), ligado ao R2
por uma nova rede de link (`10.0.1.0/24`). Ligue o OSPF nele na **área 0** e confira: a LAN do R3
aparece como rota `O` **nos três** roteadores, e o R1 alcança a LAN do R3 mesmo sem estar ligado
direto nele — porque o R2 contou.

<p class="au-slot-b"><b>Plano B — se o AVA não abrir ou a internet do campus cair:</b> o exercício não depende de arquivo nenhum. É só acrescentar o R3 à topologia que já está na sua tela e repetir o par de comandos <code>router ospf 1</code> + os dois <code>network ... area 0</code>.</p>
</div>

---

<div class="au-pratica">
<b>A conferência — os 6 itens que eu passo olhando</b>

Eu passo nas bancadas durante os blocos 1 e 2 e confiro estes seis na sua tela. Todos são
**re-executáveis**: eu peço o comando e leio o resultado, você não precisa ter anotado nada. **Este
lab é formativo — a conferência não vira nota; serve para você sair daqui sabendo que funcionou.**

1. Os dois roteadores com as interfaces usadas em `up/up` e os dois PCs com gateway preenchido.
2. `show ip route` no R1 **antes** do OSPF: só duas linhas `C`, sem a LAN do R2.
3. A linha `%OSPF ... to FULL` apareceu (relato seu, ou o `show ip ospf neighbor` com `FULL`).
4. `show ip ospf neighbor` listando o vizinho em `FULL` nos dois roteadores.
5. `show ip route` no R1 com a rota `O` para `192.168.20.0`, e o `ping` entre LANs com `Lost = 0`.
6. As duas telas do exercício 5 — vizinho vazio com a área errada, vizinho de volta ao corrigir — e você dizendo por que não houve mensagem de erro.

<p class="au-pronto"><b>Critério de pronto:</b> <b>5 dos 6 itens</b> na sua tela. Os itens <b>5 e 6</b> são os que eu mais peço para explicar em voz alta: no 5 a evidência é a rota que <b>apareceu sozinha</b>; no 6 é o silêncio do IOS, que é um sintoma por si só.</p>
</div>

---

<hr class="au-fim-aula">

<div class="au-resumo">
<b>📋 Resumo — a folha de consulta</b>


| O que você quer | O comando | O que procurar |
|---|---|---|
| Ligar o OSPF e anunciar uma rede | `router ospf 1` + `network ... area 0` | aplicado em **cada** roteador, uma `network` por rede |
| O vizinho subiu? | `show ip ospf neighbor` | uma linha com estado `FULL` |
| A rede do outro foi aprendida? | `show ip route` | linha `O` para a LAN do vizinho |
| O caminho funciona de ponta a ponta? | `ping` de uma LAN para a outra | `Lost = 0`; `TTL` cai 1 por roteador no caminho |

| O erro | Como ele se apresenta |
|---|---|
| Áreas diferentes nos dois lados do link | adjacência **não sobe**, `show ip ospf neighbor` vazio, **sem mensagem de erro** |
| Esqueceu o `network` de uma LAN | vizinho sobe, mas aquela LAN não vira rota `O` no outro |
| Link entre roteadores caiu | o vizinho some da lista e a rota `O` desaparece |

</div>

<div class="au-pratica">
<b>📝 Para casa — 7 exercícios (formativos, sem nota)</b>


Faça em casa, no seu Packet Tracer, sobre a topologia de dois roteadores de hoje. Não vale nota —
vale chegar na teórica de amanhã com as perguntas certas. **Traga as dúvidas.**

1. **Refaça do zero**, sem olhar a página: monte os dois roteadores, ligue o OSPF e chegue até a
   rota `O` aparecer. Cronometre — na segunda vez tem de ser mais rápido.
2. **O `show ip route` do R2** (não o do R1): qual rede aparece com `O` nele? Explique por que é a
   LAN do R1, e não a do R2.
3. **Derrube o link** entre R1 e R2 (`shutdown` na `g0/0` do R1). Olhe o `show ip ospf neighbor` e o
   `show ip route` nos dois. O que some, e quanto tempo demora? Religue e cronometre a volta.
4. **Esqueça um `network` de propósito:** no R2, não anuncie a LAN 20. O vizinho sobe? A LAN 20
   aparece no R1? Explique a diferença entre "os roteadores se falam" e "a rede foi anunciada".
5. **Número de processo diferente:** mude o R2 para `router ospf 5` (o R1 fica no `1`). A adjacência
   ainda sobe? Por quê? Compare com o que acontece quando é a **área** que difere (exercício 5 da aula).
6. **Acrescente um terceiro roteador** (o do slot interativo) e confirme que o R1 alcança a LAN do
   R3 sem estar ligado direto nele. Quem "contou" ao R1 que a LAN do R3 existe?
7. **Pergunta para a teórica de amanhã:** na linha `O   192.168.20.0/24 [110/2]`, o `2` é o custo.
   Se houvesse **dois** caminhos do R1 até a LAN 20 — um rápido e um lento — como você acha que o
   OSPF escolheria? Escreva seu palpite e traga; amanhã a gente confere.

</div>

---

<div class="au-reflexao">
<b>🤔 Para pensar até a aula de amanhã</b>


Hoje você ligou o OSPF e a rota do vizinho **apareceu sozinha**. Você não escreveu o caminho —
os roteadores combinaram entre si.

A pergunta que a aula de amanhã responde: quando existe **mais de um** caminho até a mesma rede,
quem decide qual é o melhor, e com base em quê? Você já viu o número do custo (`[110/2]`) passar
na tela hoje. Amanhã ele deixa de ser um número qualquer.

*Não há resposta nesta página de propósito. Traga o seu palpite do exercício 7.*

</div>

---

<div class="au-refs-wrap">
<b>📚 O que sustenta esta prática, com página</b>

<div class="au-refs">

Estas são as referências do bloco de roteamento dinâmico; a teórica de amanhã aprofunda cada uma.

- **KUROSE, J. F.; ROSS, K. W.** *Redes de computadores e a internet: uma abordagem top-down.* 6. ed. São Paulo: Pearson, 2013. <span class="au-pag">seç. 5.3, p. 338–350</span> — algoritmos de roteamento de estado de enlace, a família a que o OSPF pertence. É o **porquê** do que você fez hoje.
- **TANENBAUM, A. S.; FEAMSTER, N.; WETHERALL, D. J.** *Redes de Computadores.* 6. ed. Porto Alegre: Bookman, 2021. <span class="au-pag">seç. 5.2, p. 262–275</span> — roteamento por estado de enlace e a construção do mapa da rede.
- **CISCO NETWORKING ACADEMY.** *CCNA: Enterprise Networking, Security, and Automation (ENSA).* Disponível em: https://www.netacad.com/. Acesso em: 5 out. 2026. <span class="au-pag">módulos de OSPF área única</span> — `router ospf`, `network ... area` e a verificação com `show ip ospf neighbor`. A numeração das subseções **não é citada porque não foi conferida** (o curso exige login): procure pelo título dos tópicos.

</div>
</div>

<div class="au-proxima">
<b>➡️ Na próxima aula (teórica, amanhã)</b>


Você ligou o OSPF e viu a rede aprender sozinha. Amanhã a gente abre a caixa: **como** cada roteador
monta o mapa, o que é o **custo** que apareceu no `[110/2]`, como o OSPF escolhe entre dois caminhos,
e por que existem **áreas**. Tudo o que hoje você só viu acontecer, amanhã passa a ter explicação.

</div>

</div>
