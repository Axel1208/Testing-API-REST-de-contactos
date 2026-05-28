const express = require("express");

const app = express();

app.use(express.json());

let contacts = [];
let currentId = 1;

function resetData() {
   contacts = [];
   currentId = 1;
}

app.get("/api/contacts", (req, res) => {

   res.status(200).json(contacts);

});

app.get("/api/contacts/:id", (req, res) => {

   const id = Number(req.params.id);

   const contact =
      contacts.find(c => c.id === id);

   if (!contact) {
      return res
         .status(404)
         .json({ message: "Contacto no encontrado" });
   }

   res.status(200).json(contact);

});

app.post("/api/contacts", (req, res) => {

   const { name, email, phone } = req.body;

   if (!name) {
      return res
         .status(400)
         .json({ message: "Name es requerido" });
   }

   if (!email || !email.includes("@")) {
      return res
         .status(400)
         .json({ message: "Email inválido" });
   }

   const newContact = {
      id: currentId++,
      name,
      email,
      phone
   };

   contacts.push(newContact);

   res.status(201).json(newContact);

});

app.put("/api/contacts/:id", (req, res) => {

   const id = Number(req.params.id);

   const contact =
      contacts.find(c => c.id === id);

   if (!contact) {
      return res
         .status(404)
         .json({ message: "Contacto no encontrado" });
   }

   const { name, email, phone } = req.body;

   if (name) {
      contact.name = name;
   }

   if (email) {
      contact.email = email;
   }

   if (phone) {
      contact.phone = phone;
   }

   res.status(200).json(contact);

});

app.delete("/api/contacts/:id", (req, res) => {

   const id = Number(req.params.id);

   const contact =
      contacts.find(c => c.id === id);

   if (!contact) {
      return res
         .status(404)
         .json({ message: "Contacto no encontrado" });
   }

   contacts =
      contacts.filter(c => c.id !== id);

   res.status(200).json({
      message: "Contacto eliminado"
   });

});

module.exports = {
   app,
   resetData
};