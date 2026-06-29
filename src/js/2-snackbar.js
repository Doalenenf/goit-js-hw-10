import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const delayInput = form.elements.delay;
  const stateInput = form.elements.state;

  const delay = parseInt(delayInput.value, 10);
  const state = stateInput.value;

  // Create the promise
  createPromise(delay, state)
    .then((resolvedDelay) => {
      iziToast.success({
        title: "OK",
        message: `Fulfilled promise in ${resolvedDelay}ms`,
        position: "topRight",
      });
    })
    .catch((rejectedDelay) => {
      iziToast.error({
        title: "Error",
        message: `Rejected promise in ${rejectedDelay}ms`,
        position: "topRight",
      });
    });

  // Reset form
  form.reset();
});

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === "fulfilled") {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}
