import { useState } from 'react'

const emptyUser = { name: '', email: '', password: '', phone: '', department: '', salary: '', role: 'user' }

const UserForm = ({ user, myRole, error, onSave, onClose }) => {
  const [form, setForm] = useState(user || emptyUser)

  const isNew = !user
  const isAdmin = myRole === 'admin'
  const isManager = myRole === 'manager'

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{isNew ? 'Add Employee' : 'Edit Employee'}</h2>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        {/* everyone can edit name and phone */}
        <label className="label">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="input" required />

        <label className="label">Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} className="input" />

        {/* admin and manager can edit department */}
        <label className="label">Department</label>
        <input name="department" value={form.department} onChange={handleChange} disabled={!isAdmin && !isManager} className="input" />

        {/* only admin can edit email, salary and role */}
        <label className="label">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} disabled={!isAdmin} className="input" required />

        <label className="label">Salary</label>
        <input name="salary" type="number" value={form.salary} onChange={handleChange} disabled={!isAdmin} className="input" />

        {form.role !== 'admin' && (
          <>
            <label className="label">Role</label>
            <select name="role" value={form.role} onChange={handleChange} disabled={!isAdmin} className="input">
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
          </>
        )}

        {isNew && (
          <>
            <label className="label">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="input" required />
          </>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          <button className="btn">Save</button>
        </div>
      </form>
    </div>
  )
}

export default UserForm
