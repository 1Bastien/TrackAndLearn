import authService from './auth.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

class StepService {
  getAuthHeaders() {
    const token = authService.token
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  async createStep(stepData) {
    try {
      const response = await fetch(`${API_BASE_URL}/steps`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(stepData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'étape")
      }

      return await response.json()
    } catch (error) {
      console.error("Erreur lors de la création de l'étape:", error)
      throw error
    }
  }

  async getStepsByCourse(courseId, options = {}) {
    try {
      const params = new URLSearchParams()
      if (options.status) params.append('status', options.status)
      if (options.limit) params.append('limit', options.limit)

      const response = await fetch(
        `${API_BASE_URL}/steps/course/${courseId}?${params}`,
        {
          headers: this.getAuthHeaders(),
        }
      )

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des étapes')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur lors de la récupération des étapes:', error)
      throw error
    }
  }

  async getStep(stepId) {
    try {
      const response = await fetch(`${API_BASE_URL}/steps/${stepId}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de l'étape")
      }

      return await response.json()
    } catch (error) {
      console.error("Erreur lors de la récupération de l'étape:", error)
      throw error
    }
  }

  async updateStep(stepId, stepData) {
    try {
      const response = await fetch(`${API_BASE_URL}/steps/${stepId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(stepData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'étape")
      }

      return await response.json()
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'étape:", error)
      throw error
    }
  }

  async deleteStep(stepId) {
    try {
      const response = await fetch(`${API_BASE_URL}/steps/${stepId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'étape")
      }

      return await response.json()
    } catch (error) {
      console.error("Erreur lors de la suppression de l'étape:", error)
      throw error
    }
  }

  async markStepCompleted(stepId) {
    try {
      const response = await fetch(`${API_BASE_URL}/steps/${stepId}/complete`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Erreur lors du marquage de l'étape comme terminée")
      }

      return await response.json()
    } catch (error) {
      console.error("Erreur lors du marquage de l'étape comme terminée:", error)
      throw error
    }
  }

  async reorganizeSteps(courseId, newOrder) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/steps/course/${courseId}/reorganize`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ newOrder }),
        }
      )

      if (!response.ok) {
        throw new Error('Erreur lors de la réorganisation des étapes')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur lors de la réorganisation des étapes:', error)
      throw error
    }
  }

  async getUpcomingDeadlines(days = 7) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/steps/deadlines?days=${days}`,
        {
          headers: this.getAuthHeaders(),
        }
      )

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des échéances')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur lors de la récupération des échéances:', error)
      throw error
    }
  }
}

export default new StepService()
