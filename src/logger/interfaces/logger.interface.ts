export interface LoggerOptionsInterface {
  includeUserAgent?: boolean;
  sensitiveFields?: string[];
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}
