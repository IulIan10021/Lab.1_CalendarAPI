const express = require("express");
const router = express.Router();

const events = [
    { id: 1, student: "Ion Popescu", name: "Ziua mea", date: "2025-09-15" },
    { id: 2, student: "Maria Ionescu", name: "Examen", date: "2025-09-20" },
    { id: 3, student: "Andrei Georgescu", name: "Concert", date: "2025-09-25" },
    { id: 4, student: "Elena Dumitrescu", name: "Vacanță", date: "2025-10-01" },
    { id: 5, student: "Mihai Popa", name: "Training", date: "2025-10-05" },
    { id: 6, student: "Carmen Stoica", name: "Hackathon", date: "2025-10-10" },
    { id: 7, student: "Raluca Marinescu", name: "Nuntă", date: "2025-10-15" },
    { id: 8, student: "George Ene", name: "Film", date: "2025-10-20" },
    { id: 9, student: "Alina Pavel", name: "Fotbal", date: "2025-10-25" }
];

//litere majuscule
router.get("/list", (req, res) => {
    const upperCaseEvents = events.map(e => ({
        ...e,
        student: e.student.toUpperCase(),
        name: e.name.toUpperCase()
    }));
    res.json(upperCaseEvents);
});


// Middleware pentru roluri
function checkRole(requiredRole) {
    return (req, res, next) => {
        const role = req.headers["role"];
        if (role !== requiredRole) return res.status(403).json({ error: "Acces interzis" });
        next();
    };
}
//search
router.get("/search", (req, res) => {
    const { student } = req.query;
    if (!student) return res.status(400).json({ error: "Trebuie să specifici ?student=" });

    const results = events.filter(e =>
        e.student.toLowerCase().includes(student.toLowerCase())
    );

    res.json(results);
});

// --- Rute Public ---
router.get("/list", (req, res) => res.json(events));
router.get("/details/:id", (req, res) => {
    const eventId = parseInt(req.params.id);
    const event = events.find(e => e.id === eventId);
    if (!event) return res.status(404).json({ error: "Evenimentul nu există" });
    res.json(event);
});
router.get("/search", (req, res) => {
    const { name, minDate, maxDate } = req.query;
    let results = events;
    if (name) results = results.filter(e => e.name.toLowerCase().includes(name.toLowerCase()));
    if (minDate) results = results.filter(e => e.date >= minDate);
    if (maxDate) results = results.filter(e => e.date <= maxDate);
    res.json(results);
});
router.get("/public/list", (req, res) => res.json(events));

// --- Rute Admin ---
router.put("/admin/edit/:id", checkRole("admin"), (req, res) => {
    const eventId = parseInt(req.params.id);
    const event = events.find(e => e.id === eventId);
    if (!event) return res.status(404).json({ error: "Evenimentul nu există" });

    const { name, date } = req.body;
    if (name) event.name = name;
    if (date) event.date = date;

    res.json({ message: "Eveniment modificat", event });
});

router.delete("/admin/delete/:id", checkRole("admin"), (req, res) => {
    const eventId = parseInt(req.params.id);
    const index = events.findIndex(e => e.id === eventId);
    if (index === -1) return res.status(404).json({ error: "Evenimentul nu există" });

    const deleted = events.splice(index, 1);
    res.json({ message: "Eveniment șters", event: deleted[0] });
});

// POST pentru adăugarea unui eveniment
router.post("/admin/add", checkRole("admin"), (req, res) => {
    const { name, date } = req.body;
    if (!name || !date) return res.status(400).json({ error: "Lipsește name sau date" });

    const newId = events.length ? events[events.length - 1].id + 1 : 1;
    const newEvent = { id: newId, name, date };
    events.push(newEvent);

    res.status(201).json({ message: "Eveniment adăugat", event: newEvent });
});

// --- PATCH pentru modificări parțiale ---
router.patch("/admin/edit/:id", checkRole("admin"), (req, res) => {
    const eventId = parseInt(req.params.id);
    const event = events.find(e => e.id === eventId);
    if (!event) return res.status(404).json({ error: "Evenimentul nu există" });

    // Schimbă doar câmpurile trimise în body
    const { name, date } = req.body;
    if (name) event.name = name;
    if (date) event.date = date;

    res.json({ message: "Eveniment actualizat parțial", event });
});
module.exports = router;
