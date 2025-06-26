<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="mb-6">
        <nav class="flex mb-4" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <router-link
                to="/dashboard"
                class="text-gray-500 hover:text-gray-700"
              >
                Tableau de bord
              </router-link>
            </li>
            <li>
              <svg
                class="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </li>
            <li class="text-gray-900 font-medium">Formations</li>
          </ol>
        </nav>
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Mes Formations</h1>
            <p class="mt-1 text-gray-600">Gérez vos parcours d'apprentissage</p>
          </div>
          <BaseButton
            class="bg-gray-400 hover:bg-gray-500 text-white w-10 h-10 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
            @click="showCreateModal = true"
          >
            <svg
              class="w-5 h-5 m-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </BaseButton>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher une formation..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @input="handleSearch"
            />
          </div>
          <div class="flex gap-2">
            <select
              v-model="statusFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="loadCourses"
            >
              <option value="">Tous les statuts</option>
              <option value="planned">Planifié</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminé</option>
              <option value="suspended">Suspendu</option>
            </select>

            <select
              v-model="itemsPerPage"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="handleItemsPerPageChange"
            >
              <option :value="5">5 par page</option>
              <option :value="10">10 par page</option>
              <option :value="20">20 par page</option>
              <option :value="50">50 par page</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        ></div>
      </div>

      <div v-else-if="courses.length === 0" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            Aucune formation
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Commencez par créer votre première formation.
          </p>
          <div class="mt-6">
            <BaseButton
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              @click="showCreateModal = true"
            >
              Créer une formation
            </BaseButton>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="course in courses"
          :key="course._id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
          @click="goToCourse(course._id)"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
                {{ course.title }}
              </h3>
              <div class="flex space-x-2">
                <button
                  class="p-1 text-gray-400 hover:text-blue-600"
                  @click.stop="editCourse(course)"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  class="p-1 text-gray-400 hover:text-red-600"
                  @click.stop="deleteCourse(course._id)"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
              {{ course.description }}
            </p>

            <div class="space-y-3">
              <div>
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progression</span>
                  <span>{{ Math.round(course.progress || 0) }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    :style="`width: ${course.progress || 0}%`"
                  ></div>
                </div>
              </div>

              <div class="flex justify-between items-center">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(course.status)"
                >
                  {{ getStatusText(course.status) }}
                </span>
                <span class="text-xs text-gray-500">
                  Créé le {{ formatDate(course.createdAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 flex justify-center">
        <nav class="flex items-center gap-2">
          <button
            :disabled="!hasPreviousPage"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="changePage(pagination.currentPage - 1)"
          >
            Précédent
          </button>

          <div class="flex gap-1">
            <button
              v-for="pageNum in getPageNumbers()"
              :key="pageNum"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md min-w-[2.5rem] text-center',
                {
                  'bg-blue-50 text-blue-600 border border-blue-300':
                    pageNum === pagination.currentPage,
                  'text-gray-500 hover:bg-gray-50 border border-gray-300':
                    pageNum !== pagination.currentPage && pageNum !== '...',
                  'text-gray-400 cursor-default': pageNum === '...',
                },
              ]"
              :disabled="pageNum === '...'"
              @click="pageNum !== '...' && changePage(pageNum)"
            >
              {{ pageNum }}
            </button>
          </div>

          <button
            :disabled="!hasNextPage"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="changePage(pagination.currentPage + 1)"
          >
            Suivant
          </button>
        </nav>
      </div>
    </div>

    <CourseModal
      v-if="showCreateModal || editingCourse"
      :course="editingCourse"
      @close="closeModal"
      @saved="handleCourseSaved"
    />
  </div>
</template>

<script>
  import BaseButton from '../components/BaseButton.vue'
  import CourseModal from '../components/CourseModal.vue'
  import courseService from '../services/courseService.js'

  export default {
    name: 'CoursesView',
    components: {
      BaseButton,
      CourseModal,
    },
    data() {
      return {
        courses: [],
        loading: false,
        searchQuery: '',
        statusFilter: '',
        showCreateModal: false,
        editingCourse: null,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          limit: 10,
        },
        searchTimeout: null,
        itemsPerPage: 10,
      }
    },
    computed: {
      hasNextPage() {
        return (
          this.pagination &&
          this.pagination.currentPage < this.pagination.totalPages
        )
      },
      hasPreviousPage() {
        return this.pagination && this.pagination.currentPage > 1
      },
      totalPages() {
        return this.pagination.totalPages || 1
      },
    },
    async mounted() {
      await this.loadCourses()
    },
    methods: {
      async loadCourses() {
        try {
          this.loading = true
          const options = {
            page: this.pagination.currentPage,
            search: this.searchQuery,
            status: this.statusFilter,
            limit: this.itemsPerPage,
          }
          const response = await courseService.getCourses(options)

          if (response.success) {
            this.courses = response.data
            this.pagination = {
              currentPage: response.currentPage,
              totalPages: response.totalPages,
              totalItems: response.totalItems,
              limit: response.limit,
            }
          } else {
            console.error('Error loading courses:', response.message)
          }
        } catch (error) {
          console.error('Error loading courses:', error)
        } finally {
          this.loading = false
        }
      },

      handleSearch() {
        if (this.searchTimeout) {
          window.clearTimeout(this.searchTimeout)
        }
        this.searchTimeout = window.setTimeout(() => {
          this.pagination.currentPage = 1
          this.loadCourses()
        }, 300)
      },

      async changePage(page) {
        if (page >= 1 && page <= this.pagination.totalPages) {
          this.pagination.currentPage = page
          await this.loadCourses()
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      },

      getPageNumbers() {
        if (!this.pagination) return [1]

        const current = this.pagination.currentPage
        const total = Math.max(1, this.pagination.totalPages || 1)

        if (total <= 1) return [1]

        const delta = 2
        const range = []
        const rangeWithDots = []

        for (
          let i = Math.max(2, current - delta);
          i <= Math.min(total - 1, current + delta);
          i++
        ) {
          range.push(i)
        }

        if (current - delta > 2) {
          rangeWithDots.push(1, '...')
        } else {
          rangeWithDots.push(1)
        }

        rangeWithDots.push(...range)

        if (current + delta < total - 1) {
          rangeWithDots.push('...', total)
        } else if (total !== 1) {
          rangeWithDots.push(total)
        }

        return rangeWithDots
      },

      goToCourse(courseId) {
        this.$router.push(`/courses/${courseId}`)
      },

      editCourse(course) {
        this.editingCourse = course
      },

      async deleteCourse(courseId) {
        if (
          window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')
        ) {
          try {
            await courseService.deleteCourse(courseId)
            await this.loadCourses()
          } catch (error) {
            console.error('Error deleting course:', error)
          }
        }
      },

      closeModal() {
        this.showCreateModal = false
        this.editingCourse = null
      },

      async handleCourseSaved() {
        this.closeModal()
        await this.loadCourses()
      },

      getStatusClass(status) {
        switch (status) {
          case 'completed':
            return 'bg-green-100 text-green-800'
          case 'in_progress':
            return 'bg-blue-100 text-blue-800'
          case 'suspended':
            return 'bg-orange-100 text-orange-800'
          case 'planned':
          default:
            return 'bg-gray-100 text-gray-800'
        }
      },

      getStatusText(status) {
        switch (status) {
          case 'completed':
            return 'Terminé'
          case 'in_progress':
            return 'En cours'
          case 'suspended':
            return 'Suspendu'
          case 'planned':
          default:
            return 'Planifié'
        }
      },

      formatDate(dateString) {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR')
      },

      handleItemsPerPageChange() {
        this.pagination.currentPage = 1
        this.loadCourses()
      },
    },
  }
</script>

<style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  select {
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1em;
    padding-right: 2.5rem;
  }
</style>
