from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_refresh_token
from app.services.auth_service import AuthService

bp = Blueprint('auth', __name__, url_prefix = '/api')
auth_service = AuthService()


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error' : 'Email and password are required'}), 400
    
    result, error = auth_service.login(data['email'], data['password'])

    if error:
        return jsonify({'error' : error}), 401
    
    return jsonify(result), 200


@bp.route('/register', methods=['POST'])
def register():
    """Register endpoint: POST /api/register
    
    Body: {
        "civility": "Mr" (optional),
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "phone": "1234567890" (optional),
        "password": "secure123"
    }
    """
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Request body required'}), 400
    
    result, error = auth_service.register(data)
    
    if error:
        return jsonify({'error': error}), 400
    
    return jsonify(result), 201  # 201 = Created

@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
   identity = get_jwt_identity()
   admin = auth_service.admin_repo.find_by_id(int(identity))

   if not admin or admin.status != 'active':
       return jsonify({'error': 'Invalid or inactive account'}), 401
   from flask_jwt_extended import create_access_token
   new_token = create_access_token(
         identity = str(admin.id),
         additional_claims = {
              'role' : admin.role,
              'email': admin.email,
              'complex_id': admin.complex_id,
              'building_id': admin.building_id
         }
    )
   return jsonify({'token': new_token}), 200

@bp.route('/verify', methods=['GET'])
@jwt_required()
def varify_token():
    identity = get_jwt_identity()
    return jsonify({'valid':True, 'user_id': identity}), 200


