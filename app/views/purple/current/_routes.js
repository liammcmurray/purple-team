fs = require('fs')
const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter('/purple/current')

///////////////////////////////////////////////////////////////////////////////////////
// IMAGE UPLOAD
////////////////////////////////////////////////////////////////////////////////////////
const multer = require('multer');
const cache = {
   get: ( key ) => cache[ key ],
   set: ( key, value ) => {
      cache[ key ] = value
   },
   delete: ( key ) => delete cache[ key ],
};

function getErrorMessage(item) {
  var message = '';
  if(item.error.code == 'FILE_TYPE') {
    message += item.file.originalname + ' must be a png or gif';
  } else if(item.error.code == 'LIMIT_FILE_SIZE') {
    message += item.file.originalname + ' must be smaller than 2mb';
  }
  return message;
}

function removeFileFromFileList(fileList, filename) {

  const index = fileList.findIndex( (item ) => item.filename === filename );
  if( index >= 0 ){
    fileList.splice( index, 1 );
  }
}

function getUploadedFiles( req, res, next ){

  if( !req.session.uploadId ){
    req.session.uploadId = req.sessionID;
  }

  let files = cache.get( req.session.uploadId );

  if( !files ){
    files = [];
    cache.set( req.session.uploadId, files );
  }

  req.uploadedFiles = files;
  next();
}

////////////////////////////////////////////////////////////////////////////////////////
// AJAX
////////////////////////////////////////////////////////////////////////////////////////

const uploadAjax = multer( {
  dest: './.tmp/public/uploads',
  limits: { fileSize: 10000000 },
  fileFilter: function( req, file, cb ) {
    let ok = false;
    if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf', 'image/png', 'image/gif', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
      return cb({
        code: 'FILE_TYPE',
        field: 'documents',
        file: file
      }, false);
    } else {
      return cb(null, true);
    }
  }
} ).single('documents');

router.post('/template-form/ajax-upload', getUploadedFiles, function( req, res ){

  const name = req.query.name

  console.log('ajax-upload')
  if (!fs.existsSync('./.tmp/public/uploads')) {
    fs.mkdirSync('./.tmp/public/uploads');
  }

  uploadAjax(req, res, function(error, val1, val2) {

    if(error) {
      if(error.code == 'FILE_TYPE') {
        error.message = error.file.originalname + ' must be a png, gif, jpg, jpeg, pdf, doc, docx, xls or xlsx';
      } else if(error.code == 'LIMIT_FILE_SIZE') {
        // error.message = error.file.originalname + ' must be smaller than 6mb';
        error.message = 'The file must be smaller than 10MB';
      }

      var response = {
        error: error,
        file: error.file || { filename: 'filename', originalname: 'originalname' }
      };

      res.json(response);
    } else {

      req.uploadedFiles.push(req.file);
      req.file.name = req.file.originalname
      req.file.type = req.file.mimetype
      req.session.data[name] = req.uploadedFiles;

      fs.renameSync(req.file.path, `${req.file.destination}/${req.file.originalname}`)

      var messageHtml = `<a href="/./public/uploads/${req.file.originalname}" class="govuk-link"> ${req.file.originalname}</a> has been uploaded`;

      if (['image/png', 'image/gif', 'image/jpg', 'image/jpeg'].includes(req.file.mimetype)) {
        messageHtml = messageHtml + `<img src="/public/uploads/${req.file.originalname}" class="moj-multi-file-upload__image-preview" alt="">`;
      }

      res.json({
        file: req.file,
        success: {
          messageHtml:  messageHtml,
          messageText: `${req.file.originalname} has been uploaded`
        }
      });
    }
  } );
} );

router.post('/template-form/ajax-delete', getUploadedFiles, function( req, res ){
  var indexToDelete = -1
  const name = req.query.name
  for (let photoIndex = 0; photoIndex < req.session.data[name].length; photoIndex++) {
    if (req.session.data[name][photoIndex].name == req.body.delete) {
      indexToDelete = photoIndex
    }
  }
  req.session.data[name].splice(indexToDelete, 1)
  removeFileFromFileList(req.uploadedFiles, req.body.delete);
  res.json({});
});

router.post('/template-form/set-photos', function(req, res) {
  if (req.session.data['photo-uploads']) {
    req.session.data['photo-uploads'] = req.session.data['photo-uploads'].concat(req.session.data.files)
  } else {
    req.session.data['photo-uploads'] = req.session.data.files
  }
  res.json({})
})



//////branching/////////


// SIS - Run this code when a form is submitted to 'team'
router.post('/start/sis-team', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisTeam = req.session.data['sis-team-source']

  // Check whether the variable matches a condition
  if (sisTeam === 'public'){
    // Send user to next page
    res.redirect('/purple/current/start/other-details');
  }
  if (sisTeam === 'myself'){
    // Send user to next page
    res.redirect('/purple/current/start/crime');
  }
   if (sisTeam === 'employee'){
    // Send user to next page
    res.redirect('/purple/current/start/employee-details');
  }
  if (sisTeam === 'gro'){
    // Send user to next page
    res.redirect('/purple/current/start/other-details');
  }
  if (sisTeam === 'police'){
    // Send user to next page
    res.redirect('/purple/current/start/other-details');
  }
  if (sisTeam === 'ports'){
    // Send user to next page
    res.redirect('/purple/current/start/other-details');
  }
  if (sisTeam === 'other'){
    // Send user to other page
    res.redirect('/purple/current/start/other-details');
  }
  if (sisTeam === 'other-org'){
    // Send user to other page
    res.redirect('/purple/current/start/other-details');
  }
  if (sisTeam === 'dwp'){
    // Send user to other page
    res.redirect('/purple/current/start/other-details');
  }
  if (sisTeam === 'hmrc'){
    // Send user to other page
    res.redirect('/purple/current/start/other-details');
  }
  if (sisTeam === 'dvla'){
    // Send user to other page
    res.redirect('/purple/current/start/other-details');
  }

})

// SIS - Other 'team'
router.post('/sis-team-other-source', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisTeamother = req.session.data['sis-team-other-source']

  // Check whether the variable matches a condition
  if (sisTeamother === 'crimestoppers'){
    // Send user to next page
    res.redirect('/purple/current/start/crime');
  }
  if (sisTeamother === 'ndfu'){
    // Send user to next page
    res.redirect('/purple/current/start/crime');
  }
  if (sisTeamother === 'ct'){
    // Send user to next page
    res.redirect('/purple/current/start/crime');
  }
  if (sisTeamother === 'HM Revenue & Customs (HMRC)'){
    // Send user to next page
    res.redirect('/purple/current/start/crime');
  }
  if (sisTeamother === 'Department for Work and Pensions (DWP)'){
    // Send user to next page
    res.redirect('/purple/current/start/crime');
  }
  if (sisTeamother === 'Driver and Vehicle Licensing Agency (DVLA)'){
    // Send user to next page
    res.redirect('/purple/current/start/crime');
  }
})

// SIS - Main offence
router.post('/sis-main-crime', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisMainoffence = req.session.data['start-crime']

  // Check whether the variable matches a condition
  if (sisMainoffence === 'housing'){
    // Send user to next page
    res.redirect('/purple/current/start/sub-crime');
  }
  if (sisMainoffence === 'funds'){
    // Send user to next page
    res.redirect('/purple/current/start/sub-crime');
  }
  if (sisMainoffence === 'facilitation'){
    // Send user to next page
    res.redirect('/purple/current/start/sub-crime');
  }
  if (sisMainoffence === 'conditions'){
    // Send user to next page
    res.redirect('/purple/current/start/sub-crime');
  }
  if (sisMainoffence === 'clandestine'){
    // Send user to next page
    res.redirect('/purple/current/start/sub-crime');
  }
  if (sisMainoffence === 'document-fraud'){
    // Send user to next page
    res.redirect('/purple/current/start/sub-crime');
  }
  if (sisMainoffence === 'illegal-working'){
    // Send user to next page
    res.redirect('/purple/current/start/sub-crime');
  }
  if (sisMainoffence === 'marriage'){
    // Send user to next page
    res.redirect('/purple/current/start/sub-crime');
  }
   if (sisMainoffence === 'smuggling'){
    // Send user to next page
    res.redirect('/purple/current/start/sub-crime');
  }
  if (sisMainoffence === 'slavery'){
    // Send user to next page
    res.redirect('/purple/current/start/harm/details');
  }
  if (sisMainoffence === 'overstayer'){
    // Send user to next page
    res.redirect('/purple/current/start/sub-crime');
  }
  if (sisMainoffence === 'rep-abuse'){
    // Send user to next page
    res.redirect('/purple/current/start/sub-crime');
  }
  if (sisMainoffence === 'terrorism'){
    // Send user to next page
    res.redirect('/purple/current/start/sub-crime');
  }
  if (sisMainoffence === 'other'){
    // Send user to next page
    res.redirect('/purple/current/start/harm/details');
  }
  if (sisMainoffence === 'idp'){
    // Send user to next page
    res.redirect('/purple/current/start/sub-crime');
  }
  if (sisMainoffence === 's24'){
    // Send user to next page
    res.redirect('/purple/current/start/sub-crime');
  }
  })

router.post('/sub-offence', function (req, res) {

  let subCrime = req.session.data['sub-offence-source'];
  let DocIDPCrime = req.session.data['start-crime']


  if (subCrime === "sub-no") {
    if (DocIDPCrime === "idp") {
      res.redirect('/purple/current/task/main/idp/type.html');
    } 
    else if (DocIDPCrime === "document-fraud")
    {
      res.redirect('/purple/current/start/idp.html');
    }
    else {
    res.redirect('/purple/current/start/referral-reason.html');
    }
  }
  else {
    res.redirect('/purple/current/start/crime2')
  }
})

// SIS - Sub offence IDP route
router.post('/sub-idp-route', function (req, res) {

  // Make a variable and give it the value from 'team'
  var DocIDPCrime = req.session.data['start-crime']
      DocIDP2 = req.session.data['sub-crime']
      

  // Check whether the variable matches a condition
  
  if (DocIDPCrime === 'idp'){
    res.redirect('/purple/current/task/main/idp/type.html');
  }
  else if (DocIDP2 === 'idp'){
    res.redirect('/purple/current/task/main/idp/type.html');
  }
  else if (DocIDPCrime === 'document-fraud' && DocIDP2 !== 'idp' ){
    res.redirect('/purple/current/start/idp.html');
  }
  else if (DocIDPCrime !== 'idp' && DocIDP2 === 'document-fraud'){
    res.redirect('/purple/current/start/idp.html');
  }
  else {
    res.redirect('/purple/current/start/referral-reason.html')
  }
})


router.post('/item-details/add-more-items-route', function (req, res) {

  let selection = req.session.data['add-more-items'];
  let selection2 = req.session.data['add-how'];


  if (selection === "Yes") {
    if (selection2 === "duplicate") {
      req.session.data.items["item2"] = req.session.data.items["item"];
      res.redirect('/item-seizure/common/current/item-details/item2/item-type-dup');
    } else {
      res.redirect('/item-seizure/common/current/item-details/item2/item-type-da');
    }
  } else {
    res.redirect('/item-seizure/common/current/item-details/check-answers-item-photos');
  }
})

// SIS - Doc fraud - IDP involved
router.post('/idp-involved', function (req, res) {

  // Make a variable and give it the value from 'team'
  var IDPinvolved = req.session.data['idp-involved']

  // Check whether the variable matches a condition
  if (IDPinvolved === 'Yes'){
    res.redirect('/purple/current/task/main/idp/type.html');
  }
  if (IDPinvolved === 'No'){
    res.redirect('/purple/current/start/harm/details.html');
  }

})

