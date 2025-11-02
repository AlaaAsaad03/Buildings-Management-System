from app import db, bcrypt
from app.repositories.admin_repo import AdminRepository

class ProfileService:
    def __init__(self):
        self.admin_repo = AdminRepository()

    def get_profile(self, admin_id):
        admin = self.admin_repo.find_by_id(admin_id)
        if not admin: 
            return None, "Admin not found"
        return admin.to_dict(), None
    
    def update_profile(self, admin_id, data):
        admin = self.admin_repo.find_by_id(admin_id)
        if not admin:
            return None, "Admin not found"
        if 'civility' in data:
            admin.civility = data['civility']
        if 'first_name' in data:
            admin.first_name = data['first_name']
        if 'last_name' in data:
            admin.last_name = data['last_name']
        if 'phone' in data:
            admin.phone = data['phone']
        if 'profile_picture' in data:
            admin.profile_picture = data['profile_picture']

        db.session.commit()
        return admin.to_dict(), None
    
    def change_password(self, admin_id, current_password, new_password):
        admin = self.admin_repo.find_by_id(admin_id)
        if not admin:
            return "Admin not found"
        if not bcrypt.check_password_hash(admin.password_hash, current_password):
            return "Current password is incorrect"
        
        if len(new_password) < 6:
            return None, 'New password must be at least 6 characters long!'
        
        admin.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
        db.session.commit()

        return {"message": "Password updated successfully"}, None