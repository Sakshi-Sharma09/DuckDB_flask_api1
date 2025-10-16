# 🦆 DuckDB + Flask JSON → Parquet Converter API

This project provides a simple, fast, and serverless-ready **Flask API** that allows users to:
- Upload JSON or Parquet data
- Automatically create DuckDB in-memory tables
- Run SQL queries on the data
- Retrieve metadata, schema, and table details
- Export or convert data to Parquet format

Built with:
- ⚙️ Flask — lightweight Python web framework  
- 🐤 DuckDB — in-memory analytical database engine  
- 🧠 Pandas & PyArrow — for data transformation and Parquet conversion  

---

## 🚀 Features

✅ Upload JSON or Parquet files  
✅ Automatically infer schema and create DuckDB tables  
✅ Run SQL queries on uploaded data  
✅ Get table metadata (row & column count)  
✅ Retrieve schema and column details  
✅ Deploy easily to Render or any cloud platform  

---

## 🗂️ API Endpoints

| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/upload` | POST | Upload JSON or Parquet and create table |
| `/tables` | GET | List all existing DuckDB tables |
| `/columns/<table>` | GET | List columns of a specific table |
| `/schema/<table>` | GET | Retrieve table schema |
| `/metadata/<table>` | GET | Get table metadata (rows, columns) |
| `/query` | POST | Execute a custom SQL query on DuckDB |

---

## 🧰 Example Usage

### ▶️ Upload JSON
```bash
curl -X POST http://localhost:5000/upload \
     -H "Content-Type: application/json" \
     -d '{"name": ["Alice", "Bob"], "age": [30, 25]}'

  before making local changes to stay updated.

---

✨ Happy Testing with Cypress + Python! ✨
" > README.md