// SIS - If harm is involved
router.post('/sis-harm', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisHarm = req.session.data['sis-harm']

  // Check whether the variable matches a condition
  if (sisHarm === 'harm-yes'){
    res.redirect('/purple/current/start/harm/previous');
  }
  if (sisHarm === 'harm-no'){
    res.redirect('/purple/current/task/list');
  }

})


// SIS - If harm is previously reported
router.post('/harm-previous', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisHarmprev = req.session.data['harm-previous']

  // Check whether the variable matches a condition
  if (sisHarmprev === 'already-yes'){
    res.redirect('/purple/current/start/harm/previous-details');
  }
  if (sisHarmprev === 'already-no'){
    res.redirect('/purple/current/task/list');
  }

})

// SIS - If person is suspect in document fraud'
router.post('/doc-suspect', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisDocsuspect = req.session.data['sis-doc-suspect']

  // Check whether the variable matches a condition
  if (sisDocsuspect === 'Suspect or offender'){
    res.redirect('/purple/current/task/person/docs/type-next');
  }
  if (sisDocsuspect === 'Helper'){
    res.redirect('/purple/current/task/person/docs/details3');
  }
  if (sisDocsuspect === 'Other'){
    res.redirect('/purple/current/task/person/docs/details3');
  }

})


// SIS - Person 1 role in Modern Slavery and Human Trafficking'
router.post('/sis-slavery-role', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisSlavery = req.session.data['sis-slavery-role']

  // Check whether the variable matches a condition
  if (sisSlavery === 'Potential or recognised victim of modern slavery and human traficking'){
    res.redirect('/purple/current/task/person/slavery/details');
  }
  if (sisSlavery === 'Trafficker'){
    res.redirect('/purple/current/task/person/slavery/details');
  }
  if (sisSlavery === 'First responder'){
    res.redirect('/purple/current/task/person/slavery/responder');
  }
  if (sisSlavery === 'Other'){
    res.redirect('/purple/current/task/person/slavery/details');
  }

})

// SIS - Person 2 role in Modern Slavery and Human Trafficking'
router.post('/sis-slavery-role2', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisSlavery2 = req.session.data['sis-slavery-role2']

  // Check whether the variable matches a condition
  if (sisSlavery2 === 'Potential or recognised victim of modern slavery and human traficking'){
    res.redirect('/purple/current/task/person/slavery/details2');
  }
  if (sisSlavery2 === 'Trafficker'){
    res.redirect('/purple/current/task/person/slavery/details2');
  }
  if (sisSlavery2 === 'First responder'){
    res.redirect('/purple/current/task/person/slavery/responder2');
  }

})

// SIS - Person 3 role in Modern Slavery and Human Trafficking'
router.post('/sis-slavery-role3', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisSlavery3 = req.session.data['sis-slavery-role3']

  // Check whether the variable matches a condition
  if (sisSlavery3 === 'Potential or recognised victim of modern slavery and human traficking'){
    res.redirect('/purple/current/task/person/slavery/details3');
  }
  if (sisSlavery3 === 'Trafficker'){
    res.redirect('/purple/current/task/person/slavery/details3');
  }
  if (sisSlavery3 === 'First responder'){
    res.redirect('/purple/current/task/person/slavery/responder3');
  }

})

// SIS - Responder branching person 1
router.post('/sis-responder', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisResponder = req.session.data['sis-responder']

  // Check whether the variable matches a condition
  if (sisResponder === 'sis-responder-name'){
    res.redirect('/purple/current/task/person/slavery/list');
  }
  if (sisResponder === 'responder-someone-else'){
    res.redirect('/purple/current/task/person/slavery/details');
  }
})

// SIS - Responder branching person 2
router.post('/sis-responder2', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisResponder2 = req.session.data['sis-responder2']

  // Check whether the variable matches a condition
  if (sisResponder2 === 'sis-responder-name2'){
    res.redirect('/purple/current/task/person/slavery/list');
  }
  if (sisResponder2 === 'responder-someone-else2'){
    res.redirect('/purple/current/task/person/slavery/details2');
  }
})

// SIS - Responder branching person 3
router.post('/sis-responder3', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisResponder3 = req.session.data['sis-responder3']

  // Check whether the variable matches a condition
  if (sisResponder3 === 'sis-responder-name3'){
    res.redirect('/purple/current/task/person/slavery/list');
  }
  if (sisResponder3 === 'responder-someone-else3'){
    res.redirect('/purple/current/task/person/slavery/details3');
  }
})


// SIS - Person 2 role in Modern Slavery and Human Trafficking'
router.post('/sis-slavery-location', function (request, response) {

  var sisSlaverylocation = request.session.data['sis-slavery-location']
  if (sisSlaverylocation.includes("somewhere-else")){
    response.redirect("/purple/current/task/main/slavery/address");
  } else {
    response.redirect("/purple/current/task/main/slavery/list")
  }
})

// SIS - Location link
router.post('/sis-housing-location', function (request, response) {

  var sisHousinglocation = request.session.data['sis-housing-location-link']
  if (sisHousinglocation.includes("somewhere-else")){
    response.redirect("/purple/current/task/main/housing/address");
  } else {
    response.redirect("/purple/current/task/main/housing/details")
  }
})

// SIS - Location link for 'Breach' main
router.post('/sis-breach-location', function(request, response) {

  var exports = request.session.data['sis-breach-location-link']
  if (exports.includes("sis-breach-biz-address3")){
      response.redirect("/purple/current/task/main/breach/type")
  } else {
      response.redirect("/purple/current/task/main/breach/list")
  }
})

// SIS - Location link for 'Breach' main 2
router.post('/sis-breach-location2', function(request, response) {

  var exports = request.session.data['sis-breach-location-link2']
  if (exports === 'sis-breach-biz-address3'){
      response.redirect("/purple/current/task/main/breach/type2")
  } else {
      response.redirect("/purple/current/task/main/breach/list")
  }
})

// SIS - Run this code when a form is submitted to 'location'
router.post('/sis-location', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisLocation = req.session.data['sis-location']

  // Check whether the variable matches a condition
  if (sisLocation === 'address1'){
    res.redirect('/purple/current/task/location/list');
  }
  if (sisLocation === 'address2'){
    res.redirect('/purple/current/task/location/list');
  }
  if (sisLocation === 'address3'){
    res.redirect('/purple/current/task/location/details');
  }

})

// SIS - Location link for 'Working' main
router.post('/sis-working-location', function(request, response) {

  var exports = request.session.data['sis-working-location-link']
  if (exports.includes("sis-working-address3")){
      response.redirect("/purple/current/task/main/working/address")
  } else {
      response.redirect("/purple/current/task/main/working/list")
  }
})
// SIS - Location link for 'Other' main
router.post('/sis-offence-location', function(request, response) {

  var exports = request.session.data['sis-other-location-link']
  if (exports.includes("sis-other-address3")){
      response.redirect("/purple/current/task/main/other/address")
  } else {
      response.redirect("/purple/current/task/main/other/list")
  }
})

// SIS - Location link for 'terrorism' main
router.post('/sis-terrorism-location', function(request, response) {

  var exports = request.session.data['sis-terrorism-location-link']
  if (exports.includes("sis-terrorism-address3")){
      response.redirect("/purple/current/task/main/terrorism/address")
  } else {
      response.redirect("/purple/current/task/main/terrorism/list")
  }
})
// SIS - Location link for 'Breach' main
router.post('/sis-breach-location', function(request, response) {

  var exports = request.session.data['sis-breach-location-link']
  if (exports.includes("sis-breach-biz-address3")){
      response.redirect("/purple/current/task/main/breach/type")
  } else {
      response.redirect("/purple/current/task/main/breach/list")
  }
})
// SIS - Location link for 'Breach' main 2
router.post('/sis-breach-location2', function(request, response) {

  var exports = request.session.data['sis-breach-location-link2']
  if (exports.includes("sis-breach-biz-address3")){
      response.redirect("/purple/current/task/main/breach/type2")
  } else {
      response.redirect("/purple/current/task/main/breach/list")
  }
})

// SIS - Location link for 'Illegal working' main
router.post('/sis-working-location', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisWorkinglocation = req.session.data['sis-working-location-link']

  // Check whether the variable matches a condition
  if (sisWorkinglocation === 'sis-working-address1'){
    res.redirect('/purple/current/task/main/working/list');
  }
  if (sisWorkinglocation === 'sis-working-address2'){
    res.redirect('/purple/current/task/main/working/list');
  }
  if (sisWorkinglocation === 'sis-working-address3'){
    res.redirect('/purple/current/task/main/working/type');
  }

})

// SIS - Location link for 'terrorism' main
router.post('/sis-terrorism-location', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisTerrorismlocation = req.session.data['sis-terrorism-location-link']

  // Check whether the variable matches a condition
  if (sisTerrorismlocation === 'sis-terrorism-address1'){
    res.redirect('/purple/current/task/main/terrorism/list');
  }
  if (sisTerrorismlocation === 'sis-terrorism-address2'){
    res.redirect('/purple/current/task/main/terrorism/list');
  }
  if (sisTerrorismlocation === 'sis-terrorism-address3'){
    res.redirect('/purple/current/task/main/terrorism/type');
  }

})

// SIS - person1 address - GENERAL
router.post('/sis-person1-address', function (req, res) {

  // address branching
  var sisAddress = req.session.data['sis-person1-address-known']

  // Check whether the variable matches a condition
  if (sisAddress === 'Yes'){
    res.redirect('/purple/current/task/person/address');
  }
  if (sisAddress === 'No'){
    res.redirect('/purple/current/task/person/list');
  }
  })

  // SIS - person3 address - GENERAL
router.post('/sis-person3-address', function (req, res) {

  // address branching
  var sisAddress3 = req.session.data['sis-person3-address-known']

  // Check whether the variable matches a condition
  if (sisAddress3 === 'Yes'){
    res.redirect('/purple/current/task/person/address3');
  }
  if (sisAddress3 === 'No'){
    res.redirect('/purple/current/task/person/list');
  }
  })

  // SIS - S24 person1 address - GENERAL
router.post('/sis-person1-address-s24', function (req, res) {

  // address branching
  var sisAddress = req.session.data['sis-person1-address-known']

  // Check whether the variable matches a condition
  if (sisAddress === 'Yes'){
    res.redirect('/purple/current/task/person/address');
  }
  if (sisAddress === 'No'){
    res.redirect('/purple/current/task/person/s24/type');
  }
  })

    // SIS - S24 person3 address - GENERAL
router.post('/sis-person3-address-s24', function (req, res) {

  // address branching
  var sisAddress3 = req.session.data['sis-person3-address-known']

  // Check whether the variable matches a condition
  if (sisAddress3 === 'Yes'){
    res.redirect('/purple/current/task/person/address3');
  }
  if (sisAddress3 === 'No'){
    res.redirect('/purple/current/task/person/list');
  }
  })

   // SIS - terrorism person1 address - GENERAL
router.post('/sis-person1-address-terrorism', function (req, res) {

  // address branching
  var sisAddress = req.session.data['sis-person1-address-known']

  // Check whether the variable matches a condition
  if (sisAddress === 'Yes'){
    res.redirect('/purple/current/task/person/address');
  }
  if (sisAddress === 'No'){
    res.redirect('/purple/current/task/person/terrorism/type');
  }
  })

   // SIS - smuggling person1 address - SMUGGLING
router.post('/sis-person1-address-smuggling', function (req, res) {

  // address branching
  var sisAddress = req.session.data['sis-person1-address-known']

  // Check whether the variable matches a condition
  if (sisAddress === 'Yes'){
    res.redirect('/purple/current/task/person/address');
  }
  if (sisAddress === 'No'){
    res.redirect('/purple/current/task/person/smuggling/type');
  }
  })

     // SIS - terrorism person2 address - GENERAL
