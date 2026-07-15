(function () {
  'use strict'
  const d = window.HotelData || {}
  window.HotelRooms = d.rooms || window.HotelRooms || {}
  window.HotelMapPlaces = d.mapPlaces || window.HotelMapPlaces || []
  window.HotelInfoSlides = d.infoSlides || window.HotelInfoSlides || []
})()
