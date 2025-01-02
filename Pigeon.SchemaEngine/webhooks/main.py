from fastapi import Request, FastAPI

app = FastAPI()

@app.post("/webhook/{webhook_id}")
async def webhook(webhook_id: str, request: Request):
    return {"webhook_id": webhook_id, "request": await request.json()}

