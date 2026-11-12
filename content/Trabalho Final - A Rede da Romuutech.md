---
title: "Trabalho Final de Redes 2 — A rede da Romuutech"
publicar: true
anatomia: nao
tags: [redes2, {{PERIODO}}, trabalho-final, packet-tracer]
---

# 🏢 Trabalho Final de Redes 2 — A rede da Romuutech

**Disciplina:** {{CODIGO}} — Redes de Computadores II — Uniube<br>
**Professor:** Romualdo Mathias Filho · **romualdo.filho@uniube.br**<br>
**Período:** {{PERIODO}}

## Em 30 segundos

| Item | Resumo |
|---|---|
| **O que é** | Montar no Packet Tracer a rede da Romuutech, com matriz e filial, ligada à internet e com regras de segurança. |
| **Vale** | 20 pontos, todos pelo que o grupo entrega. A prova vale outros 20 e é em 24/11. |
| **Grupo** | Até **3 pessoas**, todas da **mesma turma prática** (P11 ou P12). |
| **Entrega** | No **AVA**, em **Estudos Autônomos**, até **sábado, 28/11, às 23h59**. Um integrante envia pelo grupo. Não há apresentação: a nota sai só do que foi enviado. |
| **O que enviar** | 3 arquivos: o `.pkt`, o memorial técnico em PDF (texto explicando as decisões e prints dos testes) e um `.zip` com a configuração de cada equipamento. Os nomes estão na seção 5. |

---

## 1. A história

A **Romuutech** vende equipamentos de rede. É a empresa que mais entende de rede na cidade, segundo a própria Romuutech. O problema é que a rede dela é um único switch, com tudo na VLAN 1, que o estagiário chama de "arquitetura minimalista".

Agora a Romuutech tem uma **matriz** e uma **filial**, e o diretor quer três coisas:

- que as duas conversem entre si, porque hoje a filial manda planilha para a matriz em pen drive, de moto;
- que todo mundo tenha internet;
- que os visitantes usem a internet para ver vídeo de gato, mas **nunca** a planilha de salários do RH.

O seu grupo foi contratado para isso. Pelo contrato, se a rede cair quando o professor testar, a culpa é do cabo. O cabo, claro, foi o grupo que ligou.

Cada grupo recebe um **bloco de endereços** e um **perfil** diferentes. Por isso a rede de um grupo não serve para outro, e copiar do vizinho só dá trabalho dobrado.

### O desenho da rede

```
                         [ ISP ] ── [ Servidor da internet 198.51.100.10 ]
                            │  203.0.113.0/29
                       [ R-BORDA ]
                        /        \
             [ R-MATRIZ ] ──────── [ R-FILIAL ]
                  │                      │
               [SW-M1] ══ [SW-M2]     [SW-F1]
```

- **4 roteadores 2911:** R-MATRIZ, R-FILIAL e R-BORDA formam um triângulo. O ISP é o provedor de internet.
- **3 switches 2960:** SW-M1 e SW-M2 na matriz, SW-F1 na filial.
- **Máquinas:** pelo menos **1 PC em cada VLAN** e **1 servidor web** na VLAN SERVIDORES.
- **O provedor (ISP)** só conhece os endereços dele. Ele **não sabe** nada das redes `10.x` da empresa.

### As 7 VLANs

| VLAN | Nome | Onde fica |
|---|---|---|
| 10 | ADM | matriz, SW-M1 |
| 20 | VENDAS | matriz, SW-M1 |
| 30 | TI | matriz, SW-M2 |
| 40 | VISITANTES | matriz, SW-M1 |
| 50 | SERVIDORES | matriz, SW-M2 |
| 60 | FILIAL-OPER | filial, SW-F1 |
| 70 | FILIAL-VIS | filial, SW-F1 |

### O bloco e o perfil do seu grupo

O professor sorteia o número do grupo.

| Grupo | Bloco | Perfil | | Grupo | Bloco | Perfil |
|---|---|---|---|---|---|---|
| 1 | 10.10.0.0/23 | A | | 8 | 10.80.0.0/23 | B |
| 2 | 10.20.0.0/23 | B | | 9 | 10.90.0.0/23 | C |
| 3 | 10.30.0.0/23 | C | | 10 | 10.100.0.0/23 | A |
| 4 | 10.40.0.0/23 | A | | 11 | 10.110.0.0/23 | B |
| 5 | 10.50.0.0/23 | B | | 12 | 10.120.0.0/23 | C |
| 6 | 10.60.0.0/23 | C | | 13 | 10.130.0.0/23 | A |
| 7 | 10.70.0.0/23 | A | | 14 | 10.140.0.0/23 | B |

