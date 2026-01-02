export interface ResponseType {
  message: string;
}

export interface ValidationResponse extends ResponseType {
  errors: {
    [key: string]: string;
  };
}
