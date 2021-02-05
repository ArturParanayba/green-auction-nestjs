import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Auction API | Green-Auction | Raul Duarte',
      context: 'Job Challange | Nivell',
    };
  }
}
