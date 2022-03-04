import {
  Controller, Get,
} from '@nestjs/common';
import {AddressService} from "./address.service";

@Controller('address')
/**
 * User Controller
 */
export class AddressController {
  constructor(private addressService: AddressService) {}

  /**
   * Get addresses
   */
  @Get()
  async index() {
    return await this.addressService.getAllAddressesWithUsers()
  }
}
