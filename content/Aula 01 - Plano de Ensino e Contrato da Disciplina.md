---
title: "Aula 01 — Plano de Ensino e Contrato da Disciplina"
disciplina: Redes de Computadores II
codigo: "49309"
aula: 1
tipo: teorica
turma: T (11+12)
semana: 1
date: 2026-07-28
tags: [redes2, 2026-2, plano-de-ensino, cronograma, contrato]
---

<div class="au-leitura" data-aula="s01">

# 🟢 Aula 01 — Plano de Ensino e Contrato da Disciplina

**Disciplina:** Redes de Computadores II (49309) · Ciência da Computação — Uniube
**Professor:** Romualdo Mathias Filho
**Semana:** 1 · **Terça, 28/07/2026** · VIA203 · 📘 Teórica (75 min)

---

<div class="au-caminho">
<b>Nosso caminho até aqui</b>

Esta é a primeira aula de Redes II, então o "até aqui" é **Redes I** — a disciplina não recomeça, ela continua. Responda **antes** de abrir cada resposta.

As mesmas três questões vão nos cartões Plickers daqui a pouco, **sem nota e sem registro**. Elas servem para uma coisa só: me mostrar onde a turma está fraca antes de eu acelerar. Errar hoje é de graça; errar em setembro, não.

<details>
<summary>Dois hosts têm o IP 192.168.10.20/24 e 192.168.10.200/26. Eles se enxergam?</summary>

**Não, e o culpado é a máscara.** O `/26` coloca o segundo host no bloco `192.168.10.192–255`; o `/24` coloca o primeiro num bloco que vai de `.0` a `.255`. O primeiro acha que o segundo é vizinho e envia direto; o segundo acha que o primeiro é estrangeiro e manda para o gateway. A conversa fica **torta**, não simetricamente quebrada — e é isso que confunde quem testa só de um lado.

Por que isto importa aqui: **cada VLAN do semestre vai ser uma sub-rede.** Uma máscara errada na S03 derruba o roteamento inteiro da S05, e o sintoma vai ser exatamente este — assimétrico, e por isso difícil de ler.

</details>

<details>
<summary>Um host tem gateway configurado, mas o gateway pertence a outra sub-rede. O que ele consegue fazer?</summary>

**Tudo dentro da própria sub-rede, e nada fora dela.** O host só usa o gateway para *sair*; se o endereço do gateway não cai dentro do bloco dele, ele nem tenta — não há como entregar um quadro a alguém que, pela conta dele, não é alcançável localmente. Sintoma clássico: "pingo o colega do lado e não abro nada da internet".

Por que isto importa aqui: é o erro que derruba `router-on-a-stick` na **S05**, quando **cada VLAN passar a ter o seu próprio gateway**. Um erro só, multiplicado por quantas VLANs você criar.

</details>

<details>
<summary>"A internet caiu" — mas o host pinga 8.8.8.8 normalmente. O que quebrou?</summary>

**A resolução de nomes, não a conectividade.** Se o pacote chega ao endereço, camadas 1 a 3 estão de pé; o que falhou foi traduzir nome em endereço — camada 7, DNS. São coisas diferentes, e confundi-las é o motivo de metade dos chamados de rede começarem no lugar errado.

Por que isto importa aqui: é o princípio de que **sintoma não é diagnóstico** — e você vai usá-lo em toda prática deste semestre, a começar pela desta semana.

</details>
</div>

