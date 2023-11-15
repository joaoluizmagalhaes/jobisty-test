<template>
  <div class="flex flex-col items-end max-w-[700px] w-full px-2 lg:px-5">
    <div class="flex justify-between w-full mb-6">
      <q-btn flat icon="chevron_left" color="primary" @click="changeMonth(-1)" />
      <h1 class="text-5xl font-bold text-primary self-center ">{{ monthName }}</h1>
      <q-btn flat icon="chevron_right" color="primary" @click="changeMonth(1)" />
    </div>

    <div class="grid grid-cols-7 w-full">
      <div class="flex justify-center bg-primary text-white border" v-for="day in daysOfWeek" :key="day">
        <span class="hidden sm:!flex ">{{ day }}</span>
        <span class="sm:hidden">{{ day.substring(0, 3) }}</span>
      </div>
    </div>
    <div class="grid grid-cols-7 w-full" v-for="(week, weekIndex) in daysInMonth" :key="weekIndex">
      <div
        v-for="(day, dayIndex) in week"
        :key="dayIndex"
        class="w-full h-20 border p-1 flex justify-end relative overflow-hidden"
        :class="{
          'bg-gray-100': !day.isCurrentMonth,
          'text-blue': day.isWeekend
        }" >
        <span class="absolute top-1 left-1">{{ day.day }}</span>
        <div class="reminder-chips flex justify-end overflow-scroll h-full mt-5 md:mt-0">
          <q-chip
            v-for="reminder in getRemindersForDate(day.date)"
            :key="reminder.id"
            :color="reminder.color.toLowerCase()"
            text-color="white"
            class="text-xs cursor-pointer m-0 md:m-1 p-1 md:px-3 md:py-2"
            clickable
            @click="openViewModal(reminder)"
          >
            {{ reminder.time}}
          </q-chip>
        </div>
      </div>
    </div>
    <q-btn class="mt-6" label="Add Reminder" color="primary" @click="openAddNewReminder" />

    <q-dialog v-model="showReminderModal" >
      <q-card class="w-96">
        <q-card-section>
          <div class="text-h6">Add Reminder</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveNewReminder">
            <q-input
              v-model="reminder.text"
              maxlength="30"
              name="text"
              label="Reminder Text"
              :error="formErrors.textError !== ''"
              :error-message="formErrors.textError"
            />
            <q-input
              v-model="reminder.city"
              name="city"
              label="City"
              :error="formErrors.cityError !== ''"
              :error-message="formErrors.cityError"
            />
            <q-select
              v-model="reminder.color"
              :options="colorOptions"
              label="Color"
              name="color"
              class="mb-6"
              :error="formErrors.colorError !== ''"
              :error-message="formErrors.colorError"
            />
            <q-input
              filled
              v-model="reminder.date"
              mask="date"
              name="date"
              :rules="['date']"
              :error="formErrors.dateError !== ''"
              :error-message="formErrors.dateError"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="reminder.date" minimal>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input
              filled
              v-model="reminder.time"
              mask="time"
              name="time"
              :rules="['time']"
              :error="formErrors.timeError !== ''"
              :error-message="formErrors.timeError"
            >
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="reminder.time">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-btn label="Add new" type="submit" color="primary" class="mt-6" v-if="!reminder.id" />
            <q-btn label="Save changes" color="primary" class="mt-6" @click="updateReminder(reminder)" v-else />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showViewModal">
      <q-card class="w-96">
        <q-card-section class="flex justify-between">
          <div class="text-h6">Reminder Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div><strong>Text:</strong> {{ selectedReminder.text }}</div>
          <div><strong>City:</strong> {{ selectedReminder.city }}</div>
          <div><strong>Date:</strong> {{ formatDate(selectedReminder.date) }}</div>
          <div><strong>Time:</strong> {{ selectedReminder.time }}</div>
          <div v-if="forecast"><strong>Weather:</strong> {{ forecast.weather[0].main }}</div>
        </q-card-section>

        <q-card-section class="flex justify-end">
          <q-btn label="Edit" color="secondary" @click="openEditModal(selectedReminder)" />
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { getMonth, getYear, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, parseISO, isValid  } from 'date-fns';
import { useCalendarStore } from '../stores/calendar';
import axios from 'axios';
import { useQuasar } from 'quasar';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const currentDate = new Date();
const month = ref(getMonth(currentDate));
const monthName = ref('');
const year = ref(getYear(currentDate));
const daysInMonth = ref([]);
const showReminderModal = ref(false);
const reminder = ref({
  text: '',
  city: '',
  color: '',
  time: '',
  id: null,
  date: new Date().toISOString()
});
const colorOptions = ['Red', 'Green', 'Blue', 'Yellow', 'Purple'];
const calendarStore = useCalendarStore();
const formErrors = ref({
  textError: '',
  cityError: '',
  colorError: '',
  dateError: '',
  timeError: ''
});
const showViewModal = ref(false);
const selectedReminder = ref({
  textError: '',
  cityError: '',
  colorError: '',
  dateError: '',
  timeError: '',
  id: null
})
const $q = useQuasar();
const forecast = ref(null);

