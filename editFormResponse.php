<?php
include 'bookingInfo.php';
$booking = new Booking;
$bookings = array();

//Retrieve string from post submission
$booking->id = $_POST['BookingId'];
$booking->meal = $_POST['meal'];
$booking->flightInfo = $_POST['flightInfo'];
$activities = $_POST['activities'];

// Create comma-separated list of activities
if (is_array($activities)) {
    $booking->activities = join($activities,',');
}
else {
    $booking->activities = '';
}

// Call UpdateLocalDb with an array
$bookings[0] = $booking; 
UpdateLocalDb($bookings, true);

// Redirect to index.html
header("Location: /index.html");
die();
?>
