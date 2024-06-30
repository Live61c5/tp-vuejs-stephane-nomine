const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { getAll, postOne, patchOne } = require("./bills");
module.exports = {
  getAll: (req, res) => {
    try {
      const data = fs.readFileSync(
        path.resolve(__dirname, "../db/clients.json")
      );
      res.send(data);
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },

  getOne: (req, res) => {
    try {
      const data = fs.readFileSync(
        path.resolve(__dirname, "../db/clients.json")
      );
      const clients = JSON.parse(data);
      const id = req.params.id;
      const client = clients.find((client) => client.id == id);
      if (client) {
        res.json(client);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },
  postOne: (req, res) => {
    try {
      const data = fs.readFileSync(
        path.resolve(__dirname, "../db/clients.json")
      );
      const clients = JSON.parse(data);
      const { id, ...restBody } = req.body;
      const newClient = { id: uuidv4(), ...restBody };
      clients.push(newClient);
      fs.writeFileSync(
        path.resolve(__dirname, "../db/clients.json"),
        JSON.stringify(clients)
      );
      res.json(newClient);
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },
  patchOne: (req, res) => {
    try {
      const data = fs.readFileSync(
        path.resolve(__dirname, "../db/clients.json")
      );
      let clients = JSON.parse(data);
      const id = req.params.id;
      let clientIndex = clients.findIndex((client) => client.id == id);
      if (clientIndex !== -1) {
        clients[clientIndex] = {
          ...clients[clientIndex],
          ...req.body,
        };
      } else {
        res.sendStatus(404);
        return;
      }

      fs.writeFileSync(
        path.resolve(__dirname, "../db/clients.json"),
        JSON.stringify(clients)
      );
      res.json(clients[clientIndex]);
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },
  deleteOne: (req, res) => {
    try {
      const data = fs.readFileSync(
        path.resolve(__dirname, "../db/clients.json")
      );
      let clients = JSON.parse(data);
      const id = req.params.id;

      const clientIndex = clients.findIndex((client) => client.id == id);
      if (clientIndex === -1) {
        res.sendStatus(404);
        return;
      }

      clients.splice(clientIndex, 1);

      fs.writeFileSync(
        path.resolve(__dirname, "../db/clients.json"),
        JSON.stringify(clients)
      );

      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },
};
