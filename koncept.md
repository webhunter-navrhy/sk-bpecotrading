# Koncept – BP EcoTrading, s.r.o. (fotovoltika, Spišská Nová Ves)

Úkol #458, náhled zdarma pro p. Bartoše (poptávka z webhunter.cz 13. 10. 2026), kampaň sk-vyroba-priemysel (energetika).

## 1. Tři koncepty
1. **Mapa striech Spiša** – web ako pohľad zhora na región pod Tatrami: 101 skutočných realizácií z ich referencií ako body na mape (obec, kWp, rok, fotka), zákazník hneď vidí, že stavali aj u susedov.
2. **Denný oblúk slnka** – slnko nad siluetou Tatier prechádza scrollom od rána do večera a pod ním sa kreslí krivka výroby; sekcie idú podľa dňa.
3. **Štítok panelu** – web ako technický list FV panela: výkon, rozmery, záruka v rámčekoch štítku, mono popisky.

## 2. Výber: 1 – Mapa striech Spiša
- Majú unikátne dáta, ktoré iní nemajú: 101 realizácií s obcou, výkonom a rokom (2014–2023), 83 rodinných domov + 18 firiem, a ku každej skutočnú fotku. To je najsilnejší dôkaz pre zákazníka („robia v mojom okolí“).
- Fotky sú výborné a lokálne (Tatry v pozadí, letecké zábery hál) – mapa a fotky sa navzájom nesú.
- Koncept 2 by potreboval čísla výroby, ktoré nemáme (vymýšľanie). Koncept 3 je suchý a nevyužije fotky.

## 3. Skladba sekcií
1. Hlavička: logo vľavo (ich SVG), navigácia, tlačidlo „Nezáväzný dopyt“.
2. Hero: claim klienta „Nekonečná energia, úspora pre váš dom“, mestá v podnadpise (SEO), veľká fotka Poprad s Tatrami (ich realizácia) so štítkom „Poprad · 9,99 kWp · 2022“; pod tým 3 doložené fakty (IBC SOLAR Preferred Premium Partner 2025, oprávnený zhotoviteľ Zelená domácnostiam, realizácie od 2014).
3. Pre domácnosti / pre firmy – dve fotky (zrub Levoča, hala SNV 311,85 kWp), dva vstupy do dopytu (predvyplnený typ).
4. **Signature: mapa realizácií** – okresy východného Slovenska tenkými linkami, obce ako body (veľkosť podľa počtu), filter domy/firmy, klik = panel s fotkami obce, zoznam obcí ako tlačidlá (mobil, prístupnosť).
5. Postup – ich 4 kroky (Obhliadka, Návrh riešenia, Projekt, Realizácia) + služby (inžinierska činnosť, elektro, servis). Číslovanie je skutočné poradie.
6. Dotácia Zelená domácnostiam – text z ich stránky so zdrojom SIEA, odkaz na podstránku /dotacie/.
7. Z čoho staviame – reťaz systému: slnko → panely IBC SOLAR → meniče Fronius/SMA → batérie → dom (LOGITEX ohrev vody, klimatizácia), montážne systémy IBC.
8. O nás + oprávnenia – ich text, osvedčenia MHSR (číslo, platnosť; bez skenov s osobnými údajmi), certifikát IBC 2025 (obrázok), partneri.
9. Recenzie – 6 citácií z ich webu (krstné mená, ako majú oni), zdroj uvedený.
10. Dopyt (formulár: typ objektu, obec, strecha, spotreba, záujem o batériu/ohrev/dotáciu, príloha faktúry alebo fotky strechy) + kontakt a fakturačné údaje.
Podstránky: /realizacie/ (všetkých 101 s filtrom podľa roku a typu), /dotacie/ (celý text o Zelenej domácnostiam).

Signature moment: mapa (1). Druhý tichý motiv: štítok realizácie „obec · kWp · rok“ ako popisok pri každej fotke na celom webe (rovnaký formát ako na ich starom webe).

## 4. Písmo, paleta, fotky
- Display **Unbounded 400/500** (geometria pasuje k zaobleným tvarom loga „bp“, typografia.md: „technológie, energie“), text **Onest**. Test diakritiky vrátane ľ ť ď ĺ ŕ ä ô prešiel (render 13. 10.). Unbounded v registri ešte nebol, predchádzajúci web mal Archivo.
- Paleta z loga (SVG): modrá #1f5da6, tmavomodrá #27509b, limetková #aac335. Limetka len na plochy, body mapy, linky (na bielej nemá kontrast pre text). Text #14243b, pozadie biele + jemne modré #f3f7fc. Tmavý blok len z brand-deep (dopyt).
- Fotky: výhradne ich realizácie z bpecotrading.sk/referencie (101 ks, väčšinou 1920×1440 alebo 1000×750). Stock z ich webu (o-nas1/2, euro v rukách, 3D dom) nepoužívam.

## 5. Zakázané vzory
- Žiadny marquee, zrno, tmavé countery, mono nadtitulky. Pás pod hero = 3 doložené fakty, nie počítadlá.
- Čísla (101 realizácií, 2014–2023, 311,85 kWp) sú spočítané z ich zverejneného zoznamu referencií a uvedené v kontexte mapy.
- Číslované kroky 1–4 len preto, že ide o skutočné poradie (ich vlastné kroky).

## 6. Porovnanie
- schvalene.md: princíp „obsahová signature sekcia“ (mapa Pilařová, katalóg Real Marco) – tu mapa so skutočnými dátami.
- odmitnute.md: nie tmavý luxus, nie šablóna v farbách, žiadne falošné prvky (nevymýšľam výrobu kWh ani úspory v €).
- Posledných 5 v registri: sk-gastro (Archivo, etiketa), sk-personalexpress (Oswald, tabuľa), skola-rustu (Familjen, kopec), sk-sempersa (Literata, ciferník), ebcc (Bricolage). Iné písmo aj skladba.
