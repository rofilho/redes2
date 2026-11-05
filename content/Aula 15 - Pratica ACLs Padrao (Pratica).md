---
title: "Prática S15 — ACL padrão no Packet Tracer: a wildcard com as mãos, e o filtro no lugar certo"
publicar: true
tags: [redes2, {{PERIODO}}, pratica, acl, wildcard, posicionamento]
---

<div class="au-leitura" data-aula="s15p">

# 🟢 Prática S15 — ACL padrão no Packet Tracer: a wildcard com as mãos, e o filtro no lugar certo

**Disciplina:** {{CODIGO}} — Redes de Computadores II — Uniube<br>
**Professor:** Romualdo Mathias Filho · **romualdo.filho@uniube.br**<br>
**Semana:** S15 · **Formato:** prática em Packet Tracer · 75 min · **não-avaliativa (sem nota)**<br>
**Turma:** P12 quinta · VIA216<br>
**Pré-requisito:** a teórica da terça (Aula 15 — ACLs padrão: lógica, wildcard e posicionamento)<br>
**Tempo:** entrada 5 min · caminho 5 · tópicos 52 · slot 3 · fechamento 5 · folga 5

---

<div class="au-caminho">
<b>Nosso caminho até aqui [⏳ 5 min]</b>

Tente responder de cabeça. Depois abra e confira.

<details>
<summary>No PAT, o que distingue a conexão de cada máquina?</summary>

**A porta.** Cada conexão ganha uma porta própria na tabela de tradução, como `IPpúblico:40001` e `IPpúblico:40002`.

</details>

<details>
<summary>Qual é a máscara da rede /26, em decimal?</summary>

**255.255.255.192.** Guarde este número: daqui a pouco você vai virá-lo do avesso.

</details>

<details>
<summary>Depois do primeiro match, o roteador continua lendo a ACL?</summary>

**Não.** Ele lê de cima para baixo e para no primeiro match.

</details>
</div>

<figure class="au-fig">
<img src="assets/aula15_pratica_topologia.svg" alt="O roteador R1 no centro liga tres redes: Alunos 192.168.10.0/24 na g0/0, Professores 192.168.20.0/24 na g0/1 e Servidores 192.168.30.0/24 na g0/2. Ainda nao ha nenhuma ACL.">
<figcaption class="au-legenda">A topologia de hoje: um roteador e três redes, uma em cada porta Gigabit. Sem ACL, tudo fala com tudo. A pergunta da aula é <b>em qual porta</b> e <b>em qual sentido</b> o filtro deve ficar.</figcaption>
</figure>

> [!INFO] 🎯 O que você leva desta prática
> - Ler e escrever uma **wildcard mask** sem decorar: com post-it, com CEP e com bloco de cadeiras.
> - Escrever uma ACL padrão, **aplicar** na interface e **provar** que ela filtra pelo contador de match.
> - Ver com os próprios olhos o que acontece quando a ACL vai para o lugar errado, quando a ordem das linhas está trocada e quando falta o `permit`.
>
> **📂 Recursos**
> - [Manual do IOS no Packet Tracer](./Manual-do-IOS-no-Packet-Tracer) — comandos do semestre por tema
> - Teórica de terça: [Aula 15 — ACLs padrão](./Aula-15---ACLs-Padrao-Logica-Wildcard-e-Posicionamento-(Teorica))
> - Um **post-it** ou um pedaço de papel (sério: é material do Exercício 1)

---

## 📌 1. A wildcard sem decoreba: o que conferir e o que tanto faz [Conceito ⏳ 15 min]

### 1.1 A ideia em uma frase

A wildcard responde a uma pergunta só: **"quais partes do endereço eu confiro, e quais eu deixo pra lá?"**

| Na wildcard | Quer dizer | No IP `192.168.10.50` com wildcard `0.0.0.255` |
| :-- | :-- | :-- |
| **0** | confere: tem de ser igual | `192`, `168` e `10` têm de bater |
| **255** (bit 1) | tanto faz: pode ser qualquer coisa | o `50` pode ser qualquer número de 0 a 255 |

### 1.2 Três analogias que você pode tocar

> [!TIP] 💡 O endereço de casa
> "Entregue na **Rua das Flores**, em **qualquer número**." A rua confere, o número tanto faz.
> No IP é igual: `192.168.10.0 0.0.0.255` quer dizer "os três primeiros pedaços conferem (`192.168.10`), o último tanto faz". É **qualquer casa da rua 192.168.10**, ou seja, a rede inteira.

