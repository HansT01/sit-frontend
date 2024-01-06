# SIT Project Documentation

This is a Next.js application serving the frontend for the SIT project.

- [SIT Project Documentation](#sit-project-documentation)
  - [Setup Guide](#setup-guide)
    - [Tasks](#tasks)
    - [Extensions](#extensions)
  - [Directory Structure](#directory-structure)
  - [Frontend Technologies](#frontend-technologies)
    - [React](#react)
    - [Next.js and React](#nextjs-and-react)
    - [Typescript](#typescript)
    - [Tailwind CSS](#tailwind-css)
    - [Day.js](#dayjs)
  - [Composables and Contexts](#composables-and-contexts)
    - [useCourse](#usecourse)
    - [useNotifications](#usenotifications)
    - [useSession](#usesession)
  - [Patterns and Coding Conventions](#patterns-and-coding-conventions)
    - [Arrow Functions](#arrow-functions)
    - [Export Statements](#export-statements)
    - [Variable Naming](#variable-naming)
    - [Top-Level Async Functions](#top-level-async-functions)
    - [Error Handling](#error-handling)
    - [Code Comments](#code-comments)
    - [Code Formatting and Styling](#code-formatting-and-styling)
    - [TypeScript](#typescript-1)

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

The directory structure of a project plays a crucial role in organizing and maintaining the codebase. By following common conventions and best practices, it becomes easier to navigate, understand, and collaborate on the project. In this particular project, the directory structure has been designed with the following justifications:

1. `src` directory: Placing the source code in a separate directory, such as `src`, helps distinguish it from other project files. It provides a clear separation between the source code and configuration files, making the project structure cleaner and more organized.

2. Component-based structure: Organizing components into dedicated directories, such as `components`, `composables`, and `contexts`, promotes modularity and reusability. It allows for better organization, easier navigation, and encourages separation of concerns.

3. `pages` directory: Next.js, being a framework for server-rendered React applications, encourages the use of a dedicated pages directory. This directory contains the page files responsible for routing and views. It helps maintain clear and concise routing logic and facilitates server-side rendering or static site generation.

4. Separation of concerns: The use of separate directories, such as `public`, `services`, `styles`, and `util`, allows for a clear separation of different aspects of the project. It enhances maintainability, code reusability, and ease of collaboration by keeping related files together and minimizing interdependencies.

5. Configuration and metadata files: Files like `.gitignore`, `package.json`, and `package-lock.json` are placed in the root directory for easy access and visibility. They store essential project configurations, dependencies, and version control settings.

## Frontend Technologies

### React

React is a widely adopted JavaScript library for building user interfaces. Its component-based architecture promotes reusability, modularity, and maintainability. By using React, you can create dynamic and interactive UI components, making it easier to manage complex application states. React's virtual DOM efficiently updates and renders only the necessary parts of the UI, resulting in improved performance. Its vast ecosystem and extensive community support make it a popular choice for frontend development.

### Next.js and React

The decision to use Next.js alongside React was based on several factors. Next.js builds upon React's capabilities by adding server-side rendering (SSR), static site generation (SSG), and other optimizations out of the box. Next.js also simplifies routing, code splitting, and deployment, making it an efficient choice for building scalable web applications.

### Typescript

TypeScript is a strongly typed superset of JavaScript that adds static typing and other advanced features to the language. By using TypeScript, you gain the benefits of static type checking, enhanced code readability, and better developer tooling support. Static typing helps catch potential errors early during development, improves code maintainability, and enables robust refactoring. With TypeScript, you can write cleaner, more reliable code and enjoy features like autocompletion, code navigation, and refactoring assistance in modern development environments.

### Tailwind CSS

The use of Tailwind CSS was motivated by its utility-first approach and rapid development capabilities. Unlike other CSS frameworks that offer predefined styles and components, Tailwind CSS focuses on providing a comprehensive set of utility classes that can be combined to style elements. This approach offers greater flexibility and encourages a modular and declarative approach to styling. By using Tailwind CSS, developers can build responsive and consistent UIs with ease, without the need to write extensive custom CSS. The framework also provides a highly customizable configuration, allowing for a tailored and optimized styling experience.

### Day.js

Day.js was chosen as the datetime library due to its lightweight nature, modern API, and ease of use. While there are other datetime libraries available, such as Moment.js or the native JavaScript Date object, dayjs offers a more intuitive syntax and a smaller bundle size. It provides a comprehensive set of methods for manipulating, formatting, and displaying dates and times. The decision to use dayjs over other alternatives was based on its combination of simplicity, functionality, and performance.

## Composables and Contexts

Composables are powerful utility functions in web development that encapsulate and reuse stateful logic across components. They provide a modular and efficient way to handle shared functionality, reducing code duplication and improving code organization. Composables are especially well-suited for integration with React's Context API, which enables the sharing of data and behavior throughout a React application. By combining composables with React's Context API, developers can create scalable and maintainable codebases, promoting reusability and enhancing the overall development experience.

### useCourse

The `useCourse` composable is responsible for managing the state and behavior related to a specific course. It encapsulates logic for fetching course information, setting up the course structure, handling page navigation, and updating the URL based on the current page index. It utilizes React's Context API to access session information and notifications. This composable enables easy management of course-related functionality and provides a convenient way to handle course-specific operations.

### useNotifications

The `useNotifications` composable is used for managing notifications within the application. It allows adding, removing, and handling different types of notifications such as info, success, warning, and error messages. This composable maintains a state of notifications and provides functions to add new notifications and handle errors. It promotes modularity and reusability by encapsulating notification-related logic, ensuring a consistent and efficient approach to managing and displaying notifications when used in conjunction to the `NotificationsWrapper` component.

### useSession

The `useSession` composable handles the session state of the user. It manages user authentication, storing user information such as first name, last name, token, user ID, and instructor status. This composable provides functions for user login and logout, updating the session state accordingly. It also utilizes local storage and cookies to persist the user's authentication token, allowing seamless authentication across page refreshes. By encapsulating session-related logic, this composable enables easy access to user information throughout the application and promotes a secure and consistent user experience.

## Patterns and Coding Conventions

### Arrow Functions

Arrow functions are the preferred choice for writing functions. This syntax offers concise and clean code, making the intent of the function clearer. However, an exception is made for functions within classes since they do not support arrow function syntax. In such cases, regular function syntax is used.

### Export Statements

The project follows a consistent pattern of using the `export` keyword rather than `export default` when exporting modules. This approach aims to provide more concise and uniform import statements throughout the codebase. However, an exception to this pattern is made for Next.js page routes, where `export default` is used to define the default exported component for routing purposes.

### Variable Naming

All variable names follow the camelCase convention, promoting consistency and readability throughout the codebase. The only exceptions are the field names in backend API JSON objects. However, these exceptions are handled by converting the field names to camelCase during the parsing process.

### Top-Level Async Functions

The use of `async` on top-level function calls is discouraged, especially in event handlers like button click handlers. This approach helps to prevent unhandled promise rejections. Instead, the asynchronous operations within these functions should be wrapped in appropriate error handling mechanisms to ensure proper handling of any potential errors or promise rejections.

### Error Handling

In most cases, errors are appropriately handled by passing them into the `useNotifications` composable. This ensures that errors are captured and can be displayed to the user when necessary. For background tasks or operations that don't require user notification, error handling may be tailored accordingly.

### Code Comments

While the codebase generally follows the principle of self-documenting code, there is limited usage of code comments. The approach favors writing clear and expressive code that is easily understandable on its own. However, there are exceptions to this approach, especially when certain sections of code, such as with React's `useEffect`, may benefit from additional comments to provide context and aid comprehension.

### Code Formatting and Styling

Code formatting is strictly enforced using the Prettier configuration `.prettierrc.json`. This ensures consistent and standardized code formatting across the entire project. The configuration specifies preferences, such as the use of single quotes over double quotes and the omission of semicolons, to remove unnecessary clutter and maintaining a clean code style.

### TypeScript

Efforts have been made to minimize the use of wildcard types (such as 'any' or 'unknown') in favor of more specific types. The custom TypeScript configs found in `tsconfig.json` help catch potential type-related issues at compile-time, promoting code safety and robustness.