router.post('/sis-person2-address-terrorism', function (req, res) {

  // address branching
  var sisAddress2 = req.session.data['sis-person2-address-known']

  // Check whether the variable matches a condition
  if (sisAddress2 === 'Yes'){
    res.redirect('/purple/current/task/person/address2');
  }
  if (sisAddress2 === 'No'){
    res.redirect('/purple/current/task/person/terrorism/type2');
  }
  })
  

  // SIS - terrorism person2 address - SMUGGLING
router.post('/sis-person2-address-smuggling', function (req, res) {

  // address branching
  var sisAddress2 = req.session.data['sis-person2-address-known']

  // Check whether the variable matches a condition
  if (sisAddress2 === 'Yes'){
    res.redirect('/purple/current/task/person/address2');
  }
  if (sisAddress2 === 'No'){
    res.redirect('/purple/current/task/person/smuggling/type2');
  }
  })

 // SIS - S24 person2 address - GENERAL
 router.post('/sis-person2-address-s24', function (req, res) {

  // address branching
  var s24Address = req.session.data['sis-party2-address-same']

  // Check whether the variable matches a condition
  if (s24Address === 'Yes'){
    res.redirect('/purple/current/task/person/s24/type2');
  }
  if (s24Address === 'No'){
    res.redirect('/purple/current/task/person/address2');
  }
  if (s24Address === 'I do not know their address'){
    res.redirect('/purple/current/task/person/s24/type2');
  }
  })

  // SIS - person address - DOC FRAUD - BANKING ROUTE
router.post('/sis-docs-address-bank', function (req, res) {

  // address branching
  var sisDocsaddressbank = req.session.data['sis-docs-address-bank']

  // Check whether the variable matches a condition
  if (sisDocsaddressbank === 'Yes'){
    res.redirect('/purple/current/task/main/docs/add/bank/address');
  }
  if (sisDocsaddressbank === 'No'){
    res.redirect('/purple/current/task/main/docs/add/bank/bank');
  }
  })

    // SIS - person address - DOC FRAUD - BANKING ROUTE
router.post('/sis-idp-address-bank', function (req, res) {

  // address branching
  var sisIDPaddressbank = req.session.data['sis-idp-address-bank']

  // Check whether the variable matches a condition
  if (sisIDPaddressbank === 'Yes'){
    res.redirect('/purple/current/task/main/idp/add/bank/address');
  }
  if (sisIDPaddressbank === 'No'){
    res.redirect('/purple/current/task/main/idp/add/bank');
  }
  })

    // SIS - person address - DOC FRAUD - OTHER ROUTE
router.post('/sis-docs-address', function (req, res) {

  // address branching
  var sisDocsaddress = req.session.data['sis-docs-address']

  // Check whether the variable matches a condition
  if (sisDocsaddress === 'Yes'){
    res.redirect('/purple/current/task/main/docs/add/other/address');
  }
  if (sisDocsaddress === 'No'){
    res.redirect('/purple/current/task/main/docs/add/other/bank');
  }
  })

      // SIS - person1 address - DOC FRAUD - PERSON ROUTE
router.post('/sis-person1-docs-address', function (req, res) {

  // address branching
  var sisDocsaddressperson = req.session.data['sis-person1-docs-address-known']

  // Check whether the variable matches a condition
  if (sisDocsaddressperson === 'Yes'){
    res.redirect('/purple/current/task/person/docs/address');
  }
  if (sisDocsaddressperson === 'No'){
    res.redirect('/purple/current/task/person/docs/list');
  }
  })

      // SIS - person address - IDP - OTHER ROUTE
router.post('/sis-idp-address', function (req, res) {

  // address branching
  var sisDocsaddress = req.session.data['sis-idp-address']

  // Check whether the variable matches a condition
  if (sisDocsaddress === 'Yes'){
    res.redirect('/purple/current/task/main/idp/add/other/address');
  }
  if (sisDocsaddress === 'No'){
    res.redirect('/purple/current/task/main/idp/add/other/bank');
  }
  })


      // SIS - person 2 address - IDP - OTHER ROUTE
router.post('/sis-idp-address2', function (req, res) {

  // address branching
  var sisDocsaddress = req.session.data['sis-idp-address2']

  // Check whether the variable matches a condition
  if (sisDocsaddress === 'Yes'){
    res.redirect('/purple/current/task/main/idp/add/other/address2');
  }
  if (sisDocsaddress === 'No'){
    res.redirect('/purple/current/task/main/idp/add/other/bank2');
  }
  })

      // SIS - person1 address - IDP - PERSON ROUTE
router.post('/sis-person1-idp-address', function (req, res) {

  // address branching
  var sisDocsaddressperson = req.session.data['sis-person1-idp-address']

  // Check whether the variable matches a condition
  if (sisDocsaddressperson === 'Yes'){
    res.redirect('/purple/current/task/person/idp/address');
  }
  if (sisDocsaddressperson === 'No'){
    res.redirect('/purple/current/task/person/idp/list');
  }
  })

        // SIS - person2 address - IDP - PERSON ROUTE
router.post('/sis-person2-idp-address', function (req, res) {

  // address branching
  var sisDocsaddressperson2 = req.session.data['sis-person2-idp-address']

  // Check whether the variable matches a condition
  if (sisDocsaddressperson2 === 'Yes'){
    res.redirect('/purple/current/task/person/idp/address2');
  }
  if (sisDocsaddressperson2 === 'No'){
    res.redirect('/purple/current/task/person/idp/list');
  }
  })

  // SIS - person1 address - SLAVERY
router.post('/sis-person1-address-slavery', function (req, res) {

  // address branching
  var sisAddressslavery = req.session.data['sis-person1-address-slavery']

  // Check whether the variable matches a condition
  if (sisAddressslavery === 'Yes'){
    res.redirect('/purple/current/task/person/slavery/address');
  }
  if (sisAddressslavery === 'No'){
    res.redirect('/purple/current/task/person/slavery/list');
  }
  })

    // SIS - person2 address - SLAVERY
router.post('/sis-person2-address-slavery', function (req, res) {

  // address branching
  var sisAddressslavery = req.session.data['sis-person2-address-slavery']

  // Check whether the variable matches a condition
  if (sisAddressslavery === 'Yes'){
    res.redirect('/purple/current/task/person/slavery/address2');
  }
  if (sisAddressslavery === 'No'){
    res.redirect('/purple/current/task/person/slavery/list');
  }
  })

  // SIS - person1 address - victim
router.post('/sis-person1-address-victim', function (req, res) {

  // address branching
  var sisAddress = req.session.data['sis-person1-address']

  // Check whether the variable matches a condition
  if (sisAddress === 'sis-address-yes'){
    res.redirect('/purple/current/task/person/victim/address');
  }
  if (sisAddress === 'sis-address-no'){
    res.redirect('/purple/current/task/person/victim/legal');
  }
  })

  // SIS - person2 address
router.post('/sis-person2-address', function (req, res) {

  // address branching
  var sisAddress2 = req.session.data['sis-person2-address-known']

  // Check whether the variable matches a condition
  if (sisAddress2 === 'Yes'){
    res.redirect('/purple/current/task/person/address2');
  }
  if (sisAddress2 === 'No'){
    res.redirect('/purple/current/task/person/list2');
  }
  })

   // SIS - person3 address
router.post('/sis-person3-address', function (req, res) {

  // address branching
  var sisAddress3 = req.session.data['sis-person3-address']

  // Check whether the variable matches a condition
  if (sisAddress3 === 'sis-address-yes'){
    res.redirect('/purple/current/task/person/address3');
  }
  if (sisAddress3 === 'sis-address-no'){
    res.redirect('/purple/current/task/person/list');
  }
  if (sisAddress3 === 'sis-address-int'){
    res.redirect('/purple/current/task/person/address3');
  }

  })

    // SIS - person1 fake docs address
    router.post('/sis-person1-docs-address', function (req, res) {

      // address branching
      var sisDocsaddress = req.session.data['sis-person1-docs-address']

      // Check whether the variable matches a condition
      if (sisDocsaddress === 'sis-address-yes'){
        res.redirect('/purple/current/task/main/docs/add/address');
      }
      if (sisDocsaddress === 'sis-address-no'){
        res.redirect('/purple/current/task/main/docs/add/list');
      }

      })

          // SIS - person2 fake docs address
    router.post('/sis-person2-docs-address', function (req, res) {

      // address branching
      var sisDocsaddress2 = req.session.data['sis-person2-docs-address']

      // Check whether the variable matches a condition
      if (sisDocsaddress2 === 'sis-address-yes'){
        res.redirect('/purple/current/task/person/address2');
      }
      if (sisDocsaddress2 === 'sis-address-no'){
        res.redirect('/purple/current/task/person/list');
      }

      })


    // SIS - person1 real ID
    router.post('/sis-docs-real2', function (req, res) {

      // address branching
      var sisDocsreal = req.session.data['sis-docs-real2']

      // Check whether the variable matches a condition
      if (sisDocsreal === 'Yes'){
        res.redirect('/purple/current/task/person/docs/details2');
      }
      if (sisDocsreal === 'No'){
        res.redirect('/purple/current/task/person/docs/list');
      }
      })

// SIS - Run this code when a location type is selected
router.post('/sis-other-location', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisOtherlocation = req.session.data['sis-other-location']

  // Check whether the variable matches a condition
  if (sisOtherlocation === 'Residential address'){
    res.redirect('/purple/current/task/location/residential');
  }
  if (sisOtherlocation === 'Business'){
    res.redirect('/purple/current/task/location/business-details');
  }
  if (sisOtherlocation === 'Educational establishment'){
    res.redirect('/purple/current/task/location/educational');
  }
  if (sisOtherlocation === 'Other type of location'){
    res.redirect('/purple/current/task/location/other');
  }
  if (sisOtherlocation === 'Address'){
    res.redirect('/purple/current/task/list');
  }
})

// SIS - Run this code when an event type is involves a facilitator
router.post('/sis-facilitator', function (req, res) {

  // Make a variable and give it the value from 'team'
  var sisFacilitator = req.session.data['sis-facilitator']

  // Check whether the variable matches a condition
  if (sisFacilitator === 'sis-facilitator-yes'){
    res.redirect('/purple/current/myself/worker/facilitator/details');
  }
  if (sisFacilitator === 'sis-facilitator-no'){
    res.redirect('/purple/current/myself/worker/list');
  }

})

// SIS - Illegal working event details
router.post('/sis-working-date', function (req, res) {

  // Make a variable and give it the value
  var sisWorkingdate = req.session.data['sis-working-date']

  // Check whether the variable matches a condition
  if (sisWorkingdate === 'Already happened'){
    res.redirect('/purple/current/task/main/working/details');
  }
  if (sisWorkingdate === 'Ongoing'){
    res.redirect('/purple/current/task/main/working/link');
  }
  if (sisWorkingdate === 'Will happen in the future'){
    res.redirect('/purple/current/task/main/working/details');
  }

})

// SIS - Other event details
router.post('/sis-offence-date', function (req, res) {

  // Make a variable and give it the value
  var sisOffencedate = req.session.data['sis-offence-date']

  // Check whether the variable matches a condition
  if (sisOffencedate === 'Already happened'){
    res.redirect('/purple/current/task/main/other/details');
  }
  if (sisOffencedate === 'Ongoing'){
    res.redirect('/purple/current/task/main/other/link');
  }
  if (sisOffencedate === 'Will happen in the future'){
    res.redirect('/purple/current/task/main/other/details');
  }

})

// SIS - Terrorism event details
router.post('/sis-terrorism-date', function (req, res) {

  // Make a variable and give it the value
  var sisTerrorismdate = req.session.data['sis-terrorism-date']

  // Check whether the variable matches a condition
  if (sisTerrorismdate === 'Already happened'){
    res.redirect('/purple/current/task/main/terrorism/details');
  }
  if (sisTerrorismdate === 'Ongoing'){
    res.redirect('/purple/current/task/main/terrorism/link');
  }
  if (sisTerrorismdate === 'Will happen in the future'){
    res.redirect('/purple/current/task/main/terrorism/details');
  }

})

