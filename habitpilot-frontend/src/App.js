import logo from './logo.svg';
import './App.css';
import Add from './Add-habit';
import ShowInfo from './Habit-info';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Add />} />
        <Route path="/habits/:habit_id" element={<ShowInfo/>} />
      </Routes>
    </Router>
  );
}

export default App;
