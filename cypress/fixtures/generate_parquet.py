import pandas as pd

df = pd.DataFrame({
    "name": ["Alice", "Bob"],
    "score": [90, 85]
})
df.to_parquet("cypress/fixtures/sample.parquet", index=False)
print("✅ Written cypress/fixtures/sample.parquet")
