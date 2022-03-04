import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {UserEntity} from "../user.entity";

@Entity('addresses')
class AddressEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public street: string;

  @Column()
  public city: string;

  @Column()
  public country: string;

  //User
  @OneToOne(() => UserEntity, (user: UserEntity) => user.address)
  @JoinColumn()
  public user: UserEntity;
}

export default AddressEntity;
