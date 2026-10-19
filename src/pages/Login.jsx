import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUsers } from '../storage'

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const user = getUsers().find((u) => u.email === form.email && u.password === form.password)
    if (!user) return setError('Invalid email or password')

    onLogin(user)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4 text-center">Login</h1>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="input" required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="input" required />

        <button className="btn w-full mt-2">Login</button>

        <p className="text-sm text-center mt-4">
          Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
