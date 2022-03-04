import {Injectable} from '@nestjs/common';
import {AddressRepository} from "./address.repository";

@Injectable()
/**
 * User Service
 */
export class AddressService {
  /**
   *
   * @param addressRepository
   */
  constructor(
    private addressRepository: AddressRepository,
  ) {}

  /**
   * Get All Addresses With Users
   */
  async getAllAddressesWithUsers() {
    return await this.addressRepository.find({ relations: ['user'] });
  }
}
