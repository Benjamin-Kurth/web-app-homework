// server.js (Dein Backend-Code, der auf dem Server läuft)

const express = require('express');
const app = express();
const port = 3000; // Dein Server-Port

// Middleware, damit unser Server JSON-Anfragen versteht.
app.use(express.json());

// --- WICHTIG: CORS-Header müssen VOR den Routen definiert werden! ---
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Erlaubt Zugriff von jeder Quelle
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Erlaubt gängige HTTP-Methoden
    res.header('Access-Control-Allow-Headers', 'Content-Type'); // Erlaubt den Content-Type Header
    // Handle preflight requests (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(200).send();
    }
    next();
});
// --- ENDE DER CORS-KONFIGURATION ---

// Unsere Daten leben jetzt hier auf dem Server!
// JEDER SPRUCH MUSS EINE EINDEUTIGE ID HABEN!
let sprueche = [
    { id: 1, text: "Der Weg ist das Ziel.", autor: "Konfuzius" },
    { id: 2, text: "Phantasie ist wichtiger als Wissen, denn Wissen ist begrenzt.", autor: "Albert Einstein" },
    { id: 3, text: "Ich bin müde, Boss. Müde, immer unterwegs zu sein, einsam und verlassen. Müde, niemals einen Freund zu haben, der mir sagt, wohin wir gehen, woher wir kommen und warum. Am meisten müde bin ich, Menschen zu sehen, die hässlich zueinander sind. Der Schmerz auf der Welt und das viele Leid, das macht mich sehr müde. Es ist, als wären in meinem Kopf lauter Glasscherben.", autor: "John Coffey" },
    { id: 4, text: "Was dich nicht herausfordert, verändert dich auch nicht.", autor: "Fred Devito" },
    { id: 5, text: "Du kannst deine Augen schließen, wenn du etwas nicht sehen willst, aber du kannst nicht dein Herz verschließen, wenn du etwas nicht fühlen willst.", autor: "Johnny Depp" },
    { id: 6, text: "Das Leben ist wie Fahrrad fahren. Um die Balance zu halten, musst du in Bewegung bleiben.", autor: "Albert Einstein" },
    { id: 7, text: "Sei du selbst die Veränderung, die du dir wünschst für diese Welt.", autor: "Mahatma Gandhi" }
];

// ENDPUNKT 1: Alle Sprüche holen (GET)
// Wenn das Frontend die URL /api/sprueche aufruft, passiert das hier:
app.get('/api/sprueche', (req, res) => {
    res.json(sprueche);
});

// ENDPUNKT 2: Einen neuen Spruch speichern (POST)
app.post('/api/sprueche', (req, res) => {
    // Die Daten, die das Frontend schickt, sind in req.body
    const neuerSpruch = {
        // Robustere ID-Generierung: Finde die höchste ID und erhöhe sie, oder starte bei 1
        id: sprueche.length > 0 ? Math.max(...sprueche.map(s => s.id)) + 1 : 1,
        text: req.body.text,
        autor: req.body.autor
    };

    // Füge den neuen Spruch zu unserem Array hinzu
    sprueche.push(neuerSpruch);

    // Schicke eine Erfolgsmeldung zurück (Status 201 = Created)
    res.status(201).json(neuerSpruch); // Sende den neu erstellten Spruch zurück
});

// ENDPUNKT 3: Einen bestimmten Spruch löschen (DELETE)
app.delete('/api/sprueche/:id', (req, res) => {
    // Die ID aus der URL bekommen wir über req.params.id
    const idZumLoeschen = parseInt(req.params.id); // Wichtig: in eine Zahl umwandeln!

    // Finde den Index des Spruchs mit der richtigen ID
    const indexZumLoeschen = sprueche.findIndex(spruch => spruch.id === idZumLoeschen);

    if (indexZumLoeschen === -1) {
        return res.status(404).json({ error: 'Spruch nicht gefunden' });
    }

    // Entferne den Spruch aus dem Array
    sprueche.splice(indexZumLoeschen, 1);

    console.log(`Spruch mit ID ${idZumLoeschen} wurde gelöscht.`);
    res.status(204).send(); // 204 = Erfolg, aber keine Daten werden zurückgeschickt
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});