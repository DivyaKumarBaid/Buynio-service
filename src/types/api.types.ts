export type APIResponse =
  | {
      error: true;
      developerMessage: string;
      displayMessage: string;
    }
  | {
      error: false;
      response: Record<any, any>;
    };
