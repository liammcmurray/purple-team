/* global $ */

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here
})

window.MOJFrontend.initAll()


/* Table multiselect */
// Select all checkbox change
$(".jsCheckboxAll").change(function() {
	// Change all ".jsCheckbox" checked status
	$(".jsCheckbox").prop("checked", $(this).prop("checked"));

	// Toggle checked class on other checkboxes
	if($(this).prop("checked")) {
	  $(".jsCheckbox").parents("tr").addClass("checked");
	} else {
	  $(".jsCheckbox").parents("tr").removeClass("checked");
	}
  });

  //".jsCheckbox" change
  $(".jsCheckbox").change(function(){
	$(this).parents("tr").toggleClass("checked");

	//uncheck "select all", if one of the listed checkbox item is unchecked
	if(false == $(this).prop("checked")){
	  //change "select all" checked status to false
	  $(".jsCheckboxAll").prop("checked", false);
	}

	//check "select all" if all checkbox items are checked
	if ($(".jsCheckbox:checked").length == $(".jsCheckbox").length ){
	  $(".jsCheckboxAll").prop("checked", true);
	}
  });

  //Select entire table row
  $(".table-clickable tbody tr").click(function(e) {
	if (e.target.type == "checkbox") {
	  // stop the bubbling to prevent firing the rows click event
	  e.stopPropagation();
	} else {
	  // Click the
	  if ($(this).hasClass("checked")) {
		$(this).find("input").click();
		$(this).removeClass("checked");
	  } else {
		$(this).find("input").click();
		$(this).addClass("checked");
	  }
	}
  });

/* Enable 'function buttons' if any of the checkboxes are selected */
$(".jsCheckbox, .jsCheckboxAll").change(function(){
	$("#captureTarget, #viewDetails, #reallocateTarget, #deleteTarget, #cancelTarget").toggleClass('govuk-button--disabled');
});


/* For sidebar navigation on Help page from Sprint35 */
$('ul.tab__nav li a').click(function() {
	var target = '#' + $(this).data('target');
	$('ul.tab__nav li a').removeClass('active');
	$(this).addClass('active');
	$('.tab__content')
		.not(target)
		.addClass('js-hidden');
	$(target).removeClass('js-hidden');
});

// Sub Navigation - https://design.homeoffice.gov.uk/components/navigation
$('.navbar__list-items a').click(function(e) {
	e.preventDefault();
	var target = $(this);
	target
		.parents('.navbar')
		.find('.active')
		.removeClass('active');
	target.parents('li').addClass('active');
	target
		.parents()
		.find('h1:first')
		.text($(this).text());
});

