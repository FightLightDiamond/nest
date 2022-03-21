import { EntityRepository, Repository } from 'typeorm';
import PublicFileEntity from "./publicFile.entity";

@EntityRepository(PublicFileEntity)
export class PublicFileRepository extends Repository<PublicFileEntity>  {}
