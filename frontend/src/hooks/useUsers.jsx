import { create } from 'zustand';

const useUsers = create((set) => ({
  users: [],
  isLoading: true,
  setUsers: (users) => set({ users }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useUsers;