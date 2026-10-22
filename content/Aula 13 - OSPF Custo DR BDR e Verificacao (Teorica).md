---
title: "Aula 13 - OSPF: custo, DR/BDR e verificação"
publicar: true
tags: [redes2, {{PERIODO}}, aula13, ospf, custo, dr-bdr, verificacao]
---

<div class="au-leitura" data-aula="s13t">

# 🟢 Aula 13 — OSPF: custo, DR/BDR e a hora de conferir

**Disciplina:** {{CODIGO}} — Redes de Computadores II — Uniube<br>
**Professor:** Romualdo Mathias Filho · **romualdo.filho@uniube.br**<br>
**Data:** Terça, {{PERIODO}} · **VIA203** · 📘 Teórica (75 min)<br>
**Turmas práticas:** P11 segunda · VIA215 — P12 quinta · VIA216<br>
**Página de referência:** [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato)

---

<div class="au-caminho">
<b>Nosso caminho até aqui</b>

Tente responder de cabeça. Depois abra e confira. Tudo isto veio da Aula 11 — é o chão sobre o qual
a aula de hoje se apoia.

<details>
<summary>O OSPF escolhe o caminho pelo número de saltos?</summary>

**Não.** Ele escolhe pelo **menor custo acumulado**. Contar saltos é o RIP (Routing Information
Protocol), não o OSPF (Open Shortest Path First).

</details>

<details>
<summary>De onde o OSPF tira o custo de um enlace?</summary>

**Da largura de banda do link.** Quanto mais rápido o link, menor o custo. Hoje você vê a fórmula
exata.

</details>

<details>
<summary>O que a área 0 (backbone) tem de especial?</summary>

**É a espinha dorsal:** toda outra área precisa se conectar a ela. No seu Lab 6 a rede inteira era
área única (área 0), porque com poucos roteadores não há motivo para dividir.

</details>
</div>

> [!INFO] 🎯 O que você leva desta aula
> - A **fórmula do custo** — referência ÷ largura de banda — e por que o menor custo acumulado nem
>   sempre é o de menos saltos.
> - Por que, numa rede **multiacesso**, nasce a eleição de **DR** (Designated Router) e **BDR**
>   (Backup Designated Router), e qual é o critério.
> - Os **quatro comandos** `show` que confirmam o OSPF na CLI Cisco — e o que **cada um** prova.
>
> **📂 Recursos**
> - [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato) — calendário, notas, prazos e regras
> - [Manual do IOS no Packet Tracer](./Manual-do-IOS-no-Packet-Tracer) — comandos do semestre por tema
> - **Packet Tracer** — o **Lab 7 (OSPF)** desta semana é o chão prático desta aula

---

## 📌 1. Por que o custo importa: dois caminhos, um com mais saltos [Fundamentação ⏳ 10 min]

Antes de qualquer fórmula, a pergunta que o custo responde: **por que não escolher o caminho com
menos roteadores no meio?** Parece o mais óbvio — menos paradas, caminho mais curto. E é
exatamente aqui que o OSPF (Open Shortest Path First) discorda da intuição.

Imagine dois caminhos do seu roteador até a mesma rede de destino:

- **Caminho A:** um único salto, direto, por um link de **10 Mbps** (lento, antigo).
- **Caminho B:** dois saltos, passando por um roteador intermediário, mas por links de **1 Gbps**
  (cem vezes mais rápidos).

Quem conta **saltos** escolhe o A — menos roteadores no meio. Mas o A é um cano estreito: todo o
tráfego se arrasta pelos 10 Mbps. O B tem uma parada a mais, e ainda assim entrega muito mais
rápido, porque a banda é o que de fato limita. **O OSPF escolhe o B.**

![[assets/aula13_custo.svg]]
> *Figura 1: dois caminhos até o mesmo destino — o OSPF escolhe o de menor custo acumulado, não o de menos saltos.*

É essa a troca que o **custo** expressa em número: ele transforma "quão rápido é o link" num valor
que o OSPF soma ao longo do caminho. O caminho vencedor é o de **menor custo acumulado** — a soma
dos custos de todos os links percorridos.

