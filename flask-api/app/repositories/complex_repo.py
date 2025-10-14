from app import db
from app.models import Complex

class ComplexRepository:

    def finde_all(self):
        return Complex.query.all()
    
    def find_by_id(self, complex_id):
        return Complex.query.get(complex_id)
    
    def find_by_identity(self, identity):
        return Complex.query.filter_by(identity=identity).first()
    
    def create(Self, complex_data):
        new_complex = Complex(**complex_data)
        db.session.add(new_complex)
        db.session.commit()
        return new_complex
    
    def update(self, complex_id, update_data):
        complex_obj = Complex.query.get(complex_id)
        if not complex_obj:
            return None
        for key, value in update_data.items():
            setattr(complex_obj, key, value) # update attributes dynamically

        db.session.commit()
        return complex_obj
    
    def delete(self, complex_id):
        complex_obj = Complex.query.get(complex_id)
        if not complex_obj:
            return False
        db.session.delete(complex_obj)
        db.session.commit()
        return True