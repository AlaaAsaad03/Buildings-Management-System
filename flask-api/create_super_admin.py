#One-Time Setup

from app import create_app,db, bcrypt
from app.models.admin import Admin

app = create_app()

with app.app_context():

    #check if super admin already exists
    existing = Admin.query.filter_by(email='super@admin.com').first()

    if existing:
        print("Super admin already exists.")
    else:
        admin = Admin(
            civility='Mr',
            first_name='Super',
            last_name='Admin',
            email='super@admin.com',
            phone='1234567890',
            role='Super Admin',
            status='active',
            password_hash=bcrypt.generate_password_hash('admin123').decode('utf-8')
        )
        db.session.add(admin)
        db.session.commit()

        print("Super admin created! Email:super@admin.com, Password: admin123")