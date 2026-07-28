---
title: "Aula 01 — Contrato da Disciplina"
disciplina: Redes de Computadores II
codigo: "49309"
aula: 1
tipo: teorica
semana: 1
date: 2026-07-28
anatomia: nao  # contrato conduzido, nao aula com dinamica — mesma decisao da Aula 01 de Redes I
tags: [redes2, 2026-2, contrato, apresentacao]
---

<div class="au-leitura" data-aula="s01">

# 🟢 Aula 01 — Contrato da Disciplina

**Disciplina:** 49309 — Redes de Computadores II — Uniube<br>
**Professor:** Romualdo Mathias Filho · **romualdo.filho@uniube.br**<br>
**Teórica:** terça-feira · **VIA203** — reúne as duas práticas<br>
**Prática P11:** segunda-feira · **VIA215** · **Prática P12:** quinta-feira · **VIA216**<br>
**Ferramenta do semestre:** Cisco Packet Tracer, desde a primeira semana

> [!NOTE] 📄 Esta página é o contrato inteiro
> Tudo o que decide a sua nota, o seu prazo e a sua frequência está **aqui**. Ela está organizada na ordem em que a aula acontece — dá para acompanhar em tempo real, e dá para reabrir em novembro procurando uma data.
>
> O detalhamento completo — ementa, rubricas, bibliografia, escala de IA por instrumento — continua no [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato). **Divergiu entre as duas? Vale o AVA, e me avise que eu corrijo.**

---

## 🕐 Minuto 0 · Como esta sala funciona

Começo por aqui porque é o que vale a partir de agora.

### As regras

1. **Celular e fone de ouvido são proibidos em sala.** Quem quiser usar, sai da sala.
2. **A chamada tem hora limite: 15 minutos depois do início.**
3. **Quem chega atrasado entra em silêncio.**
4. **Não abordar o professor nos corredores** com problemas de disciplina, avaliações e afins.
5. **O professor não responde WhatsApp.** A comunicação é pelo **AVA** ou por **romualdo.filho@uniube.br**.

### Sobre inteligência artificial

Eu incentivo o uso — inclusive em algumas aulas vamos entregar prompts prontos para vocês.

> **A IA ajuda. A IA não cria.**

Ela pode ajudar. O que ela **não** pode é criar por você. Nesta disciplina isso não é discurso: existe uma **escala de 1 a 3** que diz, por instrumento, quanto de IA é permitido — e existe uma **defesa oral de 3 minutos** no projeto, valendo 4 pontos, em que você explica as suas decisões sem consulta.

**Detector de IA não é usado nem aceito como evidência aqui.** Declarar o uso não desconta nota.

---

## 🕐 Minuto 15 · O que é Redes de Computadores II

### Em uma frase

**Redes I ensinou a rede a funcionar. Redes II ensina a rede a não cair** — e a não deixar o problema de um setor derrubar os outros.

Ao fim do semestre você deve conseguir:

1. **Segmentar** uma rede em VLANs, e justificar a divisão.
2. **Interligar** as VLANs com roteamento.
3. **Proteger** a camada 2 contra loop e contra porta indevida.
4. **Rotear** dinamicamente com OSPF.
5. **Conectar** a rede à internet com NAT/PAT.
6. **Aplicar** política de acesso com ACL.

E, atravessando todas elas: **diagnosticar de baixo para cima**, camada por camada.

> [!WARNING] ⚠️ O conteúdo abaixo é proposta minha, não ementa homologada
> **A ementa oficial de 49309 ainda não foi confirmada no AVA.** O que está aqui é o recorte que eu proponho, alinhado à progressão CCNA (SRWE). Quando a oficial sair, eu ajusto esta página e aviso o que mudou.
>
> **O que já está travado é a nota e as datas de prova** — isso não depende da ementa.

### O semestre em dois blocos

