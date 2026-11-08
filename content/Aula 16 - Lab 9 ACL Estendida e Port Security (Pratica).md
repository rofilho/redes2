---
title: "Lab 9 — ACL estendida e port security: a política vem em palavras, a configuração é sua"
publicar: true
tags: [redes2, {{PERIODO}}, lab, acl-estendida, port-security]
---

<div class="au-leitura" data-aula="s16p">

# 🟢 Lab 9 — ACL estendida e port security: a política vem em palavras, a configuração é sua

**Disciplina:** {{CODIGO}} — Redes de Computadores II — Uniube<br>
**Professor:** Romualdo Mathias Filho · **romualdo.filho@uniube.br**<br>
**Semana:** S16 · **Formato:** prática em Packet Tracer · 75 min · **formativo (sem nota)**<br>
**Turmas práticas:** P11 segunda 09/11 · VIA215 — P12 quinta 12/11 · VIA216<br>
**Pré-requisito:** Aula 15 (ACL padrão)<br>
**Tempo:** entrada 5 min · caminho 5 · tópicos 52 · momento interativo 3 · fechamento 5 · folga 5

---

<div class="au-caminho">
<b>Nosso caminho até aqui [⏳ 5 min]</b>

Tente responder de cabeça. Depois abra e confira. Três perguntas vêm da Aula 15, sobre as ACLs (Access Control Lists). A quarta é da S11. Todas são o chão desta prática.

<details>
<summary>O que a wildcard <code>0.0.0.255</code> confere, e o que ela ignora?</summary>

**Confere os três primeiros pedaços** do endereço IP (Internet Protocol) e **ignora o último**. Ela casa a rede /24 inteira. Na wildcard, 0 é "confere" e 255 é "tanto faz". A palavra `host` é o atalho de `0.0.0.0`: um endereço só.

</details>

<details>
<summary>Numa ACL só com um <code>deny</code>, o que acontece com o resto da rede?</summary>

**Fica tudo barrado**, mesmo que o `deny` seja de um host só. Quem não casa em nenhuma linha cai no `deny` implícito do fim da lista. Por isso toda ACL precisa de pelo menos um `permit`.

</details>

<details>
<summary>A ACL padrão fica perto da origem ou perto do destino? Por quê?</summary>

**Perto do destino.** Ela só enxerga a origem. Perto da origem, ela barraria o host para qualquer destino, inclusive os legítimos. Hoje você vê o outro lado: a ACL que enxerga também o destino.

</details>

<details>
<summary>Que comando mostra os vizinhos OSPF (Open Shortest Path First) e o estado deles?</summary>

**`show ip ospf neighbor`.** O estado `FULL` é a adjacência completa: os dois roteadores trocaram o mapa um do outro.

</details>
</div>

<figure class="au-fig">
<img src="assets/aula16_lab9_topologia.svg" alt="O roteador R1 liga duas redes. Na g0/0, ligada à porta Gi0/1 do S1, a rede dos alunos 192.168.10.0/24: o switch S1 com PC-A1 na porta f0/1, PC-A2 na f0/2 e PC-PROF, o computador do professor, na f0/3. Na g0/1, a rede dos servidores 192.168.20.0/24: o switch S2 com SRV-WEB 192.168.20.10 e SRV-RH 192.168.20.20. A ACL estendida ALUNOS-SERVIDORES fica na entrada da g0/0 do R1. O port security protege as portas f0/1 a f0/3 do S1. Um notebook intruso, o Laptop-X, desenhado tracejado, entra no lugar do PC-A1.">
<figcaption class="au-legenda">A topologia de hoje: o R1 no meio, a rede dos alunos à esquerda (LAN, Local Area Network) e a dos servidores à direita. A <b>ACL</b> vigia a entrada da g0/0, no caminho de quem sai dos alunos. O <b>port security</b> vigia as três portas do S1, cada uma presa ao endereço MAC (Media Access Control) do aparelho que está nela. O notebook tracejado é o intruso do bloco 2.</figcaption>
</figure>

> [!INFO] 🎯 O que você leva desta prática
> - Escrever uma **ACL estendida** a partir de uma política dita em palavras, aplicá-la no lugar certo e **provar** que filtra pelo contador de match.
> - Ligar o **port security** nas portas de um switch e ver o endereço MAC ser aprendido.
> - Derrubar uma porta de propósito, ler o diagnóstico e religá-la.
>
> **📂 Recursos**
> - [Manual do IOS (Internetwork Operating System) no Packet Tracer](./Manual-do-IOS-no-Packet-Tracer) — comandos do semestre por tema
> - Teórica da semana: [Aula 16 — ACLs estendidas e segurança de camada 2](./Aula-16---ACLs-Estendidas-e-Seguranca-de-Camada-2-(Teorica))
> - Aula anterior: [Aula 15 — ACLs padrão](./Aula-15---ACLs-Padrao-Logica-Wildcard-e-Posicionamento-(Teorica))
> - Não há arquivo pronto: **você monta a topologia** no Packet Tracer.

---

## 📌 0. A teoria mínima para hoje: a pergunta completa e a porta vigiada [Conceito ⏳ 10 min]

