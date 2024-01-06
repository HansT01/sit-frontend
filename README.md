# SIT Project Documentation

This is a Next.js application serving the frontend for the SIT project.

- [SIT Project Documentation](#sit-project-documentation)
  - [Setup Guide](#setup-guide)
    - [Tasks](#tasks)
    - [Extensions](#extensions)
  - [Directory Structure](#directory-structure)

## Setup Guide

1. Pull the repository
2. Install all node modules with `npm install`
3. Begin development server with `npm run dev`

### Tasks

There are VSCode tasks to run the frontend and backend servers once they have been setup. The task `Backend Compile and Run` requires the `BACKEND_PATH` to be set. By default, it assumes the backend project is neighbouring the frontend project.

```
.
├── sit-backend
└── sit-frontend
```

### Extensions

Here are a list of recommended VSCode extensions to install:

```
bradlc.vscode-tailwindcss
esbenp.prettier-vscode
emeraldwalk.runonsave
```

There is a custom node script to automatically generate index.js files to handle imports, located in the `.vscode` folder. You can either run it with `npm run generate:index`, or you can install the runonsave extension as it has been configured to automatically run this command on save.

## Directory Structure

```
.
├── scripts
│   └── [script files (generateIndex.js, etc.)]
├── src
│   ├── components
│   │   ├── form-fields
│   │   │   ├── [form-fields component files]
│   │   ├── icons
│   │   │   ├── [icons component files]
│   │   ├── page-contents
│   │   │   ├── [page-contents component files]
│   │   ├── [other component files]
│   ├── composables
│   │   └── [functions that encapsulate and reuse stateful logic]
│   ├── contexts
│   │   └── [React context files]
│   ├── pages
│   │   └── [page files responsible for routing and views]
│   ├── public
│   │   ├── [static files (images, fonts, etc.)]
│   ├── services
│   │   └── [service files for fetching data from the backend API]
│   ├── styles
│   │   ├── [CSS files]
│   ├── util
│   │   └── [utility functions and classes]
├── .gitignore
├── package.json
└── package-lock.json
```
