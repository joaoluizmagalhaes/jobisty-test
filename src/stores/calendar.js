import { defineStore } from 'pinia';

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    reminder: [],
  }),
  persist: {
     paths: ['reminder']
  },
});
