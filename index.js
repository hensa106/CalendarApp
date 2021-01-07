// Store bookings for later use 
let bookings=[];

// Class Booking: Store all info about a booking
class Booking {
    constructor() {
        this.id = NaN;
        this.status = "";
        this.startDate = "";
        this.endDate = "";
        this.name = "";
        this.flightInfo = "";
        this.meal = "";
        this.activities = "";
    }
}

// Draw calendar and populate with bookings
function drawCalendar(month, offsetday, daysInMonth) {
    const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let bookingsArray = [];
    // Get the calendar div
    const calendar = document.querySelector("#myCalendar");

    // Create week day legends
    for (let i = 0; i < 7; i++) {
        calendar.insertAdjacentHTML("beforeend", `<div id="${weekdays[i]}" class="day legend" >${weekdays[i]} </div>`);
    }
    // Insert blank days for July
    for (let i = 0; i < offsetday; i++) {
        calendar.insertAdjacentHTML("beforeend", `<div id="spacer" class="day" > </div>`);
    }

    // Retrieve the bookings from the backend http://henrik.strawman.ca
    $.ajax({
        type: 'get',
        url: '/CalendarAPI.php',
        dataType: 'text',
        data: '',
        success: function(response) {
            // let bookings = [];
            jsonBookings = JSON.parse(response); // array
            jsonBookings.forEach(srvBooking => {
                let booking = new Booking;
                booking.id = srvBooking.id;
                booking.name = srvBooking.name ? srvBooking.name : "";
                booking.status = srvBooking.status ? srvBooking.status : "";
                booking.startDate = new Date(srvBooking.startDate.concat("T18:00:00Z"));
                booking.endDate = new Date(srvBooking.endDate.concat("T18:00:00Z"));
                booking.meal = srvBooking.meal ? srvBooking.meal : "";
                booking.activities = srvBooking.activities ? srvBooking.activities : "";
                booking.flightInfo = srvBooking.flightInfo ? srvBooking.flightInfo : "";
                bookingsArray.push(booking);
            });
        
            // Populate the calendar
            for (let day = 1; day <= daysInMonth; day++) { 
                let bookingId = NaN;
                let isBooked = false;
                let bookingName = "Available";
                booking = FindBooking(bookings, day, month);
                if (booking != null) {
                    isBooked = true;
                    bookingId = booking.id;
                    bookingName = booking.name;
                }
                calendar.insertAdjacentHTML("beforeend", `<div id="${bookingId}" class="day ${isBooked ? "isBooked" : ""} tooltip" onclick="editBooking(this)">${day} <span class="tooltiptext">${bookingName}</span></div>`);
            }
        },
        error: function(xhr, status, error) {
            console.log(error);
        }
    });
    return bookingsArray;
}

// Find booking of specified day and month
function FindBooking(bookings, day, month) {
    let retBooking = null;
    // Assign an unique value for each day
    let selectedDay = month*100 + day;
    bookings.forEach(booking => {
        let startDay = booking.startDate.getMonth()*100 + booking.startDate.getDate();
        let endDay = booking.endDate.getMonth()*100 + booking.endDate.getDate();
        // Only include 'reserved' status
        if (startDay <= selectedDay && 
            endDay > selectedDay &&
            booking.status == "reserved" ) {
            retBooking = booking;
        }
    })
    return retBooking;
}

// Show edit booking form
function editBooking(id) {
    if (!isNaN(id.id)) {
        // Get the booking with matching id AND populate the form 
        const booking = GetBookingById(id.id);
        document.getElementById("BookingId").value = id.id;
        document.getElementById("meal").value = booking.meal;
        document.getElementById("flightInfo").value = booking.flightInfo;
        document.getElementById("yoga").checked = booking.activities.includes("yoga");
        document.getElementById("massage").checked = booking.activities.includes("massage");
        document.getElementById("juice_detox").checked = booking.activities.includes("juice_detox");
        document.getElementById("breathwork").checked = booking.activities.includes("breathwork");

        // Display form
        document.getElementById("editForm").style.display = "block";
    }
  }
  
  // Close edit booking form
  function closeForm() {
    document.getElementById("editForm").style.display = "none";
  }

  function GetBookingById(id) {
    return bookings.find(booking => booking.id == id);
  }

// Draw calendar for August 2025
bookings = drawCalendar(7, 5, 31);
