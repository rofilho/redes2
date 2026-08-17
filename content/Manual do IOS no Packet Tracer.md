---
title: "Manual do IOS no Packet Tracer"
disciplina: Redes de Computadores II
codigo: "49309"
tipo: referencia
anatomia: nao
date: 2026-08-17
tags: [redes2, 2026-2, ios, cisco, packet-tracer, cli, referencia, anexo-comandos]
---
<div class="au-leitura" data-aula="manual-ios">

# 🖥️ Manual do IOS no Packet Tracer

**Disciplina:** 49309 — Redes de Computadores II — Uniube<br>
**Professor:** Romualdo Mathias Filho · **romualdo.filho@uniube.br**<br>
**Vale para:** todas as práticas de S03 a S17

> [!INFO] 🎯 O que esta página é
> Esta é uma **página de referência**, não uma aula. Ela ensina a **operar o console** de um switch Cisco no Packet Tracer: onde você está, como sair de lá, o que a mensagem de erro está dizendo e como não perder o trabalho.
>
> Ela existe porque os laboratórios ensinam **redes**, não datilografia. Quando o Lab 2 pede `interface range fa0/1-2`, ele assume que você sabe entrar no modo de configuração. Se essa parte estiver travando você, o problema não é VLAN — é console. **Guarde o link:** é para cá que você volta em outubro, quando o comando não for o problema.
>
> O **Anexo** no fim é a lista de comandos do semestre, por tema, com a coluna que diz onde cada um aparece.

---

## 📌 1. O prompt é um mapa, e ele diz onde você está

O switch não tem janelas. Tudo o que ele te dá para saber onde você está é a linha em que o cursor pisca — **o prompt**. Ler o prompt é a primeira habilidade, e é a que resolve a maior parte dos erros de console.

Clique no switch → aba **`CLI`** → pressione **Enter** uma vez. Você chega aqui:

```text
Switch>
```

Esse `>` é a sua posição. E ela muda conforme você entra e sai dos modos:

| O que aparece | Onde você está | O que dá para fazer |
| :--- | :--- | :--- |
| `Switch>` | **Modo usuário** | olhar quase nada. É a portaria |
| `Switch#` | **Modo privilegiado** | rodar todo comando `show`, salvar, reiniciar |
| `Switch(config)#` | **Configuração global** | mudar o que vale para o equipamento inteiro |
| `Switch(config-if)#` | **Configuração de interface** | mudar **uma** porta |
| `Switch(config-if-range)#` | Configuração de **várias** interfaces | mudar um grupo de portas de uma vez |
| `Switch(config-vlan)#` | Configuração de VLAN | nomear a VLAN que você acabou de criar |

**A regra que resolve 90% das travadas:** se o comando foi recusado, leia o prompt antes de reler o comando. Comando certo no modo errado é recusado exatamente como comando errado.

### 1.1 Entrar é um comando por degrau, e sair tem atalho

Para descer os degraus, um comando de cada vez:

```ios
Switch> enable
Switch# configure terminal
Switch(config)# interface fa0/1
Switch(config-if)#
```

Para subir, você tem três opções, e elas **não** fazem a mesma coisa:

| Comando | O que faz |
| :--- | :--- |
| `exit` | sobe **um** degrau |
| `end` | volta direto para o `#`, de qualquer profundidade |
| **`Ctrl+Z`** | o mesmo que `end`, sem digitar |

Quem usa `exit` para sair de `(config-if)` cai em `(config)`, não em `#`. Não é erro, mas é meio caminho — e é a origem clássica do "digitei `show vlan brief` e ele recusou".

### 1.2 O comando que consulta sem sair do lugar

Você está em `(config)` e precisa conferir uma tabela. Sair, olhar e voltar custa três comandos. O prefixo **`do`** resolve em um:

```ios
Switch(config)# do show vlan brief
```

`do` executa um comando de modo privilegiado **de dentro** da configuração, e te devolve exatamente onde você estava. Sem ele, o switch responde `% Invalid input detected` — porque `show` não é comando de configuração.

> [!TIP] 💡 O `do` funciona com qualquer `show`
> `do show running-config`, `do show ip interface brief`, `do show mac address-table`. Se o comando funciona no `#`, ele funciona com `do` na frente.

---

## 📌 2. Três teclas economizam metade da digitação

O console foi feito nos anos 90 para gente que digitava o dia inteiro. Ele tem atalhos, e eles não são luxo: em prova prática, digitar tudo por extenso é o que faz o tempo acabar.

### 2.1 A interrogação é o manual embutido

O `?` é o comando mais útil do IOS, e quase ninguém usa. Ele responde duas perguntas diferentes, dependendo de onde você põe:

```text
Switch# sh?
show
```

Com o `?` **colado** na palavra incompleta, ele lista o que **começa** assim.

