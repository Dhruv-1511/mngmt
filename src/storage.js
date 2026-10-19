export const getUsers = () => {
  return JSON.parse(localStorage.getItem('users')) || []
}

export const saveUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users))
}

export const getSession = () => localStorage.getItem('currentUserId')

export const setSession = (id) => localStorage.setItem('currentUserId', id)

export const clearSession = () => localStorage.removeItem('currentUserId')
