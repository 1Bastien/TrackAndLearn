<template>
  <div>
    <section class="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div class="max-w-6xl mx-auto px-8">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-gray-900 mb-6">
            Bienvenue sur
            <span class="text-blue-600">Track&</span>Learn
          </h1>
          <p
            class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Votre plateforme de gestion de parcours d'apprentissage
            personnalisés. Créez, suivez et atteignez vos objectifs
            d'apprentissage de manière structurée et efficace.
          </p>
          <div class="flex justify-center space-x-4">
            <BaseButton
              class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              @click="handleCreatePath"
            >
              Créer mon parcours
            </BaseButton>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            Apprendre, maintenant c'est facile
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour gérer efficacement votre
            apprentissage
          </p>
        </div>

        <div class="grid grid-cols-3 gap-8">
          <div
            class="text-center p-6 rounded-lg hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200"
          >
            <div
              class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-blue-600"
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
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              Parcours personnalisés
            </h3>
            <p class="text-gray-600">
              Créez des parcours d'apprentissage sur mesure avec titres,
              descriptions et objectifs clairs.
            </p>
          </div>

          <div
            class="text-center p-6 rounded-lg hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200"
          >
            <div
              class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              Modules d'apprentissage
            </h3>
            <p class="text-gray-600">
              Ajoutez des étapes avec liens externes, dates cibles et suivez
              leur statut d'avancement.
            </p>
          </div>

          <div
            class="text-center p-6 rounded-lg hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200"
          >
            <div
              class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-purple-600"
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
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              Suivi de progression
            </h3>
            <p class="text-gray-600">
              Visualisez votre progression avec des graphiques et un calcul
              automatique du pourcentage d'avancement.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-gray-50">
      <div class="max-w-6xl mx-auto px-8">
        <div class="grid grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold text-blue-600 mb-2">
              <svg
                class="w-8 h-8 mx-auto"
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
            </div>
            <div class="text-gray-600">Vue calendrier</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-green-600 mb-2">
              <svg
                class="w-8 h-8 mx-auto"
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
            </div>
            <div class="text-gray-600">Tableau de bord</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-purple-600 mb-2">
              <svg
                class="w-8 h-8 mx-auto"
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
            </div>
            <div class="text-gray-600">Recherche avancée</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-orange-600 mb-2">
              <svg
                class="w-8 h-8 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
            </div>
            <div class="text-gray-600">Filtres intelligents</div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-blue-600">
      <div class="max-w-4xl mx-auto px-8 text-center">
        <h2 class="text-4xl font-bold text-white mb-6">
          Prêt à organiser votre apprentissage ?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Commencez dès maintenant à créer et suivre vos parcours
          d'apprentissage personnalisés
        </p>
        <BaseButton
          class="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          @click="handleCreatePath"
        >
          Créer mon premier parcours
        </BaseButton>
      </div>
    </section>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import authService from '../services/auth.js'

  const router = useRouter()

  const handleCreatePath = async () => {
    if (authService.isAuthenticated()) {
      router.push('/dashboard')
    } else {
      const authUrl = await authService.getAzureLoginUrl()
      window.location.href = authUrl
    }
  }
</script>

<style scoped></style>
