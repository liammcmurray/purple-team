$(document).ready(function(){
  //
  $('.cop-delete-link').click(function(e){
    // Get the URL
    let _url = $(this).attr('href');
    // Get the parameters
    let _copRef = $(this).parent().parent().find('.cop-reference').text();
    let _formType = $(this).parent().parent().find('.cop-form-type').text();
    let _dateCreated = $(this).parent().parent().find('.cop-form-created').text();
    // Go to the URL with parameters
    window.location.href = _url+"?cop-reference="+_copRef+"&cop-form-type="+_formType+"&cop-form-created="+_dateCreated;
    e.preventDefault();
    return false;
  });

})
