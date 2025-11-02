from app import db
from app import bcrypt
from app.models.complex import Complex
from app.models.admin import Admin
from datetime import datetime

class ComplexService:
    DEFAULT_PASSWORD = 'Complex@123'

    def get_all(self):
        complexes = Complex.query.all()
        return [c.to_dict() for c in complexes]
    

    def get_by_id(self, complex_id):
        complex_obj = Complex.query.get(complex_id)
        return complex_obj.to_dict() if complex_obj else None
    
    
    def create_complex(self, data):

        complex_data = {
            'identity' : data['identity'],
            'address' :  data['address'],
            'campaign_start' :  datetime.fromisoformat(data['campaign_start']),
            'campaign_end' :  datetime.fromisoformat(data['campaign_end']),
        }

        new_complex = Complex(**complex_data)
        db.session.add(new_complex)
        db.session.flush()

        #auto create complex admin
        admin_data = {
            'civility': data.get('civility', 'Mr'),
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'email': data['email'],
            'phone': data.get('phone'),
            'role': data.get('role', 'Building Admin'),  # Default role
            'status': 'active',  # Could be 'pending' if you want approval
            'password_hash': bcrypt.generate_password_hash(self.DEFAULT_PASSWORD).decode('utf-8'),
            'complex_id': new_complex.id
        }
        admin = Admin(**admin_data)
        db.session.add(admin)
        db.session.commit()

        return {
            **new_complex.to_dict(),
            'admin_email': admin.email,
            'admin_password': self.DEFAULT_PASSWORD
        }
    