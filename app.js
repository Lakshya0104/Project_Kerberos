/* PROJECT KERBEROS — Round 3 Future Card · app logic */

const STORE_KEY = 'kerberos_r3_assignments_v1';

const $  = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

let assignments = load();   // { teamName: {psId, cardCode, cardName, ts} }
let currentPS = null;
let dealing = false;

function load(){
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch(e){ return {}; }
}
function save(){
  try { localStorage.setItem(STORE_KEY, JSON.stringify(assignments)); }
  catch(e){ toast('WARNING: could not persist — storage unavailable'); }
}
const psById = (id) => PROBLEMS.find(p => p.id === id);

// The artifact sandbox blocks window.confirm(), so confirmation is in-page.
function ask(message, okLabel){
  return new Promise(resolve => {
    const el = document.createElement('div');
    el.className = 'askbox open';
    el.innerHTML = `
      <div class="ask-panel">
        <p class="ask-msg"></p>
        <div class="ask-row">
          <button class="btn ghost" data-a="no">Cancel</button>
          <button class="btn" data-a="yes"></button>
        </div>
      </div>`;
    el.querySelector('.ask-msg').textContent = message;
    el.querySelector('[data-a="yes"]').textContent = okLabel || 'Confirm';
    document.body.appendChild(el);

    const done = (v) => { el.remove(); document.removeEventListener('keydown', onKey); resolve(v); };
    const onKey = (e) => { if (e.key === 'Escape') done(false); };
    el.querySelector('[data-a="no"]').addEventListener('click', () => done(false));
    el.querySelector('[data-a="yes"]').addEventListener('click', () => done(true));
    el.addEventListener('click', (e) => { if (e.target === el) done(false); });
    document.addEventListener('keydown', onKey);
    el.querySelector('[data-a="yes"]').focus();
  });
}

function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------------- HOME ---------------- */
function renderHome(){
  const host = $('#domains');
  host.innerHTML = DOMAINS.map(d => {
    const list = PROBLEMS.filter(p => p.domain === d.id);
    return `
      <section class="dom">
        <div class="dom-head">
          <div class="dom-num">${d.num}</div>
          <div>
            <h3>${d.name}</h3>
            <div class="sub">${d.tag}</div>
          </div>
          <div class="rt">
            OPEN TO <b>${d.open}</b><br>
            FORMAT <b>${d.format}</b>
          </div>
        </div>
        <p class="dom-blurb">${d.blurb}</p>
        <div class="ps-grid">
          ${list.map(p => {
            const n = Object.values(assignments).filter(a => a.psId === p.id).length;
            return `
            <button class="ps-card" data-ps="${p.id}">
              <div class="ps-id">${p.id}</div>
              <div class="ps-title">${escapeHtml(p.title)}</div>
              <div class="ps-hook">${escapeHtml(p.quote)}</div>
              <div class="ps-foot">
                <span class="pill ${n ? 'claimed' : ''}">${n} TEAM${n === 1 ? '' : 'S'} DEALT</span>
                <span class="go">OPEN DECK &rsaquo;</span>
              </div>
            </button>`;
          }).join('')}
        </div>
      </section>`;
  }).join('');

  $$('.ps-card').forEach(el =>
    el.addEventListener('click', () => openPS(el.dataset.ps))
  );
  updateCount();
}