// Show / hide group results based on radio button selection
function displayRadioValue() {
	var x = document.getElementsByName('filter-subscribed-list');
	var a = document.getElementById('state-subscribed--yes');
	var b = document.getElementById('state-subscribed--no');
	var c = document.getElementById('state-subscribed--either');

	// Stop page reloading on form submit
	var form = document.getElementById('filterGroupsForm');
	function handleForm(event) {
		event.preventDefault();
	}
	form.addEventListener('submit', handleForm);

	// Show / hide results based on radio button selection - refine function at a later date
	for (i = 0; i < x.length; i++) {
		if (x[0].checked) {
			console.log('Yes');
			a.style.display = 'block';
			b.style.display = 'none';
			c.style.display = 'none';
		} else if (x[1].checked) {
			console.log('No');
			a.style.display = 'none';
			b.style.display = 'block';
			c.style.display = 'none';
		} else {
			console.log('Either');
			a.style.display = 'none';
			b.style.display = 'none';
			c.style.display = 'block';
		}
	}

	/* Typeahead for Groups dropdowns */
	var substringMatcher = function(strs) {
		return function findMatches(q, cb) {
			var matches, substringRegex;

			// an array that will be populated with substring matches
			matches = [];

			// regex used to determine if a string contains the substring `q`
			substrRegex = new RegExp(q, 'i');

			// iterate through the pool of strings and for any string that
			// contains the substring `q`, add it to the `matches` array
			$.each(strs, function(i, str) {
				if (substrRegex.test(str)) {
					matches.push(str);
				}
			});

			cb(matches);
		};
	};

	var groups = [
		'Aberdeen Airport Authorisers',
		'Aberdeen Airport General',
		'Aberdeen Port Authorisers',
		'Aberdeen Port General',
		'Air Cargo, Containers & Fast Parcels Targeting',
		'Amsterdam Authorisers',
		'Amsterdam General',
		'Ardveenish Authorisers',
		'Ardveenish General',
		'Armadale Isle of Skye Authorisers',
		'Armadale Isle of Skye General',
		'Avonmouth Authorisers',
		'Avonmouth General',
		'Belfast Harbour Authorisers',
		'Belfast Harbour General',
		'Belfast International Airport Authorisers',
		'Belfast International Airport General',
		'Beta_User',
		'BF International',
		'BF SAMS',
		'BFI National Security Team',
		'BFID Analysis & Reporting',
		'BFID CCU',
		'BFID Collection',
		'BFID Development',
		'BFID Excise and Cash Team',
		'BFID Intelligence Operations',
		'Biggin Hill Authorisers',
		'Biggin Hill General',
		'Birmingham Airport Authorisers',
		'Birmingham Airport General',
		'Border Force',
		'Border Force Intelligence',
		'Border Force Intelligence & Analysis Management Team',
		'Border Force Intelligence Central',
		'Border Force Intelligence Directorate Management Team',
		'Border Force Intelligence Heathrow',
		'Border Force Intelligence North',
		'Border Force Intelligence South',
		'Border Force Intelligence South East and Europe',
		'Border Force International Targeting & Engagement Management',
		'Border Force National Intelligence Hub (BFNIH)',
		'Bournemouth Airport',
		'Bristol Airport Authorisers',
		'Bristol Airport General',
		'Brussels Authorisers',
		'Brussels General',
		'Calais Authorisers',
		'Calais General',
		'Capabilities and Resources',
		'Cardiff International Airport Authorisers',
		'Cardiff International Airport General',
		'Cheriton Eurotunnel Authorisers',
		'Cheriton Eurotunnel General',
		'Communication Directorate',
		'Container Targeting',
		'COP_Admin_Approver',
		'COP_Admins',
		'Coquelles Authorisers',
		'Coquelles General',
		'Coventry Airport Authorisers',
		'Coventry Airport General',
		'Coventry International Parcel Hub Authorisers',
		'Coventry International Parcel Hub General',
		'Crime, Policing and Fire Group',
		'Digital, Data and Technology',
		'Disclosure and Barring Service',
		'Doncaster Sheffield Airport Authorisers',
		'Doncaster Sheffield Airport General',
		'Dundee Authorisers',
		'Dundee General',
		'Dunkerque Authorisers',
		'Dunkerque General',
		'East Midlands Airport Authorisers',
		'East Midlands Airport General',
		'Edinburgh Airport Authorisers',
		'Edinburgh Airport General',
		'Europe Directorate',
		'Exeter International Airport Authorisers',
		'Exeter International Airport General',
		'Farnborough Airport Authorisers',
		'Farnborough Airport General',
		'Fast Parcels Targeting Hub',
		'Felixstowe Authorisers',
		'Felixstowe General',
		'Fliexstowe Container Targeting',
		'Freight Clearance Centre, Dover',
		'Gare du Nord Authorisers',
		'Gare du Nord General',
		'Gartcosh Authorisers',
		'Gartcosh General',
		'Gatwick Airport Authorisers',
		'Gatwick Airport General',
		'General Aviation Information Bureau ',
		'General Aviation Targeting',
		'Glasgow International Airport Authorisers',
		'Glasgow International Airport General',
		'Glasgow Prestwick Airport Authorisers',
		'Glasgow Prestwick Airport General',
		'Harwich Authorisers',
		'Harwich General',
		'Heathrow Airport Authorisers',
		'Heathrow Airport General',
		'Heathrow Worldwide Distribution Centre Authorisers',
		'Heathrow Worldwide Distribution Centre General',
		'Her Majestys Passport Office',
		'Holyhead Authorisers',
		'Holyhead General',
		'Home Office Legal Advisers',
		'Home Office Science',
		'HOSecurity',
		'HOSecurity_Approver',
		'Hull Authorisers',
		'Hull General',
		'Immigration Enforcement',
		'Immingham Authorisers',
		'Immingham General',
		'Inland Pre-clearance Site – Ashford Truckstop Authorisers',
		'Inland Pre-clearance Site – Ashford Truckstop General',
		'Inland Pre-clearance Site – Cobham Authorisers',
		'Inland Pre-clearance Site – Cobham General',
		'Inland Pre-clearance Site – Ebbsfleet Authorisers',
		'Inland Pre-clearance Site – Ebbsfleet General',
		'Inland Pre-clearance Site – Folkestone Services Authorisers',
		'Inland Pre-clearance Site – Folkestone Services General',
		'Inland Pre-clearance Site – Hayes Authorisers',
		'Inland Pre-clearance Site – Hayes General',
		'Inland Pre-clearance Site – Kent International Authorisers',
		'Inland Pre-clearance Site – Kent International General',
		'Inland Pre-clearance Site – Milton Keynes Authorisers',
		'Inland Pre-clearance Site – Milton Keynes General',
		'Inland Pre-clearance Site – North Weald Authorisers',
		'Inland Pre-clearance Site – North Weald General',
		'IntegrityLead_BorderReadiness ',
		'IntegrityLead_BorderSystems ',
		'IntegrityLead_Central ',
		'IntegrityLead_ChiefOperatingOfficer',
		'IntegrityLead_DirectorGeneralsOffice ',
		'IntegrityLead_Heathrow ',
		'IntegrityLead_Intelligence ',
		'IntegrityLead_Logistics ',
		'IntegrityLead_NationalOperations ',
		'IntegrityLead_North ',
		'IntegrityLead_OperationalAssurance ',
		'IntegrityLead_SCP',
		'IntegrityLead_SEE',
		'IntegrityLead_South ',
		'Intel_MAH_FastParcels',
		'Intel_MAH_FastParcels_Command',
		'Intel_National_Hub',
		'Intel_National_Hub_Approver',
		'Intel_National_Hub_Command',
		'International Directorate',
		'Inverness Airport Authorisers',
		'Inverness Airport General',
		'Leeds Bradford Airport Authorisers',
		'Leeds Bradford Airport General',
		'Lille Authorisers',
		'Lille General',
		'Liverpool John Lennon Airport Authorisers',
		'Liverpool John Lennon Airport General',
		'Liverpool Port Authorisers',
		'Liverpool Port General',
		'London City Airport Authorisers',
		'London City Airport General',
		'London Gateway Authorisers',
		'London Gateway General',
		'London Luton Airport Authorisers',
		'London Luton Airport General',
		'Manchester Airport Authorisers',
		'Manchester Airport General',
		'Maritime Information Bureau',
		'Maritime Targeting',
		'Multi-Agency Hub, Causeway',
		'Multi-Agency Hub, Causeway Externals',
		'Multi-Agency Hub, Containers',
		'Multi-Agency Hub, Containers Externals',
		'Multi-Agency Hub, Fast Parcels',
		'Multi-Agency Hub, Fast Parcels Externals',
		'Multi-Agency Hub, Gateway',
		'Multi-Agency Hub, Gateway Externals',
		'Multi-Agency Hub, Gatwick',
		'Multi-Agency Hub, Gatwick Externals',
		'Multi-Agency Hub, Heathrow',
		'Multi-Agency Hub, Heathrow Externals',
		'National Airfreight Targeting ‚ Insider Threat and Multi Modal',
		'National Border Targeting Centre ‚ PICU',
		'National Border Targeting Centre Operations',
		'Natiooanl_Ops_Approver',
		'NBTC Rules Based Targeting',
		'NCC',
		'Newcastle Airport Authorisers',
		'Newcastle Airport General',
		'Newhaven Harbour Authorisers',
		'Newhaven Harbour General',
		'NMIC Commercial Vessel Targeting',
		'NMIC Container Targeting',
		'Norwich International Airport Authorisers',
		'Norwich International Airport General',
		'Office for Security and Counter-Terrorism',
		'Open Source Intelligence ',
		'OperationalAssurance _Approver',
		'Pembroke Authorisers',
		'Pembroke General',
		'Plymouth Authorisers',
		'Plymouth General',
		'Police and Public Protection Technologies',
		'Poole Authorisers',
		'Poole General',
		'Port Of Dover Authorisers',
		'Port Of Dover General',
		'Port of Tyne NSH Authorisers',
		'Port of Tyne NSH General',
		'Portsmouth Authorisers',
		'Portsmouth General',
		'PPRT',
		'PPRT_Approver',
		'Private Office Group',
		'Ramsgate Dock Authorisers',
		'Ramsgate Dock General',
		'RCCU Central',
		'RCCU LHR',
		'RCCU North',
		'RCCU SE&E',
		'RCCU South',
		'Ro-Ro Freight Accompanied Targeting, Dover',
		'Ro-Ro Freight Accompanied Targeting, Humber',
		'Ro-Ro Freight Unaccompanied Targeting, Dover',
		'Ro-Ro Tourist Targeting, Dover',
		'Rotterdam Authorisers',
		'Rotterdam General',
		'SABR Targeting',
		'Serious and Organised Crime Group',
		'South Region Container Targeting',
		'Southampton Airport Authorisers',
		'Southampton Airport General',
		'Southampton Port Authorisers',
		'Southampton Port General',
		'Southend Airport Authorisers',
		'Southend Airport General',
		'Specialist Intelligence',
		'St Pancras International Authorisers',
		'St Pancras International General',
		'Stansted Authorisers',
		'Stansted General',
		'Strategy Directorate',
		'Targeting Futures',
		'Targeting Solutions',
		'Teesport Eustace House Authorisers',
		'Teesport Eustace House General',
		'Tilbury Authorisers',
		'Tilbury General',
		'UK Visas and Immigration',
		'Watchlist Information and Control Unit Futures',
		'Watchlist Information and Control Unit Management Team',
		'Watchlist Information and Control Unit Operations',
	];

	$('#groups .typeahead').typeahead(
		{
			hint: true,
			highlight: true,
			minLength: 1,
		},
		{
			name: 'groups',
			source: substringMatcher(groups),
		}
	);
}

