from flask import Flask, jsonify
from flask_cors import CORS

#jsonify is used to send the response of our API route in Json format

app = Flask(__name__)
cors=CORS(app, origin='*')
#to create an app instance

@app.route("/api/dev2", methods = ['GET'])
#creates a route thats only permitted get requests

def dev2():
    return jsonify(
        {
            "dev2": [
            'helloWorld',
            'helloWorld2',
            'helloWorld3'
            ]
        }
    )

if __name__ == "__main__":
    app.run(debug=True, port=8080)