// SIS - Modern slavery - victim event details
router.post('/sis-victim-event', function (req, res) {

  // Make a variable and give it the value
  var sisVictimdate = req.session.data['sis-victim-event']

  // Check whether the variable matches a condition
  if (sisVictimdate === 'Yes'){
    res.redirect('/purple/current/task/main/slavery/link');
  }
  if (sisVictimdate === 'No'){
    res.redirect('/purple/current/task/main/slavery/date');
  }
  if (sisVictimdate === 'I do not know'){
    res.redirect('/purple/current/task/main/slavery/link');
  }

})

// SIS - Modern slavery - victim event details 2
router.post('/sis-victim-event2', function (req, res) {

  // Make a variable and give it the value
  var sisVictimdate = req.session.data['sis-victim-event2']

  // Check whether the variable matches a condition
  if (sisVictimdate === 'Yes'){
    res.redirect('/purple/current/task/main/slavery/link2');
  }
  if (sisVictimdate === 'No'){
    res.redirect('/purple/current/task/main/slavery/date2');
  }
  if (sisVictimdate === 'I do not know'){
    res.redirect('/purple/current/task/main/slavery/link2');
  }

})

// SIS - Modern slavery - victim document
router.post('/victim-docs', function (req, res) {

  // Make a variable and give it the value
  var sisVictimdocs = req.session.data['victim-docs']

  // Check whether the variable matches a condition
  if (sisVictimdocs === 'Fraudulent travel documents'){
    res.redirect('/purple/current/task/main/slavery/victim/legal');
  }
  if (sisVictimdocs === 'Valid UK visa or permission'){
    res.redirect('/purple/current/task/main/slavery/victim/visa-type');
  }
  if (sisVictimdocs === 'None, they entered clandestinely'){
    res.redirect('/purple/current/task/main/slavery/victim/cland-details');
  }
  if (sisVictimdocs === 'I do not know'){
    res.redirect('/purple/current/task/main/slavery/victim/legal');
  }

})

// SIS - Other - person document
router.post('/other-docs', function (req, res) {

  // Make a variable and give it the value
  var sisOtherdocs = req.session.data['other-docs']

  // Check whether the variable matches a condition
  if (sisOtherdocs === 'Fraudulent travel documents'){
    res.redirect('/purple/current/task/main/other/travel/list');
  }
  if (sisOtherdocs === 'Valid UK visa or permission'){
    res.redirect('/purple/current/task/main/other/travel/details');
  }
  if (sisOtherdocs === 'None, they entered clandestinely'){
    res.redirect('/purple/current/task/main/other/travel/enter');
  }
  if (sisOtherdocs === 'None, they plan to enter clandestinely'){
    res.redirect('/purple/current/task/main/other/travel/enter');
  }
  if (sisOtherdocs === 'I do not know'){
    res.redirect('/purple/current/task/main/other/travel/list');
  }

})

// SIS - Modern slavery - victim document 2
router.post('/victim-docs2', function (req, res) {

  // Make a variable and give it the value
  var sisVictimdocs = req.session.data['victim-docs2']

  // Check whether the variable matches a condition
  if (sisVictimdocs === 'Fraudulent travel documents'){
    res.redirect('/purple/current/task/main/slavery/victim/legal2');
  }
  if (sisVictimdocs === 'Valid UK visa or permission'){
    res.redirect('/purple/current/task/main/slavery/victim/visa-type2');
  }
  if (sisVictimdocs === 'None, they entered clandestinely'){
    res.redirect('/purple/current/task/main/slavery/victim/cland-details2');
  }
  if (sisVictimdocs === 'I do not know'){
    res.redirect('/purple/current/task/main/slavery/victim/legal2');
  }

})

// SIS - Modern slavery - victim detained
router.post('/sis-victim-detained', function (req, res) {

  // Make a variable and give it the value
  var sisVictimdetained = req.session.data['sis-victim-detained']

  // Check whether the variable matches a condition
  if (sisVictimdetained === 'Yes'){
    res.redirect('/purple/current/task/main/slavery/victim/detained-details');
  }
  if (sisVictimdetained === 'No'){
    res.redirect('/purple/current/task/main/slavery/victim/list2');
  }
})
// SIS - Modern slavery - victim detained 2
router.post('/sis-victim-detained2', function (req, res) {

  // Make a variable and give it the value
  var sisVictimdetained = req.session.data['sis-victim-detained2']

  // Check whether the variable matches a condition
  if (sisVictimdetained === 'Yes'){
    res.redirect('/purple/current/task/main/slavery/victim/detained-details2');
  }
  if (sisVictimdetained === 'No'){
    res.redirect('/purple/current/task/main/slavery/victim/list2');
  }
})

// SIS - Modern slavery - victim detained location
router.post('/sis-victim-detained-location', function (req, res) {

  // Make a variable and give it the value
  var sisDetainedlocation = req.session.data['sis-victim-detained-location']

  // Check whether the variable matches a condition
  if (sisDetainedlocation.includes("somewhere-else")){
    res.redirect('/purple/current/task/main/slavery/victim/detained-details');
  } else {
    res.redirect('/purple/current/task/main/slavery/victim/list2');
  }
})

// SIS - Modern slavery - victim detained location 2
router.post('/sis-victim-detained-location2', function (req, res) {

  // Make a variable and give it the value
  var sisDetainedlocation = req.session.data['sis-victim-detained-location2']

  // Check whether the variable matches a condition
  if (sisDetainedlocation.includes("somewhere-else2")){
    res.redirect('/purple/current/task/main/slavery/victim/detained-details2');
  } else {
    res.redirect('/purple/current/task/main/slavery/victim/list2');
  }
})

// SIS - Main - Breach of conditions place of work
router.post('/sis-breach-work-aware', function (req, res) {

  // Make a variable and give it the value
  var sisBreachwork = req.session.data['sis-breach-work-aware']

  // Check whether the variable matches a condition
  if (sisBreachwork === 'Yes'){
    res.redirect('/purple/current/task/main/breach/link');
  }
  if (sisBreachwork === 'No'){
    res.redirect('/purple/current/task/main/breach/list');
  }

})

// SIS - Main - Breach of conditions place of work 2
router.post('/sis-breach-work-aware2', function (req, res) {

  // Make a variable and give it the value
  var sisBreachwork = req.session.data['sis-breach-work-aware2']

  // Check whether the variable matches a condition
  if (sisBreachwork === 'Yes'){
    res.redirect('/purple/current/task/main/breach/link2');
  }
  if (sisBreachwork === 'No'){
    res.redirect('/purple/current/task/main/breach/list');
  }

})

// SIS - Main - Marriage abuse location
router.post('/sis-marriage-location', function (req, res) {

  // Make a variable and give it the value
  var sisMarriagelocation = req.session.data['sis-location']

  // Check whether the variable matches a condition
  if (sisMarriagelocation === 'address1'){
    res.redirect('/purple/current/task/main/marriage/payment');
  }
  if (sisMarriagelocation === 'address2'){
    res.redirect('/purple/current/task/main/marriage/payment');
  }
  if (sisMarriagelocation === 'sis-somewhere-else'){
    res.redirect('/purple/current/task/main/marriage/address');
  }

})

// SIS - Main - Marriage abuse facilitator
router.post('/arrange-marriage', function (req, res) {

  // Make a variable and give it the value
  var sisArrangemarriage = req.session.data['arrange-marriage']

  // Check whether the variable matches a condition
  if (sisArrangemarriage === 'Yes'){
    res.redirect('/purple/current/task/main/marriage/link');
  }
  if (sisArrangemarriage === 'No'){
    res.redirect('/purple/current/task/main/marriage/list');
  }
  if (sisArrangemarriage === 'I do not know'){
    res.redirect('/purple/current/task/main/marriage/list');
  }
})

// SIS - Main - S24 Marriage abuse facilitator
router.post('/arrange-s24', function (req, res) {

  // Make a variable and give it the value
  var sisArranges24 = req.session.data['arrange-s24']

  // Check whether the variable matches a condition
  if (sisArranges24 === 'Yes'){
    res.redirect('/purple/current/task/main/s24/link');
  }
  if (sisArranges24 === 'No'){
    res.redirect('/purple/current/task/main/s24/s24-report');
  }
  if (sisArranges24 === 'I do not know'){
    res.redirect('/purple/current/task/main/s24/s24-report');
  }
})

// SIS - Main - Clandestine
router.post('/sis-cland', function (req, res) {

  // Make a variable and give it the value
  var sisCland = req.session.data['sis-cland']

  // Check whether the variable matches a condition
  if (sisCland === 'Air'){
    res.redirect('/purple/current/task/main/clandestine/country');
  }
  if (sisCland === 'Rail'){
    res.redirect('/purple/current/task/main/clandestine/vehicle');
  }
  if (sisCland === 'Road'){
    res.redirect('/purple/current/task/main/clandestine/route');
  }
  if (sisCland === 'Sea'){
    res.redirect('/purple/current/task/main/clandestine/vehicle');
  }
  if (sisCland === 'Other'){
    res.redirect('/purple/current/task/main/clandestine/list');
  }
})





// SIS - Main - Smuggling - Travel
router.post('/smuggling-vehicles', function (req, res) {

  // Make a variable and give it the value
  var sisSmugVehicle = req.session.data['smuggle-transport']

  // Check whether the variable matches a condition
    if (sisSmugVehicle === 'Road'){
    res.redirect('/purple/current/task/main/smuggling/vehicles/country');
  }
    if (sisSmugVehicle === 'Sea'){
    res.redirect('/purple/current/task/main/smuggling/vehicles/vehicle');
  }
    if (sisSmugVehicle === 'Rail'){
    res.redirect('/purple/current/task/main/smuggling/vehicles/vehicle');
  }
    if (sisSmugVehicle === 'Air'){
    res.redirect('/purple/current/task/main/smuggling/vehicles/country');
  }
    if (sisSmugVehicle === 'Other'){
    res.redirect('/purple/current/task/main/smuggling/vehicles/country');
  }
    if (sisSmugVehicle === 'I do not know'){
    res.redirect('/purple/current/task/main/smuggling/vehicles/country');
  }

})

// SIS - Main - Smuggling inside vehicle
router.post('/sis-smuggling-vehicle-inside', function (req, res) {

  // Make a variable and give it the value
  var sisClandVehicle = req.session.data['smuggle-transport-inside']

  // Check whether the variable matches a condition
  if (sisClandVehicle === 'Yes'){
    res.redirect('/purple/current/task/main/smuggling/vehicles/vehicle-details');
  }
  if (sisClandVehicle === 'No'){
    res.redirect('/purple/current/task/main/smuggling/vehicles/country');
  }
  if (sisClandVehicle === 'I do not know'){
    res.redirect('/purple/current/task/main/smuggling/vehicles/country');
  }
})





// SIS - Main - IDP - travel
router.post('/sis-idp', function (req, res) {

  // Make a variable and give it the value
  var sisIDP = req.session.data['sis-idp']

  // Check whether the variable matches a condition
  if (sisIDP === 'Air'){
    res.redirect('/purple/current/task/main/idp/country');
  }
  if (sisIDP === 'Rail'){
    res.redirect('/purple/current/task/main/idp/vehicle');
  }
  if (sisIDP === 'Road'){
    res.redirect('/purple/current/task/main/idp/route');
  }
  if (sisIDP === 'Sea'){
    res.redirect('/purple/current/task/main/idp/vehicle');
  }
  if (sisIDP === 'Other'){
    res.redirect('/purple/current/task/main/idp/list');
  }

})
// SIS - Main - Other - travel
router.post('/sis-other-route', function (req, res) {

  // Make a variable and give it the value
  var sisOther = req.session.data['sis-other-route']

  // Check whether the variable matches a condition
  if (sisOther === 'Air'){
    res.redirect('/purple/current/task/main/other/travel/country');
  }
  if (sisOther === 'Rail'){
    res.redirect('/purple/current/task/main/other/travel/vehicle');
  }
  if (sisOther === 'Road'){
    res.redirect('/purple/current/task/main/other/travel/route');
  }
  if (sisOther === 'Sea'){
    res.redirect('/purple/current/task/main/other/travel/vehicle');
  }
  if (sisOther === 'Other'){
    res.redirect('/purple/current/task/main/other/travel/list');
  }

})

