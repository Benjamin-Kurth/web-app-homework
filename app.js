// Schritt // Schritt 1: Elemente aus dem HTML "greifen".
const spruchAnzeige = document.getElementById('spruch-anzeige');
const randomSpruchBtn = document.getElementById('random-spruch-btn');
const neuesSpruchForm = document.getElementById('neuer-spruch-form');
const spruchInput = document.getElementById('spruch-input');
const autorInput = document.getElementById('autor-input');
const spruchListe = document.getElementById('spruch-liste');

// Schritt 2: Deine Daten. Füge hier gleich 2-3 deiner eigenen Lieblingssprüche hinzu!
let sprueche = [
    { text: "Der Weg ist das Ziel.", autor: "Konfuzius" },
    { text: "Phantasie ist wichtiger als Wissen, denn Wissen ist begrenzt.", autor: "Albert Einstein" },
    { text: "Ich bin müde, Boss. Müde, immer unterwegs zu sein, einsam und verlassen. Müde, niemals einen Freund zu haben, der mir sagt, wohin wir gehen, woher wir kommen und warum. Am meisten müde bin ich, Menschen zu sehen, die hässlich zueinander sind. Der Schmerz auf der Welt und das viele Leid, das macht mich sehr müde. Es ist, als wären in meinem Kopf lauter Glasscherben.", autor: "John Coffey" },
    { text: "Was dich nicht herausfordert, verändert dich auch nicht.", autor: "Fred Devito" },
    { text: "Du kannst deine Augen schließen, wenn du etwas nicht sehen willst, aber du kannst nicht dein Herz verschließen, wenn du etwas nicht fühlen willst.", autor: "Johnny Depp" }
];

// Schritt 3: Eine Funktion, die deine Sprüche-Liste im HTML anzeigt (mit Bubble-Struktur).
function renderSprueche() {
    spruchListe.innerHTML = ''; // Leere die Liste, bevor sie neu befüllt wird

    sprueche.forEach((spruch, index) => {
        const li = document.createElement('li');
        // 'list-group-item' bleibt, aber wir entfernen Flexbox-Klassen vom li,
        // da die Bubble-Struktur das interne Layout übernimmt.
        li.className = 'list-group-item'; 
        
        // Hier ist die neue Struktur für die Bubble/den Kreis
        li.innerHTML = `
            <div class="spruch-bubble">
                <p class="mb-1 spruch-text">"${spruch.text}"</p>
                <small class="text-muted fst-italic spruch-autor">- ${spruch.autor}</small>
                <button type="button" class="btn btn-danger btn-sm mt-2 loeschen-button" data-index="${index}">Löschen</button>
            </div>
        `;
        // data-index wird weiterhin auf dem Button gesetzt, um ihn direkt zu identifizieren.
        // Die Löschlogik im Event-Listener nutzt diesen Index nun wieder direkt.
        
        spruchListe.appendChild(li); // Füge das fertige Listenelement zur ul-Liste hinzu
    });
}

// Schritt 4: Auf das Absenden des Formulars reagieren.
neuesSpruchForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite
    const neuerSpruchText = spruchInput.value.trim(); // .trim() entfernt Leerzeichen
    const neuerAutorText = autorInput.value.trim();

    // Grundlegende Validierung der Eingabefelder
    if (neuerSpruchText && neuerAutorText) {
        const neuerSpruch = { text: neuerSpruchText, autor: neuerAutorText };
        sprueche.push(neuerSpruch); // Füge den neuen Spruch zum Array hinzu
        renderSprueche(); // Liste neu rendern, um den neuen Spruch anzuzeigen
        neuesSpruchForm.reset(); // Formularfelder zurücksetzen
    } else {
        alert('Bitte gib sowohl einen Spruch als auch einen Autor ein.');
    }
});

// Schritt 5: Auf den Klick des "Zufalls-Button" reagieren.
randomSpruchBtn.addEventListener('click', function () {
    // Überprüfe, ob überhaupt Sprüche vorhanden sind
    if (sprueche.length === 0) {
        spruchAnzeige.innerHTML = '<p>Keine Sprüche vorhanden. Füge welche hinzu!</p>';
        return; // Beende die Funktion, wenn das Array leer ist
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
    // Überprüfe, ob das geklickte Element den 'loeschen-button' Klasse hat
    if (event.target.classList.contains('loeschen-button')) {
        const button = event.target;
        // Lese den gespeicherten Index aus dem data-index Attribut des Buttons aus
        const indexZumLoeschen = parseInt(button.dataset.index);

        // Sicherheitsprüfung: Ist der Index gültig und im Bereich des Arrays?
        if (!isNaN(indexZumLoeschen) && indexZumLoeschen >= 0 && indexZumLoeschen < sprueche.length) {
            const geloeschterSpruch = sprueche.splice(indexZumLoeschen, 1)[0];
            console.log(`Gelöschter Spruch: "${geloeschterSpruch.text}" von ${geloeschterSpruch.autor}`);
            
            // Render die Liste neu, um den gelöschten Spruch zu entfernen und Indizes zu aktualisieren
            renderSprueche(); 
        }
    }
});

// Schritt 7: Die Sprüche-Liste initial rendern.
// Dieser Event-Listener stellt sicher, dass die renderSprueche-Funktion erst ausgeführt wird,
// wenn das gesamte HTML-Dokument geladen und parsiert wurde.
document.addEventListener('DOMContentLoaded', renderSprueche);