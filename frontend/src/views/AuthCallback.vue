<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
      <div v-if="isLoading" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <h2 class="text-xl font-semibold text-gray-900">Connexion en cours...</h2>
        <p class="text-gray-600">Traitement de votre authentification Microsoft</p>
      </div>

      <div v-else-if="error" class="space-y-4">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900">Erreur de connexion</h2>
        <p class="text-red-600">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import authService from '../services/auth.js'

const isLoading = ref(true)
const error = ref(null)

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const errorParam = urlParams.get('error')

  window.history.replaceState({}, document.title, window.location.pathname)

  if (errorParam) {
    error.value = 'Authentification annulée ou refusée'
    isLoading.value = false
    return
  }

  if (!code) {
    error.value = "Code d'autorisation manquant"
    isLoading.value = false
    return
  }

  if (sessionStorage.getItem('auth_processing')) {
    console.log('Traitement déjà en cours, redirection...')
    window.location.href = '/dashboard'
    return
  }

  try {
    sessionStorage.setItem('auth_processing', 'true')

    await authService.handleAzureCallback(code)

    sessionStorage.removeItem('auth_processing')

    window.location.href = '/dashboard'
  } catch (err) {
    console.error("Erreur lors de l'authentification:", err)

    sessionStorage.removeItem('auth_processing')

    error.value = "Erreur lors de l'authentification. Veuillez réessayer."
    isLoading.value = false
  }
})
</script>
