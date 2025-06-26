import authService from './auth.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

class CourseService {
  getAuthHeaders() {
    const token = authService.token
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  async createCourse(courseData) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(courseData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la formation')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur lors de la création de la formation:', error)
      throw error
    }
  }

  async getCourses(options = {}) {
    try {
      const params = new URLSearchParams()
      if (options.page) params.append('page', options.page)
      if (options.limit) params.append('limit', options.limit)
      if (options.status) params.append('status', options.status)
      if (options.search) params.append('search', options.search)

      const response = await fetch(`${API_BASE_URL}/courses?${params}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des formations')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur lors de la récupération des formations:', error)
      throw error
    }
  }

  async getCourse(courseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la formation')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur lors de la récupération de la formation:', error)
      throw error
    }
  }

  async updateCourse(courseId, courseData) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(courseData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la formation')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la formation:', error)
      throw error
    }
  }

  async deleteCourse(courseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la formation')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur lors de la suppression de la formation:', error)
      throw error
    }
  }

  async getStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/statistics`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  }
}

export default new CourseService()
