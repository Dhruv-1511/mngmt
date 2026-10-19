import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { getUsers, getSession, setSession, clearSession } from './storage'

const App = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    const id = getSession()
    return getUsers().find((u) => u.id === id) || null
  })

  const handleLogin = (user) => {
    setSession(user.id)
    setCurrentUser(user)
  }

  const handleLogout = () => {
    clearSession()
    setCurrentUser(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* logged in users can't open login/register, logged out users can't open dashboard */}
        <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={currentUser ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              <Dashboard currentUser={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to={currentUser ? '/dashboard' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
