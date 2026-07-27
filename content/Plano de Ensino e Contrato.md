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

**Disciplina:** Redes de Computadores II (49309) · Ciência da Computação — Uniube
**Professor:** Romualdo Mathias Filho
**Semestre:** 2026-2 · Teórica: terça, VIA203 · Práticas: P11 segunda (VIA215) · P12 quinta (VIA216)

> [!INFO] 🎯 O que esta página é
> Esta é a **página de referência do semestre**, não uma aula. Conteúdo das 20 semanas, calendário das três turmas, composição da nota, prova em duas etapas, segunda chamada, recuperação, política de IA, ferramentas, regras de sala e bibliografia — tudo mora aqui.
>
> Ela é apresentada na [Aula 01](./Aula-01---Plano-de-Ensino-e-Contrato-da-Disciplina) e depois fica de consulta. **Guarde o link:** é para cá que você volta em outubro, quando a dúvida for de prazo e não de matéria. Sempre que algo pendente for confirmado, é esta página que muda.

---

## 📌 1. A disciplina: o que Redes II cobre

### 1.1 O que você vai saber fazer em dezembro

**Redes I ensinou a rede a funcionar. Redes II ensina a rede a não cair** — e a não deixar o problema de um setor derrubar os outros.

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
| **20** | 08/12 | 07/12 | 10/12 | **Vista da N2** + fechamento | — |

**Depois da S20:** segunda chamada de **14 a 16/12** · lançamento das notas da N2 até **18/12** · encerramento do semestre em **19/12** — essas três são datas institucionais. A **recuperação**, pela norma, tem data definida pelo professor, e **eu marquei para 17 ou 18/12** (só pode ser depois da segunda chamada); confirmo no AVA junto com o resultado da N2. As notas da N1 são lançadas até **12/10**.

🚫 = feriado. 07/09, 12/10 e 02/11 são feriados nacionais; **31/08 e 13/10 seguem o calendário acadêmico da Uniube** (13/10 é emenda de 12/10) — confiro na secretaria junto com os sábados de reposição. **Feriados que atingem a disciplina:** 31/08 · 07/09 · 12/10 · 13/10 · 02/11.
**Em negrito, os laboratórios que valem ponto** (Lab 0 a 5). Os marcados *(formativo)* são obrigatórios e registrados, mas **não valem nota** — o porquê está no bloco 3.1.

> [!WARNING] ⚠️ Sujeito a confirmação da secretaria
> A terça reúne as turmas 11 e 12 na VIA203 conforme o horário publicado em 25/07, e o conteúdo acima segue a ementa da disciplina. **Sala, agrupamento e ementa só se tornam definitivos após a confirmação institucional** — qualquer ajuste sai no AVA, não no boca a boca. As datas das provas (22/09 e 01/12) e a distribuição de pontos não mudam.
>
> Há sábados de reposição no calendário acadêmico (29/08, 12/09, 03/10, 24/10, 07/11), mas **qual dia da semana cada um repõe ainda não está confirmado.** Não assuma que o seu sábado é o seu dia.

### 2.1 A assimetria — e por que ela não te prejudica

Repare na coluna da segunda: **a P11 perde quatro aulas em feriado; a P12 não perde nenhuma.** Se cada prática seguisse o próprio ritmo, em novembro as turmas estariam a quatro laboratórios de distância.

A regra do cronograma resolve isso: **laboratório novo só cai em semana em que as duas práticas se encontram.** Nas semanas em que só a P12 tem aula (S06, S07, **S12**, S15), ela recebe aprofundamento **sem nota** — desafio, diagnóstico extra — e o conteúdo novo fica na teórica de terça, que todo mundo assiste.

A **S12 é o caso extremo**: ali caem **os dois feriados juntos**, 12/10 e 13/10, então nem a P11 nem a teórica acontecem. Só a P12 tem aula naquela semana, e por isso ela não recebe conteúdo novo nenhum — recebe prática **espiral** de OSPF, revisão do que a S11 já deu a todo mundo. Nenhuma turma sai na frente porque, na S12, ninguém anda.

