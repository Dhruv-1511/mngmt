import { useState, useEffect } from 'react'
import UserForm from '../components/UserForm'
import Navbar from '../components/Navbar'
import ConfirmDialog from '../components/ConfirmDialog'
import { getUsers, saveUsers } from '../storage'

const PAGE_SIZE = 5

const Dashboard = ({ currentUser, setCurrentUser, onLogout }) => {
  const [users, setUsers] = useState(getUsers())
  const [searchInput, setSearchInput] = useState('') // what the user is typing
  const [search, setSearch] = useState('') // debounced value used for filtering
  const [page, setPage] = useState(1)
  const [roleFilter, setRoleFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null) // null means adding a new employee
  const [error, setError] = useState('')
  const [deleteUser, setDeleteUser] = useState(null) // user waiting for delete confirmation

  const isAdmin = currentUser.role === 'admin'

  // debounce: only apply the search 500ms after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

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

  const handleDelete = () => {
    const newUsers = users.filter((u) => u.id !== deleteUser.id)
    saveUsers(newUsers)
    setUsers(newUsers)
    setDeleteUser(null)
  }

  const filteredUsers = users.filter((u) => {
    if (u.role === 'admin') return false // admin is never shown in the table
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    return u.name.toLowerCase().includes(search.toLowerCase())
  })

  // pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages) // stay valid if rows get deleted
  const start = (currentPage - 1) * PAGE_SIZE
  const pageUsers = filteredUsers.slice(start, start + PAGE_SIZE)

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={currentUser} onEditProfile={() => openEditForm(currentUser)} onLogout={onLogout} />

      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            placeholder="Search by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input mb-0! flex-1 min-w-48"
          />
          <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }} className="input mb-0! w-40">
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
                <th className="p-3">No.</th>
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
                  <td colSpan="8"className="p-4 text-center text-gray-500">No employees found</td>
                </tr>
              )}
              {pageUsers.map((u, index) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{start + index + 1}</td>
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
                      <button onClick={() => setDeleteUser(u)} className="text-red-600">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm">
            <span className="text-gray-600">
              Showing {start + 1}-{start + pageUsers.length} of {filteredUsers.length}
            </span>
            <div className="flex gap-1">
              <button onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} className="btn-outline disabled:opacity-50">
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={num === currentPage ? 'btn py-1.5 px-3' : 'btn-outline'}
                >
                  {num}
                </button>
              ))}
              <button onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages} className="btn-outline disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        )}
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

      {deleteUser && (
        <ConfirmDialog
          message={`Do you really want to delete ${deleteUser.name}? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteUser(null)}
        />
      )}
    </div>
  )
}

export default Dashboard
