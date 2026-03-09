import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
  DATABASE_URL: z.string().optional(),
  API_KEY: z.string().min(16).optional(),
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
    
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
    
    console.warn('⚠️  Using default values for development')
    validatedEnv = {
      NODE_ENV: 'development',
    }
    return validatedEnv
  }

  validatedEnv = result.data
  return validatedEnv
}

export function checkRequiredEnv(): void {
  const env = validateEnv()

  if (env.NODE_ENV === 'production') {
    const missing: string[] = []

    if (!env.NEXT_PUBLIC_BASE_URL) {
      missing.push('NEXT_PUBLIC_BASE_URL')
    }

    if (!env.DATABASE_URL) {
      missing.push('DATABASE_URL')
    }

    if (!env.API_KEY && env.REQUIRE_AUTH !== 'false') {
      console.warn('⚠️  WARNING: Running in production without API_KEY. Authentication will be enforced.')
    }

    if (missing.length > 0) {
      console.error('❌ Missing required environment variables in production:')
      missing.forEach((varName) => {
        console.error(`  - ${varName}`)
      })
      process.exit(1)
    }
  }
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
