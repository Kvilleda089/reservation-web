
import type { AuthState } from "../types/auth-context.type";

const ACCESS_TOKEN_KEY = "reservation_access_token";
const EMPLOYEE_KEY = "reservation_employee";

const emptyAuth: AuthState = {
  employee: null,
  accessToken: null,
  isInitialized: false,
};

let auth: AuthState = emptyAuth;

let listeners: (() => void)[] = [];

const loadAuth = (): AuthState => {
  if (typeof window === "undefined") {
    return emptyAuth;
  }

  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const storedEmployee = localStorage.getItem(EMPLOYEE_KEY);

  if (!accessToken || !storedEmployee) {
    return {
      ...emptyAuth,
      isInitialized: true,
    };
  }

  return {
    accessToken,
    employee: JSON.parse(storedEmployee),
    isInitialized: true,
  };
};

export const subscribe = (listener: () => void) => {
  listeners.push(listener);

  return () => {
    listeners = listeners.filter(
      (currentListener) => currentListener !== listener,
    );
  };
};

export const getSnapshot = (): AuthState => {
  return auth;
};

export const getServerSnapshot = (): AuthState => {
  return emptyAuth;
};

export const setAuth = (
  accessToken: string,
  employee: AuthState["employee"],
) => {
  if (!employee) {
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(employee));

  auth = {
    accessToken,
    employee,
    isInitialized: true,
  };

  listeners.forEach((listener) => listener());
};

export const clearAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(EMPLOYEE_KEY);

  auth = {
    ...emptyAuth,
    isInitialized: true,
  };

  listeners.forEach((listener) => listener());
};

auth = loadAuth();

