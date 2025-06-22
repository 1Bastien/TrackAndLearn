<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
      <div v-if="user" class="space-y-4">
        <div
          class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-10 h-10 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        <h1 class="text-3xl font-bold text-gray-900">
          Bonjour {{ `${user.firstName} ${user.lastName}` }} !
        </h1>

        <div class="pt-4 space-y-2 text-sm text-gray-500">
          <p>Première connexion : {{ formatDate(user.createdAt) }}</p>
          <p>Dernière connexion : {{ formatDate(user.lastLogin) }}</p>
        </div>

        <div class="pt-6">
          <BaseButton
            class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
            @click="handleLogout"
          >
            Se déconnecter
          </BaseButton>
        </div>
      </div>

      <div v-else class="text-center">
        <p class="text-gray-600">Chargement des informations utilisateur...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import authService from '../services/auth.js'
  import BaseButton from '../components/BaseButton.vue'

  const router = useRouter()
  const user = ref(null)

  onMounted(async () => {
    if (!authService.isAuthenticated()) {
      router.push('/')
      return
    }

    user.value = await authService.getCurrentUser()
  })

  const formatDate = (dateString) => {
    if (!dateString) return 'Non disponible'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleLogout = () => {
    authService.logout()
    router.push('/')
  }
</script>
