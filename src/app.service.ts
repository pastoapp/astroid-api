import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  landingPage() {
    return `Welcome to Astroid API`;
  }

  async getKey(key: string): Promise<string> {
    console.log(key);
    if (key) {
      await this.cacheManager.set(key, 'bro');
    }
    const value = await this.cacheManager.get(key);
    return (value as string) ?? 'nope';
  }
}
