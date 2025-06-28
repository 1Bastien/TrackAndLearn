<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p class="mt-1 text-gray-600">Vue d'ensemble de votre progression</p>
        </div>
        <div class="flex space-x-3">
          <BaseButton
            class="bg-blue-500 hover:bg-blue-600 text-white w-10 h-10 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
            @click="showProgressChart = true"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </BaseButton>
          <BaseButton
            class="bg-gray-400 hover:bg-gray-500 text-white w-10 h-10 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
            @click="goToFormations"
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

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900">
                {{ statistics.courses?.total || 0 }}
              </p>
              <p class="text-sm text-gray-600">Formations totales</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900">
                {{ statistics.courses?.completed || 0 }}
              </p>
              <p class="text-sm text-gray-600">Formations terminées</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900">
                {{ statistics.courses?.inProgress || 0 }}
              </p>
              <p class="text-sm text-gray-600">En cours</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900">
                {{ statistics.averageProgress || 0 }}%
              </p>
              <p class="text-sm text-gray-600">Progression moyenne</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-900">
                Formations récentes
              </h2>
              <router-link
                to="/courses"
                class="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Voir tout
              </router-link>
            </div>
          </div>
          <div class="p-6">
            <div v-if="recentCourses.length === 0" class="text-center py-8">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
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
                  @click="goToFormations"
                >
                  Créer une formation
                </BaseButton>
              </div>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="course in recentCourses"
                :key="course._id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all duration-200 cursor-pointer"
                @click="goToCourse(course._id)"
              >
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ course.title }}
                  </h3>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(course.status)"
                  >
                    {{ getStatusText(course.status) }}
                  </span>
                </div>
                <p
                  v-if="course.description"
                  class="text-gray-600 text-sm mb-3 line-clamp-2"
                >
                  {{ course.description }}
                </p>
                <div class="flex justify-between items-center">
                  <div class="text-sm text-gray-500">
                    {{ formatDate(course.createdAt) }}
                  </div>
                  <div class="text-sm font-medium text-blue-600">
                    {{ Math.round(course.progress || 0) }}% terminé
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">
              Prochaines échéances
            </h2>
          </div>
          <div class="p-6">
            <div v-if="upcomingDeadlines.length === 0" class="text-center py-8">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">
                Aucune échéance
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                Pas d'échéances dans les 7 prochains jours.
              </p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="step in upcomingDeadlines"
                :key="step._id"
                class="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all duration-200"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900">
                      {{ step.title }}
                    </h4>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ step.courseTitle }}
                    </p>
                  </div>
                  <div class="text-right">
                    <div
                      class="text-xs font-medium"
                      :class="getDeadlineClass(step.endDate)"
                    >
                      {{ getDeadlineText(step.endDate) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ formatDate(step.endDate) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ProgressChart
      v-if="showProgressChart"
      @close="showProgressChart = false"
    />
  </div>
</template>

<script>
  import BaseButton from '../components/BaseButton.vue'
  import ProgressChart from '../components/ProgressChart.vue'
  import courseService from '../services/courseService.js'
  import stepService from '../services/stepService.js'

  export default {
    name: 'DashboardView',
    components: {
      BaseButton,
      ProgressChart,
    },
    data() {
      return {
        statistics: {},
        recentCourses: [],
        upcomingDeadlines: [],
        loading: false,
        showProgressChart: false,
      }
    },
    async mounted() {
      await this.loadDashboardData()
    },
    methods: {
      async loadDashboardData() {
        try {
          this.loading = true

          const [statsResponse, coursesResponse, deadlinesResponse] =
            await Promise.all([
              courseService.getStatistics(),
              courseService.getCourses({ limit: 5 }),
              stepService.getUpcomingDeadlines(7),
            ])

          this.statistics = statsResponse.data || {}
          this.recentCourses = coursesResponse.data || []
          this.upcomingDeadlines = deadlinesResponse.data || []
        } catch (error) {
          console.error('Error loading dashboard data:', error)
        } finally {
          this.loading = false
        }
      },

      goToFormations() {
        this.$router.push('/courses')
      },

      goToCourse(courseId) {
        this.$router.push(`/courses/${courseId}`)
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

      getDeadlineClass(dateString) {
        const deadline = new Date(dateString)
        const now = new Date()
        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return 'text-red-600'
        if (diffDays <= 1) return 'text-orange-600'
        if (diffDays <= 3) return 'text-yellow-600'
        return 'text-green-600'
      },

      getDeadlineText(dateString) {
        const deadline = new Date(dateString)
        const now = new Date()
        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return 'En retard'
        if (diffDays === 0) return "Aujourd'hui"
        if (diffDays === 1) return 'Demain'
        return `Dans ${diffDays} jours`
      },

      formatDate(dateString) {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR')
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
</style>
