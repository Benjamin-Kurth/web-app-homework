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

// Das 'sprueche'-Array wird im Frontend nicht mehr initialisiert.
// Es wird vom Backend geladen. Wir deklarieren es aber hier, damit es global verfügbar ist.
let sprueche = [];

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

// Funktion zur Aktualisierung des Zeichenzählers
function updateCharCount(inputElement, countElement) {
    const count = inputElement.value.length;
    countElement.textContent = `${count} Zeichen`;
}

// Funktion zum Erzeugen und Anzeigen der Sprüche in einer kreisförmigen Anordnung
// Diese Funktion muss jetzt asynchron sein, um Daten vom Backend zu laden.
async function renderSprueche() {
    spruchListe.innerHTML = ''; // Leere die Liste zuerst

    const kreisContainer = document.createElement('div');
    kreisContainer.id = 'kreis-container';
    spruchListe.appendChild(kreisContainer);

    // Sprüche vom Backend abrufen
    try {
        //  Verwende die komplette URL zu deinem Backend-Server
        const response = await fetch('http://localhost:3000/api/sprueche'); // Ruft den GET-Endpunkt auf
        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        sprueche = await response.json(); // Speichere die geladenen Sprüche im Frontend-Array
    } catch (error) {
        console.error("Fehler beim Laden der Sprüche:", error);
        spruchListe.innerHTML = '<p>Sprüche konnten nicht geladen werden.</p>';
        return; // Beende die Funktion bei einem Fehler
    }

    if (sprueche.length === 0) {
        spruchListe.innerHTML = '<p>Noch keine Sprüche vorhanden. Füge einen hinzu!</p>';
        return;
    }

    // Erstelle die Bubbles für jeden Spruch
    sprueche.forEach(spruch => { // Iteriere über die Sprüche aus dem Backend
        const spruchElement = document.createElement('div');
        spruchElement.className = 'spruch-bubble';
        // Speichere die ECHTE ID des Spruchs, die vom Backend kommt
        spruchElement.dataset.id = spruch.id; 

        spruchElement.innerHTML = `
            <p class="spruch-text">"${spruch.text}"</p>
            <small class="spruch-autor">- ${spruch.autor}</small>
            <button type="button" class="btn btn-danger btn-sm mt-2 loeschen-button" data-id="${spruch.id}">Löschen</button>
        `;
        
        kreisContainer.appendChild(spruchElement);
    });

    adjustFontSizeForLongQuotes(); // Passe die Schriftgrößen an
}


// Schritt 4: Auf das Absenden des Formulars reagieren (POST-Anfrage an Backend).
neuesSpruchForm.addEventListener('submit', async function (event) { // 'async' hinzugefügt
    event.preventDefault();
    const neuerSpruchText = spruchInput.value.trim();
    const neuerAutorText = autorInput.value.trim();

    if (neuerSpruchText && neuerAutorText) {
        try {
            //  Verwende die komplette URL zu deinem Backend-Server
            const response = await fetch('http://localhost:3000/api/sprueche', { // POST-Anfrage an den Backend-Endpunkt
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Wichtig für JSON-Daten
                },
                body: JSON.stringify({ // Konvertiere Daten zu JSON-String
                    text: neuerSpruchText,
                    autor: neuerAutorText
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP-Fehler beim Hinzufügen! Status: ${response.status}`);
            }

            const hinzugefuegterSpruch = await response.json(); // Der Server sendet den neuen Spruch zurück
            console.log("Neuer Spruch hinzugefügt:", hinzugefuegterSpruch);

            renderSprueche(); // Aktualisiere die Liste, um den neuen Spruch anzuzeigen
            neuesSpruchForm.reset();
            updateCharCount(spruchInput, spruchCharCount);
            updateCharCount(autorInput, autorCharCount);
        } catch (error) {
            console.error("Fehler beim Hinzufügen des Spruchs:", error);
            alert('Fehler beim Hinzufügen des Spruchs: ' + error.message);
        }
    } else {
        alert('Bitte gib sowohl einen Spruch als auch einen Autor ein.');
    }
});

// Schritt 5: Auf den Klick des "Zufalls-Button" reagieren.
// Diese Funktion muss ebenfalls mit den Backend-Daten arbeiten.
randomSpruchBtn.addEventListener('click', function () {
    if (sprueche.length === 0) { // Nutze das globale 'sprueche'-Array, das von renderSprueche gefüllt wird
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
// Diese Funktion muss jetzt eine DELETE-Anfrage an das Backend senden.
spruchListe.addEventListener('click', async function (event) { // 'async' hinzugefügt
    if (event.target.classList.contains('loeschen-button')) {
        const button = event.target;
        const idZumLoeschen = button.dataset.id; // Hol die ID direkt vom Button

        if (confirm('Bist du sicher, dass du diesen Spruch löschen möchtest?')) {
            try {
                //  Verwende die komplette URL zu deinem Backend-Server
                const response = await fetch(`http://localhost:3000/api/sprueche/${idZumLoeschen}`, { // DELETE-Anfrage
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error(`HTTP-Fehler beim Löschen! Status: ${response.status}`);
                }

                console.log(`Spruch mit ID ${idZumLoeschen} erfolgreich gelöscht.`);
                renderSprueche(); // Aktualisiere die Liste nach dem Löschen vom Backend
            } catch (error) {
                console.error("Fehler beim Löschen des Spruchs:", error);
                alert('Fehler beim Löschen des Spruchs: ' + error.message);
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
    renderSprueche(); // Ruft die Sprüche vom Backend ab
    // Initialer Aufruf der Zähler
    updateCharCount(spruchInput, spruchCharCount);
    updateCharCount(autorInput, autorCharCount);
});