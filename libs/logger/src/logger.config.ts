import winston, { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logLevels: winston.config.AbstractConfigSetLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const isProduction = process.env.NODE_ENV === 'production';

const baseFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
);

const consoleFormat = format.combine(
  baseFormat,
  format.colorize({ all: true }),
  format.printf((info: winston.Logform.TransformableInfo) => {
    const metadata = info.metadata as Record<string, unknown> | undefined;
    const rawContext =
      (metadata?.context as string | undefined) ??
      (info as unknown as { context?: string }).context;
    const context = rawContext ? String(rawContext) : '';
    const contextPart = context ? ` [${context}]` : '';
    const msg = (info as unknown as { stack?: unknown }).stack ?? info.message;
    return `${String(info.timestamp)}${contextPart} ${String(info.level)}: ${String(msg)}`;
  }),
);

const fileFormat = format.combine(
  baseFormat,
  format.errors({ stack: true }),
  format.json(),
);

export type WinstonConfigFactory = () => winston.LoggerOptions;

export const createWinstonConfig: WinstonConfigFactory = () => {
  const consoleTransport = new transports.Console({
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
    format: consoleFormat,
    handleExceptions: true,
  });

  const rotateFileTransport = new DailyRotateFile({
    level: process.env.FILE_LOG_LEVEL || 'info',
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '14d',
    format: fileFormat,
    handleExceptions: true,
  });

  const loggerOptions: winston.LoggerOptions = {
    levels: logLevels,
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
    transports: [consoleTransport, rotateFileTransport],
    exitOnError: false,
    defaultMeta: {
      service: process.env.SERVICE_NAME || 'github-search-app',
    },
  };

  return loggerOptions;
};

export default createWinstonConfig;
