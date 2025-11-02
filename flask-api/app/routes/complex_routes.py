from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from app.services.complex_service import ComplexService
from app.services.building_service import BuildingService

bp = Blueprint('complex', __name__, url_prefix='/api/complex')
complex_service = ComplexService()
building_service = BuildingService()

@bp.route('', methods=['GET'])
@jwt_required()
def get_complexes():
    claims = get_jwt()
    role = claims.get('role')
    complex_id = claims.get('complex_id')

    # Only Complex Admins can access their specific complex
    if role == 'Complex Admin' and complex_id:
        result = complex_service.get_by_id(complex_id)
        return jsonify([result] if result else []), 200

    # Super and Building Admins can access all complexes
    result = complex_service.get_all()
    return jsonify(result), 200

@bp.route('', methods=['POST'])
@jwt_required()
def create_complex():
    claims = get_jwt()
    role = claims.get('role')

    if role != 'Super Admin':
        return jsonify({'error': 'Only Super Admins can create complexes'}), 403
   
    data = request.get_json()
    if not data :
        return jsonify({'error': 'Request Body required'}), 400
    result = complex_service.create_complex(data)
    return jsonify(result), 201

@bp.route('/<int:id>', methods=['GET'])
@jwt_required() 
def get_complex(id):
    claims = get_jwt()
    role = claims.get('role')
    user_complex_id = claims.get('complex_id')

    # Complex Admins can only access their own complex
    if role == 'Complex Admin' and user_complex_id != id:
        return jsonify({'error': 'Access denied'}), 403

    result = complex_service.get_by_id(id)
    if not result:
        return jsonify({'error': 'Complex not found'}), 404
    return jsonify(result), 200


@bp.route('/<int:id>/buildings', methods=['GET'])
@jwt_required()
def get_complex_buildings(id):
    claims = get_jwt()
    role = claims.get('role')
    user_complex_id = claims.get('complex_id')
    user_building_id = claims.get('building_id')

    # Complex Admins can only access buildings in their own complex
    if role == 'Complex Admin' and user_complex_id != id:
        return jsonify({'error': 'Access denied'}), 403
    
    if role == 'Building Admin' and user_building_id:

        user_building = building_service.get_by_id(user_building_id)
        if user_building and user_building['complex_id'] != id:
            return jsonify({'error': 'Access denied'}), 403
        buildings = building_service.get_all(id)

        if role == 'Building Admin' and user_building_id:
            buildings = [b for b in buildings if b['id'] == user_building_id]

    return jsonify(buildings), 200