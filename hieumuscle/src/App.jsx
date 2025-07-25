import './App.css'
import Home from './assets/pages/Home'
import About from './assets/pages/About'
import Progress from './assets/pages/Progress'
import Calendar from './assets/pages/Calendar'
import MealLog from './assets/pages/MealLog'
import { Route, Routes } from 'react-router-dom'
import Layout from './assets/components/Layout'
function App() {

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/meallog" element={<MealLog />} />
      </Route>
    </Routes>

  )
}

export default App
