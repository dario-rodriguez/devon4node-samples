import { GetPage, Page, PageRequest } from '@devon4node/common';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Roles } from '../../core/auth/decorators/roles.decorator';
import { RolesGuard } from '../../core/auth/guards/roles.guard';
import { roles } from '../../core/auth/model/roles.enum';
import { CreateEmployeeDto } from '../model/dtos/create-employee.dto';
import { UpdateEmployeeDto } from '../model/dtos/update-employee.dto';
import { Employee } from '../model/entities/employee.entity';
import { EmployeesService } from '../services/employees.service';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly service: EmployeesService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    return this.service.create(createEmployeeDto);
  }

  @Get()
  @ApiQuery({ name: 'pageNumber', type: String, required: false })
  @ApiQuery({ name: 'pageSize', type: String, required: false })
  @ApiOkResponse({
    schema: {
      oneOf: [
        { type: 'array', items: { $ref: getSchemaPath(Employee) } },
        {
          type: 'object',
          properties: {
            content: { type: 'array', items: { $ref: getSchemaPath(Employee) } },
            page: {
              type: 'object',
              properties: { pageNumber: { type: 'number' }, total: { type: 'number' }, pageSize: { type: 'number' } },
            },
          },
        },
      ],
    },
  })
  findAll(@GetPage() page?: PageRequest): Promise<Employee[] | Page<Employee>> {
    return this.service.findAll(page);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Employee> {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    return this.service.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(roles.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string): Promise<Employee> {
    return this.service.remove(+id);
  }
}