// SIS - Main - IDP 2 - travel
router.post('/sis-idp-2', function (req, res) {

  // Make a variable and give it the value
  var sisIDP2 = req.session.data['sis-idp2']

  // Check whether the variable matches a condition
  if (sisIDP2 === 'Air'){
    res.redirect('/purple/current/task/main/idp/country2');
  }
  if (sisIDP2 === 'Rail'){
    res.redirect('/purple/current/task/main/idp/vehicle2');
  }
  if (sisIDP2 === 'Road'){
    res.redirect('/purple/current/task/main/idp/route2');
  }
  if (sisIDP2 === 'Sea'){
    res.redirect('/purple/current/task/main/idp/vehicle2');
  }
  if (sisIDP2 === 'Other'){
    res.redirect('/purple/current/task/main/idp/list2');
  }

})
// SIS - Main - Clandestine inside vehicle
router.post('/sis-cland-vehicle', function (req, res) {

  // Make a variable and give it the value
  var sisClandVehicle = req.session.data['sis-cland-vehicle']

  // Check whether the variable matches a condition
  if (sisClandVehicle === 'Yes'){
    res.redirect('/purple/current/task/main/clandestine/vehicle-details');
  }
  if (sisClandVehicle === 'No'){
    res.redirect('/purple/current/task/main/clandestine/country');
  }
  if (sisClandVehicle === 'I do not know'){
    res.redirect('/purple/current/task/main/clandestine/country');
  }
})
 
// SIS - Main - IDP - travel inside vehicle
router.post('/sis-idp-vehicle', function (req, res) {

  // Make a variable and give it the value
  var sisIDPVehicle = req.session.data['sis-idp-vehicle']

  // Check whether the variable matches a condition
  if (sisIDPVehicle === 'Yes'){
    res.redirect('/purple/current/task/main/idp/vehicle-details');
  }
  if (sisIDPVehicle === 'No'){
    res.redirect('/purple/current/task/main/idp/country');
  }
  if (sisIDPVehicle === 'I do not know'){
    res.redirect('/purple/current/task/main/idp/country');
  }
})

// SIS - Main - other - travel inside vehicle
router.post('/sis-other-vehicle', function (req, res) {

  // Make a variable and give it the value
  var sisOtherVehicle = req.session.data['sis-other-vehicle']

  // Check whether the variable matches a condition
  if (sisOtherVehicle === 'Yes'){
    res.redirect('/purple/current/task/main/other/travel/vehicle-details');
  }
  if (sisOtherVehicle === 'No'){
    res.redirect('/purple/current/task/main/other/travel/country');
  }
  if (sisOtherVehicle === 'I do not know'){
    res.redirect('/purple/current/task/main/other/travel/country');
  }
})

// SIS - Main - IDP 2- travel inside vehicle
router.post('/sis-idp-vehicle-2', function (req, res) {

  // Make a variable and give it the value
  var sisIDPVehicle2 = req.session.data['sis-idp-vehicle2']

  // Check whether the variable matches a condition
  if (sisIDPVehicle2 === 'Yes'){
    res.redirect('/purple/current/task/main/idp/vehicle-details2');
  }
  if (sisIDPVehicle2 === 'No'){
    res.redirect('/purple/current/task/main/idp/country2');
  }
  if (sisIDPVehicle2 === 'I do not know'){
    res.redirect('/purple/current/task/main/idp/country2');
  }
})
// SIS - Main - Clandestine 2
router.post('/sis-cland2', function (req, res) {

  // Make a variable and give it the value
  var sisCland = req.session.data['sis-cland2']

  // Check whether the variable matches a condition
  if (sisCland === 'Air'){
    res.redirect('/purple/current/task/main/clandestine/country2');
  }
  if (sisCland === 'Rail'){
    res.redirect('/purple/current/task/main/clandestine/vehicle2');
  }
  if (sisCland === 'Road'){
    res.redirect('/purple/current/task/main/clandestine/route2');
  }
  if (sisCland === 'Sea'){
    res.redirect('/purple/current/task/main/clandestine/vehicle2');
  }
  if (sisCland === 'Other'){
    res.redirect('/purple/current/task/main/clandestine/list');
  }

})

// SIS - Main - Clandestine inside vehicle 2
router.post('/sis-cland-vehicle2', function (req, res) {

  // Make a variable and give it the value
  var sisClandVehicle = req.session.data['sis-cland-vehicle2']

  // Check whether the variable matches a condition
  if (sisClandVehicle === 'Yes'){
    res.redirect('/purple/current/task/main/clandestine/vehicle-details');
  }
  if (sisClandVehicle === 'No'){
    res.redirect('/purple/current/task/main/clandestine/country2');
  }
  if (sisClandVehicle === 'I do not know'){
    res.redirect('/purple/current/task/main/clandestine/country2');
  }
})

// SIS - Main - Modern slavery - Clandestine route 
router.post('/sis-cland-victim', function (req, res) {

  // Make a variable and give it the value
  var sisClandvictim = req.session.data['sis-cland-victim']

  // Check whether the variable matches a condition
  if (sisClandvictim === 'Air'){
    res.redirect('/purple/current/task/main/slavery/victim/country');
  }
  if (sisClandvictim === 'Rail'){
    res.redirect('/purple/current/task/main/slavery/victim/vehicle');
  }
  if (sisClandvictim === 'Road'){
    res.redirect('/purple/current/task/main/slavery/victim/route');
  }
  if (sisClandvictim === 'Sea'){
    res.redirect('/purple/current/task/main/slavery/victim/vehicle');
  }
  if (sisClandvictim === 'Other'){
    res.redirect('/purple/current/task/main/slavery/victim/legal');
  }

})
// SIS - Main - Modern slavery - Clandestine route 2
router.post('/sis-cland-victim2', function (req, res) {

  // Make a variable and give it the value
  var sisClandvictim = req.session.data['sis-cland-victim2']

  // Check whether the variable matches a condition
  if (sisClandvictim === 'Air'){
    res.redirect('/purple/current/task/main/slavery/victim/country2');
  }
  if (sisClandvictim === 'Rail'){
    res.redirect('/purple/current/task/main/slavery/victim/vehicle2');
  }
  if (sisClandvictim === 'Road'){
    res.redirect('/purple/current/task/main/slavery/victim/route2');
  }
  if (sisClandvictim === 'Sea'){
    res.redirect('/purple/current/task/main/slavery/victim/vehicle2');
  }
  if (sisClandvictim === 'Other'){
    res.redirect('/purple/current/task/main/slavery/victim/legal2');
  }

})

// SIS - Main - Modern Slavery - Clandestine inside vehicle
router.post('/sis-victim-vehicle', function (req, res) {

  // Make a variable and give it the value
  var sisSlaveryehicle = req.session.data['sis-victim-vehicle']

  // Check whether the variable matches a condition
  if (sisSlaveryehicle === 'Yes'){
    res.redirect('/purple/current/task/main/slavery/victim/vehicle-details');
  }
  if (sisSlaveryehicle === 'No'){
    res.redirect('/purple/current/task/main/slavery/victim/country');
  }
  if (sisSlaveryehicle === 'I do not know'){
    res.redirect('/purple/current/task/main/slavery/victim/country');
  }
})

// SIS - Main - Modern Slavery - Clandestine inside vehicle 2
router.post('/sis-victim-vehicle2', function (req, res) {

  // Make a variable and give it the value
  var sisSlaveryehicle = req.session.data['sis-victim-vehicle2']

  // Check whether the variable matches a condition
  if (sisSlaveryehicle === 'Yes'){
    res.redirect('/purple/current/task/main/slavery/victim/vehicle-details');
  }
  if (sisSlaveryehicle === 'No'){
    res.redirect('/purple/current/task/main/slavery/victim/country2');
  }
  if (sisSlaveryehicle === 'I do not know'){
    res.redirect('/purple/current/task/main/slavery/victim/country2');
  }
})
// SIS - Main - Modern Slavery - Clandestine inside vehicle 2
router.post('/sis-victim-vehicle2', function (req, res) {

  // Make a variable and give it the value
  var sisSlaveryehicle = req.session.data['sis-victim-vehicle2']

  // Check whether the variable matches a condition
  if (sisSlaveryehicle === 'Yes'){
    res.redirect('/purple/current/task/main/slavery/victim/vehicle-details');
  }
  if (sisSlaveryehicle === 'No'){
    res.redirect('/purple/current/task/main/slavery/victim/route2');
  }
  if (sisSlaveryehicle === 'I do not know'){
    res.redirect('/purple/current/task/main/slavery/victim/route2');
  }
})
// SIS - Main - Clandestine vehicle
router.post('/sis-cland-vehicle', function (req, res) {

  // Make a variable and give it the value
  var sisClandvehicle = req.session.data['sis-cland-vehicle']

  // Check whether the variable matches a condition
  if (sisClandvehicle === 'Yes'){
    res.redirect('/purple/current/task/main/clandestine/road');
  }
  if (sisClandvehicle === 'No'){
    res.redirect('/purple/current/task/main/clandestine/details');
  }
})
// SIS - Main - Clandestine vehicle 2
router.post('/sis-cland-vehicle2', function (req, res) {

  // Make a variable and give it the value
  var sisClandvehicle = req.session.data['sis-cland-vehicle2']

  // Check whether the variable matches a condition
  if (sisClandvehicle === 'Yes'){
    res.redirect('/purple/current/task/main/clandestine/road');
  }
  if (sisClandvehicle === 'No'){
    res.redirect('/purple/current/task/main/clandestine/details2');
  }
})

// SIS - Main - Document fraud - add doc1

router.post('/sis-main-doc-one-type', function (request, response) {

  // Make a variable and give it the value
  var sisDocadd1 = request.session.data['sis-main-doc-one-type']

  // Check whether the variable matches a condition
  if (sisDocadd1.includes("Bank document") ){
    response.redirect("/purple/current/task/main/docs/add/bank/number");
  } else {
    response.redirect("/purple/current/task/main/docs/add/other/number");
  }
})

// S24 route to the document screen in people details 
router.post('/s24-doc-route', function (request, response) {

  // Make a variable and give it the value
  var crime = request.session.data['start-crime']

  // Check whether the variable matches a condition
  if (crime.includes("s24") ){
    response.redirect("/purple/current/task/person/s24/type");
  } 
  if (crime.includes("terrorism") ){
    response.redirect("/purple/current/task/person/terrorism/type");
  }
  else {
    response.redirect("/purple/current/task/person/list");
  }
})

router.post('/s24-doc2-route', function (request, response) {

  // Make a variable and give it the value
  var crime = request.session.data['start-crime']

  // Check whether the variable matches a condition
  if (crime.includes("s24") ){
    response.redirect("/purple/current/task/person/s24/type2");
  } 
  if (crime.includes("terrorism") ){
    response.redirect("/purple/current/task/person/terrorism/type2");
  } 
  else {
    response.redirect("/purple/current/task/person/list");
  }
})