> [!WARNING] ⚠️ Menos saltos não é melhor caminho
> O erro clássico de prova e de entrevista: achar que roteamento sempre pega "o caminho mais curto
> em número de roteadores". O OSPF **não** faz isso — ele soma **custos**, e custo vem de banda.
> Um atalho por um link de 10 Mbps perde para um desvio por dois links de 1 Gbps. Quem confunde
> isso está pensando em **RIP** (Routing Information Protocol), um protocolo mais antigo que só
> sabia contar saltos.

Guardado o porquê, agora o **como**: de onde sai esse número.

---

## 📌 2. A fórmula do custo: referência ÷ largura de banda [Teoria ⏳ 14 min]

O OSPF não inventa o custo no olho — ele **calcula** a partir da largura de banda do enlace, com
uma fórmula fixa:

> **custo = largura de banda de referência ÷ largura de banda do enlace**

A **largura de banda de referência** (*reference bandwidth*) é, por padrão na Cisco, **100 Mbps**
(`10^8` bits/s). Divide-se esse valor pela banda do link, e o resultado — arredondado para baixo,
com mínimo de 1 — é o custo daquele enlace.

Veja a conta rodando para os links que você encontra no laboratório:

| Tipo de enlace | Largura de banda | Conta (100 Mbps ÷ banda) | Custo OSPF |
| :-- | :-- | :-- | :-- |
| Ethernet | 10 Mbps | 100 ÷ 10 | **10** |
| Fast Ethernet | 100 Mbps | 100 ÷ 100 | **1** |
| Gigabit Ethernet | 1000 Mbps | 100 ÷ 1000 = 0,1 → mínimo | **1** |
| 10 Gigabit | 10 000 Mbps | 100 ÷ 10000 → mínimo | **1** |
| Serial (T1) | 1,544 Mbps | 100 ÷ 1,544 ≈ 64,7 | **64** |

> [!WARNING] ⚠️ O ponto cego da referência padrão
> Repare nas três últimas linhas: Gigabit, 10 Gigabit e qualquer coisa acima de 100 Mbps **empatam
> em custo 1**. Com a referência padrão de 100 Mbps, o OSPF **não distingue** um link de 1 Gbps de
> um de 10 Gbps — para ele, ambos custam 1. Em redes modernas isso é um problema, e a solução é
> elevar a largura de banda de referência com `auto-cost reference-bandwidth` (assunto de
> aprofundamento; hoje basta saber **por que** a referência padrão fica curta).

Agora o custo **acumulado**: o OSPF soma o custo de cada link no caminho, de ponta a ponta.

> [!TIP] 💡 Lendo o custo acumulado na tabela
> Lembra do `[110/2]` que apareceu na sua tabela de rotas no Lab 6? O **2** era o **custo
> acumulado** até a rede de destino — dois links Fast Ethernet (1 + 1). O **110** é a *distância
> administrativa* do OSPF (a "confiança" no protocolo), que é outra conversa. O que importa aqui é
> o segundo número: ele é a soma dos custos que a Figura 1 explica.

Volte à Figura 1 com a fórmula na mão: o Caminho A (10 Mbps, um salto) custa **10**; o Caminho B
(dois links Gigabit, dois saltos) custa **1 + 1 = 2**. O OSPF escolhe o de custo **2** — o de
**mais** saltos. A fórmula é, no fim, só o apelido matemático da intuição "banda importa mais que
distância".

---

## 📌 3. DR e BDR: por que uma rede multiacesso elege um porta-voz [Teoria ⏳ 18 min]

Até aqui, pensamos em links ponto a ponto: um roteador de cada lado. Mas e quando **vários**
roteadores estão no **mesmo** segmento — todos ligados ao mesmo switch, na mesma rede Ethernet?
Isso é uma **rede multiacesso** (*multi-access network*), e ela cria um problema que o OSPF precisa
resolver.

### 3.1 O caos de todos conversarem com todos

O OSPF forma **adjacências** entre vizinhos para trocar o mapa (os LSAs — *Link-State
Advertisements*). Num segmento com **n** roteadores, se cada um formasse adjacência plena com todos
os outros, o número de relações cresceria como `n × (n − 1) ÷ 2`:

