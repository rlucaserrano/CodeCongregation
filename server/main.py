from flask import Flask, request, make_response
from flask_cors import CORS
from config import Config
from users import users_bp
from calendars import calendars_bp  #calendars blueprint

app = Flask(__name__)
app.secret_key = Config.FLASK_SECRET_KEY

#fixing cors error
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# register blueprints
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(calendars_bp, url_prefix='/api/calendar')  # register calendar routes

@app.route('/')
def home():
    return "Flask API Root"

#  custom CORS headers
@app.after_request
def set_cors_headers(response):
    response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
    response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response, 200

if __name__ == "__main__":
    app.run(debug=True, port=8080)