A teórica desta semana é na terça. A P11 faz este lab antes dela, na segunda. Por isso este bloco dá só o mínimo para cada comando fazer sentido. Quem é da P12 já viu isto na terça: leia como revisão.

### 0.1 O que a ACL estendida confere a mais

A ACL padrão faz uma pergunta só: "de onde você veio?". A estendida faz a pergunta completa: **quem, para onde e qual serviço**.

> [!NOTE] 📖 Três protocolos que você vai nomear hoje
> **TCP (Transmission Control Protocol)** carrega a navegação na web, na porta 80. **UDP (User Datagram Protocol)** carrega consultas rápidas, como as de DNS (Domain Name System). **ICMP (Internet Control Message Protocol)** carrega o `ping`. O protocolo `ip` na ACL quer dizer "qualquer um deles".

| | ACL padrão (Aula 15) | ACL estendida (hoje) |
| :-- | :-- | :-- |
| Confere o IP de origem | sim | sim |
| Confere o IP de destino | não | **sim** |
| Confere o protocolo (`ip`, `tcp`, `udp`, `icmp`) | não | **sim** |
| Confere a porta | não | **sim** (só em TCP e UDP) |
| Numeração | 1–99 | 100–199 |
| Onde fica | perto do destino | **perto da origem** |

> [!TIP] 💡 A porta 80 é o endereço do site
> O servidor tem um IP, que diz **qual máquina**. A porta diz **qual serviço** nela. A navegação por HTTP (HyperText Transfer Protocol) chega na porta 80. É assim que a ACL deixa o aluno abrir o site e barra o resto da mesma máquina.

### 0.2 A linha da ACL estendida nomeada, peça por peça

Você vai usar a forma **nomeada**: o nome substitui o número, e cada linha tem um **número de sequência** (10, 20, 30...). Se você não digita o número, o IOS preenche de 10 em 10. Se digita, você escolhe o lugar da linha.

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· a forma de uma linha de ACL estendida nomeada</span></div>
<div class="au-term-b"><span class="ps">R1(config)#</span> <span class="kw">ip access-list extended</span> <span class="vl">NOME</span>
<span class="mark"><span class="ps">R1(config-ext-nacl)#</span> <span class="kw">10 permit tcp</span> 192.168.10.0 <span class="vl">0.0.0.255</span> <span class="kw">host</span> 192.168.20.10 <span class="kw">eq</span> <span class="vl">80</span></span>
<span class="cm">! sequência · ação · protocolo · origem + wildcard · destino · porta de destino</span></div>
</div>

| A peça | No exemplo | Quer dizer |
| :-- | :-- | :-- |
| Sequência | `10` | a ordem de leitura; menor número é lido primeiro |
| Ação | `permit` | deixa passar (`deny` barra) |
| Protocolo | `tcp` | só pacotes TCP |
| Origem + wildcard | `192.168.10.0 0.0.0.255` | qualquer host da rede dos alunos |
| Destino | `host 192.168.20.10` | só o servidor web |
| Porta de destino | `eq 80` | porta igual a 80 (`eq` é "igual a") |

### 0.3 Onde ela fica: perto da origem, na entrada

A estendida sabe o destino, então pode barrar **cedo**: o pacote proibido nem atravessa a rede. O lugar é a interface por onde o tráfego **entra** no roteador vindo da origem. Aqui é a `g0/0`, no sentido `in`.

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· aplicar a ACL na entrada da interface dos alunos</span></div>
<div class="au-term-b"><span class="ps">R1(config)#</span> <span class="kw">interface</span> <span class="vl">GigabitEthernet0/0</span>
<span class="mark"><span class="ps">R1(config-if)#</span> <span class="kw">ip access-group</span> NOME <span class="kw">in</span></span>
<span class="cm">! in = filtra o que ENTRA pela g0/0. out = filtra o que SAI por ela.</span></div>
</div>

> [!WARNING] ⚠️ A ACL só filtra quando é aplicada
> Escrever a lista é metade do trabalho. Sem o `ip access-group` na interface, ela existe e não faz nada. Foi o aviso da Aula 15: uma ACL criada não filtra nada ainda.

### 0.4 Port security: o que é e o que o switch faz na violação

O switch aprende o endereço MAC de quem manda quadros por cada porta. O **port security** limita **quantos** endereços MAC e **quais** podem usar a porta. Se aparece um MAC fora da lista, é uma **violação**, e o switch reage conforme o **modo de violação**.

Três pontos para hoje:

1. A porta precisa ser de acesso (`switchport mode access`). Sem isso o IOS recusa o comando.
2. No modo **sticky\***, o switch aprende o MAC da porta e o grava na configuração. Ele só aprende quando o aparelho manda o primeiro quadro.
3. O modo de violação decide o que acontece com o MAC novo:

| Modo | O que o switch faz com o quadro do MAC novo | A porta |
| :-- | :-- | :-- |
| `protect` | descarta, sem avisar | continua ligada |
| `restrict` | descarta, avisa (log e SNMP, Simple Network Management Protocol) e soma no contador | continua ligada |
| `shutdown` (padrão) | derruba a porta para o estado err-disabled\* e soma no contador | **cai** |

