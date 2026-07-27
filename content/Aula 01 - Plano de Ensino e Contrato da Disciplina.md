---
title: "Aula 01 — Apresentação, Diagnóstico e Contrato"
disciplina: Redes de Computadores II
codigo: "49309"
aula: 1
tipo: teorica
turma: T (11+12)
semana: 1
date: 2026-07-28
tags: [redes2, 2026-2, contrato, apresentacao]
---

<div class="au-leitura" data-aula="s01">

# 🟢 Aula 01 — Apresentação, Diagnóstico e Contrato

**Disciplina:** Redes de Computadores II (49309) — Uniube
**Professor:** Romualdo Mathias Filho
**Semana:** 1 · **Terça, 28/07/2026** · VIA203 · 📘 Teórica (75 min)
**Página de referência:** [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato) — é lá que mora tudo o que esta aula apresenta.

---

<div class="au-caminho">
<b>Nosso caminho até aqui</b>

Esta é a primeira aula de Redes II, então o "até aqui" é **Redes I** — a disciplina não recomeça, ela continua. Responda **antes** de abrir cada resposta.

As mesmas três questões vão nos cartões Plickers daqui a pouco, **sem nota e sem registro**: elas me mostram onde a turma está antes de eu acelerar.

<details>
<summary>Dois hosts têm o IP 192.168.10.20/24 e 192.168.10.200/26. Eles se enxergam?</summary>

**Não, e o culpado é a máscara.** O `/26` coloca o segundo host no bloco `192.168.10.192–255`; o `/24` coloca o primeiro num bloco que vai de `.0` a `.255`. O primeiro acha que o segundo é vizinho e envia direto; o segundo acha que o primeiro é estrangeiro e manda para o gateway. A conversa fica **torta**, não simetricamente quebrada — e é isso que confunde quem testa só de um lado.

Por que importa aqui: **cada VLAN do semestre vai ser uma sub-rede.** Uma máscara errada na S03 derruba o roteamento da S05.

</details>

<details>
<summary>Um host tem gateway configurado, mas o gateway pertence a outra sub-rede. O que ele consegue fazer?</summary>

**Tudo dentro da própria sub-rede, e nada fora dela.** O host só usa o gateway para *sair*; se o endereço do gateway não cai dentro do bloco dele, ele nem tenta. Sintoma clássico: "pingo o colega do lado e não abro nada da internet".

Por que importa aqui: é o erro que derruba `router-on-a-stick` na **S05**, quando cada VLAN passar a ter o seu próprio gateway.

</details>

<details>
<summary>"A internet caiu" — mas o host pinga 8.8.8.8 normalmente. O que quebrou?</summary>

**A resolução de nomes, não a conectividade.** Se o pacote chega ao endereço, camadas 1 a 3 estão de pé; o que falhou foi traduzir nome em endereço — camada 7, DNS.

Por que importa aqui: **sintoma não é diagnóstico** — o princípio de toda prática deste semestre, a começar pela desta semana.

</details>
</div>