> [!TIP] 💡 O CEP
> Um CEP como `38400-123` tem uma parte que diz a região e uma parte que diz a rua. Se você quer "**todo mundo da região 38400**", você confere os cinco primeiros dígitos e ignora os três últimos: `38400-xxx`.
> A wildcard é o seu "xxx": ela marca **onde vai o x**.

> [!TIP] 💡 A portaria do condomínio
> O porteiro recebe a ordem: "a encomenda é para **o Bloco B, qualquer apartamento**". Ele confere o bloco e não liga para o número do apartamento. Se a ordem fosse "**Bloco B, apartamento 50**", ele conferiria os dois.
> Como no IP, o que se confere vem **primeiro** e o que tanto faz vem **no fim**. Bloco inteiro = `0.0.0.255`. Um apartamento só = `0.0.0.0`, ou a palavra `host`.

| A ordem | O que confere | O que tanto faz | No IP |
| :-- | :-- | :-- | :-- |
| "a rua toda", "o CEP 38400-xxx", "o Bloco B inteiro" | o começo | o fim | `192.168.10.0 0.0.0.255` |
| "só a casa 50", "só o apto 50" | tudo | nada | `host 192.168.10.50` |

### 1.3 Exercício 1 — o post-it em cima do IP [⏳ 5 min]

Escreva num papel, em letra grande, os quatro pedaços de um endereço: `192 . 168 . 10 . 50`. Agora use o post-it (ou o dedo) para **tapar o que tanto faz**:

| A wildcard é | Você tapa | O que sobra visível | Quem casa |
| :-- | :-- | :-- | :-- |
| `0.0.0.0` | nada | `192.168.10.50` | só esse host |
| `0.0.0.255` | o último pedaço | `192.168.10.__` | a rede inteira dos Alunos |
| `0.0.255.255` | os dois últimos | `192.168.__.__` | Alunos, Professores **e** Servidores |
| `255.255.255.255` | tudo | `__.__.__.__` | qualquer um (a palavra `any`) |

**A regra do post-it:** onde a wildcard tem **255**, cola o post-it. O que fica visível é o que a ACL confere.

<p class="au-pronto"><b>Pronto quando:</b> você olha para <code>0.0.0.255</code> e diz, sem conta, "confere os três primeiros, ignora o último".</p>

### 1.4 Por que ela é "ao contrário" da máscara

A máscara e a wildcard respondem a **perguntas diferentes**:

| | A pergunta | Onde põe o número grande |
| :-- | :-- | :-- |
| **Máscara** `255.255.255.0` | "qual parte é o **nome da rede**?" | na parte da rede |
| **Wildcard** `0.0.0.255` | "qual parte eu **ignoro**?" | na parte que tanto faz |

Mesma régua, olhada de lados opostos. Por isso a conta é sempre a mesma: **255.255.255.255 menos a máscara**.

<details class="au-aposta">
<summary>Aposte: um colega trocou as bolas e escreveu a <b>máscara</b> no lugar da wildcard: <code>access-list 10 deny 192.168.10.0 255.255.255.0</code>, mais o <code>permit any</code>, na saída da g0/2. O PC-Aluno1 (.11) chega ao servidor?</summary>

**Chega.** Lida como wildcard, `255.255.255.0` manda **tapar os três primeiros pedaços** e **conferir o último**. Faça com o post-it: sobra visível só o `.0`. A linha passa a casar com qualquer endereço terminado em `.0`, e o `.11` escapa. O colega queria barrar a rede inteira e não barrou quase nada.

</details>

### 1.5 Exercício 2 — e quando o corte cai no meio do pedaço? [⏳ 5 min]

Com /24 o post-it tapa um pedaço inteiro. Com **/26** o corte cai **dentro** do último pedaço. A saída é pensar em **blocos de cadeiras**:

> [!NOTE] 📖 O auditório de 256 cadeiras
> O último pedaço do IP vai de 0 a 255: são 256 cadeiras. O tamanho do bloco sai da máscara: **256 menos o último número dela**. Para /26 (`255.255.255.192`): 256 − 192 = **64**. O auditório fica dividido em blocos de 64 (0–63, 64–127, 128–191, 192–255).
> O endereço que vai na ACL é a **primeira cadeira do bloco**. A wildcard diz **quanto você pode andar a partir dela**: de 0 a 63, ou seja, `63`. As 64 cadeiras do bloco casam.
> Exemplos: o primeiro bloco é `192.168.10.0 0.0.0.63`; o segundo é `192.168.10.64 0.0.0.63`. Confira pela outra conta: 255 − 192 = **63**.

