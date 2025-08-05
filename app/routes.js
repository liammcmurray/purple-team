// 
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
// 

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const fs = require('fs')

// Add your routes here

router.post('*', function(req, res, next) {
  // This function redirects if any part of the data contains a '~'

  // This is usually used for radio buttons, by setting the value to "yes~/page/to/redirect/to"
  // in the format '<value>~<redirect URL>'

  const obj = Object.keys(req.body).length ? req.body : req.query;
  for (const k in obj) {
    const v = obj[k];
    console.log(v)
    if ((typeof v === 'string') && (v.includes('~'))) {
      const parts = v.split('~');
      req.session.data[k] = parts[0];
      const href = parts[1];
      console.log(`Found '~': redirecting to ${href}`)
      return res.redirect(href);
    }
  }
  next();
})

router.get('*', function (req, res, next) {

  // These functions are available on all pages in the prototype.
  // To use call the function inside curly brackets, for example {{ example_function() }}

  // Examples of date
  //
  // {{ date() }} shows todays date in the format 5 May 2022
  // {{ date({day: 'numeric', month: 'numeric', year: 'numeric'}) }} shows todays date in the format 05/05/2022
  // {{ date({day: 'numeric'}) }} shows the just the date of date, 5
  // {{ date({day: '2-digit'}) }} shows the date with a leading zero, 05
  // {{ date({day: 'numeric'}, {'day': -1}) }} shows just the date of yesterday
  // {{ date({weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'}) }} shows todays date in the format Tuesday, 5 July 2022.
  // {{ date({day: 'numeric', month: 'numeric', year: 'numeric'}, {'day': +2}) }} 
  res.locals.date = function (format = {day: 'numeric', month: 'long', year: 'numeric'}, diff = {'year': 0, 'month': 0, 'day': 0}) {
    var date = new Date();
    if ('day' in diff) {
      date.setDate(date.getDate() + diff.day)
    }
    if ('month' in diff) {
      date.setMonth(date.getMonth() + diff.month)
    }
    if ('year' in diff) {
      date.setYear(date.getFullYear() + diff.year)
    }
    const formattedDate = new Intl.DateTimeFormat('en-GB', format).format(date);
    return `${formattedDate}`
 }

 // Examples of today
 //
 // Useful for pre-populating date fields
 //
 // {{ today().day }} shows just todays day
 // {{ today().month }} shows just todays month as a number
 // {{ today().year }} shows just todays year as a number
 res.locals.today = () => (
    {"day": res.locals.date({'day': 'numeric'}),
           "month": res.locals.date({'month': 'numeric'}),
           "year": res.locals.date({'year': 'numeric'})}
  )

  // Examples of yesterday
  //
  // Useful for pre-populating date fields
  //
  // {{ yesterday().day }} shows just todays day
  // {{ yesterday().month }} shows just todays month as a number
  // {{ yesterday().year }} shows just todays year as a number
 res.locals.yesterday = () => (
    {"day": res.locals.date({'day': 'numeric'}, diff = {'day': -1}),
            "month": res.locals.date({'month': 'numeric'}, diff = {'day': -1}),
            "year": res.locals.date({'year': 'numeric'}, diff = {'day': -1})}
   )

 res.locals.keycloakSignOutUrl = process.env.KEYCLOAK_SIGN_OUT_URL;
  
 next()
})


// Version 2 - support request page
router.post('/version1/support-request', function (req, res) {
  // Get the answer from session data
  // The name between the quotes is the same as the 'name' attribute on the input elements
  // However in JavaScript we can't use hyphens in variable names

  const support = req.session.data['support']

  if (support === 'team') {
    res.redirect('/version1/support-team-request')
  } else {
    res.redirect('/version1/support-request')
  }
})
 
router.get('/clear-photos', function(req, res) {
  fs.rm('./.tmp/public/uploads', {'recursive': true, 'force': true}, err => err ? console.log(err) : null)
  res.redirect('/')
})


// SIS / Purple
require('./views/_routes')
