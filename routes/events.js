const express = require("express");
const router = express.Router();

// Middleware pentru verificarea rolului
function checkRole(requiredRole) {
    return (req, res, next) => {
        const role = req.headers["role"];
        if (role !== requiredRole)
            return res.status(403).json({ error: "Acces interzis" });
        next();
    };
}

// Baza de date temporară (în memorie)
let events = [
    { id: 1, student: "Ion Popescu", name: "Ziua mea", date: "2025-09-15", location: "Chișinău" },
    { id: 2, student: "Maria Ionescu", name: "Examen", date: "2025-09-20", location: "Bălți" },
    { id: 3, student: "Andrei Georgescu", name: "Concert", date: "2025-09-25", location: "Cahul" },
    { id: 4, student: "Elena Dumitrescu", name: "Vacanță", date: "2025-10-01", location: "Orhei" },
    { id: 5, student: "Mihai Popa", name: "Training", date: "2025-10-05", location: "Ungheni" }
];


// --- GET: listare cu majuscule ---
router.get("/list", (req, res) => {
    const upperCaseEvents = events.map((e) => ({
        ...e,
        student: e.student.toUpperCase(),
        name: e.name.toUpperCase(),
    }));
    res.json(upperCaseEvents);
});


// --- GET: detalii după ID ---
router.get("/details/:id", (req, res) => {
    const eventId = parseInt(req.params.id);
    const event = events.find((e) => e.id === eventId);
    if (!event) return res.status(404).json({ error: "Evenimentul nu există" });
    res.json(event);
});


// --- GET: căutare după nume ---
router.get("/search", (req, res) => {
    const { name } = req.query;
    let results = events;
    if (name)
        results = results.filter((e) =>
            e.name.toLowerCase().includes(name.toLowerCase())
        );
    res.json(results);
});


// --- POST: adăugare eveniment (validare manuală) ---
router.post("/admin/add", checkRole("admin"), (req, res) => {
    const { name, student, date, location, description } = req.body;

    if (!name || typeof name !== "string" || name.length < 3)
        return res.status(400).json({ error: "Numele este invalid (min 3 caractere)" });
    if (!student || typeof student !== "string" || student.length < 3)
        return res.status(400).json({ error: "Numele studentului este invalid (min 3 caractere)" });
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date))
        return res.status(400).json({ error: "Data trebuie să fie în format YYYY-MM-DD" });

    const newId = events.length ? events[events.length - 1].id + 1 : 1;
    const newEvent = { id: newId, name, student, date, location, description };
    events.push(newEvent);

    res.status(201).json({ message: "Eveniment adăugat", event: newEvent });
});


// --- PUT: actualizare completă ---
router.put("/admin/edit/:id", checkRole("admin"), (req, res) => {
    const eventId = parseInt(req.params.id);
    const event = events.find((e) => e.id === eventId);
    if (!event) return res.status(404).json({ error: "Evenimentul nu există" });

    const { name, student, date, location, description } = req.body;

    if (!name || typeof name !== "string" || name.length < 3)
        return res.status(400).json({ error: "Numele este invalid (min 3 caractere)" });
    if (!student || typeof student !== "string" || student.length < 3)
        return res.status(400).json({ error: "Numele studentului este invalid (min 3 caractere)" });
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date))
        return res.status(400).json({ error: "Data trebuie să fie în format YYYY-MM-DD" });

    Object.assign(event, { name, student, date, location, description });
    res.json({ message: "Eveniment modificat", event });
});


// --- DELETE: ștergere ---
router.delete("/admin/delete/:id", checkRole("admin"), (req, res) => {
    const eventId = parseInt(req.params.id);
    const index = events.findIndex((e) => e.id === eventId);
    if (index === -1) return res.status(404).json({ error: "Evenimentul nu există" });

    const deleted = events.splice(index, 1);
    res.json({ message: "Eveniment șters", event: deleted[0] });
});


// --Cautare dupa o anumita cerinta--//
router.get("/events/field/:field", (req, res) => {
    const field = req.params.field;

    if (!["id", "name", "student", "date", "location", "description"].includes(field)) {
        return res.status(400).json({ error: "Câmp invalid" });
    }

    const filtered = events.map(event => event[field]);
    res.json(filtered);
});


// --- GET: evenimente cu câmpuri personalizate ---
router.get("/events/custom", (req, res) => {
    const { fields } = req.query;
    
    // Dacă nu sunt specificate câmpuri, returnează toate
    if (!fields) {
        return res.json(events);
    }

    // Convertește string-ul de câmpuri într-un array (ex: "name,id,location")
    const requestedFields = fields.split(',').map(f => f.trim());
    
    // Verifică dacă toate câmpurile sunt valide
    const validFields = ["id", "name", "student", "date", "location", "description"];
    const invalidFields = requestedFields.filter(f => !validFields.includes(f));
    
    if (invalidFields.length > 0) {
        return res.status(400).json({ 
            error: "Câmpuri invalide", 
            invalidFields,
            validFields 
        });
    }

    // Filtrează evenimentele și returnează doar câmpurile cerute
    const filteredEvents = events.map(event => {
        const filteredEvent = {};
        requestedFields.forEach(field => {
            filteredEvent[field] = event[field];
        });
        return filteredEvent;
    });

    res.json(filteredEvents);
});

module.exports = router;
