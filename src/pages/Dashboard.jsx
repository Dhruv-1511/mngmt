import { useState } from 'react'
import UserForm from '../components/UserForm'
import { getUsers, saveUsers } from '../storage'

const Dashboard = ({ currentUser, setCurrentUser, onLogout }) => {
  const [users, setUsers] = useState(getUsers())
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null) // null means adding a new employee
  const [error, setError] = useState('')

  const isAdmin = currentUser.role === 'admin'

  // admin edits everyone, manager edits users + self, user edits only self
  const canEdit = (user) => {
    if (isAdmin) return true
    if (user.id === currentUser.id) return true
    if (currentUser.role === 'manager' && user.role === 'user') return true
    return false
  }

  const openAddForm = () => {
    setSelectedUser(null)
    setShowForm(true)
  }

  const openEditForm = (user) => {
    setSelectedUser(user)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setError('')
  }

  const handleSave = (data) => {
    const emailTaken = users.some((u) => u.email === data.email && u.id !== data.id)
    if (emailTaken) return setError('Email already exists')

    let newUsers
    if (selectedUser) {
      newUsers = users.map((u) => (u.id === data.id ? data : u))
      if (data.id === currentUser.id) setCurrentUser(data)
    } else {
      newUsers = [...users, { ...data, id: Date.now().toString() }]
    }

    saveUsers(newUsers)
    setUsers(newUsers)
    closeForm()
  }

  const handleDelete = (id) => {
    if (!confirm('Delete this employee?')) return
    const newUsers = users.filter((u) => u.id !== id)
    saveUsers(newUsers)
    setUsers(newUsers)
  }

  const filteredUsers = users.filter((u) => {
    if (u.role === 'admin') return false // admin is never shown in the table
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    return u.name.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b px-6 py-3 flex justify-between items-center">
        <h1 className="font-semibold text-lg">Employee Management</h1>
        <div className="flex items-center gap-3 text-sm">
          <span>
            {currentUser.name} <span className="text-gray-500">({currentUser.role})</span>
          </span>
          {isAdmin && (
            <button onClick={() => openEditForm(currentUser)} className="btn-outline">My Profile</button>
          )}
          <button onClick={onLogout} className="btn-outline">Logout</button>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input mb-0! flex-1 min-w-48"
          />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input mb-0! w-40">
            <option value="all">All Roles</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          {isAdmin && (
            <button onClick={openAddForm} className="btn">+ Add Employee</button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Department</th>
                <th className="p-3">Salary</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">No employees found</td>
                </tr>
              )}
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.name}{u.id === currentUser.id && ' (You)'}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.phone || '-'}</td>
                  <td className="p-3">{u.department || '-'}</td>
                  <td className="p-3">{u.salary ? `₹${u.salary}` : '-'}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3 space-x-3">
                    {canEdit(u) && (
                      <button onClick={() => openEditForm(u)} className="text-blue-600">Edit</button>
                    )}
                    {isAdmin && (
                      <button onClick={() => handleDelete(u.id)} className="text-red-600">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showForm && (
        <UserForm
          user={selectedUser}
          myRole={currentUser.role}
          error={error}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </div>
  )
}

export default Dashboard