| Roteadores no segmento | Adjacências se "todos com todos" |
| :-- | :-- |
| 2 | 1 |
| 4 | 6 |
| 6 | 15 |
| 10 | 45 |

Cada adjacência é troca de LSA, sincronização de banco, mensagens de controle. A conta explode, e
a maior parte dessa conversa é **redundante**: todos no mesmo segmento estão vendo a mesma rede.

![[assets/aula13_dr_bdr.svg]]
> *Figura 2: numa rede multiacesso, a eleição de DR e BDR evita o caos de todos conversarem com todos.*

### 3.2 A solução: eleger um porta-voz

O OSPF resolve elegendo, naquele segmento, um **DR** (Designated Router) — o porta-voz. A regra
passa a ser:

- Todo roteador do segmento forma adjacência **plena só com o DR** (e com o BDR, abaixo).
- O DR coleta os LSAs e **os redistribui** para o segmento inteiro.
- Entre si, os roteadores comuns ficam em estado `2-WAY` — se conhecem, mas não trocam o banco
  completo. Não precisam: o DR faz a ponte.

E se o DR cair? Para não refazer a eleição no susto, elege-se junto um **BDR** (Backup Designated
Router): ele ouve tudo o que o DR faz e assume na hora se o DR falhar. Promoção imediata, sem
eleição nova no momento crítico.

> [!NOTE] 📖 O endereço 224.0.0.6
> Os roteadores comuns (nem DR, nem BDR) falam com o DR e o BDR por um endereço multicast
> reservado: **224.0.0.6** — "todos os roteadores DR/BDR deste segmento". Já o DR fala com todo
> mundo por **224.0.0.5** ("todos os roteadores OSPF"). Essa separação é o que faz a economia
> funcionar: o DR não precisa mandar mensagem individual para cada roteador.

### 3.3 O critério da eleição: prioridade, depois Router ID

Quem vira DR? A eleição segue uma ordem simples e determinística:

| Ordem | Critério | Regra |
| :-- | :-- | :-- |
| 1º | **Prioridade de interface** OSPF | **Maior** prioridade vence (padrão: 1; faixa 0–255) |
| 2º (desempate) | **RID** (Router ID) | Com prioridades iguais, vence o **maior** RID |
| — | Prioridade **0** | O roteador **não participa** — nunca será DR nem BDR |

O **RID** (Router ID) é o identificador único do roteador no OSPF — por padrão, o maior endereço IP
de uma interface *loopback*, ou, na falta dela, o maior IP de interface ativa. O roteador com a
**maior prioridade** vence; empatou, **o maior RID** desempata. O segundo colocado nessa mesma
disputa fica como BDR.

> [!WARNING] ⚠️ O DR não é o "melhor" roteador — e não há reeleição automática
> Dois enganos comuns: **(1)** achar que o DR é o roteador mais rápido ou central. Não é — é só
> quem ganhou no critério prioridade/RID, que nada tem a ver com desempenho. **(2)** achar que, se
> um roteador melhor entra depois no segmento, ele "toma" o posto. **Não toma.** O OSPF é *não
> preemptivo*: quem é DR continua DR até cair, mesmo que chegue alguém com prioridade maior. A
> troca só acontece quando o DR atual sai do ar.

> [!TIP] 💡 Onde há DR/BDR e onde não há
> A eleição só faz sentido em rede **multiacesso** (Ethernet, vários roteadores no mesmo switch).
> Num link **ponto a ponto** (só dois roteadores) **não há** eleição de DR/BDR — com dois, não há
> caos a conter, e eles formam adjacência plena direto. Por isso você talvez **não** tenha visto
> DR/BDR no seu Lab 6 ponto a ponto: o protocolo simplesmente não elege onde não precisa.

---

## 📌 4. A hora de conferir: os quatro comandos show [Teoria ⏳ 15 min]

Teoria é o mapa; a CLI é o território. Quando você sobe o OSPF num roteador Cisco, quatro comandos
`show` respondem às quatro perguntas que importam — e **cada um prova uma coisa diferente**. Este é
o kit de verificação do Lab 7 desta semana.

![[assets/aula13_verificacao.svg]]
> *Figura 3: os quatro comandos show e o que cada um confirma.*

