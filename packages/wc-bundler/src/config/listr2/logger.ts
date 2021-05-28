import { Logger } from 'listr2';
import { EOL } from 'os';
import { LogFileStream } from '../../utils';

export class CustomLogger extends Logger {
  fail(message: string): void {
    super.fail(message);
    LogFileStream?.write(`[FAIL] ${message}${EOL}`, 'utf8');
  }
  skip(message: string): void {
    super.skip(message);
    LogFileStream?.write(`[SKIP] ${message}${EOL}`, 'utf8');
  }
  success(message: string): void {
    super.success(message);
    LogFileStream?.write(`[SUCCESS] ${message}${EOL}`, 'utf8');
  }
  data(message: string): void {
    super.data(message);
    LogFileStream?.write(`[DATA] ${message}${EOL}`, 'utf8');
  }
  start(message: string): void {
    super.start(message);
    LogFileStream?.write(`[START] ${message}${EOL}`, 'utf8');
  }
  title(message: string): void {
    super.title(message);
    LogFileStream?.write(`[TITLE] ${message}${EOL}`, 'utf8');
  }
  retry(message: string): void {
    super.retry(message);
    LogFileStream?.write(`[RETRY] ${message}${EOL}`, 'utf8');
  }
  rollback(message: string): void {
    super.rollback(message);
    LogFileStream?.write(`[ROLLBACK] ${message}${EOL}`, 'utf8');
  }
}
