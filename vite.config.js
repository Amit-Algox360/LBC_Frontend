// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
    server: {
        https:{
         key:fs.readFileSync('/etc/letsencrypt/live/kambojproperty.com/privkey.pem', 'utf8'),
         cert:fs.readFileSync('/etc/letsencrypt/live/kambojproperty.com/fullchain.pem', 'utf8')
        },
        proxy: {
            '/api': {
                target: 'https://api.razorpay.com',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '')
            }
        }
    },
    plugins: [react()]
})
