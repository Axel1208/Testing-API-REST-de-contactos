const request = require('supertest');

const { app, resetContacts } =
   require('../src/app');

describe('Contacts API', () => {

   beforeEach(() => {
      resetContacts();
   });

   /*
      BLOQUE A
   */

   test('POST devuelve 400 cuando email es "@"', async () => {

      const response =
         await request(app)
            .post('/api/contacts')
            .send({
               name: 'Juan',
               email: '@'
            });

      expect(response.status).toBe(400);

   });

   test('POST acepta email válido', async () => {

      const response =
         await request(app)
            .post('/api/contacts')
            .send({
               name: 'Juan',
               email: 'juan@gmail.com'
            });

      expect(response.status).toBe(201);

   });

   /*
      BLOQUE B
   */

   test('POST devuelve 409 si email ya existe', async () => {

      await request(app)
         .post('/api/contacts')
         .send({
            name: 'Carlos',
            email: 'carlos@gmail.com'
         });

      const response =
         await request(app)
            .post('/api/contacts')
            .send({
               name: 'Pedro',
               email: 'carlos@gmail.com'
            });

      expect(response.status).toBe(409);

   });

   test('POST detecta duplicados case insensitive', async () => {

      await request(app)
         .post('/api/contacts')
         .send({
            name: 'Ana',
            email: 'ana@gmail.com'
         });

      const response =
         await request(app)
            .post('/api/contacts')
            .send({
               name: 'Luis',
               email: 'ANA@GMAIL.COM'
            });

      expect(response.status).toBe(409);

   });

   /*
      BLOQUE C
   */

   test('?search=ana devuelve coincidencias', async () => {

      const response =
         await request(app)
            .get('/api/contacts?search=ana');

      expect(response.status).toBe(200);

      expect(response.body.length)
         .toBeGreaterThan(0);

   });

   test('?favorite=true devuelve favoritos', async () => {

      const response =
         await request(app)
            .get('/api/contacts?favorite=true');

      expect(response.status).toBe(200);

      expect(response.body.length)
         .toBe(1);

      expect(response.body[0].favorite)
         .toBe(true);

   });

   /*
      BLOQUE D
   */

   test('PATCH cambia favorite false -> true', async () => {

      const response =
         await request(app)
            .patch('/api/contacts/1/favorite');

      expect(response.status).toBe(200);

      expect(response.body.favorite)
         .toBe(true);

   });

   test('PATCH devuelve 404 si no existe', async () => {

      const response =
         await request(app)
            .patch('/api/contacts/999/favorite');

      expect(response.status).toBe(404);

   });

   /*
      BLOQUE E
   */

   test('PUT actualiza solo name', async () => {

      const response =
         await request(app)
            .put('/api/contacts/1')
            .send({
               name: 'Nuevo Nombre'
            });

      expect(response.status).toBe(200);

      expect(response.body.name)
         .toBe('Nuevo Nombre');

   });

   test('PUT devuelve 400 email inválido', async () => {

      const response =
         await request(app)
            .put('/api/contacts/1')
            .send({
               email: 'correo-mal'
            });

      expect(response.status).toBe(400);

   });

   test('PUT devuelve 409 si email ya existe', async () => {

      const response =
         await request(app)
            .put('/api/contacts/1')
            .send({
               email: 'luis@example.com'
            });

      expect(response.status).toBe(409);

   });

   test('PUT permite mismo email del mismo contacto', async () => {

      const response =
         await request(app)
            .put('/api/contacts/1')
            .send({
               email: 'ana@example.com'
            });

      expect(response.status).toBe(200);

   });

   /*
      BLOQUE F
   */

   test('Ruta inexistente devuelve 404 JSON', async () => {

      const response =
         await request(app)
            .get('/api/ruta-falsa');

      expect(response.status).toBe(404);

      expect(response.headers['content-type'])
         .toMatch(/json/);

   });

   test('Error contiene status y error', async () => {

      const response =
         await request(app)
            .get('/api/ruta-falsa');

      expect(response.body.status)
         .toBe(404);

      expect(response.body.error)
         .toBeDefined();

   });

});