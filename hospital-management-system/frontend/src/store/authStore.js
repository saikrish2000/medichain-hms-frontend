import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user:         null,
      token:        null,
      isAuth:       false,
      isLoading:    false,

      login: (user, token) => {
        localStorage.setItem('jwt_token', token);
        set({ user, token, isAuth: true });
      },

      logout: () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuth: false });
      },

      setUser:    (user)    => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),

      // Role helpers
      isAdmin:       () => get().user?.role === 'ADMIN',
      isDoctor:      () => get().user?.role === 'DOCTOR',
      isNurse:       () => ['NURSE', 'INDEPENDENT_NURSE'].includes(get().user?.role),
      isPatient:     () => get().user?.role === 'PATIENT',
      isPharmacist:  () => get().user?.role === 'PHARMACIST',
      isLabTech:     () => ['LAB_TECHNICIAN', 'PHLEBOTOMIST'].includes(get().user?.role),
      isBillingUser: () => ['ADMIN', 'RECEPTIONIST'].includes(get().user?.role),
    }),
    {
      name:    'hms-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token, isAuth: state.isAuth }),
    }
  )
);

export default useAuthStore;
