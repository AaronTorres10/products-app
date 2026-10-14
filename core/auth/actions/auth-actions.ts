import axios from "axios";
import { productsApi } from "../api/productsApi";
import { User } from "../interface/user";
export interface AuthResponse extends User {
  token: string;
}
export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
}
export type AuthField = keyof RegisterInput;
export type AuthResult =
  | {
      ok: true;
      user: User;
      token: string;
    }
  | {
      ok: false;
      message: string;
      field?: AuthField;
    };
const returnUserToken = ({ token, ...user }: AuthResponse) => ({ user, token });
// Never expose raw database errors or submitted credentials in the UI.
export const authError = (
  error: unknown,
  operation: "login" | "register",
): Extract<
  AuthResult,
  {
    ok: false;
  }
> => {
  const fallback = {
    ok: false as const,
    message: "No pudimos completar la solicitud. Intenta nuevamente.",
  };
  if (!axios.isAxiosError(error)) return fallback;
  if (!error.response)
    return {
      ok: false,
      message:
        "No pudimos conectar con el servidor. Revisa tu conexión e intenta nuevamente.",
    };
  const { status, data } = error.response;
  if (status >= 500)
    return {
      ok: false,
      message: "El servidor no está disponible. Intenta más tarde.",
    };
  if (operation === "login" && (status === 400 || status === 401))
    return { ok: false, message: "Correo o contraseña incorrectos." };
  const raw = data?.message;
  const messages: string[] =
    typeof raw === "string"
      ? [raw]
      : Array.isArray(raw)
        ? raw.filter((m): m is string => typeof m === "string")
        : [];
  const detail = messages.join(" ").toLowerCase();
  if (
    operation === "register" &&
    /email|correo/.test(detail) &&
    /already|duplicate|exists|exist|unique|registrad/.test(detail)
  )
    return {
      ok: false,
      field: "email",
      message:
        "Este correo ya está registrado. Inicia sesión o utiliza otro correo.",
    };
  if (status === 409)
    return {
      ok: false,
      message:
        "Ya existe una cuenta con estos datos. Revisa el correo o inicia sesión.",
    };
  if (status === 400 || status === 422) {
    if (/password|contraseña/.test(detail))
      return {
        ok: false,
        field: "password",
        message:
          "La contraseña debe tener de 6 a 50 caracteres e incluir mayúscula, minúscula y número.",
      };
    if (/email|correo/.test(detail))
      return {
        ok: false,
        field: "email",
        message: "El servidor rechazó el correo. Revisa que sea válido.",
      };
    if (/fullname|nombre/.test(detail))
      return {
        ok: false,
        field: "fullName",
        message:
          "El servidor rechazó el nombre completo. Revisa el dato ingresado.",
      };
    return {
      ok: false,
      message:
        "El servidor rechazó los datos. Revisa los campos e intenta nuevamente.",
    };
  }
  return fallback;
};
export const authLogin = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  try {
    const { data } = await productsApi.post<AuthResponse>("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });
    return { ok: true, ...returnUserToken(data) };
  } catch (error) {
    return authError(error, "login");
  }
};
export const authRegister = async (
  input: RegisterInput,
): Promise<AuthResult> => {
  try {
    const { data } = await productsApi.post<AuthResponse>("/auth/register", {
      ...input,
      email: input.email.trim().toLowerCase(),
      fullName: input.fullName.trim(),
    });
    return { ok: true, ...returnUserToken(data) };
  } catch (error) {
    return authError(error, "register");
  }
};
export const authCheckStatus = async () => {
  try {
    const { data } = await productsApi.get<AuthResponse>("/auth/check-status");
    return returnUserToken(data);
  } catch {
    return null;
  }
};
