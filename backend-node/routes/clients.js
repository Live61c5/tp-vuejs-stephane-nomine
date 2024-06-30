const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/clients.js");

// on déclare les routes de /clients, donc /clients correspond ici à /
// récupère tous les clients
router.get("/", ctrl.getAll);

// récupère une seul client en fonction de son :id
router.get("/:id", ctrl.getOne);

// on crée un nouveau client
router.post("/", ctrl.postOne);

// on modifie un client existant
router.patch("/:id", ctrl.patchOne);

// on supprime un client
router.delete("/:id", ctrl.deleteOne);

module.exports = router;
