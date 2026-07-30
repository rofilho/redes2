---
title: "Aula 01 — Lab 0: Resgate (Prática)"
disciplina: Redes de Computadores II
codigo: "49309"
aula: 1
tipo: pratica
turma: P11 e P12
semana: 1
date: 2026-07-27
tags: [redes2, 2026-2, lab, packet-tracer, diagnostico, troubleshooting]
---

<div class="au-leitura" data-aula="s01p">

# 🟢 Aula 01 — Lab 0: Resgate

**Disciplina:** Redes de Computadores II (49309) — Uniube<br>
**Professor:** Romualdo Mathias Filho<br>
**Semana:** 1 · 🛠️ Prática (75 min)<br>
**P11:** segunda, 27/07/2026 · VIA215 — **P12:** quinta, 30/07/2026 · VIA216

---

<div class="au-caminho">
<b>Nosso caminho até aqui</b>

Esta é a primeira prática de Redes II, então o "até aqui" é **Redes I**. Nenhum defeito do laboratório de hoje exige algo que você ainda não viu — é de propósito: o objetivo de hoje não é conteúdo novo, é **método**.

Responda **antes** de abrir. O que você errar aqui é o que vai te custar tempo na hora de diagnosticar.

<details>
<summary>Você pinga o gateway com sucesso. O que isso <i>prova</i>, e o que não prova?</summary>

**Prova:** que existe caminho íntegro de ida e volta entre a sua máquina e a interface do roteador — cabo, porta, switch e a sua pilha IP local funcionando. Prova também, e isto quase todo mundo esquece, que **a sua máscara inclui o gateway**: se não incluísse, você nem teria tentado entregar o pacote a ele.

**Não prova:** que o roteador *encaminha* para os outros lados, que a rota existe, que o destino está no ar, nem que nomes resolvem. "Pinga o gateway" é um teste de trecho, não um atestado de saúde da rede.

Guarde a distinção: cada teste vale pelo que **elimina**, não pelo que confirma.

</details>

<details>
<summary>PC-A é 192.168.10.20/24 e PC-B é 192.168.10.200/26, no mesmo switch. Quem enxerga quem?</summary>

**A conversa fica torta — e é a assimetria, não a falha, que denuncia máscara.** Cada host calcula sozinho quem é vizinho:

- **PC-A (`/24`)** enxerga o bloco `192.168.10.0–255`. Para ele, PC-B é local: envia o quadro direto, sem gateway.
- **PC-B (`/26`)** enxerga só `192.168.10.192–255`. Para ele, PC-A é estrangeiro: manda para o gateway.

Um lado entrega direto e o outro pede carona ao roteador. Dependendo do que houver no caminho o ping pode até andar, por rota indireta — mas **a rede parou de ser simétrica**, e é isso que você tem de notar.

A lição que vale o semestre: **a máscara é a fronteira, e ela decide sozinha.** Cada VLAN da S03 vai ser uma sub-rede, e cada gateway da S05 vai depender desta conta.

</details>

<details>
<summary>O que um cabo console conecta, exatamente?</summary>

**A porta de gerenciamento, não o plano de dados.** O acesso por console existe para *configurar* o equipamento, tipicamente quando a rede está indisponível, e é deliberadamente independente do encaminhamento. **Nenhum quadro de usuário atravessa essa porta.**

Por isso "as duas caixas estão ligadas por um cabo" nunca é resposta para "há enlace de dados?". São perguntas sobre coisas diferentes.

**"Tem cabo" e "tem rede" são afirmações diferentes** — é o primeiro degrau do fluxo de diagnóstico, e o degrau em que mais gente escorrega em campo.

</details>
</div>

