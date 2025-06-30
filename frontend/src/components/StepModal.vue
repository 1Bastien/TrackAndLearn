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
            {{ isEditing ? "Modifier l'étape" : 'Nouvelle étape' }}
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

        <form class="mt-6" @submit.prevent="saveStep">
          <div class="space-y-4">
            <div>
              <label
                for="titre"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Titre de l'étape *
              </label>
              <input
                id="titre"
                v-model="form.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Étudier les composants Vue.js"
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
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Décrivez ce qui doit être fait dans cette étape..."
              ></textarea>
            </div>

            <div>
              <label
                for="lienExterne"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Lien externe (optionnel)
              </label>
              <input
                id="lienExterne"
                v-model="form.externalLink"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/course"
              />
              <p class="mt-1 text-xs text-gray-500">
                Lien vers une vidéo, un cours en ligne, ou tout autre ressource
              </p>
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
                  for="dateEcheance"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date d'échéance
                </label>
                <input
                  id="dateEcheance"
                  v-model="form.endDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                for="statut"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Statut
              </label>
              <select
                id="statut"
                v-model="form.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                @change="handleStatusChange"
              >
                <option value="todo">À faire</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
              </select>
            </div>

            <div v-if="form.status === 'completed'">
              <label
                for="dateCompletion"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Date de completion
              </label>
              <input
                id="dateCompletion"
                v-model="form.completedDate"
                type="datetime-local"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p class="mt-1 text-xs text-gray-500">
                Laissez vide pour utiliser la date courante lors de la
                sauvegarde
              </p>
            </div>

            <div v-if="!isEditing">
              <label
                for="ordre"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Position dans le parcours
              </label>
              <input
                id="ordre"
                v-model.number="form.order"
                type="number"
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1"
              />
              <p class="mt-1 text-xs text-gray-500">
                Laissez vide pour ajouter à la fin
              </p>
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
  import stepService from '../services/stepService.js'

  export default {
    name: 'StepModal',
    components: {
      BaseButton,
    },
    props: {
      step: {
        type: Object,
        default: null,
      },
      courseId: {
        type: String,
        required: true,
      },
    },
    emits: ['close', 'saved'],
    data() {
      return {
        saving: false,
        form: {
          title: '',
          description: '',
          externalLink: '',
          startDate: '',
          endDate: '',
          completedDate: '',
          status: 'todo',
          order: null,
        },
      }
    },
    computed: {
      isEditing() {
        return !!this.step
      },
    },
    mounted() {
      if (this.step) {
        this.form = {
          title: this.step.title || '',
          description: this.step.description || '',
          externalLink: this.step.externalLink || '',
          startDate: this.step.startDate
            ? this.formatDateForInput(this.step.startDate)
            : '',
          endDate: this.step.endDate
            ? this.formatDateForInput(this.step.endDate)
            : '',
          completedDate: this.step.completedDate
            ? this.formatDateTimeForInput(this.step.completedDate)
            : '',
          status: this.step.status || 'todo',
          order: this.step.order || null,
        }
      }
    },
    methods: {
      async saveStep() {
        try {
          this.saving = true

          const formData = { ...this.form }

          formData.courseId = this.courseId

          if (formData.startDate) {
            formData.startDate = new Date(formData.startDate).toISOString()
          }
          if (formData.endDate) {
            formData.endDate = new Date(formData.endDate).toISOString()
          }
          if (formData.completedDate) {
            formData.completedDate = new Date(
              formData.completedDate
            ).toISOString()
          }

          if (!formData.externalLink) {
            delete formData.externalLink
          }
          if (!formData.description) {
            delete formData.description
          }
          if (!formData.startDate) {
            delete formData.startDate
          }
          if (!formData.endDate) {
            delete formData.endDate
          }
          if (!formData.completedDate) {
            delete formData.completedDate
          }
          if (!formData.order) {
            delete formData.order
          }

          if (this.isEditing) {
            await stepService.updateStep(this.step._id, formData)
          } else {
            await stepService.createStep(formData)
          }

          this.$emit('saved')
        } catch (error) {
          console.error('Error saving step:', error)
        } finally {
          this.saving = false
        }
      },

      formatDateForInput(dateString) {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      },

      formatDateTimeForInput(dateString) {
        if (!dateString) return ''
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
      },

      handleStatusChange() {
        if (this.form.status === 'completed' && !this.form.completedDate) {
          const now = new Date()
          this.form.completedDate = this.formatDateTimeForInput(now)
        } else if (this.form.status !== 'completed') {
          this.form.completedDate = ''
        }
      },
    },
  }
</script>
