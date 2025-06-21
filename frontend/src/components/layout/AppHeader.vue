<template>
  <header class="bg-white shadow-lg border-b border-gray-100">
    <div class="max-w-6xl mx-auto px-8">
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
            to="/"
            class="mr-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Créer un parcours
          </BaseButton>
          <BaseButton
            to="/"
            class="px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            Se connecter
          </BaseButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
  import BaseButton from '../BaseButton.vue'
</script>

<style scoped></style>
