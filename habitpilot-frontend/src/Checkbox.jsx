import { useState } from 'react';
import './Add-Habit.css';
import { useNavigate } from "react-router-dom";

const toggleCheckin = async (HabitId) => {
  const res = await fetch(`http://127.0.0.1:5000/habits/${HabitId}/checkin`, {
    method: "POST",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Toggle failed");
  }

  return res.json();
};

function Checkbox({ Habit }) {
  const navigate = useNavigate();

   const handleInfoClick = () => {
    navigate(`/habits/${Habit.id}`);
  };
 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(Habit.checked_today);

  const handleToggle = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await toggleCheckin(Habit.id);
      setChecked((prev) => !prev);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='par' style={{ display: "flex", flexDirection: "column", width:"100%" }}>
      <div className="habit-label">
        <div className="habit-left">
          <input
            type="checkbox"
            checked={checked}
            disabled={loading}
            onChange={handleToggle}
          />
          <strong className={checked ? "checked" : ""} style={{ marginLeft: "0.5rem" }}>{Habit.name}</strong>

           <button className='info' onClick={handleInfoClick}>{/*onclick action with habit.id*/ }
          <i class="fa-solid fa-circle-info"></i>
          </button>
        </div>

       
         
        
      </div>

      {loading && <span style={{ marginLeft: "8px" }}>⏳</span>}
      {error && (
        <div style={{ color: "red", fontSize: "0.9em" }}>{error}</div>
      )}
    </div>
  );
}

export default Checkbox;
