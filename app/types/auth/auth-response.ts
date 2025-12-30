export interface RegisterResponseType {
  message: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface RegisterErrorType {
  message: string;
  errors: {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
  };
}

export interface LoginResponseType {
  token: string;
}

export interface LoginErrorType {
  message?: string;
  errors: {
    email?: string;
    password?: string;
  };
}
