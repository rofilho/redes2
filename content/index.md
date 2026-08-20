---
title: "🌐 Redes de Computadores II"
---

<style>
/* Índice em modo vitrine: o hero JÁ é o título, então o .article-title do
   Quartz duplicaria; e "modificado em" não diz nada numa capa de disciplina.
   O <style> mora dentro do <article>, que o Quartz troca inteiro ao navegar
   (enableSPA) — por isso a regra não escapa para as páginas de aula. */
.article-title,
.content-meta {
  display: none;
}
</style>

<div class="au-vitrine">

<div class="au-hero">
  <span class="au-badge">49309 · 2026-2</span>
  <h1>Redes de Computadores II</h1>
  <p>Redes I ensinou a rede a funcionar. Aqui ela aprende a <b>não cair</b> — e a não deixar o problema de um setor derrubar os outros. Comutar, segmentar, rotear e proteger, com as mãos no simulador toda semana.</p>
  <p style="margin-top:1rem"><a href="./Plano-de-Ensino-e-Contrato" data-spa><span class="au-badge" style="letter-spacing:.08em">📘 Plano de Ensino e Contrato — a referência do semestre</span></a>
  <a href="./Manual-do-IOS-no-Packet-Tracer" data-spa><span class="au-badge" style="letter-spacing:.08em">🖥️ Manual do IOS no Packet Tracer — o console e a lista de comandos</span></a></p>
</div>

<div style="display:flex;flex-wrap:wrap;gap:.5rem;padding:1rem 1.5rem 0">
  <span class="au-chip on">Prova N1 · 22/09</span>
  <span class="au-chip on">Prova N2 · 01/12</span>
  <span class="au-chip">Aprovação ≥ 60 pts e frequência ≥ 75%</span>
  <span class="au-chip">Lab vale ponto: Lab 0 a 5</span>
</div>

<h2 style="font-family:var(--au-display);font-size:var(--au-t-2);font-weight:700;letter-spacing:-.02em;margin:1.5rem 1.5rem .25rem;border:none;padding:0;color:var(--au-tx)">Bloco 1 — Comutar e segmentar <span style="color:var(--au-tx3);font-weight:400">· S01–S08</span></h2>

<ul class="au-cards au-vb1">

<li class="au-card">
  <a href="./Aula-01---Plano-de-Ensino-e-Contrato-da-Disciplina" data-spa>
    <div class="au-thumb">S01</div>
    <div class="au-pbar"><i style="width:100%"></i></div>
    <div class="au-cap"><b>Apresentação, Diagnóstico e Contrato</b><span>Teórica · 28/07</span></div>
  </a>
</li>

<li class="au-card">
  <a href="./Aula-01---Lab-0-Resgate-(Pratica)" data-spa>
    <div class="au-thumb">S01</div>
    <div class="au-pbar"><i style="width:100%"></i></div>
    <div class="au-cap"><b>Lab 0 — Resgate: o método de diagnóstico</b><span>Prática · P11 27/07 · P12 30/07</span></div>
  </a>
</li>

<li class="au-card">
  <a href="./Aula-02---Comutacao-(Teorica)" data-spa>
    <div class="au-thumb">S02</div>
    <div class="au-pbar"><i style="width:100%"></i></div>
    <div class="au-cap"><b>Comutação: do endereço MAC à tabela do switch</b><span>Teórica · 11/08</span></div>
  </a>
</li>

<li class="au-card">
  <a href="./Aula-03---Lab-1-Switching-Basico-(Pratica)" data-spa>
    <div class="au-thumb">S03</div>
    <div class="au-pbar"><i style="width:100%"></i></div>
    <div class="au-cap"><b>Lab 1 — Switching básico: ver o switch aprender</b><span>Prática · P12 13/08 · P11 17/08</span></div>
  </a>
</li>

<li class="au-card">
  <a href="./Aula-04---VLANs-(Teorica)" data-spa>
    <div class="au-thumb">S04</div>
    <div class="au-pbar"><i style="width:100%"></i></div>
    <div class="au-cap"><b>VLANs: a fronteira que se digita em vez de se comprar</b><span>Teórica · 18/08</span></div>
  </a>
</li>

<li class="au-card">
  <a href="./Aula-04---Lab-2-VLANs-(Pratica)" data-spa>
    <div class="au-thumb">S04</div>
    <div class="au-pbar"><i style="width:100%"></i></div>
    <div class="au-cap"><b>Lab 2 — VLANs: medir a fronteira que terça levantou</b><span>Prática · P12 20/08 · P11 24/08</span></div>
  </a>
</li>

<li class="au-card au-espera">
  <div class="au-thumb">S05</div>
  <div class="au-pbar"><i style="width:0"></i></div>
  <div class="au-cap"><b>Trunking 802.1Q</b><span>25/08 · Lab 3</span></div>
</li>

<li class="au-card au-espera">
  <div class="au-thumb">S06</div>
  <div class="au-pbar"><i style="width:0"></i></div>
  <div class="au-cap"><b>Roteamento entre VLANs (router-on-a-stick)</b><span>01/09 · Lab 4</span></div>
</li>

<li class="au-card au-espera">
  <div class="au-thumb">S07</div>
  <div class="au-pbar"><i style="width:0"></i></div>
  <div class="au-cap"><b>STP: por que um loop de camada 2 derruba a rede</b><span>08/09</span></div>
</li>

<li class="au-card au-espera">
  <div class="au-thumb">S08</div>
  <div class="au-pbar"><i style="width:0"></i></div>
  <div class="au-cap"><b>DHCPv4, SLAAC/DHCPv6 e revisão N1</b><span>15/09 · Lab 5</span></div>
</li>

