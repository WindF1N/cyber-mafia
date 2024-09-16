import { create } from 'zustand';

const useLoading = create((set) => ({
  images: {},
  setIsLoadingImagesOfPages: (page, isLoading) => set((state) => ({ images: {...state.images, [page]: isLoading} })),
}));

export default useLoading;