<p class="au-nota"><b>*sticky</b> — "grudento". O switch aprende o MAC da porta e o grava na configuração em andamento (<code>running-config</code>), como se você o tivesse digitado.</p>

<p class="au-nota"><b>*err-disabled</b> — estado em que o switch desliga a porta sozinho depois de detectar um problema. A porta fica apagada até alguém religar.</p>

<p class="au-pronto"><b>Pronto para o teclado quando:</b> você sabe dizer o que a ACL estendida confere além da origem, por que ela vai perto da origem, e qual dos três modos de violação derruba a porta.</p>

---

## 📌 1. Problema aberto: escreva a política dos servidores [Mão na massa ⏳ 22 min]

Daqui para a frente o andaime diminui. Eu dou a política em palavras. A ACL é sua.

### 1.1 Exercício 1 — monte a rede e registre o antes [⏳ 7 min]

Monte a topologia da figura. O R1 é um **2911** e os dois switches são **2960**. Ligue cada aparelho na porta que a tabela indica. Use o cabo direto de cobre (Copper Straight-Through) e escolha as portas pelo nome, **não** o cabo automático: o automático escolhe a primeira porta livre, que pode cair na faixa do port security (`f0/1` a `f0/3` do S1). As portas importam no bloco 2.

| Aparelho | Onde liga | Endereço IP |
| :-- | :-- | :-- |
| R1 `g0/0` | porta `Gi0/1` do S1 (fora da faixa do port security) | `192.168.10.1 /24` |
| R1 `g0/1` | porta `Gi0/1` do S2 | `192.168.20.1 /24` |
| PC-A1 | S1, porta `f0/1` | `192.168.10.11` |
| PC-A2 | S1, porta `f0/2` | `192.168.10.12` |
| PC-PROF (professor) | S1, porta `f0/3` | `192.168.10.100` |
| SRV-WEB | S2, porta `f0/1` | `192.168.20.10` |
| SRV-RH (recursos humanos) | S2, porta `f0/2` | `192.168.20.20` |

Os PCs (computadores pessoais) e os servidores levam máscara `255.255.255.0` e **gateway** `.1` da própria rede: `192.168.10.1` para os PCs e `192.168.20.1` para os servidores. Nos dois servidores o serviço HTTP já vem ligado no Packet Tracer.

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· as duas interfaces do roteador</span></div>
<div class="au-term-b"><span class="ps">R1(config)#</span> <span class="kw">interface</span> <span class="vl">GigabitEthernet0/0</span>
<span class="ps">R1(config-if)#</span> <span class="kw">ip address</span> 192.168.10.1 <span class="vl">255.255.255.0</span>
<span class="mark"><span class="ps">R1(config-if)#</span> <span class="kw">no shutdown</span></span>
<span class="cm">! repita na GigabitEthernet0/1 com 192.168.20.1</span></div>
</div>

> [!WARNING] ⚠️ O primeiro ping pode perder um pacote
> Na primeira vez, o PC ainda descobre o endereço físico do gateway pelo ARP (Address Resolution Protocol). É normal o primeiro dos quatro pacotes falhar. Rode o ping de novo antes de concluir qualquer coisa.

Registre o "antes". Do PC-A1, dê `ping` no SRV-WEB e no SRV-RH. Depois, no navegador do PC (aba **Desktop**, **Web Browser**), digite o IP de cada servidor.

<p class="au-pronto"><b>Pronto quando:</b> o PC-A1 pinga os dois servidores <b>e</b> abre o site dos dois. Sem este "antes", você não saberá se quem barrou foi a ACL ou um erro de endereço.</p>

### 1.2 Exercício 2 — traduza a política em ACL [⏳ 8 min]

Esta é a política, em linguagem de negócio:

1. Os alunos abrem o site do SRV-WEB e podem dar ping nele.
2. Ninguém da rede dos alunos alcança o SRV-RH, exceto o PC do professor.
3. O PC do professor alcança tudo na rede dos servidores.
4. O resto do tráfego segue normal.

**Escreva você a ACL**, com o nome `ALUNOS-SERVIDORES`, e decida em qual interface e em qual sentido ela entra. Quatro perguntas organizam o trabalho: **quem** manda, **para onde**, **qual serviço**, e **em que ordem** as linhas ficam.

> [!TIP] 💡 Pense no porteiro
> Ele lê a lista de cima para baixo e para na primeira linha que casa. Isso pesa na ordem em que você escreve as linhas.

Aplique a sua ACL e siga para o Exercício 3. Se travar, me chame: a resposta para comparar fica no fim do Exercício 3, depois do teste.

<p class="au-pronto"><b>Pronto quando:</b> você tem a sua ACL digitada no R1 e aplicada na interface e no sentido que você escolheu.</p>

### 1.3 Exercício 3 — teste a matriz e compare com a resposta [⏳ 4 min]

Teste cada linha da tabela e **anote o que a sua tela mostrar**:

| De | Para | Serviço | Esperado |
| :-- | :-- | :-- | :-- |
| PC-A1 | SRV-WEB | navegador | **abre** |
| PC-A1 | SRV-WEB | ping | **responde** |
| PC-A1 | SRV-RH | navegador | **não abre** |
| PC-A1 | SRV-RH | ping | **falha** |
| PC-PROF | SRV-RH | navegador | **abre** |
| PC-PROF | SRV-RH | ping | **responde** |