function escapeHtml(s){
  return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

/* ---------------- PS DETAIL ---------------- */
function openPS(id){
  const p = psById(id);
  if (!p) return;
  currentPS = p;
  const d = DOMAINS.find(x => x.id === p.domain);

  $('#ps-eyebrow').textContent = `${p.id}  //  DOMAIN ${d.num} — ${d.name}`;
  $('#ps-title').textContent   = p.title;
  $('#ps-scenario').textContent = p.scenario;
  $('#ps-mvp').textContent      = p.mvp;
  $('#ps-secure').textContent   = p.secure;
  $('#ps-quote').textContent    = `"${p.quote}"`;
  $('#deck-id').textContent     = `${p.id} · 03 SEALED`;

  renderCards(p);
  fillTeams();
  $('#verdict').classList.remove('show');

  $('#view-home').classList.add('hidden');
  $('#view-ps').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

function renderCards(p){
  $('#cards').innerHTML = p.cards.map((c, i) => `
    <div class="card" data-i="${i}">
      <div class="card-inner">
        <div class="face back-f">
          <div class="bt">FUTURE CARD</div>
          <svg class="sigil" style="color:var(--amber-d)"><use href="#cerberus"/></svg>
          <div class="bn">0${i + 1}</div>
          <div class="locked">${p.id} · SEALED</div>
        </div>
        <div class="face front-f">
          <div class="fc-code">${c.code}</div>
          <div class="fc-name">${escapeHtml(c.name)}</div>
          <div class="fc-sec">THE TWIST</div>
          <p class="fc-txt">${escapeHtml(c.twist)}</p>
          <div class="fc-sec">WHAT IT DEMANDS</div>
          <p class="fc-txt demand">${escapeHtml(c.demand)}</p>
          <div class="fc-foot">DEALT TO <b class="holder">— UNASSIGNED —</b></div>
        </div>
      </div>
    </div>`).join('');

  // Cards already dealt for this PS stay revealed, showing their holders.
  p.cards.forEach((c, i) => {
    const holders = Object.entries(assignments)
      .filter(([, a]) => a.psId === p.id && a.cardCode === c.code)
      .map(([t]) => t);
    if (holders.length){
      const el = $(`.card[data-i="${i}"]`);
      el.classList.add('flipped');
      el.querySelector('.holder').textContent = holders.join(' · ');
    }
  });
}

function fillTeams(){
  const sel = $('#team-select');
  const hide = $('#hide-assigned').checked;
  const prev = sel.value;
  const list = TEAMS.filter(t => !(hide && assignments[t]));

  sel.innerHTML = list.length
    ? list.map(t => {
        const a = assignments[t];
        return `<option value="${escapeHtml(t)}">${escapeHtml(t)}${a ? ` — ${a.psId} / ${a.cardName}` : ''}</option>`;
      }).join('')
    : `<option value="">— all teams already assigned —</option>`;

  if (list.includes(prev)) sel.value = prev;
  $('#btn-shuffle').disabled = !list.length;
}

/* ---------------- SHUFFLE & DEAL ---------------- */
async function shuffleDeal(){
  if (dealing || !currentPS) return;
  const team = $('#team-select').value;
  if (!team) return;

  if (assignments[team]){
    const a = assignments[team];
    const ok = await ask(`${team} already holds ${a.cardName} (${a.psId}). Re-deal and overwrite that assignment?`, 'Re-deal');
    if (!ok) return;
  }
  if (dealing) return;

  dealing = true;
  $('#btn-shuffle').disabled = true;
  $('#btn-reveal').disabled = true;
  $('#verdict').classList.remove('show');

  const cardsEl = $('#cards');
  $$('.card').forEach(c => c.classList.remove('flipped','dealt','dimmed'));
  cardsEl.classList.add('shuffling');

  // Cryptographically-seeded pick so the draw is genuinely uniform.
  const pick = randomIndex(currentPS.cards.length);

  setTimeout(() => {
    cardsEl.classList.remove('shuffling');
    const card = currentPS.cards[pick];

    assignments[team] = {
      psId: currentPS.id,
      cardCode: card.code,
      cardName: card.name,
      ts: new Date().toISOString()
    };
    save();

    $$('.card').forEach((el, i) => {
      if (i === pick){
        el.classList.add('flipped','dealt');
        const holders = Object.entries(assignments)
          .filter(([, a]) => a.psId === currentPS.id && a.cardCode === card.code)
          .map(([t]) => t);
        el.querySelector('.holder').textContent = holders.join(' · ');
      } else {
        el.classList.add('dimmed');
      }
    });

    $('#v-team').textContent = team;
    $('#v-card').textContent = card.name;
    $('#v-ps').textContent   = `${card.code} · ${currentPS.id}`;
    $('#verdict').classList.add('show');

    setTimeout(() => $$('.card').forEach(c => c.classList.remove('dimmed')), 1500);

    dealing = false;
    $('#btn-reveal').disabled = false;
    fillTeams();
    updateCount();
    toast(`${team} → ${card.name}`);
  }, 1800);
}

function randomIndex(n){
  if (window.crypto && window.crypto.getRandomValues){
    const max = Math.floor(0xFFFFFFFF / n) * n;   // reject the biased tail
    const buf = new Uint32Array(1);
    let v;
    do { window.crypto.getRandomValues(buf); v = buf[0]; } while (v >= max);
    return v % n;
  }
  return Math.floor(Math.random() * n);
}

function revealAll(){
  const anyHidden = $$('.card').some(c => !c.classList.contains('flipped'));
  $$('.card').forEach(c => {
    c.classList.remove('dealt','dimmed');
    c.classList.toggle('flipped', anyHidden);
  });
  $('#btn-reveal').textContent = anyHidden ? 'Hide All' : 'Reveal All';
}

/* ---------------- LEDGER ---------------- */
function updateCount(){
  const n = Object.keys(assignments).length;
  $('#roster-count').textContent = ` ${n}/${TEAMS.length}`;
  $('#btn-roster').classList.toggle('on', n > 0);
}

function renderLedger(){
  // Dealt teams float to the top so the ledger reads as a live log.
  const rows = TEAMS.map(t => ({ team: t, a: assignments[t] }))
    .sort((x, y) => (y.a ? 1 : 0) - (x.a ? 1 : 0) || (x.a && y.a ? x.a.ts.localeCompare(y.a.ts) : 0));
  const done = rows.filter(r => r.a).length;
  $('#ledger-count').textContent = `${done} OF ${TEAMS.length} DEALT`;

  $('#ledger-body').innerHTML = rows.map(({ team, a }) => {
    if (!a) return `<tr><td class="tname">${escapeHtml(team)}</td><td class="none" colspan="4">— not dealt —</td></tr>`;
    const p = psById(a.psId);
    const time = new Date(a.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `<tr>
      <td class="tname">${escapeHtml(team)}</td>
      <td>${a.psId} · ${escapeHtml(p ? p.title : '')}</td>
      <td class="tcard">${escapeHtml(a.cardName)} <span style="color:var(--dim2);font-weight:400">${a.cardCode}</span></td>
      <td class="none">${time}</td>
      <td class="undo-cell"><button class="undo" data-team="${escapeHtml(team)}" title="Clear this team's card">Undo</button></td>
    </tr>`;
  }).join('');
  $('#ledger-empty').classList.toggle('hidden', done > 0);

  $$('#ledger-body .undo').forEach(b => b.addEventListener('click', () => clearTeam(b.dataset.team)));
}

async function clearTeam(team){
  const a = assignments[team];
  if (!a) return;
  const ok = await ask(`Return ${a.cardName} (${a.psId}) to the deck and set ${team} back to undealt?`, 'Undo deal');
  if (!ok) return;
  delete assignments[team];
  save();
  renderLedger();
  updateCount();
  if (currentPS){ renderCards(currentPS); fillTeams(); $('#verdict').classList.remove('show'); }
  toast(`${team} reset — card returned to the deck`);
}

function exportCSV(){
  const rows = [['Team','Problem Statement ID','Problem Statement','Future Card','Card Code','Dealt At']];
  TEAMS.forEach(t => {
    const a = assignments[t];
    const p = a ? psById(a.psId) : null;
    rows.push(a
      ? [t, a.psId, p ? p.title : '', a.cardName, a.cardCode, a.ts]
      : [t, '', '', '', '', '']);
  });
  const csv = rows
    .map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kerberos-round3-future-cards.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------------- WIRING ---------------- */
$('#btn-back').addEventListener('click', () => {
  $('#view-ps').classList.add('hidden');
  $('#view-home').classList.remove('hidden');
  renderHome();
});
$('#btn-shuffle').addEventListener('click', shuffleDeal);
$('#btn-reveal').addEventListener('click', revealAll);
$('#hide-assigned').addEventListener('change', fillTeams);

$('#btn-roster').addEventListener('click', () => { renderLedger(); $('#modal').classList.add('open'); });
$('#btn-close').addEventListener('click', () => $('#modal').classList.remove('open'));
$('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') $('#modal').classList.remove('open'); });
$('#btn-export').addEventListener('click', exportCSV);
$('#btn-clear').addEventListener('click', async () => {
  const n = Object.keys(assignments).length;
  if (!n) { toast('Nothing to clear'); return; }
  const ok = await ask(`Clear every Future Card assignment? ${n} team${n===1?'':'s'} will be reset to undealt.`, 'Clear all');
  if (!ok) return;
  assignments = {};
  save();
  renderLedger();
  updateCount();
  if (currentPS) { renderCards(currentPS); fillTeams(); $('#verdict').classList.remove('show'); }
  else renderHome();
  toast('Ledger cleared');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') $('#modal').classList.remove('open');
});

renderHome();
