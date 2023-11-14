import { defineStore } from 'pinia';

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    reminder: [],
    weatherAPIKey: import.meta.env.VITE_OPEN_WEATHER_API_KEY,
  }),
  persist: {
     paths: ['reminder']
  },
});