No ping barrado, o roteador descarta o pacote e devolve ao PC uma mensagem ICMP de host inalcançável (*Host Unreachable*). Por isso o Packet Tracer costuma mostrar `Destination host unreachable`. Anote o que **a sua tela** mostrar, sem decorar a mensagem.

<details class="au-aposta">
<summary>Aposte antes de abrir a resposta: na sua ACL, se a linha do professor ficasse <b>depois</b> da linha que barra a rede inteira dos alunos, o PC-PROF ainda abriria o SRV-RH?</summary>

**Não.** O PC-PROF (`192.168.10.100`) também é da rede dos alunos. O pacote dele casaria na linha que barra a rede inteira, e o roteador pararia de ler ali: a linha do professor nunca seria vista. O contador dessa linha de `deny` subiria com o teste do professor. É o erro número 1 da lista do Exercício 4. A linha `permit ip any any` no fim existe por outro motivo: sem ela, o `deny` implícito cortaria todo o resto.

</details>

<details>
<summary>Compare com a resposta (ou abra, se você travou)</summary>

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· uma resposta possível para a política</span></div>
<div class="au-term-b"><span class="ps">R1(config)#</span> <span class="kw">ip access-list extended</span> <span class="vl">ALUNOS-SERVIDORES</span>
<span class="ps">R1(config-ext-nacl)#</span> <span class="kw">10 permit ip host</span> 192.168.10.100 192.168.20.0 <span class="vl">0.0.0.255</span>
<span class="ps">R1(config-ext-nacl)#</span> <span class="kw">20 permit tcp</span> 192.168.10.0 <span class="vl">0.0.0.255</span> <span class="kw">host</span> 192.168.20.10 <span class="kw">eq</span> <span class="vl">80</span>
<span class="ps">R1(config-ext-nacl)#</span> <span class="kw">30 permit icmp</span> 192.168.10.0 <span class="vl">0.0.0.255</span> <span class="kw">host</span> 192.168.20.10 <span class="kw">echo</span>
<span class="ps">R1(config-ext-nacl)#</span> <span class="kw">40 deny ip</span> 192.168.10.0 <span class="vl">0.0.0.255</span> 192.168.20.0 <span class="vl">0.0.0.255</span>
<span class="ps">R1(config-ext-nacl)#</span> <span class="kw">50 permit ip any any</span>
<span class="ps">R1(config-ext-nacl)#</span> <span class="kw">exit</span>
<span class="ps">R1(config)#</span> <span class="kw">interface</span> <span class="vl">GigabitEthernet0/0</span>
<span class="mark"><span class="ps">R1(config-if)#</span> <span class="kw">ip access-group</span> ALUNOS-SERVIDORES <span class="kw">in</span></span></div>
</div>

Cada linha cumpre uma parte da política:

| Linha | O que faz | Parte da política |
| :-- | :-- | :-- |
| 10 | o PC do professor alcança a rede dos servidores inteira | 2 (a exceção) e 3 |
| 20 | os alunos abrem o site do SRV-WEB (porta 80) | 1 |
| 30 | os alunos dão ping no SRV-WEB (`echo` é o pedido do ping) | 1 |
| 40 | barra o resto da rede dos alunos para a rede dos servidores | 2 |
| 50 | libera todo o resto | 4 |

**Por que na `g0/0`, sentido `in`:** é onde o tráfego dos alunos entra no R1. A estendida sabe o destino, então barra cedo e o pacote proibido não atravessa o roteador à toa.

</details>

> [!NOTE] 📖 Por que só <code>echo</code>, e não <code>echo-reply</code>
> O `echo` é o pedido do ping. A resposta do servidor entra no R1 pela `g0/1` e sai pela `g0/0`. A ACL está na **entrada** da `g0/0`, e o sentido `in` não olha o que sai. Por isso a linha 30 só precisa do pedido.

<p class="au-pronto"><b>Pronto quando:</b> as seis linhas da matriz deram o resultado esperado e você sabe explicar por que a linha do professor vem antes da que barra a rede inteira dos alunos. Se alguma linha não deu o esperado, não refaça tudo: o Exercício 4 mostra onde olhar.</p>

### 1.4 Exercício 4 — verifique e preveja o erro do sentido [⏳ 3 min]

Dois comandos provam que a ACL existe e está no lugar:

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· as linhas, na ordem, com o contador de match (os números aqui são de exemplo)</span></div>
<div class="au-term-b"><span class="ps">R1#</span> <span class="kw">show access-lists</span>
Extended IP access list ALUNOS-SERVIDORES
    10 permit ip host 192.168.10.100 192.168.20.0 0.0.0.255 (8 match(es))
    20 permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq www (4 match(es))
    30 permit icmp 192.168.10.0 0.0.0.255 host 192.168.20.10 echo (4 match(es))
<span class="mark">    40 deny ip 192.168.10.0 0.0.0.255 192.168.20.0 0.0.0.255 (6 match(es))</span>
    50 permit ip any any (12 match(es))
<span class="cm">! o IOS escreve www no lugar de 80. O contador do deny sobe quando o aluno tenta o SRV-RH.</span></div>
</div>

