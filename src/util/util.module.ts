import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UtilService } from "./util.service";

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [UtilService],
  exports: [UtilService],
})
export class UtilModule {}
