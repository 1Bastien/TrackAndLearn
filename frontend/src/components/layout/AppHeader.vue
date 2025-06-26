<template>
  <header class="bg-white shadow-lg border-b border-gray-100">
    <div class="mx-auto px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <h1 class="text-2xl font-bold text-gray-900">
              <router-link to="/">
                <span class="text-blue-600">Track&</span>Learn
              </router-link>
            </h1>
          </div>
        </div>

        <div class="hidden md:flex md:items-center md:space-x-4">
          <BaseButton
            class="mr-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
            @click="handleCreatePath"
          >
            Créer un parcours
          </BaseButton>

          <div v-if="isAuthenticated" ref="userMenuRef" class="relative">
            <button
              class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none"
              @click="toggleUserMenu"
            >
              <svg
                class="w-6 h-6 text-gray-600"
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
            </button>

            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
            >
              <router-link
                to="/dashboard"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="closeUserMenu"
              >
                Dashboard
              </router-link>
              <router-link
                to="/courses"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="closeUserMenu"
              >
                Mes formations
              </router-link>
              <router-link
                to="/account"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="closeUserMenu"
              >
                Mon compte
              </router-link>
              <button
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="handleLogout"
              >
                Se déconnecter
              </button>
            </div>
          </div>

          <BaseButton
            v-else
            class="px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
            @click="handleLogin"
          >
            Se connecter
          </BaseButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import BaseButton from '../BaseButton.vue'
  import authService from '../../services/auth.js'

  const router = useRouter()
  const isAuthenticated = ref(authService.isAuthenticated())
  const isUserMenuOpen = ref(false)
  const userMenuRef = ref(null)

  const handleClickOutside = (event) => {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
      isUserMenuOpen.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value
  }

  const closeUserMenu = () => {
    isUserMenuOpen.value = false
  }

  const handleCreatePath = async () => {
    if (isAuthenticated.value) {
      router.push('/courses')
    } else {
      handleLogin()
    }
  }

  const handleLogin = async () => {
    try {
      const authUrl = await authService.getAzureLoginUrl()
      window.location.href = authUrl
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      window.alert('Erreur lors de la connexion. Veuillez réessayer.')
    }
  }

  const handleLogout = () => {
    authService.logout()
    isAuthenticated.value = false
    closeUserMenu()
    router.push('/')
  }

  window.addEventListener('focus', () => {
    isAuthenticated.value = authService.isAuthenticated()
  })
</script>

<style scoped>
  .relative {
    position: relative;
  }
</style>
