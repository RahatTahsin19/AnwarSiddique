import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  base: "/AnwarSiddique/", // আপনার গিটহাব রিপোজিটরির নাম এখানে হবে
})
