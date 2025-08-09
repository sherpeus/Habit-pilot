from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from models import db
from habits import habits_bp

app=Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False

db.init_app(app)
app.register_blueprint(habits_bp)


@app.route('/')
def home():
    return "running"
if __name__=="__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)

