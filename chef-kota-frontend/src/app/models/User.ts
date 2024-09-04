export interface UserModel {
  username: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  password: string;
}

export class User implements UserModel {
  username: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  password: string;
  
}