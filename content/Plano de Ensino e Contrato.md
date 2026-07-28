---
title: "Plano de Ensino e Contrato — Redes de Computadores II"
disciplina: Redes de Computadores II
codigo: "49309"
tipo: referencia
anatomia: nao
date: 2026-07-28
tags: [redes2, 2026-2, plano-de-ensino, cronograma, contrato]
---

<div class="au-leitura" data-aula="plano">

# 📘 Plano de Ensino e Contrato — Redes de Computadores II

**Disciplina:** Redes de Computadores II (49309) — Uniube<br>
**Professor:** Romualdo Mathias Filho<br>
**Semestre:** 2026-2 · Teórica: terça, VIA203 · Práticas: P11 segunda (VIA215) · P12 quinta (VIA216)

> [!INFO] 🎯 O que esta página é
> Esta é a **página de referência do semestre**, não uma aula. Conteúdo das 20 semanas, calendário das três turmas, composição da nota, prova em duas etapas, segunda chamada, recuperação, escala de IA por instrumento, ferramentas e bibliografia — tudo mora aqui. **As regras de sala ficam na Aula 01**, não aqui.
>
> Ela é apresentada na [Aula 01](./Aula-01---Plano-de-Ensino-e-Contrato-da-Disciplina) e depois fica de consulta. **Guarde o link:** é para cá que você volta em outubro, quando a dúvida for de prazo e não de matéria. Sempre que algo pendente for confirmado, é esta página que muda.

---

## 📌 1. A disciplina: o que Redes II cobre

### 1.1 O que você vai saber fazer em dezembro

**Redes I ensinou a rede a funcionar. Redes II ensina a rede a não cair** — e a não deixar o problema de um setor derrubar os outros.

> [!NOTE] 📌 Este recorte é proposta, não ementa homologada
> A **ementa oficial de 49309 ainda não foi confirmada no AVA**. Os objetivos e o conteúdo desta página são o recorte que eu proponho, alinhado à progressão CCNA (SRWE). Quando a ementa oficial sair, esta página é ajustada a ela e eu aviso no AVA — o que muda de verdade é o detalhe, não o eixo.

Ao fim do semestre você deve ser capaz de:

1. **Segmentar** uma rede em VLANs e justificar a divisão a partir do domínio de broadcast.
2. **Interligar** as VLANs com roteamento, e diagnosticar quando a comunicação entre elas falha.
3. **Proteger** a topologia de camada 2 contra loop e contra porta indevida (STP, port security).
4. **Rotear** dinamicamente com OSPF e ler a tabela de rotas para explicar a escolha do caminho.
5. **Conectar** a rede interna à internet com NAT/PAT e aplicar política de acesso com ACL.
6. **Diagnosticar de baixo para cima**, camada por camada — a habilidade que o Lab 0 da S01 começa a treinar.
7. **Documentar e defender** o projeto: em novembro você constrói uma rede corporativa completa e tem três minutos para explicar por que fez cada escolha.

### 1.2 O conteúdo, em dois blocos

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

---

## 📌 2. O calendário: 20 semanas e três turmas

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
| **09** | 🎯 **22/09 — PROVA N1** | 21/09 | 24/09 | Prova em duas etapas | Diagnóstico integrador |
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
| **20** | 08/12 | 07/12 | 10/12 | **Vista da N2** + fechamento | — |

### Depois da S20

| Quando | O quê | De quem é a data |
| :-- | :--- | :-- |
| **14 a 16/12** | Segunda chamada | calendário da universidade |
| **17 ou 18/12** | Recuperação | **minha** — confirmo no AVA |
| até **18/12** | Lançamento das notas da N2 | calendário da universidade |
| **19/12** | Encerramento do semestre | calendário da universidade |

As notas da N1 saem até **12/10**. Divergiu do AVA? Vale o AVA.

### Como ler a tabela acima

| Marca | O que significa |
| :-- | :--- |
| 🚫 | Feriado, sem aula |
| **negrito** no laboratório | Vale ponto (Lab 0 a 5) |
| *(formativo)* | Obrigatório e registrado, **sem nota** — o porquê está no bloco 3.1 |

