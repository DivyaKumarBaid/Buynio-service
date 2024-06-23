import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { UtilModule } from "./util/util.module";
import { MailModule } from "./mail/mail.module";
import { HopsModule } from "./hops/hops.module";
import { UserService } from "./user/user.service";
import { UserController } from "./user/user.controller";
import { UserModule } from "./user/user.module";
import { SimulatorGateway } from "./gateway/simulator.gateway";

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UtilModule,
    MailModule,
    HopsModule,
    UserModule,
  ],
  controllers: [UserController],
  providers: [UserService, SimulatorGateway],
})
export class AppModule {}
