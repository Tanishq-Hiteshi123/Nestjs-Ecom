import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewUserDTO } from './dtos/createNewUser.dto';
import * as bcrypt from 'bcryptjs';
import { UserRole } from 'src/common/entity/userRoleEnum';
import { SignInUserDTO } from './dtos/signInUser.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UpdateUserDTO } from './dtos/updateUser.dto';
@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  // API For creating new User :-
  async createNewUser(createNewUser: CreateNewUserDTO) {
    try {
      const { name, email, password, role } = createNewUser;

      if (!name || !email || !password || !role) {
        throw new BadRequestException('Please Provide all required details');
      }

      //   Check if the user already exist :-
      const isUserExist = await this.prismaService.user.findUnique({
        where: {
          email: email,
        },
      });

      if (isUserExist) {
        throw new BadRequestException(
          'User Already exist with this email address',
        );
      }
      // hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user

      const newUser = await this.prismaService.user.create({
        data: {
          name,
          email,
          role: UserRole[role],
          password: hashedPassword,
        },
      });

      if (!newUser) {
        throw new InternalServerErrorException(
          'Something Went Wrong while registering new User',
        );
      }

      // create the cart of the user :-

      const isAlreadyAssigned = await this.prismaService.cart.findUnique({
        where: {
          userId: newUser.id,
        },
      });

      if (isAlreadyAssigned) {
        throw new BadRequestException('Cart is already assigned to this user');
      }

      //   Othwerwise assigned :-
      const assignedCart = await this.prismaService.cart.create({
        data: {
          userId: newUser.id,
        },
      });

      if (!assignedCart) {
        throw new InternalServerErrorException(
          'Something Went Wrong while Assigning the cart to new User',
        );
      }

      return {
        message: 'User Created SuccessFully!!!',
        newUser,
      };
    } catch (error) {
      new InternalServerErrorException();
      throw error;
    }
  }

  //   API for signining the user :-

  async signInUser(signInDetails: SignInUserDTO) {
    try {
      const { email, password } = signInDetails;

      if (!email || !password) {
        throw new BadRequestException(
          'Email & Password both are required fields',
        );
      }

      const isuserExist = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      if (!isuserExist) {
        throw new BadRequestException('User does not exist with this email');
      }

      const isMatched = await bcrypt.compare(password, isuserExist.password);

      if (!isMatched) {
        throw new UnauthorizedException('Invalid Credentails');
      }

      //   Generate the Jwt Token :-
      const token = this.jwtService.sign({
        userId: isuserExist.id,
        userRole: isuserExist.role,
        userEmail: isuserExist.email,
      });

      return {
        message: 'User Logged In Successfully',
        isuserExist,
        token,
      };
    } catch (error) {
      new InternalServerErrorException();
      throw error;
    }
  }

  //   Get Me Profile API :-
  async getMe(req: Request) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new UnauthorizedException();
      }

      const userDetails = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });

      const { password, ...userInfo } = userDetails;

      return {
        message: 'User Details',
        userInfo,
      };
    } catch (error) {
      new InternalServerErrorException();
      throw error;
    }
  }

  //   Upload the user Details :-
  async updateUserDetails(
    updateUserDetails: UpdateUserDTO,
    file: Express.Multer.File,
    req: Request,
  ) {
    try {
      const { name, email } = updateUserDetails;

      const userId = req?.user?.userId;

      if (!userId) {
        throw new UnauthorizedException();
      }

      const userDetails = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!userDetails) {
        throw new NotFoundException('User Not Found');
      }

      const updatedDetails = await this.prismaService.user.update({
        data: {
          name: name || userDetails.name,
          email: email || userDetails.email,
          profileImage: file?.path || userDetails.profileImage,
        },
        where: {
          id: userId,
        },
      });

      if (!updatedDetails) {
        throw new InternalServerErrorException(
          'User Details could not get updated',
        );
      }

      return {
        message: `${updatedDetails.name} , Your Profile Updated SuccessFully`,
        updatedDetails,
      };
    } catch (error) {
      new InternalServerErrorException();
      throw error;
    }
  }

  //   Get All Users (Customers :-
  async getAllCustomers() {
    try {
      const allCustomers = await this.prismaService.user.findMany({
        where: {
          role: 'CUSTOMER',
        },
      });

      if (!allCustomers) {
        throw new InternalServerErrorException();
      }

      return {
        message: 'List of all Customers',
        allCustomers,
      };
    } catch (error) {
      new InternalServerErrorException();
      throw error;
    }
  }

  // Get an individual user By Id :-
  async getAllIndividualUser(userId: string) {
    try {
      if (!userId) {
        throw new BadRequestException('User Id is not provided');
      }

      const userDetails = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!userDetails) {
        throw new NotFoundException('User with provided Id not found');
      }

      return {
        message: 'User Details',
        userDetails,
      };
    } catch (error) {
      throw error;
    }
  }
}
