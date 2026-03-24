import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Flashcard from './pages/Flashcard'

function App() {
    const token = localStorage.getItem('token')

    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={token ? <Home/> : <Navigate to="/login/" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/flashcard" element={token ? <Flashcard/> : <Navigate to="/login/" />}  />
            </Routes>
        </BrowserRouter>
    )
}

export default App