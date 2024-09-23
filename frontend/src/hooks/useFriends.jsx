import { create } from 'zustand';

const useFriends = create((set) => ({
  users: [],
  isLoading: true,
  limit: 5,
  offset: 0,
  total: 0,
  setUsers: (users) => set({ users }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setTotal: (total) => set({ total }),
  setOffset: (offset) => set({ offset }),
}));

export default useFriends;