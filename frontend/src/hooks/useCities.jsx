import { create } from 'zustand';

const useCities = create((set) => ({
  cities: [],
  setCities: (cities) => set({ cities }),
}));

export default useCities;