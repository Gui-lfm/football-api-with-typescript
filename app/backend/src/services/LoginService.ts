import UserModel from '../models/UserModel';
import { IUserModel } from '../Interfaces/users/IUserModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import { Encrypter } from '../Interfaces/Encrypter';
import { TokenGenerator } from '../Interfaces/TokenGenerator';
import BCryptService from './BCryptService';
import TokenJWTService from './TokenJWTService';
import { IUser } from '../Interfaces/users/IUser';

export default class LoginService {
  constructor(
    private userModel: IUserModel = new UserModel(),
    private encrypter: Encrypter = new BCryptService(),
    private tokenGenerator: TokenGenerator = new TokenJWTService(),
  ) { }

  public async login(email: string, password: string): Promise<ServiceResponse<{ token: string }>> {
    const user = await this.userModel.findUser(email);
    if (!user) return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };

    const isValid = await this.encrypter.compare(password, user.password);
    if (!isValid) return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };

    const token = this.tokenGenerator.generate(user);
    return { status: 'SUCCESSFUL', data: { token } };
  }

  public async getUserRole(token: string): Promise<ServiceResponse<{ role: IUser['role'] }>> {
    const user = this.tokenGenerator.decode(token);
    const { role } = user;
    if (!user) {
      return { status: 'UNAUTHORIZED', data: { message: 'Token must be a valid token' } };
    }

    return { status: 'SUCCESSFUL', data: { role } };
  }
}
