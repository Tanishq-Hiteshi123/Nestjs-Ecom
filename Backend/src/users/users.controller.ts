import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateNewUserDTO } from './dtos/createNewUser.dto';
import { UsersService } from './users.service';
import { SignInUserDTO } from './dtos/signInUser.dto';
import { Request } from 'express';
import { AuthenticationGuard } from './guard/authenticationGuard';
import { UpdateUserDTO } from './dtos/updateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploaderService } from 'src/file-uploader/file-uploader.service';
import { Roles } from 'src/common/decorators/roleDecorator';
import { UserRole } from 'src/common/entity/userRoleEnum';

@Controller('users')
export class UsersController {
  // Creating the controller for registering the user :-
  constructor(
    private userService: UsersService,
    private fileUploaderService: FileUploaderService,
  ) {}

  @Post('signup')
  createNewUser(@Body() createNewUserDTO: CreateNewUserDTO) {
    return this.userService.createNewUser(createNewUserDTO);
  }

  @Post('signin')
  loginUser(@Body() signInUserDTO: SignInUserDTO) {
    return this.userService.signInUser(signInUserDTO);
  }

  @UseGuards(AuthenticationGuard)
  @Get('getMe')
  getUserProfie(@Req() req: Request) {
    return this.userService.getMe(req);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('updateProfile')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: FileUploaderService.getDiskStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  updateMyProfile(
    @Body() updateUserDTO: UpdateUserDTO,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.userService.updateUserDetails(updateUserDTO, file, req);
  }

  @UseGuards(AuthenticationGuard)
  @Roles(UserRole.ADMIN)
  @Get('getAllUsers')
  getAllUser() {
    return this.userService.getAllCustomers();
  }

  // Endpoint for fetching the user by Id :-
  @UseGuards(AuthenticationGuard)
  @Roles(UserRole.ADMIN)
  @Get('/getUser/:id')
  getUserDetailsById(@Param('id') id: string) {
    return this.userService.getAllIndividualUser(id);
  }
}
