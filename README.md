# Express + React with File-Based Routing

This project combines **React** for client-side rendering and **Express** for server-side APIs, both utilizing **file-based routing** for seamless route management. The goal is to keep everything organized and dynamic, with minimal hardcoding for routes on both the frontend and backend.

## Features

- **React + Vite**: Fast and minimal setup with Hot Module Replacement (HMR) for React using Vite.
- **Express API**: Easily expandable backend built with Express, handling server-side routes in a file-based manner similar to Next.js.
- **File-Based Routing**:
  - **Client-side routing**: Automatically loads React components from the `/pages` directory.
  - **Server-side routing**: Dynamically maps Express API routes from the `/api` directory.
- **Lazy Loading**: Client components are lazily loaded for better performance.
- **404 Handling**: Custom 404 pages for both frontend and API routes.

## Motivation

I loved the idea of combining React and Express in one project, using **file-based routing** for both client-side and server-side components. This approach offers a cleaner and more organized structure, similar to the ease of use provided by Next.js but with the flexibility of handling both frontend and backend in a unified project.

## Technologies Used

- **React (with Vite)**: Fast frontend development using Vite's dev server and bundling capabilities.
- **React Router**: File-based routing for dynamic component loading on the client side.
- **Express**: Backend server with file-based routing to automatically handle API routes.
- **ES Modules**: Fully modern ES module setup for both React and Express.
- **Node.js**: Server-side environment for Express APIs.

## Project Structure


### Client-Side Routing

React components are placed inside the `/pages` directory, and React Router dynamically registers routes based on the file structure:

- `/src/pages/index.jsx` → `/`
- `/src/pages/about.jsx` → `/about`
- `/src/pages/user/index.jsx` → `/user`

### Server-Side Routing

Express API routes are placed inside the `/api` directory, and the server dynamically maps these routes based on the file structure:

- `/server/api/hello.js` → `/api/hello`
- `/server/api/user/index.js` → `/api/user`

## Setup

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v14+)
- **pnpm** (for managing packages)

### Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/emadklenka/marejs.git](https://github.com/emadklenka/marejs.git)
   cd marejs

2. Install dependencies using pnpm:
   
   pnpm install

3.Run the development server (Vite + Express):

   pnpm run dev

   pnpm run build

   pnpm start




