import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

let userSelectedDate = null;
let timerId = null;

const inputPicker = document.querySelector("#datetime-picker");
const btnStart = document.querySelector("button[data-start]");
const daysSpan = document.querySelector("[data-days]");
const hoursSpan = document.querySelector("[data-hours]");
const minutesSpan = document.querySelector("[data-minutes]");
const secondsSpan = document.querySelector("[data-seconds]");

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (!selectedDate || selectedDate <= new Date()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });
      btnStart.disabled = true;
      userSelectedDate = null;
    } else {
      btnStart.disabled = false;
      userSelectedDate = selectedDate;
    }
  },
};

flatpickr(inputPicker, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

function updateTimerInterface(days, hours, minutes, seconds) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

btnStart.addEventListener("click", () => {
  if (!userSelectedDate) return;

  btnStart.disabled = true;
  inputPicker.disabled = true;

  const runTick = () => {
    const ms = userSelectedDate - new Date();
    if (ms <= 0) {
      clearInterval(timerId);
      updateTimerInterface(0, 0, 0, 0);
      inputPicker.disabled = false;
      btnStart.disabled = true;
      userSelectedDate = null;
      return;
    }
    const { days, hours, minutes, seconds } = convertMs(ms);
    updateTimerInterface(days, hours, minutes, seconds);
  };

  runTick();
  timerId = setInterval(runTick, 1000);
});