> [!WARNING] ⚠️ Gotcha de calendário
> A P11 perde 31/08 e 07/09, que são justamente as semanas de STP e EtherChannel. **Isso não significa que o assunto não cai na prova** — cai, pela teórica de terça, que é conjunta. O que muda é o *nível cognitivo* cobrado: **explicar e analisar, nunca configurar**, porque configurar isso só a P12 praticou. Quem tratar essas duas semanas como "matéria que pulei" chega à N1 devendo duas questões.

---

## 📌 3. Nota e recuperação

Cinco termos que aparecem o semestre inteiro e que decidem nota:

**Completion** — o percentual que o arquivo `.pka` do Packet Tracer calcula sozinho e mostra na tela. É assim que o laboratório vira nota, na hora, sem espera.

**Prova em duas etapas** — a prova tem uma parte individual e uma em grupo, no mesmo dia. As duas **compõem** o valor da prova (bloco 3.2).

**Segunda chamada (substitutiva)** — a segunda chance de quem **faltou** à prova. Pede-se pelo **SAE no AVA, em até 3 dias úteis**.

**Recuperação** — a segunda chance de quem **fez** as provas e fechou entre **40 e 59** pontos. Não se pede: o direito nasce da nota. As duas são coisas diferentes, com regras diferentes (bloco 3.4).

**AIAS** — *AI Assessment Scale*, a escala de 1 a 5 que declara **quanto** de IA é permitido em cada instrumento. Nesta disciplina vai de 1 (nenhuma) a 3 (colaboração declarada).

### 3.1 Onde estão os 100 pontos

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

> [!IMPORTANT] 🎯 O ponto barato vence o ponto caro
> Marina tirou 22 na prova, fez 4 dos 6 labs e cumpriu o Uniube+: 22 + 4 + 5 = **31**. Beatriz tirou 22, fez os **seis** labs e zerou o Uniube+: 22 + 5 (teto) + 0 = **27**.
>
> Beatriz fez dois laboratórios a mais e ficou atrás, porque o sexto lab não eleva o teto — ele é margem, não bônus. Os 5 pontos do Uniube+ custam menos esforço do que um único laboratório e valem o mesmo que cinco deles. **Antes de correr atrás do ponto caro, garanta o barato.**

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

Por que assim: a discussão acontece no pico de ativação da memória — você acabou de sofrer com a questão, e o erro é descoberto em cinco minutos, não em duas semanas.

**O que a evidência realmente diz** (e vale saber onde ela para): num estudo com pré e pós-teste, o ganho de retenção do formato apareceu em **23 dias**, não em 9 — e no prazo curto só os alunos de desempenho intermediário se beneficiaram (Cooke; Weir; Clarkston, 2019). Ou seja: o efeito é de **médio prazo**, que é exatamente o que interessa para uma N2 que cobra espiral da N1. Já a redução de ansiedade e a preferência pelo formato são **percepção relatada pelos próprios alunos**, e num preprint (Callaghan et al., 2025) — trato isso como expectativa razoável, não como resultado firme.

**Toda prova nasce de uma matriz de especificação**, e cada uma gera três formas paralelas: **A** (prova), **B** (substituta) e **C** (recuperação). Muda o cenário e os valores; a matriz é a mesma. Você não é avaliado por sorte de tema.

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
| Como a nota entra | Substitui a nota daquela prova | **Zera** as notas das duas provas e entra no lugar delas |
| Teto | Nenhum | **Nota final não passa de 60** |

**Os três requisitos da recuperação — precisam valer juntos:** ter feito **todas** as provas do semestre; estar com **40 a 59** pontos; e **não** estar com Uniube+ / AVA zerados. Faltando um, não há recuperação.