> [!INFO] 🎯 Visão geral e recursos
> Hoje a gente faz três coisas: **diagnóstico** de onde a turma está (Plickers), o **contrato** do semestre — datas, nota, regras — e uma **demonstração** que deixa em aberto a pergunta que o semestre inteiro responde. O documento completo — calendário das três turmas, tabelas de nota, política de IA, ferramentas, bibliografia — é a página [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato): esta aula apresenta, aquela página guarda.
>
> **O que você leva desta aula**
> - Onde os **100 pontos** são ganhos — e por que o ponto barato vence o caro.
> - As datas travadas: **N1 em 22/09**, **N2 em 01/12**, vistas nas semanas seguintes.
> - O prazo de **3 dias úteis** do SAE para a segunda chamada.
> - Os **acordos de sala**, votados — não decretados.
>
> **📂 Recursos**
> - [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato) — a referência do semestre
> - [Cisco Packet Tracer + conta NetAcad](https://www.netacad.com/) — grátis; **resolver esta semana**, o Lab 0 vale ponto
> - AVA Uniube On-line — entregas, Uniube+ e o vídeo de 6 min de cada semana

### ⏱️ Os 75 minutos de hoje

| Min | Bloco | Onde está |
| :-- | :--- | :--- |
| 0–5 | Entrada, chamada, projetor | — |
| 5–13 | **Nosso caminho até aqui** — 3 questões de Redes I no Plickers, sem nota | bloco de abertura |
| 13–26 | **A disciplina** — o mapa do semestre e demonstração ao vivo | Tópico 1 |
| 26–34 | **ConcepTest #1** no Plickers — vota, discute, revota | Tópico 1 |
| 34–44 | **O calendário** — datas travadas, feriados, as três turmas | Tópico 2 |
| 44–56 | **Nota e segundas chances** — os 100 pontos, SAE, recuperação | Tópico 2 |
| 56–58 | Pausa procedural (estreia do ritual) | Tópico 2 |
| 58–67 | **Regras de sala** — propostas e votação | Slot interativo |
| 67–70 | Reflexão + exit ticket | Fechamento |
| **70–75** | **Folga** — máquina que não liga, dúvida longa, sala trocada | — |

<aside class="au-antes">
<b class="au-nota-t">Antes de começar</b>

Cinco termos que aparecem o semestre inteiro e que decidem nota:

**Completion** — o percentual que o arquivo `.pka` do Packet Tracer calcula sozinho e mostra na tela. É assim que o laboratório vira nota, na hora, sem espera.

**Prova em duas etapas** — a prova tem uma parte individual e uma em grupo, no mesmo dia. As duas **compõem** o valor da prova.

**Segunda chamada (substitutiva)** — a segunda chance de quem **faltou** à prova. Pede-se pelo **SAE no AVA, em até 3 dias úteis**.

**Recuperação** — a segunda chance de quem **fez** as provas e fechou entre **40 e 59** pontos. Os requisitos estão no bloco 3.4 do plano; data, horário e a forma de acesso eu confirmo com a coordenação e publico no AVA.

**AIAS** — *AI Assessment Scale*, a escala **de 1 a 5** que declara **quanto** de IA é permitido em cada instrumento. Nesta disciplina vai de 1 (nenhuma) a 3 (colaboração declarada).

</aside>

---

## 📌 1. A disciplina em 13 minutos [Teoria + demonstração ⏳ 13 min + 8 de ConcepTest]

Não vou ler o programa em voz alta — ele está inteiro no [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato). O que cabe aqui é o mapa e uma demonstração.

> [!NOTE] 📋 O conteúdo semana a semana é proposta minha
> A ementa oficial de 49309 ainda não saiu no AVA. Até lá, o que está publicado é a **minha proposta**, alinhada ao CCNA *Switching, Routing and Wireless Essentials*. Quando a oficial sair, eu ajusto e aviso o que mudou. **O que já está travado é a nota e as datas de prova** — isso não depende da ementa.

### 1.1 O mapa

**Redes I ensinou a rede a funcionar. Redes II ensina a rede a não cair** — e a não deixar o problema de um setor derrubar os outros. O semestre tem dois blocos: **comutar e segmentar** (S02–S08: VLAN, trunk, inter-VLAN, STP, EtherChannel, DHCP) e **rotear e proteger** (S11–S17: OSPF, NAT/PAT, ACL, port security, WLAN) — fechando com o **projeto integrador** (S18–S19), em que você constrói uma rede corporativa completa e tem três minutos para defender cada escolha. O diagrama do arco e os sete objetivos de dezembro estão no [Tópico 1 do plano](./Plano-de-Ensino-e-Contrato).

### 1.2 A demonstração de hoje: a rede plana que virou tempestade

<figure class="au-fig">
<svg viewBox="0 0 700 190" role="img" aria-label="Rede plana da demonstracao: um unico switch central com quarenta hosts pendurados, sem nenhuma divisao; uma placa defeituosa a esquerda repete quadros de broadcast que chegam a todos os hosts, inclusive aos dois hosts de teste do lado direito">
<rect x="290" y="75" width="120" height="40" rx="6" fill="none" stroke="#2778c4" stroke-width="2.5"></rect>
<text x="350" y="93" text-anchor="middle" font-size="12" fill="#2778c4" font-family="monospace" font-weight="bold">SWITCH</text>
<text x="350" y="108" text-anchor="middle" font-size="10" fill="#8a8f98" font-family="monospace">único · sem VLAN</text>
<line x1="290" y1="95" x2="120" y2="45" stroke="#b1541b" stroke-width="2"></line>
<rect x="60" y="25" width="60" height="40" rx="6" fill="none" stroke="#b1541b" stroke-width="2.5"></rect>
<text x="90" y="43" text-anchor="middle" font-size="10" fill="#b1541b" font-family="monospace" font-weight="bold">PLACA</text>
<text x="90" y="57" text-anchor="middle" font-size="10" fill="#b1541b" font-family="monospace">defeituosa</text>
<text x="188" y="52" text-anchor="middle" font-size="14" fill="#b1541b" font-family="monospace">⚡ broadcast</text>
<line x1="290" y1="95" x2="120" y2="145" stroke="#8a8f98" stroke-width="1.5"></line>
<line x1="290" y1="105" x2="200" y2="170" stroke="#8a8f98" stroke-width="1.5"></line>
<text x="110" y="150" text-anchor="end" font-size="10" fill="#8a8f98" font-family="monospace">… 37 outros hosts</text>
<line x1="410" y1="85" x2="580" y2="45" stroke="#8a8f98" stroke-width="1.5"></line>
<line x1="410" y1="105" x2="580" y2="145" stroke="#8a8f98" stroke-width="1.5"></line>
<rect x="580" y="25" width="70" height="40" rx="6" fill="none" stroke="#00aa9f" stroke-width="2"></rect>
<text x="615" y="49" text-anchor="middle" font-size="10" fill="#00aa9f" font-family="monospace" font-weight="bold">HOST A</text>
<rect x="580" y="125" width="70" height="40" rx="6" fill="none" stroke="#00aa9f" stroke-width="2"></rect>
<text x="615" y="149" text-anchor="middle" font-size="10" fill="#00aa9f" font-family="monospace" font-weight="bold">HOST B</text>
<text x="615" y="105" text-anchor="middle" font-size="11" fill="#00aa9f" font-family="monospace">ping?</text>
</svg>
<figcaption class="au-legenda">O cenário da demonstração: quarenta hosts num único domínio de broadcast. A placa defeituosa (laranja) fica de um lado da sala; os hosts A e B (verde), do outro, sem nenhuma relação com ela. O ConcepTest pergunta exatamente sobre o ping entre A e B — e a resposta é o motivo de a S03 existir.</figcaption>
</figure>

Um problema real montado ao vivo no Packet Tracer: **quarenta hosts pendurados num único switch, sem nenhuma divisão.** Cada broadcast que qualquer máquina emite chega a todas as outras. Basta um laço acidental de cabo, ou uma placa defeituosa repetindo quadros, para o tráfego se multiplicar até que ninguém mais consiga transmitir. A rede não é invadida nem desligada — ela **se afoga sozinha**.

> [!NOTE] 🃏 ConcepTest Plickers #1
> **Durante a demonstração, antes de eu apertar o botão:** o que acontece com o *ping* entre dois hosts que estão do outro lado da sala, sem nenhuma relação com a máquina defeituosa?
>
> Vote, discuta com o vizinho, vote de novo. A resposta é a razão de existir a semana S03.

A pergunta que essa demonstração deixa em aberto — *"como impedir que o problema de um setor afogue os outros?"* — é literalmente a primeira frase da aula de VLANs, daqui a duas semanas.

---

## 📌 2. O contrato: datas, nota e segundas chances [Teoria ⏳ 22 min + 2 de pausa]

O texto completo — calendário das três turmas semana a semana, tabelas, requisitos, política de IA — está nos [Tópicos 2 e 3 do plano](./Plano-de-Ensino-e-Contrato). Mas antes de qualquer tabela, uma aposta — **ela vai ao Plickers como pergunta de A/B, antes de eu mostrar qualquer número**:

<details class="au-aposta">
<summary>Aposte antes de ver: quem fecha melhor a N1 — quem tira 22 na prova, faz 4 dos 6 labs e cumpre o Uniube+, ou quem tira os mesmos 22, faz os 6 labs e zera o Uniube+?</summary>

**O primeiro, por 4 pontos — e a distância vem do lugar mais barato do semestre.**

- 4 labs + Uniube+: 22 (prova) + **4** (labs) + 5 (Uniube+) = **31**
- 6 labs, sem Uniube+: 22 (prova) + **5** (fez seis, mas o teto é cinco) + 0 = **27**

Quem fez **dois laboratórios a mais** ficou atrás, porque o sexto laboratório não eleva o teto — ele é margem, não bônus. Os 5 pontos do Uniube+ valem o mesmo que cinco laboratórios.

**A lição de gestão:** antes de correr atrás do ponto caro, garanta o barato. Vale para nota e vale para prioridade de trabalho.

</details>

A aposta vai a voto antes de eu abrir os números — e a resposta é exatamente o que a lista abaixo explica:

1. **Aprovação = ≥ 60 pontos E ≥ 75% de frequência.** As duas juntas.
2. **Os 100 pontos:** N1 = 35 (25 prova + 5 labs + 5 Uniube+) · N2 = 50 (30 prova + 6 projeto + 4 defesa + 10 Uniube+) · Institucional = 15.
3. **Datas travadas:** prova N1 **22/09** · prova N2 **01/12** · vistas **29/09** e **08/12**. Prova em **duas etapas** — 50 min individual + 18 min em grupo nas 4 questões mais difíceis.
4. **Labs que valem nota:** Lab 0 a 5 (S01–S08), 1 pt cada, **Completion ≥ 80%**, contam os **5 melhores**. Labs 6–10 são formativos, sem nota.
5. **Faltou à prova?** SAE no AVA em **até 3 dias úteis**, atestado anexado no SAE — **não na minha mão**. Segunda chamada de 14 a 16/12.
6. **Ficou entre 40 e 59?** Recuperação em **17 ou 18/12** (confirmo no AVA) — se todas as provas foram feitas e o Uniube+ não está zerado. Ela **zera as notas da N1 e da N2 (55 pontos) e vale por elas**, e a nota final **trava em 60**.
7. **Feriados da disciplina:** 31/08 · 07/09 · 12/10 · 13/10 · 02/11 — a P11 perde quatro aulas, a P12 nenhuma, e **a teórica de terça perde 13/10**, a perda que atinge todo mundo. A regra da assimetria (lab novo só quando as duas práticas se encontram) está no plano.

> [!WARNING] ⚠️ O prazo de 3 dias úteis é institucional
> Não é regra minha, é institucional — e o curso indefere fora do prazo. Se você guardar uma única coisa desta aula, que seja esta: **atestado vai no SAE, em 3 dias úteis.**

> [!WARNING] ⚠️ Gotcha de infraestrutura
> Não conte com baixar o Packet Tracer no laboratório. **Instale em casa, hoje.**
> **P12 (quinta):** você tem até 30/07 — chegar sem o simulador é passar o laboratório olhando a tela do colega, e o Lab 0 vale ponto. **P11 (segunda):** o seu Lab 0 foi ontem; se você não conseguiu instalar a tempo, me procure hoje que a gente resolve antes que vire nota perdida.

---

## 🗳️ Slot interativo — as regras de sala [Discussão e votação ⏳ 9 min]

Regra que o professor decreta, o aluno obedece. Regra que a turma escreve, a turma cobra. Normas coconstruídas geram menos violação do que normas impostas, e o Center for Teaching Innovation de Cornell trata isso como prática padrão de primeira aula.

**Hoje a turma propõe e vota 4 a 5 acordos.** Entro com quatro na mesa; vocês cortam, mudam e acrescentam:

1. **Celular é agendado, não proibido.** Há janelas em que o celular *é* a ferramenta (Vevox, consultar documentação) e janelas de tela para baixo (recuperação, prova, defesa). O uso não acadêmico do dispositivo em aula está associado a pior desempenho (Ravizza et al., 2017); não proibir é decisão minha.
2. **Pergunta errada é matéria-prima.** O distrator de um ConcepTest sai de erro real cometido nesta sala. Errar em voz alta acelera a turma inteira.
3. **Dupla é rotativa.** Ninguém passa o semestre com o mesmo par — e ninguém carrega o outro no laboratório.
4. **Quem chega atrasado entra em silêncio.** A abertura é curta e é a parte que mais rende; ela não para.

---

<div class="au-slot">
<div class="au-slot-h"><b>Interativo</b> · Vevox · 9 min</div>
<div class="au-slot-c">

**Votação dos acordos de sala.** Abra **vevox.app** e entre com o ID de sessão que está no projetor.

1. As quatro propostas acima aparecem uma a uma: **manter, mudar ou cortar.**
2. Campo aberto para **acrescentar** um acordo que ninguém propôs.
3. Os acordos que passarem de 60% entram na versão final — e o **[Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato) é atualizado até sexta** com o texto votado. O contrato não fica no quadro; fica publicado.

Anônimo, sem cadastro. A votação é da turma, não minha: eu não desempato.

</div>
<p class="au-slot-b"><b>Plano B:</b> se a rede cair, a votação vai nos cartões <b>Plickers</b> — cada proposta é uma pergunta de A/B/C, e o acordo extra vai em meia folha de papel recolhida na saída. Mesmo conteúdo, mesmos 9 minutos, zero dependência de internet.</p>
</div>

---

<div class="au-resumo">
<b>Resumo da aula</b>

| Item | O que você precisa lembrar |
| :--- | :--- |
| **Referência do semestre** | [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato) — guarde o link |
| **Conteúdo** | Bloco 1 (S02–S08): comutar e segmentar · Bloco 2 (S11–S17): rotear e proteger · Projeto (S18–S19) |
| **Aprovação** | ≥ 60 pontos **e** ≥ 75% de frequência |
| **Distribuição** | N1 = 35 · N2 = 50 · Institucional = 15 |
| **Datas travadas** | Prova N1 **22/09** · Prova N2 **01/12** · Vistas **29/09** e **08/12** |
| **Formato da prova** | Duas etapas — 50 min individual + 18 min em grupo nas 4 questões mais difíceis |
| **Segunda chamada** | Faltou → **SAE no AVA em 3 dias úteis**. Aplicação de **14 a 16/12**. Atestado vai no SAE, não comigo |
| **Recuperação** | Nota **40–59** + todas as provas feitas + Uniube+ não zerado. **17 ou 18/12** (confirmo no AVA), **zera as notas da N1 e da N2 (55 pontos) e vale por elas**, **teto 60** |
| **Labs que valem nota** | Lab 0 a 5, 1 pt cada, **Completion ≥ 80%**, contam os **5 melhores** |
| **Política de IA** | Declarar por instrumento (AIAS 1 a 3). Sem detector de IA — detalhe no plano |
| **Regras de sala** | Votadas hoje — o texto aprovado vai para o plano publicado até sexta |
| **Pendência da semana** | Conta NetAcad + Packet Tracer instalados em casa |

</div>

<div class="au-podcast">
<p><b>🎧 Revisão em áudio (~10 min)</b> — gerada por IA a partir desta página, para ouvir no trajeto. O áudio complementa; a página é a fonte.</p>
<p><i>Disponível em breve.</i></p>
</div>

---

## 🎬 Fechamento — exit ticket (3 min)

Toda aula termina do mesmo jeito: duas perguntas anônimas, sem nota, no **Vevox**. O que você responder aqui **abre a aula da semana que vem** — os pontos mais citados como confusos entram no retrieval de abertura.

**Hoje:** *(1)* O que mais te preocupa nesta disciplina? *(2)* Qual foi o ponto mais confuso da aula de hoje?

QR projetado no slide final, ou [vevox.app](https://vevox.app/) com o ID de sessão da tela. Sem sinal? Meia folha de papel na saída resolve.

<div class="au-reflexao">
<b>Para pensar até a próxima aula</b>

<p>Hoje você votou nos acordos que vão reger esta sala por 20 semanas. Um deles vai ser quebrado antes de setembro — provavelmente por alguém que votou a favor dele.</p>

<p>A pergunta não é <i>qual</i>. É esta: <b>quem deveria cobrar o acordo quando isso acontecer — eu, ou a turma?</b> E se a sua resposta for "a turma", o que precisa ser verdade sobre a regra para que isso seja possível?</p>
</div>

<div class="au-refs">
<b>De onde vem o que eu disse hoje</b>

Esta aula é de contrato e diagnóstico. Vale você separar o que é livro, o que é pesquisa e o que sou eu explicando a norma da casa.

**Livro e pesquisa, que você pode abrir hoje mesmo:**

- KUROSE, J. F.; ROSS, K. W. **Redes de computadores e a internet: uma abordagem top-down.** 8. ed. São Paulo: Pearson, 2021. <span class="au-pag">seç. 4.3 — IP e endereçamento; seç. 6.4.3 — comutadores de camada de enlace, p. 491–497</span> — base das questões de diagnóstico e da demonstração.
- CORNELL CENTER FOR TEACHING INNOVATION. **Establishing Community Agreements and Classroom Norms.** Cornell University. Disponível em: https://teaching.cornell.edu/resource/establishing-community-agreements-and-classroom-norms. <span class="au-pag">seç. "Facilitating the process"</span> — base do slot de votação.
- RAVIZZA, S. M.; UITVLUGT, M. G.; FENN, K. M. Logged in and zoned out: how laptop internet use relates to classroom learning. **Psychological Science**, v. 28, n. 2, 2017. <span class="au-pag">p. 171–180</span> — base da proposta 1 (celular agendado).

**Eu explicando, e onde você confere:**

As regras de **aprovação, segunda chamada e recuperação** do Tópico 2 são as que a coordenação definiu para Engenharias, Gestão e Tecnologia da Informação neste semestre. Não são minhas e eu não posso mudá-las; trago para cá porque decidem nota e prazo, e porque ninguém lê norma por conta própria em julho. **O texto que vale é o publicado no AVA.**

**Divergiu do AVA? Vale o AVA — e me avise, no início da aula ou pelo AVA, que eu corrijo esta página no mesmo dia.** A bibliografia completa da disciplina está no [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato).

</div>

<div class="au-proxima">
<b>Na próxima aula</b>

<p>Hoje você viu quarenta máquinas se afogarem no próprio broadcast e eu não expliquei por quê. Na próxima, a gente abre o switch e descobre <b>como ele decide para onde mandar cada quadro</b> — e por que essa decisão, sozinha, cria o problema que o semestre inteiro vai passar consertando.</p>
</div>

---

*Última atualização: 27/07/2026 · As regras de nota, segunda chamada e recuperação são as da coordenação para 2026/2 — o texto oficial está no AVA. A ementa e o conteúdo semana a semana são proposta minha até a oficial de 49309 sair. Sala, agrupamento das turmas e sábados de reposição aguardam confirmação da secretaria — ver o [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato).*

**◀ [Voltar ao índice da disciplina](./)**

</div>
