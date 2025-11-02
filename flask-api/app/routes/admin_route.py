from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from app.services.admin_service import AdminService
from app.utils.decorators import super_admin_required


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
@super_admin_required()
def create_admin():
    claims = get_jwt()
    creator_role = claims.get('role')

    data = request.get_json()
    result, error = admin_service.create_admin(data, creator_role)

    if error:
        return jsonify({'error': error}), 403
    
    return jsonify(result), 201


@bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_admin(id):
    claims = get_jwt()
    current_user_id = claims.get('id')
    current_role = claims.get('role')

    if current_role != 'super_admin' and current_user_id != id:
        return jsonify({'error': 'Access denied'}), 403
        
    admin = admin_service.get_admin_by_id(id)
    if not admin:
            return jsonify({'error': 'Admin not found'}), 404
    return jsonify(admin), 200
          