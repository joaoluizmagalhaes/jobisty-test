# Calendar Reminder (Jobisty Test)

## Description
This project was developed as part of the Jobisty test. It's a calendar application built using the Quasar framework, leveraging Vue 3, Composition API, Vite, Pinia for state management, and Tailwind CSS for styling.

## Key Features
- Calendar view and reminder management
- Utilizes Quasar for material design components
- Efficient use of Vue 3's Composition API and Script Setup
- State management with Pinia
- Custom styling with Tailwind CSS

## Prerequisites
Before starting, ensure you have Node.js and Yarn (or npm) installed on your machine.

## Installation

To install the project dependencies, run:

```bash
yarn
# or
npm install

## Configuration

### .env File
This project requires an `.env` file for environment variables. You need to create this file in the root of the project.

#### Required Environment Variables
- `VITE_OPEN_WEATHER_API_KEY`: Your API key for the OpenWeather API.
```
I've also added a .env.example file with the name of the environment variable.

# Running the App
To start the app in development mode (with hot-code reloading, error reporting, etc.), run:

```bash
# If you have the global Quasar CLI:
quasar dev
# Otherwise:
yarn quasar dev # or: npx quasar dev
```

This allows you to have a local environment set up without needing to install a server.

# Linting the Files
To lint the files, run:

```bash
yarn lint
# or
npm run lint
```

# Formatting the Files
To format the files, run:

```bash
yarn format
# or
npm run format
```

# Building for Production
To build the app for production, run:

```bash
quasar build
```

# Customizing Configuration
See Configuring <a href="https://v2.quasar.dev/quasar-cli-vite/quasar-config-js" target="_blank">Configuring quasar.config.js</a> for more details.

# Known Issues
Unit testing: Vitest has been installed, but there were issues running tests due to configuration challenges with Quasar and Vite. I've searched for a solution, but all get the same results.

# Contributing
Contributions to this project are welcome. Please follow the standard fork, branch, and pull request workflow.


Project developed for Jobisty Test - Joao Magalhaes