<div class="au-term">
<div class="au-term-h"><b>R1</b> <span>· a ACL está aplicada, e em qual sentido (o texto pode variar no Packet Tracer)</span></div>
<div class="au-term-b"><span class="ps">R1#</span> <span class="kw">show ip interface</span> <span class="vl">GigabitEthernet0/0</span>
<span class="cm">! (várias linhas omitidas)</span>
  Outgoing access list is not set
<span class="mark">  Inbound  access list is ALUNOS-SERVIDORES</span></div>
</div>

<details class="au-aposta">
<summary>Aposte: você aplica a mesma ACL na <code>g0/0</code> com <code>out</code> em vez de <code>in</code>. O PC-A1 ainda abre o SRV-RH?</summary>

**Abre.** O pedido do aluno **entra** pela `g0/0`, e o sentido `out` não olha o que entra. A resposta do SRV-RH vem com origem `192.168.20.20`, não casa nas linhas 10 a 40 e passa pela linha 50. O sintoma é o contador da linha 40 parado em zero: a ACL está viva e não filtra nada.

</details>

Os quatro erros que este lab provoca, e como reconhecê-los:

| O erro | O sintoma | Como confirmar |
| :-- | :-- | :-- |
| a linha do professor depois do `deny` | o professor não abre o SRV-RH | `show access-lists`: o contador da linha 40 sobe |
| esquecer o `permit ip any any` | o que não é regra nenhuma para de funcionar | `show access-lists`: sem a linha 50 |
| aplicar com `out` na `g0/0` | a ACL não barra ninguém | contador da linha 40 parado |
| aplicar longe da origem | o pacote proibido atravessa a rede à toa | a ACL está na `g0/1`, não na `g0/0` |

<p class="au-pronto"><b>Pronto quando:</b> o <code>show access-lists</code> mostra as cinco linhas, e o <code>show ip interface</code> mostra a ACL em <code>Inbound</code>.</p>

---

## 📌 2. Port security: amarre as portas e depois derrube uma [Mão na massa ⏳ 20 min]

### 2.1 Exercício 5 — ligue o port security nas portas dos alunos [⏳ 8 min]

No S1, nas portas `f0/1` a `f0/3`: no máximo **um** endereço MAC por porta, aprendido sozinho (sticky), e porta derrubada se aparecer outro.

<div class="au-term">
<div class="au-term-h"><b>S1</b> <span>· port security nas três portas dos alunos</span></div>
<div class="au-term-b"><span class="ps">S1(config)#</span> <span class="kw">interface range</span> <span class="vl">FastEthernet0/1 - 3</span>
<span class="ps">S1(config-if-range)#</span> <span class="kw">switchport mode access</span>
<span class="ps">S1(config-if-range)#</span> <span class="kw">switchport port-security</span>
<span class="ps">S1(config-if-range)#</span> <span class="kw">switchport port-security maximum</span> <span class="vl">1</span>
<span class="mark"><span class="ps">S1(config-if-range)#</span> <span class="kw">switchport port-security mac-address sticky</span></span>
<span class="ps">S1(config-if-range)#</span> <span class="kw">switchport port-security violation shutdown</span>
<span class="ps">S1(config-if-range)#</span> <span class="kw">end</span></div>
</div>

<details class="au-aposta">
<summary>Aposte antes de digitar: você pula o <code>switchport mode access</code> e vai direto para <code>switchport port-security</code>. O que o IOS faz?</summary>

**Recusa o comando**, dizendo que a porta é dinâmica. A mensagem típica é `Command rejected: FastEthernet0/1 is a dynamic port.` O texto exato pode variar no Packet Tracer. Port security só funciona em porta fixada como acesso (ou tronco), nunca em porta que ainda negocia o modo.

</details>

Agora o passo que muita gente esquece: o sticky só aprende quando o aparelho **manda o primeiro quadro**. Dê um `ping` para o gateway (`192.168.10.1`) em cada PC: PC-A1, PC-A2 e PC-PROF. Depois confira:

<div class="au-term">
<div class="au-term-h"><b>S1</b> <span>· o estado da porta f0/1 (o MAC aqui é de exemplo; o seu será outro)</span></div>
<div class="au-term-b"><span class="ps">S1#</span> <span class="kw">show port-security interface</span> <span class="vl">FastEthernet0/1</span>
Port Security              : Enabled
<span class="mark">Port Status                : Secure-up</span>
Violation Mode             : Shutdown
Maximum MAC Addresses      : 1
Total MAC Addresses        : 1
Sticky MAC Addresses       : 1
Last Source Address:Vlan   : 0001.AAAA.0001:1
Security Violation Count   : 0
<span class="cm">! (algumas linhas omitidas)</span></div>
</div>

| O que conferir | Valor esperado |
| :-- | :-- |
| `Port Status` | `Secure-up` |
| `Violation Mode` | `Shutdown` |
| `Maximum MAC Addresses` | `1` |
| `Sticky MAC Addresses` | `1` (o PC já mandou um quadro) |
| `Security Violation Count` | `0` |

