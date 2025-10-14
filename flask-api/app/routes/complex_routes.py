from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.services.complex_service import ComplexService

bp = Blueprint('complex', __name__, url_prefix='/api/complex')
complex_service = ComplexService()

@bp.route('', methods=['GET'])
@jwt_required()
def get_complexes():
    result = complex_service.get_all()
    return jsonify(result), 200

@bp.route('', methods=['POST'])
@jwt_required()
def create_complex():
    data = request.get_json()
    result = complex_service.create_complex(data)
    return jsonify(result), 201