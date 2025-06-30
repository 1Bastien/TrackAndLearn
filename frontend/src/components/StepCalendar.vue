<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Calendrier des étapes</h3>
      <div class="flex items-center space-x-4">
        <button
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          @click="previousMonth"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h4 class="text-lg font-medium text-gray-900 min-w-[180px] text-center">
          {{ formatMonthYear(currentDate) }}
        </h4>
        <button
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          @click="nextMonth"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1 mb-2">
      <div
        v-for="day in daysOfWeek"
        :key="day"
        class="p-2 text-center text-sm font-medium text-gray-500"
      >
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="relative min-h-[100px] border border-gray-100 rounded-lg p-1"
        :class="{
          'bg-gray-50': !day.isCurrentMonth,
          'bg-blue-50 border-blue-200': day.isToday,
          'hover:bg-gray-50': day.isCurrentMonth && !day.isToday,
        }"
      >
        <div
          class="text-sm font-medium mb-1"
          :class="{
            'text-gray-400': !day.isCurrentMonth,
            'text-blue-600': day.isToday,
            'text-gray-900': day.isCurrentMonth && !day.isToday,
          }"
        >
          {{ day.date.getDate() }}
        </div>

        <div class="space-y-1">
          <div
            v-for="step in day.steps"
            :key="step._id"
            class="text-xs p-1 rounded cursor-pointer truncate"
            :class="getStepClass(step)"
            :title="
              step.title +
              (step.endDate ? ` (Échéance: ${formatDate(step.endDate)})` : '')
            "
            @click="$emit('step-click', step)"
          >
            {{ step.title }}
          </div>
        </div>

        <div v-if="day.steps.length > 3" class="text-xs text-gray-500 mt-1">
          +{{ day.steps.length - 3 }} autres
        </div>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap gap-4 text-sm">
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
        <span class="text-gray-700">À faire</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
        <span class="text-gray-700">Terminé</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'StepCalendar',
    props: {
      steps: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['step-click'],
    data() {
      return {
        currentDate: new Date(),
        daysOfWeek: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      }
    },
    computed: {
      calendarDays() {
        const year = this.currentDate.getFullYear()
        const month = this.currentDate.getMonth()

        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)

        const startDate = new Date(firstDay)
        startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7))

        const endDate = new Date(lastDay)
        endDate.setDate(endDate.getDate() + (6 - ((lastDay.getDay() + 6) % 7)))

        const days = []
        const currentDate = new Date(startDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        while (currentDate <= endDate) {
          const day = {
            date: new Date(currentDate),
            isCurrentMonth: currentDate.getMonth() === month,
            isToday: currentDate.getTime() === today.getTime(),
            steps: this.getStepsForDate(currentDate),
          }
          days.push(day)
          currentDate.setDate(currentDate.getDate() + 1)
        }

        return days
      },
    },
    methods: {
      previousMonth() {
        this.currentDate = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth() - 1,
          1
        )
      },

      nextMonth() {
        this.currentDate = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth() + 1,
          1
        )
      },

      formatMonthYear(date) {
        return date.toLocaleDateString('fr-FR', {
          month: 'long',
          year: 'numeric',
        })
      },

      formatDate(dateString) {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR')
      },

      getStepsForDate(date) {
        return this.steps
          .filter((step) => {
            let startDate = null
            let endDate = null

            if (step.startDate) {
              startDate = new Date(step.startDate)
              startDate.setHours(0, 0, 0, 0)
            }

            if (step.endDate) {
              endDate = new Date(step.endDate)
              endDate.setHours(0, 0, 0, 0)
            }

            if (startDate || endDate) {
              if (startDate && endDate) {
                return (
                  date.getTime() >= startDate.getTime() &&
                  date.getTime() <= endDate.getTime()
                )
              } else if (startDate) {
                return date.getTime() >= startDate.getTime()
              } else if (endDate) {
                return date.getTime() <= endDate.getTime()
              }
            }

            return false
          })
          .slice(0, 4)
      },

      getStepClass(step) {
        switch (step.status) {
          case 'completed':
            return 'bg-green-100 text-green-800 border border-green-300'
          case 'todo':
          case 'in_progress':
          default:
            return 'bg-red-100 text-red-800 border border-red-300'
        }
      },
    },
  }
</script>