| Comando | Pergunta que responde | O que você confirma na tela |
| :-- | :-- | :-- |
| `show ip ospf neighbor` | *"Meus vizinhos estão falando comigo?"* | A lista de vizinhos, o estado (`FULL` = adjacência completa), e **quem é DR/BDR** no segmento |
| `show ip ospf interface` | *"O OSPF está ligado nesta interface, e com que parâmetros?"* | Em quais interfaces o OSPF roda, o **custo** da interface, a **prioridade**, e o papel local (DR/BDR/DROTHER) |
| `show ip route ospf` | *"O que o OSPF de fato instalou na tabela de rotas?"* | As rotas aprendidas por OSPF (linhas `O`), com `[distância/custo]` — o resultado final do cálculo |
| `show ip protocols` | *"Qual protocolo de roteamento está rodando, e como está configurado?"* | O OSPF está ativo, o **Router ID**, as redes anunciadas e os temporizadores |

Veja a leitura de cada um, com o olho treinado para o que prova:

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· vizinhos: quem está do outro lado, e quem manda no segmento</span></div>
<div class="au-term-b"><span class="ps">R1#</span> <span class="kw">show ip ospf neighbor</span>
<span class="cm">! Neighbor ID     Pri   State           Dead Time   Address         Interface</span>
<span class="mark">2.2.2.2            1   FULL/DR         00:00:33    10.0.0.2        GigabitEthernet0/0</span>
<span class="cm">! State FULL = adjacencia completa; /DR = este vizinho e o Designated Router</span></div>
</div>

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· a interface: custo e papel local, em um lugar só</span></div>
<div class="au-term-b"><span class="ps">R1#</span> <span class="kw">show ip ospf interface GigabitEthernet0/0</span>
<span class="mark">  Process ID 1, Router ID 1.1.1.1, Network Type BROADCAST, Cost: 1</span>
<span class="mark">  State DROTHER, Priority 1</span>
<span class="mark">  Designated Router (ID) 2.2.2.2, Interface address 10.0.0.2</span>
<span class="cm">! Cost: 1 = o custo calculado para esta interface; State DROTHER = este roteador nao e DR nem BDR aqui</span></div>
</div>

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· a tabela: o que o OSPF realmente instalou</span></div>
<div class="au-term-b"><span class="ps">R1#</span> <span class="kw">show ip route ospf</span>
<span class="cm">! Codigos: O - OSPF</span>
<span class="mark">O    192.168.30.0/24 [110/2] via 10.0.0.2, 00:04:12, GigabitEthernet0/0</span>
<span class="cm">! O = rota aprendida por OSPF; [110/2] = distancia administrativa 110, custo acumulado 2</span></div>
</div>

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· o protocolo: está rodando, e com qual Router ID</span></div>
<div class="au-term-b"><span class="ps">R1#</span> <span class="kw">show ip protocols</span>
<span class="mark">Routing Protocol is "ospf 1"</span>
<span class="mark">  Router ID 1.1.1.1</span>
<span class="mark">  Routing for Networks: 10.0.0.0 192.168.10.0</span>
<span class="cm">! Confirma que o OSPF esta ativo, o RID escolhido e as redes anunciadas</span></div>
</div>

> [!TIP] 💡 A ordem que economiza tempo no lab
> Quando algo não funciona, vá do físico ao lógico: **`neighbor`** primeiro (há vizinho? está
> `FULL`?). Sem vizinho `FULL`, nada mais importa — o problema está na adjacência (área diferente,
> rede não anunciada, interface errada). Com vizinho `FULL`, aí sim olhe `route ospf` (a rota
> chegou?) e `interface` / `protocols` para os detalhes. Diagnóstico é funil, não loteria.

> [!NOTE] 📖 Os quatro comandos, uma frase cada
> `neighbor` prova a **conversa**; `interface` prova o **custo e o papel**; `route ospf` prova o
> **resultado**; `protocols` prova a **configuração**. Decore o par (comando → o que prova), não só
> o comando solto — é assim que a prova cobra.

---

<div class="au-slot">
<b>🔌 Momento interativo — vote antes de eu abrir o Packet Tracer</b>

