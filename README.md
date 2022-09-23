# Udacity Capstone - Manuals Repository

## About The Project

A simple Manual Repository for home appliances implemented with the AWS Lambda and Serverless framework, for the final project of the Udacity Cloud Developer Nanodegree.

## Application functionality

The application will allow an authenticated user to view a list of previouly uploaded manuals, create/upload new manuals, remove and edit exiting manuals.

The application only accepts pfd manuals and will show a small preview that can be expanded and downloaded.

## Prerequisites

* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://github.com" target="_blank">GitHub account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx
* Serverless

  * Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
  * Install the Serverless Framework’s CLI  (up to VERSION=2.21.1). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.

  ```bash
  npm install -g serverless@2.21.1
  serverless --version
  ```

  * Login and configure serverless to use the AWS credentials

  ```bash
  # Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
  serverless login
  # Configure serverless to use the AWS credentials to deploy the application
  # You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
  sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
  ```

## Client Installation

1. cd into frontend folder, then install all dependencies

```sh
  cd frontend
  npm install
```

2. start the client app, local react server will run at http://localhost:3000

```sh
  npm run dev
```

## Authentication

[Auth0](https://auth0.com/) is used to manage data access and user sign in/sing out.
Client will need to present the auth0 idToken in the http header like `Authentication = Bearer {{idToken}}`

## Backend

The backend is configured using [Serverless](https://www.serverless.com) framework deployed on the AWS platform

Here are all the endpoints:

- GET - /manuals (get all manual items)
- POST - /manuals (create a new manual item)
- PUT - /manuals/{manualId} (update an existing manual item)
- DELETE - /manuals/{manualId} (delete a manual item)
- GET - /manuals/{manualId}/image-url (get pdf file upload url)

The serverless CLI is required to deploy the backend with valid AWS credential setup (see above).

```sh
serverless deploy
```

## CI/CD

The CI/CD process for this project is implemented via Github Actions with the use of the serverless marketplace plugin. Every code push to the `main` branch will trigger the an automatic build and deply wto AWS.

## For the Udacity Reviewers

The project is designed to fulfil the following options:

- (Option 1): CI/CD, Github & Code Quality
- (Option 2): Functionality
- (Option 2): Codebase
- (Option 2): Best practices
- (Option 2): Architecture

Screenshots showing all the above criteria satisfied are in the `screenshots` folder