Agora no papel, sem o Packet Tracer. Para cada linha: tamanho do bloco (256 menos o último número da máscara), depois a wildcard (bloco menos 1).

| Você quer casar | Máscara | Wildcard |
| :-- | :-- | :-- |
| a sub-rede `192.168.10.16/28` | 255.255.255.240 | ? |
| a sub-rede `192.168.10.32/27` | 255.255.255.224 | ? |
| o link `10.0.0.0/30` | 255.255.255.252 | ? |
| a rede `192.168.10.0/24` | 255.255.255.0 | ? |

<details>
<summary>Confira as respostas</summary>

Blocos de 16, 32, 4 e 256. Wildcards: `0.0.0.15` · `0.0.0.31` · `0.0.0.3` · `0.0.0.255`. Sempre o tamanho do bloco menos 1.

</details>

<p class="au-pronto"><b>Pronto quando:</b> você acerta as quatro e explica uma delas para o colega com o auditório, sem falar em bit.</p>

---

## 📌 2. A primeira ACL: proteger os servidores [Mão na massa ⏳ 25 min]

### 2.1 Exercício 3 — monte a rede e registre o "antes" [⏳ 8 min]

Monte a topologia da figura. Use um roteador **2911** (ele tem as portas `g0/0`, `g0/1` e `g0/2`). Cada caixa verde da figura é uma rede: ponha nela um switch **2960** ligando as máquinas ao roteador.

| Rede | Interface do R1 | Endereço do R1 | Máquinas |
| :-- | :-- | :-- | :-- |
| **Alunos** | `g0/0` | `192.168.10.1 /24` | PC-Aluno1 `192.168.10.11` · PC-Aluno2 `192.168.10.50` |
| **Professores** | `g0/1` | `192.168.20.1 /24` | PC-Prof `192.168.20.11` |
| **Servidores** | `g0/2` | `192.168.30.1 /24` | Servidor (Server-PT) `192.168.30.10` |

Cada máquina leva IP, máscara `255.255.255.0` e **gateway** no endereço do R1 da sua rede.

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· as tres redes ligadas ao roteador</span></div>
<div class="au-term-b"><span class="ps">R1(config)#</span> <span class="kw">interface</span> <span class="vl">g0/0</span>
<span class="ps">R1(config-if)#</span> <span class="kw">ip address</span> 192.168.10.1 <span class="vl">255.255.255.0</span>
<span class="ps">R1(config-if)#</span> <span class="kw">no shutdown</span>
<span class="cm">! repita na g0/1 (192.168.20.1) e na g0/2 (192.168.30.1)</span></div>
</div>

> [!WARNING] ⚠️ O primeiro ping pode perder um pacote
> Na primeira vez, o PC ainda está descobrindo o endereço físico do gateway (o ARP). É normal o primeiro dos quatro pacotes falhar. Rode o ping de novo antes de concluir qualquer coisa.

<p class="au-pronto"><b>Pronto quando:</b> o PC-Aluno1 pinga o Servidor <b>e</b> o PC-Prof. Esse é o "antes". Sem ele, você não sabe se quem bloqueou foi a ACL ou um erro de endereço.</p>

### 2.2 Exercício 4 — barre os alunos, só no caminho do servidor [⏳ 10 min]

**A política:** a rede dos **Alunos** não alcança a rede dos **Servidores**. Todo o resto continua funcionando.

Os comandos de hoje:

| Comando | Onde | O que faz |
| :-- | :-- | :-- |
| `access-list 10 {permit\|deny} <origem> <wildcard>` | configuração global | cria uma linha da ACL 10 |
| `ip access-group 10 {in\|out}` | dentro da interface | **aplica** a ACL, no sentido escolhido |
| `show access-lists` | modo privilegiado | linhas, na ordem, com o **contador de match** |
| `show ip interface <int>` | modo privilegiado | mostra se há ACL aplicada, e em que sentido |

A lista é esta: `access-list 10 deny 192.168.10.0 0.0.0.255` e `access-list 10 permit any` (a rua 192.168.10, qualquer número, fica de fora; o resto passa).

<details class="au-aposta">
<summary>Aposte antes de digitar: em qual interface do R1, e em qual sentido (<code>in</code> ou <code>out</code>), vai a ACL?</summary>

