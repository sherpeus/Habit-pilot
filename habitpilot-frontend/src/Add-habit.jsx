import { useState, useEffect } from 'react';
import Checkbox from './Checkbox';
import './Add-Habit.css';

const FREQUENCY_MAP = {
  1: 'daily',
  7: 'weekly',
  30: 'monthly',
};

function Add() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState("physical");
  const [clicked, setClick] = useState(false);

  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState(1);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/habits')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch habits');
        return res.json();
      })
      .then(data => {
        setHabits(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Name is required');

    const habitData = {
      name,
      frequency,
      type: type || "physical",
    };

    try {
      const res = await fetch('http://127.0.0.1:5000/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitData),
      });
      if (!res.ok) throw new Error('Failed to add habit');

      const newHabit = await res.json();
      setHabits([...habits, newHabit[0]]);
      setName('');
      setFrequency(1);
      setType("physical");
      setClick(false); 
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className='main'>
      {clicked ? (
        <>
          <h1>Add a new task</h1>
          <form onSubmit={handleAddHabit}>
            <div className="form-row">
              <input
                type="text"
                className="inputs"
                placeholder="Habit name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-row">
              <select
                value={frequency}
                onChange={e => setFrequency(parseInt(e.target.value))}
                className="select frequency-select"
              >
                <option value={1}>Daily</option>
                <option value={7}>Weekly</option>
                <option value={30}>Monthly</option>
              </select>

              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="select type-select"
              >
                <option value="physical">Physical</option>
                <option value="mental">Mental</option>
                <option value="productivity">Productivity</option>
                <option value="social">Social</option>
                <option value="spiritual">Spiritual</option>
              </select>
            </div>
            <div className="form-row">
              <button  className='submitter'><i className="fa-solid fa-check"></i></button>
            </div>
          </form>
        </>
      ) : (
        <>
         
          {loading && <p>Loading habits...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !habits.length && <p>No habits found. Add one above!</p>}
          <ul>
            {habits.map(habit => (
              <li
                key={habit.id}
                className={`${habit.type} par`}
              >
                <Checkbox Habit={habit} />
              </li>
            ))}
          </ul>
        </>
      )}

      <button className='add-btn' onClick={() => setClick(prev => !prev)}>
        <span>
          <i className={`fa-solid ${clicked ? 'fa-xmark' : 'fa-plus'}`}></i>
        </span>
      </button>
    </div>
  );
}

export default Add;
