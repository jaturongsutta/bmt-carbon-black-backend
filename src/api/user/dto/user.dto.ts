export class UserDto {
  userId: number;

  username: string;

  password: string;

  firstName: string;

  lastName: string;

  positionName: string;

  roleID: number;

  isActive: string;

  createdBy: number;

  createdDate: Date;

  updatedBy: number;

  updatedDate: Date;

  status: string;

  rowNumber: number;

  listRow: {
    Role_ID: string;
  }[];
}
