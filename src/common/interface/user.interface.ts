import { UserRole, UserStatus } from "@enum";
import { UserEntity } from "@entity";

export interface IRequestParams {
  id?: string;
  email?: string;
  role?: UserRole | string;
  user?: IUserRequest;
  userId?: string;
}

export interface ISocialLoginResponse {
  existingUser?: UserEntity;
  signUpDto: ISignUpDto;
}

export interface ISignUpDto {
  role: UserRole;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IUser {
  id?: string;
  role: UserRole | string;
  email: string;
  status?: UserStatus;
  password: string;
  lastActivity?: Date;
  completeOnboarding?: boolean | undefined;
  resetPasswordToken?: string;
  resetPasswordTokenExpirationDate?: Date;
}

export interface IProfileDto extends IUser {
  firstName: string;
  lastName: string;
}

export interface IProfileCreateDto {
  firstName: string;
  lastName: string;
}

export interface ISignIn {
  email: string;
  password: string;
}

export interface IUserRequest {
  id: string;
  role: UserRole | string;
  status: string;
  email: string;
  created: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFullProfile {
  user: IUser;
}

export interface ICreatedUser {
  user: UserEntity;
}

export interface IUserSecure {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IUserFilter {
  industry?: string[];
  experience?: string;
  progressFrom?: number;
  progressTo?: number;
  searchBy?: string;
  orderBy?: "ASC" | "DESC" | string;
}

export interface IUserPatch
  extends Partial<
    Pick<
      IUser,
      | "resetPasswordToken"
      | "resetPasswordTokenExpirationDate"
      | "password"
      | "status"
    >
  > {
  completeOnboarding?: boolean;
  completeTips?: boolean;
  lastActivity?: Date | string | null;
}