router.post('/s24-doc3-route', function (request, response) {

  // Make a variable and give it the value
  var crime = request.session.data['start-crime']

  // Check whether the variable matches a condition
  if (crime.includes("s24") ){
    response.redirect("/purple/current/task/person/list");
  } 
  if (crime.includes("terrorism") ){
    response.redirect("/purple/current/task/person/terrorism/type3");
  } 
  else {
    response.redirect("/purple/current/task/person/list");
  }
})

// SIS - Main - IDP - add doc1

router.post('/sis-main-idp-doc-one-type', function (request, response) {

  // Make a variable and give it the value
  var sisDocadd1 = request.session.data['sis-main-idp-doc-one-type']

  // Check whether the variable matches a condition
  if (sisDocadd1.includes("Bank document") ){
    response.redirect("/purple/current/task/main/idp/add/bank/number");
  } else {
    response.redirect("/purple/current/task/main/idp/add/other/number");
  }
})

// SIS - Main - IDP - add doc2

router.post('/sis-main-idp-doc-two', function (request, response) {

  // Make a variable and give it the value
  var sisDocadd1 = request.session.data['sis-main-idp-doc-two']

  // Check whether the variable matches a condition
  if (sisDocadd1.includes("Bank document") ){
    response.redirect("/purple/current/task/main/idp/add/bank/number2");
  } else {
    response.redirect("/purple/current/task/main/idp/add/other/number2");
  }
})

// SIS - Main - Source of document fraud
router.post('/sis-main-docsource', function (req, res) {

  // Make a variable and give it the value
  var sisDocsauce = req.session.data['sis-main-doc-source1-other']

  // Check whether the variable matches a condition
  if (sisDocsauce === 'Online application to the Home Office'){
    res.redirect('/purple/current/task/main/docs/details/app');
  }
  if (sisDocsauce === 'Postal application to the Home Office'){
    res.redirect('/purple/current/task/main/docs/details/app');
  }
  if (sisDocsauce === 'Intercepted during postage or delivery'){
    res.redirect('/purple/current/task/main/docs/details/package');
  }
  if (sisDocsauce === 'Referred from other government departments'){
    res.redirect('/purple/current/task/main/docs/details/seized');
  }
  if (sisDocsauce === 'Identified during an operational visit or caseworking'){
    res.redirect('/purple/current/task/main/docs/details/seized');
  }
  if (sisDocsauce === 'Other'){
    res.redirect('/purple/current/task/main/docs/details/seized');
  }
})

// SIS - Main - document fraud helper name
router.post('/sis-helper-name', function (req, res) {

  // Make a variable and give it the value
  var sisHelpername = req.session.data['sis-helper-name']

  // Check whether the variable matches a condition
  if (sisHelpername === 'sis-helper-person'){
    res.redirect('/purple/current/task/main/docs/details/seized');
  }
  if (sisHelpername === 'someone-else'){
    res.redirect('/purple/current/task/main/docs/details/helper');
  }
})

// SIS - Main - document fraud sender address
router.post('/sis-sender-address', function (req, res) {

  // Make a variable and give it the value
  var sisSenderaddress = req.session.data['sis-sender-address']

  // Check whether the variable matches a condition
  if (sisSenderaddress === 'sis-sender-address-link'){
    res.redirect('/purple/current/task/main/docs/seized');
  }
  if (sisSenderaddress === 'someone-else'){
    res.redirect('/purple/current/task/main/docs/sender-address-uk');
  }
})

// SIS - Main - IDP ticket payment
router.post('/idp-ticket-pay', function (req, res) {

  // Make a variable and give it the value
  var sisTicket = req.session.data['idp-ticket-pay']

  // Check whether the variable matches a condition
  if (sisTicket === 'Credit or debit card'){
    res.redirect('/purple/current/task/main/idp/card');
  }
  if (sisTicket === 'Bank transfer'){
    res.redirect('/purple/current/task/main/idp/contact');
  }
  if (sisTicket === 'Other'){
    res.redirect('/purple/current/task/main/idp/contact');
  }
  if (sisTicket === 'Cash'){
    res.redirect('/purple/current/task/main/idp/contact');
  }
  if (sisTicket === 'I do not know'){
    res.redirect('/purple/current/task/main/idp/contact');
  }
})

// SIS - Main - document fraud helper
router.post('/sis-docs-helper', function (req, res) {

  // Make a variable and give it the value
  var sisDocshelper = req.session.data['sis-main-docs-helper']

  // Check whether the variable matches a condition
  if (sisDocshelper === 'Yes'){
    res.redirect('/purple/current/task/main/docs/details/helper');
  }
  if (sisDocshelper === 'No'){
    res.redirect('/purple/current/task/main/docs/details/seized');
  }
  if (sisDocshelper === 'I do not know'){
    res.redirect('/purple/current/task/main/docs/details/seized');
  }
})

// SIS - Main - public and private funds abuse
router.post('/sis-funds-abuse', function (req, res) {

  // Make a variable and give it the value
  var sisDocshelper = req.session.data['sis-funds-abuse']

  // Check whether the variable matches a condition
  if (sisDocshelper === 'Yes'){
    res.redirect('/purple/current/task/main/funds/reported');
  }
  if (sisDocshelper === 'No'){
    res.redirect('/purple/current/task/list');
  }
  if (sisDocshelper === 'I do not know'){
    res.redirect('/purple/current/task/list');
  }
})


// SIS - Doc fraud - banking details
router.post('/sis-docs-banking-other', function (req, res) {

  // Make a variable and give it the value
  var sisDocsbank = req.session.data['sis-docs-banking-other']

  // Check whether the variable matches a condition
  if (sisDocsbank === 'Yes'){
    res.redirect('/purple/current/task/main/docs/add/bank-details');
  }
  if (sisDocsbank === 'No'){
    res.redirect('/purple/current/task/main/docs/add/real');
  }
})
// SIS - IDP - banking details
router.post('/sis-idp-banking-other', function (req, res) {

  // Make a variable and give it the value
  var sisDocsbank = req.session.data['sis-idp-banking-other']

  // Check whether the variable matches a condition
  if (sisDocsbank === 'Yes'){
    res.redirect('/purple/current/task/main/idp/add/bank-details');
  }
  if (sisDocsbank === 'No'){
    res.redirect('/purple/current/task/main/idp/add/real');
  }
})

// SIS - Doc fraud - banking details
router.post('/sis-docs-banking-other', function (req, res) {

  // Make a variable and give it the value
  var sisDocsbank = req.session.data['sis-docs-banking-other']

  // Check whether the variable matches a condition
  if (sisDocsbank === 'Yes'){
    res.redirect('/purple/current/task/main/docs/add/other/bank-details');
  }
  if (sisDocsbank === 'No'){
    res.redirect('/purple/current/task/main/docs/add/real');
  }
})

// SIS - IDP - banking details 2
router.post('/sis-idp-banking-other2', function (req, res) {

  // Make a variable and give it the value
  var sisDocsbank = req.session.data['sis-idp-banking-other2']

  // Check whether the variable matches a condition
  if (sisDocsbank === 'Yes'){
    res.redirect('/purple/current/task/main/idp/add/bank-details2');
  }
  if (sisDocsbank === 'No'){
    res.redirect('/purple/current/task/main/idp/add/real2');
  }
})

// SIS - Main - document fraud helper address
router.post('/sis-doc-helper-address', function (req, res) {

  // Make a variable and give it the value
  var sisDocshelper = req.session.data['sis-docs-helper-address']

  // Check whether the variable matches a condition
  if (sisDocshelper === 'Yes'){
    res.redirect('/purple/current/task/main/docs/details/address');
  }
  if (sisDocshelper === 'No'){
    res.redirect('/purple/current/task/main/docs/details/seized');
  }
})

// SIS - Main - IDP helper address
router.post('/sis-idp-helper-address', function (req, res) {

  // Make a variable and give it the value
  var sisDocshelper = req.session.data['sis-idp-helper-address']

  // Check whether the variable matches a condition
  if (sisDocshelper === 'Yes'){
    res.redirect('/purple/current/task/main/idp/details/address');
  }
  if (sisDocshelper === 'No'){
    res.redirect('/purple/current/task/main/idp/details/seized');
  }
})

// SIS - Main - document fraud helper address
router.post('/sis-helper-address', function (req, res) {

  // Make a variable and give it the value
  var sisHelperaddress = req.session.data['sis-helper-address']

  // Check whether the variable matches a condition
  if (sisHelperaddress === 'sis-helper-address'){
    res.redirect('/purple/current/task/main/docs/seized');
  }
  if (sisHelperaddress === 'sis-somewhere-else'){
    res.redirect('/purple/current/task/main/docs/helper-uk');
  }
})

// SIS - Main - IDP helper address
router.post('/sis-idp-helper-address', function (req, res) {

  // Make a variable and give it the value
  var sisHelperaddress = req.session.data['sis-helper-address']

  // Check whether the variable matches a condition
  if (sisHelperaddress === 'sis-idp-helper-address'){
    res.redirect('/purple/current/task/main/idp/seized');
  }
  if (sisHelperaddress === 'sis-idp-somewhere-else'){
    res.redirect('/purple/current/task/main/idp/helper-uk');
  }
})
// SIS - Main - document fraud package name
router.post('/sis-package-name', function (req, res) {

  // Make a variable and give it the value
  var sisPackagename = req.session.data['sis-package-name']

  // Check whether the variable matches a condition
  if (sisPackagename === 'sis-package-person'){
    res.redirect('/purple/current/task/main/docs/sender');
  }
  if (sisPackagename === 'someone-else'){
    res.redirect('/purple/current/task/main/docs/package');
  }
})

// SIS - Main - IDP package name
router.post('/sis-package-name', function (req, res) {

  // Make a variable and give it the value
  var sisPackagename = req.session.data['sis-idp-package-name']

  // Check whether the variable matches a condition
  if (sisPackagename === 'sis-idp-package-person'){
    res.redirect('/purple/current/task/main/idp/sender');
  }
  if (sisPackagename === 'idp-someone-else'){
    res.redirect('/purple/current/task/main/idp/package');
  }
})

// SIS - Main - document fraud sender
router.post('/sis-docs-sender', function (req, res) {

  // Make a variable and give it the value
  var sisDocshelper = req.session.data['sis-docs-sender-confirm']

  // Check whether the variable matches a condition
  if (sisDocshelper === 'Yes'){
    res.redirect('/purple/current/task/main/docs/details/sender-details');
  }
  if (sisDocshelper === 'No'){
    res.redirect('/purple/current/task/main/docs/details/seized');
  }
})

// SIS - Main - IDP sender
router.post('/sis-idp-sender', function (req, res) {

  // Make a variable and give it the value
  var sisDocshelper = req.session.data['sis-idp-sender-confirm']

  // Check whether the variable matches a condition
  if (sisDocshelper === 'Yes'){
    res.redirect('/purple/current/task/main/idp/details/sender-details');
  }
  if (sisDocshelper === 'No'){
    res.redirect('/purple/current/task/main/idp/details/seized');
  }
})

// SIS - Main - document fraud package name
router.post('/sis-sender-name', function (req, res) {

  // Make a variable and give it the value
  var sisSendername = req.session.data['sis-sender-name']

  // Check whether the variable matches a condition
  if (sisSendername === 'sis-sender-person'){
    res.redirect('/purple/current/task/main/docs/seized');
  }
  if (sisSendername === 'someone-else'){
    res.redirect('/purple/current/task/main/docs/sender-details');
  }
})

// SIS - Main - IDP package name
router.post('/sis-idp-sender-name', function (req, res) {

  // Make a variable and give it the value
  var sisSendername = req.session.data['sis-idp-sender-name']

  // Check whether the variable matches a condition
  if (sisSendername === 'sis-idp-sender-person'){
    res.redirect('/purple/current/task/main/docs/seized');
  }
  if (sisSendername === 'idp-someone-else'){
    res.redirect('/purple/current/task/main/idp/sender-details');
  }
})

