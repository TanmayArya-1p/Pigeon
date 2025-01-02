from sqlalchemy import create_engine, Column, String, Text, ARRAY
from sqlalchemy.dialects.postgresql import UUID as SQLAlchemyUUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import uuid
import re
from dotenv import load_dotenv
load_dotenv()
USER = os.environ.get("SUPABASE_USER")
PASSWORD = os.environ.get("SUPABASE_PASSWORD")
HOST = os.environ.get("SUPABASE_HOST")
PORT = os.environ.get("SUPABASE_PORT")
DBNAME = "postgres"

DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}"


engine = create_engine(DATABASE_URL)
Base = declarative_base()


class Schema(Base):
    __tablename__ = 'schemas'
    id = Column(SQLAlchemyUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    params = Column(ARRAY(String), nullable=False)

Base.metadata.create_all(engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class SchemaCRUD:
    def __init__(self):
        self.db = SessionLocal()


    def __extract_params(title: str, body: str):
        pattern = r"\{(.*?)\}"
        params = set(re.findall(pattern, title) + re.findall(pattern, body))
        return list(params)

    def create(self, name: str, title: str, body: str):
        params = SchemaCRUD.__extract_params(title, body)
        new_schema = Schema(name=name, title=title, body=body, params=params)
        self.db.add(new_schema)
        self.db.commit()
        self.db.refresh(new_schema)
        return new_schema

    def getSchemaByID(self, schema_id: uuid.UUID):
        schema = self.db.query(Schema).filter(Schema.id == schema_id).first()
        if not schema:
            raise ValueError("Schema not found")
        return schema

    def getSchemas(self, limit: int = -1):
        if(limit == -1):
            return self.db.query(Schema).all()
        return self.db.query(Schema).limit(limit).all()

    def deleteSchema(self, schema_id: uuid.UUID):
        schema = self.db.query(Schema).filter(Schema.id == schema_id).first()
        if not schema:
            raise ValueError("Schema not found")
        self.db.delete(schema)
        self.db.commit()
        return schema

    def close(self):
        self.db.close()