Quantos endereços cada VLAN precisa, **já contando o gateway**:

| VLAN | Perfil A | Perfil B | Perfil C |
|---|---|---|---|
| ADM | 50 | 100 | 60 |
| VENDAS | 100 | 70 | 60 |
| TI | 20 | 12 | 25 |
| VISITANTES | 50 | 40 | 110 |
| SERVIDORES | 10 | 6 | 12 |
| FILIAL-OPER | 60 | 45 | 90 |
| FILIAL-VIS | 25 | 20 | 14 |

Além das VLANs, o bloco também precisa dos **3 links** entre os roteadores do triângulo.

> [!WARNING] ⚠️ Cuidado — sub-redes do mesmo tamanho não cabem
> O /23 tem 512 endereços. Se todas as sub-redes tiverem o tamanho da maior, o bloco não basta. Dê a cada VLAN o **menor tamanho que atende**, começando pela maior. Isso se chama VLSM (*Variable Length Subnet Mask*, máscara de tamanho variável).

### Endereços que são iguais para todos

| Ligação | Rede | Quem usa o quê |
|---|---|---|
| R-BORDA ↔ ISP | 203.0.113.0/29 | ISP `.1` · R-BORDA `.2` · `.3` a `.6` livres |
| ISP ↔ servidor da internet | 198.51.100.0/24 | ISP `.1` · servidor `.10` |

**Regra:** o gateway de cada VLAN é o **primeiro endereço utilizável** da sub-rede.

---

## 2. O que a rede precisa fazer

### Obrigatório (todos os grupos)

1. **Endereços:** todas as sub-redes cabem no bloco, sem uma invadir a outra.
2. **VLANs:** cada switch tem as VLANs que passam por ele, e cada porta está na VLAN certa.
3. **Trunk 802.1Q:** entre SW-M1 e SW-M2, de SW-M1 para R-MATRIZ e de SW-F1 para R-FILIAL.
4. **Roteamento entre VLANs (router-on-a-stick):** subinterfaces em R-MATRIZ (VLANs 10 a 50) e em R-FILIAL (VLANs 60 e 70).
5. **OSPF área 0** entre os três roteadores do triângulo. R-BORDA tem uma rota padrão para o ISP e a repassa aos outros pelo OSPF. *Material novo, que nenhuma aula mostrou:*
   ```
   ip route 0.0.0.0 0.0.0.0 203.0.113.1
   router ospf 1
    default-information originate
   ```
   A primeira linha diz "o que eu não conheço, mando para o ISP". A última faz o R-BORDA avisar os outros roteadores de que ele é a saída.
6. **PAT em R-BORDA:** toda a empresa sai para a internet pelo endereço `203.0.113.2`.
7. **ACL dos visitantes:** VISITANTES e FILIAL-VIS navegam na internet, mas **não alcançam nenhuma rede interna**.
8. **Port security** nas portas de ADM e VISITANTES: 1 endereço MAC por porta, aprendido com `sticky`, e violação em modo `restrict`. Antes de salvar, façam cada PC dessas portas pingar o gateway: é esse tráfego que grava o MAC no `running-config`.

### Desafios (para a nota máxima)

Cada desafio feito **e explicado no memorial** vale 0,75 ponto, inteiro ou nada. Fizeram mais de 4? Contam só 4, até 3 pontos. Os desafios 2, 3 e 5 usam comandos que não tiveram aula: pesquisar faz parte do desafio.

1. **VLSM mínimo:** mostrar que nenhuma sub-rede poderia ser menor e quanto do bloco sobrou.
2. **Root bridge:** pôr um segundo cabo entre SW-M1 e SW-M2, mostrar qual porta o STP bloqueou e fazer o SW-M1 ser o root bridge de todas as VLANs da matriz.
3. **Custo OSPF:** a linha R-MATRIZ ↔ R-FILIAL passa a ser de 10 Mb/s (`bandwidth 10000` nas duas pontas). Mostrem que o OSPF passa a ir pela borda e expliquem a conta. Depois usem `ip ospf cost` para a linha direta voltar a ser a escolhida, e provem com `tracert`.
4. **NAT estático:** publicar o servidor web interno pelo endereço `203.0.113.3`. O servidor da internet precisa abrir a página.
5. **Gerência só pela TI:** só a VLAN TI acessa os roteadores remotamente. *É material novo: veja o fim do checklist.*
6. **DHCP protegido:** R-FILIAL entrega endereço à FILIAL-VIS por DHCP, e o SW-F1 tem DHCP snooping, com só o trunk como porta confiável.

