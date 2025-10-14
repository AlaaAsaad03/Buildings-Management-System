#Represents admins who may manage either a complex or a specific building

from app import db
from datetime import datetime

class Admin(db.Model):
    __tablename__ = 'admins'

    id = db.Column(db.Integer, primary_key=True)
    civility = db.Column(db.String(10)) #Mr, Ms, Dr...
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    #Foreign Keys
    complex_id = db.Column(db.Integer, db.ForeignKey('complexes.id'), nullable=True)
    building_id = db.Column(db.Integer,db.ForeignKey('buildings.id'), nullable=True)
 
    # return JSON for app
    def to_dict(self):
        return {
            'id' : self.id,
            'civility' : self.civility,
            'first_name' : self.first_name,
            'last_name' : self.last_name,
            'email' : self.email,
            'phone' : self.phone,
            'role' : self.role,
            'status' : self.status,
            'created_at' : self.created_at.isoformat() if self.created_at else None
        }