**Os feriados que atingem a disciplina:** 31/08 · 07/09 · 12/10 · 13/10 · 02/11.

Destes, 07/09, 12/10 e 02/11 são nacionais. **31/08 e 13/10 vêm do calendário acadêmico da Uniube** — 13/10 é emenda de 12/10. Confiro os dois na secretaria, junto com os sábados de reposição.

> [!WARNING] ⚠️ Sujeito a confirmação da secretaria
> O horário publicado em 25/07 traz um único slot teórico na terça, na VIA203; **que ele reúna as turmas 11 e 12 é leitura minha** e está em confirmação na secretaria. O conteúdo acima é o **recorte que eu proponho**, alinhado ao CCNA SRWE, enquanto a ementa oficial de 49309 não é confirmada no AVA. Qualquer ajuste sai no AVA, não no boca a boca.
>
> A **distribuição de pontos** não muda. As provas ficam dentro das janelas institucionais; as datas de **22/09 e 01/12 dependem da confirmação do agrupamento da terça** e, se mudarem, saem no AVA.
>
> Há sábados de reposição no calendário acadêmico (29/08, 12/09, 03/10, 24/10, 07/11), mas **qual dia da semana cada um repõe ainda não está confirmado.** Não assuma que o seu sábado é o seu dia.

### 2.1 A assimetria — e por que ela não te prejudica

Repare na coluna da segunda: **a P11 perde quatro aulas em feriado; a P12 não perde nenhuma.** Sem nenhuma providência, em novembro as turmas estariam a quatro laboratórios de distância.

> **A regra do cronograma:** laboratório novo só cai em semana em que **as duas práticas se encontram.**

São **quatro semanas** em que só a P12 tem aula. Nelas, ela não anda para a frente:

| Semana | Quem tem aula | A P12 recebe |
| :-: | :--- | :--- |
| **S06** | só P12 | aprofundamento sem nota — desafio de broadcast storm |
| **S07** | só P12 | aprofundamento sem nota — desafio de EtherChannel |
| **S12** | **só P12** — caem 12/10 **e** 13/10 | prática **espiral** de OSPF: revisão do que a S11 já deu |
| **S15** | só P12 | aprofundamento sem nota — exercícios de ACL |

O conteúdo novo dessas semanas fica na **teórica de terça, que todo mundo assiste**.

A **S12 é o caso extremo**: com os dois feriados juntos, nem a P11 nem a teórica acontecem. Nenhuma turma sai na frente porque, na S12, ninguém anda.

> [!WARNING] ⚠️ Gotcha de calendário
> A P11 perde 31/08 e 07/09, que são justamente as semanas de STP e EtherChannel. **Isso não significa que o assunto não cai na prova** — cai, pela teórica de terça, que é conjunta. O que muda é o *nível cognitivo* cobrado: **explicar e analisar, nunca configurar**, porque configurar isso só a P12 praticou. Quem tratar essas duas semanas como "matéria que pulei" chega à N1 devendo duas questões.

---

## 📌 3. Nota e recuperação

Cinco palavras que voltam o semestre inteiro. Todas decidem nota.

**Porcentagem de acerto** — o arquivo do Packet Tracer confere a sua rede sozinho e mostra na tela quanto você acertou. É assim que o laboratório vira nota na hora, sem esperar correção. Na tela do programa esse número aparece em inglês, com o nome `Completion`.

**Prova em duas etapas** — no mesmo dia você faz uma parte sozinho e uma parte em grupo. As duas somadas dão a nota da prova. Detalhe no bloco 3.2.

**Segunda chamada** — é para quem **faltou** à prova. Você pede pelo SAE, dentro do AVA, em até **3 dias úteis**.

**Recuperação** — é para quem **fez** as provas e terminou com **40 a 59** pontos. Não se pede: o direito vem da nota. Os requisitos estão no bloco 3.4; a data eu publico no AVA. São coisas diferentes da segunda chamada, com regras diferentes.

**Escala de uso de IA** — de 1 a 5, diz quanto de inteligência artificial é permitido em cada atividade. Aqui vai de **1** (nenhuma) a **3** (pode usar, desde que você declare).

### 3.1 Onde estão os 100 pontos