```text
Switch# show ?
  arp            ARP table
  interfaces     Interface status and configuration
  mac            MAC configuration
  running-config Current operating configuration
  version        System hardware and software status
  vlan           VLAN information
```

Com **espaço** antes do `?`, ele lista o que **pode vir depois**. Essa é a que salva: você nunca precisa lembrar a próxima palavra, só a primeira.

### 2.2 Tab completa, e abreviação funciona sem Tab

Digite `conf` e pressione **Tab**: vira `configure`. O IOS completa qualquer palavra que já esteja inequívoca.

E aqui está o detalhe que muita gente não sabe: **você nem precisa do Tab.** O IOS aceita a abreviação diretamente, desde que ela seja única.

| O que se digita | O que o switch entende |
| :--- | :--- |
| `en` | `enable` |
| `conf t` | `configure terminal` |
| `int fa0/1` | `interface fastethernet 0/1` |
| `sh vl br` | `show vlan brief` |
| `sh ru` | `show running-config` |
| `no shut` | `no shutdown` |

**A abreviação falha quando é ambígua.** `s` sozinho pode ser `show`, `shutdown` ou vários outros, e o switch responde `% Ambiguous command`. A resposta é digitar uma letra a mais, não trocar o comando.

### 2.3 O `no` desfaz, e é assim que se apaga qualquer coisa

Não existe comando de apagar no IOS. Existe o prefixo **`no`**, que desfaz o comando que você deu:

```ios
Switch(config)# interface fa0/1
Switch(config-if)# shutdown              ! desativa a porta
Switch(config-if)# no shutdown           ! reativa
Switch(config-if)# exit
Switch(config)# vlan 30
Switch(config-vlan)# exit
Switch(config)# no vlan 30               ! apaga a VLAN 30
```

**Cuidado com o que o `no` não devolve.** Apagar uma VLAN com `no vlan 30` **não** manda as portas dela de volta para a VLAN 1: elas ficam órfãs, atribuídas a uma VLAN que não existe mais, e param de passar tráfego. O `show vlan brief` simplesmente deixa de listá-las. É a pegadinha nº 2 do Lab 2, e ela derruba gente que confia no `no` como se fosse desfazer do editor de texto.

---

## 📌 3. O que você digitou não está salvo, e o IOS não avisa

Este é o parágrafo mais importante da página.

O switch tem **duas** configurações ao mesmo tempo:

| Nome | Onde vive | O que acontece no `reload` |
| :--- | :--- | :--- |
| **`running-config`** | na memória RAM | **perde tudo** |
| **`startup-config`** | na NVRAM | é ela que volta |

Tudo o que você digita entra na `running-config` **na hora**, e vale imediatamente. Nada disso está salvo. Se o equipamento reiniciar, você perde a aula inteira e o IOS não terá dado nenhum aviso.

Salvar é um comando:

```ios
Switch# copy running-config startup-config
Destination filename [startup-config]?      ! pressione Enter
Building configuration...
[OK]
```

O `write memory` — ou só **`wr`** — faz a mesma coisa em duas letras, e é o que se digita na prática.

> [!WARNING] ⚠️ No Packet Tracer isto morde de duas formas
> **Salvar o arquivo `.pkt` não salva a configuração do switch.** São coisas diferentes: o `.pkt` guarda a topologia e o estado do simulador; a `startup-config` é o que o switch carrega ao ligar. Se você não deu `wr` e usar o botão de reiniciar o equipamento, a configuração vai embora **dentro** de um arquivo que você salvou.
>
> **E a recíproca:** para conferir se salvou, compare as duas. `show startup-config` num switch nunca salvo responde que a configuração não existe.

Para conferir o que está em vigor agora:

```ios
Switch# show running-config
```

Ele despeja a configuração inteira, e vai parar em `--More--`. **Espaço** avança uma tela, **Enter** avança uma linha, **`q`** sai.

---

## 📌 4. Quatro mensagens de erro, e o que cada uma quer dizer

O IOS não explica. Ele diz uma frase curta e devolve o prompt. Estas quatro cobrem quase tudo o que vai acontecer com você:

| A mensagem | O que realmente aconteceu | O que fazer |
| :--- | :--- | :--- |
| `% Invalid input detected at '^' marker` | o `^` aponta **exatamente** onde a linha deixou de fazer sentido | olhe o `^`, não o comando inteiro. Costuma ser modo errado ou falta do `do` |
| `% Incomplete command` | o comando existe, mas falta argumento | repita com ` ?` no fim: ele lista o que falta |
| `% Ambiguous command` | a abreviação serve para mais de um comando | digite uma letra a mais |
| `% Invalid input... ` num comando **certo** | você está no modo errado | leia o prompt (bloco 1) |

### 4.1 A travada de 30 segundos que parece equipamento quebrado

