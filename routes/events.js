const express = require("express");
const router = express.Router();

const events = [
    { id: 1, name: "Ziua mea", date: "2025-09-15" },
    { id: 2, name: "Examen", date: "2025-09-20" },
    { id: 3, name: "Concert", date: "2025-09-25" },
    { id: 4, name: "Vacanță", date: "2025-10-01" },
    { id: 5, name: "Training", date: "2025-10-05" },
    { id: 6, name: "Hackathon", date: "2025-10-10" },
    { id: 7, name: "Nuntă", date: "2025-10-15" },
    { id: 8, name: "Film", date: "2025-10-20" },
    { id: 9, name: "Fotbal", date: "2025-10-25" },
    { id: 10, name: "Interviu", date: "2025-10-30" }
];

function checkRole(requiredRole) {
    return (req, res, next) => {
        const role = req.headers["role"];
        if (role !== requiredRole) return res.status(403).json({ error: "Acces interzis" });
        next();
    };
}

// Rute Public
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

// Rute Admin
router.get("/admin/edit/:id", checkRole("admin"), (req, res) => {
    const eventId = parseInt(req.params.id);
    const event = events.find(e => e.id === eventId);
    if (!event) return res.status(404).json({ error: "Evenimentul nu există" });
    res.json({ message: "Admin poate edita acest eveniment", event });
});

module.exports = router; // doar o singură dată
