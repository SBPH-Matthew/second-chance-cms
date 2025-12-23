export interface ServerValidationErrors {
  errors: {
    [key: string]: string; // e.g., "first_name": "min"
  };
}
