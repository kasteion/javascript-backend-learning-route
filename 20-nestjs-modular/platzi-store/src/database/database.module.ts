import { Module, Global } from '@nestjs/common';

const API_KEY = '123456789';
const API_KEY_PROD = 'PROD123456789SA';

@Global()
@Module({
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'production' ? API_KEY_PROD : API_KEY,
    },
  ],
  exports: ['API_KEY'],
})
export class DatabaseModule {}
