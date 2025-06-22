const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken')
    this.user = this.token
      ? JSON.parse(localStorage.getItem('user') || 'null')
      : null
  }

  async getAzureLoginUrl() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/azure/login`)
      const data = await response.json()
      return data.authUrl
    } catch (error) {
      console.error("Erreur lors de la récupération de l'URL Azure:", error)
      throw error
    }
  }

  // Gestion du callback d'Azure avec le code d'autorisation
  async handleAzureCallback(code) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/azure/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'authentification")
      }

      const data = await response.json()

      this.token = data.token
      this.user = data.user

      localStorage.setItem('authToken', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))

      return data
    } catch (error) {
      console.error('Erreur lors du callback Azure:', error)
      throw error
    }
  }

  async getCurrentUser() {
    if (!this.token) return null

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })

      if (!response.ok) {
        this.logout()
        return null
      }

      const data = await response.json()
      this.user = data.user
      localStorage.setItem('user', JSON.stringify(this.user))
      return data.user
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error)
      this.logout()
      return null
    }
  }

  logout() {
    this.token = null
    this.user = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  isAuthenticated() {
    return !!this.token
  }

  getUser() {
    return this.user
  }
}

export default new AuthService()
