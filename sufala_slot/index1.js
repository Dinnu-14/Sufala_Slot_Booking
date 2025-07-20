document.addEventListener("DOMContentLoaded", () => {
  const month_names = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const calendar = document.querySelector(".calendar");
  const month_picker = calendar.querySelector("#month-picker");
  const month_list = calendar.querySelector(".month-list");
  const calendar_days = calendar.querySelector(".calendar-days");
  const calendar_header_year = calendar.querySelector("#year");

  const currDate = new Date();
  const curr_month = { value: currDate.getMonth() };
  const curr_year = { value: currDate.getFullYear() };

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  function getFebDays(year) {
    return isLeapYear(year) ? 29 : 28;
  }

  function generateCalendar(month, year) {
    const days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    calendar_days.innerHTML = "";
    const first_day = new Date(year, month, 1);

    month_picker.textContent = month_names[month];
    calendar_header_year.textContent = year;

    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
      const day = document.createElement("div");

      if (i >= first_day.getDay()) {
        const dateNumber = i - first_day.getDay() + 1;
        day.innerHTML = `${dateNumber}<span></span>`;
        day.classList.add("calendar-day-hover");

        if (
          dateNumber === currDate.getDate() &&
          month === currDate.getMonth() &&
          year === currDate.getFullYear()
        ) {
          day.classList.add("curr-date");
        }

        day.onclick = () => {
          selectDate(`${dateNumber}-${month_names[month]}-${year}`);
          document.querySelectorAll(".calendar-days div").forEach(d => d.classList.remove("selected"));
          day.classList.add("selected");
        };
      }

      calendar_days.appendChild(day);
    }
  }

  // Setup month picker
  month_names.forEach((name, index) => {
    const month = document.createElement("div");
    month.innerHTML = `<div data-month="${index}">${name}</div>`;
    month.querySelector("div").onclick = () => {
      month_list.classList.remove("show");
      curr_month.value = index;
      generateCalendar(index, curr_year.value);
    };
    month_list.appendChild(month);
  });

  month_picker.onclick = () => {
    month_list.classList.add("show");
  };

  // Setup year change
  document.querySelector("#prev-year").onclick = () => {
    curr_year.value--;
    generateCalendar(curr_month.value, curr_year.value);
  };

  document.querySelector("#next-year").onclick = () => {
    curr_year.value++;
    generateCalendar(curr_month.value, curr_year.value);
  };

  generateCalendar(curr_month.value, curr_year.value);

  // Dark/Light toggle
  const dark_mode_toggle = document.querySelector(".dark-mode-switch");
  if (dark_mode_toggle) {
    dark_mode_toggle.onclick = () => {
      document.body.classList.toggle("light");
      document.body.classList.toggle("dark");
    };
  }

  // Booking slots management
  const bookedSlots = ["8:00 - 8:30 AM", "9:30 - 10:00 AM"];
  document.querySelectorAll("#slots .product-card").forEach(card => {
    const time = card.textContent.trim();
    if (bookedSlots.includes(time)) {
      card.style.display = "none";
    } else {
      card.onclick = () => selectSlot(time);
    }
  });
});





let selectedProduct = "";
let selectedDate = "";
let selectedQuantity = "";
let selectedSlot = "";

function goToCalendar(productName) {
  selectedProduct = productName;
  document.getElementById("calendar-section").style.display = "block";
  document.getElementById("calendar-section").scrollIntoView({ behavior: "smooth" });
}

function selectDate(date) {
  selectedDate = date;
  document.getElementById("quantity").style.display = "block";
  document.getElementById("quantity").scrollIntoView({ behavior: "smooth" });
}

function selectQuantity(quantity) {
  selectedQuantity = quantity;
  document.getElementById("slots").style.display = "block";
  document.getElementById("slots").scrollIntoView({ behavior: "smooth" });
}

function selectSlot(slot) {
  selectedSlot = slot;
  payNow();
}

function payNow() {
  const options = {
    key: "YOUR_RAZORPAY_KEY",  // 🔁 <-- Replace with your actual Razorpay Key
    amount: 5000, // in paise => ₹50
    currency: "INR",
    name: "Sufala Naturals",
    description: `${selectedProduct} - ${selectedQuantity} - ${selectedSlot} on ${selectedDate}`,
    handler: function (response) {
      alert("Payment successful: " + response.razorpay_payment_id);
    },
    prefill: {
      name: "Customer Name",
      email: "customer@example.com",
      contact: "9999999999",
    },
    theme: {
      color: "#ffc85c",
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
}
