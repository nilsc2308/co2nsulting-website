# Launch-Checkliste – CO2NSULTING (neue Website, Apple-Stil)

Stand: 14. September 2026 (Checkliste komplett durchgegangen) · Projekt: `Documents/website 1/co2-consulting-web-v2`
Die alte React-Website liegt unverändert in `co2-consulting-web`.

Legende: **✅ erledigt** · **⚠️ offen, braucht eine Angabe oder Entscheidung von euch** · **⏳ erst nach dem Livegang möglich**

## Offene Kundenangaben (bitte durchgeben)

| | Punkt | Wo |
|---|---|---|
| ⚠️ | **Hoster in der Datenschutzerklärung** – wie auf der alten Seite steht HostPress GmbH. Wenn die neue Seite woanders läuft (GitHub Pages, Netlify), muss der Anbieter dort geändert werden | `datenschutz.html`, Abschnitt „Externes Hosting“ |
| ⚠️ | **Öffnungszeiten** – eingetragen Mo–Fr 08:00–16:30 Uhr (Quelle: Eintrag Aachen bei Trustlocal, entspricht dem Google-Profil). Bitte bestätigen; für **München** liegen keine Zeiten vor | `kontakt.html`, JSON-LD auf allen Seiten |
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
| ⚠️ | **Google Analytics – Mess-ID eintragen** – In `main.js` steht `GA_ID = 'G-XXXXXXXXXX'`. Die echte ID (Format `G-…`) aus dem Google-Analytics-Konto des Kunden dort einsetzen; ohne ID wird nichts geladen, der Banner erscheint trotzdem. Zusätzlich im Google-Konto den **Auftragsverarbeitungsvertrag** akzeptieren (Verwaltung → Kontoeinstellungen → Zusatz zur Datenverarbeitung) | `main.js`, Zeile `GA_ID` |

## Marke

| | Punkt | Stand |
|---|---|---|
| ✅ | **Farben** | Exakt von co2-consulting.eu übernommen: Petrol `#123644` (dunkle Flächen, Buttons, Überschriften-Eyebrows), Überschriften `#183C51`, Logo-Grün `#8FC78F`, dunkles Grün `#45966A` (Ziffer im Logo, Akzente), Text `#6C6C6C`, Hellgrau `#E9E9E9` (Karten, Formularfelder), Orange `#FFBC7D` (Haupt-Buttons) |
| ✅ | **Logo** | Original-Logo (PNG von der bisherigen Website): Wortmarke in der Navigation (`img/logo.png`), Logo mit Claim im Start-Vorhang (`img/logo-claim.png`) und in der Fußzeile (`img/logo-claim-light.png`) |
| ⚠️ | **Schrift** | Die Original-Seite nutzt „Bagoss“ (Lizenzschrift) und „Work Sans“. Hier läuft wie gewünscht Inter (lokal). Falls Bagoss gewünscht: Lizenzdatei (woff2) nötig |

## Rechtliches

| | Punkt | Stand |
|---|---|---|
| ✅ | **Datenschutzerklärung** | Text von co2-consulting.eu übernommen (inkl. HostPress als Hoster). Nur die Abschnitte, die auf dieser Seite nicht zutreffen würden, sind ersetzt: Google Analytics/Ads (nicht im Einsatz) und Google Maps → OpenStreetMap (erst auf Klick); ergänzt: Cookies, Kontaktformular, jsDelivr, Schriftarten |
| ✅ | **Impressum** | Wortgleich von co2-consulting.eu übernommen (Handelsregister 20767, Amtsgericht Aachen, Alexia Schmidt), ergänzt um den Bildnachweis |
| ✅ | **Cookie-Consent** | Eigener Banner (kein Drittanbieter): „Alle akzeptieren“ / „Nur notwendige“, gleichwertig gestaltet, Link zur Datenschutzerklärung. Google Analytics wird **erst nach Zustimmung** geladen (Consent Mode v2, Standard „denied“). Auswahl wird im Browser gespeichert, jederzeit änderbar über „Cookie-Einstellungen“ in der Fußzeile (bei Widerruf werden `_ga`-Cookies gelöscht). Datenschutzerklärung enthält die Abschnitte „Cookies und Einwilligung“ und „Google Analytics“ |

## Technik

