import pandas as pd

# Create a small DataFrame
df = pd.DataFrame({
    'name': ['Alice', 'Bob'],
    'score': [90, 85]
})

# Save the Parquet file in the correct place
df.to_parquet("cypress/fixtures/sample.parquet", index=False)

print("✅ sample.parquet generated in cypress/fixtures/")

