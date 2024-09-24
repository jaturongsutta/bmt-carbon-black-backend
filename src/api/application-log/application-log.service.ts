import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Predefine } from 'src/entity/predefine.entity';
import { Repository } from 'typeorm';
@Injectable()
export class ApplicationLogService {
  private readonly logPath = 'logs';

  constructor(
    private readonly logger: Logger,
    @InjectRepository(Predefine)
    private predefineRepository: Repository<Predefine>,
  ) {}

  async search() {
    let logDir = path.join(__dirname, '..', '..', '..', this.logPath);
    if (process.env.ENV !== 'develop') {
      const data = await this.predefineRepository.findOne({
        where: { predefineGroup: 'ConfigPath', predefineCd: 'Log' },
      });

      logDir = data.valueEn;
    }

    const directoryPathCombined = path.join(logDir, 'combined');
    const directoryPathError = path.join(logDir, 'error');

    try {
      const filesCombined = await fs.promises.readdir(directoryPathCombined);
      const logFilesCombined = filesCombined
        .filter((file) => file.endsWith('.log'))
        .map((file) => ({
          filename: file,
        }));

      const filesError = await fs.promises.readdir(directoryPathError);
      const logFilesError = filesError
        .filter((file) => file.endsWith('.log'))
        .map((file) => ({
          filename: file,
        }));

      return {
        logCombined: logFilesCombined,
        logError: logFilesError,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to read directory');
    }
  }

  async getContentLog(filename: string, type: string) {
    let logDir = path.join(__dirname, '..', '..', '..', this.logPath);
    if (process.env.ENV !== 'develop') {
      const data = await this.predefineRepository.findOne({
        where: { predefineGroup: 'ConfigPath', predefineCd: 'Log' },
      });

      logDir = data.valueEn;
    }

    const directoryPathCombined = path.join(logDir, 'combined');
    const directoryPathError = path.join(logDir, 'error');

    const directoryPathSelected =
      type === 'combined' ? directoryPathCombined : directoryPathError;

    try {
      const content = await fs.promises.readFile(
        path.join(directoryPathSelected, filename),
        'utf8',
      );
      return content;
    } catch (error) {
      throw new Error(error.message || 'Failed to read file');
    }
  }
}
