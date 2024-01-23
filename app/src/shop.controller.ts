import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException, Query, ParseIntPipe, DefaultValuePipe, BadRequestException, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import {PersistenceService, MovieRepo, ShopRepo,} from './repository';
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('shop')
export class ShopController {
  private readonly shopRepo: ShopRepo;

  constructor(readonly persistence: PersistenceService) {
    this.shopRepo = persistence.getShopRepo();
  }

  @Post('attachment/:documentId')
  @UseInterceptors(FileInterceptor('file'))
  async addAttachment(@Param('documentId') documentId: string, @Body() body: any, @UploadedFile('file') file: Express.Multer.File) {
    const data = JSON.parse(body['data']);

    if (!file) {
      throw new BadRequestException('No file supplied!');
    }

    const buffer = file.buffer;
    const attachmentName = data['name'];

    try {
      await this.shopRepo.addAttachment(documentId, attachmentName, buffer);
    } catch (ex) {
      throw new BadRequestException(ex);
    }

    return {
      name: attachmentName,
    }
  }
}
