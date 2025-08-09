import React, { useState, useEffect } from "react";
import "./info.css";
import { useParams } from "react-router-dom";
import StreakCard from "./streakCard";
import { useNavigate } from "react-router-dom";

function HabitEditForm({ habit, onSave, onCancel }) {
  const navigate = useNavigate();
  const [name, setName] = useState(habit.name || "");
  const [frequency, setFrequency] = useState(habit.frequency || 1);
  const [type, setType] = useState(habit.type || "");
  const { habit_id } = useParams();
  async function handleDelete() {
  try {
    const res = await fetch(`http://127.0.0.1:5000/habits/${habit_id}/del`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || 'Failed to delete habit');
    }
    navigate("/");
    alert("successfylle deleted");
    
  } catch (err) {
    alert('Error deleting habit: ' + err.message);
  }
}

  async function handleSubmit(e) {
    e.preventDefault();
    const updatedHabit = { name, frequency, type };
    

    try {
      const res = await fetch(`http://127.0.0.1:5000/habits/${habit_id}/update`, {
        method: "PUT", // Flask endpoint should handle PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedHabit),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to update habit");
      }

      const data = await res.json();
      onSave(data); // Pass updated habit back to parent
    } catch (err) {
      alert("Error updating habit: " + err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="habit-edit-form">
      <label>
        Name:
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          type="text"
        />
      </label>

      <label>
        Frequency:
        <select
          value={frequency}
          onChange={(e) => setFrequency(Number(e.target.value))}
          required
        >
          <option value={1}>Daily</option>
          <option value={7}>Weekly</option>
          <option value={30}>Monthly</option>
        </select>
      </label>

      <label>
        Type:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="physical">Physical</option>
          <option value="mental">Mental</option>
          <option value="productivity">Productivity</option>
          <option value="social">Social</option>
          <option value="spiritual">Spiritual</option>
        </select>
      </label>

      <div className="form-buttons">
        <button type="submit" className="save-btn">
          Save
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button style={{backgroundColor:"#fff",color:"inherit"}} onClick={handleDelete}><i class="fa-solid fa-trash"></i></button>
      </div>
    </form>
  );
}

function ShowInfo() {
  const { habit_id } = useParams();
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchCheckins() {
      try {
        const res = await fetch(`http://127.0.0.1:5000/habits/${habit_id}/info`);
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Failed to fetch habit data");
        }
        const data = await res.json();

        const completedDates = data.checkins.map((c) => c.date);
        const today = new Date();
        const daysInMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        ).getDate();
        const monthYear = today.toISOString().slice(0, 7);

        const allDays = Array.from({ length: daysInMonth }, (_, i) => {
          const dayStr = String(i + 1).padStart(2, "0");
          const fullDate = `${monthYear}-${dayStr}`;
          return {
            date: fullDate,
            done: completedDates.includes(fullDate),
          };
        });

        setCheckins(allDays);
        setInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCheckins();
  }, [habit_id]);

  if (loading) return <div>Loading habit data...</div>;
  if (error) return <div>Error: {error}</div>;

  const FREQUENCY_MAP = {
    1: "Daily – You’re expected to check in every day.",
    7: "Weekly – One check-in per week is required.",
    30: "Monthly – A single check-in per month is enough.",
  };

  return (
    <div className="habit-page">
      <div className="info-h">
        <h2>
          {info.name || "Habit Details"}{" "}
          <button onClick={() => setIsEditing((prev) => !prev)}>
            {isEditing ? (
              <i className="fa-solid fa-xmark"></i>
            ) : (
              <i className="fa-solid fa-pencil"></i>
            )}
          </button>
        </h2>
      </div>

      <div className="freqn">{FREQUENCY_MAP[info.frequency]}</div>

      {isEditing ? (
        <HabitEditForm
          habit={info}
          onSave={(updatedHabit) => {
            setInfo(updatedHabit);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <StreakCard
            currentStreak={info.c_streak}
            bestStreak={info.m_streak}
          />
          <span className="text">your consistency map</span>

          <div className="heatmap-container">
            
            {checkins.map((day, index) => (
              <div
                key={index}
                className={`heatmap-day ${day.done ? "done" : ""}`}
                title={day.date}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ShowInfo;
