This is a secure to share version of the CPCN website and API project.

## Deployed on Heroku

Access the live version of this application under [https://cpcn.herokuapp.com/](https://cpcn.herokuapp.com/).

It will take a couple of seconds to start up the server at the first request.

Unfortunately, you can not run this project locally yet.

## The goal of the project

Create a web application which can serve as a community website for the official Chodsky Pes Club Nederland that allows the administration to share news, update kennel information and recieve online applications via form.

My goal with this project was to write a scalable full-stack application that can possibly handle future implementations of features such as user login, user profile, event RSVP, social interactions like comments, likes and sharing of media.

## Wesbite features

The web application allows the visitors to:

- list the upcoming club events,
- list the latest kennel news,
- get an extended overview of the Chodksy Pes Breed,
- get to know the CPCN club board members and message them,
- contact the club using the contact form in the footer section,
- access the club's gallery,
- learn about breeding and kennels in the Netherlands and abroad,
- send a membership application to the CPCN,
- get an overview of the application form inputs and the estimated membership fee,
- recieve a confirmation email after sending an application with the membership fee and the payment instructions included.

The web application allows the administrators to:

- log into the website using the registered email address and password,
- delete older or post new events on the `/administration` page under the `evenementen` tab,
- delete older or post news on the `/administration` page under the `niews` tab,
- upload images to the gallery on the `/administration` page under the `galerij` tab,
- change the membership fees on the `/administration` page under the `lidmaatschap` tab,
- change the login email and password on the `/administration` page under the `profiel` tab,

## Testing the login functionality

The login and logout functionality is powered by ancrypted JSON Web Tokens (JWT). JWT is a stateless solution for authentication, which is perfect for stateless RESTful API like the one behind this web application.

When the user sends a POST request to the /login page, the server checks if the user exists and the password is correct and creates a unique JWT and sends it to the client via cookie. When trying to access protected routes requiring authentication, the client sends the JWT aside the request to the route and there it gets verified. All this runs under https to keep the system secure.

When logged in as an administrator or tester the user gains access to the `/administration` page.

To test this functionality you can log into the website under [https://cpcn.herokuapp.com/login](https://cpcn.herokuapp.com/login) with the following credentials:

Email Adres: `visitor@cpcn.com`
Password: `visitor1234`

## Testing the API

The API sends back a response formatted in JSend. The data is in a JSON format.

To test the API send the following requests to these endpoints:

- GET: https://cpcn.herokuapp.com/api/v1/events => get all club events
- GET: https://cpcn.herokuapp.com/api/v1/pups => get all puppy news
- POST: https://cpcn.herokuapp.com/api/v1/events => this route is protected, the response status is fail, authentication is required

## Code architecture: MVC

In this project I have structured the application according to the Model-View-Controller (MVC) architecture based on the following principles:

- Models: everything concerning the app's data, responsible for the business logic
- Controllers: manage the app's requests, interact with models and send responses, bridge between model and view layers
- Views: the app is server-side rendered, so it uses templates to generate the website sent back to the client, one template for each page

Due to the MVC architecture the application is modular and easy to add more layers of abstraction.

## The front-end

### Styling

The website is styled using fully custom SASS using BEM (Block-Element-Modifier) naming convention.

Find the SASS files used in the `/sass` folder.

The SASS modules are compiled using node-sass and prefixed using the autoprefixer npm packages.

The styling contains:

- keyframes and custom SVG animations,
- SASS variables and mixins for "DRY" code,
- media queries for responsivity,
- CSS grid and flexbox for layouts

### Client-side Javascript

To write client-side Javascript I have used parcel to package multiple ES6 modules written to handle a certain interaction with the page.

Find the Javascript files used in the `/public/js` folder.

Most of the code is responsible for sending HTTP requests from the client-side and displaying feedback messages for the user based on the response. The `alert.js` file contains the conditional feedback message rendering functionality.

The `join.js` file contains the functionality for the join form to add and remove limited amount of family members and dogs in the application form, get the inputs (`returnFamMemInputs( )`, ``) and render (`addOverview( )`, `overviewTableMarkup( )`) them on an overview modal in the next stage of the application process.

The `calculateFees( )` in `membership.js` retrieves the membership fee information from the database and calculates a fee based on the date of the application, the family members' age, number and the dogs added.

## The back-end

### The "join us" process

The website enables users to apply for a membership using the form under page `/join`.

- The applicant's data is stored in the `members collection` based on the schema defined `models/memberModel.js` with a unique ID.
- If the form is valid, the user can move on to preview the inputs by pressing `volgende stap` at the bottom of the form.
- The overview page is formatted dynamically based on the number of family members and dogs registered on the client-side using the functions defined in `public/js/join.js`.
- The membership fee is automatically calculated based on the inputs on the client-side using the functions defined in `public/js/membership.js` and the data from the `membership collection` of the database
- After clicking `indienen` at the bottom of the overview modal the application data is sent to the club's administration email based on the template `views/emails/details.pug` and a confirmation is send to the applicant using the `views/emails/welcome.pug` containing the calculated membership fee

### Mongoose models

To store all instances required for the website, I have created different collections for each named according to the type of data.

The website currently uses 6 different collections.

Each collections' data is defined based on Mongoose schemas found in `/models`.

### From incoming request to sending response in MVC

An incoming request first hits the router, one for each resource, and delegated the request to the controller which runs the correct handler function. Based on the type of request the controller function will interact with the model of the resource. Now the controller is ready to send back a response. If there is a view attached, the data is injected in the requested template and sent to be rendered for the client.

### Fat models/thin controllers

To keep the controllers clean and simple, I have offloaded as much logic as possible into the models when refractoring the code. This way it is ensured that the controllers are simply bridges between models and views for each resource. The `/controllers/handleFactory.js` file is responsible to keep the all the other controllers dry, avoiding repeating code for fulfilling similar requests and sending responses formatted in JSend.

### Security

- Error handling in production: no error information leaked to user
- User password saved to database encrypted
- User password reset token saved to database encrypted
- JWT password reset token expires in 10 minutes when sent to user via email
  rate limiting: blocks user requests over 100/hour (express-rate-limit npm package)
- Data sanitization: clean user input (mongoSanitize, xss-clean npm packages)
- Parameter pollution prevention for clean query strings (hpp npm package for deleteing duplicate queries (no whitelist))
- Strongly encrypted passwords with lenght over 8 characters
- bcrypt npm package for slow login request
- JWT stored in HTTPOnly cookies, expires in 24 hours
- highly defined Mongoose Schemas for safe database documents with custom validation if required

### Error handling

- Global error handling middleware inside `controllers/errorController.js`: marks operational errors, separates 400 errors, handles development and production error messages
- MongoDB built in error handling: duplicate fields etc.
- Express error handling and outside express errors: uncaught exceptions and unhandled erejections
- Error handling in production: no error information leaked to user, only meaningful error message is rendered
- Error handling in development: extended message and stack information to help locate bugs