// SIS - Main - document fraud sender address
router.post('/sis-docs-sender-address', function (req, res) {

  // Make a variable and give it the value
  var sisDocshelper = req.session.data['sis-docs-sender-address']

  // Check whether the variable matches a condition
  if (sisDocshelper === 'Yes'){
    res.redirect('/purple/current/task/main/docs/details/sender-address');
  }
  if (sisDocshelper === 'No'){
    res.redirect('/purple/current/task/main/docs/details/seized');
  }
})
// SIS - Main - IDP sender address
router.post('/sis-idp-sender-address', function (req, res) {

  // Make a variable and give it the value
  var sisDocshelper = req.session.data['sis-idp-sender-address']

  // Check whether the variable matches a condition
  if (sisDocshelper === 'Yes'){
    res.redirect('/purple/current/task/main/idp/details/sender-address');
  }
  if (sisDocshelper === 'No'){
    res.redirect('/purple/current/task/main/idp/details/seized');
  }
})

// SIS - Main - Clandestine vehicle
router.post('/sis-cland-vehicle', function (req, res) {

  // Make a variable and give it the value
  var sisClandvehicle = req.session.data['sis-cland-vehicle']

  // Check whether the variable matches a condition
  if (sisClandvehicle === 'Yes'){
    res.redirect('/purple/current/task/main/clandestine/road');
  }
  if (sisClandvehicle === 'No'){
    res.redirect('/purple/current/task/main/clandestine/details');
  }
})

// SIS - Other - Entered the UK
router.post('/other-entered-uk', function (req, res) {

  // Make a variable and give it the value
  var sisOtherUK = req.session.data['sis-other-uk']

  // Check whether the variable matches a condition
  if (sisOtherUK === 'Yes'){
    res.redirect('/purple/current/task/main/other/travel/docs-type-uk');
  }
  if (sisOtherUK === 'No'){
    res.redirect('/purple/current/task/main/other/travel/docs-type');
  }
  if (sisOtherUK === 'I do not know'){
    res.redirect('/purple/current/task/main/other/travel/date2');
  }
})



// SIS - Sub - Breach of conditions
router.post('/sis-breach-link', function (req, res) {

  // Make a variable and give it the value
  var sisBreachpers = req.session.data['sis-breach-person']

  // Check whether the variable matches a condition
  if (sisBreachpers === 'person1'){
    res.redirect('/purple/current/task/sub/breach/details');
  }
  if (sisBreachpers === 'person-someone'){
    res.redirect('/purple/current/task/sub/breach/person');
  }

})
// SIS - Sub - Breach of conditions 2
router.post('/sis-breach-link2', function (req, res) {

  // Make a variable and give it the value
  var sisBreachpers = req.session.data['sis-breach-person2']

  // Check whether the variable matches a condition
  if (sisBreachpers === 'person2'){
    res.redirect('/purple/current/task/sub/breach/details2');
  }
  if (sisBreachpers === 'person-someone2'){
    res.redirect('/purple/current/task/sub/breach/person2');
  }

})

  // SIS - modern slavery - legal rep
  router.post('/sis-slavery-legal', function (req, res) {

    // address branching
    var sisSlaveryrep = req.session.data['sis-slavery-legal']
  
    // Check whether the variable matches a condition
    if (sisSlaveryrep === 'Yes'){
      res.redirect('/purple/current/task/main/slavery/victim/legal-details');
    }
    if (sisSlaveryrep === 'No'){
      res.redirect('/purple/current/task/main/slavery/victim/detained');
    }
    if (sisSlaveryrep === 'I do not know'){
      res.redirect('/purple/current/task/main/slavery/victim/detained');
    }
    })

    // SIS - modern slavery - legal rep 2
  router.post('/sis-slavery-legal2', function (req, res) {

    // address branching
    var sisSlaveryrep = req.session.data['sis-slavery-legal2']
  
    // Check whether the variable matches a condition
    if (sisSlaveryrep === 'Yes'){
      res.redirect('/purple/current/task/main/slavery/victim/legal-details2');
    }
    if (sisSlaveryrep === 'No'){
      res.redirect('/purple/current/task/main/slavery/victim/detained2');
    }
    if (sisSlaveryrep === 'I do not know'){
      res.redirect('/purple/current/task/main/slavery/victim/detained2');
    }
    })

    // SIS - Funds error state
router.post('/sis-funds', function (request, response) {

  var sisFunds = request.session.data['sis-funds']
  if (sisFunds.includes("")){
    response.redirect("/purple/current/task/list");
  } else {
    response.redirect("/purple/current/task/list")
  }
})





// SIS - IDP document routing 
router.post('/idp-crime-route', function (req, res) {

  // Make a variable and give it the value
  var IDPdocroute = req.session.data['sis-main-doc-details']

  // Check whether the variable matches a condition
  if (IDPdocroute === 'Yes'){
    res.redirect('/purple/current/task/person/idp/same-details');
  } else {
    res.redirect('/purple/current/task/person/idp/details');
  }

})
// SIS - IDP document routing 
router.post('/idp-doc-route', function (req, res) {

  // Make a variable and give it the value
  var IDPdocroute = req.session.data['sis-main-doc-details']

  // Check whether the variable matches a condition
  if (IDPdocroute === 'Yes'){
    res.redirect('/purple/current/task/person/idp/same-details');
  } else {
    res.redirect('/purple/current/task/person/idp/details');
  }

})
// SIS - IDP document 2 routing 
router.post('/idp-doc-route2', function (req, res) {

  // Make a variable and give it the value
  var IDPdocroute2 = req.session.data['sis-main-doc-details2']

  // Check whether the variable matches a condition
  if (IDPdocroute2 === 'Yes'){
    res.redirect('/purple/current/task/person/idp/same-details2');
  } else {
    res.redirect('/purple/current/task/person/idp/details');
  }

})

// SIS - IDP document routing 
router.post('/idp-doc-same-route', function (req, res) {

  // Make a variable and give it the value
  var IDPentereedBefore = req.session.data['entered-before']

  // Check whether the variable matches a condition
  if (IDPentereedBefore === 'Yes'){
    res.redirect('/purple/current/task/person/idp/which-doc');
  } else {
    res.redirect('/purple/current/task/person/idp/details');
  }

})
// SIS - IDP document 2 routing 
router.post('/idp-doc-same-route2', function (req, res) {

  // Make a variable and give it the value
  var IDPentereedBefore = req.session.data['entered-before-2']

  // Check whether the variable matches a condition
  if (IDPentereedBefore === 'Yes'){
    res.redirect('/purple/current/task/person/idp/which-doc2');
  } else {
    res.redirect('/purple/current/task/person/idp/details2');
  }

})
// SIS - IDP connecting flight routing 
router.post('/connecting-flight', function (req, res) {

  // Make a variable and give it the value
  var IDPconnecting = req.session.data['connecting']

  // Check whether the variable matches a condition
  if (IDPconnecting === 'Yes'){
    res.redirect('/purple/current/task/main/idp/details2');
  } else {
    res.redirect('/purple/current/task/main/idp/payment');
  }

})
// SIS - IDP additional booking details routing 
router.post('/idp-booking-more', function (req, res) {

  // Make a variable and give it the value
  var IDPbookingMore = req.session.data['booking-more']

  // Check whether the variable matches a condition
  if (IDPbookingMore === 'Yes'){
    res.redirect('/purple/current/task/main/idp/payment2');
  } else {
    res.redirect('/purple/current/task/main/idp/list');
  }

})

// SIS - CT - location event happening
router.post('/event-happening', function (req, res) {

  // Make a variable and give it the value
  var Eventhappening = req.session.data['event-happening']

  // Check whether the variable matches a condition
  if (Eventhappening === 'Yes'){
    res.redirect('/purple/current/task/main/terrorism/event');
  } else {
    res.redirect('/purple/current/task/main/terrorism/list');
  }

})

// SIS - CT - location event happening 2
router.post('/event-happening2', function (req, res) {

  // Make a variable and give it the value
  var Eventhappening2 = req.session.data['event-happening2']

  // Check whether the variable matches a condition
  if (Eventhappening2 === 'Yes'){
    res.redirect('/purple/current/task/main/terrorism/event2');
  } else {
    res.redirect('/purple/current/task/main/terrorism/list');
  }

})

// SIS - Rep abuse - second client in the UK
router.post('/rep-in-uk', function (req, res) {

  // Make a variable and give it the value
  var Client2 = req.session.data['sis-rep-suspect2']

  // Check whether the variable matches a condition
  if (Client2 === 'Client'){
    res.redirect('/purple/current/task/main/rep/uk2');
  } else {
    res.redirect('/purple/current/task/list');
  }

})
// SIS - Deception - visa type
router.post('/deception-visa', function (req, res) {

  // Make a variable and give it the value
  var Deception2 = req.session.data['sis-person2-info']

  // Check whether the variable matches a condition
  if (Deception2 === 'yes'){
    res.redirect('/purple/current/task/main/deception/details2');
  } else {
    res.redirect('/purple/current/task/main/deception/list');
  }

})
 
// SIS - Terrorism - indicators start page
router.post('', function (req, res, next) {
 
  // Make a variable and give it the value
var terrorismIndicators = req.session.data['terrorism-indicators'];
var BehaviourDetail = req.session.data['sis-terrorism-behaviours-done'];
var IDDetail = req.session.data['sis-terrorism-id-done'];
var ExtremistDetail = req.session.data['sis-terrorism-extremist-done'];
var MoneyDetail = req.session.data['sis-terrorism-money-done'];
var PropertyDetail = req.session.data['sis-terrorism-property-done'];
var TravelDetail = req.session.data['sis-terrorism-travel-done']
  for (let i=0; i<terrorismIndicators.length; i++) {
  if (terrorismIndicators[i]=='Behaviours' && BehaviourDetail != "Yes" )
  {res.redirect('/purple/current/task/main/terrorism/travel/behaviours');}
  else if (terrorismIndicators[i]=='Identity and travel documents' && IDDetail != "Yes")
  {res.redirect('/purple/current/task/main/terrorism/travel/travel-docs');}
  else if (terrorismIndicators[i]=='Links to extremist groups' && ExtremistDetail != "Yes")
  {res.redirect('/purple/current/task/main/terrorism/travel/extremist-groups');}
  else if (terrorismIndicators[i]=='Money and funds' && MoneyDetail != "Yes")
  {res.redirect('/purple/current/task/main/terrorism/travel/money');}
  else if (terrorismIndicators[i]=='Personal property' && PropertyDetail != "Yes")
  {res.redirect('/purple/current/task/main/terrorism/travel/property');}
  else if (terrorismIndicators[i]=='Travel history' && TravelDetail != "Yes")
  {res.redirect('/purple/current/task/main/terrorism/travel/travel-pattern');}
  else if (terrorismIndicators[i]=='None of the above')
  {res.redirect('/purple/current/task/list');}
  else
  {res.redirect('/purple/current/task/list');}
}})


router.post('/task/main/terrorism/travel/terrorism-start-route', function (req, res) {
  // Get and set initial variables.
  let terrorismIndicators = req.session.data['terrorism-indicators'];
  // Set var to hold text list of document types.
  let IndicatorList = new Array();
  // Define the variable and make sure its reset every time a user returns to this route (because they select again).
  let parsedTerrorismIndicators = new Array();
  // Catch any items where '_unchecked' gets put in the array.
  for(i = 0; i < terrorismIndicators.length; i++) {
    if(terrorismIndicators[i]!="_unchecked") {
      parsedTerrorismIndicators.push(terrorismIndicators[i]);
    }
  }
  // Set text list of documents for check answers.
  //req.session.data["person-1-identity-document-type"] = docTypes;
  // Create new session data to hold the identity documents for check answers.
  req.session.data["terrorism-indicators-list"] = parsedTerrorismIndicators;
  // Set the first document to navigate to.
  let nextIndicator = parsedTerrorismIndicators[0];
  //remove the identity document we are going to next.
  parsedTerrorismIndicators.shift();
  // Set new session data to hold the remaining identity documents.
  req.session.data["terrorism-indicators-nav"] = parsedTerrorismIndicators;
  // Go to the next document.
  res.redirect(nextIndicator);
})