Num segmento Ethernet com quatro roteadores, três têm prioridade OSPF **1** (o padrão) e um foi
configurado com prioridade **10**. **Quem vira DR?** Vote no Plickers.

<p class="au-slot-b"><b>Plano B — se o Plickers ou a internet do campus cair:</b> mão levantada — o de prioridade 10 (um dedo) ou o de maior Router ID (dois dedos). A resposta e o porquê vêm logo abaixo; o importante é você se comprometer com um palpite antes de ver.</p>
</div>

---

<div class="au-podcast" style="background:var(--au-sfc,var(--secondary,#f0f3f8));color:var(--au-tx,var(--dark,#1d2057));border:1px solid color-mix(in srgb,var(--au-par-verde,#2e7d52) 30%,transparent);border-radius:14px;padding:1.25rem 1.5rem;margin:1.5rem auto;max-width:720px">
<b>🎧 Podcast da aula — "Cálculo de custo de rotas no OSPF"</b>
<p class="au-podcast-origem"><b>Gerado por IA</b> (NotebookLM) a partir do material da disciplina — se divergir da aula, a aula vence.</p>
<audio controls preload="none" style="width:100%;margin-top:.5rem">
<source src="assets/aula13-ospf-podcast.m4a" type="audio/mp4">
Seu navegador não reproduz áudio embutido — <a href="assets/aula13-ospf-podcast.m4a">baixe o episódio aqui</a>.
</audio>
</div>

<hr class="au-fim-aula">

<div class="au-resumo">
<b>📋 Resumo — a folha de consulta</b>


| Conceito | O que é | Como lembrar |
|---|---|---|
| Custo | número derivado da banda do enlace | referência ÷ banda, mínimo 1 |
| Referência padrão | 100 Mbps na Cisco | tudo ≥ 100 Mbps empata em custo 1 |
| Custo acumulado | soma dos custos no caminho | o `2` do `[110/2]` |
| DR (Designated Router) | o porta-voz do segmento multiacesso | coleta e redistribui LSAs |
| BDR (Backup DR) | o reserva que assume se o DR cai | promoção imediata, sem nova eleição |
| Critério de eleição | maior prioridade; empate → maior RID | prioridade 0 não participa |
| 224.0.0.6 | multicast "todos os DR/BDR" | como os demais falam com o DR |
| `show ip ospf neighbor` | vizinhos, estado, quem é DR/BDR | prova a **conversa** |
| `show ip ospf interface` | custo, prioridade, papel local | prova o **custo e o papel** |
| `show ip route ospf` | rotas `O` instaladas | prova o **resultado** |
| `show ip protocols` | OSPF ativo, RID, redes | prova a **configuração** |

| O erro clássico | A correção |
|---|---|
| "OSPF pega o caminho de menos saltos" | não — **menor custo acumulado** (banda) |
| "o DR é o roteador mais rápido" | não — é quem ganhou em **prioridade/RID** |
| "um roteador melhor toma o posto de DR" | não — OSPF é **não preemptivo** |
| "Gigabit tem custo menor que Fast Ethernet" | não com a referência padrão — **ambos custam 1** |

</div>

---

<div class="au-reflexao">
<b>🤔 Para pensar até a próxima aula</b>


Hoje você viu que, com a referência padrão de 100 Mbps, um link de **1 Gbps** e um de **10 Gbps**
têm o **mesmo** custo 1 — o OSPF não os distingue. Numa rede com os dois, isso pode fazer o OSPF
escolher um caminho mais lento sem perceber.

**Como você resolveria isso** sem mexer em cada link à mão? Pense no comando que muda a largura de
banda de **referência** para o processo OSPF inteiro. Por que mudá-la em **todos** os roteadores, e
não em um só? Traga sua resposta.

*Não há resposta nesta página de propósito.*

</div>

---

## 🧩 Antes de fechar: a analogia que amarra tudo

