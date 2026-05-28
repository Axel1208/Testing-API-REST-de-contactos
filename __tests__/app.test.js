const request = require("supertest");

const { app, resetData } =
   require("../src/app");

describe("Contacts API", () => {

    beforeEach(() => {
         resetData();
    });

   test("GET /api/contacts devuelve array", async () => {

      const response =
         await request(app)
            .get("/api/contacts");

      expect(response.status).toBe(200);

      expect(Array.isArray(response.body))
         .toBe(true);
   });

   test("POST /api/contacts crea contacto", async () => {

      const response =
         await request(app)
            .post("/api/contacts")
            .send({
               name: "Juan",
               email: "juan@gmail.com"
            });

      expect(response.status).toBe(201);

      expect(response.body.name)
         .toBe("Juan");
   });

   test("GET /api/contacts/:id devuelve contacto", async () => {

      const created =
         await request(app)
            .post("/api/contacts")
            .send({
               name: "Pedro",
               email: "pedro@gmail.com"
            });

      const response =
         await request(app)
            .get(`/api/contacts/${created.body.id}`);

      expect(response.status).toBe(200);

      expect(response.body.name)
         .toBe("Pedro");
   });

   test("GET /api/contacts/:id devuelve 404", async () => {

      const response =
         await request(app)
            .get("/api/contacts/999");

      expect(response.status).toBe(404);
   });

   test("POST /api/contacts devuelve 400 si falta name", async () => {

      const response =
         await request(app)
            .post("/api/contacts")
            .send({
               email: "test@gmail.com"
            });

      expect(response.status).toBe(400);
   });

   test("POST /api/contacts devuelve 400 si email inválido", async () => {

      const response =
         await request(app)
            .post("/api/contacts")
            .send({
               name: "Juan",
               email: "juanmail.com"
            });

      expect(response.status).toBe(400);
   });

   test("PUT /api/contacts/:id actualiza contacto", async () => {

      const created =
         await request(app)
            .post("/api/contacts")
            .send({
               name: "Carlos",
               email: "carlos@gmail.com"
            });

      const response =
         await request(app)
            .put(`/api/contacts/${created.body.id}`)
            .send({
               phone: "123456"
            });

      expect(response.status).toBe(200);

      expect(response.body.phone)
         .toBe("123456");
   });

   test("DELETE /api/contacts/:id elimina contacto", async () => {

      const created =
         await request(app)
            .post("/api/contacts")
            .send({
               name: "Ana",
               email: "ana@gmail.com"
            });

      const response =
         await request(app)
            .delete(`/api/contacts/${created.body.id}`);

      expect(response.status).toBe(200);

      expect(response.body.message)
         .toBe("Contacto eliminado");
   });

   test("DELETE /api/contacts/:id devuelve 404", async () => {

      const response =
         await request(app)
            .delete("/api/contacts/999");

      expect(response.status).toBe(404);
   });

});