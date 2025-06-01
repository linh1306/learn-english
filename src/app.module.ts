import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
// import { AuthModule } from './module/auth/auth.module';
import { JwtAuthModule } from './jwt/jwt.module';
import { APP_GUARD } from '@nestjs/core';
import { UserInjectGuard } from './common/guards/userInject.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { FacebookModule } from './module/facebook/facebook.module';

@Module({
  imports: [

    // Database
    PrismaModule,
    // JWT
    JwtAuthModule,

    FacebookModule

    // AuthModule,
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: UserInjectGuard,
  //   },
  //   {
  //     provide: APP_GUARD,
  //     useClass: RolesGuard, // Chạy sau
  //   },
  // ],
})
export class AppModule {}
