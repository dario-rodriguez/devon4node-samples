import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { EmployeesModule } from './employees/employees.module';

@Module({
  imports: [CoreModule, EmployeesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