> [!INFO] 🎯 Visão geral e recursos
> Uma rede de campus foi entregue por um estagiário apressado. Ela está **quase** funcionando — e "quase" é a palavra mais cara da infraestrutura. Hoje você não monta uma rede: você **conserta** uma, e sai daqui com o método que vai usar em todos os laboratórios do semestre e na sua primeira semana de trabalho.
>
> **O que você leva desta aula**
> - O método de diagnóstico **de baixo para cima** — a sequência de perguntas que transforma "não funciona" em "está quebrado *aqui*".
> - Como usar o `ping` para **dividir o problema em dois** em vez de sair mexendo em configuração.
> - O ambiente do semestre inteiro no ar: conta NetAcad + Packet Tracer rodando na sua máquina.
> - **1 ponto da Atividade N1** pelo Lab 0 — apurado na tela, no Packet Tracer, na prática em que o cenário entrar (ver o aviso logo abaixo).
>
> **📂 Recursos**
> - [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato) — a referência do semestre: calendário das três turmas, nota, prazos e regras
> - [Cisco Packet Tracer + conta NetAcad](https://www.netacad.com/) — grátis, obrigatório, **instale antes de vir**. Sem o simulador na sua máquina nenhuma prática do semestre funciona.
> - `lab00_resgate.pka` — o cenário do Lab 0. **Ainda não distribuído:** quando entrar, o link aparece aqui e eu aviso no AVA
> - Meia folha de papel — bilhete de saída, anônimo, recolhido na porta

> [!IMPORTANT] 📌 Como esta primeira prática funciona
> **Hoje é ambiente e método.** A prioridade é sair daqui com a conta NetAcad criada e o Packet Tracer rodando na sua máquina — sem isso, nenhuma aula prática do semestre funciona. E os **quatro defeitos** passam no projetor, um a um: você vê o sintoma, responde o que verificaria primeiro, e a resposta só aparece depois disso.
>
> **O `lab00_resgate.pka` valendo 1 ponto entra na próxima prática**, igual para P11 e P12 — laboratório novo só cai em semana em que as duas turmas se encontram, e essa regra vale desde a primeira. **Você não perde ponto nenhum:** são seis labs valendo e contam os cinco melhores.
>
> Traga o notebook com o Packet Tracer **já instalado** se conseguir. O download na rede da sala, com a turma inteira baixando junto, é o gargalo previsível da noite.

### ⏱️ Os 75 minutos de hoje

| Min | Bloco | Onde está nesta página |
| :-- | :--- | :--- |
| 0–7 | Entrada, chamada e **Nosso caminho até aqui** — 3 questões de Redes I, sem nota | bloco de abertura |
| 7–27 | **O contrato do semestre** — nota, datas, laboratórios, regras de sala | callout do contrato |
| 27–42 | **Instalação** — NetAcad e Packet Tracer funcionando na sua máquina | Tópico 1 |
| 42–65 | **Exemplo resolvido: os quatro defeitos, no projetor** — você diz o que verificaria primeiro; a resposta vem depois | Tópicos 2 e 3 |
| 65–72 | **Como o semestre funciona** — duplas, quebra deliberada, o laboratório que vale ponto | Revisão |
| **72–75** | Reflexão + bilhete de saída | Fechamento |

> [!NOTE] 🧭 P11 e P12 — a ordem é diferente para vocês, e isso é intencional
> **P11 (segunda):** você faz este laboratório **antes** da teórica de terça (28/07), conforme o horário emitido em 25/07 — o agrupamento das duas práticas nessa aula está em confirmação na secretaria. Os conceitos que reencontrar aqui voltam no diagnóstico da turma; você chega com a experiência na mão.
> **P12 (quinta):** se você já teve a teórica de terça, vai reconhecer aqui pelo menos um dos princípios que discutimos lá, vivo e mordendo. Repare em qual.

> [!IMPORTANT] 📋 O contrato do semestre — o resumo, para quem só vem ao laboratório
> Isto é apresentado por extenso na **teórica**, e mora por extenso no [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato). Fica aqui em resumo porque ninguém pode terminar a primeira semana sem saber quando é a prova.
>
> - **Aprovação:** ≥ **60 pontos** *e* ≥ **75% de frequência**. As duas juntas — falta reprova com nota boa.
> - **Os 100 pontos:** N1 = 35 (25 prova + 5 labs + 5 Uniube+) · N2 = 50 (30 prova + 6 projeto + 4 defesa + 10 Uniube+) · Institucional = 15.
> - **Datas de prova:** N1 em **22/09** · N2 em **01/12** · vistas em **29/09** e **08/12** — dependem da confirmação do agrupamento da terça, e se mudarem o aviso sai no AVA. A prova tem duas etapas: 50 min individual + 18 min em grupo nas 4 questões mais difíceis.
> - **Laboratórios que valem nota:** Lab 0 a 5, **1 ponto cada**, 80% de acerto, contam os **5 melhores**. Os labs 6 a 10 são formativos, sem nota.
> - **Faltou à prova?** Pedido de segunda chamada pelo **SAE no AVA, em até 3 dias úteis**, com o atestado anexado no SAE — **não na minha mão**. O prazo é institucional; fora dele o curso indefere.
> - **Fechou entre 40 e 59?** Recuperação em 17 ou 18/12 (confirmo no AVA). Ela **zera as notas das duas provas — 25 + 30 = 55 pontos — e vale por elas**; laboratórios, Uniube+ e os 15 da Institucional ficam onde estão, e a nota final trava em 60.
> - **Feriados da disciplina:** 31/08 · 07/09 · 12/10 · 13/10 · 02/11. A **P11 perde quatro segundas**, a P12 nenhuma — por isso laboratório novo só cai em semana em que as duas práticas se encontram.
> - **Regras de sala:** celular e fone proibidos · chamada com hora limite de 15 min · atraso entra em silêncio · não abordar o professor nos corredores · o professor não responde WhatsApp (AVA ou e-mail). Estão publicadas no plano.

<aside class="au-antes">
<b class="au-nota-t">Antes de começar</b>

**Exemplo resolvido** — um problema inteiro, resolvido no projetor passo a passo e em voz alta, antes de você tentar sozinho. Você vê o caminho completo, não só a resposta. Depois é a sua vez.

**Porcentagem de acerto** — o arquivo do Packet Tracer compara a sua rede com a rede correta e mostra na tela quanto você acertou. É a nota do laboratório, e ela sai em sala. Na tela do programa esse número aparece em inglês, com o nome `Completion`.

**Quebra deliberada** — eu derrubo alguma coisa na sua topologia sem dizer o quê, e você descobre. A partir da semana 2 isso ocupa os últimos 20 minutos de toda prática. Hoje é só um aperitivo.

**Remendo** — mudar a rede para caber no aparelho errado, em vez de consertar o aparelho. Parece que funcionou e **derruba a sua porcentagem**. Tem uma seção só sobre isso mais abaixo.

</aside>

---

## 📌 1. Ambiente pronto: NetAcad + Packet Tracer [Mão na massa ⏳ 15 min]

O Packet Tracer é o laboratório desta disciplina por 20 semanas. Ele é gratuito, roda em Windows, macOS e Linux, e exige uma conta gratuita na Cisco Networking Academy — **a conta é a parte que demora**, não o download.

**Os três passos, nesta ordem:**

1. Criar a conta em [netacad.com](https://www.netacad.com/) e confirmar o e-mail (o link de confirmação às vezes cai no spam — olhe lá antes de tentar de novo).
2. Matricular-se no curso gratuito **"Getting Started with Cisco Packet Tracer"**. É ele que libera o download.
3. Baixar e instalar a versão **8.2 ou superior**, e abrir o programa uma vez logado, para validar a conta.

> [!WARNING] ⚠️ Gotcha de infraestrutura
> **A rede da sala não aguenta a turma inteira baixando ~250 MB ao mesmo tempo.** Se todo mundo baixar agora, ninguém baixa.
> Quem já instalou: levante a mão e **ajude o vizinho** — a sala termina este bloco 100% funcional, e essa é a meta real dos 15 minutos.
> Quem não conseguiu: sente com quem conseguiu. **Dupla resolve hoje**; até a próxima prática, resolva o seu.
> Falhou por política da máquina (notebook corporativo, sem permissão de administrador)? Me procure no fim da aula — existe caminho, mas ele é individual.

> [!TIP] 💡 Dica de produção
> Salve o arquivo do laboratório numa pasta que **não** seja o Desktop nem a pasta de Downloads sincronizada com nuvem. Simulador escreve no arquivo o tempo todo; sincronização automática no meio disso é a receita clássica de "meu trabalho sumiu" — e a versão que o serviço devolve costuma ser a de dez minutos atrás. Crie uma pasta local `Redes2/` e trabalhe nela o semestre inteiro.

---

## 📌 2. O método: um defeito resolvido no projetor [Exemplo resolvido ⏳ 8 min]

Antes de você caçar, você vê **um** defeito ser caçado na sua frente, com cada pergunta dita em voz alta. Não é para você decorar a resposta: é para você copiar **a sequência de perguntas**.

### 2.1 A sequência

A regra é subir uma camada por vez, e **só subir quando a de baixo estiver provada**. Cada resposta elimina um conjunto inteiro de causas — é isso que separa diagnóstico de tentativa e erro.

```mermaid
graph TD
    A["Sintoma:<br/>alguma coisa nao funciona"] --> B{"Tem link?<br/>Bolinha verde nas duas pontas<br/>e o cabo e o certo?"}
    B -->|"Nao"| B1["<b>Camada 1</b><br/>cabo, porta,<br/>tipo de cabo"]
    B -->|"Sim"| C{"Pinga alguem da<br/>PROPRIA sub-rede?"}
    C -->|"Nao"| C1["<b>Camada 3 — local</b><br/>IP e mascara:<br/>voce esta na sub-rede<br/>que deveria estar?"]
    C -->|"Sim"| D{"Pinga alguem de<br/>FORA da sub-rede?"}
    D -->|"Nao"| D1["<b>Camada 3 — saida</b><br/>gateway: ele e da<br/>SUA propria sub-rede?"]
    D -->|"Sim"| E{"Pinga por IP mas<br/>o NOME nao resolve?"}
    E -->|"Sim"| E1["<b>Camada 7</b><br/>DNS: para quem voce<br/>esta perguntando?"]
    E -->|"Nao"| E2["Esta funcionando.<br/>Proximo host."]

    style B1 fill:#fbe9dd,stroke:#b1541b,stroke-width:2px,color:#1b1f24
    style C1 fill:#eaf1fa,stroke:#1f5fa8,stroke-width:2px,color:#1b1f24
    style D1 fill:#eaf1fa,stroke:#1f5fa8,stroke-width:2px,color:#1b1f24
    style E1 fill:#f2ece5,stroke:#6b4423,stroke-width:2px,color:#1b1f24
    style E2 fill:#e6f2ea,stroke:#2e7d52,stroke-width:2px,color:#1b1f24
```

> Mesma convenção de cor de todos os diagramas do semestre: **laranja = camada física**, **azul = camada de rede**, **marrom = camada de aplicação**, **verde = resolvido**.

### 2.2 O passo que quase todo mundo pula

O passo mais valioso do fluxo é o segundo, e é o mais ignorado: **pingar alguém da própria sub-rede antes de pingar a internet.**

Esse teste divide o problema em dois. Se o ping local **funciona**, você acabou de provar que o cabo, a porta, o switch e o seu próprio endereço estão bons — o defeito está na *saída* da rede. Se o ping local **falha**, nem adianta olhar gateway ou DNS: o problema está antes disso.

Quem começa perguntando *"o DNS está certo?"* está adivinhando. Quem começa perguntando *"eu enxergo o meu vizinho?"* está diagnosticando.

Numa rede **qualquer** — os endereços abaixo são de uma topologia de exemplo, não a de hoje — a sequência tem esta cara:

<div class="au-term">
<div class="au-term-h"><b>PC-EXEMPLO</b> <span>· Command Prompt · recorte</span></div>
<div class="au-term-b"><span class="cm">! 1. eu enxergo o meu vizinho? — o teste que divide o problema em dois</span>
<span class="mark"><span class="ps">C:\&gt;</span> <span class="kw">ping</span> 10.0.99.11</span>
Pinging 10.0.99.11 with 32 bytes of data:
Request timed out.
Reply from 10.0.99.11: bytes=32 time&lt;1ms TTL=128
Reply from 10.0.99.11: bytes=32 time&lt;1ms TTL=128
Reply from 10.0.99.11: bytes=32 time&lt;1ms TTL=128
    Packets: Sent = 4, Received = 3, Lost = 1 (25% loss)
<span class="cm">!</span>
<span class="cm">! o 1o timeout e o ARP, nao defeito: leia o conjunto, nunca a 1a linha.</span>
<span class="cm">! 2. local provado. agora: eu saio da sub-rede?</span>
<span class="ps">C:\&gt;</span> <span class="kw">ping</span> 10.0.99.254
<span class="ps">C:\&gt;</span> <span class="kw">ipconfig</span></div>
</div>

Repare no que aconteceu: sem tocar em **nenhuma** configuração, o espaço de busca caiu de "a rede inteira" para um dos dois lados da fronteira. A linha marcada é a que fez o trabalho.

> [!WARNING] ⚠️ Gotcha — o primeiro pacote mente
> No Packet Tracer o **primeiro** `ping` de uma sequência quase sempre dá `Request timed out`: o host ainda está resolvendo o ARP do destino e o primeiro pacote morre esperando. **Isso não é defeito.** Leia sempre as quatro linhas e a estatística, nunca a primeira. Quem julga pela primeira linha vai "consertar" uma rede que já estava certa — e derrubar o próprio Completion.

<details class="au-aposta">
<summary>Aposte antes de ver: um host pinga o gateway sem perda, mas não pinga nenhuma máquina da própria sala. Isso é possível?</summary>

**É possível, sim** — e é exatamente o tipo de resultado que parece contraditório até você olhar a máscara.

Se o host **alcança o gateway**, cabo, porta, switch e a pilha IP local estão funcionando: **camadas 1 e 2 eliminadas**. O que sobra é a fronteira da sub-rede. Uma máscara mais restritiva do que a da rede real coloca o host num bloco pequeno que **contém** o gateway e **exclui** os vizinhos — ele enxerga quem está no seu bloco e entrega todo o resto ao gateway, inclusive o colega que está a dois metros dele.

E aqui vem a parte que confunde: o roteador **pode** encaminhar esse tráfego de volta pela mesma interface — é o comportamento normal dele, e ele ainda avisa o host com um *ICMP redirect*. Então às vezes o ping até anda. O que **não** anda é a rede ser simétrica: um lado fala direto, o outro fala por intermediário, e o desempenho e o comportamento passam a depender de quem começou a conversa.

**A lição transferível:** "pinga o gateway" não é prova de que a rede está certa — é prova de que o caminho *até o gateway* está certo. E "o ping passou" também não é prova: **passou por onde?**

</details>

> [!TIP] 💡 Por que o exemplo vem antes da sua vez
> No começo, ver alguém resolver por inteiro ensina mais do que tentar do zero. Quando você ainda não tem repertório, tentar às cegas gasta toda a sua atenção na procura, e não sobra atenção para aprender o caminho.
>
> **Isso muda no meio do semestre, e é de propósito.** Conforme você ganha traquejo, o exemplo pronto começa a atrapalhar — vira resposta antes da pergunta. Por isso a ajuda diminui: até a semana 8 você tem o exemplo completo; da 11 em diante, só pedaços; da 16 em diante, o problema direto, sem exemplo. Se em novembro você achar que "o professor parou de explicar", é isso, e é planejado.

> [!NOTE] 💼 Pergunta de entrevista
> *"Um usuário liga dizendo que a internet caiu. Qual é a sua primeira pergunta?"*
>
> **Resposta esperada de um sênior:** *"Caiu para você só, ou para a sala inteira?"* — e logo depois: *"você consegue abrir alguma coisa pelo IP?"*. As duas perguntas custam dez segundos e cortam o espaço de busca pela metade cada uma: a primeira separa problema de host de problema de rede; a segunda separa conectividade de resolução de nome. Candidato júnior começa pedindo para reiniciar o roteador. **Sênior começa medindo o tamanho do incêndio.**

---

## 📌 3. O cenário: uma rede de campus com quatro defeitos [Exemplo resolvido ⏳ 15 min]

Três sub-redes diretamente conectadas num roteador. Sem protocolo de roteamento, sem VLAN, sem nada que você ainda não tenha visto — **roteamento dinâmico é a S11, VLAN é a S03.** Hoje é tudo Redes I.

<figure class="au-fig">
<svg viewBox="0 0 660 300" role="img" aria-label="Topologia do laboratorio: tres sub-redes ligadas ao roteador R-CAMPUS. Administrativo 192.168.10.0/24 com dois PCs no switch SW-ADM, Laboratorio 192.168.20.0/24 com dois PCs no switch SW-LAB, e Servidores 192.168.30.0/24 com o SRV-PORTAL no switch SW-SRV">
<rect x="20" y="14" width="180" height="62" rx="6" fill="none" stroke="#2778c4" stroke-width="2"></rect>
<text x="110" y="34" text-anchor="middle" font-size="12" fill="#2778c4" font-family="monospace" font-weight="bold">ADMINISTRATIVO</text>
<text x="110" y="49" text-anchor="middle" font-size="11" fill="#8a8f98" font-family="monospace">192.168.10.0/24</text>
<text x="110" y="67" text-anchor="middle" font-size="11" fill="#8a8f98" font-family="monospace">PC-ADM1 · PC-ADM2</text>
<rect x="460" y="14" width="180" height="62" rx="6" fill="none" stroke="#2778c4" stroke-width="2"></rect>
<text x="550" y="34" text-anchor="middle" font-size="12" fill="#2778c4" font-family="monospace" font-weight="bold">LABORATÓRIO</text>
<text x="550" y="49" text-anchor="middle" font-size="11" fill="#8a8f98" font-family="monospace">192.168.20.0/24</text>
<text x="550" y="67" text-anchor="middle" font-size="11" fill="#8a8f98" font-family="monospace">PC-LAB1 · PC-LAB2</text>
<line x1="110" y1="76" x2="110" y2="104" stroke="#8a8f98" stroke-width="2"></line>
<rect x="55" y="104" width="110" height="28" rx="5" fill="none" stroke="#8a8f98" stroke-width="2"></rect>
<text x="110" y="123" text-anchor="middle" font-size="12" fill="#8a8f98" font-family="monospace">SW-ADM</text>
<line x1="550" y1="76" x2="550" y2="104" stroke="#8a8f98" stroke-width="2"></line>
<rect x="495" y="104" width="110" height="28" rx="5" fill="none" stroke="#8a8f98" stroke-width="2"></rect>
<text x="550" y="123" text-anchor="middle" font-size="12" fill="#8a8f98" font-family="monospace">SW-LAB</text>
<line x1="110" y1="132" x2="110" y2="168" stroke="#8a8f98" stroke-width="2"></line>
<line x1="110" y1="168" x2="240" y2="168" stroke="#8a8f98" stroke-width="2"></line>
<text x="150" y="162" font-size="10" fill="#8a8f98" font-family="monospace">G0/0</text>
<line x1="550" y1="132" x2="550" y2="168" stroke="#8a8f98" stroke-width="2"></line>
<line x1="550" y1="168" x2="420" y2="168" stroke="#8a8f98" stroke-width="2"></line>
<text x="480" y="162" font-size="10" fill="#8a8f98" font-family="monospace">G0/1</text>
<rect x="240" y="148" width="180" height="40" rx="6" fill="none" stroke="#00aa9f" stroke-width="2.5"></rect>
<text x="330" y="173" text-anchor="middle" font-size="13" fill="#00aa9f" font-family="monospace" font-weight="bold">R-CAMPUS (2911)</text>
<line x1="330" y1="188" x2="330" y2="216" stroke="#8a8f98" stroke-width="2"></line>
<text x="337" y="206" font-size="10" fill="#8a8f98" font-family="monospace">G0/2</text>
<rect x="275" y="216" width="110" height="28" rx="5" fill="none" stroke="#8a8f98" stroke-width="2"></rect>
<text x="330" y="235" text-anchor="middle" font-size="12" fill="#8a8f98" font-family="monospace">SW-SRV</text>
<line x1="330" y1="244" x2="330" y2="258" stroke="#8a8f98" stroke-width="2"></line>
<rect x="145" y="256" width="370" height="40" rx="6" fill="none" stroke="#2778c4" stroke-width="2"></rect>
<text x="330" y="273" text-anchor="middle" font-size="12" fill="#2778c4" font-family="monospace" font-weight="bold">SERVIDORES · 192.168.30.0/24</text>
<text x="330" y="288" text-anchor="middle" font-size="10" fill="#8a8f98" font-family="monospace">SRV-PORTAL 192.168.30.10 · DNS + HTTP · portal.uniube.local</text>
</svg>
<figcaption class="au-legenda">Topologia do cenário: ADMINISTRAÇÃO e LABORATÓRIO ligadas pelo R-CAMPUS, e a rede de servidores logo abaixo dele. O R-CAMPUS, em destaque, já está correto nas três interfaces — e o SRV-PORTAL também, com DNS e HTTP no ar. O território de caça são os hosts e as pontas, não a infraestrutura.</figcaption>
</figure>

**Existem quatro defeitos.** Cada um é **um valor trocado** — nunca dois no mesmo lugar — e cada um produz um sintoma **diferente**. Nenhum é pegadinha: os quatro são conteúdo de Redes I.

---

<div class="au-pratica">
<b>Os quatro defeitos — 15 min, no projetor</b>

Eu abro o cenário no projetor e mostro **um sintoma por vez**. Para cada um, antes de eu revelar qualquer coisa:

1. **Nomeie a camada** — em voz alta, para quem senta do lado: *"isto é camada 1"*, *"isto é camada 3 local"*.
2. **Diga o que você verificaria primeiro** — qual comando, em qual máquina. O fluxo do bloco 2.1 é a ordem.
3. Só então eu abro a tela. Se você errou a camada, é aqui que se aprende — errar em voz alta hoje custa zero.
4. Corrigimos **um** defeito por vez e retestamos. Corrigir dois de uma vez e o ping voltar não diz qual dos dois era.

**O que já está certo, e não vale gastar tempo:** o **R-CAMPUS** está correto nas três interfaces; o **SRV-PORTAL** está correto, com DNS e HTTP no ar.

**As regras da caça — valem quando o cenário entrar, na próxima prática:**

| Regra | Detalhe |
| :--- | :--- |
| **Em dupla, falando alto** | Digam um ao outro o que vão testar **antes** de testar. Diagnóstico silencioso não se aprende. |
| **Não adicione nem remova equipamento** | Trocar cabo, se for o caso, pode. |

<p class="au-pronto"><b>Critério de pronto, quando o cenário entrar:</b> os quatro PCs <b>(1)</b> pingam <code>192.168.30.10</code> e <b>(2)</b> abrem <code>http://portal.uniube.local</code> <b>pelo nome</b>, no navegador — e o <code>Check Results</code> mostra <b>80% de acerto</b>. O cenário apura os valores corrigidos nos hosts <b>e</b> dois testes de conectividade de ponta a ponta; os testes existem justamente para impedir o "consertei o campo e não testei", e um deles só fecha se o acesso funcionar <b>pelo nome</b>, não pelo IP.</p>
</div>

> [!WARNING] ⚠️ Gotcha — o erro que faz a nota **cair**
> A tentação, ao achar um host que não alcança o gateway, é mudar o **gateway** para bater com o host. Às vezes o ping até anda depois disso — e você acabou de trocar um defeito por dois, porque escondeu a causa real.
>
> O cenário compara o seu resultado com a rede correta: **remendo derruba o seu percentual.** Se um valor parece errado, pergunte antes *"qual dos dois lados é que está errado?"*. Na dúvida, o errado é quase sempre o **host** — foi ele que alguém configurou às pressas, não a infraestrutura.

> [!TIP] ✅ Como o ponto deste laboratório é apurado
> **O Lab 0 vale 1 ponto da Atividade N1, e o ponto sai para quem fechar `80% de acerto`** — na tela, durante a aula em que o cenário entrar. Você sai da sala sabendo a sua nota; não existe "depois eu corrijo".
>
> São seis laboratórios valendo ponto no semestre (Lab 0 a Lab 5) e contam **os cinco melhores** — o sexto é a sua margem para um dia ruim.

### Terminou antes? A quebra deliberada

Nos laboratórios com cenário na máquina, quando a sua dupla fechar 100% antes do tempo, eu vou até ela, derrubo alguma coisa no roteador e digo só isto:

> *"Acabei de derrubar uma coisa. Você tem dois minutos para me dizer **qual** e **como descobriu**."*

Não é castigo por ser rápido: é o formato dos laboratórios a partir da S02, em que a quebra deliberada ocupa os últimos 20 minutos — **e o "como descobriu" vale mais do que o "qual".**

---

## 🧭 Revisão com a sala — de baixo para cima (7 min)

A revisão é **ao vivo, com a sala**. Eu não vou do mais fácil ao mais difícil: subo as camadas, porque é assim que se diagnostica. Esta página não adianta as respostas — se você chegar sabendo o que está quebrado, você não diagnosticou nada, só digitou.

Cada dupla vai responder, na sua vez, três perguntas sobre **um** dos defeitos que encontrou:

1. **Qual era o sintoma?** Não o que estava errado — o que o usuário teria reclamado.
2. **Qual teste te levou até ele, e o que esse teste eliminou?**
3. **Que camada era, e como você soube antes de abrir a configuração?**

Enquanto a sala responde, eu monto o quadro no projetor: uma linha por camada, do fio ao nome.

No fim, a coluna que interessa não é *"o que estava errado"*. É **"que semana deste semestre vai cobrar isso de você de novo"**.

Adianto só o eixo. Tudo o que você caçou hoje reaparece entre a **S03 e a S05** — quando cada VLAN virar uma sub-rede, e cada sub-rede precisar do seu próprio gateway.

**A frase que abre o semestre:** a pergunta de Redes II é sempre *"isso quebrou na camada 2 ou na 3?"* — e hoje você respondeu isso quatro vezes, antes de a disciplina começar.

> [!TIP] 💡 Dica de produção
> Repare no formato das três perguntas: **sintoma → teste → camada**, nunca "qual era o erro". É o mesmo roteiro de um *post-mortem* de incidente em produção, e pela mesma razão: a equipe que só registra a correção repete a falha, porque não guardou o caminho. O que se documenta é o raciocínio, não o conserto.

> [!NOTE] 📌 P11, isto aqui é o seu adiantamento
> A aula de terça (28/07) é o contrato completo — cronograma, notas, regras de sala, política de IA. Ela está publicada no [Plano de Ensino e Contrato](./Plano-de-Ensino-e-Contrato), então nada depende de você estar lá. **P11: você viu a prática antes da teoria**, então leve o essencial hoje: laboratório vale ponto na hora (80% de acerto), toda prática tem quebra deliberada a partir da semana 2, toda aula abre com perguntas sobre o que já foi visto e fecha com bilhete de saída. **Datas de prova: N1 em 22/09 · N2 em 01/12** — confirmo no AVA se mudarem.
> **P12:** se você já teve a teórica, aqui é só a confirmação de que a prática cumpre o combinado.

---

<div class="au-slot">
<div class="au-slot-h"><b>Interativo</b> · Bilhete de saída · 3 min</div>
<div class="au-slot-c">

**Bilhete de saída.** Meia folha de papel, recolhida na porta — sem nome. Duas perguntas, sem nota:

1. *Qual assunto de Redes I você sente que mais esqueceu?*
2. *Qual foi o ponto mais confuso da aula de hoje?*

O que você responder aqui **abre a aula da semana que vem** — os assuntos mais citados viram as primeiras perguntas da próxima aula.

</div>
<p class="au-slot-b"><b>Quando o bilhete passar para o <a href="https://vevox.app/">Vevox</a></b>, o código de acesso vai para o projetor e o aviso aparece aqui — anônimo do mesmo jeito. O bilhete nunca é cortado: ele é a entrada da próxima aula.</p>
</div>

---

<div class="au-resumo">
<b>Resumo da aula</b>

| Item | O que você precisa lembrar |
| :--- | :--- |
| **O método** | Link → ping local → ping externo → resolução de nome. Uma camada por vez, e só sobe quando a de baixo está provada. |
| **O teste que divide o problema em dois** | Ping para alguém da **própria sub-rede**. Funcionou? O defeito está na saída. Falhou? Está antes dela. |
| **Camada 1 — a pergunta** | Tem enlace, e o meio é o certo para este par de portas? **Ter cabo ≠ ter rede.** |
| **Camada 3 — a pergunta local** | IP e máscara: você está na sub-rede em que deveria estar? A máscara define a fronteira sozinha. |
| **Camada 3 — a pergunta de saída** | O gateway pertence à **sua** sub-rede? Se não, você não sai. |
| **Camada 7 — a pergunta** | Pinga por IP e o nome não resolve? Então quebrou o DNS, não a rede. |
| **O que "pinga o gateway" prova** | O caminho *até o gateway*, e que a sua máscara o inclui. Só isso — não é atestado de saúde da rede. |
| **O que "o ping passou" prova** | Que passou. **Não** por onde: rota indireta e ICMP redirect fazem rede torta parecer rede boa. |
| **Ler ping no Packet Tracer** | O 1º pacote costuma cair por ARP. Julgue pelas 4 linhas e pela estatística, nunca pela primeira. |
| **Critério de pronto do lab** | Os 4 PCs pingam `192.168.30.10` **e** abrem `http://portal.uniube.local` **pelo nome**. |
| **Nota do Lab 0** | 1 pt da Atividade N1, por `80% de acerto` (8 de 10 itens), na tela, em sala — na prática em que o cenário entrar. |
| **Regra de ouro do remendo** | Mudar a infraestrutura para caber no host errado **derruba** o seu percentual. |
| **Um defeito por vez** | Corrigir dois e o ping voltar não diz qual dos dois era. |
| **Pendência** | Conta NetAcad + Packet Tracer instalados **antes da S02** — não há bloco de setup na próxima. |
| **Ferramenta do semestre** | Packet Tracer 8.2+, salvo em pasta local (nunca em pasta sincronizada com nuvem). |

</div>

<div class="au-podcast">
<p><b>🎧 Revisão em áudio (~10 min)</b> — gerada por IA a partir desta página, para ouvir no trajeto. O áudio complementa; a página é a fonte.</p>
<p><i>Disponível em breve.</i></p>
</div>

<div class="au-reflexao">
<b>Para pensar até a próxima aula</b>

<p>Diagnosticar por comparação é barato: você acha a máquina que funciona, põe as duas telas lado a lado e o defeito salta. Metade das duplas de hoje vai ter feito exatamente isso, e está certo.</p>

<p>Mas numa rede corporativa as estações não nascem uma a uma — nascem de uma <b>imagem</b>, de um template, de um perfil distribuído do servidor. Quando o erro está na origem, ele chega idêntico em todo o parque.</p>

<p><b>Quando todo mundo está errado do mesmo jeito, contra o que você compara?</b> E que documento precisaria existir na empresa para que essa pergunta tivesse resposta?</p>
</div>

<div class="au-refs">
<b>Referências desta aula</b>

**Bibliografia da disciplina** — biblioteca virtual da Uniube:

- KUROSE, J. F.; ROSS, K. W. **Redes de computadores e a internet: uma abordagem top-down.** 8. ed. São Paulo: Pearson, 2021. <span class="au-pag">cap. 1, seç. 1.5 — arquitetura em camadas; cap. 6, seç. 6.1 e 6.4 — camada de enlace e LANs comutadas</span>
- TANENBAUM, A. S.; FEAMSTER, N.; WETHERALL, D. J. **Redes de Computadores.** 6. ed. São Paulo: Pearson, 2021. <span class="au-pag">cap. 1, seç. 1.4 — modelos de referência; cap. 4, seç. 4.8 — comutação na camada de enlace</span>
- CISCO NETWORKING ACADEMY. **CCNA: Switching, Routing, and Wireless Essentials (SRWE).** Cisco Systems, 2026. Disponível em: https://www.netacad.com/. <span class="au-pag">módulo 1 — configuração básica e verificação de conectividade</span>

**De onde vem o formato desta aula:**

- SWELLER, J.; AYRES, P.; KALYUGA, S. **Cognitive Load Theory.** New York: Springer, 2011. <span class="au-pag">cap. 8 — The worked example effect</span>
- KALYUGA, S.; AYRES, P.; CHANDLER, P.; SWELLER, J. The expertise reversal effect. **Educational Psychologist**, v. 38, n. 1, 2003. <span class="au-pag">p. 23–31</span>
- BEYER, B.; JONES, C.; PETOFF, J.; MURPHY, N. R. (org.). **Site Reliability Engineering: How Google Runs Production Systems.** Sebastopol: O'Reilly, 2016. <span class="au-pag">cap. 12 — Effective Troubleshooting</span>. Disponível gratuitamente em: https://sre.google/sre-book/effective-troubleshooting/

**Leitura de aprofundamento (15 min, em inglês):** o capítulo 12 do SRE Book descreve como engenheiros do Google diagnosticam sistemas em produção, e a estrutura é exatamente a que você usou hoje, num contexto muito maior: **triagem** (qual é o tamanho do incêndio?), **exame**, **diagnóstico** e só então **cura**. Insiste em dois pontos que valem para a sua carreira inteira: diagnóstico eficaz depende de **dividir o espaço de busca pela metade a cada teste** — literalmente o que o ping local faz no fluxo desta aula — e de **resistir à tentação de aplicar a correção antes de entender a causa**, porque remendo esconde a evidência e obriga a começar de novo na próxima ocorrência.

</div>

<div class="au-proxima">
<b>Na próxima aula</b>

<p>Hoje você consertou a rede sem nunca perguntar <b>como o switch decide para onde mandar cada quadro</b> — e não precisou, porque ele acertou sozinho. Na próxima prática você vai abrir a tabela MAC e ver que essa decisão é aprendida, não configurada. E vai descobrir o que o switch faz quando <i>não</i> sabe.</p>
</div>

---

*Última atualização: 27/07/2026 · Sujeito à confirmação institucional (ver aviso na aula teórica).*

**◀ [Voltar ao índice da disciplina](./)**

</div>
