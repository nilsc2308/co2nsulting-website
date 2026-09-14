# Launch-Checkliste – CO2NSULTING (neue Website, Apple-Stil)

Stand: 14. September 2026 · Projekt: `Documents/website 1/co2-consulting-web-v2`
Die alte React-Website liegt unverändert in `co2-consulting-web`.

Legende: **✅ erledigt** · **⚠️ offen, braucht eine Angabe oder Entscheidung von euch** · **⏳ erst nach dem Livegang möglich**

## Offene Kundenangaben (bitte durchgeben)

| | Punkt | Wo |
|---|---|---|
| ⚠️ | **USt-IdNr.** – falls vorhanden, sonst den Absatz „Umsatzsteuer-ID“ streichen | `impressum.html` |
| ⚠️ | **Hoster in der Datenschutzerklärung** – aktuell steht ein Platzhalter (GitHub Pages oder Netlify). Sobald klar ist, wo die Seite endgültig läuft, eintragen | `datenschutz.html`, Abschnitt „Externes Hosting“ |
| ⚠️ | **Öffnungszeiten** – für Google-Unternehmensprofil und JSON-LD (`openingHours`) | alle Seiten, `<script type="application/ld+json">` |
| ⚠️ | **Domain** – Canonical, Sitemap, robots.txt und OG-Tags zeigen auf `https://co2-consulting.eu`. Wenn die neue Seite unter einer anderen Adresse laufen soll: in allen HTML-Dateien, `sitemap.xml` und `robots.txt` ersetzen | überall |
| ⚠️ | **Fördersätze prüfen** – Förderrechner (`foerderung.html`), Beispiel-Fahrplan (`sanierung.html`) und Ratgeber iSFP nennen die BEG-Regeln (15 % Grundförderung, +5 % iSFP-Bonus, 30.000/60.000 € Höchstbetrag, Heizung 30 % Grundförderung). Bitte vom Fachteam gegen den aktuellen Stand der BEG-Richtlinie prüfen | `foerderung.html`, `sanierung.html`, `ratgeber-isfp.html` |
| ⚠️ | **Beispiel-Fahrplan** – die Zahlen (Baujahr 1968, 265 kWh/m²a, Kosten je Schritt) sind fiktive, gerundete Beispielwerte und so gekennzeichnet. Wenn ihr ein echtes anonymisiertes Projekt habt, tauschen wir sie aus | `sanierung.html`, `main.js` (Block „Beispiel-Fahrplan“) |
| ⚠️ | **30-Sekunden-Check (Startseite)** – Richtwerte: Endenergie je Baualtersklasse (45–225 kWh/m²·a), Preise Gas 0,12 / Öl 0,11 / Fernwärme 0,14 / Strom 0,32 (JAZ 3,5) / Pellets 0,08 €/kWh, CO₂-Faktoren Gas 0,20 / Öl 0,27 / Fernwärme 0,18 / Strom 0,38 / Pellets 0,02 kg/kWh, 12,5 kg CO₂ je Baum und Jahr. Bitte vom Fachteam plausibilisieren; Werte stehen in `main.js`, Block „Heizkosten- & CO2-Check“ | `index.html`, `main.js` |
| ⚠️ | **Antwortzeit** – Kontaktseite und Danke-Seite versprechen „in der Regel innerhalb von zwei Werktagen“. Passt das? | `kontakt.html`, `danke.html` |
| ⚠️ | **Ratgeber-Artikel** – drei allgemein gehaltene Fachartikel (iSFP, Innendämmung im Denkmal, QNG). Bitte fachlich gegenlesen | `ratgeber-*.html` |
| ⚠️ | **Eigene Fotos** – eingebaut sind drei Bürofotos von co2-consulting.eu sowie drei Fotos von der LinkedIn-Seite (Workshop im Büro, Messestand). Auf den LinkedIn-Fotos sind Personen erkennbar: **bitte Einverständnis bestätigen** oder Fotos tauschen. Die übrigen Fotos sind Unsplash-Motive (Nachweis in `img/BILDNACHWEIS.md`) | `img/`, `index.html`, `ueber-uns.html`, `leistungen.html` |
| ⚠️ | **Aktuell-Sektion auf der Startseite** – „Kostenlose Energiesprechstunde für WEGs“ und „BEG-Reform 2026“ stammen aus euren LinkedIn-Beiträgen. Bitte prüfen, ob das Angebot noch gilt, und ggf. Termine/Details ergänzen | `index.html`, Abschnitt „Aktuell“ |
| ⚠️ | **Video „Best Practice“** – die bisherige Website kündigt ein Video über eure Arbeit an. Sobald es existiert, bauen wir es ein | – |
| ⚠️ | **FVID-Logo** – in eurer Mediathek liegt ein FVID-Logo (Mitgliedschaft?). Wenn ihr Mitglied seid, ergänzen wir es in der Fußzeile | – |
| ⚠️ | **Analytics** – bewusst nicht eingebaut (kein Banner nötig). Falls gewünscht: Plausible oder Matomo ohne Cookies | – |

## Marke

