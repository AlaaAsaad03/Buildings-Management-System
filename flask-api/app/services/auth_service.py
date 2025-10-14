from app.repositories.admin_repo import AdminRepository
from flask_jwt_extended import create_access_token

class AuthService:

    def __init__(self):
        self.admin_repo = AdminRepository() 

    
    def login(self, email, password):

        admin = self.admin_repo.find_by_email(email)

        if not admin:
            return None, "Invalid email or password"
        
        #Check Password
        from app import bcrypt
        if not bcrypt.check_password_hash(admin.password_hash, password):
            return None, "Invalid email or password"
        
        #check if active
        if admin.status != 'active':
            return None, "Account is Inactive!"
        
        #create JWT Token with role
        token = create_access_token(
            identity = str(admin.id),
            additional_claims = {
                'role' : admin.role
            }
        )

        return { 'token': token, 'admin': admin.to_dict() }, None