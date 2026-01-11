
export interface LoginFormData {
  username: string;
  password: string;
}

export enum LoginMode {
  PASSWORD = 'PASSWORD',
  SMART_CARD = 'SMART_CARD'
}