> [!WARNING] ⚠️ O prazo de 3 dias úteis é o que mais reprova gente
> Faltou à prova? **Abra o SAE no AVA em até 3 dias úteis.** Passou disso, o curso indefere — e não há a quem recorrer, porque o prazo não é meu, é institucional.
>
> **Não me entregue atestado**, nem em papel nem por e-mail: eu não posso recebê-lo. O atestado é anexado ao SAE e quem analisa é a coordenação. Me entregar o documento na mão é a maneira mais comum de perder o prazo achando que resolveu.

> [!NOTE] 📐 Como a recuperação recompõe a nota
> Rafael fez as duas provas, somou 18 nelas, tem 30 na continuada e tira 33 de 55 na recuperação. A conta bruta seria 30 + 33 = 63 — mas a recuperação **não soma**: ela **zera os 18 pontos das provas**, põe os 33 no lugar, e a nota final **trava em 60**. Ele passa, com o mínimo.
>
> Ao contrário também vale: quem foi **bem nas provas** e mal na continuada não se beneficia — jogaria fora justamente a parte boa. A recuperação é desenhada para quem tem provas fracas e continuada de pé. **A conclusão prática:** os 15 pontos de Uniube+ e os 5 de laboratório fecham antes de setembro e custam menos que qualquer prova; quem os pega quase nunca cai na faixa dos 40–59 — e quem chega lá com o AVA zerado **nem direito à recuperação tem**.

### 3.5 Política de IA — declarar, não caçar

A régua é a escala AIAS, declarada por instrumento:

| Instrumento | Nível | Na prática |
| :--- | :-- | :--- |
| Provas N1, N2 e Institucional | **1 — Sem IA** | Em sala, sem dispositivos |
| Laboratórios `.pka` | **2 — IA no planejamento** | Pode pesquisar e perguntar; a configuração é sua e o `.pka` valida |
| Projeto integrador | **3 — Colaboração** | Uso livre **com declaração de 3 linhas**: o que pediu, o que aproveitou, o que corrigiu |
| Defesa oral | **1 — Sem IA** | 3 minutos explicando as suas decisões |

**Detector de IA não é usado nem aceito como evidência nesta disciplina.** O motivo é técnico: essas ferramentas produzem falso positivo em taxa alta contra quem não escreve em inglês nativo — a Universidade Vanderbilt desativou o detector do Turnitin exatamente por isso (Vanderbilt University, Center for Teaching, 2023). Declarar o uso não desconta nota. **Não declarar um uso que aparecer na defesa, desconta** — e o que se perde são os 4 pontos da defesa oral, não os 6 do projeto: são instrumentos diferentes, e a defesa mede se você entende o que entregou.

---

## 📌 4. Ferramentas e acesso

