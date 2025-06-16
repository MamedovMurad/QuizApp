import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'vendor_react'
            }
            if (id.includes('antd')) {
              return 'vendor_antd'
            }
            // digər paketləri qruplaşdırmaq üçün
            return 'vendor'
          }
        }
      }
    },
    // opsional olaraq xəbərdarlıq limitini artırmaq üçün
    chunkSizeWarningLimit: 1000, // 1 MB limit qoyulur, istəsən daha da artır
  }
})
