// Mapa realizácií: obce ako body (veľkosť podľa počtu), filter domy/firmy, panel s fotkami obce.
(function () {
  var data = JSON.parse(document.getElementById('realizacie-data').textContent);
  var svg = document.querySelector('.mapa-svg'), gObce = svg.querySelector('.obce');
  var gPopisy = document.createElementNS('http://www.w3.org/2000/svg', 'g'); gPopisy.setAttribute('class', 'popisy obec'); gPopisy.style.animation = 'none'; svg.appendChild(gPopisy);
  var panel = document.getElementById('panel'), zoznam = document.querySelector('.obce-zoznam');
  var NS = 'http://www.w3.org/2000/svg';
  var VELKE = ['Spišská Nová Ves', 'Poprad', 'Levoča', 'Kežmarok', 'Košice', 'Stará Ľubovňa', 'Vranov nad Topľou', 'Svit'];
  var filter = 'vsetko', aktivna = null;
  // na mobile výrez Spiša (okrajové obce sú v zozname pod mapou)
  var mala = window.matchMedia('(max-width: 40rem)').matches;
  if (mala) { svg.setAttribute('viewBox', '20 150 600 400'); svg.classList.add('mapa-mala'); }
  var POD = { 'Spišská Nová Ves': [6, 20], 'Poprad': [0, 18] };
  if (mala) POD['Spišská Nová Ves'] = [6, 26];  // popisok pod bodom (husté okolie)

  var obce = {};
  data.forEach(function (r) {
    (obce[r.o] = obce[r.o] || { nazov: r.o, x: r.x, y: r.y, polozky: [] }).polozky.push(r);
  });
  var zoradene = Object.keys(obce).map(function (k) { return obce[k]; })
    .sort(function (a, b) { return b.polozky.length - a.polozky.length || a.nazov.localeCompare(b.nazov, 'sk'); });

  function fmt(n) { return n.toLocaleString('sk-SK', { maximumFractionDigits: 2 }); }
  function viditelne(o) { return o.polozky.filter(function (r) { return filter === 'vsetko' || r.s === filter; }); }

  // body na mape (najväčšie dole, aby malé boli klikateľné)
  zoradene.slice().forEach(function (o, i) {
    if (o.x === null) return;
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'obec'); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
    g.style.setProperty('--i', i);
    var hit = document.createElementNS(NS, 'circle'); hit.setAttribute('class', 'hit');
    var halo = document.createElementNS(NS, 'circle'); halo.setAttribute('class', 'halo');
    var bod = document.createElementNS(NS, 'circle'); bod.setAttribute('class', 'bod');
    [hit, halo, bod].forEach(function (c) { c.setAttribute('cx', o.x); c.setAttribute('cy', o.y); g.appendChild(c); });
    var velke = VELKE.indexOf(o.nazov) > -1;
    var t = document.createElementNS(NS, 'text');
    t.textContent = o.nazov; t.setAttribute('class', velke ? '' : 'male');
    gPopisy.appendChild(t);
    if (!velke) t.style.display = 'none';
    o.g = g; o.bod = bod; o.halo = halo; o.hit = hit; o.text = t;
    g.addEventListener('click', function () { vyber(o); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); vyber(o); } });
    g.addEventListener('mouseenter', function () { t.style.display = ''; });
    g.addEventListener('mouseleave', function () { if (!velke && aktivna !== o) t.style.display = 'none'; });
    gObce.appendChild(g);
  });
  // menšie body navrch
  zoradene.slice().reverse().forEach(function (o) { if (o.g) gObce.appendChild(o.g); });

  // tlačidlá obcí
  zoradene.forEach(function (o, i) {
    var b = document.createElement('button');
    if (i >= 8) b.className = 'navyse';
    b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { vyber(o, true); });
    o.btn = b; zoznam.appendChild(b);
  });

  var viac = document.createElement('button'); viac.type = 'button'; viac.className = 'obce-viac';
  viac.textContent = 'Ďalšie obce (' + (zoradene.length - 8) + ')';
  viac.addEventListener('click', function () { zoznam.classList.add('vsetky'); viac.remove(); });
  zoznam.appendChild(viac);

  function prekresli() {
    zoradene.forEach(function (o) {
      var v = viditelne(o), n = v.length;
      o.btn.hidden = n === 0;
      o.btn.innerHTML = '';
      o.btn.appendChild(document.createTextNode(o.nazov));
      var s = document.createElement('span'); s.textContent = n; o.btn.appendChild(s);
      if (!o.g) return;
      o.g.classList.toggle('skryta', n === 0);
      o.text.style.visibility = n === 0 ? 'hidden' : '';
      var f = v.filter(function (r) { return r.s === 'firemny'; }).length;
      o.g.classList.toggle('firma', f === n && n > 0);
      o.g.classList.toggle('zmiesane', f > 0 && f < n);
      var r = (6 + 3.2 * Math.sqrt(n)) * (mala ? 1.25 : 1);
      o.bod.setAttribute('r', r); o.halo.setAttribute('r', r + 9); o.hit.setAttribute('r', r + (mala ? 26 : 8));
      var lx = o.x + r + 6, ly = o.y + 5, anchor = 'start';
      if (o.x > 860) { lx = o.x - r - 6; anchor = 'end'; }
      if (POD[o.nazov]) { lx = o.x + POD[o.nazov][0]; ly = o.y + r + POD[o.nazov][1]; anchor = 'middle'; o.text.classList.add('pod'); }
      if (o.nazov === 'Svit') { lx = o.x - r - 6; anchor = 'end'; }
      o.text.setAttribute('x', lx); o.text.setAttribute('y', ly); o.text.setAttribute('text-anchor', anchor);
      o.g.setAttribute('aria-label', o.nazov + ': ' + n + (n === 1 ? ' realizácia' : n < 5 ? ' realizácie' : ' realizácií'));
    });
  }

  function prehlad() {
    var v = data.filter(function (r) { return filter === 'vsetko' || r.s === filter; });
    var max = v.reduce(function (a, r) { return r.kw > a.kw ? r : a; }, v[0]);
    var roky = v.map(function (r) { return r.r; });
    panel.innerHTML = '';
    var h = document.createElement('h3'); h.textContent = filter === 'firemny' ? 'Firmy' : filter === 'rodinne' ? 'Rodinné domy' : 'Všetky realizácie';
    var p = document.createElement('p'); p.className = 'panel-sum';
    p.textContent = v.length + ' realizácií v rokoch ' + Math.min.apply(null, roky) + '–' + Math.max.apply(null, roky) + '. Najväčšia: ' + max.o + ', ' + max.k + ' kWp (' + max.r + ').';
    var leg = document.createElement('div'); leg.className = 'panel-legenda';
    leg.innerHTML = '<span><i></i>rodinné domy</span><span><i class="f"></i>firmy</span><span><i class="z"></i>domy aj firmy</span><span>Veľkosť bodu = počet realizácií v obci.</span>';
    panel.append(h, p, leg);
    var naj = v.slice().sort(function (a, b) { return b.kw - a.kw; }).slice(0, 4);
    panel.appendChild(fotky(naj, true));
  }

  function fotky(zoz, sObcou) {
    var ul = document.createElement('ul'); ul.className = 'panel-fotky'; ul.setAttribute('role', 'list');
    zoz.forEach(function (r) {
      var li = document.createElement('li'), b = document.createElement('button'), im = document.createElement('img'), p = document.createElement('p');
      var popis = r.o + ' · ' + r.k + ' kWp · ' + r.r;
      b.type = 'button'; b.setAttribute('aria-label', 'Zväčšiť fotku: ' + popis);
      im.src = r.t; im.alt = 'Fotovoltický systém ' + popis; im.loading = 'lazy'; im.width = 640; im.height = 480;
      b.appendChild(im);
      b.addEventListener('click', function () { window.otvorFoto(r.f, popis); });
      p.innerHTML = (sObcou ? '<b></b> ' : '') + r.k + ' kWp · ' + r.r + (r.s === 'firemny' ? ' · firma' : '');
      if (sObcou) p.querySelector('b').textContent = r.o;
      li.append(b, p); ul.appendChild(li);
    });
    return ul;
  }

  function vyber(o, zoZoznamu) {
    if (aktivna && aktivna.g) { aktivna.g.classList.remove('aktivna'); if (VELKE.indexOf(aktivna.nazov) < 0) aktivna.text.style.display = 'none'; }
    if (aktivna) aktivna.btn.setAttribute('aria-pressed', 'false');
    aktivna = o;
    o.btn.setAttribute('aria-pressed', 'true');
    if (o.g) { o.g.classList.add('aktivna'); o.text.style.display = ''; }
    var v = viditelne(o).slice().sort(function (a, b) { return b.r - a.r || b.kw - a.kw; });
    var sum = v.reduce(function (a, r) { return a + r.kw; }, 0);
    panel.innerHTML = '';
    var sp = document.createElement('button'); sp.className = 'panel-spat'; sp.type = 'button'; sp.textContent = '← Prehľad všetkých obcí';
    sp.addEventListener('click', function () { zrus(); });
    var h = document.createElement('h3'); h.textContent = o.nazov;
    var p = document.createElement('p'); p.className = 'panel-sum';
    p.textContent = v.length + (v.length === 1 ? ' realizácia' : v.length < 5 ? ' realizácie' : ' realizácií') + ', spolu ' + fmt(sum) + ' kWp' + (o.x === null ? ' (mimo výrezu mapy)' : '');
    panel.append(sp, h, p);
    var LIMIT = 8;
    var ul = fotky(v.slice(0, LIMIT), false); panel.appendChild(ul);
    if (v.length > LIMIT) {
      var viac = document.createElement('button'); viac.type = 'button'; viac.className = 'cip-btn panel-viac';
      viac.textContent = 'Zobraziť všetky (' + v.length + ')';
      viac.addEventListener('click', function () { var nove = fotky(v.slice(LIMIT), false); while (nove.firstChild) ul.appendChild(nove.firstChild); viac.remove(); });
      panel.appendChild(viac);
    }
    if (zoZoznamu && window.innerWidth < 992) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function zrus() {
    if (aktivna) { if (aktivna.g) { aktivna.g.classList.remove('aktivna'); if (VELKE.indexOf(aktivna.nazov) < 0) aktivna.text.style.display = 'none'; } aktivna.btn.setAttribute('aria-pressed', 'false'); }
    aktivna = null; prehlad();
  }

  document.querySelectorAll('.mapa-sekcia .cip-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.mapa-sekcia .cip-btn').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      filter = b.dataset.filter; prekresli();
      if (aktivna && viditelne(aktivna).length) vyber(aktivna); else zrus();
    });
  });
  prekresli(); prehlad();
})();