| | Semanas | O que você aprende a fazer |
| :--- | :-- | :--- |
| **Bloco 1 — comutar e segmentar** | S02 a S08 | VLAN · trunk 802.1Q · roteamento entre VLANs · STP · EtherChannel · DHCP |
| 🎯 **PROVA N1** | S09 · **22/09** | |
| **Bloco 2 — rotear e proteger** | S11 a S17 | OSPF · NAT/PAT · ACL padrão e estendida · segurança de camada 2 · WLAN |
| 🎯 **PROVA N2** | S19 · **01/12** | |
| **Projeto integrador** | S18 e S19 | Tudo junto, em dupla, com **defesa oral de 3 minutos** |

O projeto não é um bloco novo: ele cobra o que veio antes.

---

## 🕐 Minuto 30 · O calendário da sua turma

**São três turmas em três dias, e elas não têm o mesmo número de encontros.** Você precisa saber em qual linha está.

| Turma | Dia | Sala | Encontros S01–S19 | Feriados que perde |
| :--- | :-- | :-- | :-: | :--- |
| **T** · teórica | terça | VIA203 | 18 | 13/10 |
| **P11** · prática | segunda | VIA215 | **15** | 31/08 · 07/09 · 12/10 · 02/11 |
| **P12** · prática | quinta | VIA216 | **19** | nenhum |

### A assimetria, e por que ela não te prejudica

A P11 perde quatro aulas em feriado; a P12 não perde nenhuma. Se cada prática seguisse o próprio ritmo, em novembro as turmas estariam a **quatro laboratórios de distância**.

> **A regra que resolve isso:** laboratório novo só cai em semana em que **as duas práticas se encontram.**

São quatro as semanas em que só a P12 tem aula: **S06, S07, S12 e S15**. Nelas ela recebe aprofundamento sem nota, e o conteúdo novo fica na teórica de terça — que todo mundo assiste.

> [!WARNING] ⚠️ P11: o gotcha que custa duas questões na N1
> Você perde **31/08 e 07/09**, que são justamente as semanas de **STP e EtherChannel**. Isso **não** significa que o assunto não cai na prova — cai, pela teórica de terça. O que muda é o nível cobrado: **explicar e analisar, nunca configurar**, porque configurar isso só a P12 praticou. Quem tratar essas duas semanas como "matéria que pulei" chega à N1 devendo duas questões.

### Semana a semana

| S | T · ter | P11 · seg | P12 · qui | Conteúdo | Laboratório |
| :-: | :-- | :-- | :-- | :--- | :--- |
| **01** | 28/07 | 27/07 | 30/07 | Contrato + diagnóstico de Redes I | **Lab 0** — setup e "conserte esta rede" |
| **02** | 04/08 | 03/08 | 06/08 | Comutação: tabela MAC, domínios de colisão e broadcast | **Lab 1** — switching básico |
| **03** | 11/08 | 10/08 | 13/08 | VLANs: conceito, criação, portas de acesso | **Lab 2** — VLANs |
| **04** | 18/08 | 17/08 | 20/08 | Trunking 802.1Q | **Lab 3** — trunk entre switches |
| **05** | 25/08 | 24/08 | 27/08 | Roteamento entre VLANs · consolidação | **Lab 4** — router-on-a-stick |
| **06** | 01/09 | 🚫 31/08 | 03/09 | STP: por que um loop de camada 2 derruba a rede | P12: desafio broadcast storm |
| **07** | 08/09 | 🚫 07/09 | 10/09 | EtherChannel + redundância de gateway | P12: desafio EtherChannel |
| **08** | 15/09 | 14/09 | 17/09 | DHCPv4 · DHCPv6 · **revisão N1** | **Lab 5** — DHCP + revisão de STP |
| **09** | 🎯 **22/09 PROVA N1** | 21/09 | 24/09 | Prova em duas etapas | Diagnóstico integrador |
| **10** | 29/09 | 28/09 | 01/10 | **Vista da N1** — devolutiva por erro | Refazer os cenários da prova |
| **11** | 06/10 | 05/10 | 08/10 | Roteamento dinâmico · OSPF: introdução | Lab 6 *(formativo)* |
| **12** | 🚫 13/10 | 🚫 12/10 | 15/10 | (feriados) | P12: prática espiral de OSPF |
| **13** | 20/10 | 19/10 | 22/10 | OSPF: custo, DR/BDR, verificação | Lab 7 *(formativo)* |
| **14** | 27/10 | 26/10 | 29/10 | NAT estático, dinâmico e PAT | Lab 8 *(formativo)* |
| **15** | 03/11 | 🚫 02/11 | 05/11 | ACLs padrão: lógica, wildcard, posicionamento | P12: exercícios de ACL |
| **16** | 10/11 | 09/11 | 12/11 | ACLs estendidas + segurança de camada 2 | Lab 9 *(formativo)* |
| **17** | 17/11 | 16/11 | 19/11 | WLAN: 802.11, WPA2/WPA3 | Lab 10 *(formativo)* |
| **18** | 24/11 | 23/11 | 26/11 | **Projeto integrador** + início das defesas | Projeto (vale nota na N2) |
| **19** | 🎯 **01/12 PROVA N2** | 30/11 | 03/12 | Prova em duas etapas | Defesas orais restantes |
| **20** | 08/12 | 07/12 | 10/12 | **Vista da N2** + fechamento | — |