<div class="au-term">
<div class="au-term-h"><b>S1</b> <span>· o MAC aprendido aparece como SecureSticky, e vai para a configuração</span></div>
<div class="au-term-b"><span class="ps">S1#</span> <span class="kw">show port-security address</span>
<span class="mark">   1    0001.AAAA.0001    SecureSticky                  Fa0/1        -</span>
<span class="ps">S1#</span> <span class="kw">show running-config interface</span> <span class="vl">FastEthernet0/1</span>
 switchport mode access
 switchport port-security
 switchport port-security mac-address sticky
 switchport port-security mac-address sticky 0001.AAAA.0001
<span class="cm">! (colunas e linhas omitidas). O IOS não mostra o que é padrão, como maximum 1; o Packet Tracer pode mostrar diferente.</span></div>
</div>

> [!WARNING] ⚠️ O sticky vai para a running-config, e só até o reinício
> O endereço aprendido fica na configuração em andamento. Sem `copy running-config startup-config`, ele some quando o switch reinicia. Na vida real, quem liga o port security e não salva descobre isso no primeiro corte de energia.

<p class="au-pronto"><b>Pronto quando:</b> as três portas mostram <code>Secure-up</code> e <code>Sticky MAC Addresses : 1</code>, e a linha com <code>sticky</code> e o MAC do PC-A1 aparece no <code>running-config</code> da <code>f0/1</code>.</p>

---

<div class="au-slot">
<b>🔌 Momento interativo — preveja antes de eu pedir o cabo</b>

Eu vou tirar o PC-A1 da `f0/1` e ligar ali o Laptop-X, um notebook que o switch nunca viu. Ele manda um `ping`. **O que acontece com a porta?** (A) o ping passa, porque o IP é da rede certa · (B) o quadro é descartado e a porta continua verde · (C) a porta cai · (D) o switch troca o MAC aprendido. Vote no Plickers e diga o porquê para o colega.

<p class="au-slot-b"><b>Plano B — se o Plickers ou a internet do campus cair:</b> levante os dedos, um dedo para A, dois para B, três para C e quatro para D. Depois o colega ao lado diz por que votou assim, e eu abro a resposta no bloco 2.2.</p>
</div>

---

### 2.2 Exercício 6 — a quebra deliberada: o notebook intruso [⏳ 12 min]

Agora eu derrubo a porta de propósito. Sua tarefa é **achar o defeito e consertar**.

1. Tire o cabo do PC-A1 da `f0/1`.
2. Ligue ali o **Laptop-X** (`192.168.10.50`, máscara `255.255.255.0`, gateway `192.168.10.1`).
3. Do Laptop-X, dê `ping 192.168.10.1`.
4. Olhe a `f0/1`: o que aconteceu com ela?

Ao ligar um aparelho novo, a porta demora a ficar verde no Packet Tracer. O botão de adiantar o relógio (**Fast Forward Time**) apressa.

<div class="au-term">
<div class="au-term-h"><b>S1</b> <span>· mensagens típicas do IOS; o texto exato pode variar no Packet Tracer</span></div>
<div class="au-term-b"><span class="mark">%PORT_SECURITY-2-PSECURE_VIOLATION: Security violation occurred, caused by MAC address 0001.BBBB.0002 on port FastEthernet0/1.</span>
%PM-4-ERR_DISABLE: psecure-violation error detected on Fa0/1, putting Fa0/1 in err-disable state
<span class="cm">! o MAC do Laptop-X aqui é de exemplo. O switch já tinha o sticky do PC-A1: o segundo MAC é a violação.</span></div>
</div>

**Diagnóstico.** Dois comandos contam a história, e o segundo tem uma alternativa caso o Packet Tracer não aceite o `show interfaces status`:

<div class="au-term">
<div class="au-term-h"><b>S1</b> <span>· 1) a porta caiu por violação e o contador subiu (exemplo; o seu pode diferir)</span></div>
<div class="au-term-b"><span class="ps">S1#</span> <span class="kw">show port-security interface</span> <span class="vl">FastEthernet0/1</span>
<span class="mark">Port Status                : Secure-shutdown</span>
Violation Mode             : Shutdown
Security Violation Count   : 1
<span class="cm">! (algumas linhas omitidas)</span></div>
</div>

<div class="au-term">
<div class="au-term-h"><b>S1</b> <span>· 2) a porta aparece apagada por erro (exemplo; o seu pode diferir)</span></div>
<div class="au-term-b"><span class="ps">S1#</span> <span class="kw">show interfaces status</span>
Port      Name               Status       Vlan       Duplex  Speed Type
<span class="mark">Fa0/1                        err-disabled 1            auto   auto 10/100BaseTX</span>
Fa0/2                        connected    1          a-full  a-100 10/100BaseTX</div>
</div>

<div class="au-term">
<div class="au-term-h"><b>S1</b> <span>· 2b) alternativa ao show interfaces status (exemplo; o seu pode diferir)</span></div>
<div class="au-term-b"><span class="ps">S1#</span> <span class="kw">show interfaces</span> <span class="vl">FastEthernet0/1</span>
<span class="mark">FastEthernet0/1 is down, line protocol is down (err-disabled)</span>
<span class="cm">! (muitas linhas omitidas). A primeira linha termina em (err-disabled) quando a porta caiu por violação.</span></div>
</div>