**Na `g0/2`, sentido `out`.** A `g0/2` é a porta dos Servidores, o **destino**. O tráfego dos alunos **sai** do R1 por ela para chegar lá. A ACL padrão só enxerga a origem, então ela espera chegar na porta do destino para decidir.

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· cria a ACL 10 e aplica na saida para os servidores</span></div>
<div class="au-term-b"><span class="ps">R1(config)#</span> <span class="kw">access-list</span> 10 <span class="kw">deny</span> 192.168.10.0 <span class="vl">0.0.0.255</span>
<span class="ps">R1(config)#</span> <span class="kw">access-list</span> 10 <span class="kw">permit any</span>
<span class="ps">R1(config)#</span> <span class="kw">interface</span> <span class="vl">g0/2</span>
<span class="ps">R1(config-if)#</span> <span class="kw">ip access-group</span> 10 <span class="kw">out</span>
<span class="cm">! deny: rua 192.168.10, qualquer numero. permit any: o resto passa</span></div>
</div>

</details>

Teste os três pings e anote cada resultado:

| Ping | Deve | Por quê |
| :-- | :-- | :-- |
| PC-Aluno1 → Servidor | **falhar** | casa no `deny` da rede dos alunos |
| PC-Prof → Servidor | **passar** | não casa no `deny`, casa no `permit any` |
| PC-Aluno1 → PC-Prof | **passar** | esse tráfego não sai pela `g0/2`; a ACL nem é consultada |

> [!NOTE] 📖 Como a falha aparece na tela
> O ping barrado costuma voltar como **`Destination host unreachable`**, respondido pelo próprio R1, e não como `Request timed out`. Não confunda com erro de rota: é o roteador avisando que barrou. A prova está no contador, logo abaixo.

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· o contador de match mostra quem casou em cada linha</span></div>
<div class="au-term-b"><span class="ps">R1#</span> <span class="kw">show access-lists</span>
<span class="ps">R1#</span> <span class="kw">show ip interface</span> <span class="vl">g0/2</span>
<span class="cm">! procure: as duas linhas com (N match(es)) e "Outgoing access list is 10"</span></div>
</div>

<p class="au-pronto"><b>Pronto quando:</b> os três pings deram o resultado da tabela e você aponta, no <code>show access-lists</code>, o contador da linha <code>deny</code> que subiu com o ping do aluno.</p>

### 2.3 Exercício 5 — e se a ACL ficasse na porta dos alunos? [⏳ 7 min]

Tire a ACL da `g0/2` e aplique na **entrada** da `g0/0`, a porta dos alunos:

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· move a mesma ACL para a porta da origem</span></div>
<div class="au-term-b"><span class="ps">R1(config)#</span> <span class="kw">interface</span> <span class="vl">g0/2</span>
<span class="ps">R1(config-if)#</span> <span class="kw">no ip access-group</span> 10 <span class="kw">out</span>
<span class="ps">R1(config-if)#</span> <span class="kw">interface</span> <span class="vl">g0/0</span>
<span class="ps">R1(config-if)#</span> <span class="kw">ip access-group</span> 10 <span class="kw">in</span>
<span class="cm">! no ip access-group tira a ACL da interface; a lista continua existindo</span></div>
</div>

<details class="au-aposta">
<summary>Aposte antes de testar: com a ACL na entrada da g0/0, o PC-Aluno1 ainda pinga o PC-Prof?</summary>

**Não.** Todo pacote dos alunos **entra** no R1 pela `g0/0` e casa no `deny` logo ali, seja qual for o destino. Você queria proteger o servidor e isolou os alunos da rede inteira. É por isso que a ACL padrão vai **perto do destino**: ela não sabe para onde o pacote vai.

</details>

Confirme com o ping PC-Aluno1 → PC-Prof. Depois **desfaça**: `no ip access-group 10 in` na `g0/0` e `ip access-group 10 out` de volta na `g0/2`.

---

## 📌 3. Ordem das linhas e o fim da lista [Mão na massa ⏳ 12 min]

### 3.1 Exercício 6 — a exceção: o PC-Aluno2 pode chegar ao servidor [⏳ 7 min]

**A política nova:** os alunos continuam barrados, **menos** o PC-Aluno2 (`192.168.10.50`), que precisa chegar ao servidor.

**Escreva você a ACL 10 nova** antes de abrir a resposta. Duas dicas: numa ACL numerada, o caminho mais simples é apagar a lista inteira (`no access-list 10`) e escrever de novo; e pense no porteiro: quem ele precisa conferir primeiro?

