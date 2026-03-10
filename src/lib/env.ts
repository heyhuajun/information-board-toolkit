import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  DATABASE_URL: z.string().startsWith('postgresql://'),
  API_KEY: z.string().min(32).optional(),
  REQUIRE_AUTH: z.enum(['true', 'false']).optional(),
})

export type Env = z.infer<typeof envSchema>

let validatedEnv: Env | null = null

export function validateEnv(): Env {
  if (validatedEnv) return validatedEnv

  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    console.error('❌ Invalid environment variables:')
    result.error.issues.forEach((issue) => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
    })
    
    console.error('\n📋 Required environment variables:')
    console.error('  DATABASE_URL=postgresql://user:pass@host:port/database')
    console.error('  NEXT_PUBLIC_BASE_URL=http://localhost:3000')
    console.error('\n📋 Optional:')
    console.error('  API_KEY=your-secure-key (min 32 chars)')
    console.error('  REQUIRE_AUTH=true|false')
    
    process.exit(1)
  }

  validatedEnv = result.data
  return validatedEnv
}

export function checkRequiredEnv(): void {
  validateEnv()
}

export function getEnv(): Env {
  return validateEnv()
}

export function isProduction(): boolean {
  return validateEnv().NODE_ENV === 'production'
}

export function isDevelopment(): boolean {
  return validateEnv().NODE_ENV === 'development'
}
