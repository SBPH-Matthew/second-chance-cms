export interface RegisterRequestType {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
}

export interface LoginRequestType {
    email: string;
    password: string;
}
