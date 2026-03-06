document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".request-form").forEach(form => {
    form.addEventListener("submit", handleFormSubmit);
  });
});

function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector("[name='name']");
  const phone = form.querySelector("[name='phone']");

  if (!name || !name.value.trim()) {
    alert("Пожалуйста, введите ваше имя");
    return;
  }
  if (!phone || !phone.value.trim()) {
    alert("Пожалуйста, введите ваш телефон");
    return;
  }

  const data = new FormData(form);
  const entries = {};
  data.forEach((v, k) => { entries[k] = v; });

  alert("Спасибо! Ваша заявка отправлена.\n\nМы свяжемся с вами в ближайшее время.\n\nИмя: " + entries.name + "\nТелефон: " + entries.phone + (entries.model ? "\nМодель: " + entries.model : ""));

  form.reset();
  closeRequestModal();
}
