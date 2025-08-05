fs = require('fs')
const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter('/housing')

// SIS - If harm is involved
router.post('/sis-harm', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisHarm = req.session.data['sis-harm']

  // Check whether the variable matches a condition
  if (sisHarm === 'harm-yes'){
    res.redirect('/housing/start/harm/previous');
  }
  if (sisHarm === 'harm-no'){
    res.redirect('/housing/start/team');
  }

})

// SIS - If harm is previously reported
router.post('/harm-previous', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisHarmprev = req.session.data['harm-previous']

  // Check whether the variable matches a condition
  if (sisHarmprev === 'already-yes'){
    res.redirect('/housing/start/harm/previous-details');
  }
  if (sisHarmprev === 'already-no'){
    res.redirect('/housing/start/harm/previous-alert');
  }

})

// SIS - Run this code when a form is submitted to 'team'
router.post('/start/sis-team', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisTeam = req.session.data['sis-team-source']

  // Check whether the variable matches a condition
  if (sisTeam === 'public'){
    // Send user to next page
    res.redirect('/housing/start/other-details');
  }
  if (sisTeam === 'myself'){
    // Send user to next page
    res.redirect('/housing/start/crime');
  }
   if (sisTeam === 'employee'){
    // Send user to next page
    res.redirect('/housing/start/employee-details');
  }
  if (sisTeam === 'gro'){
    // Send user to next page
    res.redirect('/housing/start/other-details');
  }
  if (sisTeam === 'police'){
    // Send user to next page
    res.redirect('/housing/start/other-details');
  }
  if (sisTeam === 'ports'){
    // Send user to next page
    res.redirect('/housing/start/other-details');
  }
  if (sisTeam === 'other'){
    // Send user to other page
    res.redirect('/housing/start/other-details');
  }
  if (sisTeam === 'other-org'){
    // Send user to other page
    res.redirect('/housing/start/other-details');
  }
  if (sisTeam === 'dwp'){
    // Send user to other page
    res.redirect('/housing/start/other-details');
  }
  if (sisTeam === 'hmrc'){
    // Send user to other page
    res.redirect('/housing/start/other-details');
  }
  if (sisTeam === 'dvla'){
    // Send user to other page
    res.redirect('/housing/start/other-details');
  }

})

// SIS - Other 'team'
router.post('/sis-team-other-source', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisTeamother = req.session.data['sis-team-other-source']

  // Check whether the variable matches a condition
  if (sisTeamother === 'crimestoppers'){
    // Send user to next page
    res.redirect('/housing/start/crime');
  }
  if (sisTeamother === 'ndfu'){
    // Send user to next page
    res.redirect('/housing/start/crime');
  }
  if (sisTeamother === 'ct'){
    // Send user to next page
    res.redirect('/housing/start/crime');
  }
  if (sisTeamother === 'HM Revenue & Customs (HMRC)'){
    // Send user to next page
    res.redirect('/housing/start/crime');
  }
  if (sisTeamother === 'Department for Work and Pensions (DWP)'){
    // Send user to next page
    res.redirect('/housing/start/crime');
  }
  if (sisTeamother === 'Driver and Vehicle Licensing Agency (DVLA)'){
    // Send user to next page
    res.redirect('/housing/start/crime');
  }
})

