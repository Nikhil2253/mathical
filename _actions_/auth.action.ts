import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export interface User {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export class AuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail) && data.detail[0]?.msg) return data.detail[0].msg;
    return "Something went wrong. Please try again.";
  } catch {
    return "Something went wrong. Please try again.";
  }
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new AuthError(await parseErrorMessage(response), response.status);
  }

  const data: AuthResponse = await response.json();
  storeAuthToken(data.access_token);
  storeCurrentUser(data.user);
  return data;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new AuthError(await parseErrorMessage(response), response.status);
  }

  const data: AuthResponse = await response.json();
  storeAuthToken(data.access_token);
  storeCurrentUser(data.user);
  return data;
}

const TOKEN_KEY = "mathical_access_token";
const USER_KEY = "mathical_current_user";

// Cookie options: adjust `expires`, `secure`, `sameSite` to fit your deployment.
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7, // days
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export function storeAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS);
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return Cookies.get(TOKEN_KEY) ?? null;
}

export function storeCurrentUser(user: User): void {
  if (typeof window === "undefined") return;
  Cookies.set(USER_KEY, JSON.stringify(user), COOKIE_OPTIONS);
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = Cookies.get(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

export function logout(): void {
  if (typeof window === "undefined") return;
  Cookies.remove(TOKEN_KEY, { path: "/" });
  Cookies.remove(USER_KEY, { path: "/" });
}

export async function authorizedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(`${API_BASE_URL}${path}`, { ...init, headers });
}