🚫 = feriado. **Em negrito, os laboratórios que valem ponto** (Lab 0 a 5); os marcados *(formativo)* são obrigatórios e registrados, mas **não valem nota** — o porquê está no bloco seguinte.

> [!NOTE] 📌 O que ainda depende da secretaria
> O horário publicado em 25/07 traz **um único slot teórico na terça**, e a leitura de que ele reúne as turmas 11 e 12 está em confirmação. As datas de **22/09 e 01/12** dependem disso; se mudarem, saem no AVA.
>
> Existem sábados de reposição no calendário (**29/08, 12/09, 03/10, 24/10, 07/11**), mas **qual dia da semana cada um repõe ainda não está confirmado.** Não assuma que o seu sábado é o seu dia.

---

## 🕐 Minuto 45 · Os 100 pontos

Aprovação exige as duas coisas ao mesmo tempo: **≥ 60 pontos** e **frequência ≥ 75%**.

| Etapa | Total | Prova | Atividade | Uniube+ |
| :--- | :-: | :-- | :-- | :-: |
| **N1** — fecha na S09/S10 | **35** | 25 — prova de **22/09** | 5 — laboratórios (Lab 0 a 5, 1 pt cada, contam os **5 melhores**) | 5 |
| **N2** — fecha na S19/S20 | **50** | 30 — prova de **01/12** | 6 — projeto integrador (dupla)<br>4 — defesa oral (individual) | 10 |
| **Institucional** | **15** | 15 — data definida pela instituição | — | — |

### Como o ponto do laboratório é apurado

A régua é sempre a mesma: **dez itens verificados, oito deles = o ponto (80% de acerto).** Quando o cenário vier em arquivo `.pka`, o próprio Packet Tracer confere e mostra a sua porcentagem na tela — você sai da aula sabendo a nota. Quando não vier, eu confiro os dez itens na sua tela, na hora.

São **seis** laboratórios valendo e contam **os cinco melhores** — o sexto é a sua margem para uma falta ou um dia ruim. O teto continua sendo 5: fazer os seis não dá 6.

**Os laboratórios 6 a 10 não valem nota**, e isso é decisão de projeto: o ponto da N2 está no projeto integrador, que cobra as mesmas habilidades. Laboratório sem nota é laboratório em que dá para errar de propósito — e é errando de propósito que se aprende diagnóstico.

> [!IMPORTANT] 🎯 O ponto barato vence o ponto caro
> 22 na prova + 4 labs + Uniube+ em dia = **31**. Os mesmos 22 na prova + os **seis** labs + Uniube+ zerado = 22 + 5 (teto) + 0 = **27**.
>
> Quem fez dois laboratórios a mais ficou atrás, porque o sexto não eleva o teto. **Antes de correr atrás do ponto caro, garanta o barato.**

### A prova em duas etapas

| Minuto | O quê | N1 | N2 |
| :-- | :--- | :-: | :-: |
| 0–50 | **Etapa individual** — sem consulta, sem dispositivos | 21 | 26 |
| 50–55 | Entrega · grupos de 3 a 4 sorteados na hora | — | — |
| 55–73 | **Etapa em grupo** — refaz as 4 questões mais difíceis, consenso obrigatório | 4 | 4 |
| | **Total da prova** | **25** | **30** |

