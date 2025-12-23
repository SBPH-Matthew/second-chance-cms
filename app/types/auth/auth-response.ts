export interface RegisterResponseType {
    message: string;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    };
}