router.post('/task/main/terrorism/travel/terrorism-check-route', function (req, res) {
  if (req.session.data["terrorism-indicators-nav"]) {
    let remainingIndicators = Array.from(req.session.data["terrorism-indicators-nav"]);
    if (remainingIndicators.length > 0) {
      let nextIndicator = remainingIndicators[0];
      //remove the identity document we are going to next.
      remainingIndicators.shift();
      // Update session data to hold the remaining identity documents.
      req.session.data["terrorism-indicators-nav"] = remainingIndicators;
      res.redirect(nextIndicator);
    } else{
      res.redirect('/purple/current/task/main/terrorism/travel/list.html');

    }
  } else {
    res.redirect('/purple/current/task/main/terrorism/travel/list.html');
  }
})

// SIS - Terrorism - indicators start page
router.post('/', function (req, res) {
 
  // Make a variable and give it the value
var terrorismIndicators = req.session.data['terrorism-indicators']
var BehaviourDetail = req.session.data['behaviours-detail']
  for (let i=0; i<terrorismIndicators.length; i++) {
  if (terrorismIndicators[i]=='Behaviours' && BehaviourDetail != "" )
  {res.redirect('/purple/current/task/main/terrorism/travel/behaviours');}
  else if (terrorismIndicators[i]=='Identity and travel documents' && !req.session.data['travel-docs-detail'])
  {res.redirect('/purple/current/task/main/terrorism/travel/travel-docs');}
  else if (terrorismIndicators[i]=='Links to extremist groups' && !req.session.data['extremist-group-detail'])
  {res.redirect('/purple/current/task/main/terrorism/travel/extremist-groups');}
  else if (terrorismIndicators[i]=='Money and funds' && !req.session.data['money-detail'])
  {res.redirect('/purple/current/task/main/terrorism/travel/money');}
  else if (terrorismIndicators[i]=='Personal property' && !req.session.data['property-detail'])
  {res.redirect('/purple/current/task/main/terrorism/travel/property');}
  else if (terrorismIndicators[i]=='Travel history' && !req.session.data['travel-pattern-detail'])
  {res.redirect('/purple/current/task/main/terrorism/travel/travel-pattern');}
  else if (terrorismIndicators[i]=='None of the above')
  {res.redirect('/purple/current/task/list');}
 else
  {res.redirect('/purple/current/task/list');}
}})

// SIS - Housing - permission - multiple people
router.post('/housing-tenant-permission', function (req, res) {

  // Make a variable and give it the value
  var Housing2 = req.session.data['sis-housing-person2']

  // Check whether the variable matches a condition
  if (Housing2 === 'Tenant or lodger living in the accommodation'){
    res.redirect('/purple/current/task/main/housing/visa-type2');
  } else {
    res.redirect('/purple/current/task/list');
  }

})


// SIS - Overstaying details - CYA logic 
router.post('/overstayer-visa-route', function (req, res) {

  // Make a variable and give it the value
  var Overstaying2 = req.session.data['sis-overstayer-person2']
  var SecondaryRole = req.session.data['secondary-offence-role']


  // Check whether the variable matches a condition
  if (Overstaying2 === 'Suspect or offender overstaying their visa'){
    res.redirect('/purple/current/task/main/overstayer/details2.html');
  } 
  if (SecondaryRole == 'Someone else'){
    res.redirect('/purple/current/task/main/overstayer/details2.html');
  } 
  else {
    res.redirect('/purple/current/task/list');
  }

})


// SIS - Housing - permission - multiple people
router.post('/seized-detained', function (req, res) {

  // Make a variable and give it the value
  var Seized = req.session.data['sis-main-docs-seized']

  // Check whether the variable matches a condition
  if (Seized === 'Neither seized or detained'){
    res.redirect('/purple/current/task/main/docs/details/list');
  } 
  if (Seized === 'I do not know'){
    res.redirect('/purple/current/task/main/docs/details/list');
  } 
  
  else {
    res.redirect('/purple/current/task/main/docs/details/date');
  }

})

// SIS - Sham marriage - secondary offence address routing
router.post('/marriage-secondary-route', function (req, res) {

  // Make a variable and give it the value
  var sisSuboffence = req.session.data['sub-crime']

  // Check whether the variable matches a condition
  if (sisSuboffence === 'marriage'){
    res.redirect('/purple/current/task/main/marriage/list');
  } 
  else {
    res.redirect('/purple/current/task/main/marriage/secondary-role');
  }

})

// SIS - Breach - secondary offence routing
router.post('/breach-secondary', function (req, res) {

  // Make a variable and give it the value
  var sisSuboffence = req.session.data['sub-crime']

  // Check whether the variable matches a condition
  if (sisSuboffence === 'conditions'){
    res.redirect('/purple/current/task/main/breach/details2');
  } 
  else {
    res.redirect('/purple/current/task/main/breach/work');
  }

})

// SIS - Breach - secondary offence routing
router.post('/breach-secondary-two', function (req, res) {

  // Make a variable and give it the value
  var sisSuboffence = req.session.data['sub-crime']

  // Check whether the variable matches a condition
  if (sisSuboffence === 'conditions'){
    res.redirect('/purple/current/task/main/breach/list');
  } 
  else {
    res.redirect('/purple/current/task/main/breach/work2');
  }

})

// SIS - document fraud secndary offence
router.post('/document-fraud-secondary', function (req, res) {

  // Make a variable and give it the value
  var sisSuboffence = req.session.data['sub-crime']

  // Check whether the variable matches a condition
  if (sisSuboffence === 'document-fraud'){
    res.redirect('/purple/current/task/main/docs/add/doc-discovery-secondary');
  } 
  else {
    res.redirect('/purple/current/task/main/docs/add/list');
  }

})


// SIS - Illegal working - add secondary offence person
router.post('/working-secondary-person', function (req, res) {

  // Make a variable and give it the value
  var SecondaryRole = req.session.data['secondary-offence-role']

  // Check whether the variable matches a condition
  if (SecondaryRole == 'Someone else'){
    res.redirect('/purple/current/task/person/secondary-person');
  } 
  else {
    res.redirect('/purple/current/task/main/working/link');
  }

})

// SIS - Sham marriage - add secondary offence person
router.post('/marriage-secondary-person', function (req, res) {

  // Make a variable and give it the value
  var SecondaryRole = req.session.data['secondary-offence-role']

  // Check whether the variable matches a condition
  if (SecondaryRole == 'Someone else'){
    res.redirect('/purple/current/task/person/secondary-person');
  } 
  else {
    res.redirect('/purple/current/task/main/marriage/date');
  }

})

// SIS - Breach of conditions - add secondary offence person
router.post('/clandestine-secondary-person', function (req, res) {

  // Make a variable and give it the value
  var SecondaryRole = req.session.data['secondary-offence-role']

  // Check whether the variable matches a condition
  if (SecondaryRole == 'Someone else'){
    res.redirect('/purple/current/task/person/secondary-person');
  } 
  else {
    res.redirect('/purple/current/task/main/clandestine/date');
  }

})
// SIS - Breach of conditions - add secondary offence person
router.post('/overstayer-secondary-person', function (req, res) {

  // Make a variable and give it the value
  var SecondaryRole = req.session.data['secondary-offence-role']

  // Check whether the variable matches a condition
  if (SecondaryRole == 'Someone else'){
    res.redirect('/purple/current/task/person/secondary-person');
  } 
  else {
    res.redirect('/purple/current/task/main/overstayer/details');
  }

})

// SIS - Breach of conditions - add secondary offence person
router.post('/breach-secondary-person', function (req, res) {

  // Make a variable and give it the value
  var SecondaryRole = req.session.data['secondary-offence-role']

  // Check whether the variable matches a condition
  if (SecondaryRole == 'Someone else'){
    res.redirect('/purple/current/task/person/secondary-person');
  } 
  else {
    res.redirect('/purple/current/task/main/breach/details');
  }

})

// SIS - Rep abuse - add secondary offence person
router.post('/rep-secondary', function (req, res) {

  // Make a variable and give it the value
  var SecondaryRole = req.session.data['secondary-offence-role']

  // Check whether the variable matches a condition
  if (SecondaryRole == 'Someone else'){
    res.redirect('/purple/current/task/main/rep/person-business.html');
  } 
  else {
    res.redirect('/purple/current/task/list');
  }
})

// SIS - Rep abuse - add secondary offence person
router.post('/rep-secondary-person', function (req, res) {

  // Make a variable and give it the value
  var SecondaryRole = req.session.data['rep-details']

  // Check whether the variable matches a condition
  if (SecondaryRole == 'Details about a person'){
    res.redirect('/purple/current/task/person/secondary-person');
  } 
  else {
    res.redirect('/purple/current/task/business/secondary-business');
  }

})

// SIS - Housing - add secondary offence person
router.post('/housing-secondary-person', function (req, res) {

  // Make a variable and give it the value
  var SecondaryRole = req.session.data['secondary-offence-role']

  // Check whether the variable matches a condition
  if (SecondaryRole == 'Someone else'){
    res.redirect('/purple/current/task/person/secondary-person');
  } 
  else {
    res.redirect('/purple/current/task/main/housing/link');
  }

})

// SIS - Deception - add secondary offence person
router.post('/deception-secondary-person', function (req, res) {

  // Make a variable and give it the value
  var SecondaryRole = req.session.data['secondary-offence-role']

  // Check whether the variable matches a condition
  if (SecondaryRole == 'Someone else'){
    res.redirect('/purple/current/task/person/secondary-person');
  } 
  else {
    res.redirect('/purple/current/task/main/deception/details');
  }

})

// SIS - Deception - add secondary offence person
router.post('/facilitation-secondary-person', function (req, res) {

  // Make a variable and give it the value
  var SecondaryRole = req.session.data['secondary-offence-role']

  // Check whether the variable matches a condition
  if (SecondaryRole == 'Someone else'){
    res.redirect('/purple/current/task/person/secondary-person');
  } 
  else {
    res.redirect('/purple/current/task/main/facilitation/date');
  }

})

// SIS - Secondary offence person - route
router.post('/secondary-person-details', function (req, res) {

  // Make a variable and give it the value
  var sisSuboffence = req.session.data['sub-crime']

  // Check whether the variable matches a condition
  if (sisSuboffence === 'illegal-working'){
    res.redirect('/purple/current/task/main/working/link');
  } 
  if (sisSuboffence === 'marriage'){
    res.redirect('/purple/current/task/main/marriage/date');
  } 
  if (sisSuboffence === 'conditions'){
    res.redirect('/purple/current/task/main/breach/details');
  } 
  if (sisSuboffence === 'clandestine'){
    res.redirect('/purple/current/task/main/clandestine/date');
  } 
  if (sisSuboffence === 'overstayer'){
    res.redirect('/purple/current/task/main/overstayer/details');
  } 
  if (sisSuboffence === 'rep-abuse'){
    res.redirect('/purple/current/task/main/rep/list');
  } 
  if (sisSuboffence === 'housing'){
    res.redirect('/purple/current/task/main/housing/link');
  } 
  if (sisSuboffence === 'deception'){
    res.redirect('/purple/current/task/main/deception/details');
  } 
  if (sisSuboffence === 'facilitation'){
    res.redirect('/purple/current/task/main/facilitation/list');
  } 
  else {
    res.redirect('/purple/current/task/list');
  }

})
