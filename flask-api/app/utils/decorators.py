# NOTE:
# *args  → allows the function to accept ANY number of positional arguments
# **kwargs → allows the function to accept ANY number of keyword (named) arguments
# These make the decorator flexible, so it works with routes that take different parameters.

from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt


def super_admin_required():
    def decorator(fn): #receives the route function being decorated (fn)
        @wraps(fn) 
        def wrapper(*args, **kwargs): # replace the original route function 
            claims = get_jwt()
            if claims.get('role') != 'super_admin':
                return jsonify({'error': "Super Admin Access Required !!"}), 403
            return fn(*args, **kwargs) #if it IS 'super_admin', continue normally
        return wrapper
    return decorator

def admin_or_higher_required():
    def decorator(fn): 
        @wraps(fn)
        def wrapper (*args, **kwargs):
            claims = get_jwt()
            role = claims.get('role')
            if role not in ['Super Admin', 'Complex Admin']:
                return jsonify({'error': "Admin or Higher Access Required !!"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def any_admin_required():
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            if not claims.get('role'):
                return jsonify({'error': "Authentication Required !!"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
