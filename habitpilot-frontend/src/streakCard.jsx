import React from "react";
import "./StreakCard.css";

export default function StreakCard({ currentStreak, bestStreak }) {
  const progress = Math.min((currentStreak / bestStreak) * 100, 100);

  return (
    <div className="streak-card">
      <div className="streak-header">
        <span className={`streak-flame ${currentStreak > 0 ? "active" : ""}`}>
          🔥
        </span>
        <span className="streak-number">{currentStreak}</span>
        <span className="streak-label">day streak</span>
      </div>

      <div className="streak-bar">
        <div
          className="streak-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="streak-footer">
        Best streak: <strong>{bestStreak}</strong> days
      </div>
    </div>
  );
}
