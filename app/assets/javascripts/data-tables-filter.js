$(document).ready(function() {
  // Only run datatables on these pages.
  if( window.location.pathname == '/green/sprint-37/your-tasks/index' || window.location.pathname == '/green/sprint-37/team-tasks/index'){
    // Make last column setting dynamic for sorting - so it works for all tasks and your tasks screens.
    var indexLastColumn = $("#copTasks").find('tr')[0].cells.length-1

    // Create table using datatables to simulate filters.
    var table = $('#copTasks').DataTable( {
      'autoWidth' : false,
      'pageLength': 15,
      'pagingType': 'simple_numbers',
      'responsive': true,
      'order': [[indexLastColumn, 'asc']],
      'bLengthChange' : false,
      'language': {
        'search': 'Search by COP reference',
        'info': 'Showing <strong>_START_</strong> to <strong>_END_</strong> of <strong>_TOTAL_</strong> results'
      },
      initComplete: function () {
        // Add id to search input.
        $('#copTasks_filter input').prop('id', 'copSearchInput');
        addSearchButton(this);
        addGovStyling();
        catchKeyboardPress();
        addTaskClickEvents();
      }
    });
  }

  // Apply filters and filter table
  $('#copApplyFilters').click(function(e){
    // Build a regex filter string with an or(|) condition
    var copTaskType = $('#copFilterType .checkbox__type:checked').map(function() {
     return '^' + this.value + '$';
    }).get().join('|');
    // Filter in column 1 (task type), with an regex, no smart filtering, not case sensitive
    table.column(1).search(copTaskType, true, false, false).draw();
    // Build a filter string with an or(|) condition
    var copTaskAssignedTo = $('#copFilterAssignedTo .checkbox__assigned:checked').map(function() {
     return this.value;
    }).get().join('|');
    // Filter in column 3 (task assigned to), with no regex, no smart filtering, not case sensitive
    table.column(3).search(copTaskAssignedTo, true, false, false).draw();
  });
  // Clear filters.
  $('#copClearFilters').click(function(e){
    // Undo global search.
    //$('#copTasks').DataTable().search('').draw();

    // Reset task type filter.
    table.column(1).search('').draw();
    // // Reset assigned to filter.
    table.column(3).search('').draw();

    // Reset checkboxes.
    $('.govuk-checkboxes__input').attr('checked', false)
  });

  // Add GOV styling.
  $('#copTasks').on('draw.dt', function() {
    addGovStyling();
    addTaskClickEvents();
  });

  function catchKeyboardPress() {
    $(document).keypress(function (event) {
      // Enter key.
      if (event.which == 13) {
        // Get and set the element with current focus to 'fake' enter presses.
        var $el = $(document.activeElement);
        var _id = $(document.activeElement).attr('id');
        // Trigger click equivalent if enter key is pressed.
        if($el.hasClass('govuk-button') || $el.hasClass('govuk-checkboxes__input')) {
          // Trigger select from enter press.
          $el.click();
        }
        // If its the input, then trigger search of the input value and re-draw the table.
        if($el.hasClass('govuk-input')) {
          table.search($el.val()).draw();
        }
      }
    });
  }

  function addSearchButton(_self) {
    // Remove default events from the input so we can control them ourselves.
    var input = $('.dataTables_filter input').unbind(),
    self = _self.api(),
    $searchButton = $('<button id="submitCopSearch" class="govuk-button">')
               .text('Search')
               .click(function() {
                  self.search(input.val()).draw();
               })
    // Add our own search button.
    $('.dataTables_filter').append($searchButton);
  }

  function addGovStyling() {
    $('.dataTables_filter label').addClass('govuk-label');
    $('.dataTables_filter input').addClass('govuk-input');
  }

  function addTaskClickEvents() {
    // Clicking any task adds the details to local storage.
    $('.cop-task-reference').on('click', function(e) {
      // Get the details of the task from the list.
      var _ref = $(this).text().trim();

      var _type = $(this).closest('tr').find('.cop-task-type').text().trim();
      var _task = $(this).closest('tr').find('.cop-task-task').text().trim();
      var _assigned = $(this).closest('tr').find('.cop-task-assigned').text().trim();
      var _due = $(this).closest('tr').find('.cop-task-due').text().trim();
      var _hours = $(this).closest('tr').find('.cop-task-hours').text().trim();

      var copTask = {
        'ref'       : _ref,
        'type'      : _type,
        'task'      : _task,
        'assigned'  : _assigned,
        'due'       : _due,
        'hours'     : _hours
      };

      localStorage.setItem('copTask', JSON.stringify(copTask));

      if( window.location.pathname == '/green/sprint-37/your-tasks/index'){
        setTimeout(function () {
          window.location = '/green/sprint-37/your-tasks/task-summary';
        }, 500);
      }else if(window.location.pathname == '/green/sprint-37/team-tasks/index') {
        setTimeout(function () {
          window.location = '/green/sprint-37/team-tasks/task-summary';
        }, 500);
      }

      e.preventDefault();
      return false;
    });
  }

  // On the task summary page, retrieve the values and set them.
  if( window.location.pathname == '/green/sprint-37/team-tasks/task-summary' || window.location.pathname == '/green/sprint-37/your-tasks/task-summary') {

    // Retrieve the object from storage
    var localStorageTask = localStorage.getItem('copTask');
    oCopTask = JSON.parse(localStorageTask)
    // Set the cop task vars on the page.
    $('#taskName .cop-reference-link').text(oCopTask.ref);
    $('#taskName h1').text(oCopTask.task);
    $('#category h4').text(oCopTask.type);
    $('#taskDueDate h4').text(oCopTask.due); // needs some tweaks to colour.
    $('#taskAssignee h4').text(oCopTask.assigned); // needs some tweaks to colour.
  }
});
