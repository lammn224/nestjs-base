import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export const transports = [
  new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss,ms' }),
      winston.format.align(),
      winston.format.printf((info) => {
        const { timestamp, level, message, ...other } = info;
        return `${timestamp} ${level}: ${
          message && 'message'
        } - ${JSON.stringify(other)}`;
      }),
    ),
  }),
  new DailyRotateFile({
    level: 'warn',
    maxSize: '5mb',
    filename: 'backend-%DATE%.log',
    zippedArchive: true,
    maxFiles: '31d',
    dirname: 'logs',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss,ms' }),
      winston.format.align(),
      winston.format.printf((info) => {
        const { timestamp, level, message, ...other } = info;
        return `${timestamp} ${level}: ${
          message && 'message'
        } - ${JSON.stringify(other)}`;
      }),
    ),
  }),
];