---

## 3. Checklist do estudo autônomo

Sigam na ordem. Só passem para a etapa seguinte quando o **ponto de parada** funcionar.

### ☐ Etapa 1 — Endereços, no papel

- [ ] Recebemos o número do grupo, o bloco e o perfil.
- [ ] Montamos a tabela de sub-redes, da maior VLAN para a menor.
- [ ] Reservamos os 3 links entre os roteadores.
- [ ] **Ponto de parada:** tudo cabe no /23 e nenhuma sub-rede se sobrepõe a outra.

> 💡 **Teste rápido:** uma VLAN precisa de 50 endereços. Qual é o menor prefixo que atende? *(Travou? Revejam as aulas de sub-redes e VLSM.)*

### ☐ Etapa 2 — A matriz e a filial por dentro

- [ ] Colocamos os equipamentos e os cabos do desenho.
- [ ] Criamos as VLANs e pusemos cada porta na sua.
- [ ] Configuramos os trunks.
- [ ] Criamos as subinterfaces nos roteadores.
- [ ] **Ponto de parada:** os testes 1, 2 e 11 passam, e na filial um PC de FILIAL-OPER pinga um de FILIAL-VIS.

> 💡 **Teste rápido:** o PC pinga outro PC da mesma VLAN, mas não o gateway. Falta a VLAN na porta, a VLAN no trunk ou a subinterface? *(Revejam as aulas de VLAN, trunk e roteamento entre VLANs.)*

### ☐ Etapa 3 — Tudo ligado e na internet

- [ ] Configuramos o OSPF nos três roteadores do triângulo.
- [ ] Pusemos a rota padrão em R-BORDA e o `default-information originate`.
- [ ] Configuramos o PAT.
- [ ] **Ponto de parada:** os testes 3, 4, 5 e 6 passam.

> 💡 **Teste rápido:** a filial chega à matriz, mas não à internet. O que vocês conferem primeiro em R-BORDA? *(Revejam a rota padrão do requisito 5, a Aula 13, de OSPF, e a Aula 14, de NAT e PAT.)*

### ☐ Etapa 4 — Segurança

- [ ] Aplicamos a ACL dos visitantes, testando uma regra de cada vez.
- [ ] Configuramos o port security.
- [ ] **Ponto de parada:** os 12 testes da seção 4 passam.

> 💡 **Teste rápido:** depois da ACL, nada passa, nem a internet dos visitantes. O que costuma faltar no fim de uma ACL? *(Revejam as Aulas 15 e 16.)*

### ☐ Etapa 5 — Desafios (opcional)

- [ ] Escolhemos os desafios e fizemos pelo menos um.
- [ ] Os 12 testes continuam passando depois dos desafios.

**Material novo para o desafio 5 (gerência só pela TI).** Uma ACL **padrão** que permite só a rede da TI, aplicada nas linhas de acesso remoto do roteador:

```
access-list 10 permit <rede da TI> <wildcard da TI>
line vty 0 4
 access-class 10 in
```

Configurem uma senha de acesso remoto e testem `telnet` de um PC da TI (deve entrar) e de um PC de VENDAS (deve ser recusado). No memorial, expliquem por que o comando é `access-class`, e não `ip access-group`.

### ☐ Etapa 6 — Memorial técnico (PDF, de 2 a 3 páginas de texto; prints e tabelas não contam no limite)

- [ ] Desenho da topologia.
- [ ] Tabela de endereços e tabela de VLANs, **iguais à rede entregue**.
- [ ] Por que cada decisão foi tomada ("por que /26 aqui", "por que a ACL está nesta interface e neste sentido").
- [ ] Os 12 testes com o resultado esperado e **um print de cada um**, mostrando o comando e a resposta.
- [ ] Quem configurou o quê.
- [ ] Declaração de uso de IA, em 3 linhas: se usou, em quê e o que vocês conferiram por conta própria.

### ☐ Etapa 7 — Entrega no AVA