Digite um comando inexistente no modo privilegiado — um erro de digitação, por exemplo `shwo vlan brief` — e o switch **congela** por dezenas de segundos:

```text
Switch# shwo vlan brief
Translating "shwo"...domain server (255.255.255.255)
```

Não travou. O IOS supôs que `shwo` era um **nome de máquina** que você quer acessar, e saiu procurando um servidor de DNS que não existe. Ele vai esperar o tempo todo antes de desistir.

**As duas saídas:**
- **Cortar agora:** `Ctrl+Shift+6` interrompe a espera.
- **Curar de uma vez:** desligue essa suposição no equipamento.

```ios
Switch(config)# no ip domain-lookup
```

Este é o primeiro comando que eu digito em qualquer switch novo, e recomendo que seja o seu também. Ele não muda nada na rede e economiza minutos ao longo do semestre.

### 4.2 A mensagem que aparece no meio do que você está digitando

Você está digitando e o switch cospe um aviso no meio da linha:

```text
Switch(config-if)#no shut
%LINK-5-CHANGED: Interface FastEthernet0/1, changed state to up
down
```

O aviso é legítimo — é o link subindo — mas ele entrou **por cima** da sua digitação e agora você não sabe o que já escreveu. O texto continua correto: o console mostrou a mensagem, não a inseriu no comando. Pressione **Enter** e digite de novo.

Para que isso pare de acontecer:

```ios
Switch(config)# line console 0
Switch(config-line)# logging synchronous
```

O switch passa a esperar você terminar a linha antes de avisar qualquer coisa.

---

## 📌 5. O que fazer nos primeiros dois minutos de qualquer switch

Esta é a sequência que eu uso, e ela vale para qualquer laboratório do semestre. Nenhum destes comandos configura rede — eles preparam o equipamento para você trabalhar nele.

```ios
Switch> enable
Switch# configure terminal
Switch(config)# hostname SW-LAB02              ! nome no prompt: voce sabe onde esta
SW-LAB02(config)# no ip domain-lookup          ! fim das travadas de 30s
SW-LAB02(config)# line console 0
SW-LAB02(config-line)# logging synchronous     ! avisos param de cortar a digitacao
SW-LAB02(config-line)# end
SW-LAB02# write memory                         ! e SALVE
```

**O `hostname` não é enfeite.** Numa topologia com três switches, `Switch#` em três abas abertas é a receita para configurar a VLAN certa no equipamento errado. Trinta segundos de nomear evitam vinte minutos de caçar.

> [!NOTE] 💼 Por que isto aparece em entrevista
> "Como você começa num equipamento que nunca viu?" A resposta que impressiona não é uma configuração — é **`show running-config`, `show version`, `show interfaces status`**: descobrir o que está lá antes de mudar qualquer coisa. Quem chega configurando não sabe o que quebrou.

---

## 📎 Anexo — Lista de comandos do semestre

> **Escopo:** esta lista tem o que **esta disciplina** usa, não o IOS inteiro. O Packet Tracer implementa um **subconjunto** do IOS real: comando que não está aqui pode existir no equipamento de verdade e não funcionar no simulador. Antes de contar com um comando fora desta lista numa avaliação, teste.
>
> A coluna **Onde** aponta a semana em que o comando entra. Comando de semana futura está aqui para consulta, e não é cobrado antes.

### A.1 Navegação e console

| Comando | O que faz | Onde |
| :--- | :--- | :-: |
| `enable` · `en` | modo usuário → privilegiado (`>` vira `#`) | S03 |
| `configure terminal` · `conf t` | privilegiado → configuração global | S04 |
| `exit` | sobe um modo | S04 |
| `end` · `Ctrl+Z` | volta direto para o `#` | S04 |
| `do <comando>` | roda comando de `#` sem sair da configuração | S04 |
| `?` | lista o que cabe naquela posição | S03 |
| **Tab** | completa a palavra | S03 |
| `Ctrl+Shift+6` | interrompe comando travado | S03 |
| `no ip domain-lookup` | acaba com a espera de DNS em erro de digitação | S03 |
| `hostname <nome>` | nomeia o equipamento no prompt | S03 |
| `line console 0` + `logging synchronous` | avisos param de cortar a digitação | S03 |

### A.2 Salvar, conferir e zerar

| Comando | O que faz | Onde |
| :--- | :--- | :-: |
| `show running-config` · `sh ru` | a configuração **em vigor** (RAM, não salva) | S03 |
| `show startup-config` | a configuração **salva** (NVRAM) | S03 |
| `copy running-config startup-config` | salva | S03 |
| `write memory` · `wr` | o mesmo, em duas letras | S03 |
| `show version` | modelo, versão do IOS, número de portas | S03 |
| `erase startup-config` | apaga a salva | S03 |
| `reload` | reinicia | S03 |

