import { Page, PageRequest } from '@devon4node/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { EntityNotFound } from '../../shared/exceptions/entity-not-found.exception';
import { CreateEmployeeDto } from '../model/dtos/create-employee.dto';
import { UpdateEmployeeDto } from '../model/dtos/update-employee.dto';
import { Employee } from '../model/entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(@InjectRepository(Employee) private readonly repository: Repository<Employee>) {}

  create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = plainToClass(Employee, createEmployeeDto);
    return this.repository.save(employee);
  }

  async findAll(page?: PageRequest): Promise<Employee[] | Page<Employee>> {
    if (!page) {
      return this.repository.find();
    }

    const [content, total] = await this.repository.findAndCount({
      take: page.pageSize,
      skip: page.pageNumber * page.pageSize,
    });
    return new Page(content, { pageNumber: page.pageNumber, pageSize: page.pageSize, total });
  }

  async findOne(id: number): Promise<Employee> {
    const found = await this.repository.findOne(id);

    if (!found) {
      throw new EntityNotFound(Employee, id);
    }

    return found;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const found = await this.repository.findOne(id);
    const employee = plainToClass(Employee, { ...found, ...updateEmployeeDto, id });

    if (!found) {
      throw new EntityNotFound(Employee, id);
    }

    return this.repository.save(employee);
  }

  async remove(id: number): Promise<Employee> {
    const found = await this.repository.findOne(id);

    if (!found) {
      throw new EntityNotFound(Employee, id);
    }

    return this.repository.remove(found);
  }
}
