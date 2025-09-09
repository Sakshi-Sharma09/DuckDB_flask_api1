describe('DuckDB Flask API - Parquet Tests', () => {

    // -------------------------
    // Test 1: Upload Parquet file + query
    // -------------------------
    it('Uploads Parquet file and queries', () => {
      // Load the Parquet fixture as binary
      cy.fixture('sample.parquet', 'binary')
        .then(Cypress.Blob.binaryStringToBlob)
        .then((blob) => {
          // Convert to a File object
          const file = new File([blob], 'sample.parquet', { type: 'application/octet-stream' });
          const formData = new FormData();
          formData.append('file', file);
  
          // Upload to Flask API
          cy.request({
            method: 'POST',
            url: 'http://127.0.0.1:5001/upload?table=parquet_table',
            body: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
          }).then(() => {
            // Run query on uploaded table
            cy.request('POST', 'http://127.0.0.1:5001/query', {
              sql: "SELECT * FROM parquet_table"
            }).then((response) => {
              expect(response.status).to.eq(200);
  
              // Ensure some rows exist
              expect(response.body.length).to.be.greaterThan(0);
  
              // Optional: verify values inside Parquet file
              expect(response.body.map(r => r.name)).to.include.members(["Alice", "Bob"]);
            });
          });
        });
    });
  
    // -------------------------
    // Test 2: Metadata check for Parquet table
    // -------------------------
    it('Checks metadata for Parquet table', () => {
      cy.request('GET', 'http://127.0.0.1:5001/metadata/parquet_table').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.table).to.eq('parquet_table');
        expect(response.body.rows).to.be.greaterThan(0);
        expect(response.body.columns).to.be.greaterThan(0);
      });
    });
  
    // -------------------------
    // Test 3: List columns for Parquet table
    // -------------------------
    it('Lists columns for Parquet table', () => {
      cy.request('GET', 'http://127.0.0.1:5001/columns/parquet_table').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
        expect(response.body[0]).to.have.property("name");
        expect(response.body[0]).to.have.property("type");
      });
    });
  
  });
  
  