As duas etapas **compõem** o valor da prova, não se somam a ele. Toda prova tem **vista na semana seguinte** (29/09 e 08/12), e a devolutiva é **por erro**: eu levo os erros mais frequentes da turma e a gente refaz os cenários em sala.

> [!WARNING] ⚠️ O que ainda não está definido
> - **A data da Avaliação Institucional** (15 pontos) é da instituição. Aguardando.
> - **O Uniube+** (5 na N1, 10 na N2): formato e prazos são da coordenação, lançados pelo AVA. Aguardando.
>
> Serão publicados **no AVA**, e esta página é atualizada no mesmo dia. Enquanto estiver escrito "aguardando" aqui, é porque eu não sei.

---

## 🕐 Minuto 58 · Se as coisas derem errado

São dois mecanismos diferentes, para situações diferentes — e confundi-los custa o prazo.

| | **Segunda chamada** (substitutiva) | **Recuperação** |
| :--- | :--- | :--- |
| Para quem | Quem **faltou** à prova | Quem **fez** as provas e ficou entre **40 e 59** pontos |
| Como pedir | **SAE no AVA, em até 3 dias úteis** da prova perdida, com justificativa anexada | Não se pede: o direito nasce da nota |
| Data | **14 a 16/12** | Entre **17 e 18/12** — divulgo no AVA junto com o resultado da N2 |
| Como entra na nota | Substitui a nota daquela prova | **Zera** as notas das duas provas — 25 + 30 = **55 pontos** — e entra no lugar delas |
| Teto | Nenhum | **A nota final não passa de 60** |

### O prazo de 3 dias úteis

**Faltou à prova? Abra o SAE no AVA em até 3 dias úteis.** Passado o prazo, o curso indefere — não é decisão minha, é norma institucional.

E o ponto que sempre pega: **não me entregue atestado.** Nem em papel, nem por e-mail, nem no corredor. Pela norma, o atestado é anexado ao SAE e quem analisa é a coordenação. Documento na minha mão não conta como pedido, e ainda faz você perder o prazo achando que resolveu.

Se você guardar uma única coisa desta aula, que seja esta.

### A recuperação troca, não soma

Os **três requisitos valem juntos**: ter feito todas as provas · estar entre 40 e 59 pontos · não estar com Uniube+/AVA zerados. Faltando um, não há recuperação.

A consequência é contraintuitiva e vale entender agora, não em dezembro: **quem foi bem nas provas e mal na nota contínua não se beneficia** — jogaria fora justamente a parte boa. Ela foi desenhada para quem tem provas fracas e continuada de pé. Com o teto de 60, ninguém sai da recuperação com mais do que o mínimo de aprovação.

**A leitura prática:** os 15 pontos de Uniube+ e os 5 de laboratório custam menos que qualquer prova, e os laboratórios fecham já na primeira metade do semestre. Com eles garantidos, a faixa dos 40–59 fica bem mais longe.

---

## 🕐 Minuto 70 · O que fazer nesta semana

