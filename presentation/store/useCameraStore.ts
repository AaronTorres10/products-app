import { create } from "zustand";

interface TemporalCameraStoreState {
  selectedImages: string[];

  addSelectedImage: (image: string) => void;

  removeSelectedImage: (index: number) => void;

  clearImages: () => void;
}

export const useCameraStore = create<TemporalCameraStoreState>()((set) => ({
  selectedImages: [],

  addSelectedImage: (image) => {
    set((state) => ({ selectedImages: [...state.selectedImages, image] }));
  },
  removeSelectedImage: (index) => {
    set((state) => ({
      selectedImages: state.selectedImages.filter(
        (_, imageIndex) => imageIndex !== index,
      ),
    }));
  },
  clearImages: () => set({ selectedImages: [] }),
}));
