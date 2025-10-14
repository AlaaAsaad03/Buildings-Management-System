from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from app.services.admin_service import AdminService

bp = Blueprint('admin', __name__, url_prefix='/api/admins')
admin_service = AdminService()

@bp.route('', methods=['GET'])
@jwt_required()
def get_admins():

    try:
        search = request.args.get('search')
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)

        print(f"🔍 Received -> search={search}, page={page}, per_page={per_page}")

        result = admin_service.get_admins(search, page, per_page)
        print("✅ Result generated successfully")
        return jsonify(result), 200
    except Exception as e:
            import traceback
            print("❌ ERROR in /api/admins:")
            print(traceback.format_exc())
            return jsonify({'error': str(e)}), 500


@bp.route('', methods=['POST'])
@jwt_required()
def create_admin():
    claims = get_jwt()
    creator_role = claims.get('role')

    data = request.get_json()
    result, error = admin_service.create_admin(data, creator_role)

    if error:
        return jsonify({'error': error}), 403
    
    return jsonify(result), 201