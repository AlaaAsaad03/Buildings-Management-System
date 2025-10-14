from flask import Blueprint, request, jsonify
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