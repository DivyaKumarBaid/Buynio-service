export interface Unverified_User_Type {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  username: string;
  password: string;
  otp?: string;
}

export interface User_Type {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  username: string;
  password: string;
  hashRT?: string;
}

export interface Jwt_Payload {
  sub: string;
  email: string;
}

export interface Instagram_Jwt_Payload {
  access_token: string;
  username: string;
  user_id: string;
  name: string;
}
