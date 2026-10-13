// Menu, hlavička, formulár (demo), predvyplnenie typu objektu, lightbox, filter galérie, reveal.
(function () {
  document.documentElement.classList.add('js');
  var hl = document.querySelector('.hlavicka');
  var onScroll = function () { hl.classList.toggle('posun', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var burger = document.querySelector('.burger'), menu = document.getElementById('menu');
  if (burger) {
    burger.addEventListener('click', function () {
      var o = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', o); menu.classList.toggle('otvorene', o);
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { burger.setAttribute('aria-expanded', 'false'); menu.classList.remove('otvorene'); }
    });
  }

  // odkazy „Dopyt pre…“ predvyplnia typ objektu
  document.querySelectorAll('[data-objekt]').forEach(function (a) {
    a.addEventListener('click', function () {
      var r = document.querySelector('.formular input[name="objekt"][value="' + a.getAttribute('data-objekt') + '"]');
      if (r) r.checked = true;
    });
  });

  document.querySelectorAll('form.formular').forEach(function (f) {
    var stav = f.querySelector('.formular-stav');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (f.querySelector('.past input').value) return;
      var endpoint = f.getAttribute('data-endpoint');
      if (f.getAttribute('data-demo') === '1' || !endpoint) {
        stav.textContent = 'Ukážka formulára: v návrhu sa nič neodosiela. Po spustení webu príde dopyt na dopyt@bpecotrading.sk.';
        return;
      }
      stav.textContent = 'Odosielam…';
      fetch(endpoint, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); f.reset(); stav.textContent = 'Ďakujeme, dopyt sme prijali. Ozveme sa vám.'; })
        .catch(function () { stav.textContent = 'Odoslanie sa nepodarilo. Napíšte nám prosím na dopyt@bpecotrading.sk.'; });
    });
  });

  document.querySelectorAll('.subor-btn input').forEach(function (inp) {
    inp.addEventListener('change', function () {
      inp.parentNode.querySelector('.subor-meno').textContent = inp.files.length ? inp.files[0].name : 'Nevybrali ste žiadny súbor';
    });
  });

  // lightbox
  var dlg = document.querySelector('.lightbox');
  window.otvorFoto = function (src, popis) {
    if (!dlg || !dlg.showModal) { window.open(src, '_blank'); return; }
    dlg.querySelector('img').src = src; dlg.querySelector('img').alt = popis;
    dlg.querySelector('p').textContent = popis; dlg.showModal();
  };
  if (dlg) dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  document.querySelectorAll('.foto-btn').forEach(function (b) {
    b.addEventListener('click', function () { window.otvorFoto(b.dataset.velka, b.dataset.popis); });
  });

  // filter galérie (podstránka Realizácie)
  var bloky = document.querySelectorAll('.rok-blok');
  if (bloky.length) {
    document.querySelectorAll('.cip-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.cip-btn').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        var f = b.dataset.filter;
        bloky.forEach(function (bl) {
          var n = 0;
          bl.querySelectorAll('li').forEach(function (li) { var v = f === 'vsetko' || li.dataset.sektor === f; li.hidden = !v; if (v) n++; });
          bl.hidden = n === 0;
        });
      });
    });
  }

})();
