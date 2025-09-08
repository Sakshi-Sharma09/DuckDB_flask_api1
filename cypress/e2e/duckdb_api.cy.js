describe('DuckDB Flask API Regression Tests', () => {

    // -------------------------
    // Test 1: Upload flat JSON + metadata
    // -------------------------
    it('Uploads flat JSON and checks metadata', () => {
      cy.fixture('flat.json').then((data) => {
        cy.request('POST', 'http://127.0.0.1:5001/upload?table=test1', data)
          .then(() => {
            cy.request('GET', 'http://127.0.0.1:5001/metadata/test1').then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body.rows).to.eq(2);
              expect(response.body.columns).to.eq(3);
            });
          });
      });
    });
  
    // -------------------------
    // Test 2: Upload nested JSON + query nested fields
    // -------------------------
    it('Uploads nested JSON and queries nested fields', () => {
      cy.fixture('nested.json').then((data) => {
        cy.request('POST', 'http://127.0.0.1:5001/upload?table=test2', data)
          .then(() => {
            cy.request('POST', 'http://127.0.0.1:5001/query', {
              sql: "SELECT id, user.name AS name, user.age AS age, address.city AS city FROM test2"
            }).then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body).to.deep.include.members([
                { id: 1, name: "Alice", age: 25, city: "Delhi" },
                { id: 2, name: "Bob", age: 30, city: "Mumbai" }
              ]);
            });
          });
      });
    });
  
    // -------------------------
    // Test 3: List tables
    // -------------------------
    it('Lists tables', () => {
      cy.request('GET', 'http://127.0.0.1:5001/tables').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.include.members(["test1", "test2"]);
      });
    });
  
    // -------------------------
    // Test 4: List columns
    // -------------------------
    it('Lists columns for flat JSON', () => {
      cy.request('GET', 'http://127.0.0.1:5001/columns/test1').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
        expect(response.body[0]).to.have.property("name");
        expect(response.body[0]).to.have.property("type");
      });
    });
  
    // -------------------------
    // Test 5: Schema check
    // -------------------------
    it('Checks schema for nested JSON', () => {
      cy.request('GET', 'http://127.0.0.1:5001/schema/test2').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body[0]).to.have.property("name");
        expect(response.body[0]).to.have.property("type");
      });
    });
  
    // -------------------------
    // Test 6: Custom query
    // -------------------------
    it('Runs custom SQL query on flat JSON', () => {
      cy.request('POST', 'http://127.0.0.1:5001/query', {
        sql: "SELECT name, age FROM test1 WHERE age > 25"
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.include.members([
          { name: "Bob", age: 30 }
        ]);
      });
    });
  
    // -------------------------
    // Test 7: Upload array of objects JSON
    // -------------------------
    it('Uploads array of objects JSON and queries', () => {
      cy.fixture('array_of_objects.json').then((data) => {
        cy.request('POST', 'http://127.0.0.1:5001/upload?table=drugs', data)
          .then(() => {
            cy.request('POST', 'http://127.0.0.1:5001/query', {
              sql: "SELECT id, drug FROM drugs"
            }).then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body).to.deep.include.members([
                { id: 1, drug: "Paracetamol" },
                { id: 2, drug: "Ibuprofen" }
              ]);
            });
          });
      });
    });
  
    // -------------------------
    // Test 8: Handle empty JSON
    // -------------------------
    it('Handles empty JSON gracefully', () => {
      cy.fixture('empty.json').then((data) => {
        cy.request('POST', 'http://127.0.0.1:5001/upload?table=empty_table', data)
          .then(() => {
            cy.request('GET', 'http://127.0.0.1:5001/metadata/empty_table').then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body.rows).to.eq(0);
            });
          });
      });
    });
  
    // -------------------------
    // Test 9: Handle malformed / non-JSON payload
    // -------------------------
    it('Handles non-JSON payload with error', () => {
      const malformedPayload = '{"name": "Alice", "age": 30,,}'; // broken JSON
  
      cy.request({
        method: 'POST',
        url: 'http://127.0.0.1:5001/upload?table=invalid',
        body: malformedPayload,
        failOnStatusCode: false,
        headers: { 'Content-Type': 'application/json' }
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 500]);
      });
    });
  
    // -------------------------
    // Test 10: Upload duplicate data
    // -------------------------
    it('Handles duplicate upload gracefully', () => {
      cy.fixture('flat.json').then((data) => {
        // First upload
        cy.request('POST', 'http://127.0.0.1:5001/upload?table=test1', data).then(() => {
          // Second upload of the same data
          cy.request({
            method: 'POST',
            url: 'http://127.0.0.1:5001/upload?table=test1',
            body: data,
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.be.oneOf([200, 400, 409]);
  
            // Optional: validate row count to confirm behavior
            cy.request('GET', 'http://127.0.0.1:5001/metadata/test1').then((res) => {
              expect(res.status).to.eq(200);
              expect(res.body.rows).to.be.greaterThan(0); // should have rows
            });
          });
        });
      });
    });
  
  });
  
  