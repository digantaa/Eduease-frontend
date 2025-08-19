import { create } from "zustand";

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  role: null,
  setRole: (role) => set({ role }),

  notifications: 0,
  setNotifications: (notifications) => set({ notifications }),

  signalConnection: null,
  setSignalConnection: (connection) => set({ signalConnection: connection }), // ✅ Fix: Setter function
}));

export default useStore;
