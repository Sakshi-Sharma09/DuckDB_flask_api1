from flask import Flask, request, jsonify
import duckdb
import os
import json

app = Flask(__name__)
con = duckdb.connect(database=":memory:")

# ------------------------------
# Upload JSON and create table
# ------------------------------
@app.route("/upload", methods=["POST"])
def upload_json():
    data = request.get_json(force=True)
    table_name = request.args.get("table", "uploaded_data")

    tmp_file = f"{table_name}.json"
    with open(tmp_file, "w") as f:
        json.dump(data, f)

    # Keep table name case as-is by quoting it
    con.execute(
        f'CREATE OR REPLACE TABLE "{table_name}" AS SELECT * FROM read_json_auto("{tmp_file}")'
    )

    os.remove(tmp_file)
    return jsonify({"status": "success", "table": table_name})

# ------------------------------
# List tables
# ------------------------------
@app.route("/tables", methods=["GET"])
def list_tables():
    tables = con.execute("SHOW TABLES").fetchall()
    return jsonify([t[0] for t in tables])

# ------------------------------
# List columns
# ------------------------------
@app.route("/columns/<table>", methods=["GET"])
def list_columns(table):
    try:
        cols = con.execute(f'DESCRIBE "{table}"').fetchall()
        return jsonify([{"name": c[0], "type": c[1]} for c in cols])
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ------------------------------
# Table schema
# ------------------------------
@app.route("/schema/<table>", methods=["GET"])
def schema(table):
    """Return full schema of a table"""
    try:
        schema_result = con.execute(
            f"""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name='{table}'
            """
        ).fetchall()
        return jsonify([{"name": c[0], "type": c[1]} for c in schema_result])
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ------------------------------
# Run custom SQL query
# ------------------------------
@app.route("/query", methods=["POST"])
def query():
    try:
        sql = request.json.get("sql")
        result = con.execute(sql).fetchdf()
        return result.to_json(orient="records")
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
# ------------------------------
# Table metadata
# ------------------------------
@app.route("/metadata/<table>", methods=["GET"])
def metadata(table):
    """Return basic metadata: number of rows and columns"""
    try:
        # Count rows
        row_count = con.execute(f'SELECT COUNT(*) FROM "{table}"').fetchone()[0]
        # Count columns
        cols = con.execute(f'DESCRIBE "{table}"').fetchall()
        column_count = len(cols)
        return jsonify({
            "table": table,
            "rows": row_count,
            "columns": column_count
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ------------------------------
# Run app
# ------------------------------
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)



