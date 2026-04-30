const API_URL = '/api'

const registerForm = document.getElementById('registerForm')
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const username = document.getElementById('username').value
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        document.getElementById('errorMsg').textContent = data.message || 'Registration failed'
        return
      }

      document.getElementById('successMsg').textContent = 'Registered successfully! Redirecting...'
      setTimeout(() => window.location.href = 'index.html', 1500)

    } catch (err) {
      document.getElementById('errorMsg').textContent = 'Could not connect to server'
    }
  })
}

const loginForm = document.getElementById('loginForm')
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const loginField = document.getElementById('loginField').value
    const password = document.getElementById('password').value

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginField, password })
      })

      const data = await res.json()

      if (!res.ok) {
        document.getElementById('errorMsg').textContent = data.message || 'Login failed'
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('userName', data.name)
      window.location.href = 'dashboard.html'

    } catch (err) {
      document.getElementById('errorMsg').textContent = 'Could not connect to server'
    }
  })
}
