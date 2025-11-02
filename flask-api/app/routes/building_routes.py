from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from app.services.building_service import BuildingService

bp = Blueprint('buildings', __name__, url_prefix='/api/buildings')
building_service = BuildingService()

@bp.route('', methods=['GET'])
@jwt_required()
def get_buildings():
    complex_id = request.args.get('complex_id', type=int)
    claims = get_jwt()
    role = claims.get('role')
    user_complex_id = claims.get('complex_id')
    user_building_id = claims.get('building_id')

    if role == 'Building Admin' and user_building_id:
        result = building_service.get_by_id(user_building_id)
        return jsonify([result] if result else []), 200
    
    if role == 'Complex Admin' and user_complex_id:
        result = building_service.get_all(user_complex_id)
        return jsonify(result), 200
    
    result = building_service.get_all(complex_id)
    return jsonify(result), 200
    

@bp.route('', methods=['POST'])
@jwt_required()
def create_building():
    claims = get_jwt()
    role = claims.get('role')
    user_complex_id = claims.get('complex_id')

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request Body required'}), 400
    
    requested_complex_id = data.get('complex_id')
    if role == 'Complex Admin':
        if user_complex_id != requested_complex_id:
            return jsonify({'error': 'Complex Admins can only create buildings in their own complex'}), 403
        
        if role == 'Building Admin':
            return jsonify({'error': 'Building Admins cannot create buildings'}), 403
    result = building_service.create_building(data)
    return jsonify(result), 201


@bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_building(id):
    claims = get_jwt()
    role = claims.get('role')
    user_building_id = claims.get('building_id')
    user_complex_id = claims.get('complex_id')

    building = building_service.get_by_id(id)
    if not building:
        return jsonify({'error': 'Building not found'}), 404    
    
    if role == 'Building Admin' and user_building_id != id:
        return jsonify({'error': 'Building Admins can only access their own building'}), 403
    
    if role == 'Complex Admin' and user_complex_id != building.get('complex_id'):
        return jsonify({'error': 'Complex Admins can only access buildings in their own complex'}), 403
    return jsonify(building), 200


@bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_building(id):
    claims = get_jwt()
    role = claims.get('role')

    if role != 'Super Admin':
        return jsonify({'error': 'Only Super Admins can delete buildings'}), 403
        
    result, error = building_service.delete_building(id)

    if error:
        return jsonify({'error': error}), 404
    
    return jsonify(result), 200