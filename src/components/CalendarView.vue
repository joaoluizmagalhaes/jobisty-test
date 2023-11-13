<template>
  <div class="flex flex-col max-w-[700px] w-full px-5">
    <div class="grid grid-cols-7 w-full">
      <div class="flex justify-center bg-primary text-white border" v-for="day in daysOfWeek" :key="day">
        <span class="hidden sm:!flex ">{{ day }}</span>
        <span class="sm:hidden">{{ day.substring(0, 3) }}</span>
      </div>
    </div>
    <div class="grid grid-cols-7" v-for="(week, weekIndex) in daysInMonth" :key="weekIndex">
      <div
        v-for="(day, dayIndex) in week"
        :key="dayIndex"
        class="w-full h-20 border p-2"
        :class="{
          'bg-gray-100': !day.isCurrentMonth,
          'text-blue': day.isWeekend
        }" >
        {{ day.day }}
        <div class=""></div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { getMonth, getYear, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addDays, format } from 'date-fns';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const currentDate = new Date();
const month = getMonth(currentDate);
const year = getYear(currentDate);
const daysInMonth = ref([]);

onMounted(() => {
  calculateDaysInMonth();
});

function calculateDaysInMonth() {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  const startWeek = startOfWeek(start);
  const endWeek = endOfWeek(end);

  let days = [];
  for (let d = startWeek; d <= endWeek; d = addDays(d, 1)) {
    days.push({
      date: format(d, 'yyyy-MM-dd'),
      day: format(d, 'd'),
      isCurrentMonth: d >= start && d <= end,
      isWeekend: d.getDay() === 0 || d.getDay() === 6 // Correto para verificar sábado e domingo
    });
  }

  // Agrupa os dias em semanas
  let week = [];
  days.forEach(day => {
    week.push(day);
    if (week.length === 7) {
      daysInMonth.value.push(week);
      week = [];
    }
  });
}
</script>

