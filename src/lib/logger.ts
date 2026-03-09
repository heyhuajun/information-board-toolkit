type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  error?: {
    name: string
    message: string
    stack?: string
  }
}

class Logger {
  private isProduction: boolean

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production'
  }

  private formatEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    }

    if (context) {
      entry.context = context
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        ...(this.isProduction ? {} : { stack: error.stack }),
      }
    }

    return entry
  }

  private output(entry: LogEntry): void {
    const output = this.isProduction
      ? JSON.stringify(entry)
      : `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${
          entry.context ? ` ${JSON.stringify(entry.context)}` : ''
        }${entry.error ? `\n${entry.error.stack || entry.error.message}` : ''}`

    switch (entry.level) {
      case 'error':
        console.error(output)
        break
      case 'warn':
        console.warn(output)
        break
      case 'debug':
        if (!this.isProduction) {
          console.log(output)
        }
        break
      default:
        console.log(output)
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    const entry = this.formatEntry('debug', message, context)
    this.output(entry)
  }

  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.formatEntry('info', message, context)
    this.output(entry)
  }

  warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.formatEntry('warn', message, context)
    this.output(entry)
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    const entry = this.formatEntry('error', message, context, error)
    this.output(entry)
  }

  api(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context?: Record<string, unknown>
  ): void {
    this.info(`API ${method} ${path}`, {
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
      ...context,
    })
  }
}

export const logger = new Logger()
