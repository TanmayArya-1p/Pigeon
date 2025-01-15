from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
import base64
import os
from schema import Schema, SchemaCRUD
from generator import GenSchema , dispatchGenSchema , ExponentPushToken
import requests
import json
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response


load_dotenv()
app = FastAPI(title="Pigeon Schema Engine" , version="0.1.0")



crud = SchemaCRUD()


@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    if request.method == "OPTIONS":
        response = Response()
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


# @app.middleware("http")
# async def AuthMiddleware(request: Request, next):
#     auth = request.headers.get('Authorization')        
#     if auth != os.environ["SCHEMA_ENGINE_AUTH_SECRET"] and request.url.path not in ["/docs" , "/redoc" , "/openapi.json"]:
#         return JSONResponse("Unauthorized", 401)
#     return await next(request)




@app.get("/ping")
async def ping():
    return "pong"

@app.get("/schema")
async def getSchemas(limit: int = -1):
    try:
        schemas = crud.getSchemas(limit)
        return schemas
    except Exception as e:
        crud.db.rollback()
        return JSONResponse(None, 500)

@app.get("/schema/{schema_id}")
async def getSchemaByID(schema_id: str):
    try:
        schema = crud.getSchemaByID(schema_id)
        return schema
    except:
        crud.db.rollback()
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
        crud.db.rollback()
        return JSONResponse({"message" : "Invalid Schema"}, 406)

@app.delete("/schema/{schema_id}")
async def deleteSchema(schema_id: str):
    try:
        schema = crud.deleteSchema(schema_id)
        return schema
    except:
        crud.db.rollback()
        return JSONResponse({"message" : f"schema_id {schema_id} not found in db"}, 404)

@app.post("/dispatch/{schema_id}")
async def dispatchSchema(schema_id: str, request: Request):
    try:
        data = await request.json()
        targets = data.get("targets", [])
        scheduled_at = data.get("scheduled_at")
        #print(ExponentPushToken(targets[0]))
        targets = list(map(lambda target: ExponentPushToken(target), targets))
    except Exception as e:
        print(e)
        return JSONResponse({"message" : "Invalid Target Tokens"}, 406)
    try:
        schema = crud.getSchemaByID(schema_id)
        gschema = GenSchema(schema)
        gschema.generate(data.get("params", {}))
        dispatchGenSchema(gschema, targets, scheduled_at)
        return gschema.schema
    except Exception as e:
        print(e)
        return JSONResponse({"message" : "Invalid parameters"}, 406)



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)