// SIS - Main offence
router.post('/sis-main-crime', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisMainoffence = req.session.data['start-crime']

  // Check whether the variable matches a condition
  if (sisMainoffence === 'housing'){
    // Send user to next page
    res.redirect('/housing/start/sub-crime');
  }
  if (sisMainoffence === 'funds'){
    // Send user to next page
    res.redirect('/housing/start/sub-crime');
  }
  if (sisMainoffence === 'facilitation'){
    // Send user to next page
    res.redirect('/housing/start/sub-crime');
  }
  if (sisMainoffence === 'conditions'){
    // Send user to next page
    res.redirect('/housing/start/sub-crime');
  }
  if (sisMainoffence === 'clandestine'){
    // Send user to next page
    res.redirect('/housing/start/sub-crime');
  }
  if (sisMainoffence === 'document-fraud'){
    // Send user to next page
    res.redirect('/housing/start/sub-crime');
  }
  if (sisMainoffence === 'illegal-working'){
    // Send user to next page
    res.redirect('/housing/start/sub-crime');
  }
  if (sisMainoffence === 'marriage'){
    // Send user to next page
    res.redirect('/housing/start/sub-crime');
  }
   if (sisMainoffence === 'smuggling'){
    // Send user to next page
    res.redirect('/housing/start/sub-crime');
  }
  if (sisMainoffence === 'slavery'){
    // Send user to next page
    res.redirect('/housing/start/harm/details');
  }
  if (sisMainoffence === 'overstayer'){
    // Send user to next page
    res.redirect('/housing/start/sub-crime');
  }
  if (sisMainoffence === 'rep-abuse'){
    // Send user to next page
    res.redirect('/housing/start/sub-crime');
  }
  if (sisMainoffence === 'terrorism'){
    // Send user to next page
    res.redirect('/housing/start/sub-crime');
  }
  if (sisMainoffence === 'other'){
    // Send user to next page
    res.redirect('/housing/start/harm/details');
  }
  if (sisMainoffence === 'idp'){
    // Send user to next page
    res.redirect('/housing/start/sub-crime');
  }
  if (sisMainoffence === 's24'){
    // Send user to next page
    res.redirect('/housing/start/sub-crime');
  }
  })

router.post('/sub-offence', function (req, res) {

  let subCrime = req.session.data['sub-offence-source'];
  let DocIDPCrime = req.session.data['start-crime']


  if (subCrime === "sub-no") {
    if (DocIDPCrime === "idp") {
      res.redirect('/housing/task/main/idp/type.html');
    } 
    else if (DocIDPCrime === "document-fraud")
    {
      res.redirect('/housing/start/idp.html');
    }
    else {
    res.redirect('/housing/start/referral-reason.html');
    }
  }
  else {
    res.redirect('/housing/start/crime2')
  }
})

// SIS - Sub offence IDP route
router.post('/sub-idp-route', function (req, res) {

  // Make a variable and give it the value from 'team'
  var DocIDPCrime = req.session.data['start-crime']
      DocIDP2 = req.session.data['sub-crime']
      

  // Check whether the variable matches a condition
  
  if (DocIDPCrime === 'idp'){
    res.redirect('/housing/task/main/idp/type.html');
  }
  else if (DocIDP2 === 'idp'){
    res.redirect('/housing/task/main/idp/type.html');
  }
  else if (DocIDPCrime === 'document-fraud' && DocIDP2 !== 'idp' ){
    res.redirect('/housing/start/idp.html');
  }
  else if (DocIDPCrime !== 'idp' && DocIDP2 === 'document-fraud'){
    res.redirect('/housing/start/idp.html');
  }
  else {
    res.redirect('/housing/start/referral-reason.html')
  }
})

// SIS - Main - public and private funds abuse
router.post('/sis-funds-abuse', function (req, res) {

  // Make a variable and give it the value
  var sisDocshelper = req.session.data['sis-funds-abuse']

  // Check whether the variable matches a condition
  if (sisDocshelper === 'Yes'){
    res.redirect('/housing/task/main/funds/reported');
  }
  if (sisDocshelper === 'No'){
    res.redirect('/housing/task/list');
  }
  if (sisDocshelper === 'I do not know'){
    res.redirect('/housing/task/list');
  }
})


// SIS person gatekeeping
router.post('/sis-person-check', function (req, res) {

  // address branching
  var sisPersonGatekeep = req.session.data['sis-person-confirmation']

  // Check whether the variable matches a condition
  if (sisPersonGatekeep === 'yes'){
    res.redirect('/housing/task/person/type');
  }
  if (sisPersonGatekeep === 'no'){
    res.redirect('/housing/task/person/list');
  }
  })

