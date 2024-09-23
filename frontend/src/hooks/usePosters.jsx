import { create } from 'zustand';

const usePosters = create((set) => ({
  posters: [],
  isLoading: true,
  limit: 5,
  offset: 0,
  total: 0,
  city: null,
  setPosters: (posters) => set({ posters }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setTotal: (total) => set({ total }),
  setOffset: (offset) => set({ offset }),
  setCity: (city) => set({ city }),
}));

export default usePosters;