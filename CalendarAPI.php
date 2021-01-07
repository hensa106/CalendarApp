<?php
header('Content-type: application/json');
include 'bookingInfo.php';
FetchBookings();
$bookings = GetBookingsFromDb();
echo json_encode($bookings);
?>