Aprovação: **≥ 60 pontos** e **frequência ≥ 75%**.

| Etapa | Total | Prova | Atividade | Uniube+ |
| :--- | :-: | :-- | :-- | :-: |
| **N1** — fecha na S09/S10 | **35** | 25 — prova de 22/09 | 5 — laboratórios no Packet Tracer (Lab 0 a 5, 1 pt cada, contam os **5 melhores**) | 5 |
| **N2** — fecha na S19/S20 | **50** | 30 — prova de 01/12 | 6 — projeto integrador (dupla)<br/>4 — defesa oral (individual) | 10 |
| **Institucional** | **15** | 15 — data definida pela instituição | — | — |

> [!TIP] ✅ Como o ponto do laboratório é apurado — leia isto uma vez e nunca mais tenha dúvida
> A régua é sempre a mesma: **dez itens verificados, oito deles = o ponto (80% de acerto).** Quando o cenário vier em arquivo `.pka`, o próprio Packet Tracer confere e mostra a sua porcentagem na tela, e você sai da aula sabendo a nota. Quando não vier, eu confiro os dez itens na sua tela, na hora. A régua é a lista de dez itens, não a ferramenta que a lê.
>
> São **seis** laboratórios valendo (Lab 0 a Lab 5) e contam **os cinco melhores** — o sexto é a sua margem para uma falta, uma internet que caiu ou um dia ruim. O teto continua sendo 5 pontos: fazer os seis não dá 6.

**Os laboratórios 6 a 10 (S11–S17) não valem nota.** Isso é decisão de projeto, não descuido: o ponto da N2 está no projeto integrador, que cobra exatamente as mesmas habilidades (OSPF, NAT, ACL). Laboratório sem nota é laboratório em que dá para errar de propósito — e é errando de propósito que se aprende diagnóstico.

> [!IMPORTANT] 🎯 O ponto barato vence o ponto caro
> Um exemplo com os números da tabela: 22 na prova + 4 labs + Uniube+ em dia = 22 + 4 + 5 = **31**. Os mesmos 22 na prova + os **seis** labs + Uniube+ zerado = 22 + 5 (teto) + 0 = **27**.
>
> Quem fez dois laboratórios a mais ficou atrás, porque o sexto lab não eleva o teto — ele é margem, não bônus. Os 5 pontos do Uniube+ valem o mesmo que cinco laboratórios. **Antes de correr atrás do ponto caro, garanta o barato.**

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

Por que assim: você acabou de sofrer com a questão e discute enquanto ela está fresca. O erro aparece em cinco minutos, não em duas semanas.

O ganho desse formato aparece semanas depois da prova, não no dia seguinte. É por isso que ele importa aqui: o que caiu na N1 volta na N2.

**Antes de escrever a prova eu defino o que ela vai cobrar** — e daí saem três versões: **A** (prova), **B** (substituta) e **C** (recuperação). Muda o cenário e os valores. O que a questão cobra é o mesmo. Você não é avaliado por sorte de tema.

### 3.3 A vista de prova — e por que ela é aula, não formalidade

Toda prova tem **vista** na semana seguinte: **29/09** para a N1, **08/12** para a N2. Não é só conferir soma de pontos. A devolutiva é **por erro**: eu levo os erros mais frequentes da turma, a gente refaz os cenários em sala e a prática daquela semana repete os mesmos casos no Packet Tracer.

Quem errou tem, ali, a chance de entender antes de a matéria voltar na N2 — e quase tudo do Bloco 1 volta.

### 3.4 Se você ficar abaixo: substituta e recuperação

São dois mecanismos diferentes, com regras diferentes. Confundi-los custa o prazo — e o prazo de um deles é de **três dias**.

| | **Segunda chamada (substitutiva)** | **Recuperação** |
| :--- | :--- | :--- |
| Para quem | Quem **faltou** à prova | Quem **fez** e ficou entre **40 e 59** pontos |
| O que aplica | Forma **B** — mesma matriz da prova perdida | Forma **C** — 55 pontos, todo o semestre |
| Como solicitar | **SAE no AVA, em até 3 dias úteis** da prova perdida, com justificativa | Não se solicita: o direito nasce da nota |
| Data | **14 a 16/12** | Entre **17 e 18/12** — divulgo no AVA junto com o resultado da N2 |
| Como a nota entra | Substitui a nota daquela prova | **Zera** as notas da N1 e da N2 — 25 + 30 = **55 pontos** — e entra no lugar delas. Os 15 da Institucional ficam onde estão |
| Teto | Nenhum | **Nota final não passa de 60** |

