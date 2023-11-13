<template>
  <div class="flex flex-col max-w-[700px] w-full px-5">
    <div class="grid grid-cols-7 w-full">
      <div class="flex justify-center bg-primary text-white border" v-for="day in daysOfWeek" :key="day">
        <span class="hidden sm:!flex ">{{ day }}</span>
        <span class="sm:hidden">{{ day.substring(0, 3) }}</span>
      </div>
    </div>
    <div class="grid grid-cols-7" v-for="(week, weekIndex) in daysInMonth" :key="weekIndex">
      <div class="w-full h-20 border p-2" v-for="(day, dayIndex) in week" :key="dayIndex">
        {{ day.day }}
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { getMonth, getYear, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, format } from 'date-fns';

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
  const days = eachDayOfInterval({ start: startWeek, end: endWeek });

  let week = [];
  days.forEach(day => {
    if (week.length && day.getDay() === 0) {
      daysInMonth.value.push(week);
      week = [];
    }
    week.push({
      date: format(day, 'yyyy-MM-dd'),
      day: day >= start && day <= end ? format(day, 'd') : ''
    });
  });
  if (week.length) {
    daysInMonth.value.push(week);
  }
}
</script>

