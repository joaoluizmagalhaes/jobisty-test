import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import CalendarView from '../src/components/CalendarView.vue';
import { createTestingPinia } from '@pinia/testing';

describe('CalendarView', () => {
  it('displays an error if the reminder text exceeds 30 characters', async () => {
    const wrapper = mount(CalendarView, {
      global: {
        plugins: [createTestingPinia()]
      }
    });

    const input = wrapper.find('input[name="text"]');
    await input.setValue('This text is way too long to be a valid reminder');
    await wrapper.find('button[type="submit"]').trigger('click');
    expect(wrapper.text()).toContain('Reminder text must be 1-30 characters.');
  });

  it('allows submission with valid data', async () => {
    const wrapper = mount(CalendarView, {
      global: {
        plugins: [createTestingPinia()]
      }
    });

    const textInput = wrapper.find('input[name="text"]');
    await textInput.setValue('Meeting at 3 PM');
    const cityInput = wrapper.find('input[name="city"]');
    await cityInput.setValue('New York');
    const colorSelect = wrapper.find('select[name="color"]');
    await colorSelect.setValue('Red');
    const dateInput = wrapper.find('input[name="date"]');
    await dateInput.setValue('2023-11-25');
    const timeInput = wrapper.find('input[name="time"]');
    await timeInput.setValue('15:00');

    await wrapper.find('button[type="submit"]').trigger('click');
  });

  it('allows submission with valid data', async () => {
    const wrapper = mount(CalendarView, {
      global: {
        plugins: [createTestingPinia()]
      }
    });

    const textInput = wrapper.find('input[name="text"]');
    await textInput.setValue('Meeting at 3 PM');
    const cityInput = wrapper.find('input[name="city"]');
    await cityInput.setValue('New York');
    const colorSelect = wrapper.find('select[name="color"]');
    await colorSelect.setValue('Red');
    const dateInput = wrapper.find('input[name="date"]');
    await dateInput.setValue('2023-11-25');
    const timeInput = wrapper.find('input[name="time"]');
    await timeInput.setValue('15:00');

    await wrapper.find('button[type="submit"]').trigger('click');

    // Verifica se o evento de submissão foi emitido com os dados corretos
    const emitted = wrapper.emitted('submit');
    expect(emitted).toBeTruthy();
    expect(emitted[0][0]).toEqual({
      text: 'Meeting at 3 PM',
      city: 'New York',
      color: 'Red',
      date: '2023-11-25',
      time: '15:00'
    });
  });
});
