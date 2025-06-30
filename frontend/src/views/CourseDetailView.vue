<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <div v-else-if="course" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="mb-6">
        <nav class="flex mb-4" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <router-link
                to="/courses"
                class="text-gray-500 hover:text-gray-700"
              >
                Formations
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
            <li class="text-gray-900 font-medium">{{ course.title }}</li>
          </ol>
        </nav>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1 grid grid-cols-2 gap-4">
              <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                  {{ course.title }}
                </h1>
                <p v-if="course.description" class="text-gray-600 text-lg">
                  {{ course.description }}
                </p>
              </div>
              <div v-if="course.objectives">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  Objectifs
                </h3>
                <p class="text-gray-600">{{ course.objectives }}</p>
              </div>
            </div>
            <div class="flex space-x-2 ml-4">
              <BaseButton
                class="text-gray-700 bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                @click="editCourse"
              >
                <svg
                  class="w-5 h-5 m-auto"
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
              </BaseButton>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">
                {{ Math.round(course.progress || 0) }}%
              </div>
              <div class="text-sm text-blue-600">Progression</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-green-600">
                {{ completedStepsCount }}
              </div>
              <div class="text-sm text-green-600">Étapes terminées</div>
            </div>
            <div class="bg-orange-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-orange-600">
                {{ totalStepsCount }}
              </div>
              <div class="text-sm text-orange-600">Total étapes</div>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-purple-600">
                <span
                  class="px-3 py-1 text-sm font-medium rounded-full"
                  :class="getStatusClass(course.status)"
                >
                  {{ getStatusText(course.status) }}
                </span>
              </div>
              <div class="text-sm text-purple-600">Statut</div>
            </div>
          </div>

          <div class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progression globale</span>
              <span>{{ Math.round(course.progress || 0) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div
                class="bg-blue-600 h-3 rounded-full transition-all duration-300"
                :style="`width: ${course.progress || 0}%`"
              ></div>
            </div>
          </div>

          <div
            v-if="course.startDate || course.endDate"
            class="flex space-x-6 text-sm text-gray-600"
          >
            <div v-if="course.startDate">
              <span class="font-medium">Début prévu:</span>
              {{ formatDate(course.startDate) }}
            </div>
            <div v-if="course.endDate">
              <span class="font-medium">Fin prévue:</span>
              {{ formatDate(course.endDate) }}
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900">
              Étapes du parcours
            </h2>
            <BaseButton
              class="text-gray-700 bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              @click="showStepModal = true"
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

          <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              :class="[
                'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200',
                currentView === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700',
              ]"
              @click="currentView = 'list'"
            >
              <svg
                class="w-4 h-4 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              Liste
            </button>
            <button
              :class="[
                'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200',
                currentView === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700',
              ]"
              @click="currentView = 'calendar'"
            >
              <svg
                class="w-4 h-4 inline mr-2"
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
              Calendrier
            </button>
          </div>
        </div>

        <div v-if="currentView === 'list'" class="p-6">
          <div v-if="steps.length === 0" class="text-center py-12">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune étape</h3>
            <p class="mt-1 text-sm text-gray-500">
              Commencez par ajouter votre première étape.
            </p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(step, index) in steps"
              :key="step._id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all duration-200"
              :class="{
                'bg-green-50 border-green-200': step.status === 'completed',
              }"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start space-x-3 flex-1">
                  <button
                    class="mt-1 flex-shrink-0"
                    @click="toggleStepStatus(step)"
                  >
                    <div
                      class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                      :class="
                        step.status === 'completed'
                          ? 'bg-green-600 border-green-600'
                          : 'border-gray-300 hover:border-blue-500'
                      "
                    >
                      <svg
                        v-if="step.status === 'completed'"
                        class="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>

                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <span class="text-sm font-medium text-gray-500"
                        >#{{ index + 1 }}</span
                      >
                      <h3
                        class="text-lg font-medium text-gray-900"
                        :class="{
                          'line-through text-gray-500':
                            step.status === 'completed',
                        }"
                      >
                        {{ step.title }}
                      </h3>
                      <span
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="getStepStatusClass(step.status)"
                      >
                        {{ getStepStatusText(step.status) }}
                      </span>
                    </div>

                    <p v-if="step.description" class="text-gray-600 mb-2">
                      {{ step.description }}
                    </p>

                    <div
                      class="flex items-center space-x-4 text-sm text-gray-500"
                    >
                      <div v-if="step.externalLink" class="flex items-center">
                        <svg
                          class="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        <a
                          :href="step.externalLink"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-blue-600 hover:text-blue-800"
                        >
                          Lien externe
                        </a>
                      </div>
                      <div v-if="step.endDate" class="flex items-center">
                        <svg
                          class="w-4 h-4 mr-1"
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
                        Échéance: {{ formatDate(step.endDate) }}
                      </div>
                      <div
                        v-if="step.completedDate && step.status === 'completed'"
                        class="flex items-center"
                      >
                        <svg
                          class="w-4 h-4 mr-1"
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
                        Terminé le: {{ formatDateTime(step.completedDate) }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex space-x-2 ml-4">
                  <button
                    class="p-1 text-gray-400 hover:text-blue-600"
                    @click="editStep(step)"
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
                    @click="deleteStep(step._id)"
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
            </div>
          </div>

          <div
            v-if="stepsPagination && stepsPagination.totalPages > 1"
            class="mt-6 flex justify-center"
          >
            <nav class="flex space-x-2">
              <button
                :disabled="stepsPagination.currentPage === 1"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="changeStepsPage(stepsPagination.currentPage - 1)"
              >
                Précédent
              </button>
              <button
                v-for="page in getStepsPageNumbers()"
                :key="page"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-md',
                  page === stepsPagination.currentPage
                    ? 'text-blue-600 bg-blue-50 border border-blue-300'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50',
                ]"
                @click="changeStepsPage(page)"
              >
                {{ page }}
              </button>
              <button
                :disabled="
                  stepsPagination.currentPage === stepsPagination.totalPages
                "
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="changeStepsPage(stepsPagination.currentPage + 1)"
              >
                Suivant
              </button>
            </nav>
          </div>
        </div>

        <div v-if="currentView === 'calendar'" class="p-6">
          <StepCalendar :steps="steps" @step-click="editStep" />
        </div>
      </div>
    </div>

    <CourseModal
      v-if="showEditModal"
      :course="course"
      @close="showEditModal = false"
      @saved="handleCourseSaved"
    />

    <StepModal
      v-if="showStepModal || editingStep"
      :step="editingStep"
      :course-id="courseId"
      @close="closeStepModal"
      @saved="handleStepSaved"
    />
  </div>