| Momento | Ferramenta | Custo | Precisa de conta? |
| :--- | :--- | :-- | :--- |
| Laboratórios | **[Cisco Packet Tracer](https://www.netacad.com/)** | Grátis | **Sim** — conta NetAcad, resolver na S01 |
| Votação em aula | **Plickers** | Grátis | **Não** — é cartão de papel, sem celular |
| Exit ticket | **[Vevox](https://vevox.app/)** | Grátis | **Não** — anônimo, por QR |
| Análise de tráfego | **[Wireshark](https://www.wireshark.org/download.html)** | Grátis | Não |
| Revisão pré-prova | **Gemini Notebook** | Grátis | Opcional — o áudio sai publicado no AVA |
| Material das aulas | **Este portal** | — | Não |
| Entregas e Uniube+ | **AVA Uniube On-line** | — | Institucional — entregas, Uniube+ e o vídeo de 6 min de cada semana |

> [!WARNING] ⚠️ Gotcha de infraestrutura
> A rede da faculdade não aguenta a turma inteira baixando o Packet Tracer ao mesmo tempo. **Instale em casa, na primeira semana.** Chegar ao laboratório sem o simulador é passar a aula olhando a tela do colega — e o Lab 0 vale ponto.

---

## 📌 5. Organização: como cada aula vai funcionar

| Momento | O que acontece | Quanto dura |
| :--- | :--- | :--- |
| **Nosso caminho até aqui** | 3 a 4 questões de recuperação — as recentes mais **uma antiga**, em espiral. Sem nota. | 6–8 min |
| **Gancho** | Uma história real de rede que caiu, terminando numa pergunta. | 2 min |
| **Exposição em blocos** | Nunca mais de 15 min seguidos falando. | — |
| **Pausa procedural** | "Comparem anotações com o colega. Eu fico calado." | 2 min |
| **ConcepTest** | Você vota → discute com o vizinho → vota de novo. | 8 min |
| **Exit ticket** | "O que ficou mais confuso hoje?" — e isso **abre** a aula seguinte. | 3 min |

O aviso: você vai trabalhar mais aqui do que numa aula expositiva, e vai **sentir que está aprendendo menos**. Não é impressão — é resultado medido. Alunos numa aula ativa aprendem mais e avaliam a própria aprendizagem como pior que a de uma aula expositiva excelente (Deslauriers et al., 2019); no agregado, aula ativa derruba a reprovação de 33,8% para 21,8% (Freeman et al., 2014). Digo isso na primeira semana de propósito, e vou lembrar em novembro: sem esse combinado, o método vira reclamação em vez de virar nota.

---

## 📌 6. As regras da nossa sala

Regra que o professor decreta, o aluno obedece. Regra que a turma escreve, a turma cobra. Normas coconstruídas geram menos violação do que normas impostas, e o Center for Teaching Innovation de Cornell trata isso como prática padrão de primeira aula. Estas quatro entraram como **proposta** na Aula 01 e foram a voto — manter, mudar ou cortar —, com espaço para a turma acrescentar as suas:

1. **Celular é agendado, não proibido.** Há janelas em que o celular *é* a ferramenta (Vevox, consultar documentação) e janelas de tela para baixo (recuperação, prova, defesa). Proibição total não se sustenta na evidência; distração, sim (Ravizza et al., 2017).
2. **Pergunta errada é matéria-prima.** O distrator de um ConcepTest sai de erro real cometido nesta sala. Errar em voz alta acelera a turma inteira.
3. **Dupla é rotativa.** Ninguém passa o semestre com o mesmo par — e ninguém carrega o outro no laboratório.
4. **Quem chega atrasado entra em silêncio.** A abertura é curta e é a parte que mais rende; ela não para.

> [!NOTE] 🗳️ Status da votação
> **Aguardando a votação da Aula 01 (28/07).** Os acordos que passarem de 60% entram na versão final, e esta seção é substituída pelo texto votado — com os cortes, as mudanças e os acordos acrescentados. O contrato não fica no quadro; fica publicado aqui.

---

<div class="au-refs">
<b>Fontes desta página</b>

**Bibliografia da disciplina** — biblioteca virtual da Uniube:

- KUROSE, J. F.; ROSS, K. W. **Redes de computadores e a internet: uma abordagem top-down.** 8. ed. São Paulo: Pearson, 2021. <span class="au-pag">seç. 6.4.3 — comutadores de camada de enlace, p. 491–497; seç. 6.4.4 — VLANs, p. 497 em diante; seç. 5.3 — roteamento intra-AS com OSPF; seç. 4.3 — IP e endereçamento; seç. 7.3 — LANs sem fio</span>
- TANENBAUM, A. S.; FEAMSTER, N.; WETHERALL, D. J. **Redes de Computadores.** 6. ed. São Paulo: Pearson, 2021. <span class="au-pag">cap. 4 — subcamada de acesso ao meio: comutação, spanning tree e VLANs; cap. 5 — camada de rede e roteamento `[páginas a confirmar na edição da biblioteca virtual]`</span>
- LACERDA, P. S. P. et al. **Projeto de Redes de Computadores.** Porto Alegre: Sagah, 2021. <span class="au-pag">cap. 1 e 2 — projeto e documentação de rede (base direta do projeto integrador)</span>
- ROHLING, L. J. **Segurança de redes de computadores.** Curitiba: Contentus, 2020. <span class="au-pag">cap. 3 — controle de acesso (apoio às S15–S16)</span>
- CISCO NETWORKING ACADEMY. **CCNA: Switching, Routing, and Wireless Essentials (SRWE).** Cisco Systems, 2026. Disponível em: https://www.netacad.com/. <span class="au-pag">módulos 1 a 16 — espinha dorsal do conteúdo do semestre</span>

**Evidência que sustenta o formato desta disciplina:**

- FREEMAN, S. et al. Active learning increases student performance in science, engineering, and mathematics. **PNAS**, v. 111, n. 23, 2014. <span class="au-pag">p. 8410–8415</span>
- DESLAURIERS, L. et al. Measuring actual learning versus feeling of learning in response to being actively engaged in the classroom. **PNAS**, v. 116, n. 39, 2019. <span class="au-pag">p. 19251–19257</span>
- RAVIZZA, S. M.; UITVLUGT, M. G.; FENN, K. M. Logged in and zoned out: how laptop internet use relates to classroom learning. **Psychological Science**, v. 28, n. 2, 2017. <span class="au-pag">p. 171–180</span>
- CORNELL CENTER FOR TEACHING INNOVATION. **Establishing Community Agreements and Classroom Norms.** Cornell University. Disponível em: https://teaching.cornell.edu/resource/establishing-community-agreements-and-classroom-norms. <span class="au-pag">seç. "Facilitating the process"</span>
- COOKE, J. E.; WEIR, L.; CLARKSTON, B. Retention following two-stage collaborative exams depends on timing and student performance. **CBE — Life Sciences Education**, v. 18, n. 2, 2019. <span class="au-pag">art. ar12, seç. "Results" — ganho de retenção aos 23 dias; aos 9 dias, só nos alunos de desempenho intermediário</span>
- CALLAGHAN, K.; MILBOURNE, T.; KLALES, A.; KESTIN, G.; ARGUELLES, C.; McCARTY, L.; DESLAURIERS, L. **Two-stage final exams: an assessment strategy for enhanced collaborative learning and reduced student stress.** Preprint, arXiv:2504.04281, 2025. <span class="au-pag">seç. "Results" — aprendizagem, ansiedade e preferência **autorrelatadas**</span> ⚠️ *Preprint, sem revisão por pares — citado aqui como indício, não como resultado firme.*
- VANDERBILT UNIVERSITY, CENTER FOR TEACHING. **Guidance on AI detection and why we're disabling Turnitin's AI detector.** 2023. Disponível em: https://www.vanderbilt.edu/brightspace/2023/08/16/guidance-on-ai-detection-and-why-were-disabling-turnitins-ai-detector/. <span class="au-pag">seç. "Why we disabled it"</span>

**Documento institucional — fonte das regras do Tópico 3:**

- UNIVERSIDADE DE UBERABA. **Avaliações de Segunda Chamada e Recuperação de Aprendizagem — Cursos: Engenharias, Gestão e Tecnologia da Informação, 2026/2.** Campus Uberlândia, 2026. <span class="au-pag">itens 1 a 11 — aprovação, distribuição dos 100 pontos, prazos, segunda chamada (item 9) e recuperação (item 11)</span>

Em qualquer divergência entre esta página e esse documento, **vale o documento**. Casos omissos vão para a coordenação do curso.

</div>

---

*Última atualização: 27/07/2026 · Regras de nota, segunda chamada e recuperação seguem o documento institucional 2026/2. Sala, agrupamento das turmas e sábados de reposição aguardam confirmação da secretaria — ver o aviso no Tópico 2.*

**◀ [Voltar ao índice da disciplina](./)**

</div>
