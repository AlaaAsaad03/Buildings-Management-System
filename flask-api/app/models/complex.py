#Represents a group or compound of buildings

from app import db
from datetime import datetime

class Complex(db.Model):

    __tablename__ = 'complexes'

    id = db.Column(db.Integer, primary_key=True)
    identity = db.Column(db.String(100), unique = True, nullable = False)
    address = db.Column(db.String(255), nullable = False)
    campaign_start = db.Column(db.Date, nullable = False)
    campaign_end = db.Column(db.Date, nullable = False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship: one complex can have many buildings
    buildings = db.relationship(
        'Building',
        backref='complex',
        lazy=True, 
        cascade='all, delete-orphan') # deleting complex deletes its buildings


    def to_dict(self):
        return {
            'id' : self.id,
            'identity' : self.identity,
            'address' : self.address,
            'campaign_start' : self.campaign_start.isoformat(),
            'campaign_end' : self.campaign_end.isoformat(),
            'created_at' : self.created_at.isoformat() if self.created_at else None
        }