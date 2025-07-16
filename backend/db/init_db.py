from db.session import engine, Base
from models import user  # import all models here

def init_db():
    Base.metadata.create_all(bind=engine)