| | Punkt | Stand |
|---|---|---|
| ✅ | **Farben** | Exakt von co2-consulting.eu übernommen: Petrol `#123644` (dunkle Flächen, Buttons, Überschriften-Eyebrows), Überschriften `#183C51`, Logo-Grün `#8FC78F`, dunkles Grün `#45966A` (Ziffer im Logo, Akzente), Text `#6C6C6C`, Hellgrau `#E9E9E9` (Karten, Formularfelder), Orange `#FFBC7D` (Haupt-Buttons) |
| ✅ | **Logo** | Original-Logo (PNG von der bisherigen Website): Wortmarke in der Navigation (`img/logo.png`), Logo mit Claim im Start-Vorhang (`img/logo-claim.png`) und in der Fußzeile (`img/logo-claim-light.png`) |
| ⚠️ | **Schrift** | Die Original-Seite nutzt „Bagoss“ (Lizenzschrift) und „Work Sans“. Hier läuft wie gewünscht Inter (lokal). Falls Bagoss gewünscht: Lizenzdatei (woff2) nötig |

## Rechtliches

| | Punkt | Stand |
|---|---|---|
| ✅ | **Impressum** | Aus der bisherigen Website übernommen (Handelsregister 20767, Amtsgericht Aachen, Alexia Schmidt, beide Standorte). Offen: USt-IdNr. |
| ✅ | **Datenschutzerklärung** | Aus der bisherigen Website übernommen und an diese Seite angepasst: Google Maps → OpenStreetMap (erst auf Klick), Kontaktformular über Netlify Forms, Skripte über jsDelivr, Schrift lokal. Offen: Hoster |
| ✅ | **Kein Cookie-Banner nötig** | Keine Analyse-Cookies, kein Tracking. Nur ein Sitzungs-Merker für die Startanimation (§ 25 Abs. 2 TDDDG). Schrift Inter liegt lokal in `fonts/`. Karte lädt erst auf Klick |
| ✅ | **Bildnachweis** | `img/BILDNACHWEIS.md`, verlinkt im Impressum |

## Technik

| | Punkt | Stand |
|---|---|---|
| ✅ | **Statischer Mehrseiter, kein Build** | 15 Seiten: index, leistungen, foerderung, sanierung, ueber-uns, ratgeber + 3 Artikel, faq, kontakt, danke, 404, impressum, datenschutz. Gemeinsame `styles.css` / `main.js` |
| ✅ | **Animationen** | GSAP 3.12.5 + ScrollTrigger + Lenis 1.1.18 per jsDelivr (feste Versionen). Foto-Scroll-Through auf der Startseite mit Text-Maske, Lamellen, Kachel-Montage, Zoom-Dive + Lichtblitz und 3D-Kartenwechsel. Nur transform/opacity/mask |
| ✅ | **Bilder** | 14 Fotos als WebP in 2200 px und 1000 px (`-m`), `srcset` + `width`/`height`, Lazy-Loading außerhalb des ersten Viewports |
| ✅ | **Getestet** | Playwright, Chromium und WebKit (Safari-Engine), 1400 px und iPhone 390 px, jede Seite komplett durchgescrollt: 0 JS-Fehler, kein horizontales Scrollen. Interaktive Elemente (Quiz, Förderrechner, Beispiel-Fahrplan, System-Ebenen, Karte, FAQ, Mobilmenü, Formularprüfung) geprüft |
| ✅ | **Barrierefreiheit** | Sprung-zum-Inhalt-Link, sichtbarer Fokus, Tastaturbedienung, `aria-pressed`/`aria-expanded`, `prefers-reduced-motion` (Szene wird zum statischen Hero, keine Vorhänge/Laufbänder) |
| ✅ | **Kontaktformular** | Netlify-Forms-fertig (`data-netlify`, Honeypot `firma-website`, Weiterleitung auf `danke.html`). **Achtung:** Auf GitHub Pages funktioniert der Versand nicht – dort braucht es einen anderen Formular-Dienst (z. B. Formspree) oder den Umzug zu Netlify |
| ✅ | **Security-Header** | `netlify.toml` (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, Cache-Header). Gilt nur bei Netlify; GitHub Pages setzt keine eigenen Header |
| ✅ | **404-Seite** | `404.html` – GitHub Pages nutzt sie automatisch, Netlify per Redirect-Regel |

## SEO

| | Punkt | Stand |
|---|---|---|
| ✅ | **Meta-Titel & -Beschreibungen** | Für jede Seite einzeln, mit Ort und Leistung |
| ✅ | **Canonical, Open Graph, Twitter Card** | Pro Seite gesetzt (Domain siehe oben) |
| ✅ | **JSON-LD** | ProfessionalService (beide Standorte) auf jeder Seite, FAQPage auf `faq.html`, Article auf den Ratgeber-Seiten |
| ✅ | **sitemap.xml, robots.txt, favicon.svg** | vorhanden; `danke.html` und `404.html` sind `noindex` |
| ⏳ | **Search Console & Indexierung** | Nach dem Livegang: Property anlegen, Sitemap einreichen, nach einigen Tagen `site:`-Suche prüfen |
| ⏳ | **Google Unternehmensprofil** | Adresse, Telefon und Öffnungszeiten müssen exakt mit der Website übereinstimmen |

## Sicherung & Veröffentlichung

- Backup: `co2-consulting-web-v2_2026-09-14.tar.gz` im Ordner `website 1`
- Git-Repository im Projektordner, veröffentlicht über GitHub Pages (Adresse siehe README / Terminal-Ausgabe)
- Änderungen veröffentlichen: im Projektordner `git add -A && git commit -m "Änderung" && git push` – GitHub Pages aktualisiert sich innerhalb weniger Minuten

## Bilder ändern

Neues Foto als JPG in zwei Größen (2200 px und 1000 px Breite) als WebP nach `img/` legen (Name `xyz.webp` und `xyz-m.webp`), im HTML `src`, `srcset`, `width`, `height` und `alt` anpassen und in `img/BILDNACHWEIS.md` eintragen.
