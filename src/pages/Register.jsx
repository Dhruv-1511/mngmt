import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUsers, saveUsers } from '../storage'

const Register = ({ onLogin }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const users = getUsers()

    if (users.some((u) => u.email === form.email)) return setError('Email already registered')

    // everyone who registers becomes a normal user
    const newUser = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      password: form.password,
      phone: '',
      department: '',
      salary: '',
      role: 'user',
    }
    saveUsers([...users, newUser])
    onLogin(newUser)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4 text-center">Register</h1>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="input" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="input" required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="input" required />

        <button className="btn w-full mt-2">Register</button>

        <p className="text-sm text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Register