<details>
<summary>Abra só depois de escrever a sua</summary>

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· a excecao antes da regra geral</span></div>
<div class="au-term-b"><span class="ps">R1(config)#</span> <span class="kw">no access-list</span> 10
<span class="ps">R1(config)#</span> <span class="kw">access-list</span> 10 <span class="kw">permit host</span> 192.168.10.50
<span class="ps">R1(config)#</span> <span class="kw">access-list</span> 10 <span class="kw">deny</span> 192.168.10.0 <span class="vl">0.0.0.255</span>
<span class="ps">R1(config)#</span> <span class="kw">access-list</span> 10 <span class="kw">permit any</span>
<span class="cm">! o ip access-group da g0/2 continua apontando para a 10</span></div>
</div>

**Por que nessa ordem:** o `.50` também é da rua `192.168.10`. Se o `deny` da rede viesse primeiro, ele casaria ali e o roteador pararia de ler. A exceção nunca seria vista.

</details>

Teste: PC-Aluno2 → Servidor **passa**; PC-Aluno1 → Servidor **falha**. Confira no `show access-lists` qual linha contou cada ping.

### 3.2 Exercício 7 — e se a lista tivesse só as duas primeiras linhas? [⏳ 5 min]

Você vai apagar a ACL 10 e escrever de novo **só as duas primeiras linhas** do Exercício 6 (o `permit host` e o `deny` da rede), sem o `permit any`.

> [!WARNING] ⚠️ A armadilha do `no` numa ACL numerada
> `no access-list 10 permit any` **não** apaga só essa linha: apaga a **lista inteira**. A interface fica apontando para uma lista vazia, e tudo passa. Para este exercício, use `no access-list 10` e escreva as duas linhas de novo.

<details class="au-aposta">
<summary>Aposte antes de testar: com só essas duas linhas, o PC-Prof ainda chega ao servidor?</summary>

**Não.** O PC-Prof não casa no `permit host .50` nem no `deny` dos alunos. Ele desce a lista inteira sem casar e cai no **deny implícito**, a linha `deny any` que não aparece mas está sempre no fim. Sem o `permit any`, a ACL barra todo mundo, menos o `.50`.

</details>

Agora teste PC-Prof → Servidor e confira a sua aposta. Depois **devolva** a lista completa do Exercício 6.

---

<div class="au-slot">
<b>🔌 Slot interativo — a turma inteira, 3 minutos antes do fechamento</b>

Eu escrevo no quadro uma wildcard por vez: `0.0.0.0`, `0.0.0.255`, `0.0.255.255`, `0.0.0.63`. Para cada uma, todo mundo levanta o post-it e mostra **quantos pedaços tapou** (zero, um, dois, ou "um pedaço em parte"). Quem errou explica para o vizinho com o auditório de cadeiras.

<p class="au-slot-b"><b>Plano B — se faltar post-it:</b> mão levantada com os dedos: zero dedo para "tapei nada", um dedo para "um pedaço", dois para "dois pedaços" e a mão de lado para "pedaço em parte".</p>
</div>

---

<div class="au-pratica">
<b>A conferência — os 5 itens que eu passo olhando</b>

Eu passo nas bancadas e peço o comando na hora. **Esta prática não vale nota**: a conferência serve para você sair daqui sabendo que funcionou.

1. Você explica `0.0.0.255` e `0.0.0.63` sem conta, com o post-it ou o auditório.
2. A ACL 10 na `g0/2` `out`: aluno não chega ao servidor, professor chega, aluno ainda chega ao professor.
3. `show access-lists` com o contador do `deny` subindo pelo ping do aluno.
4. Você explica, em voz alta, por que a ACL na entrada da `g0/0` isolou os alunos da rede inteira.
5. A exceção do PC-Aluno2 funcionando, com o `permit host` **antes** do `deny` da rede.

<p class="au-pronto"><b>Critério de pronto:</b> 4 dos 5 itens. Os itens 1 e 4 são os que eu mais peço para explicar.</p>
</div>

---

<hr class="au-fim-aula">

<div class="au-resumo">
<b>📋 O que você viu acontecer hoje [⏳ 5 min]</b>

Tente explicar cada linha antes de abrir.

<details>
<summary>O post-it tapou o último pedaço, e a ACL passou a valer para a rede inteira dos Alunos.</summary>

Wildcard `255` = tanto faz. Tapar o último pedaço é dizer "qualquer número desta rua".

</details>

