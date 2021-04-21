# Interview Scheduler

Interview scheduler is a single-page app that allows students to set up interviews with a list of interviewers for a specified time-slot. Users can see all available and booked spaces, can edit or delete appointments, and can add their own appointments. This data is synchronized for all users via Websockets. This is a React project, utilizing Jest and Cypress for testing. Hosting is provided by Heroku (database) and Netlify (front-end).

## Final Product

!["Show Appointments"](https://github.com/DavidRadvan/scheduler/blob/master/project_screenshots/show_appointments.png)
!["Create Appointment"](https://github.com/DavidRadvan/scheduler/blob/master/project_screenshots/create_appointments.png)
!["Delete Appointment"](https://github.com/DavidRadvan/scheduler/blob/master/project_screenshots/delete_appointments.png)

## Setup

Install dependencies with `npm install`.

You can also access the project through the netlify-hosted application at https://607f85ac2a20583f9483dc6e--nifty-nobel-521f53.netlify.app/

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