**Os três requisitos da recuperação — precisam valer juntos:** ter feito **todas** as provas do semestre; estar com **40 a 59** pontos; e **não** estar com Uniube+ / AVA zerados. Faltando um, não há recuperação.

> [!WARNING] ⚠️ O prazo de 3 dias úteis é institucional
> Faltou à prova? **Abra o SAE no AVA em até 3 dias úteis.** Passado o prazo, o curso indefere — o prazo não é meu, é da norma institucional.
>
> **Não me entregue atestado**, nem em papel nem por e-mail: pela norma, o atestado é anexado ao SAE e quem analisa é a coordenação. Documento entregue na mão não conta como pedido.

> [!NOTE] 📐 Como a recuperação recompõe a nota
> Um exemplo: aluno que fez a N1 e a N2 e somou **18** nelas, tem **30** na continuada e ainda está com **0** na Institucional — 48 no total, dentro da faixa 40–59. Na recuperação ele tira **33 de 55**. A conta bruta seria 30 + 33 = 63 — mas a recuperação **não soma**: ela **zera os 18 pontos da N1 e da N2**, põe os 33 no lugar, e a nota final **trava em 60**. Passa, com o mínimo.
>
> Ao contrário também vale: quem foi **bem nas provas** e mal na continuada não se beneficia — jogaria fora justamente a parte boa. A recuperação é desenhada para quem tem provas fracas e continuada de pé. **A conclusão prática:** os 15 pontos de Uniube+ e os 5 de laboratório custam menos que qualquer prova, e os laboratórios fecham já na primeira metade do semestre. Com eles garantidos, sobram 80 pontos de prova e projeto para chegar aos 60. A faixa dos 40–59 fica bem mais longe — e quem chega lá com o AVA zerado **nem direito à recuperação tem**.

### 3.5 Política de IA — declarar, não caçar

A régua é a escala de uso de IA, de 1 a 5, declarada por atividade:

| Instrumento | Nível | Na prática |
| :--- | :-- | :--- |
| Provas N1, N2 e Institucional | **1 — Sem IA** | Em sala, sem dispositivos |
| Laboratórios no Packet Tracer | **2 — IA no planejamento** | Pode pesquisar e perguntar; a configuração é sua, e é ela que eu confiro |
| Projeto integrador | **3 — Colaboração** | Uso livre **com declaração de 3 linhas**: o que pediu, o que aproveitou, o que corrigiu |
| Defesa oral | **1 — Sem IA** | 3 minutos explicando as suas decisões |

**Detector de IA não é usado nem aceito como evidência nesta disciplina.** O motivo é técnico: essas ferramentas dão falso positivo demais. Elas acusam de IA um texto escrito por aluno, e erram ainda mais com quem não escreve em inglês nativo. Declarar o uso não desconta nota. **Não declarar um uso que aparecer na defesa, desconta** — e o que se perde são os 4 pontos da defesa oral, não os 6 do projeto: são instrumentos diferentes, e a defesa mede se você entende o que entregou.

---

## 📌 4. Ferramentas e acesso

