<template>
  <div
    class="fixed inset-0 bg-opacity-25 backdrop-blur-sm z-50"
    @click="closeModal"
  >
    <div
      class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg w-[600px] max-w-[90vw] shadow-2xl"
      @click.stop
    >
      <div class="flex items-center p-4 border-b border-gray-200">
        <svg
          class="w-5 h-5 text-gray-400 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher..."
          class="flex-1 text-base outline-none"
          @input="performSearch"
          @keydown.escape="closeModal"
        />
        <button
          class="ml-3 text-gray-400 hover:text-gray-600"
          @click="closeModal"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="max-h-80 overflow-y-auto">
        <div v-if="loading" class="p-6 text-center">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
          <p class="mt-2 text-gray-600">Recherche en cours...</p>
        </div>

        <div
          v-else-if="searchQuery && results.length === 0"
          class="p-6 text-center"
        >
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
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5.657-2.343m0-8.586A7.966 7.966 0 0112 4c1.995 0 3.84.758 5.224 2"
            ></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun résultat</h3>
          <p class="mt-1 text-sm text-gray-500">
            Aucune formation ou étape ne correspond à votre recherche.
          </p>
        </div>

        <div v-else-if="!searchQuery" class="p-6 text-center">
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Rechercher</h3>
          <p class="mt-1 text-sm text-gray-500">
            Tapez pour rechercher dans vos formations et étapes.
          </p>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div v-if="courseResults.length > 0" class="p-3">
            <h3 class="text-sm font-medium text-gray-900 mb-3">
              Formations ({{ courseResults.length }})
            </h3>
            <div class="space-y-2">
              <div
                v-for="course in courseResults"
                :key="'course-' + course._id"
                class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                @click="goToCourse(course._id)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900">
                      <span
                        v-for="(part, index) in highlightMatch(course.title)"
                        :key="index"
                        :class="{
                          'bg-yellow-200 px-1 rounded': part.highlight,
                        }"
                      >
                        {{ part.text }}
                      </span>
                    </h4>
                    <p
                      v-if="course.description"
                      class="text-sm text-gray-600 mt-1"
                    >
                      <span
                        v-for="(part, index) in highlightMatch(
                          course.description
                        )"
                        :key="index"
                        :class="{
                          'bg-yellow-200 px-1 rounded': part.highlight,
                        }"
                      >
                        {{ part.text }}
                      </span>
                    </p>
                  </div>
                  <div class="ml-4">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="getStatusClass(course.status)"
                    >
                      {{ getStatusText(course.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="stepResults.length > 0" class="p-3">
            <h3 class="text-sm font-medium text-gray-900 mb-3">
              Étapes ({{ stepResults.length }})
            </h3>
            <div class="space-y-2">
              <div
                v-for="step in stepResults"
                :key="'step-' + step._id"
                class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                @click="goToStep(step)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900">
                      <span
                        v-for="(part, index) in highlightMatch(step.title)"
                        :key="index"
                        :class="{
                          'bg-yellow-200 px-1 rounded': part.highlight,
                        }"
                      >
                        {{ part.text }}
                      </span>
                    </h4>
                    <p
                      v-if="step.description"
                      class="text-sm text-gray-600 mt-1"
                    >
                      <span
                        v-for="(part, index) in highlightMatch(
                          step.description
                        )"
                        :key="index"
                        :class="{
                          'bg-yellow-200 px-1 rounded': part.highlight,
                        }"
                      >
                        {{ part.text }}
                      </span>
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      Formation: {{ step.courseTitle }}
                    </p>
                  </div>
                  <div class="ml-4">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="getStepStatusClass(step.status)"
                    >
                      {{ getStepStatusText(step.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import courseService from '../services/courseService.js'

  export default {
    name: 'SearchModal',
    emits: ['close'],
    data() {
      return {
        searchQuery: '',
        loading: false,
        results: [],
        searchTimeout: null,
      }
    },
    computed: {
      courseResults() {
        return this.results.filter((item) => item.type === 'course')
      },
      stepResults() {
        return this.results.filter((item) => item.type === 'step')
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.searchInput.focus()
      })
    },
    methods: {
      closeModal() {
        this.$emit('close')
      },

      async performSearch() {
        if (this.searchTimeout) {
          window.clearTimeout(this.searchTimeout)
        }

        if (!this.searchQuery.trim()) {
          this.results = []
          return
        }

        this.searchTimeout = window.setTimeout(async () => {
          try {
            this.loading = true
            const response = await courseService.globalSearch(
              this.searchQuery.trim()
            )
            this.results = response.data || []
          } catch (error) {
            console.error('Erreur lors de la recherche:', error)
            this.results = []
          } finally {
            this.loading = false
          }
        }, 300)
      },

      highlightMatch(text) {
        if (!text || !this.searchQuery) return [{ text, highlight: false }]

        const regex = new RegExp(
          this.searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'gi'
        )
        const parts = []
        let lastIndex = 0
        let match

        while ((match = regex.exec(text)) !== null) {
          if (lastIndex < match.index) {
            parts.push({
              text: text.slice(lastIndex, match.index),
              highlight: false,
            })
          }
          parts.push({ text: match[0], highlight: true })
          lastIndex = regex.lastIndex
        }

        if (lastIndex < text.length) {
          parts.push({ text: text.slice(lastIndex), highlight: false })
        }

        return parts
      },

      goToCourse(courseId) {
        this.$router.push(`/courses/${courseId}`)
        this.closeModal()
      },

      goToStep(step) {
        this.$router.push(`/courses/${step.courseId}`)
        this.closeModal()
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
    },
  }
</script>

<style scoped>
  mark {
    background-color: #fef08a;
    padding: 0.125rem;
    border-radius: 0.25rem;
  }
</style>
