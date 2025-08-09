import React, { useState } from "react";

function HabitEditForm({ habit, onSave, onCancel }) {
  const [name, setName] = useState(habit.name);
  const [frequency, setFrequency] = useState(habit.frequency);
  const [type, setType] = useState(habit.type);

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ name, frequency, type });
  }

  return (
    <form onSubmit={handleSubmit} className="habit-edit-form">
      <label>
        Name:
        <input value={name} onChange={e => setName(e.target.value)} required />
      </label>

      <label>
        Frequency:
        <select value={frequency} onChange={e => setFrequency(e.target.value)} required>
          <option value="1">Daily</option>
          <option value="7">Weekly</option>
          <option value="30">Monthly</option>
        </select>
      </label>

      <label>
        Type:
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
      </label>

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}
