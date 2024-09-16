import { create } from 'zustand';

const useMessages = create((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [{...message, id: state.messages.length + 1}, ...state.messages] })),
  removeMessage: (id) => set((state) => ({ messages: state.messages.filter(msg => msg.id !== id) })),
}));

export default useMessages;