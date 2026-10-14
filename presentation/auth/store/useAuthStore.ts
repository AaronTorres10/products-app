import { create } from "zustand";
import {
  authCheckStatus,
  authLogin,
  authRegister,
  AuthResult,
  RegisterInput,
} from "../../../core/auth/actions/auth-actions";
import { User } from "../../../core/auth/interface/user";
import { SecureStorageAdapter } from "../../../helpers/adapters/secure-storage.adapter";
export type AuthStatus = "authenticated" | "unauthenticated" | "checking";

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  login: (email: string, password: string) => Promise<AuthResult>;
  register: (input: RegisterInput) => Promise<AuthResult>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;

  changeStatus: (token?: string, user?: User) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: "checking",
  token: undefined,
  user: undefined,

  changeStatus: async (token?: string, user?: User) => {
    if (!token || !user) {
      set({ status: "unauthenticated", token: undefined, user: undefined });
      await SecureStorageAdapter.deleteItem("token");
      return false;
    }

    set({
      status: "authenticated",
      token: token,
      user: user,
    });

    await SecureStorageAdapter.setItem("token", token);

    return true;
  },

  login: async (email: string, password: string) => {
    const resp = await authLogin(email, password);
    if (resp.ok) await get().changeStatus(resp.token, resp.user);
    return resp;
  },

  register: async (input) => {
    const resp = await authRegister(input);
    if (resp.ok) await get().changeStatus(resp.token, resp.user);
    return resp;
  },

  checkStatus: async () => {
    const resp = await authCheckStatus();
    await get().changeStatus(resp?.token, resp?.user);
  },

  logout: async () => {
    SecureStorageAdapter.deleteItem("token");
    set({ status: "unauthenticated", token: undefined, user: undefined });
  },
}));
