from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone




db=SQLAlchemy()

class Habit(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(100),nullable=False)
    checkins = db.relationship(
        "Checkin",
        backref="habit",
        cascade="all, delete-orphan",
        passive_deletes=True
    )
    duration_minutes = db.Column(db.Integer, nullable=True)  
    frequency = db.Column(db.Integer, default=0)
    type=db.Column(db.String(16),nullable=False)
    # Meta
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    

class Checkin(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    date=db.Column(db.String(10),nullable=False)
    habit_id=db.Column(db.Integer,db.ForeignKey('habit.id'),nullable=False)
    
