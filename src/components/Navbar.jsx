import { useState } from 'react'

const Navbar = ({ user, onEditProfile, onLogout }) => {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white border-b px-6 py-3 flex justify-between items-center">
      <h1 className="font-semibold text-lg">Employee Management</h1>

      <div className="relative">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-2 py-1">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase">
            {user.name.charAt(0)}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <svg className={`w-4 h-4 text-gray-500 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {open && (
          <>
            {/* invisible layer so clicking anywhere outside closes the menu */}
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

            <div className="absolute right-0 z-20 mt-2 w-44 bg-white border rounded-lg shadow py-1 text-sm">
              <button
                onClick={() => { setOpen(false); onEditProfile() }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50"
              >
                Edit Profile
              </button>
              <button
                onClick={() => { setOpen(false); onLogout() }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar
