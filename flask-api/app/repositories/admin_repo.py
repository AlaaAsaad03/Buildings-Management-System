from app import db
from app.models import Admin

class AdminRepository:

    def find_by_email(self, email):
        return Admin.query.filter_by(email=email).first()
    
    def find_by_id(self, admin_id):
        return Admin.query.get(admin_id)
    
    # Get all admins, optionally filtered by search text + paginated
    def find_all(self, search=None, page=1, per_page=10):
        query = Admin.query

        if search:
            search_filter = f"%{search}%" #SQL LIKE
            query = query.filter(
                 (Admin.first_name.like(search_filter)) |
                 (Admin.last_name.like(search_filter)) |
                 (Admin.email.like(search_filter))
            )
            
        return query.paginate(page=page, per_page=per_page, error_out=False)
        
    def create(self, admin_data):

            # unpack dict into Admin fields
            admin = Admin(**admin_data)
            db.session.add(admin)
            db.session.commit()
            return admin
        
    def find_by_role(self, role):
            return Admin.query.filter_by(role=role).all()