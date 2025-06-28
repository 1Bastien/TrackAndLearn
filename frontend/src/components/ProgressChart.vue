<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="closeModal"
  >
    <div
      class="bg-white rounded-xl p-6 w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          Progression des formations
        </h2>
        <button class="text-gray-400 hover:text-gray-600" @click="closeModal">
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

      <div class="h-96 w-full">
        <LineChart
          v-if="chartData.datasets.length > 0"
          :data="chartData"
          :options="chartOptions"
        />
        <div v-else class="flex items-center justify-center h-full">
          <div class="text-center">
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              Aucune donnée de progression
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Les données de progression apparaîtront ici une fois que vous
              aurez des formations avec des étapes validées.
            </p>
          </div>
        </div>
      </div>

      <div v-if="chartData.datasets.length > 0" class="mt-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Légende</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="(dataset, index) in chartData.datasets"
            :key="index"
            class="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
          >
            <div
              class="w-4 h-4 rounded-full"
              :style="{ backgroundColor: dataset.borderColor }"
            ></div>
            <span class="text-sm font-medium text-gray-700">{{
              dataset.label
            }}</span>
            <span class="text-xs text-gray-500"
              >({{
                Math.round(dataset.data[dataset.data.length - 1]?.y || 0)
              }}%)</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Line as LineChart } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
  } from 'chart.js'
  import 'chartjs-adapter-date-fns'
  import courseService from '../services/courseService.js'

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
  )

  export default {
    name: 'ProgressChart',
    components: {
      LineChart,
    },
    emits: ['close'],
    data() {
      return {
        chartData: {
          datasets: [],
        },
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: ${Math.round(context.parsed.y)}%`
                },
              },
            },
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'dd/MM',
                  week: 'dd/MM',
                  month: 'MM/yy',
                },
              },
              title: {
                display: true,
                text: 'Date',
              },
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.1)',
              },
            },
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Progression (%)',
              },
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.1)',
              },
              ticks: {
                callback: function (value) {
                  return value + '%'
                },
              },
            },
          },
        },
        colors: [
          '#3B82F6', // bleu
          '#EF4444', // rouge
          '#10B981', // vert
          '#F59E0B', // jaune
          '#8B5CF6', // violet
          '#F97316', // orange
          '#06B6D4', // cyan
          '#84CC16', // vert clair
          '#EC4899', // rose
          '#6B7280', // gris
        ],
      }
    },
    async mounted() {
      await this.loadProgressData()
    },
    methods: {
      async loadProgressData() {
        try {
          const response = await courseService.getProgressHistory()
          this.processProgressData(response.data || [])
        } catch (error) {
          console.error(
            'Erreur lors du chargement des données de progression:',
            error
          )
          this.chartData = { datasets: [] }
        }
      },

      processProgressData(courses) {
        if (!courses || courses.length === 0) {
          this.chartData = { datasets: [] }
          return
        }

        const datasets = courses.map((course, index) => {
          const progressPoints = this.calculateProgressOverTime(course)

          return {
            label: course.title,
            data: progressPoints,
            borderColor: this.colors[index % this.colors.length],
            backgroundColor: this.colors[index % this.colors.length] + '20',
            borderWidth: 2,
            fill: false,
            tension: 0.1,
            pointRadius: 3,
            pointHoverRadius: 5,
          }
        })

        this.adjustTimeUnit(courses)

        this.chartData = {
          datasets,
        }
      },

      adjustTimeUnit(courses) {
        if (!courses || courses.length === 0) return

        const now = new Date()
        let earliestDate = now

        courses.forEach((course) => {
          const startDate = course.startDate
            ? new Date(course.startDate)
            : new Date(course.createdAt || Date.now())
          if (startDate < earliestDate) {
            earliestDate = startDate
          }
        })

        const totalDays = Math.ceil(
          (now - earliestDate) / (1000 * 60 * 60 * 24)
        )

        if (totalDays > 365) {
          this.chartOptions.scales.x.time.unit = 'month'
        } else if (totalDays > 90) {
          this.chartOptions.scales.x.time.unit = 'week'
        } else {
          this.chartOptions.scales.x.time.unit = 'day'
        }
      },

      calculateProgressOverTime(course) {
        const points = []

        const courseStartDate = course.startDate
          ? new Date(course.startDate)
          : new Date(course.createdAt || Date.now())

        points.push({
          x: courseStartDate,
          y: 0,
        })

        if (course.steps && course.steps.length > 0) {
          const totalSteps = course.steps.length
          let completedSteps = 0

          const completedStepsSorted = course.steps
            .filter((step) => step.completedDate)
            .sort(
              (a, b) => new Date(a.completedDate) - new Date(b.completedDate)
            )

          completedStepsSorted.forEach((step) => {
            const completionDate = new Date(step.completedDate)
            if (completionDate >= courseStartDate) {
              completedSteps++
              const progress = (completedSteps / totalSteps) * 100
              points.push({
                x: completionDate,
                y: progress,
              })
            }
          })

          const today = new Date()
          const currentCompletedSteps = course.steps.filter(
            (step) =>
              step.completedDate &&
              new Date(step.completedDate) >= courseStartDate
          ).length
          const currentProgress =
            currentCompletedSteps > 0
              ? (currentCompletedSteps / totalSteps) * 100
              : 0

          if (
            points.length === 1 ||
            points[points.length - 1].y !== currentProgress ||
            points[points.length - 1].x.getTime() !== today.getTime()
          ) {
            points.push({
              x: today,
              y: currentProgress,
            })
          }
        } else {
          points.push({
            x: new Date(),
            y: 0,
          })
        }

        return points
      },

      closeModal() {
        this.$emit('close')
      },
    },
  }
</script>
