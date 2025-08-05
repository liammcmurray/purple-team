$(document).ready(function(){

  // Set vars for date today - to stop us having to update for every session.
  // - add leading zeros to day and month, then take only the last two characters
  // - to account for numbers with one character.
  var date = new Date();
  var todayDay = date.getDate();
  var todayMonth = date.getMonth()+1;
  var todayYear = date.getFullYear();
  var todayCopRefDay = ('0' + date.getDate()).slice(-2);
  var todayCopRefMonth = ('0' + (date.getMonth()+1)).slice(-2);  // +1 to offset 0
  var todayCopReference = todayYear+''+todayCopRefMonth+''+todayCopRefDay;
  //console.log(todayCopReference);
  //console.log('today: '+todayDay+'/'+todayMonth+'/'+todayYear);

  // Set vars for date yesterday - to stop us having to update for every session.
  yesterday = new Date();
  yesterday.setDate(yesterday.getDate()-1); // -1 to set yesterday.
  var yesterdayDay = yesterday.getDate();
  var yesterdayMonth = yesterday.getMonth()+1;
  var yesterdayYear = yesterday.getFullYear();
  var yesterdayCopRefDay = ('0' + yesterday.getDate()).slice(-2);
  var yesterdayCopRefMonth = ('0' + (yesterday.getMonth()+1)).slice(-2);  // +1 to offset 0
  var yesterdayCopReference = yesterdayYear+''+yesterdayCopRefMonth+''+yesterdayCopRefDay;
  //console.log(yesterdayCopReference);
  //console.log('yesterday: '+yesterdayDay+'/'+yesterdayMonth+'/'+yesterdayYear);

  // Set vars for yesterday and today.
  // Today inputs
  $('#session-date-today #session-date-today-day').val(todayDay);
  $('#session-date-today #session-date-today-month').val(todayMonth);
  $('#session-date-today #session-date-today-year').val(todayYear);
  $('#today-cop-reference').val(todayCopReference);
  // Yesterday inputs
  $('#session-date-yesterday #session-date-yesterday-day').val(yesterdayDay);
  $('#session-date-yesterday #session-date-yesterday-month').val(yesterdayMonth);
  $('#session-date-yesterday #session-date-yesterday-year').val(yesterdayYear);
  $('#yesterday-cop-reference').val(yesterdayCopReference);
})
