import { create } from 'zustand';

const useAccount = create((set) => ({
  account: null,
  setAccount: (account) => set({ account }),
}));

export default useAccount;