> [!INFO] 🎯 Visão geral e recursos
> Em novembro você vai construir, sozinho, uma rede corporativa completa: segmentada em VLANs, com roteamento dinâmico, saída para a internet e política de acesso — e vai ter três minutos para defender por que fez cada escolha. **Hoje a gente combina como chegar lá.**
>
> **O que você leva desta aula**
> - Como a disciplina funciona por dentro — e por que ela vai parecer mais difícil do que uma aula expositiva, sendo mais eficaz.
> - O mapa completo: as 20 semanas, as datas das duas provas, os feriados que atingem **a sua** turma.
> - Onde cada um dos 100 pontos é ganho, com que instrumento e em que data.
> - Os acordos de sala — escritos e votados por vocês, não decretados por mim.
>
> **📂 Recursos**
> - [Cisco Packet Tracer + conta NetAcad](https://www.netacad.com/) — grátis e obrigatório. **P12:** instalar até quinta, 30/07. **P11:** você já precisou dele no Lab 0 de segunda — se não conseguiu instalar, me procure hoje, no intervalo.
> - [Wireshark](https://www.wireshark.org/download.html) — analisador de tráfego, grátis
> - [Vevox](https://vevox.app/) — votação e exit ticket (anônimo, sem cadastro)
> - AVA Uniube On-line — entregas, Uniube+ e o vídeo de 6 min de cada semana

### ⏱️ Os 75 minutos de hoje

| Min | Bloco | Onde está nesta página |
| :-- | :--- | :--- |
| 0–5 | Entrada, chamada, projetor | — |
| 5–13 | **Nosso caminho até aqui** — 3 questões de Redes I no Plickers, sem nota | bloco de abertura |
| 13–28 | **O contrato** — como esta disciplina funciona e por quê | Tópico 1 |
| 28–30 | Pausa procedural (estreia do ritual) | Tópico 1 |
| 30–40 | **O mapa** — arco do semestre, calendário, as três turmas, demonstração ao vivo | Tópico 2 |
| 40–48 | **ConcepTest #1** no Plickers — vota, discute, revota | Tópico 2 |
| 48–58 | **Os 100 pontos** — avaliação, política de IA, ferramentas | Tópico 3 |
| 58–67 | **Votação dos acordos de sala** | Slot interativo |
| 67–70 | Reflexão + exit ticket | Fechamento |
| **70–75** | **Folga** — máquina que não liga, dúvida longa, sala trocada | — |

> Só **um** ConcepTest cabe hoje, e é deliberado: a primeira aula tem contrato demais para levar dois. O segundo — o da política de IA — está nesta página como **"aposte antes de ver"**, para você responder sozinho, e volta ao Plickers na S05.

<aside class="au-antes">
<b class="au-nota-t">Antes de começar</b>

Cinco palavras que vão aparecer toda semana. Elas são o vocabulário da disciplina, não jargão de pedagogia:

**Retrieval (recuperação)** — responder de memória, sem consultar. É o que a abertura de toda aula faz. Diferente de reler, que dá sensação de saber sem produzir memória.

**Espiral** — a questão antiga que volta na abertura, semanas depois. É espaçamento de graça.

**ConcepTest** — você vota numa pergunta conceitual → discute com o vizinho → vota de novo. Se a turma se dividir, a discussão vale mais que a minha explicação.

**Completion** — o percentual que o arquivo `.pka` do Packet Tracer mostra na tela. É assim que o laboratório vira nota, na hora, sem espera.

**AIAS** — a escala de 1 a 5 que declara **quanto** de IA é permitido em cada instrumento. Nesta disciplina vai de 1 (nenhuma) a 3 (colaboração declarada).

</aside>

---

## 📌 1. O contrato: como esta disciplina funciona [Teoria ⏳ 15 min + 2 de pausa]

### 1.1 O aviso que quase nenhum professor dá

Você vai trabalhar mais nesta disciplina do que numa aula expositiva tradicional. E vai **sentir que está aprendendo menos.**

Isso não é impressão sua: é resultado medido. Deslauriers e colegas puseram alunos de Harvard em duas versões da mesma aula — expositiva excelente e ativa, mesmo conteúdo, mesmo instrutor. Os da ativa **aprenderam mais** e **avaliaram a própria aprendizagem como pior**. A fluência da aula expositiva é confortável e engana; o esforço da aula ativa incomoda e funciona.

Estou dizendo isso na primeira aula de propósito, e vou lembrar em novembro. Sem esse combinado, o método vira reclamação em vez de virar nota.

**O que sustenta a escolha:** aprendizagem ativa eleva desempenho em *g* = 0,47 e derruba a reprovação de 33,8% para 21,8% (Freeman et al., 2014) — e o ganho é **maior para quem chega com menos base** (Theobald et al., 2020). Se você acha que está atrás, este formato é a seu favor, não contra.

### 1.2 O ritual de toda aula

| Momento | O que acontece | Quanto dura |
| :--- | :--- | :--- |
| **Nosso caminho até aqui** | 3 a 4 questões de recuperação — as recentes mais **uma antiga**, em espiral. Sem nota. | 6–8 min |
| **Gancho** | Uma história real de rede que caiu, terminando numa pergunta. | 2 min |
| **Exposição em blocos** | Nunca mais de 15 min seguidos falando. | — |
| **Pausa procedural** | "Comparem anotações com o colega. Eu fico calado." | 2 min |
| **ConcepTest** | Você vota → discute com o vizinho → vota de novo. | 8 min, 2× |
| **Exit ticket** | "O que ficou mais confuso hoje?" — e isso **abre** a aula seguinte. | 3 min |

> [!TIP] 💡 Dica de produção
> A abertura com questões parece perda de tempo. É o oposto: **recuperar da memória é o que fixa**, não reler. O efeito é robusto (*g* ≈ 0,50) e cresce quando as questões voltam com alguns dias de intervalo — é por isso que sempre tem uma questão velha na abertura. Quem estuda relendo o slide na véspera **sente** que sabe. Quem responde às perguntas descobre que não sabia, com tempo de corrigir.

> [!WARNING] ⚠️ Gotcha de infraestrutura
> A rede da faculdade não aguenta vinte downloads simultâneos do Packet Tracer. **Instale em casa, hoje.**
> **P12 (quinta):** você tem até 30/07 — chegar sem o simulador é passar o laboratório olhando a tela do colega, e o Lab 0 vale ponto. **P11 (segunda):** o seu Lab 0 foi ontem; se você não conseguiu instalar a tempo, me procure hoje que a gente resolve antes que vire nota perdida.

> [!NOTE] 💼 Pergunta de entrevista
> *"Você entrou num time e a rede do cliente não tem documentação. Por onde começa?"*
>
> **Resposta esperada de um sênior:** antes de tocar em qualquer configuração, levantar o estado atual — topologia física, tabela de VLANs, endereçamento, rotas — e **escrever isso**. Mudança sem inventário é aposta. É exatamente por isso que a documentação vale ponto na rubrica do projeto integrador deste semestre: no mercado, a rede que ninguém consegue desenhar é a rede que ninguém consegue consertar.

### 1.3 Os acordos de sala — a gente escreve juntos

Regra que o professor decreta, o aluno obedece. Regra que a turma escreve, a turma cobra. Normas coconstruídas geram menos violação do que normas impostas, e o Center for Teaching Innovation de Cornell trata isso como prática padrão de primeira aula (referência no fim da página).

**Hoje a turma propõe e vota 4 a 5 acordos.** Entro com quatro propostas na mesa; vocês cortam, mudam e acrescentam:

1. **Celular é agendado, não proibido.** Há janelas em que o celular *é* a ferramenta (Vevox, consultar documentação) e janelas de tela para baixo (recuperação, prova, defesa). Proibição total não se sustenta na evidência; distração, sim (Ravizza et al., 2017).
2. **Pergunta errada é matéria-prima.** O distrator de um ConcepTest sai de erro real cometido nesta sala. Errar em voz alta acelera a turma inteira.
3. **Dupla é rotativa.** Ninguém passa o semestre com o mesmo par — e ninguém carrega o outro no laboratório.
4. **Quem chega atrasado entra em silêncio.** A abertura é curta e é a parte que mais rende; ela não para.

<details class="au-aposta">
<summary>Antes de rolar: se aula ativa dá mais resultado, por que tanto aluno prefere a expositiva?</summary>

Porque a aula expositiva boa é **fluente** — fácil de acompanhar — e o cérebro confunde facilidade de processamento com aprendizagem. Deslauriers et al. (2019) mediram exatamente essa dissociação: mais aprendizagem real, menos percepção de aprendizagem.

A consequência prática para você: **o desconforto do retrieval é sinal de que está funcionando**, não sinal de aula mal dada. Quando em setembro você sair de uma aula achando que não entendeu nada e mesmo assim acertar a prova, é isto acontecendo.

</details>

---

## 📌 2. O mapa: cronograma, calendário e as três turmas [Teoria + demonstração ⏳ 10 min + 8 de ConcepTest]

### 2.1 O arco do semestre

<figure class="au-fig">
<svg viewBox="0 0 700 200" role="img" aria-label="Linha do tempo do semestre: Bloco 1 de comutacao e segmentacao nas semanas 2 a 8, prova N1 em 22 de setembro, Bloco 2 de roteamento e seguranca nas semanas 11 a 17, prova N2 em 1 de dezembro, e o projeto integrador nas semanas 18 e 19 pendurado do Bloco 2">
<rect x="20" y="20" width="210" height="78" rx="6" fill="none" stroke="#2778c4" stroke-width="2"></rect>
<text x="125" y="41" text-anchor="middle" font-size="13" fill="#2778c4" font-family="monospace" font-weight="bold">BLOCO 1 · S02–S08</text>
<text x="125" y="58" text-anchor="middle" font-size="11" fill="#8a8f98" font-family="monospace">comutar e segmentar</text>
<text x="125" y="74" text-anchor="middle" font-size="10" fill="#8a8f98" font-family="monospace">VLAN · trunk · inter-VLAN</text>
<text x="125" y="89" text-anchor="middle" font-size="10" fill="#8a8f98" font-family="monospace">STP · EtherChannel · DHCP</text>
<line x1="230" y1="59" x2="246" y2="59" stroke="#8a8f98" stroke-width="2"></line>
<rect x="246" y="36" width="86" height="46" rx="6" fill="none" stroke="#b1541b" stroke-width="2.5"></rect>
<text x="289" y="56" text-anchor="middle" font-size="12" fill="#b1541b" font-family="monospace" font-weight="bold">PROVA N1</text>
<text x="289" y="73" text-anchor="middle" font-size="12" fill="#b1541b" font-family="monospace">22/09</text>
<line x1="332" y1="59" x2="348" y2="59" stroke="#8a8f98" stroke-width="2"></line>
<rect x="348" y="20" width="210" height="78" rx="6" fill="none" stroke="#2778c4" stroke-width="2"></rect>
<text x="453" y="41" text-anchor="middle" font-size="13" fill="#2778c4" font-family="monospace" font-weight="bold">BLOCO 2 · S11–S17</text>
<text x="453" y="58" text-anchor="middle" font-size="11" fill="#8a8f98" font-family="monospace">rotear e proteger</text>
<text x="453" y="74" text-anchor="middle" font-size="10" fill="#8a8f98" font-family="monospace">OSPF · NAT/PAT · ACL</text>
<text x="453" y="89" text-anchor="middle" font-size="10" fill="#8a8f98" font-family="monospace">port security · WLAN</text>
<line x1="558" y1="59" x2="574" y2="59" stroke="#8a8f98" stroke-width="2"></line>
<rect x="574" y="36" width="86" height="46" rx="6" fill="none" stroke="#b1541b" stroke-width="2.5"></rect>
<text x="617" y="56" text-anchor="middle" font-size="12" fill="#b1541b" font-family="monospace" font-weight="bold">PROVA N2</text>
<text x="617" y="73" text-anchor="middle" font-size="12" fill="#b1541b" font-family="monospace">01/12</text>
<line x1="453" y1="98" x2="453" y2="136" stroke="#00aa9f" stroke-width="2" stroke-dasharray="4 3"></line>
<rect x="328" y="136" width="250" height="48" rx="6" fill="none" stroke="#00aa9f" stroke-width="2"></rect>
<text x="453" y="157" text-anchor="middle" font-size="12" fill="#00aa9f" font-family="monospace" font-weight="bold">PROJETO INTEGRADOR · S18–S19</text>
<text x="453" y="174" text-anchor="middle" font-size="10" fill="#8a8f98" font-family="monospace">tudo junto + defesa oral de 3 min</text>
</svg>
<figcaption class="au-legenda">Azul é conteúdo, laranja é dia de nota, verde é entrega final — e essa convenção de cor não muda em nenhum diagrama do semestre. Repare que o projeto integrador não é um bloco novo: ele pendura do Bloco 2 porque cobra tudo o que veio antes.</figcaption>
</figure>

**Redes I ensinou a rede a funcionar. Redes II ensina a rede a não cair** — e a não deixar o problema de um setor derrubar os outros.

### 2.2 A demonstração de hoje: a rede plana que virou tempestade

Antes do cronograma, um problema real, montado ao vivo no Packet Tracer: **quarenta hosts pendurados num único switch, sem nenhuma divisão.** Cada broadcast que qualquer máquina emite chega a todas as outras. Basta um laço acidental de cabo, ou uma placa defeituosa repetindo quadros, para o tráfego se multiplicar até que ninguém mais consiga transmitir. A rede não é invadida nem desligada — ela **se afoga sozinha**.

> [!NOTE] 🃏 ConcepTest Plickers #1
> **Durante a demonstração, antes de eu apertar o botão:** o que acontece com o *ping* entre dois hosts que estão do outro lado da sala, sem nenhuma relação com a máquina defeituosa?
>
> Vote, discuta com o vizinho, vote de novo. A resposta é a razão de existir a semana S03.

A pergunta que essa demonstração deixa em aberto — *"como impedir que o problema de um setor afogue os outros?"* — é literalmente a primeira frase da aula de VLANs, daqui a duas semanas. Guarde a imagem: você vai reencontrá-la.

### 2.3 Semana a semana

Três turmas, três calendários. **T** = teórica de terça (VIA203) · **P11** = prática de segunda (VIA215) · **P12** = prática de quinta (VIA216).

| S | Terça (T) | Segunda (P11) | Quinta (P12) | Conteúdo | Laboratório |
|:-:|:-:|:-:|:-:|---|---|
| **01** | 28/07 | 27/07 | 30/07 | Contrato + diagnóstico de Redes I | **Lab 0** — Resgate: setup + "conserte esta rede" |
| **02** | 04/08 | 03/08 | 06/08 | Comutação: tabela MAC, domínios de colisão e broadcast | **Lab 1** — Switching básico |
| **03** | 11/08 | 10/08 | 13/08 | VLANs: conceito, criação, portas de acesso | **Lab 2** — VLANs |
| **04** | 18/08 | 17/08 | 20/08 | Trunking 802.1Q (+ a etiqueta vista no Wireshark) | **Lab 3** — Trunk entre switches |
| **05** | 25/08 | 24/08 | 27/08 | Roteamento entre VLANs · **consolidação** | **Lab 4** — Router-on-a-stick |
| **06** | 01/09 | 🚫 31/08 | 03/09 | STP: por que um loop de camada 2 derruba a rede | P12: desafio broadcast storm |
| **07** | 08/09 | 🚫 07/09 | 10/09 | EtherChannel + redundância de gateway (FHRP) | P12: desafio EtherChannel |
| **08** | 15/09 | 14/09 | 17/09 | DHCPv4 · SLAAC/DHCPv6 · **revisão N1** | **Lab 5** — DHCP + revisão de STP (a compensação da P11) |
| **09** | 🎯 **22/09 — PROVA N1** | 21/09 | 24/09 | Prova em duas etapas | Troubleshooting integrador |
| **10** | 29/09 | 28/09 | 01/10 | **Vista da N1** — devolutiva por erro · **consolidação** | Refazer os cenários da prova |
| **11** | 06/10 | 05/10 | 08/10 | Roteamento dinâmico + OSPF: introdução | Lab 6 *(formativo)* — OSPF área única |
| **12** | 🚫 13/10 | 🚫 12/10 | 15/10 | (feriados) | P12: prática espiral de OSPF |
| **13** | 20/10 | 19/10 | 22/10 | OSPF: custo, DR/BDR, verificação | Lab 7 *(formativo)* — Diagnóstico OSPF |
| **14** | 27/10 | 26/10 | 29/10 | NAT estático, dinâmico e PAT | Lab 8 *(formativo)* — NAT/PAT |
| **15** | 03/11 | 🚫 02/11 | 05/11 | ACLs padrão: lógica, wildcard, posicionamento | P12: exercícios de ACL |
| **16** | 10/11 | 09/11 | 12/11 | ACLs estendidas + segurança de camada 2 | Lab 9 *(formativo)* — ACL + port security |
| **17** | 17/11 | 16/11 | 19/11 | WLAN: 802.11, WPA2/WPA3, configuração | Lab 10 *(formativo)* — WLAN |
| **18** | 24/11 | 23/11 | 26/11 | **Projeto integrador** + início das defesas | Projeto (vale nota na N2) |
| **19** | 🎯 **01/12 — PROVA N2** | 30/11 | 03/12 | Prova em duas etapas | Defesas orais restantes |
| **20** | 08/12 | 07/12 | 10/12 | **Vista da N2** + substituta + fechamento | — |

🚫 = feriado. **Feriados que atingem a disciplina:** 31/08 · 07/09 · 12/10 · 13/10 · 02/11.
**Em negrito, os laboratórios que valem ponto** (Lab 0 a 5). Os marcados *(formativo)* são obrigatórios e registrados, mas **não valem nota** — o porquê está no bloco 3.1.

> [!WARNING] ⚠️ Sujeito a confirmação da secretaria
> A terça reúne as turmas 11 e 12 na VIA203 conforme o horário publicado em 25/07, e o conteúdo acima segue a ementa da disciplina. **Sala, agrupamento e ementa só se tornam definitivos após a confirmação institucional, prevista para a semana que vem** — qualquer ajuste sai no AVA, não no boca a boca. As datas das provas (22/09 e 01/12) e a distribuição de pontos não mudam.
>
> Há sábados de reposição no calendário acadêmico (29/08, 12/09, 03/10, 24/10, 07/11), mas **qual dia da semana cada um repõe ainda não está confirmado.** Não assuma que o seu sábado é o seu dia.

### 2.4 A assimetria — e por que ela não te prejudica

Repare na coluna da segunda: **a P11 perde quatro aulas em feriado; a P12 não perde nenhuma.** Se cada prática seguisse o próprio ritmo, em novembro as turmas estariam a quatro laboratórios de distância.

A regra do cronograma resolve isso: **laboratório novo só cai em semana em que as duas práticas se encontram.** Nas semanas em que só a P12 tem aula (S06, S07, S15), ela recebe aprofundamento **sem nota** — desafio, diagnóstico extra — e o conteúdo novo fica na teórica de terça, que todo mundo assiste.

A **S12 é o caso extremo** e merece nota própria: ali caem **os dois feriados juntos**, 12/10 e 13/10, então nem a P11 nem a teórica acontecem. Só a P12 tem aula naquela semana, e por isso ela não recebe conteúdo novo nenhum — recebe prática **espiral** de OSPF, que é revisão do que a S11 já deu a todo mundo. Nenhuma turma sai na frente porque, na S12, ninguém anda.

**Consequência direta para a prova:** STP e EtherChannel entram na N1 pedindo **leitura e análise, nunca configuração** — porque configurar isso só a P12 praticou em laboratório. Nenhuma questão cobra algo que a sua turma não teve chance de fazer.

> [!TIP] 💡 Dica de produção
> Guarde a lógica desta seção, porque ela é a mesma de uma janela de manutenção real: quando um time perde capacidade (feriado, incidente, gente de férias), você **não corta o crítico** — corta o acessório e protege o caminho principal. Aqui, o acessório é o aprofundamento de WLAN; o caminho principal é VLAN → roteamento → ACL. Se o semestre atrasar, é WLAN que encolhe.

> [!WARNING] ⚠️ Gotcha de calendário
> A P11 perde 31/08 e 07/09, que são justamente as semanas de STP e EtherChannel. **Isso não significa que o assunto não cai na prova** — cai, pela teórica de terça, que é conjunta. O que muda é o *nível cognitivo* cobrado: explicar e analisar, não configurar. Quem tratar essas duas semanas como "matéria que pulei" chega à N1 devendo duas questões.

---

## 📌 3. Os 100 pontos: avaliação, IA e ferramentas [Teoria ⏳ 10 min]

### 3.1 Onde estão os pontos

Aprovação: **≥ 60 pontos** e **frequência ≥ 75%**.

| Etapa | Total | Prova | Atividade | Uniube+ |
| :--- | :-: | :-- | :-- | :-: |
| **N1** — fecha na S09/S10 | **35** | 25 — prova de 22/09 | 5 — labs `.pka` (Lab 0 a 5, 1 pt cada, contam os **5 melhores**) | 5 |
| **N2** — fecha na S19/S20 | **50** | 30 — prova de 01/12 | 6 — projeto integrador (dupla)<br/>4 — defesa oral (individual) | 10 |
| **Institucional** | **15** | 15 — data definida pela instituição | — | — |

> [!TIP] ✅ Como o ponto do laboratório é apurado — leia isto uma vez e nunca mais tenha dúvida
> O arquivo `.pka` carrega os testes dentro dele e mostra o seu **Completion** na própria tela, durante a aula. **Vale o ponto quem fecha com Completion ≥ 80%.** Você sai da aula sabendo a nota; não existe espera nem "depois eu corrijo".
>
> São **seis** laboratórios valendo (Lab 0 a Lab 5) e contam **os cinco melhores** — o sexto é a sua margem para uma falta, uma internet que caiu ou um dia ruim. O teto continua sendo 5 pontos: fazer os seis não dá 6.

**Os laboratórios 6 a 10 (S11–S17) não valem nota.** Isso é decisão de projeto, não descuido: o ponto da N2 está no projeto integrador, que cobra exatamente as mesmas habilidades (OSPF, NAT, ACL). Laboratório sem nota é laboratório em que dá para errar de propósito — e é errando de propósito que se aprende diagnóstico.

<details class="au-aposta">
<summary>Aposte antes de ver: Marina tirou 22 na prova, fez 4 dos 6 labs e cumpriu o Uniube+. Beatriz tirou 22, fez os 6 labs e zerou o Uniube+. Quem fechou melhor a N1?</summary>

**Marina, por 4 pontos — e a distância vem do lugar mais barato do semestre.**

- Marina: 22 (prova) + **4** (fez quatro labs, soma quatro) + 5 (Uniube+) = **31**
- Beatriz: 22 (prova) + **5** (fez seis, mas o teto é cinco) + 0 = **27**

Beatriz fez **dois laboratórios a mais** que Marina e mesmo assim ficou atrás, porque o sexto laboratório não eleva o teto — ele é margem, não bônus. Os 5 pontos do Uniube+ custam menos esforço do que um único laboratório e valem o mesmo que cinco deles.

**A lição de gestão:** antes de correr atrás do ponto caro, garanta o barato. Vale para nota e vale para prioridade de trabalho.

</details>

### 3.2 A prova em duas etapas

Os 75 minutos da terça de prova funcionam assim:

| Minuto | O quê |
| :-- | :-- |
| 0–50 | **Etapa individual.** Prova completa, sem consulta, sem dispositivos. |
| 50–55 | Entrega. Grupos de 3 a 4 sorteados na hora. |
| 55–73 | **Etapa em grupo.** O grupo refaz **as 4 questões mais difíceis**, uma folha só, consenso obrigatório. |
| 73–75 | Recolhimento. |

**A soma, sem ambiguidade:** a etapa individual e a de grupo **compõem** o valor da prova, não se somam a ele.

| Prova | Etapa individual | Etapa em grupo | Total da prova |
| :--- | :-: | :-: | :-: |
| **N1** (22/09) | 21 | 4 | **25** |
| **N2** (01/12) | 26 | 4 | **30** |

Por que assim: a discussão acontece no pico de ativação da memória — você acabou de sofrer com a questão. O erro é descoberto em cinco minutos, não em duas semanas. A evidência aponta mais retenção, menos ansiedade e preferência forte dos alunos pelo formato (CBE—Life Sciences Education, 2018; Callaghan et al., 2025).

> [!TIP] 💡 Dica de produção
> **Toda prova nasce de uma matriz de especificação**, e cada uma gera três formas paralelas: A (prova), B (substituta) e C (recuperação). Muda o cenário e os valores; a matriz é a mesma. Você não está sendo avaliado por sorte de tema — está sendo avaliado pelos objetivos declarados no início do semestre, e eles estão publicados nesta página.

### 3.3 Política de IA — declarar, não caçar

A régua é a escala AIAS, declarada por instrumento:

| Instrumento | Nível | Na prática |
| :--- | :-- | :--- |
| Provas N1, N2 e Institucional | **1 — Sem IA** | Em sala, sem dispositivos |
| Laboratórios `.pka` | **2 — IA no planejamento** | Pode pesquisar e perguntar; a configuração é sua e o `.pka` valida |
| Projeto integrador | **3 — Colaboração** | Uso livre **com declaração de 3 linhas**: o que pediu, o que aproveitou, o que corrigiu |
| Defesa oral | **1 — Sem IA** | 3 minutos explicando as suas decisões |

**Detector de IA não é usado nem aceito como evidência nesta disciplina.** O motivo é técnico: essas ferramentas produzem falso positivo em taxa alta contra quem não escreve em inglês nativo — a Universidade Vanderbilt desativou o detector do Turnitin exatamente por isso (Vanderbilt University, Center for Teaching, 2023). Declarar o uso não desconta nota. **Não declarar um uso que aparecer na defesa, desconta.**

<details class="au-aposta">
<summary>Aposte antes de ver: um colega entrega uma ACL perfeita e declara "pedi à IA, testei e estava certa". Na defesa, não sabe dizer por que a regra está naquele roteador e não no outro. O que acontece com a nota?</summary>

**Os 6 pontos do projeto ficam de pé. Os 4 da defesa oral, não.**

A declaração foi feita, e declarar é o que a política pede — não há penalidade por usar IA no nível 3, que é exatamente o nível do projeto integrador. A ACL funciona, e a rubrica do projeto avalia a rede entregue.

A defesa oral é outro instrumento, com outro objetivo declarado: ela mede **se você entende o que entregou**. "Por que aqui e não ali" é a pergunta central de posicionamento de ACL — quem não responde não perde ponto por ter usado IA, perde ponto por não saber a matéria. São 4 pontos da N2, e é o único lugar do semestre onde não existe consulta.

**A lição de carreira, que vale mais que os 4 pontos:** ninguém vai te demitir por usar IA. Vão te demitir por aplicar em produção o que você não sabe verificar.

</details>

> [!NOTE] 💼 Pergunta de entrevista
> *"Como você usa IA no trabalho?"* — já é pergunta padrão em entrevista técnica, e a resposta ruim é qualquer um dos dois extremos.
>
> **Resposta de sênior:** *"Uso para acelerar o que eu já sei verificar. Peço rascunho de configuração, mas leio linha a linha antes de aplicar, porque o modelo erra com confiança — e num roteador de produção o erro derruba o cliente."* É essa postura que a **defesa oral** deste semestre mede: não se você usou IA, mas se você entende o que entregou.

### 3.4 As ferramentas do semestre

| Momento | Ferramenta | Custo | Precisa de conta? |
| :--- | :--- | :-- | :--- |
| Laboratórios | **Cisco Packet Tracer** | Grátis | **Sim** — conta NetAcad, resolver esta semana |
| Votação em aula | **Plickers** | Grátis | **Não** — é cartão de papel, sem celular |
| Exit ticket | **Vevox** | Grátis | **Não** — anônimo, por QR |
| Análise de tráfego | **Wireshark** | Grátis | Não |
| Revisão pré-prova | **Gemini Notebook** | Grátis | Opcional — o áudio sai publicado no AVA |
| Material das aulas | **Este portal** | — | Não |
| Entregas e Uniube+ | **AVA Uniube On-line** | — | Institucional |

Nenhuma atividade que vale nota exige conta em serviço estrangeiro além do Packet Tracer, que é exigência técnica da Cisco e está declarada aqui. Onde há cadastro, há caminho equivalente sem cadastro.

---

<div class="au-slot">
<div class="au-slot-h"><b>Interativo</b> · Vevox · 10 min</div>
<div class="au-slot-c">

**Votação dos acordos de sala.** Abra **vevox.app** e entre com o ID de sessão que está no projetor.

1. As quatro propostas do bloco 1.3 aparecem uma a uma: **manter, mudar ou cortar.**
2. Campo aberto para **acrescentar** um acordo que ninguém propôs.
3. Os acordos que passarem de 60% entram na versão final — e **esta página é atualizada até sexta** com o texto votado. O contrato não fica no quadro; fica publicado.

Anônimo, sem cadastro. A votação é da turma, não minha: eu não desempato.

</div>
<p class="au-slot-b"><b>Plano B:</b> se a rede cair, a votação vai nos cartões <b>Plickers</b> — cada proposta é uma pergunta de A/B/C, e o acordo extra vai em meia folha de papel recolhida na saída. Mesmo conteúdo, mesmos 10 minutos, zero dependência de internet.</p>
</div>

---

<div class="au-resumo">
<b>Resumo da aula</b>

| Item | O que você precisa lembrar |
| :--- | :--- |
| **Aprovação** | ≥ 60 pontos **e** ≥ 75% de frequência |
| **Distribuição** | N1 = 35 · N2 = 50 · Institucional = 15 |
| **Datas travadas** | Prova N1 **22/09** · Prova N2 **01/12** · Vistas 29/09 e 08/12 |
| **Formato da prova** | Duas etapas — 50 min individual + 18 min em grupo nas 4 questões mais difíceis |
| **Labs que valem nota** | Lab 0 a 5 (S01–S08), 1 pt cada, **Completion ≥ 80%**, contam os **5 melhores** |
| **Labs formativos** | Lab 6 a 10 (S11–S17) — Completion registrado, sem nota |
| **Projeto integrador** | 6 pts em dupla + 4 pts de defesa oral individual (S18–S19) |
| **Feriados da disciplina** | 31/08 · 07/09 · 12/10 · 13/10 · 02/11 |
| **Regra da assimetria** | Lab novo só em semana em que P11 e P12 se encontram |
| **STP/EtherChannel na N1** | Explicar e analisar — **nunca** configurar |
| **Política de IA** | Declarar por instrumento (AIAS 1 a 3). Sem detector de IA. |
| **Celular** | Agendado, não proibido — janelas declaradas |
| **Pendência da semana** | Conta NetAcad + Packet Tracer — **P12 até 30/07**; P11, se ainda não instalou, falar comigo hoje |
| **Toda aula termina com** | Exit ticket no Vevox — e é ele que **abre** a aula seguinte |

</div>

<div class="au-podcast">
<p><b>🎧 Revisão em áudio (~10 min)</b> — gerada por IA a partir desta página, para ouvir no trajeto. O áudio complementa; a página é a fonte.</p>
<p><i>Disponível em breve.</i></p>
</div>

---

## 🎬 Fechamento — exit ticket (3 min)

Toda aula termina do mesmo jeito: duas perguntas anônimas, sem nota, no **Vevox**. O que você responder aqui **abre a aula da semana que vem** — os pontos mais citados como confusos entram no retrieval de abertura. Não é formalidade: é o canal pelo qual a turma dirige o ritmo da disciplina.

**Hoje:** *(1)* O que mais te preocupa nesta disciplina? *(2)* Qual foi o ponto mais confuso da aula de hoje?

QR projetado no slide final, ou [vevox.app](https://vevox.app/) com o ID de sessão da tela. Sem sinal? Meia folha de papel na saída resolve.

<div class="au-reflexao">
<b>Para pensar até a próxima aula</b>

<p>Hoje você votou nos acordos que vão reger esta sala por 20 semanas. Um deles vai ser quebrado antes de setembro — provavelmente por alguém que votou a favor dele.</p>

<p>A pergunta não é <i>qual</i>. É esta: <b>quem deveria cobrar o acordo quando isso acontecer — eu, ou a turma?</b> E se a sua resposta for "a turma", o que precisa ser verdade sobre a regra para que isso seja possível?</p>
</div>

<div class="au-refs">
<b>Referências desta aula</b>

**Bibliografia da disciplina** — biblioteca virtual da Uniube:

- KUROSE, J. F.; ROSS, K. W. **Redes de computadores e a internet: uma abordagem top-down.** 8. ed. São Paulo: Pearson, 2021. <span class="au-pag">cap. 4 — camada de rede; cap. 5 — roteamento; cap. 6 — camada de enlace e LANs; cap. 7 — redes sem fio</span>
- TANENBAUM, A. S.; FEAMSTER, N.; WETHERALL, D. J. **Redes de Computadores.** 6. ed. São Paulo: Pearson, 2021. <span class="au-pag">cap. 4 — subcamada de acesso ao meio (VLANs, comutação, STP); cap. 5 — camada de rede e roteamento</span>
- LACERDA, P. S. P. et al. **Projeto de Redes de Computadores.** Porto Alegre: Sagah, 2021. <span class="au-pag">cap. 1 e 2 — projeto e documentação de rede (base direta do projeto integrador)</span>
- ROHLING, L. J. **Segurança de redes de computadores.** Curitiba: Contentus, 2020. <span class="au-pag">cap. 3 — controle de acesso (apoio às S15–S16)</span>
- CISCO NETWORKING ACADEMY. **CCNA: Switching, Routing, and Wireless Essentials (SRWE).** Cisco Systems, 2026. Disponível em: https://www.netacad.com/. <span class="au-pag">módulos 1 a 16 — espinha dorsal do conteúdo do semestre</span>

**Evidência que sustenta o formato desta disciplina:**

- FREEMAN, S. et al. Active learning increases student performance in science, engineering, and mathematics. **PNAS**, v. 111, n. 23, 2014. <span class="au-pag">p. 8410–8415</span>
- DESLAURIERS, L. et al. Measuring actual learning versus feeling of learning in response to being actively engaged in the classroom. **PNAS**, v. 116, n. 39, 2019. <span class="au-pag">p. 19251–19257</span>
- THEOBALD, E. J. et al. Active learning narrows achievement gaps for underrepresented students. **PNAS**, v. 117, n. 12, 2020. <span class="au-pag">p. 6476–6483</span>
- ROWLAND, C. A. The effect of testing versus restudy on retention: a meta-analytic review of the testing effect. **Psychological Bulletin**, v. 140, n. 6, 2014. <span class="au-pag">p. 1432–1463</span>
- RAVIZZA, S. M.; UITVLUGT, M. G.; FENN, K. M. Logged in and zoned out: how laptop internet use relates to classroom learning. **Psychological Science**, v. 28, n. 2, 2017. <span class="au-pag">p. 171–180</span>
- CORNELL CENTER FOR TEACHING INNOVATION. **Establishing Community Agreements and Classroom Norms.** Cornell University. Disponível em: https://teaching.cornell.edu/resource/establishing-community-agreements-and-classroom-norms. <span class="au-pag">seç. "Facilitating the process"</span>
- **CBE — Life Sciences Education**, v. 17, art. 21, 2018; e CALLAGHAN, T. et al., 2025 (arXiv:2504.04281) — provas em duas etapas: retenção, ansiedade e preferência dos alunos. <span class="au-pag">art. 21, seç. "Results"</span>
- VANDERBILT UNIVERSITY, CENTER FOR TEACHING. **Guidance on AI detection and why we're disabling Turnitin's AI detector.** 2023. Disponível em: https://www.vanderbilt.edu/brightspace/2023/08/16/guidance-on-ai-detection-and-why-were-disabling-turnitins-ai-detector/. <span class="au-pag">seç. "Why we disabled it"</span>

**Leitura de aprofundamento (10 min):** o material de Cornell acima sistematiza por que normas **coconstruídas** superam normas impostas e traz o roteiro de facilitação — propor poucas normas iniciais, abrir para emenda, votar e **documentar num lugar acessível**. É exatamente o procedimento do bloco 1.3, e a razão de os acordos ficarem publicados nesta página em vez de morrerem no quadro. Útil para quem for dar aula, treinar equipe ou liderar time técnico.

</div>

<div class="au-proxima">
<b>Na próxima aula</b>

<p>Hoje você viu quarenta máquinas se afogarem no próprio broadcast e eu não expliquei por quê. Na próxima, a gente abre o switch e descobre <b>como ele decide para onde mandar cada quadro</b> — e por que essa decisão, sozinha, cria o problema que o semestre inteiro vai passar consertando.</p>
</div>

---

*Última atualização: 26/07/2026 · Sujeito à confirmação institucional (ver aviso no bloco 2.3).*

**◀ [Voltar ao índice da disciplina](./)**

</div>