Pense num **grupo grande de pessoas organizando um evento** num salão (a rede multiacesso). Se
cada pessoa combinasse cada detalhe com cada outra, seriam conversas demais — ninguém se entende.
Então o grupo elege um **coordenador** (o DR): todos falam com ele, ele consolida e repassa a
todos. Elegem também um **vice** (o BDR), que acompanha tudo e assume na hora se o coordenador
precisar sair. E quando alguém pergunta "por onde eu vou?", a resposta não é "pelo caminho com
menos esquinas" — é **pelo caminho mais rápido** (o de menor **custo**), mesmo que tenha uma
esquina a mais. No fim do dia, quatro perguntas conferem se o plano deu certo: *quem está
conversando?* (`neighbor`), *com que regras?* (`interface`), *o que ficou valendo?* (`route ospf`),
*quem está coordenando?* (`protocols`).

---

<div class="au-refs-wrap">
<b>📚 O que sustenta esta aula, com página</b>

<div class="au-refs">

- **KUROSE, J. F.; ROSS, K. W.** *Redes de computadores e a internet: uma abordagem top-down.* 6. ed. São Paulo: Pearson, 2013. <span class="au-pag">seç. 5.3, p. 338–350</span> — algoritmo de estado de enlace e cálculo de caminho de menor custo (Dijkstra), base da noção de custo desta aula.
- **TANENBAUM, A. S.; FEAMSTER, N.; WETHERALL, D. J.** *Redes de Computadores.* 6. ed. Porto Alegre: Bookman, 2021. <span class="au-pag">seç. 5.2, p. 262–278</span> — roteamento por estado de enlace, redes de difusão (multiacesso) e o papel do roteador designado.
- **CISCO NETWORKING ACADEMY.** *CCNA: Enterprise Networking, Security, and Automation (ENSA).* Disponível em: [netacad.com](https://www.netacad.com/). Acesso em: 20 out. 2026. <span class="au-pag">módulos de OSPF de área única — custo, DR/BDR e verificação</span> — fórmula do custo, eleição DR/BDR e comandos `show`. A numeração das subseções **não é citada porque não foi conferida** (o curso exige login).

</div>
</div>

<div class="au-proxima">
<b>➡️ Na próxima aula</b>


Com o custo, o DR/BDR e os quatro `show` na mão, o **Lab 7** desta semana é onde você **confere ao
vivo**: sobe o OSPF, lê `show ip ospf neighbor` até ver `FULL`, identifica quem virou DR e por quê,
e confirma o custo na tabela. O que hoje ficou "é assim", lá vira "e eu provo na tela".

</div>

</div>

%%
BANCO DE QUESTÕES — Aula 13 (OSPF: custo, DR/BDR e verificação)
Uso interno do professor. 4 questões de múltipla escolha com gabarito.

1) Pela fórmula padrão do OSPF na Cisco (referência 100 Mbps), qual o custo de um enlace
   Fast Ethernet (100 Mbps)?
   a) 10
   b) 1
   c) 100
   d) 64
   GABARITO: b) 1  —  100 Mbps ÷ 100 Mbps = 1.

2) Um roteador tem dois caminhos até a mesma rede: (A) um salto por um link de 10 Mbps;
   (B) dois saltos por dois links de 1 Gbps. Qual o OSPF instala na tabela de rotas, e por quê?
   a) O caminho A, porque tem menos saltos.
   b) O caminho A, porque é o mais direto.
   c) O caminho B, porque tem menor custo acumulado (1 + 1 = 2, contra 10 do caminho A).
   d) Depende do Router ID dos roteadores.
   GABARITO: c)  —  OSPF escolhe por custo acumulado, não por número de saltos.

3) Numa rede multiacesso, três roteadores têm prioridade OSPF 1 (padrão) e um tem prioridade 10.
   Quem é eleito DR (Designated Router)?
   a) O de maior Router ID entre os quatro.
   b) O de prioridade 10, porque prioridade é o primeiro critério.
   c) O de menor Router ID, por desempate.
   d) Nenhum — prioridade não decide a eleição.
   GABARITO: b)  —  maior prioridade vence; o RID só desempata quando as prioridades são iguais.

4) Qual comando mostra, de uma vez, os vizinhos OSPF, o estado da adjacência (FULL) e quem é
   o DR/BDR do segmento?
   a) show ip route ospf
   b) show ip protocols
   c) show ip ospf neighbor
   d) show ip ospf interface
   GABARITO: c)  —  'show ip ospf neighbor' lista vizinhos, estado e o papel DR/BDR.
%%