</template>

<script>
  import BaseButton from '../components/BaseButton.vue'
  import CourseModal from '../components/CourseModal.vue'
  import StepModal from '../components/StepModal.vue'
  import StepCalendar from '../components/StepCalendar.vue'
  import courseService from '../services/courseService.js'
  import stepService from '../services/stepService.js'

  export default {
    name: 'CourseDetailView',
    components: {
      BaseButton,
      CourseModal,
      StepModal,
      StepCalendar,
    },
    data() {
      return {
        course: null,
        steps: [],
        loading: false,
        showEditModal: false,
        showStepModal: false,
        editingStep: null,
        stepsPagination: null,
        currentView: 'list',
      }
    },
    computed: {
      courseId() {
        return this.$route.params.id
      },
      totalStepsCount() {
        return this.steps.length
      },
      completedStepsCount() {
        return this.steps.filter((step) => step.status === 'completed').length
      },
    },
    watch: {
      currentView() {
        this.loadCourseData()
      },
    },
    async mounted() {
      await this.loadCourseData()
    },
    methods: {
      async loadCourseData(options = {}) {
        try {
          this.loading = true
          const [courseResponse, stepsResponse] = await Promise.all([
            courseService.getCourse(this.courseId),
            stepService.getStepsByCourse(this.courseId, {
              page: options.page || 1,
              limit: this.currentView === 'calendar' ? 1000 : 12, // Pas de limite pour le calendrier
              status: options.status,
            }),
          ])

          this.course = courseResponse.data
          this.steps = stepsResponse.data || []
          this.stepsPagination = stepsResponse.pagination
        } catch (error) {
          console.error('Error loading course data:', error)
          this.$router.push('/courses')
        } finally {
          this.loading = false
        }
      },

      async toggleStepStatus(step) {
        try {
          if (step.status === 'completed') {
            // Si déjà terminé, remettre en cours
            await stepService.updateStep(step._id, { status: 'in_progress' })
          } else {
            // Marquer comme terminé
            await stepService.markStepCompleted(step._id)
          }
          await this.loadCourseData()
        } catch (error) {
          console.error('Error updating step status:', error)
        }
      },

      editCourse() {
        this.showEditModal = true
      },

      editStep(step) {
        this.editingStep = step
      },

      async deleteStep(stepId) {
        if (
          window.confirm('Êtes-vous sûr de vouloir supprimer cette étape ?')
        ) {
          try {
            await stepService.deleteStep(stepId)
            await this.loadCourseData()
          } catch (error) {
            console.error('Error deleting step:', error)
          }
        }
      },

      closeStepModal() {
        this.showStepModal = false
        this.editingStep = null
      },

      async handleCourseSaved() {
        this.showEditModal = false
        await this.loadCourseData()
      },

      async handleStepSaved() {
        this.closeStepModal()
        await this.loadCourseData()
      },

      getStatusClass(status) {
        switch (status) {
          case 'completed':
            return 'bg-white text-green-600 border border-green-600'
          case 'in_progress':
            return 'bg-white text-blue-600 border border-blue-600'
          case 'suspended':
            return 'bg-white text-orange-600 border border-orange-600'
          case 'planned':
          default:
            return 'bg-white text-gray-600 border border-gray-600'
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

      getStepStatusClass(status) {
        switch (status) {
          case 'completed':
            return 'bg-green-100 text-green-800'
          case 'in_progress':
            return 'bg-blue-100 text-blue-800'
          case 'todo':
          default:
            return 'bg-gray-100 text-gray-800'
        }
      },

      getStepStatusText(status) {
        switch (status) {
          case 'completed':
            return 'Terminé'
          case 'in_progress':
            return 'En cours'
          case 'todo':
          default:
            return 'À faire'
        }
      },

      formatDate(dateString) {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR')
      },

      formatDateTime(dateString) {
        if (!dateString) return ''
        const date = new Date(dateString)
        return (
          date.toLocaleDateString('fr-FR') +
          ' à ' +
          date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })
        )
      },

      getStepsPageNumbers() {
        const pageNumbers = []
        for (let i = 1; i <= this.stepsPagination.totalPages; i++) {
          pageNumbers.push(i)
        }
        return pageNumbers
      },

      changeStepsPage(page) {
        this.loadCourseData({ page })
      },
    },
  }
</script>
