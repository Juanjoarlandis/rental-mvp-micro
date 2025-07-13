from sqlalchemy import Column, Integer, String
from app.models.database import Base   # usa SIEMPRE la misma Base

class User(Base):
    __tablename__ = "users"
    id        = Column(Integer, primary_key=True)
    username  = Column(String, unique=True, index=True, nullable=False)
    email     = Column(String, unique=True, index=True, nullable=False)
    hashed_pw = Column(String, nullable=False)
