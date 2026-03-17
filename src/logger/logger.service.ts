import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  log(message: string, context?: string): void {
    console.log(`[${new Date().toISOString()}] [${context || 'LOG'}] ${message}`);
  }

  error(message: string, trace?: string, context?: string): void {
    console.error(`[${new Date().toISOString()}] [${context || 'ERROR'}] ${message}`);
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: string, context?: string): void {
    console.warn(`[${new Date().toISOString()}] [${context || 'WARN'}] ${message}`);
  }

  debug(message: string, context?: string): void {
    console.debug(`[${new Date().toISOString()}] [${context || 'DEBUG'}] ${message}`);
  }

  verbose(message: string, context?: string): void {
    console.log(`[${new Date().toISOString()}] [${context || 'VERBOSE'}] ${message}`);
  }
}
