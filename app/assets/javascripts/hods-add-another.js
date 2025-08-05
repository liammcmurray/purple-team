/*
*
* Add another
* - Made using classes, so that multiple instances can be used on a page.
*
*
*/

// Example markup
/*
<style>
	.cop-add-another {
		position: relative;
	}
	.cop-add-another--remove {
		display: none;
		position: absolute;
		top: 0;
		right: 0;
	}
</style>
<div class="govuk-form-group cop-add-another--container">

	<div class="govuk-form-group" style="display: none;">
		<h3 class="govuk-label-wrapper">
			<label class="govuk-label govuk-label--l" for="add-another-total-items">
				Hidden form element for total number of add another items
			</label>
		</h3>
		<input class="govuk-input" id="add-another-total-items" name="add-another-total-items" type="text">
	</div>

	<div id="copAddAnother" class="govuk-form-group cop-add-another">
		<label class="govuk-label" for="concealment-method">
			Concealment method
		</label>
		<select class="govuk-select" id="concealment-method" name="concealment-method">
			<option value="select">Select an option</option>
			<option value="False side / bottom suitcase" >False side / bottom suitcase</option>
			<option value="Identity hijack">Identity hijack</option>
			<option value="Internal (stuffer)">Internal (stuffer)</option>
			<option value="Internal (swallower)">Internal (swallower)</option>
			<option value="On person - above waist">On person - above waist</option>
			<option value="On person - below waist">On person - below waist</option>
			<option value="On person - in groin area">On person - in groin area</option>
			<option value="Other">Other</option>
			<option value="Other Luggage">Other Luggage</option>
			<option value="Other / New concealment method">Other / New concealment method</option>
			<option value="Unclaimed luggage">Unclaimed luggage</option>
			<option value="Within carry-on luggage">Within carry-on luggage</option>
			<option value="Within hold luggage">Within hold luggage</option>
			<option value="Within personal effects">Within personal effects</option>
			<option value="Within shoes">Within shoes</option>
		</select>
		<a href="#" class="hods-button hods-button--secondary cop-add-another--remove">Remove</a>
	</div>

	<div class="govuk-form-group govuk-!-margin-top-5">
		<a href="#" class="hods-button hods-button--secondary cop-add-another--add" onclick="return false;">Add another concealment method</a>
	</div>

</div>
*/

addAnotherCount = 1; //always start at 1

$(document).ready(function() {

	// Check for items already entered (for returning from check answers).
	if($('#add-another-items').val() !== "") {
		displayChoices();
	}
	// Create click event for adding another.
	$('.cop-add-another--add').click(function(e) {
		addAnother();
    e.preventDefault();
    return false;
  });
	// Create click event for removing items.
	$('.cop-add-another--remove').click(function(e) {
		removeAddAnother();
		e.preventDefault();
		return false;
	});
	// Create submit form event for updating hidden field to hold values.
	$('#eab-constructed-method').submit(function(e){
		let _items = [];
		// Loop through all items and get the values of the select.
		$('.cop-add-another').each(function(i, obj) {
			_items.push($(this).find('select').val());
		});
		// Add all selected items to the hidden field for submitting in the form.
		$('#add-another-items').val(_items);
	});

});

function addAnother() {
	// Clone the original object and insert it straight after.
	$('#copAddAnother')
		.clone()
		.attr('id', 'copAddAnother_'+addAnotherCount )
		.insertAfter('.cop-add-another:last');
	// Set the title for the new attributes.
	let attrString = 'concealment-method-'+addAnotherCount;
	// Update attributes.
	$('#copAddAnother_'+addAnotherCount+' label').attr('for',attrString);
	$('#copAddAnother_'+addAnotherCount+' select').attr({'id': attrString, 'name': attrString});
	// Add remove event.
	$('#copAddAnother_'+addAnotherCount+' .cop-add-another--remove').click(function(e) {
		$(this).parent().remove();
	}
	);
	// Show delete buttons the first time only.
	if(addAnotherCount == 1) {
		$('.cop-add-another--remove').show();
	}
	// Increment the count for the next one.
	addAnotherCount++;
}

function displayChoices() {
	// Put all the previously selected items in an array.
	let _items = $('#add-another-items').val().split(',');
	// Set the value of the first one in the existing markup.
	$('#copAddAnother select').val(_items[0]);
	// Loop through and create the markup for the other items.
	let i = 1;
	for(i;i<_items.length;i++) {
		addAnother();
		$('#copAddAnother_'+i+' select').val(_items[i]);
	}
}