1. **Instale o Cisco Packet Tracer** e crie a conta no [NetAcad](https://www.netacad.com/) — é grátis. **Sem o simulador na sua máquina, nenhuma prática do semestre funciona.**
2. **Entre no AVA Uniube On-line** e localize a disciplina. É lá que sai tudo o que esta página marca como "aguardando".
3. **Anote a sua prática** — P11 na segunda ou P12 na quinta — e confira os feriados da sua coluna.

<div class="au-resumo">
<b>Resumo — o que consultar depois</b>

| Item | O que lembrar |
| :--- | :--- |
| **Aprovação** | ≥ 60 pontos **e** ≥ 75% de frequência — as duas juntas |
| **Distribuição** | N1 35 · N2 50 · Institucional 15 |
| **Provas** | N1 **22/09** · N2 **01/12** · duas etapas: individual + grupo |
| **Vistas** | 29/09 e 08/12 — devolutiva por erro, é aula |
| **Laboratórios** | Lab 0 a 5 valem 1 pt · **80% de acerto** · contam os **5 melhores** de seis |
| **Labs 6 a 10** | Obrigatórios e registrados, **sem nota** |
| **Projeto** | 6 pts em dupla + **4 pts de defesa oral individual**, 3 min sem consulta |
| **Faltou à prova** | **SAE no AVA em 3 dias úteis.** Atestado vai no SAE, **não** comigo |
| **Segunda chamada** | 14 a 16/12 |
| **Recuperação** | 40–59 pts + todas as provas feitas + AVA não zerado · **zera as provas** · teto 60 |
| **P11** · segunda | VIA215 · **15 encontros** · perde 31/08, 07/09, 12/10, 02/11 |
| **P12** · quinta | VIA216 · **19 encontros** · não perde nenhum |
| **Teórica** | Terça, VIA203 — conteúdo novo das semanas que a P11 perde cai aqui |
| **Ferramenta** | Cisco Packet Tracer, **desde a S01** |
| **Celular e fone** | Proibidos em sala. Quem quiser usar, sai da sala |
| **Chamada** | Hora limite: **15 min depois do início** |
| **Corredor** | Disciplina, avaliação e afins **não** se tratam no corredor |
| **Falar comigo** | AVA ou **romualdo.filho@uniube.br** — **não** respondo WhatsApp |
| **IA** | Incentivada, escala de 1 a 3 por instrumento. **A IA ajuda, a IA não cria** |
| **Encerramento do semestre** | 19/12 |

</div>

<div class="au-refs">
<b>De onde vem o que eu disse hoje</b>

Esta aula é administrativa: quase nada dela sai de livro. Vale você saber o que é documento e o que sou eu organizando o semestre.

**Norma da coordenação, que vale acima do meu plano:**

As regras de **aprovação, segunda chamada e recuperação** são as definidas pela coordenação do **Campus Uberlândia** para os cursos de Engenharias, Gestão e Tecnologia da Informação neste semestre. Não são minhas e eu não posso alterá-las. **O texto que vale é o publicado no AVA.**

**Calendário da universidade:** as datas travadas — janelas de prova, feriados, segunda chamada de 14 a 16/12, lançamento de notas, encerramento em 19/12 — são do calendário acadêmico, publicado no AVA.

**Bibliografia**, na biblioteca virtual da Uniube:

- KUROSE, J. F. **Redes de computadores e a internet: uma abordagem top-down.** 8. ed. São Paulo: Pearson, 2021.
- TANENBAUM, A. S.; FEAMSTER, N.; WETHERALL, D. J. **Redes de Computadores.** 6. ed. São Paulo: Pearson, 2021.

**Eu falando:** o conteúdo das 20 semanas e a ordem em que ele entra — e, enquanto a ementa oficial de 49309 não sai, **o próprio recorte da disciplina é proposta minha**. Também são minhas: a prova em duas etapas, a decisão de quais laboratórios valem nota, o projeto com defesa oral, a escala de IA e as regras de sala. Isso é decisão minha, e eu assumo.

**Divergiu do AVA? Vale o AVA — e me avise que eu corrijo esta página no mesmo dia.**

</div>

<div class="au-proxima">
<b>Na próxima aula</b>

<p>Hoje foi contrato. Na próxima o conteúdo começa por onde Redes II se separa de Redes I: <b>o switch para de ser um cano e vira uma decisão</b>. Ele aprende quem está em cada porta — e no dia em que essa tabela enche, a rede inteira sente.</p>
</div>

---

*Última atualização: 28/07/2026 · Regras de aprovação, segunda chamada e recuperação são as da coordenação para 2026/2 — o texto oficial está no AVA. A ementa e o conteúdo semana a semana são proposta minha até a oficial de 49309 sair. O agrupamento da teórica de terça, as datas de prova que dependem dele, os sábados de reposição, o Uniube+ e a Avaliação Institucional aguardam confirmação — e estão marcados como tal ao longo da página.*

**◀ [Voltar ao índice da disciplina](./)** · **📘 [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato)** — o detalhamento completo

</div>
