from app import db
from app.models.building import Building
from app.models.admin import Admin
from app import bcrypt

class BuildingService:
    
    def get_all(self, complex_id=None):
        query = Building.query
        if complex_id:
            query = query.filter_by(complex_id=complex_id)
        buildings = query.all()
        return [building.to_dict() for building in buildings]
    
    def create_building(self, data):
        new_building = Building(
            name=data['name'],
            address=data['address'],
            complex_id=data['complex_id']
        )
        db.session.add(new_building)
        db.session.flush()

        #Auto create admin for the building
        admin_data = {
            'civility': data.get('civility', 'Mr'),
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'email': data['email'],
            'phone': data.get('phone'),
            'role': data.get('role', 'Building Admin'),  # Default role
            'status': 'active',  # Could be 'pending' if you want approval
            'password_hash': bcrypt.generate_password_hash('default123').decode('utf-8'),
            'building_id': new_building.id
        }
        admin = Admin(**admin_data)
        db.session.add(admin)
        db.session.commit()

        return new_building.to_dict()
    
    def delete_building(self, building_id):
        building = Building.query.get(building_id)
        if not building:
            return None, "Building not found"
        
        db.session.delete(building)
        db.session.commit()
    
        return {'message': 'Building and its admin(s) deleted successfully'}, None