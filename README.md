# 🧾 Pokédex WebApp

Ein interaktiver Pokédex im Stil der klassischen Pokémon-Welt – vollständig im Webbrowser realisiert. Mit Suche, Kartenansicht, Typ-Farbcodierung, Overlay-Details und mehr!

## 🔍 Funktionen

- 🔄 **Dynamisches Laden** der Pokémon in Batches von 20
- 🔎 **Live-Suche** ab 3 Zeichen mit sofortiger Darstellung
- 🎨 **Typbasierte Farbgebung** (z. B. Feuer = orange, Wasser = blau)
- 🌈 **Zweifarbiger Farbverlauf** für Pokémon mit zwei Typen
- 🃏 **Overlay-Kartenansicht** mit allen wichtigen Infos
- 🧭 **Vor- und Zurückblättern** im Overlay
- 🏷️ **Typ-Badges** mit Farbhintergrund und Tooltip (z. B. "🔥 Fire – strong against Grass")

## 📸 Screenshots

> *(Optional: Füge hier Screenshots deiner Anwendung ein, z. B. mit `![Vorschau](./screenshots/overview.png)`)*

## 🚀 Technologien

- **HTML5**
- **CSS3** (Flexbox, Responsive Design, CSS-Variablen)
- **Vanilla JavaScript (ES6+)**
- [🌐 PokéAPI](https://pokeapi.co/) als Datenquelle

## 📁 Projektstruktur

```plaintext
/ (root)
│
├── index.html             # Einstiegspunkt
├── style.css              # Hauptstyling
├── script.js              # JS-Logik (API, Events, Rendering)
├── /img/                  # Logos und Grafiken
├── /screenshots/          # (optional) Vorschauen
└── README.md              # Dieses Dokument