<details>
<summary>No /26, a wildcard deu 63, e não 64.</summary>

O bloco tem 64 cadeiras (256 − 192). O endereço da ACL é a primeira cadeira, e a wildcard é quanto se anda a partir dela: de 0 a 63.

</details>

<details>
<summary>O ping do aluno para o servidor falhou, mas o do aluno para o professor passou.</summary>

A ACL estava na saída `g0/2`. Só o que sai para os Servidores é conferido.

</details>

<details>
<summary>Na entrada da g0/0, a mesma ACL isolou os alunos de tudo.</summary>

A ACL padrão só vê a origem. Perto da origem, ela barra o aluno para qualquer destino.

</details>

<details>
<summary>Sem o permit any, até o professor ficou de fora.</summary>

Quem não casa em nenhuma linha cai no deny implícito do fim da lista.

</details>

| O erro clássico | A correção |
|---|---|
| "criei a ACL e nada mudou" | faltou o `ip access-group` na interface |
| "a rede inteira parou" | faltou o `permit any`; o deny implícito barrou o resto |
| "a exceção não funciona" | a exceção está **depois** da regra geral |
| "os alunos não acessam mais nada" | a ACL padrão foi aplicada perto da **origem** |
| "achei que `0.0.0.255` fosse máscara" | é o contrário: 255 = tanto faz, 0 = confere |

</div>

<div class="au-pratica">
<b>📝 Para casa — 4 exercícios (sem nota)</b>

Faça no seu Packet Tracer, sobre a topologia de hoje. **Traga as dúvidas.**

1. **Refaça do zero**, sem olhar a página: as três redes, a ACL 10 e a exceção do PC-Aluno2.
2. **Meio auditório:** barre só a metade de baixo da rede dos alunos (`192.168.10.0/25`). Qual o tamanho do bloco, e qual a wildcard? O PC-Aluno2 (`.50`) cai dentro ou fora?
3. **Sentido trocado:** aplique a ACL 10 na `g0/2` com `in` em vez de `out`. O ping do aluno para o servidor ainda falha? Por quê?
4. **Pergunta para a próxima aula:** a política "os alunos chegam ao servidor, mas só na página web" dá para escrever com uma ACL padrão? O que falta ela saber?

<p class="au-pronto"><b>Pronto quando:</b> você resolveu os quatro e trouxe por escrito a resposta do 4.</p>
</div>

---

<div class="au-reflexao">
<b>🤔 Para pensar até a próxima aula</b>

No Exercício 6 você apagou a ACL inteira para pôr uma linha no topo. Numa rede de produção, entre o `no access-list 10` e a última linha reescrita, a interface fica apontando para uma lista vazia ou incompleta. **O que acontece com o tráfego nesses segundos?** Que outro jeito de editar a lista evitaria esse buraco?

*Não há resposta nesta página de propósito.*

</div>

---

<div class="au-refs-wrap">
<b>📚 O que sustenta esta prática</b>

<div class="au-refs">

- **CISCO SYSTEMS.** *Configure IP Access Lists.* Documento 23602. Atualizado em 15 out. 2025. Disponível em: [cisco.com](https://www.cisco.com/c/en/us/support/docs/security/ios-firewall/23602-confaccesslists.html). Acesso em: 5 nov. 2026. <span class="au-pag">seções "Process ACLs", "Masks" e "Standard ACLs"</span> — leitura de cima para baixo até o primeiro match, deny implícito no fim, a máscara invertida (wildcard) e a sintaxe da ACL padrão.
- **CISCO SYSTEMS.** *Configure IP Access Lists.* Documento 23602 (mesmo endereço). <span class="au-pag">seções "Apply ACLs" e "Define In, Out, Inbound, Outbound, Source, and Destination"</span> — o `ip access-group` e o sentido `in`/`out`. A regra "ACL padrão perto do destino" vem da teórica de terça; este documento não a trata.
- **CISCO SYSTEMS.** *Configure IP Access Lists.* Documento 23602 (mesmo endereço). <span class="au-pag">seção "Edit ACLs"</span> — numa ACL numerada, o `no` de uma linha apaga a lista inteira.

</div>
</div>

<div class="au-proxima">
<b>➡️ Na próxima aula</b>

Hoje a ACL só perguntou "de onde você veio?". Na terça entram as **ACLs estendidas**, que olham origem, destino e porta, e vão para perto da **origem**. Depois delas, o **Lab 9**: ACL estendida e segurança de porta no switch (port security).

</div>

</div>
