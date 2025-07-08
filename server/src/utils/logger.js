import fs from 'fs';
import path from 'path';

const LOG_DIR = 'logs';
const LOG_FILE = path.join(LOG_DIR, 'app.log');
const ERROR_FILE = path.join(LOG_DIR, 'error.log');

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaString = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}\n`;
};

const writeToFile = (file, content) => {
  try {
    fs.appendFileSync(file, content);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
};

export const logger = {
  info: (message, meta = {}) => {
    const formatted = formatMessage('info', message, meta);
    console.log(formatted.trim());
    writeToFile(LOG_FILE, formatted);
  },

  error: (message, meta = {}) => {
    const formatted = formatMessage('error', message, meta);
    console.error(formatted.trim());
    writeToFile(LOG_FILE, formatted);
    writeToFile(ERROR_FILE, formatted);
  },

  warn: (message, meta = {}) => {
    const formatted = formatMessage('warn', message, meta);
    console.warn(formatted.trim());
    writeToFile(LOG_FILE, formatted);
  },

  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const formatted = formatMessage('debug', message, meta);
      console.debug(formatted.trim());
      writeToFile(LOG_FILE, formatted);
    }
  }
};

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };

    if (res.statusCode >= 400) {
      logger.error(`${req.method} ${req.url} - ${res.statusCode}`, logData);
    } else {
      logger.info(`${req.method} ${req.url} - ${res.statusCode}`, logData);
    }
  });

  next();
};