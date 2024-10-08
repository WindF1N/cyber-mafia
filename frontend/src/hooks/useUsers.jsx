import { create } from 'zustand';

const useUsers = create((set) => ({
  users: [],
  isLoading: true,
  limit: 5,
  offset: 0,
  total: 0,
  search: '',
  setUsers: (users) => set({ users }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setTotal: (total) => set({ total }),
  setOffset: (offset) => set({ offset }),
  setSearch: (search) => set({ search }),
}));

export default useUsers;