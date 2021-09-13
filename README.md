- [Spotlist Challenge](#spotlist-challenge)
  - [Project configuration](#project-configuration)
    - [Technical requirements](#technical-requirements)
    - [Install project](#install-project)
    - [Start development environment](#start-development-environment)
    - [Build project](#build-project)
    - [Serve](#serve)
    - [Testing](#testing)
      - [Unit test](#unit-test)
        - [Unit test watch mode](#unit-test-watch-mode)
      - [API Integration test](#api-integration-test)
  - [Project structure](#project-structure)
  - [Project architecture](#project-architecture)
    - [Use case flow](#use-case-flow)
    - [Middlewares](#middlewares)
      - [isUserAuthorized](#isuserauthorized)
      - [errorHandler](#errorhandler)
    - [Dependency injection](#dependency-injection)
    - [Utils](#utils)
    - [Repositories](#repositories)
  - [Thoughts](#thoughts)

# Spotlist Challenge

Spotlist is a new indie music company that aims to provide better relationships with small artists, this is the first version of its awesome API.

## Project configuration

### Technical requirements

- NodeJS v15.4 with Npm > 7

### Install project

Go to the spotlist-api directory and run:

```
npm install
```

By running this command you will install all the needed dependencies for development and build the app for production.

### Start development environment

To start the development environment, you should go to the spotlist-api directory and run:

```
npm start
```

This command will start a new process with nodemon that will restart the server every time we make changes inside the source code (src)

### Build project

To build the production code compiling to NodeJS, we will need to go to spotlist-api directory and execute the following command:

```
npm run build
```

This command will compile the typescript with the production config for typescript extending the default one

### Serve

To run the app in production mode, go to spotlist-api directory and execute the following command:

*First off all you will need to build the project.

```
npm run serve
```

This command will compile the typescript with the production config for typescript extending the default one


### Testing

We have two kind of testing:

#### Unit test

To run the unit tests, you should go to the spotlist-api directory and run:

```
npm test
```

This command will execute all the suite tests that are inside the test directory


##### Unit test watch mode

```
npm run test:watch
```

This command will execute all the suite tests that are inside the test directory with watching mode, so every time we change something in the test, it will relaunch it the tests

#### API Integration test

To run the API integration test, you should go to the spotlist-api directory and run:

```
npm run integration
```

This command will bootstrap the server by building the source code and execute it from node process, then it will check if the server is ready by calling the `/_healthz` check endpoint and start executing cypress tests.


## Project structure

```
- src 
    - Context
      - Application
        - UseCases
      - Domain
        - Types and contracts (interfaces)
      - Infrastucture
        - Implementations (repositories)
        - Http (routes, middlewares)
        - Resources (data fixtures)
        - Utils (shared utilities)
        - Errors (error definitions)
    - app (express application)
    - index (express server)
- test
    - same structure as above 
```

Another relevant things:

- check node version script, this script will check if the developer uses the correct version of NodeJS.
- configuration files for jest, ts, nodemon

## Project architecture

Based in a layered architecture 

### Use case flow

Each use case tries to solve a need of a user.

```
http request --> controller (infrastructure) --> use case (application) --> repository (domain)
```

### Middlewares

#### isUserAuthorized

This middleware is responsible to validate a given user credentials by verifying the credentials received from headers and calling the loginUseCase to check if they are correct 

* we use basic access authentication https://en.wikipedia.org/wiki/Basic_access_authentication 

#### errorHandler

When a controller or any middleware calls next with an Error, this middleware will receive that error and check if the error is one of HttpError or a generic Error.

- In case it receives an HttpError 
  - If they are not 500 or above, we assume that is an application error, so we won't log them, we just return the response error.
  - In case they are 500 or above, we log as exception and return the error response
- In case it receives a generic Error
  - We assume is an exception, log them and return a generic internal server error.

### Dependency injection

I've instantiate every use case in the same module where they are coded, so in each *UseCase.ts you will find:

- The class itself
- A default export with the instantion of the class (it serves as singleton useful for the inmemory repositories)
- A named export with the Class so I can test it easily using mocks or stubs for its dependencies

### Utils

I've created an IdentityManager to handle uuid automatic generation, so I can use it as dependency in the use cases that may need this collaborator.

* In this case I didn't use an implementation of a contract, that IdentityManager is coupled with an uuid library (this won't change in the future).

### Repositories

We use in memory repositories that implements an interface, so our use cases that only knows about that interfaces will be able to use any implementation that fullfills those contracts.

## Thoughts

In general terms I liked the challenge a lot. It was not very long in time despite of my limited time.

Although there were some instructions that confused me

- We are required to ensure a strong password, but I don't have requirements of what should be a strong password and also we were provided with some users as fixture, so I've take a tradeoff ignoring this requirement and using these users fixtures as valid ones.
- Some of the Exceptions described in swagger confused me a bit, for example why we don't use a 404 to return as response when a listId of a given userId is not found? but I tried to follow the specifications.

---- 
- Some workarounds like not using a container dependency injection by instantiating each use case in the same module may confuse a bit, I know but I assume that tradeoff, in production code at least I would move that in another module like a factory module.
- I didn't check well the swagger specifications and I had to modify all the controllers responses to fit with them, it was not a good idea to start quickly the development without taking care of that.
- I didn't use TDD to create the use cases as they were clear enough at the first moment, I use TDD to help me discover the design of some complex scenarios but not for this ones (at least for this case we I was playing a bit with the challenge)