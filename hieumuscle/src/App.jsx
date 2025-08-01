import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Progress from './pages/Progress'
import Calendar from './pages/Calendar'
import MealLog from './pages/MealLog'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
function App() {

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/meallog" element={<MealLog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>

  )
}

export default App
