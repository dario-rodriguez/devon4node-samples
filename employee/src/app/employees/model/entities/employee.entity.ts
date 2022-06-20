import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../shared/model/entities/base-entity.entity';

@Entity()
export class Employee extends BaseEntity {
  @Column({ length: 255, nullable: false })
  name!: string;

  @Column({ length: 255, nullable: false })
  surname!: string;

  @Column({ length: 255, nullable: false })
  email!: string;

  @Column({ length: 255, nullable: true })
  address?: string;
}
