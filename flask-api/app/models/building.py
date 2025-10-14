#Represents an individual building inside a complex

from app import db
from datetime import datetime

class Building(db.Model):

    __tablename__ = 'buildings'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable = False)
    address = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

 # Foreign key: each building belongs to one complex
    complex_id = db.Column(db.Integer, db.ForeignKey('complexes.id'), nullable=False)
  
  #relationship to admins with cascade delete
    admins = db.relationship('Admin', backref='building', cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            'id' : self.id,
            'name' : self.name,
            'address' : self.address,
            'complex_id' : self.complex_id,
            'created_at' : self.created_at.isoformat() if self.created_at else None
        }