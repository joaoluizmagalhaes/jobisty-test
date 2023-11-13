<template>
  <div class="flex flex-col w-[1050px]">
    <div class="flex w-full">
      <div class="text-center w-[150px] bg-primary text-white border" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
    </div>
    <div class="flex flex-wrap" v-for="week in daysInMonth" :key="week[index]">
      <div class="flex-1 text-center border p-4" v-for="day in week" :key="day[index]">
        {{ day.day }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMonth, getYear, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, format } from 'date-fns'

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const currentDate = new Date()
const month = getMonth(currentDate)
const year = getYear(currentDate)
const daysInMonth = ref([])

onMounted(() => {
  calculateDaysInMonth()
})

function calculateDaysInMonth() {

  const start = startOfMonth(new Date(year, month))
  const end = endOfMonth(new Date(year, month))
  const days = eachDayOfInterval({ start, end })

  let week = []
  days.forEach(day => {
    if (week.length > 0 && day.getDay() === 0) {
      daysInMonth.value.push(week)
      week = []
    }
    week.push({
      date: format(day, 'yyyy-MM-dd'),
      day: format(day, 'd')
    })
  })
  if (week.length > 0) {
    daysInMonth.value.push(week)
  }
}
</script>
