#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const environments = {
  dev: 'development',
  staging: 'staging', 
  prod: 'production'
}

const targetEnv = process.argv[2]

if (!targetEnv || !environments[targetEnv]) {
  console.log('❌ Ambiente inválido!')
  console.log('📋 Ambientes disponíveis:')
  console.log('   npm run env:dev     - Development')
  console.log('   npm run env:staging - Staging') 
  console.log('   npm run env:prod    - Production')
  process.exit(1)
}

const envFile = path.join(__dirname, '..', '.env')
const envContent = `# Configuração de ambiente
NODE_ENV=${environments[targetEnv]}
VITE_API_URL=${targetEnv === 'dev' ? 'http://localhost:3000/api' : ''}
`

try {
  fs.writeFileSync(envFile, envContent)
  console.log(`✅ Ambiente alterado para: ${environments[targetEnv].toUpperCase()}`)
  console.log(`🌐 URL da API: ${targetEnv === 'dev' ? 'http://localhost:3000/api' : 'Automática'}`)
  console.log('🔄 Reinicie o servidor para aplicar as mudanças')
} catch (error) {
  console.error('❌ Erro ao alterar ambiente:', error.message)
  process.exit(1)
}
