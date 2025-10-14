from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.services.building_service import BuildingService

bp = Blueprint('buildings', __name__, url_prefix='/api/buildings')
building_service = BuildingService()

@bp.route('', methods=['GET'])
@jwt_required()
def get_buildings():
    complex_id = request.args.get('complex_id', type=int)
    result = building_service.get_all(complex_id=complex_id)
    return jsonify(result), 200

@bp.route('', methods=['POST'])
@jwt_required()
def create_building():
    data = request.get_json()
    result = building_service.create_building(data)
    return jsonify(result), 201

@bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_building(id):
    result, error = building_service.delete_building(id)
    if error:
        return jsonify({'error': error}), 404
    return jsonify(result), 200