// SIS business gatekeeping
router.post('/sis-business-check', function (req, res) {

  // address branching
  var sisBusinessGatekeep = req.session.data['sis-business-confirmation']

  // Check whether the variable matches a condition
  if (sisBusinessGatekeep === 'yes'){
    res.redirect('/housing/task/business/business');
  }
  if (sisBusinessGatekeep === 'no'){
    res.redirect('/housing/task/business/list');
  }
  })


// SIS - person1 address - GENERAL
router.post('/sis-person1-address', function (req, res) {

  // address branching
  var sisAddress = req.session.data['sis-person1-address-known']

  // Check whether the variable matches a condition
  if (sisAddress === 'Yes'){
    res.redirect('/housing/task/person/address');
  }
  if (sisAddress === 'No'){
    res.redirect('/housing/task/person/list');
  }
  })

// SIS - person1 address - VISA
router.post('/person-visa-check', function (req, res) {

  // address branching
  var sisPersonVisa = req.session.data['sis-housing-person']

  // Check whether the variable matches a condition
  if (sisPersonVisa === 'Tenant or lodger living in the accommodation'){
    res.redirect('/housing/task/person/visa');
  } else {
    res.redirect('/housing/task/person/contact');
  }
  })

// SIS - person2 address - GENERAL
router.post('/sis-person2-address', function (req, res) {

  // address branching
  var sisAddress2 = req.session.data['sis-person2-address-known']

  // Check whether the variable matches a condition
  if (sisAddress2 === 'Yes'){
    res.redirect('/housing/task/person/address2');
  }
  if (sisAddress2 === 'No'){
    res.redirect('/housing/task/person/list');
  }
  })

// SIS - person2 address - VISA
router.post('/person-visa-check2', function (req, res) {

  // address branching
  var sisPerson2Visa = req.session.data['sis-housing-person2']

  // Check whether the variable matches a condition
  if (sisPerson2Visa === 'Tenant or lodger living in the accommodation'){
    res.redirect('/housing/task/person/visa2');
  } else {
    res.redirect('/housing/task/person/contact2');
  }
  })

// SIS - person3 address - GENERAL
router.post('/sis-person3-address', function (req, res) {

  // address branching
  var sisAddress3 = req.session.data['sis-person3-address-known']

  // Check whether the variable matches a condition
  if (sisAddress3 === 'Yes'){
    res.redirect('/housing/task/person/address3');
  }
  if (sisAddress3 === 'No'){
    res.redirect('/housing/task/person/list');
  }
  })

// SIS - person3 address - VISA
router.post('/person-visa-check3', function (req, res) {

  // address branching
  var sisPerson3Visa = req.session.data['sis-housing-person3']

  // Check whether the variable matches a condition
  if (sisPerson3Visa === 'Tenant or lodger living in the accommodation'){
    res.redirect('/housing/task/person/visa3');
  } else {
    res.redirect('/housing/task/person/contact3');
  }
  })

// SIS - Housing - permission - multiple people
router.post('/housing-tenant-permission', function (req, res) {

  // Make a variable and give it the value
  var Housing2 = req.session.data['sis-housing-person2']

  // Check whether the variable matches a condition
  if (Housing2 === 'Tenant or lodger living in the accommodation'){
    res.redirect('/housing/task/main/housing/visa-type2');
  } else {
    res.redirect('/housing/task/list');
  }

})

// SIS - Location link
router.post('/sis-housing-location', function (request, response) {

  var sisHousinglocation = request.session.data['sis-housing-location-link']
  if (sisHousinglocation == null){
    response.redirect("/housing/task/main/housing/details");
  }

  else if (sisHousinglocation.includes("somewhere-else")){
    response.redirect("/housing/task/main/housing/address");
  } else {
    response.redirect("/housing/task/main/housing/details")
  }
})