// Show / hide add group panel

function showAddGroupsWrapper(){
	var x = document.getElementsById('wrapper-add-groups');

}

$("#showAddGroupsWrapper").click(function(){
	$("#wrapper-your-groups").hide();
	$("#wrapper-add-groups").show();
});

$(".hideAddGroupsWrapper").click(function(){
	$("#wrapper-add-groups").hide();
	$("#wrapper-your-groups").show();
});


// Hide the button strips by default until one is selected by the user
$('.button-strip').hide();

// Catch a selected radio button within an 'actionable-items' table
$('.actionable-items input[type="radio"]').click(function(){

	let selectedRadio = $(this);
	let actionForm = selectedRadio.closest('.actionable-items');
	let buttonStrip = actionForm.children('.button-strip');
	let selectedRow = selectedRadio.closest('tr');

	// Clear any debug styles
	$('.actionable-items').css({border: "none" });
	// $('.button-strip').css({border: "none", display: "none;" });
	$('.button-strip').hide();
	// Deselect all other radios on the page
	$('.actionable-items input[type="radio"]').prop('checked', false);
	$('.actionable-items tr').css({"background-color": "transparent" });

	// Reselect the initially clicked radio
	selectedRadio.prop('checked', true);

	// Highlight the selected radio for accessibility
	selectedRow.css({"background-color": "#FFECC7" });
	buttonStrip.show();
});

// For Tag-selection demo page
$("#tag-selection--updated button").on("click", function () {
    $(this).parent().prev().find("button").focus();
    $(this).parent().remove();
    srSpeak($(this).text() + "removed");
});


/* https://a11y-guidelines.orange.com/en/web/components-examples/make-a-screen-reader-talk/
srSpeak(text, priority)
text: the message to be vocalised
priority (non mandatory): "polite" (by default) or "assertive" */

  function srSpeak(text, priority) {
    var el = document.createElement("div");
    var id = "speak-" + Date.now();
    el.setAttribute("id", id);
    el.setAttribute("aria-live", priority || "polite");
    el.classList.add("sr-only");
    document.body.appendChild(el);

    window.setTimeout(function () {
      document.getElementById(id).innerHTML = text;
    }, 100);

    window.setTimeout(function () {
      document.body.removeChild(document.getElementById(id));
    }, 1000);
  }