onMounted(() => {
  calculateDaysInMonth();
  monthName.value = format(currentDate, 'MMMM / yy');
})

const changeMonth = (offset) => {
  const currentMonth = currentDate.getMonth();
  const newMonth = currentMonth + offset;

  if (newMonth > 11) {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    currentDate.setMonth(0);
  } else if (newMonth < 0) {
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    currentDate.setMonth(11);
  } else {
    currentDate.setMonth(newMonth);
  }

  month.value = getMonth(currentDate);
  year.value = getYear(currentDate);
  monthName.value = format(currentDate, 'MMMM / yy');
  calculateDaysInMonth();
}

const calculateDaysInMonth = () => {
  daysInMonth.value = [];

  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const startWeek = startOfWeek(start);
  const endWeek = endOfWeek(end);

  let days = [];
  for (let d = startWeek; d <= endWeek; d = addDays(d, 1)) {
    days.push({
      date: format(d, 'yyyy-MM-dd'),
      day: format(d, 'd'),
      isCurrentMonth: d >= start && d <= end,
      isWeekend: d.getDay() === 0 || d.getDay() === 6
    });
  }

  let week = [];
  days.forEach(day => {
    week.push(day);
    if (week.length === 7) {
      daysInMonth.value.push(week);
      week = [];
    }
  });
}

const emptyLocalReminder = () => {
  reminder.value = { text: '', city: '', color: '', time: '', id: null, date: new Date().toISOString() };
}

const openAddNewReminder = () => {
  showReminderModal.value = true
  emptyLocalReminder()
}

const saveNewReminder = () => {
  if (validateReminder(reminder.value)) {
    const newReminder = { ...reminder.value, id: Date.now() };
    calendarStore.reminder.push(newReminder);
    showReminderModal.value = false;
    emptyLocalReminder()
  }
}

const updateReminder = (reminderToUpdate) => {
  const index = calendarStore.reminder.findIndex(reminder => reminder.id === reminderToUpdate.id);
  if (index !== -1) {
    calendarStore.reminder[index] = reminderToUpdate;
    showReminderModal.value = false;
    emptyLocalReminder();
  }

}

const validateReminder = (reminder) => {
  let isValid = true;

  if (!reminder.text || reminder.text.length > 30) {
    formErrors.value.textError = 'Reminder text must be 1-30 characters.';
    isValid = false;
  } else {
    formErrors.value.textError = '';
  }

  if (!reminder.city) {
    formErrors.value.cityError = 'City is required.';
    isValid = false;
  } else {
    formErrors.value.cityError = '';
  }

  if (!reminder.color) {
    formErrors.value.colorError = 'Color selection is required.';
    isValid = false;
  } else {
    formErrors.value.colorError = '';
  }

  if (!reminder.date) {
    formErrors.value.dateError = 'Date is required.';
    isValid = false;
  } else {
    formErrors.value.dateError = '';
  }

  if (!reminder.time) {
    formErrors.value.timeError = 'Time is required.';
    isValid = false;
  } else {
    formErrors.value.timeError = '';
  }

  return isValid;
}

const getRemindersForDate = (date) => {
  return calendarStore.reminder.filter(reminder => {
    const isoDate = convertDateToISOFormat(reminder.date);

    const parsedDate = parseISO(isoDate);
    if (!isValid(parsedDate)) {
      console.error('Invalid date:', isoDate);
      return false;
    }

    const formattedDate = format(parsedDate, 'yyyy-MM-dd');
    return formattedDate === date;
  })
  .sort((a, b) => {
    return a.time.localeCompare(b.time);
  });
}

const convertDateToISOFormat = (dateString) => {
  return dateString.replace(/\//g, '-');
}

const openViewModal = async (reminder) => {
  $q.loading.show();
  selectedReminder.value = { ...reminder };

  const weatherData = await fetchWeather(reminder.city);

  if (weatherData) {
    const reminderDateUTC = formatDate(reminder.date);

    forecast.value = weatherData.list.find(forecast => {
      const forecastDate = new Date(forecast.dt * 1000).toLocaleDateString('en-US');

      return forecastDate === reminderDateUTC;
    });

    showViewModal.value = true;
  } else {
    forecast.value = null;
  }

  $q.loading.hide();
}

const openEditModal = (reminderToEdit) => {
  reminder.value = { ...reminderToEdit };
  showViewModal.value = false;
  showReminderModal.value = true;
}

const formatDate = (dateString) => {
  const isoFormattedString = dateString.replace(/\//g, '-');

  try {
    const date = parseISO(isoFormattedString);
    return format(date, 'MM/dd/yyyy');
  } catch (error) {
    alert('Error formatting the date:' + error);
    return 'Invalid Date';
  }
}

const fetchWeather = async (city) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${calendarStore.weatherAPIKey}`);
    const { lat, lon } = response.data.coord;

    const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${calendarStore.weatherAPIKey}`);
    return forecastResponse.data;

  } catch (error) {
    console.error('Error trying to find forecast weather:', error);
    return null;
  }
}

</script>
