// the only admin, created by default
const DEFAULT_ADMIN = {
  id: 'admin',
  name: 'Admin',
  email: 'admin@gmail.com',
  password: 'admin123',
  phone: '',
  department: '',
  salary: '',
  role: 'admin',
}

export const getUsers = () => {
  return JSON.parse(localStorage.getItem('users')) || [DEFAULT_ADMIN]
}

export const saveUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users))
}

export const getSession = () => localStorage.getItem('currentUserId')

export const setSession = (id) => localStorage.setItem('currentUserId', id)

export const clearSession = () => localStorage.removeItem('currentUserId')