**Recuperação.** Tire o Laptop-X, religue o PC-A1 na `f0/1` e reinicie a porta:

<div class="au-term">
<div class="au-term-h"><b>S1</b> <span>· religar a porta caída</span></div>
<div class="au-term-b"><span class="ps">S1(config)#</span> <span class="kw">interface</span> <span class="vl">FastEthernet0/1</span>
<span class="ps">S1(config-if)#</span> <span class="kw">shutdown</span>
<span class="mark"><span class="ps">S1(config-if)#</span> <span class="kw">no shutdown</span></span>
<span class="cm">! o sticky do PC-A1 continua lá: com o PC-A1 de volta, a porta fica Secure-up de novo</span></div>
</div>

> [!NOTE] 📖 Existe recuperação automática, mas ela não vem ligada
> No IOS real, o comando global `errdisable recovery cause psecure-violation` religa sozinho as portas derrubadas por violação. Por padrão ele não está ativo, e o Packet Tracer pode não ter o comando. Hoje a recuperação é manual.

> [!TIP] 💡 Por que o ping de cada PC veio antes da quebra
> Se o sticky da `f0/1` ainda não tivesse aprendido o PC-A1, o Laptop-X seria o **primeiro** a mandar um quadro, e a porta o aceitaria como o dono legítimo. A violação só existe porque a porta já tinha um dono.

<p class="au-pronto"><b>Critério de pronto do bloco 2:</b> você viu a <code>f0/1</code> em <code>err-disabled</code>, leu o <code>Secure-shutdown</code> e o contador em 1, e religou a porta com <code>shutdown</code> e <code>no shutdown</code>.</p>

---

<div class="au-pratica">
<b>A conferência — os 6 itens que eu passo olhando</b>

Eu passo nas bancadas durante os blocos 1 e 2 e confiro estes seis na sua tela. Todos são **re-executáveis**: eu peço o comando e leio o resultado, você não precisa ter anotado nada. **Este lab é formativo — a conferência não vira nota; serve para você sair daqui sabendo que funcionou.**

1. `show ip interface GigabitEthernet0/0` com `Inbound  access list is ALUNOS-SERVIDORES`.
2. `show access-lists` com as linhas na ordem certa (o professor antes do `deny`) e o contador do `deny` maior que zero.
3. A matriz de testes: o PC-A1 abre e pinga o SRV-WEB, não abre nem pinga o SRV-RH; o PC-PROF abre e pinga o SRV-RH.
4. Você explica em voz alta por que a linha do professor vem antes da linha 40.
5. `show port-security interface FastEthernet0/1` com `Secure-up`, `Maximum MAC Addresses : 1`, `Sticky MAC Addresses : 1`, e a linha `sticky` com o MAC no `running-config` da porta.
6. A `f0/1` em `err-disabled` depois do Laptop-X, o diagnóstico no `show interfaces status` (ou, se o Packet Tracer não aceitar, na primeira linha do `show interfaces FastEthernet0/1`), e a recuperação com `shutdown` e `no shutdown`.

<p class="au-pronto"><b>Critério de pronto:</b> <b>5 dos 6 itens</b> na sua tela. Os itens <b>4 e 6</b> são os que eu mais peço para explicar em voz alta: no 4, a ordem das linhas é a política; no 6, a porta caiu porque já tinha dono.</p>
</div>

---

<hr class="au-fim-aula">

<div class="au-resumo">
<b>📋 Resumo — a folha de consulta</b>

| O que você quer | O comando | O que procurar |
|---|---|---|
| Criar uma ACL estendida nomeada | `ip access-list extended NOME` | o prompt `(config-ext-nacl)#` |
| Liberar o site de um servidor | `permit tcp ORIGEM WILDCARD host IP eq 80` | porta 80 = HTTP |
| Liberar o ping | `permit icmp ORIGEM WILDCARD host IP echo` | `echo` é o pedido |
| Aplicar na interface | `ip access-group NOME in` | `in` filtra o que entra |
| Ver linhas e contadores | `show access-lists` | `(N match(es))` em cada linha |
| Ver onde a ACL está aplicada | `show ip interface g0/0` | `Inbound  access list is NOME` |
| Ligar o port security | `switchport mode access` e `switchport port-security` | porta de acesso primeiro |
| Aprender o MAC sozinho | `switchport port-security mac-address sticky` | só aprende após o primeiro quadro |
| Ver o estado da porta | `show port-security interface Fa0/1` | `Secure-up` ou `Secure-shutdown` |
| Ver os MACs seguros | `show port-security address` | tipo `SecureSticky` |
| Achar a porta caída | `show interfaces status` ou `show interfaces Fa0/1` | `err-disabled` (no segundo, na primeira linha) |
| Religar a porta | `shutdown` e `no shutdown` | volta a `Secure-up` com o dono certo |

| O erro clássico | A correção |
|---|---|
| "o professor não abre o SRV-RH" | a linha dele está depois do `deny`; o professor vai **antes** |
| "a rede inteira parou" | faltou o `permit ip any any`; o deny implícito cortou o resto |
| "apliquei e nada barrou" | `out` na `g0/0` ou ACL sem `ip access-group`; o sentido certo é `in` |
| "o IOS recusou o port security" | faltou `switchport mode access` na porta |
| "o MAC não foi aprendido" | o aparelho ainda não mandou o primeiro quadro; dê um ping |
| "a porta ficou apagada" | `err-disabled`: religar com `shutdown` e `no shutdown` |

</div>

<div class="au-pratica">
<b>📝 Para casa — 7 exercícios (formativos, sem nota)</b>

Faça no seu Packet Tracer, sobre a topologia de hoje. Não vale nota. Vale chegar na próxima aula com as perguntas certas. **Traga as dúvidas.**

1. **Refaça do zero**, sem olhar a página: as duas redes, a ACL `ALUNOS-SERVIDORES` e o port security nas três portas. Cronometre.
2. **Mude a ordem:** dentro da ACL, apague a linha do professor (`no 10`) e escreva-a de novo com o número `45`. O professor ainda alcança o SRV-RH? Confira o contador e conserte.
3. **Troque o sentido:** tire o `in` da `g0/0` e ponha `out`. O PC-A1 abre o SRV-RH? Qual contador não sobe?
4. **Tire a linha 50:** preveja primeiro, teste depois. O PC-A1 ainda abre o site do SRV-WEB? E o ping do PC-A1 até o gateway `192.168.10.1`? Anote o que a sua tela mostrar e explique o resultado pelo deny implícito.
5. **Mude o modo de violação:** troque `shutdown` por `restrict` na `f0/1` e repita o teste do Laptop-X. A porta cai? O contador sobe? Compare com o que você viu hoje.
6. **Salve ou perca:** com o sticky aprendido, desligue e ligue o S1 pela aba **Physical**, sem salvar. O `show port-security address` ainda mostra o MAC? Repita salvando antes com `copy running-config startup-config`.
7. **Escreva uma linha:** a política agora libera também o site seguro (HTTPS, HTTP Secure) do SRV-WEB, na porta 443. Escreva a linha da ACL e diga em que posição ela entra.

<p class="au-pronto"><b>Pronto quando:</b> você resolveu os sete e trouxe por escrito a linha do exercício 7.</p>
</div>

---

<div class="au-reflexao">
<b>🤔 Para pensar até a próxima aula</b>

Hoje a política dizia "o PC do professor passa". Para a ACL, o professor **é** o endereço IP `192.168.10.100`. O que impede um aluno de configurar esse IP no próprio PC? O port security ajuda nisso? Pense no que ele amarra: o IP ou o MAC?

*Não há resposta nesta página de propósito.*

</div>

---

<div class="au-refs-wrap">
<b>📚 O que sustenta esta prática, com página</b>

<div class="au-refs">

- **CISCO SYSTEMS.** *Security Configuration Guide, Cisco IOS 15.2(7)Ex (Catalyst 2960-L)*: Port Security. Disponível em: [cisco.com](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst2960l/software/15-2_7_e/configuration_guide/sec/b_1527e_security_2960l_cg/port_security.html). Acesso em: 8 nov. 2026. <span class="au-pag">seção Port Security</span> — tipos de endereço MAC seguro (estático, dinâmico e sticky), os três modos de violação e a recuperação da porta.
- **CISCO SYSTEMS.** *Security Configuration Guide: Access Control Lists, Cisco IOS Release 15M&T.* IP Access List Overview. Disponível em: [cisco.com](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/sec_data_acl/configuration/15-mt/sec-data-acl-15-mt-book/sec-access-list-ov.html). Acesso em: 8 nov. 2026. <span class="au-pag">seções Access List Rules e Software Processing of an Access List</span> — uma ACL por interface, por protocolo e por sentido; o `deny` implícito no fim; a ACL de entrada age antes do roteamento; o pacote negado é descartado e o roteador devolve um ICMP de host inalcançável.
- **CISCO NETWORKING ACADEMY.** *CCNA: Switching, Routing, and Wireless Essentials (SRWE).* Cisco Systems, 2026. Disponível em: https://www.netacad.com/. Acesso em: 8 nov. 2026. <span class="au-pag">numeração da versão 7.0, módulo 11, Switch Security Configuration</span> — configuração de segurança de switch, como o port security.
- **CISCO NETWORKING ACADEMY.** *CCNA: Enterprise Networking, Security, and Automation (ENSA).* Cisco Systems, 2026. Disponível em: https://www.netacad.com/. Acesso em: 8 nov. 2026. <span class="au-pag">numeração da versão 7.0, módulo 5, ACLs for IPv4 Configuration</span> — configuração de ACLs IPv4.

</div>
</div>

<div class="au-proxima">
<b>➡️ Na próxima aula</b>

Hoje você filtrou o tráfego que passa pelo roteador e prendeu cada porta do switch a um endereço MAC. Se você é da P11, a teórica de terça (10/11) abre a caixa: a anatomia da ACL estendida, o ataque que enche a tabela de endereços MAC do switch e o servidor DHCP (Dynamic Host Configuration Protocol) falso. Na semana seguinte (S17) o cabo some: entra a **rede sem fio**, o padrão 802.11 e a segurança WPA2 e WPA3 (Wi-Fi Protected Access), e o Lab 10 é onde você configura isso.

</div>

</div>