| | Punkt | Stand |
|---|---|---|
| ✅ | **Mobile Version** | Eigene Layouts: Burger-Menü ab 1020 px, Vollbild-Menü, Sticky-Button unten, Raster brechen auf 1–2 Spalten um. Getestet bei 390 px (iPhone) und 1400 px in Chromium und WebKit (Safari-Engine), jede Seite komplett durchgescrollt – kein horizontales Scrollen |
| ✅ | **Meta-Titel** | Für alle 15 Seiten einzeln, mit Ort/Leistung, 50–70 Zeichen |
| ✅ | **Meta-Beschreibungen** | Für alle Seiten einzeln |
| ✅ | **Favicon** | das „CO₂“ aus dem Original-Logo auf Petrol (`icon-blatt-*.png`, `favicon.ico`) |
| ✅ | **sitemap.xml** | 13 URLs (ohne danke/404), Datum 14.9.2026 |
| ✅ | **robots.txt** | Alles frei, `danke.html` ausgeschlossen, Verweis auf Sitemap |
| ✅ | **Canonical-URLs** | Pro Seite gesetzt – zeigen auf `https://co2-consulting.eu/…` (**beim Livegang Domain bestätigen**, sonst überall ersetzen) |
| ✅ | **404-Seite** | `404.html` mit Rückweg; GitHub Pages nutzt sie automatisch, Netlify per Regel in `netlify.toml` |
| ✅ | **Tote Links** | Geprüft am 14.9.: alle internen Links, Bild-Pfade und Sprungmarken (`#…`) vorhanden; alle externen Links (LinkedIn, Instagram, OpenStreetMap, jsDelivr, e-recht24, OSMF) antworten mit 200 |
| ✅ | **Performance** | Startseite (ohne Analytics-Skript, das erst nach Zustimmung kommt): 397 KB bis zum Laden auf dem Handy (727 KB Desktop), LCP ≈ 250 ms lokal, Layout-Shift 0,000. Foto-Szene: nur das erste Foto sofort, Fotos 2–5 werden erst nach dem Laden nachgezogen; Handy bekommt die kleine Fassung. Alle Fotos WebP in zwei Größen mit `srcset`, `width`/`height`, Lazy-Loading; Schrift lokal und vorgeladen; Cache-Header in `netlify.toml` |
| ✅ | **Accessibility** | Sprung-zum-Inhalt-Link, sichtbarer Fokus, Tastaturbedienung (Menü, Quiz, Rechner, Fahrplan, FAQ), `aria-pressed`/`aria-expanded`/`aria-live`, Überschriften-Reihenfolge, Kontrast AA (Petrol auf Weiß 11:1, Grün nur für große Flächen/Buttons mit dunkler Schrift), `prefers-reduced-motion` schaltet Szene, Vorhang und Laufband ab |
| ✅ | **Kontaktformular** | Getestet: Pflichtfelder, E-Mail-Format, Einwilligung, Honeypot, Themen-Schnellwahl, Weiterleitung auf `danke.html`. Versand über **Netlify Forms** – auf GitHub Pages funktioniert der Versand **nicht** (siehe unten) |

## SEO

| | Punkt | Stand |
|---|---|---|
| ✅ | **Alt-Texte** | Alle 83 `<img>` haben `alt`; dekorative Szenen-Fotos bewusst leer (`alt=""`), Inhaltsbilder beschrieben |
| ⚠️ | **Google Analytics / Tracking** | Eingebaut mit Einwilligungsbanner. **Offen: Mess-ID** (siehe oben). Nach dem Livegang im Analytics-Konto prüfen, ob Daten ankommen (Echtzeit-Bericht) |
| ✅ | **Social Sharing / Open Graph** | Titel, Beschreibung, Bild (1200 px breit, pro Seite passend), URL, `twitter:card` – auf jeder Seite |
| ⚠️ | **Lokale SEO-Daten** | JSON-LD `ProfessionalService` mit beiden Adressen, Telefonnummern, E-Mails, Einzugsgebiet, Social-Profilen auf jeder Seite; FAQPage auf `faq.html`, Article auf den Ratgebern. Karte (OpenStreetMap) und Route auf `kontakt.html`. **Offen: Öffnungszeiten** – dann ergänze ich `openingHours` |
| ⏳ | **Indexierung bei Google prüfen** | Erst nach dem Livegang: Search Console anlegen, Domain bestätigen, `sitemap.xml` einreichen, nach einigen Tagen `site:co2-consulting.eu` prüfen. Google-Unternehmensprofil: Adresse, Telefon, Öffnungszeiten exakt wie auf der Website |

## Sicherung & Veröffentlichung

- Backup: `co2-consulting-web-v2_2026-09-14.tar.gz` im Ordner `website 1`
- Git-Repository im Projektordner, veröffentlicht über GitHub Pages (Adresse siehe README / Terminal-Ausgabe)
- Änderungen veröffentlichen: im Projektordner `git add -A && git commit -m "Änderung" && git push` – GitHub Pages aktualisiert sich innerhalb weniger Minuten

## Bilder ändern

Neues Foto als JPG in zwei Größen (2200 px und 1000 px Breite) als WebP nach `img/` legen (Name `xyz.webp` und `xyz-m.webp`), im HTML `src`, `srcset`, `width`, `height` und `alt` anpassen und in `img/BILDNACHWEIS.md` eintragen.
