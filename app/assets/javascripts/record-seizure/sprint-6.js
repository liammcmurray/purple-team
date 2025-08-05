$(document).ready(function(){
  console.log('sprint 6!');

  /*
  * Click on address in results to select it.
  */
  $('.cop-address-result').click(function(e) {
    // Get the value of the clicked element.
    let _address = $(this).text();
    // Set the value of the selected element in the hidden form element.
    $('#cop-selected-address-result').val(_address);
    // Trigger form submit to go to the next page.
    $('#cop-form').trigger('submit');
    e.preventDefault();
    return false;
  });

})