> ⚠️ **`erase startup-config` + `reload` devolve o equipamento ao estado de fábrica.** É a dupla que se usa para começar um laboratório limpo, e é a que apaga o seu trabalho se você errar a hora.

### A.3 Portas

| Comando | O que faz | Onde |
| :--- | :--- | :-: |
| `interface fa0/1` · `int fa0/1` | entra em **uma** porta | S04 |
| `interface range fa0/1-4` | entra em **várias** de uma vez | S04 |
| `description <texto>` | anota para que serve a porta | S04 |
| `shutdown` / `no shutdown` | desativa / reativa | S04 |
| `show interfaces status` | as portas, o link e a VLAN de cada uma | S04 |
| `show interfaces fa0/1 switchport` | a ficha de **uma** porta: modo e VLAN | S04 |
| `show ip interface brief` | resumo de estado por interface | S04 |

> ⚠️ **`show interfaces switchport` sem a porta no meio despeja as 26 interfaces.** Sempre com a interface: `show interfaces fa0/1 switchport`.

### A.4 VLAN e trunk

| Comando | O que faz | Onde |
| :--- | :--- | :-: |
| `vlan 10` | cria a VLAN 10 (e entra nela) | S04 |
| `name FINANCEIRO` | nomeia a VLAN em que você está | S04 |
| `no vlan 10` | apaga a VLAN — **e deixa as portas dela órfãs** | S04 |
| `switchport mode access` | a porta serve **uma** VLAN | S04 |
| `switchport access vlan 10` | **qual** VLAN ela serve | S04 |
| `show vlan brief` · `sh vl br` | as VLANs e as portas de cada uma | S04 |
| `show mac address-table` | quem transmitiu, por qual porta, em qual VLAN | S03 |
| `switchport mode trunk` | a porta carrega **várias** VLANs | S05 |
| `switchport trunk allowed vlan 10,20` | quais VLANs passam no trunk | S05 |
| `switchport trunk native vlan <n>` | qual VLAN viaja sem etiqueta | S05 |
| `show interfaces trunk` | os trunks, o encapsulamento e as VLANs permitidas | S05 |

### A.5 Endereço no switch, e o que vem depois da N1

| Comando | O que faz | Onde |
| :--- | :--- | :-: |
| `interface vlan 1` + `ip address <ip> <máscara>` | dá endereço de gerência ao switch | S06 |
| `ip default-gateway <ip>` | gateway do próprio switch | S06 |
| `show spanning-tree` | quem é a root bridge e o estado de cada porta | S07 |
| `show ip dhcp binding` | os endereços que o servidor DHCP entregou | S08 |
| `show ip route` | a tabela de rotas | S11 |
| `show ip ospf neighbor` | os vizinhos OSPF e o estado da adjacência | S11 |
| `show ip nat translations` | as traduções NAT ativas | S14 |
| `show access-lists` | as ACLs e quantas vezes cada linha foi usada | S15 |
| `switchport port-security` | limita quais MACs podem usar a porta | S16 |

### A.6 Nos PCs, não no switch

Estes rodam na aba `Desktop` → `Command Prompt` da estação, e não no console do switch.

| Comando | O que faz |
| :--- | :--- |
| `ipconfig` | o endereço, a máscara e o gateway daquela máquina |
| `ipconfig /all` | o mesmo, mais o endereço MAC |
| `ping <ip>` | testa alcance. **Leia a estatística, não a primeira linha** |
| `arp -a` | o cache ARP: quem esta máquina já conseguiu resolver |
| `arp -d` | apaga o cache, para o próximo teste começar do zero |
| `tracert <ip>` | o caminho salto a salto |

> ⚠️ **O primeiro `ping` de uma conversa nova costuma dar `Request timed out`** — o host ainda está resolvendo o ARP e o primeiro pacote morre esperando. Não é defeito. É por isso que a régua é a linha de estatística, e nunca a primeira resposta.

---

<div class="au-refs">
<b>Referências desta página</b>

- CISCO NETWORKING ACADEMY. **CCNA: Introduction to Networks (ITN).** Cisco Systems. Disponível em: https://www.netacad.com/. Acesso em: 17 ago. 2026. <span class="au-pag">módulo 2 — configuração básica de switch: modos de acesso ao IOS, navegação, ajuda contextual e salvamento de configuração</span>
- CISCO NETWORKING ACADEMY. **CCNA: Switching, Routing, and Wireless Essentials (SRWE).** Cisco Systems. Disponível em: https://www.netacad.com/. Acesso em: 17 ago. 2026. <span class="au-pag">módulos 1 a 3 — configuração de switch, VLANs e trunking</span>

</div>

---

*Última atualização: 17/08/2026*

**◀ [Voltar ao índice da disciplina](./)**

</div>
