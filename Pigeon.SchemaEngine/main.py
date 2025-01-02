from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
import base64
import os
from schema import Schema, SchemaCRUD
from generator import GenSchema , dispatchGenSchema , ExponentPushToken
import requests
import json


app = FastAPI()
crud = SchemaCRUD()

@app.middleware("http")
async def AuthMiddleware(request: Request, next):
    auth = request.headers.get('Authorization')        
    if auth != os.environ["SCHEMA_ENGINE_AUTH"]:
        return JSONResponse(None, 401, {"WWW-Authenticate": "Basic"})
    return await next(request)


@app.get("/schema")
async def getSchemas(skip: int = 0, limit: int = -1):
    try:
        schemas = crud.getSchemas(skip, limit)
        return schemas
    except:
        return JSONResponse(None, 500)

@app.get("/schema/{schema_id}")
async def getSchemaByID(schema_id: str):
    try:
        schema = crud.getSchemaByID(schema_id)
        return schema
    except:
        return JSONResponse({"message" : f"schema_id {schema_id} not found in db"}, 404)

@app.post("/schema")
async def createSchema(request: Request):
    try:
        data = await request.json()
        name = data.get("name")
        title = data.get("title")
        body = data.get("body")
        schema = crud.create(name, title, body)
        return schema
    except:
        return JSONResponse({"message" : "Invalid Schema"}, 406)

@app.delete("/schema/{schema_id}")
async def deleteSchema(schema_id: str):
    try:
        schema = crud.deleteSchema(schema_id)
        return schema
    except:
        return JSONResponse({"message" : f"schema_id {schema_id} not found in db"}, 404)

@app.post("/dispatch/{schema_id}")
async def dispatchSchema(schema_id: str, request: Request):
    try:
        data = await request.json()
        targets = data.get("targets", [])
        scheduled_at = data.get("scheduled_at")
        targets = list(map(lambda target: ExponentPushToken(target), targets))
    except:
        return JSONResponse({"message" : "Invalid Target Tokens"}, 406)
    try:
        schema = crud.getSchemaByID(schema_id)
        gschema = GenSchema(schema)
        gschema.generate(data.get("params", {}))
        dispatchGenSchema(gschema, targets, scheduled_at)
        return JSONResponse({"message" : "Dispatched"}, 200)
    except:
        return JSONResponse({"message" : "Invalid parameters"}, 406)
