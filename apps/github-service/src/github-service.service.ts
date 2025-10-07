import { Injectable } from '@nestjs/common';

@Injectable()
export class GithubServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
