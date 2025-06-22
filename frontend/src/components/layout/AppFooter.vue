<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-6xl mx-auto px-8 py-12">
      <div class="grid grid-cols-4 gap-8">
        <div class="col-span-1">
          <h3 class="text-xl font-bold mb-4">
            <span class="text-blue-400">Track&</span>Learn
          </h3>
        </div>

        <div class="col-span-1">
          <h4 class="text-lg font-semibold mb-4">Navigation</h4>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/"
                class="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                Accueil
              </router-link>
            </li>
            <li>
              <a
                href="#"
                class="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                À propos
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div class="col-span-1">
          <h4 class="text-lg font-semibold mb-4">Support</h4>
          <ul class="space-y-2">
            <li>
              <a
                href="#"
                class="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                Documentation
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                FAQ
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                Support technique
              </a>
            </li>
          </ul>
        </div>

        <div class="col-span-1">
          <h4 class="text-lg font-semibold mb-4">Contact</h4>
          <div class="space-y-2">
            <p class="text-gray-400 text-sm">
              <span class="block">contact@tracklearn.com</span>
              <span class="block">+33 6 12 34 56 78</span>
            </p>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8">
        <div class="flex justify-between items-center">
          <p class="text-gray-400 text-sm">
            © 2025 Track&Learn. Tous droits réservés.
          </p>
          <div class="flex space-x-6">
            <a
              href="#"
              class="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Politique de confidentialité
            </a>
            <a
              href="#"
              class="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Conditions d'utilisation
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped></style>
