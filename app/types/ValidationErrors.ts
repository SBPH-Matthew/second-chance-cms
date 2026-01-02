export interface ServerValidationErrors {
  errors: {
    [key: string]: string; // e.g., "first_name": "min"
  };
}

export interface GinGonicErrors {
  message: string;
  errors?: {
    [key: string]: string;
  };
}
