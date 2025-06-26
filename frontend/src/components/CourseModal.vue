<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
    >
      <div class="mt-3">
        <div class="flex justify-between items-center pb-3 border-b">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditing ? 'Modifier la formation' : 'Nouvelle formation' }}
          </h3>
          <button
            class="text-gray-400 hover:text-gray-600"
            @click="$emit('close')"
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

        <form class="mt-6" @submit.prevent="saveFormation">
          <div class="space-y-4">
            <div>
              <label
                for="titre"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Titre de la formation *
              </label>
              <input
                id="titre"
                v-model="form.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Formation Vue.js"
              />
            </div>

            <div>
              <label
                for="description"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Décrivez les objectifs et le contenu de votre formation..."
              ></textarea>
            </div>

            <div>
              <label
                for="objectifs"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Objectifs d'apprentissage
              </label>
              <textarea
                id="objectifs"
                v-model="form.objectives"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Listez les compétences que vous souhaitez acquérir..."
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  for="dateDebut"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date de début prévue
                </label>
                <input
                  id="dateDebut"
                  v-model="form.startDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  for="dateFin"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date de fin prévue
                </label>
                <input
                  id="dateFin"
                  v-model="form.endDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <BaseButton
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              @click="$emit('close')"
            >
              Annuler
            </BaseButton>
            <BaseButton
              type="submit"
              :disabled="!form.title || saving"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="saving" class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enregistrement...
              </span>
              <span v-else>
                {{ isEditing ? 'Modifier' : 'Créer' }}
              </span>
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import BaseButton from './BaseButton.vue'
  import courseService from '../services/courseService.js'

  export default {
    name: 'CourseModal',
    components: {
      BaseButton,
    },
    props: {
      course: {
        type: Object,
        default: null,
      },
    },
    emits: ['close', 'saved'],
    data() {
      return {
        saving: false,
        form: {
          title: '',
          description: '',
          objectives: '',
          startDate: '',
          endDate: '',
        },
      }
    },
    computed: {
      isEditing() {
        return !!this.course
      },
    },
    mounted() {
      if (this.course) {
        this.form = {
          title: this.course.title || '',
          description: this.course.description || '',
          objectives: this.course.objectives || '',
          startDate: this.course.startDate
            ? this.formatDateForInput(this.course.startDate)
            : '',
          endDate: this.course.endDate
            ? this.formatDateForInput(this.course.endDate)
            : '',
        }
      }
    },
    methods: {
      async saveFormation() {
        try {
          this.saving = true

          const formData = { ...this.form }

          if (formData.startDate) {
            formData.startDate = new Date(formData.startDate).toISOString()
          }
          if (formData.endDate) {
            formData.endDate = new Date(formData.endDate).toISOString()
          }

          if (this.isEditing) {
            await courseService.updateCourse(this.course._id, formData)
          } else {
            await courseService.createCourse(formData)
          }

          this.$emit('saved')
        } catch (error) {
          console.error('Error saving course:', error)
        } finally {
          this.saving = false
        }
      },

      formatDateForInput(dateString) {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      },
    },
  }
</script>
