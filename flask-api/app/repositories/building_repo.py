from app import db
from app.models import Building

class BuildingRepository:

    def find_all(self, complex_id=None):
        query = Building.query
        if complex_id:
            query = query.filter_by(complex_id=complex_id)
        return query.all()

    def find_by_id(self, building_id):
        return Building.query.get(building_id)
    
    def find_by_complex(self, complex_id):
        return Building.query.filter_by(complex_id=complex_id).all()
    
    def create(self, building_data):
        new_building = Building(**building_data)
        db.session.add(new_building)
        db.session.commit()
        return new_building
    
    def update(self, building_id, update_data):
        building_obj = Building.query.get(building_id)
        if not building_obj:
            return None
        for key, value in update_data.items():
            setattr(building_obj, key, value) # update attributes dynamically

        db.session.commit()
        return building_obj
    
    def delete(self, building_id):
        building_obj = Building.query.get(building_id)
        if not building_obj:
            return False
        db.session.delete(building_obj)
        db.session.commit()
        return True