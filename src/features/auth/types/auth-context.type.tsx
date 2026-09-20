import { EmployeeResponse } from "./auth.types";



export interface AuthState  {
    employee: EmployeeResponse | null;
    accessToken: string | null;
    isInitialized: boolean;

}

export interface AuthContextType extends AuthState  {
  setAuth: (
    accessToken: string,
    employee: EmployeeResponse,
  ) => void;
}