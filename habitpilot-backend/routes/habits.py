from flask import Blueprint,request, jsonify

from models import db,Habit,Checkin
from datetime import datetime, date
import calendar
from sqlalchemy import extract

habits_bp=Blueprint('habits',__name__)

@habits_bp.route('/habits',methods=['GET'])
def get_habits():
    habits=Habit.query.all()
    res=[]
    today = date.today()
    for h in habits:
        dates = []
        for c in h.checkins:
            if isinstance(c.date, str):
                parsed = datetime.strptime(c.date, "%Y-%m-%d").date()  
            else:
                parsed = c.date
            dates.append(parsed)

        checkin = today in dates
        sd=h.created_at
        sd_date = sd.date() if isinstance(sd, datetime) else sd
        days_passed = (today - sd_date).days
        if max(1,days_passed)%h.frequency==0:
            res.append({
                'id':h.id,
                'name':h.name,
                'checkins':dates,
                'frequency':h.frequency,
                'duration_minutes':h.duration_minutes,
                'checked_today':checkin,
                'type': h.type if h.type else 'Physical'
            })
    return jsonify(res)
@habits_bp.route('/habits',methods=['POST'])
def add_habit():
    data=request.get_json()
    name=data.get('name')
    duration=data.get('duration_minutes')
    frequency=data.get('frequency')
    type=data.get('type')

    if not name:
        return jsonify({'error':'habit name is required'},400)
    new=Habit(name=name,duration_minutes=duration,frequency=frequency,type=type)
    db.session.add(new)
    db.session.commit()
    return jsonify({'id':new.id,'name':new.name,'checkins':[], 'duration_minutes':new.duration_minutes if duration else None, 'frequency':new.frequency,'type':new.type},201)
@habits_bp.route('/habits/<int:habit_id>/checkin', methods=['POST'])
def toggle_checkin(habit_id):
    habit = Habit.query.get_or_404(habit_id)
    
    today = date.today()

    checkin = Checkin.query.filter_by(habit_id=habit.id, date=today).first()

    if checkin:
        db.session.delete(checkin)
        db.session.commit()
        return jsonify({'response': "removed"}), 200
    else:
        new = Checkin(date=today, habit_id=habit.id)
        db.session.add(new)
        db.session.commit()
        return jsonify({'response': "added"}), 200
@habits_bp.route('/habits/<int:habit_id>/info', methods=['GET'])
def parse_dates(habit_id):
    habit = Habit.query.get_or_404(habit_id)
    print(habit.name)
    tod = date.today()
    year = tod.year
    month = tod.month

    days_in_month = calendar.monthrange(year, month)[1]

    checkins = Checkin.query.filter(
        Checkin.habit_id == habit.id,
        extract('year', Checkin.date) == tod.year,
        extract('month', Checkin.date) == tod.month
    ).all()
    days=sorted(checkins, key=lambda c: c.date)
    max_streak=1 if checkins else 0
    current_streak=1 if max_streak else 0
    for i in range(1,len(checkins)):
        delta = (
    datetime.strptime(days[i].date, "%Y-%m-%d").date()
    - datetime.strptime(days[i-1].date, "%Y-%m-%d").date()
).days

        if delta == 1:
           
            current_streak += 1
            max_streak = max(max_streak, current_streak)
        elif delta == 0:
            
            continue
        else:
            
            current_streak = 1

    checkins_list = [{
        "date": c.date,  # convert datetime.date to string
        "count": 1  
    } for c in checkins]

    return jsonify({
        'checkins': checkins_list,
        'day_count': days_in_month,
        'name':habit.name,
        'frequency':habit.frequency,
        'type':habit.type,
        'm_streak':max_streak,
        'c_streak':current_streak
    })

@habits_bp.route("/habits/<int:habit_id>/update", methods=["PUT"])
def update_habit(habit_id):
    data = request.get_json()

    habit = Habit.query.get(habit_id)
    if not habit:
        return jsonify({"error": "Habit not found"}), 404

    # Update only fields that exist in the incoming request
    if "name" in data:
        habit.name = data["name"]
    if "frequency" in data:
        habit.frequency = data["frequency"]
    if "type" in data:
        habit.type = data["type"]

    db.session.commit()

    return jsonify({
        "id": habit.id,
        "name": habit.name,
        "frequency": habit.frequency,
        "type": habit.type
    }), 200

@habits_bp.route('/habits/<int:habit_id>/del', methods=['DELETE'])
def delete_habit(habit_id):
    habit = Habit.query.get(habit_id)
    if not habit:
        return jsonify({"error": "Habit not found"}), 404
   

    db.session.delete(habit)
    db.session.commit()
    return jsonify({"message": "Habit deleted successfully"}), 200