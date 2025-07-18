// Schritt 1: Elemente aus dem HTML "greifen".
const spruchAnzeige = document.getElementById('spruch-anzeige');
const randomSpruchBtn = document.getElementById('random-spruch-btn');
const neuesSpruchForm = document.getElementById('neuer-spruch-form');
const spruchInput = document.getElementById('spruch-input');
const autorInput = document.getElementById('autor-input');
const spruchListe = document.getElementById('spruch-liste');

// Elemente für die Zeichenzähler greifen
const spruchCharCount = document.getElementById('spruch-char-count');
const autorCharCount = document.getElementById('autor-char-count');

// Schritt 2: Deine Daten. Füge hier gleich 2-3 deiner eigenen Lieblingssprüche hinzu!
let sprueche = [
    { text: "Der Weg ist das Ziel.", autor: "Konfuzius" },
    { text: "Phantasie ist wichtiger als Wissen, denn Wissen ist begrenzt.", autor: "Albert Einstein" },
    { text: "Ich bin müde, Boss. Müde, immer unterwegs zu sein, einsam und verlassen. Müde, niemals einen Freund zu haben, der mir sagt, wohin wir gehen, woher wir kommen und warum. Am meisten müde bin ich, Menschen zu sehen, die hässlich zueinander sind. Der Schmerz auf der Welt und das viele Leid, das macht mich sehr müde. Es ist, als wären in meinem Kopf lauter Glasscherben.", autor: "John Coffey" },
    { text: "Was dich nicht herausfordert, verändert dich auch nicht.", autor: "Fred Devito" },
    { text: "Du kannst deine Augen schließen, wenn du etwas nicht sehen willst, aber du kannst nicht dein Herz verschließen, wenn du etwas nicht fühlen willst.", autor: "Johnny Depp" },
    { text: "Das Leben ist wie Fahrrad fahren. Um die Balance zu halten, musst du in Bewegung bleiben.", autor: "Albert Einstein" },
    { text: "Sei du selbst die Veränderung, die du dir wünschst für diese Welt.", autor: "Mahatma Gandhi" }
];

// Funktion zum Anpassen der Schriftgröße langer Sprüche
function adjustFontSizeForLongQuotes() {
    const spruchTexte = document.querySelectorAll('.spruch-bubble .spruch-text');
    const MAX_CHARS_SMALL_FONT = 150;
    const MAX_CHARS_TINY_FONT = 250;

    spruchTexte.forEach(pElement => {
        const textLength = pElement.textContent.length;
        pElement.classList.remove('small-font', 'tiny-font');

        if (textLength > MAX_CHARS_TINY_FONT) {
            pElement.classList.add('tiny-font');
        } else if (textLength > MAX_CHARS_SMALL_FONT) {
            pElement.classList.add('small-font');
        }
    });
}

// Funktion zum Erzeugen und Anzeigen der Sprüche in einer kreisförmigen Anordnung
function renderSprueche() {
    spruchListe.innerHTML = '';

    const kreisContainer = document.createElement('div');
    kreisContainer.id = 'kreis-container';
    spruchListe.appendChild(kreisContainer);

    sprueche.forEach((spruch, index) => {
        const spruchElement = document.createElement('div');
        spruchElement.className = 'spruch-bubble';
        spruchElement.dataset.index = index;

        spruchElement.innerHTML = `
            <p class="spruch-text">"${spruch.text}"</p>
            <small class="spruch-autor">- ${spruch.autor}</small>
            <button type="button" class="btn btn-danger btn-sm mt-2 loeschen-button">Löschen</button>
        `;
        
        kreisContainer.appendChild(spruchElement);
    });

    adjustFontSizeForLongQuotes();
}


// NEU: Funktion zur Aktualisierung des Zeichenzählers
function updateCharCount(inputElement, countElement) {
    const count = inputElement.value.length;
    countElement.textContent = `${count} Zeichen`;
}

// Schritt 4: Auf das Absenden des Formulars reagieren.
neuesSpruchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const neuerSpruchText = spruchInput.value.trim();
    const neuerAutorText = autorInput.value.trim();

    if (neuerSpruchText && neuerAutorText) {
        const neuerSpruch = { text: neuerSpruchText, autor: neuerAutorText };
        sprueche.push(neuerSpruch);
        renderSprueche();
        neuesSpruchForm.reset();
        // Zähler nach dem Absenden zurücksetzen
        updateCharCount(spruchInput, spruchCharCount);
        updateCharCount(autorInput, autorCharCount);
    } else {
        alert('Bitte gib sowohl einen Spruch als auch einen Autor ein.');
    }
});

// Schritt 5: Auf den Klick des "Zufalls-Button" reagieren.
randomSpruchBtn.addEventListener('click', function () {
    if (sprueche.length === 0) {
        spruchAnzeige.innerHTML = '<p>Keine Sprüche vorhanden. Füge welche hinzu!</p>';
        return;
    }
    const zufallsIndex = Math.floor(Math.random() * sprueche.length);
    const zufallsSpruch = sprueche[zufallsIndex];
    spruchAnzeige.innerHTML = `
        <p>"${zufallsSpruch.text}"</p>
        <footer class="blockquote-footer">${zufallsSpruch.autor}</footer>
    `;
});

// Schritt 6: Event-Listener für die Löschfunktion (mit Event Delegation).
spruchListe.addEventListener('click', function (event) {
    if (event.target.classList.contains('loeschen-button')) {
        const button = event.target;
        const spruchBubbleElement = button.closest('.spruch-bubble');
        if (spruchBubbleElement) {
            const indexZumLoeschen = parseInt(spruchBubbleElement.dataset.index);

            if (!isNaN(indexZumLoeschen) && indexZumLoeschen >= 0 && indexZumLoeschen < sprueche.length) {
                const geloeschterSpruch = sprueche.splice(indexZumLoeschen, 1)[0];
                console.log(`Gelöschter Spruch: "${geloeschterSpruch.text}" von ${geloeschterSpruch.autor}`);
                renderSprueche();
            }
        }
    }
});

// Event-Listener für Eingabefelder, um Zähler bei jeder Eingabe zu aktualisieren
spruchInput.addEventListener('input', () => {
    updateCharCount(spruchInput, spruchCharCount);
});

autorInput.addEventListener('input', () => {
    updateCharCount(autorInput, autorCharCount);
});

// Schritt 7: Die Sprüche-Liste initial rendern.
document.addEventListener('DOMContentLoaded', () => {
    renderSprueche();
    // Initialer Aufruf der Zähler, falls Felder schon vorbefüllt sind
    updateCharCount(spruchInput, spruchCharCount);
    updateCharCount(autorInput, autorCharCount);
});