<li class="au-card au-espera">
  <div class="au-thumb">—</div>
  <div class="au-pbar"><i style="width:0"></i></div>
  <div class="au-cap"><b>EtherChannel e redundância de gateway</b><span>data no AVA</span></div>
</li>

</ul>

<h2 style="font-family:var(--au-display);font-size:var(--au-t-2);font-weight:700;letter-spacing:-.02em;margin:1.5rem 1.5rem .25rem;border:none;padding:0;color:var(--au-tx)">Avaliação N1 <span style="color:var(--au-tx3);font-weight:400">· S09–S10</span></h2>

<ul class="au-cards au-vav">

<li class="au-card au-espera" style="border-color:var(--au-par-laranja)">
  <div class="au-thumb" style="color:var(--au-par-laranja)">S09</div>
  <div class="au-pbar"><i style="width:0"></i></div>
  <div class="au-cap"><b>Prova N1 — duas etapas</b><span>22/09 · individual + grupo</span></div>
</li>

<li class="au-card au-espera">
  <div class="au-thumb">S10</div>
  <div class="au-pbar"><i style="width:0"></i></div>
  <div class="au-cap"><b>Vista da N1 — devolutiva por erro</b><span>29/09</span></div>
</li>

</ul>

<h2 style="font-family:var(--au-display);font-size:var(--au-t-2);font-weight:700;letter-spacing:-.02em;margin:1.5rem 1.5rem .25rem;border:none;padding:0;color:var(--au-tx)">Bloco 2 — Rotear e proteger <span style="color:var(--au-tx3);font-weight:400">· S11–S17</span></h2>

<ul class="au-cards au-vb2">

<li class="au-card au-espera">
  <div class="au-thumb">S11</div>
  <div class="au-pbar"><i style="width:0"></i></div>
  <div class="au-cap"><b>Roteamento dinâmico e OSPF: introdução</b><span>06/10 · Lab 6</span></div>
</li>

<li class="au-card au-espera">
  <div class="au-thumb">S13</div>
  <div class="au-pbar"><i style="width:0"></i></div>
  <div class="au-cap"><b>OSPF: custo, DR/BDR e verificação</b><span>20/10 · Lab 7</span></div>
</li>

<li class="au-card au-espera">
  <div class="au-thumb">S14</div>
  <div class="au-pbar"><i style="width:0"></i></div>
  <div class="au-cap"><b>NAT estático, dinâmico e PAT</b><span>27/10 · Lab 8</span></div>
</li>

<li class="au-card au-espera">
  <div class="au-thumb">S15</div>
  <div class="au-pbar"><i style="width:0"></i></div>
  <div class="au-cap"><b>ACLs padrão: lógica, wildcard e posicionamento</b><span>03/11</span></div>
</li>

<li class="au-card au-espera">
  <div class="au-thumb">S16</div>
  <div class="au-pbar"><i style="width:0"></i></div>
  <div class="au-cap"><b>ACLs estendidas e segurança de camada 2</b><span>10/11 · Lab 9</span></div>
</li>

<li class="au-card au-espera">
  <div class="au-thumb">S17</div>
  <div class="au-pbar"><i style="width:0"></i></div>
  <div class="au-cap"><b>WLAN: 802.11, WPA2/WPA3 e configuração</b><span>17/11 · Lab 10</span></div>
</li>

</ul>

<h2 style="font-family:var(--au-display);font-size:var(--au-t-2);font-weight:700;letter-spacing:-.02em;margin:1.5rem 1.5rem .25rem;border:none;padding:0;color:var(--au-tx)">Fechamento <span style="color:var(--au-tx3);font-weight:400">· S18–S20</span></h2>

<ul class="au-cards au-vfim">

<li class="au-card au-espera" style="border-color:var(--au-par-verde)">
  <div class="au-thumb" style="color:var(--au-par-verde)">S18</div>
  <div class="au-pbar"><i style="width:0"></i></div>
  <div class="au-cap"><b>Projeto integrador e defesas orais</b><span>24/11 · dupla + individual</span></div>
</li>

<li class="au-card au-espera" style="border-color:var(--au-par-laranja)">
  <div class="au-thumb" style="color:var(--au-par-laranja)">S19</div>
  <div class="au-pbar"><i style="width:0"></i></div>
  <div class="au-cap"><b>Prova N2 — duas etapas</b><span>01/12 · individual + grupo</span></div>
</li>

<li class="au-card au-espera">
  <div class="au-thumb">S20</div>
  <div class="au-pbar"><i style="width:0"></i></div>
  <div class="au-cap"><b>Vista da N2 e fechamento</b><span>08/12</span></div>
</li>

</ul>

<div class="au-antes" style="margin:0 1.5rem 1.5rem;max-width:none">
  <p style="margin:0 0 .5rem"><b>Como ler este portal.</b> Cada semana ganha uma página quando a aula acontece — o card acende no dia. As três turmas dividem a teórica de terça (VIA203) e praticam separadas: <b>P11</b> na segunda (VIA215), <b>P12</b> na quinta (VIA216).</p>
  <p style="margin:0"><b>Laboratório novo só cai em semana em que as duas práticas se encontram.</b> É o que impede que os feriados de segunda deixem a P11 atrás — o cronograma completo, com feriados e datas das três turmas, está no <a href="./Plano-de-Ensino-e-Contrato" data-spa>Plano de Ensino e Contrato</a>.</p>
</div>

<div style="padding:0 1.5rem 1.5rem;font-family:var(--au-mono);font-size:var(--au-t--2);color:var(--au-tx3)">
  Prof. Romualdo Mathias Filho · Uniube · atualizado em 17/08/2026
</div>

</div>
