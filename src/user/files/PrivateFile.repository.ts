import { EntityRepository, Repository } from 'typeorm';
import PrivateFileEntity from "./privateFile.entity";

@EntityRepository(PrivateFileEntity)
export class PrivateFileRepository extends Repository<PrivateFileEntity>  {}
