echo "# 🚀 Additional Connectors - Cypress Testing Guide

This repository demonstrates **Cypress testing** of connectors along with running a **Python backend API**.  
Follow the step-by-step guide below 👇

---

## 🛠️ 1. Clone the Repository
\`\`\`bash
git clone https://github.com/Connectors-Test/additional_connectors.git
cd additional_connectors
\`\`\`

---

## 📦 2. Install Dependencies

### 🔹 Python dependencies
Make sure you are in the backend folder where \`app.py\` exists.  
(If you use a virtual environment, activate it first.)

\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 🔹 Node.js dependencies
Install Cypress:

\`\`\`bash
npm install cypress --save-dev
\`\`\`

---

## 📝 3. Update Test File
Navigate to your Cypress test folder and edit the test file:

\`\`\`bash
cd cypress/e2e
nano duckdb_api.cy.js
\`\`\`

- Replace the JSON inside **duckdb_api.cy.js** with your test input format.  
- Adjust the path according to **your system's project folder** if different.  
- Save and exit the editor.

---

## ▶️ 4. Start the Backend API
From the project root where \`app.py\` is located, run:

\`\`\`bash
python3 app.py
\`\`\`

By default, the Flask API will run at:
\`\`\`
http://127.0.0.1:5001
\`\`\`

👉 Keep this running while executing Cypress tests.

---

## ✅ 5. Run Cypress Tests

### Headless mode (CLI)
\`\`\`bash
npx cypress run
\`\`\`

### Interactive mode (GUI)
\`\`\`bash
npx cypress open
\`\`\`

This opens the Cypress Test Runner where you can manually select and run test files.

---

## 📂 6. Test Artifacts
- 📸 Screenshots of failed tests → \`cypress/screenshots/\`  
- 🎥 Videos of test runs (if enabled) → \`cypress/videos/\`

---

## 💡 7. Notes & Best Practices
- Ensure the **Flask API** (\`app.py\`) is running before executing Cypress tests.  
- Keep your **test data JSON** format consistent across \`duckdb_api.cy.js\`.  
- For **regression testing**, place multiple JSON formats in \`cypress/fixtures/\` and reference them in test scripts.  
- Always run:
  \`\`\`bash
  git pull origin main
  \`\`\`
  before making local changes to stay updated.

---

✨ Happy Testing with Cypress + Python! ✨
" > README.md
