from app import bcrypt
from app.repositories.admin_repo import AdminRepository

class AdminService:
    def __init__(self):
        self.admin_repo = AdminRepository()
    
    def get_admins(self, search=None, page=1, per_page=10):

        pagination = self.admin_repo.find_all(search, page, per_page)
       
        return {
            'admins' : [admin.to_dict() for admin in pagination.items],
            'total' :pagination.total,
            'page' : pagination.page,
            'per_page' : pagination.per_page,
            'pages' : pagination.pages
        }
    
    def create_admin(self, data, creator_role):

        if creator_role != 'Super Admin':
            return None, "Only Super Admins can create new admins"
        
        # Check if email already exists
        if self.admin_repo.find_by_email(data['email']):
            return None, 'Email already exists'
        
        
        # Hash the password before saving
        data['password_hash'] = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        del data['password']

        if 'status' not in data or data['status'] is None:
            data['status'] = 'active'  # Default status

        admin = self.admin_repo.create(data)
        return admin.to_dict(), None