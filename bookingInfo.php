<?php

// Include
require('vendor/autoload.php');

// Class to handle bookings
class Booking {
  public $id = 0;
  public $status = '';
  public $name = '';
  public $startDate = 2021-01-01;
  public $endDate = 2021-01-01;
  public $meal = '';
  public $activities = '';
  public $flightInfo = ''; 
}

// Fetch remote bookings and update local database
function FetchBookings() {
  $bookings = GetBookingsRetreatGuru();
  UpdateLocalDb($bookings,false);
}

// Fetch remote bookings
function GetBookingsRetreatGuru() {
  $bookings = array();
  $result = file_get_contents("https://demo14.secure.retreat.guru/api/v1/registrations?token=ef061e1a717568ee5ca5c76a94cf5842");
  $registrations = json_decode($result);
  $i = 0;
  foreach ($registrations as $registration) {
    $booking = new Booking;
    $booking->id = $registration->id;
    $booking->status = $registration->status;
    $booking->name = $registration->full_name;
    $booking->startDate = $registration->start_date;
    $booking->endDate = $registration->end_date;
    $booking->meal = "";
    $booking->flightInfo = "";
    $booking->activities = "";
    $bookings[$i] = $booking;
    $i++;
  }
  return $bookings;
}

// Connect to local db
function ConnectDb() {
  // global $db;
  $db = dibi::connect([
      'driver' => 'sqlite',
      'database' => 'CalendarDb.db',
  ]);
  return $db;
}

// Update the local db
function UpdateLocalDb($bookings, $isFromEditForm) {
  // Loop over all bookings
  $db = ConnectDb();
 
  foreach ($bookings as $booking) {
    // Update existing booking
    if ($isFromEditForm) {
      $db->query('UPDATE CalendarDb SET', [
        'meal' => $booking->meal,
        'activities' => $booking->activities,
        'flightInfo' => $booking->flightInfo,
      ], 'WHERE id = ?', $booking->id);
    }
    else {
      $db->query('UPDATE CalendarDb SET', [
        'name' => $booking->name,
        'status' => $booking->status,
        'startDate' => $booking->startDate,
        'endDate' => $booking->endDate,
      ], 'WHERE id = ?', $booking->id);
    }
    
    // Add new entry if booking id not found
    if ($db->getAffectedRows() == 0) {
      $db->query( 'INSERT INTO CalendarDb',
      [
          'id' => $booking->id,
          'name' => $booking->name,
          'status' => $booking->status,
          'startDate' => $booking->startDate,
          'endDate' => $booking->endDate,
          'meal' => $booking->meal,
          'activities' => $booking->activities,
          'flightInfo' => $booking->flightInfo,
      ]);
    }
  } 
}

// Retrieve the bookings from the local db
function GetBookingsFromDb() {
  $db = ConnectDb();  
  $rows = $db->query('SELECT * FROM CalendarDb');
  $rows = $rows->fetchAll();
  $bookings = array();
  foreach ($rows as $row) {
      $booking = new Booking;
      $booking->id = $row->id;
      $booking->status = $row->status;
      $booking->name = $row->name;
      $booking->startDate = $row->startDate;
      $booking->endDate = $row->endDate;
      $booking->meal = $row->meal;
      $booking->flightInfo = $row->flightInfo;
      $booking->activities = $row->activities;
      array_push($bookings,$booking);
  }
  return $bookings;
}

?>
