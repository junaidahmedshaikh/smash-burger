import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IUser } from '@smashd/types';
import ApiClient from '@/lib/api';

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: IUser, token: string) => void;
  updateUser: (user: IUser) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, accessToken) => {
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      updateUser: (user) => {
        set({ user });
      },

      logout: async () => {
        const token = get().accessToken;
        if (token) {
          try {
            await ApiClient.logout(token);
          } catch (e) {
            // Ignore error on logout
          }
        }
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        const token = get().accessToken;
        if (!token) {
          set({ user: null, isAuthenticated: false });
          return;
        }
        try {
          const user = await ApiClient.getProfile(token);
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'smashd-auth-storage',
    }
  )
);
