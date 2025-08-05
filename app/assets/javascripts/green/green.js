$(document).ready(function(){

  /*
  *
  *
  SPRINT 40
  *
  *
  */

  if(window.location.pathname == '/green/sprint-40/forms/use-of-force/3-subject-details' || window.location.pathname == '/green/sprint-42/forms/use-of-force-1/3-subject-details') {
    // Create a fake error every time to stop the user journey.
    $('#btn-save-continue').one('click',function(e) {
      var _markup = '<span id="subject-dob-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Enter a date of birth</span>';
      $('#cop-use-of-force-3 .govuk-form-group').addClass('govuk-form-group--error');
      $('#cop-use-of-force-3 .govuk-form-group .govuk-fieldset__legend').after().append(_markup);
      $('#gov-error').attr('style','');
    });
  }

  /*
  *
  *
  SPRINT 36
  *
  *
  */

  // Check for data changes on every question form.
  $('#cop-question-form').submit(function(e) {
    // check current var against previous var.
    var _currentVal = $('#savedValue').text();

    var _newVal = $('#cop-question-form .cop-form-element').val();
    // Make special case to set the variable on grade page.
    if($('#cop-question-form').hasClass('question-grade')) {
      _newVal = $('#cop-question-form .govuk-radios input[name=participant-grade]:checked').val();
    }
    // Mutliple teams.
    if($('#cop-question-form').hasClass('add-another')) {
      _newVal = $('#all-teams').val();
    }


    // Make sure value isn't null (set on the template if no value has been defined)
    if(_currentVal != 'null') {
      // If the values have changed.
      if(_currentVal != _newVal) {
        var _attr = $('#savedValue').attr('data');
        // Set the new value.
        $('#changed-field').val(_attr+','+_newVal);
      }
    }
    //submit the form.
    e.target.submit();
  })

  if( window.location.pathname == '/green/sprint-37/your-profile/question-team-check-answers') {
    var _teams = $('#all-teams').val().split(',');

    // start at 1 to skip the first null array value.
    for ( var i = 0; i < _teams.length ; i++ ) {
      addToTeamList(_teams[i], i);
    }
    addRemoveTeamClick();
    // on click add another, reset the form redirect, and make it submit to update the vars.
    $('#addAnotherButton').click(function(e) {
      var _redirect = $(this).attr('href');
      $('#cop-question-form').attr('action', _redirect);
      $('#cop-question-form').submit();
      e.preventDefault();
    });
  }

  function addToTeamList(_team, _i) {
    var markup1 = '<div id="team'+i+'" class="govuk-summary-list__row cop-team-list-row"><dd class="govuk-summary-list__value">'+_team+'</dd><dd class="govuk-summary-list__actions">'
    var markup2 = '<a class="govuk-link cop-remove-team" href="#">Remove<span class="govuk-visually-hidden"> location</span></a></dd></div>'
    var markup = markup1+markup2;
    $('#allTeamList').append(markup);
  }

  function addRemoveTeamClick() {
    $('.cop-remove-team').click(function(e) {
      // Don't allow remove if only 1 left!
      var _allTeams = $('#all-teams').val().split(',');
      if(_allTeams.length > 1) {
        // Find the value that has been selected for removal.
        var _str = $(this).closest('.cop-team-list-row').find('.govuk-summary-list__value').text();
        // find the value in the hidden text field and remove it.
        // var arraycontains = $.inArray(_str, _allLocations);
        var arraycontains = _allTeams.indexOf(_str);
        if(arraycontains > -1) {
          _allTeams.splice(arraycontains,1)
        }
        // Set the all locations value.
        $('#all-teams').val(_allTeams)
        // remove the row.
        $(this).closest('.cop-team-list-row').remove();
      }
      // set the remaining location to be default.
      $('#team-name').val(_allTeams[0]);
    });
  }

  if( window.location.pathname == '/green/sprint-37/your-profile/question-team-add') {
    $('#cop-question-form').submit(function(e){
      var _team = $('#team-name').val();
      var _allTeamsArray = $('#all-teams').val().split(',');

      if(_team !== '') {
        _allTeamsArray.push(_team);
        $('#all-teams').val(_allTeamsArray);
      }
      //submit the form.
      e.target.submit();
    });
  }


  if( window.location.pathname == '/green/sprint-37/user-details/new-user') {
    $('#newUser').submit(function(e){
      //get location-name
      var _location = $('#location-name').val();
      var _team = $('#team-name').val();
      // set default multiple locations fields (hidden)
      $('#all-locations').val(_location);
      $('#all-teams').val(_team);
      $('#cop-question-form').submit();
    });
  }


  if( window.location.pathname == '/green/sprint-37/your-profile/question-location') {
    var savedLocation = $('#location-name').val();

    $('#cop-question-form').submit(function(e){

      var _newLocation = $('#location-name').val();
      var _allLocations = $('#all-locations').val().split(',');

      // check if the user changed a value.
      if(_newLocation != savedLocation) {
        //push new location to array
        _allLocations.push(_newLocation);

        var _itemIndex = _allLocations.indexOf(savedLocation);

        if(_itemIndex > -1) {
           _allLocations.splice( _itemIndex, 1 );
          $('#all-locations').val(_allLocations);
        }
        //submit the form.
        e.target.submit();
      }
    });
  }

  if( window.location.pathname == '/green/sprint-37/your-profile/question-location-add') {
    $('#cop-question-form').submit(function(){
      var _location = $('#location-name').val();
      var _allLocations = $('#all-locations').val().split(',');
      // If some data is added then add to the locations list and update the hidden field;
      if(_location !== '') {
        _allLocations.push(_location);
        $('#all-locations').val(_allLocations);
      }
      //submit the form.
      e.target.submit();
    });
  }

  if( window.location.pathname == '/green/sprint-37/your-profile/question-location-check-answers') {
    var _locations = $('#all-locations').val().split(',');

    // start at 1 to skip the first null array value.
    for ( var i = 0; i < _locations.length ; i++ ) {
      addToLocationList(_locations[i], i);
    }
    addRemoveClick();
  }

  function addToLocationList(_location, _i) {
    var markup1 = '<div id="location'+i+'" class="govuk-summary-list__row cop-location-list-row"><dd class="govuk-summary-list__value">'+_location+'</dd><dd class="govuk-summary-list__actions">'
    var markup2 = '<a class="govuk-link cop-remove-location" href="#">Remove<span class="govuk-visually-hidden"> location</span></a></dd></div>'
    var markup = markup1+markup2;
    $('#allLocationsList').append(markup);
  }

  function addRemoveClick() {
    $('.cop-remove-location').click(function(e) {
      // Don't allow remove if only 1 left!
      var _allLocations = $('#all-locations').val().split(',');
      if(_allLocations.length > 1) {
        // Find the value that has been selected for removal.
        var _str = $(this).closest('.cop-location-list-row').find('.govuk-summary-list__value').text();
        // find the value in the hidden text field and remove it.
        // var arraycontains = $.inArray(_str, _allLocations);
        var arraycontains = _allLocations.indexOf(_str);
        if(arraycontains > -1) {
          _allLocations.splice(arraycontains,1)
        }
        // Set the all locations value.
        $('#all-locations').val(_allLocations)
        // remove the row.
        $(this).closest('.cop-location-list-row').remove();
      }
      // set the remaining location to be default.
      $('#location-name').val(_allLocations[0]);
    });
  }

  if( window.location.pathname == '/green/sprint-37/update-details') {
    $('#which-profile').val('update-profile');
  }

  //question page
  if( window.location.pathname == '/green/sprint-37/your-profile/profile-check-answers') {
    // Set the profile type to your profile after the form is submitted.
    $('#check-answers-form').submit(function() {
      $('#which-profile').val('your-profile');
    });

    var _whichProfileClass = $('.cop-all-locations #which-profile').val();
    // Set the class to ensure we have the correct styling for the page - your profile, or update profile
    $('body').addClass(_whichProfileClass);
    checkForProfileUpdate();
    setLocationTeamChanges();
  }

  function checkForProfileUpdate() {
    var _changedFieldVal = $('#changed-field').val();
    // Something has changed if the string is not nothing
    if(_changedFieldVal != '') {
      // change the values to an array
      var _changes = _changedFieldVal.split(',');
      profileChanged(_changes);
    }
  }

  function profileChanged(_changes) {
    var _typeOfChange = _changes[0];
    var _textChange = ''; // String needs to be built with multiple values.
    // Index 0 is always the type, so don't iterate over this one.
    for ( var i = 1; i < _changes.length ; i++ ) {
      _textChange += _changes[i];
      if(i != _changes.length) {
        _textChange += ', ';
      }
    }


    var _bannerHeading = 'default';
    var _bannerBody = 'default';

    switch(_typeOfChange) {
      case 'name':
        _bannerHeading  = 'Name changed';
        _bannerBody     = 'Your name is now '+_textChange;
      break;
      case 'telephone':
        _bannerHeading  = 'Telephone number changed';
        _bannerBody     = 'Your telephone number is now '+_textChange;
      break;
      case 'metis':
        _bannerHeading  = 'Metis number changed';
        _bannerBody     = 'Your Metis number is now '+_textChange;
      break;
      case 'grade':
        _bannerHeading  = 'Grade changed';
        _bannerBody     = 'Your grade is now '+_textChange;
      break;
      case 'location':
        _bannerHeading  = 'Location changed';
        _bannerBody     = 'Your location is now '+$('.cop-all-locations #all-locations').val();
      break;
      case 'team':
        _bannerHeading  = 'Team changed';
        _bannerBody     = 'Your team is now '+$('.cop-all-locations #all-teams').val();
      break;
      case 'manager':
        _bannerHeading  = 'Manager changed';
        _bannerBody     = 'Your manager is now '+_textChange;
      break;
    }
    // Set the banner header and body text, then show the banner.
    $('#govNotificationBanner h3.change-header').text(_bannerHeading);
    $('#govNotificationBanner p.change-body').text(_bannerBody);
    $('#govNotificationBanner').attr('style', '');
  }

  if( window.location.pathname == '/green/sprint-37/user-details/new-user') {
    $('#newUser').submit(function(e) {
      createProfileData();
      //submit the form.
      e.target.submit();
    });
  }

  function setLocationTeamChanges() {

    var _allLocations = $('#all-locations').val();
    var _locationsSplit = _allLocations.split(',');
    var _allTeams = $('#all-teams').val();
    var _teamsSplit = _allTeams.split(',');

    if(_locationsSplit.length > 1) {
      $('#profileLocation').text(_locationsSplit);
      // Set the change link to go to add more screen.
      $('#profileLocation').siblings('.govuk-summary-list__actions').find('a').attr('href', '/green/sprint-37/your-profile/question-location-check-answers');
      multipleLocations = true;
    }
    if(_teamsSplit.length > 1) {
      $('#profileTeam').text(_teamsSplit);
      // Set the change link to go to add more screen.
      $('#profileTeam').siblings('.govuk-summary-list__actions').find('a').attr('href', '/green/sprint-37/your-profile/question-team-check-answers');
      multipleTeams = true;
    }
  }


  /*
  *
  *

  SPRINT 36

  *
  *
  */

  // DROPDOWN: Control where the dropdown goes when its clicked.
  $('#changeGroupBtn').on('click',function(){

    var _prototcol = window.location.protocol;
    var _host = window.location.host;
    var _selection = $('#changeGroupSelect').val();
    var _url = _prototcol + '//' + _host + '/green/sprint34/' + _selection + '/dashboard';

    window.location.href = _url;
  });

  // Set up the toggle to show and hide the dropdown.
  $('#copChangeControl').click(function(e){
    $('#copGroupDd').show();
    $('#copDashboardTitle').hide();
    //$('#copGroupSubtitle').hide();

    e.preventDefault();
    return false;
  });
  $('#copGroupDdCancel').click(function(e){
    $('#copGroupDd').hide();
    $('#copDashboardTitle').show();
    //$('#copGroupSubtitle').show();

    e.preventDefault();
    return false;
  });
})
