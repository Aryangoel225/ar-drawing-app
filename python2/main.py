# write a fastapi hello world

import fastapi

app = fastapi.FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

# Run the FastAPI app with uvicorn
# uvicorn main:app --reload
