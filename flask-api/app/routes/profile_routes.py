from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt
from app.services.profile_service import ProfileService
from werkzeug.utils import secure_filename
import os
import uuid


bp = Blueprint('profile_routes', __name__, url_prefix='/api/profile')
profile_service = ProfileService()

UPLOAD_FOLDER = 'uploads/profile_pictures'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    claims = get_jwt()
    admin_id = claims.get('sub')

    result, error = profile_service.get_profile(admin_id)

    if error:
        return jsonify({'error': error}), 404
    
    return jsonify(result), 200

@bp.route('', methods=['PUT'])
@jwt_required()
def update_profile():
    claims = get_jwt()
    admin_id = claims.get('sub')

    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    result, error = profile_service.update_profile(admin_id, data)

    if error: 
        return jsonify({'error': error}), 400
    
    return jsonify(result), 200

@bp.route('/upload-picture', methods=['POST'])
@jwt_required()
def update_profile_picture():
    claims = get_jwt()
    admin_id = claims.get('sub')

    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not file and not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Allowed types are png, jpg, jpeg, gif'}), 400
    
    #generate unique filename
    file_ext = file.filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{admin_id}_{uuid.uuid4().hex}.{file_ext}"

    #save file
    upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'profile_pictures')
    filepath = os.path.join(upload_folder, unique_filename)

    try: 
        file.save(filepath)
    except Exception as e:
        return jsonify({'error': f'File upload failed: {str(e)}'}), 500
    
    #update profile with pic url
    profile_picture_url = f"http://127.0.0.1:5000/uploads/profile_pictures/{unique_filename}"
    result, error = profile_service.update_profile(admin_id, {'profile_picture' : profile_picture_url})

    if error: 
        #delete the uploaded file if db update fails
        try:
            os.remove(filepath)
        except: 
            pass
        return jsonify({'error': error}), 400
    
    return jsonify({
        'profile_picture': profile_picture_url,
        'message': 'Profile picture updated successfully'
    }), 200


    

@bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    claims = get_jwt()
    admin_id = claims.get('sub')

    data = request.get_json()

    if not data or not data.get('current_password') or not data.get('new_password'):
        return jsonify({'error': 'Current and new passwords are required'}), 400
    
    result, error = profile_service.change_password(
        admin_id,
        data['current_password'],
        data['new_password']
        )
    if error:
        return jsonify({'error': error}), 400
    return jsonify(result), 200