- [ ] Abrimos o Trabalho Final em **Estudos Autônomos**, no AVA.
- [ ] Salvamos a configuração de cada roteador e switch (`show running-config`) num `.txt` com o nome do equipamento, por exemplo `R-BORDA.txt`, e juntamos os 7 num `.zip`.
- [ ] Demos aos 3 arquivos os nomes da seção 5.
- [ ] Um integrante enviou os 3 arquivos, com o nome de todos no memorial.
- [ ] Enviado até **sábado, 28/11, às 23h59**.
- [ ] Os 3 arquivos aparecem na tela de envio do AVA.

---

## 4. Como a nota é dada (20 pontos)

| Parte | Pontos | Como se mede |
|---|---|---|
| **A rede funciona** | 9,0 | o professor roda os 12 testes abaixo no seu `.pkt`, 0,75 cada |
| **Decisões explicadas** | 6,0 | 3,0 pelas justificativas dos 8 requisitos obrigatórios e até 3,0 pelos desafios |
| **Memorial e arquivos** | 5,0 | 2,0 pelas tabelas, 2,0 pelos prints dos 12 testes e 1,0 pelos `.txt` de configuração, tudo igual à rede entregue |

Todos os integrantes do grupo recebem a mesma nota.

### Os 12 testes

| # | Teste | Tem que dar |
|---|---|---|
| 1 | PC de VENDAS pinga o próprio gateway | responde |
| 2 | PC de VENDAS pinga um PC de ADM | responde |
| 3 | PC de ADM pinga um PC de FILIAL-OPER | responde |
| 4 | `show ip ospf neighbor` em R-MATRIZ | 2 vizinhos em FULL |
| 5 | PC de VENDAS pinga `198.51.100.10` | responde |
| 6 | `show ip nat translations` em R-BORDA logo depois do teste 5 | aparece a tradução |
| 7 | PC de VISITANTES abre `http://198.51.100.10` | a página abre |
| 8 | PC de VISITANTES pinga um PC de ADM | **não** responde |
| 9 | PC de FILIAL-VIS pinga o servidor web | **não** responde |
| 10 | PC de TI abre a página do servidor web | a página abre |
| 11 | `show vlan brief` e `show interfaces trunk` em SW-M1 | igual ao memorial |
| 12 | Um PC novo, ligado no lugar de outro numa porta de ADM, pinga o gateway | o contador de violações sobe em `show port-security interface` |

> ⚠️ **Cuidado:** o professor testa o arquivo que vocês enviaram, sem ninguém do grupo por perto. Se um teste só funciona "depois de dar um `no shutdown` ali", ele não funciona.

---

## 5. Como entregar e como nomear os arquivos

### Os nomes

Troque `<turma>` por P11 ou P12 e `<grupo>` pelo número do grupo, sempre com dois dígitos (03, não 3).

| Arquivo | Nome | Exemplo |
|---|---|---|
| Rede do Packet Tracer | `R2-<turma>-G<grupo>.pkt` | `R2-P11-G03.pkt` |
| Memorial técnico | `R2-<turma>-G<grupo>-memorial.pdf` | `R2-P11-G03-memorial.pdf` |
| Configurações | `R2-<turma>-G<grupo>-configs.zip` | `R2-P11-G03-configs.zip` |

Dentro do `.zip` vão 7 arquivos, um por equipamento: `R-MATRIZ.txt`, `R-FILIAL.txt`, `R-BORDA.txt`, `ISP.txt`, `SW-M1.txt`, `SW-M2.txt` e `SW-F1.txt`.

> ⚠️ **Cuidado:** arquivo com nome fora do padrão pode se perder entre os outros grupos. `trabalho_final_AGORA_VAI_v3.pkt` não é um nome.

### Como pegar a configuração de um equipamento

1. No Packet Tracer, clique no equipamento e abra a aba **CLI**.
2. Digite `enable` e depois `show running-config`.
3. Aperte a barra de espaço até o fim da listagem.
4. Selecione o texto, copie e cole num arquivo `.txt` com o nome do equipamento.

### Como enviar no AVA

1. Entre no AVA com o seu login da Uniube e abra a disciplina Redes de Computadores 2.
2. Abra **Estudos Autônomos** e, dentro dele, o Trabalho Final.
3. **Um integrante** anexa os 3 arquivos e envia, até **sábado, 28/11, às 23h59**.
4. Confira se os 3 arquivos aparecem na tela de envio. O AVA não manda lembrete, e o professor também não.

---