| Momento | Ferramenta | Custo | Precisa de conta? |
| :--- | :--- | :-- | :--- |
| Laboratórios | **[Cisco Packet Tracer](https://www.netacad.com/)** | Grátis | **Sim** — conta NetAcad, resolver na S01 |
| Votação em aula | **Mão levantada** (cartões de resposta quando eu levar) | — | **Não** — nada de celular |
| Bilhete de saída | **Meia folha de papel** (passa para o [Vevox](https://vevox.app/) quando eu avisar) | Grátis | **Não** — anônimo |
| Análise de tráfego | **[Wireshark](https://www.wireshark.org/download.html)** | Grátis | Não |
| Revisão em áudio | **Gemini Notebook** | Grátis | Opcional — **quando houver**, o áudio fica no bloco de podcast da própria página da aula, aqui no portal |
| Material das aulas | **Este portal** | — | Não |
| Entregas e Uniube+ | **AVA Uniube On-line** | — | Institucional — entregas e Uniube+. Quando uma semana tiver pré-trabalho, ele é curto (vídeo de até 6 min com 4 questões) e sai avisado no AVA; **não é toda semana** |

> [!WARNING] ⚠️ Gotcha de infraestrutura
> Não conte com baixar o Packet Tracer no laboratório. **Instale em casa, na primeira semana.** Chegar ao laboratório sem o simulador é passar a aula olhando a tela do colega. Nesta primeira semana ninguém perde ponto por isso — dupla resolve, e o laboratório valendo 1 ponto entra na prática seguinte. **Até lá, resolva a conta NetAcad e a instalação:** da S02 em diante não há bloco de instalação na aula.

---

## 📌 5. Organização: como cada aula vai funcionar

| Momento | O que acontece | Quanto dura |
| :--- | :--- | :--- |
| **Nosso caminho até aqui** | 3 a 4 questões de retomada — as recentes mais **uma antiga**, em espiral. Sem nota. | 6–8 min |
| **Gancho** | Uma história real de rede que caiu, terminando numa pergunta. | 2 min |
| **Exposição em blocos** | Nunca mais de 15 min seguidos falando. | — |
| **Pausa de 2 minutos** | "Comparem anotações com o colega. Eu fico calado." | 2 min |
| **Pergunta de votação** | Você vota → discute com o vizinho → vota de novo. | 8 min |
| **Bilhete de saída** | "O que ficou mais confuso hoje?" — e isso **abre** a aula seguinte. | 3 min |

**O aviso:** você vai trabalhar mais aqui do que numa aula expositiva, e vai **sentir que está aprendendo menos**.

Não é impressão, é resultado medido: quem passa por uma aula assim aprende mais e ainda sai achando que aprendeu menos. O desconforto faz parte do formato — não é sinal de que você está indo mal.

Digo isto na primeira semana, e não em novembro, quando já seria tarde: **esse desconforto é o combinado, não o defeito.** Se em outubro você sentir que trabalha demais e aprende de menos, volte a este parágrafo. E me cobre o resultado na nota, que é onde ele aparece.

---

## 📌 6. Onde estão as regras de sala

As regras de sala e a política de IA vivem na **[Aula 01 — Contrato da Disciplina](./Aula-01---Plano-de-Ensino-e-Contrato-da-Disciplina)**, e só lá. Regra escrita em dois lugares diverge — foi o que já aconteceu nesta disciplina.

A **escala de IA por instrumento** (bloco 3.5 acima) continua aqui: ela é detalhe de avaliação, não regra de convivência.

---

<div class="au-refs">
<b>De onde vem cada coisa desta página</b>

Esta é uma página administrativa. Você tem o direito de saber o que aqui é livro, o que é pesquisa, o que é norma da casa — e o que sou eu organizando o semestre.

**1. Os livros que eu adoto**, todos na biblioteca virtual da Uniube:

- KUROSE, J. F.; ROSS, K. W. **Redes de computadores e a internet: uma abordagem top-down.** 8. ed. São Paulo: Pearson, 2021. <span class="au-pag">seç. 6.4.3 — comutadores de camada de enlace; seç. 6.4.4 — VLANs; seç. 5.3 — roteamento intra-AS com OSPF; seç. 4.3 — IP e endereçamento; seç. 7.3 — LANs sem fio</span>
- TANENBAUM, A. S.; FEAMSTER, N.; WETHERALL, D. J. **Redes de Computadores.** 6. ed. São Paulo: Pearson, 2021. <span class="au-pag">cap. 4 — subcamada de acesso ao meio: comutação, spanning tree e VLANs; cap. 5 — camada de rede e roteamento</span>
- LACERDA, P. S. P. et al. **Projeto de Redes de Computadores.** Porto Alegre: Sagah, 2021. <span class="au-pag">cap. 1 e 2 — projeto e documentação de rede (base direta do projeto integrador)</span>
- ROHLING, L. J. **Segurança de redes de computadores.** Curitiba: Contentus, 2020. <span class="au-pag">cap. 3 — controle de acesso (apoio às S15–S16)</span>
- CISCO NETWORKING ACADEMY. **CCNA: Switching, Routing, and Wireless Essentials (SRWE).** Cisco Systems, 2026. Disponível em: https://www.netacad.com/. <span class="au-pag">módulos 1 a 16 — espinha dorsal do conteúdo do semestre</span>

**2. Evidência que sustenta o formato desta disciplina:**

- FREEMAN, S. et al. Active learning increases student performance in science, engineering, and mathematics. **PNAS**, v. 111, n. 23, 2014. <span class="au-pag">p. 8410–8415</span>
- DESLAURIERS, L. et al. Measuring actual learning versus feeling of learning in response to being actively engaged in the classroom. **PNAS**, v. 116, n. 39, 2019. <span class="au-pag">p. 19251–19257</span>
- RAVIZZA, S. M.; UITVLUGT, M. G.; FENN, K. M. Logged in and zoned out: how laptop internet use relates to classroom learning. **Psychological Science**, v. 28, n. 2, 2017. <span class="au-pag">p. 171–180</span>
- CORNELL CENTER FOR TEACHING INNOVATION. **Establishing Community Agreements and Classroom Norms.** Cornell University. Disponível em: https://teaching.cornell.edu/resource/establishing-community-agreements-and-classroom-norms. <span class="au-pag">seç. "Implement Classroom Norms"</span>
- COOKE, J. E.; WEIR, L.; CLARKSTON, B. Retention following two-stage collaborative exams depends on timing and student performance. **CBE — Life Sciences Education**, v. 18, n. 2, 2019. <span class="au-pag">art. ar12 — retenção do formato de duas etapas ao longo do tempo</span>
- CALLAGHAN, K.; MILBOURNE, T.; KLALES, A.; KESTIN, G.; ARGUELLES, C.; McCARTY, L.; DESLAURIERS, L. **Two-stage final exams: an assessment strategy for enhanced collaborative learning and reduced student stress.** Preprint, arXiv:2504.04281, 2025. <span class="au-pag">seç. "Results" — aprendizagem, ansiedade e preferência **autorrelatadas**</span> ⚠️ *Preprint, sem revisão por pares — citado aqui como indício, não como resultado firme.*
- VANDERBILT UNIVERSITY, CENTER FOR TEACHING. **Guidance on AI detection and why we're disabling Turnitin's AI detector.** 2023. Disponível em: https://www.vanderbilt.edu/brightspace/2023/08/16/guidance-on-ai-detection-and-why-were-disabling-turnitins-ai-detector/. <span class="au-pag">seç. "Why we disabled it"</span>

**3. Eu explicando a norma da casa** — todo o Tópico 3. As regras de aprovação, segunda chamada e recuperação são as que a coordenação definiu para Engenharias, Gestão e Tecnologia da Informação em 2026/2. Elas não são minhas e eu não posso mudá-las; trago para cá porque decidem nota e prazo, e porque norma não se lê sozinha. **O texto que vale é o publicado no AVA.**

**4. Eu organizando o semestre** — o Tópico 2 e o conteúdo semana a semana. As datas travadas (janelas de prova, feriados, lançamento de notas, encerramento) não são minhas: são do calendário da universidade, e o AVA é onde elas ficam publicadas. **Qual assunto cai em qual semana é decisão minha** — e, enquanto a ementa oficial de 49309 não sai, o próprio conteúdo é proposta minha. Mudou, eu aviso aqui e no AVA.

> **Achou divergência entre esta página e o AVA? Vale o AVA — e me avise, no início da aula ou pelo AVA, que eu corrijo aqui no mesmo dia.** Casos omissos vão para a coordenação do curso.

</div>

---

*Última atualização: 27/07/2026 · Regras de nota, segunda chamada e recuperação são as da coordenação para 2026/2 — o texto oficial está no AVA. Sala, agrupamento das turmas e sábados de reposição aguardam confirmação da secretaria — ver o aviso no Tópico 2.*

**◀ [Voltar ao índice da disciplina](./)**

</div>
