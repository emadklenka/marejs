
![MareJS](https://repository-images.githubusercontent.com/863301590/8529612f-d102-4a7d-9977-b722aa32ea6d)

# MareJS

MareJS is a full-stack JavaScript framework that simplifies web development by combining Express.js for backend APIs and React for frontend rendering. It utilizes file-based routing for both client-side and server-side, allowing developers to focus on building features rather than configuring routes.

## Features

- **File-Based Routing**: Automatically generate routes based on your directory structure in the `pages` and `api` folders.
- **Express.js Integration**: Build robust backend APIs with Express.js without manual routing setup.
- **React Frontend**: Use React for building dynamic and interactive user interfaces.
- **Simplified Development**: No need to configure complex build tools; MareJS handles it for you.
- **Hot Reloading**: Enjoy a smooth development experience with automatic reloading on file changes.

## Installation

Create a new MareJS project using the following command:

```bash
npx github:/emadklenka/marejs
```

This command will set up a new MareJS project in a folder named my-app.

## Getting Started

After installation, navigate to your project directory and install dependencies:

```bash
cd my-app
npm install
```

Start the development server:

```bash
npm run dev
```

Your application will be running at [http://localhost:4000](http://localhost:4000).

## Project Structure

MareJS projects have a simple and intuitive structure:

src/
├── pages/
│   ├── index.jsx
│   ├── about.jsx
│   └── user/
│       └── [id].jsx
├── api/
│   ├── index.js
│   ├── user/
│   │   └── [id].js
│   └── default.js
├── public/
│   └── assets/
├── .marejs/
│   └── (hidden framework files)
└── package.json
```

- `pages/`: Contains React components that correspond to frontend routes. The routing is based on the file structure.
- `api/`: Contains backend API endpoints. Each file represents an API route.
- `public/`: Contains static assets like images and stylesheets.
- `.marejs/`: Contains framework-specific files (hidden from the developer; you don't need to modify these).

## Creating Pages

To create a new page, simply add a new `.jsx` file to the `pages` folder.

### Example: Creating an About Page

Create the file `pages/about.jsx`:

```jsx
import React from 'react';

export default function About() {
  return <h1>About Us</h1>;
}
```

This page will be accessible at [http://localhost:4000/about](http://localhost:4000/about).

## Dynamic Routes

You can create dynamic routes using square brackets `[]` in the filename.

### Example: User Profile Page

Filename: `pages/user/[id].jsx`

```jsx
import React from 'react';

export default function UserProfile({ id }) {
  return <h1>User Profile for User ID: {id}</h1>;
}
```

This route will match URLs like [http://localhost:4000/user/123](http://localhost:4000/user/123), where `123` is the dynamic `id` parameter.

## Creating API Endpoints

To create backend API routes, add JavaScript files to the `api` folder.

### Example: User API Endpoint

Filename: `api/user/[id].js`

```javascript
export default async function handler(req, res) {
  const { id } = req.params;
  // Fetch user data based on ID
  const userData = await getUserData(id);
  res.json(userData);
}

async function getUserData(id) {
  // Mock data for demonstration
  return { id, name: `User ${id}` };
}
```

This API can be accessed via `GET http://localhost:4000/api/user/123`.

## Using Layouts

You can create shared layouts by adding a `layout.jsx` file in your `pages` directory or subdirectories.

### Example: Creating a Main Layout

Create the file `pages/layout.jsx`:

```jsx
import React from 'react';

export default function Layout({ children }) {
  return (
    <>
      <header>
        <h1>My App</h1>
      </header>
      <main>{children}</main>
      <footer>© 2023 My App</footer>
    </>
  );
}
```

All pages within the `pages` directory will automatically use this layout.

## Static Assets

Place your static files (images, CSS, etc.) in the `public` folder. They can be accessed directly from your application.

### Example: Using an Image

If you have an image at `public/assets/logo.png`, you can use it in your components like this:

```jsx
<img src="/assets/logo.png" alt="Logo" />
```

## Deployment

To build your application for production, run:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

Your application will be running at [http://localhost:4000](http://localhost:4000).

## Additional Notes

- **Hidden Framework Files**: The core functionality of MareJS is contained within the hidden `.marejs` folder. You don't need to interact with these files directly.
- **Custom Middleware and Settings**: Advanced configurations can be added in the `api` folder, but for most use cases, simply adding pages and API endpoints is sufficient.
- **Environment Variables**: You can use a `.env` file to manage environment-specific settings.

## Conclusion

MareJS aims to simplify the web development process by eliminating boilerplate code and configuration. By leveraging file-based routing and integrating Express.js and React, you can quickly build full-stack applications with minimal setup.

## License

MareJS is open-source software licensed under the MIT License.

Happy coding with MareJS!