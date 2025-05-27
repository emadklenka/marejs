<div align="center">
  <img src="https://repository-images.githubusercontent.com/863301590/8529612f-d102-4a7d-9977-b722aa32ea6d" width="600">

  <div>
    <img src="https://img.shields.io/badge/React-18.2.0-blue?logo=react" alt="React">
    <img src="https://img.shields.io/badge/Express-4.18.2-green?logo=express" alt="Express">
    <img src="https://img.shields.io/badge/Vite-4.4.0-yellow?logo=vite" alt="Vite">
  </div>
</div>

# MareJS

MareJS is a full-stack JavaScript framework that simplifies web development by combining Express.js for backend APIs and React for frontend rendering. It utilizes file-based routing for both client-side and server-side, allowing developers to focus on building features rather than configuring routes.

## ✨ Features

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin: 1rem 0;">

<div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #61dafb;">
**🚀 File-Based Routing**
Automatically generate routes based on your directory structure
</div>

<div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #68a063;">
**🔌 Express.js Integration**
Build robust backend APIs with Express.js
</div>

<div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #61dafb;">
**⚛️ React Frontend**
Build dynamic UIs with React
</div>

<div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #fcc72e;">
**⚡ Vite Powered**
Blazing fast development experience
</div>

<div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #ff6b6b;">
**🔥 Hot Reloading**
Instant feedback during development
</div>

<div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #9c88ff;">
**🔌 WebSocket Support**
Real-time communication with file-based WebSocket routing
</div>

</div>

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

## Routing System

MareJS provides Next.js-like file-based routing while using React Router under the hood. The routing system offers:

- **Automatic Route Generation**: Files in `pages/` automatically become routes
- **Layout Support**: Shared layouts via `_app.jsx` and `_MainLayout.jsx`
- **Nested Routes**: Folders create nested URL paths
- **Dynamic Segments**: Files named `[param].jsx` create dynamic routes

### Key Routing Files:
- `pages/`: React components that become routes (file-based routing)
- `_app.jsx`: Root application layout component
- `_MainLayout.jsx`: Main navigation layout component
- `api/`: Backend API endpoints (file-based routing)
- `public/`: Static assets like images and stylesheets
- `.marejs/`: Framework-specific files (don't modify directly)

## 🛠️ API Development & Middleware

MareJS provides a powerful API system with built-in middleware support:

### Core Middleware Files

1. **`middleware.js`** - Main application middleware
2. **`session.js`** - Session management
3. **`server_startup.js`** - Server initialization
4. **`cors.js`** - CORS configuration

### Creating Custom Middleware

```javascript
// api/__mare_serversettings/custom-middleware.js
export default function customMiddleware(req, res, next) {
  // Your middleware logic
  next();
}
```

Register it in `mare_server.js`:
```javascript
import customMiddleware from './api/__mare_serversettings/custom-middleware.js';
app.use(customMiddleware);
```

### Server Startup

The `server_startup.js` runs before server starts:
```javascript
export async function Server_Startup() {
  try {
    // Initialize databases, caches, etc.
    return true;
  } catch (error) {
    console.error('Startup failed:', error);
    return false;
  }
}
```

### Advanced API Endpoints

1. **Middleware Chain**:
```javascript
export default async function handler(req, res) {
  // First middleware
  if (!validateRequest(req)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  // Second middleware
  const user = await authenticate(req);
  if (!user) {
    return res.status(401).end();
  }

  // Main handler
  res.json({ data: await getData(user) });
}
```

2. **Error Handling**:
```javascript
export default async function handler(req, res) {
  try {
    const data = await riskyOperation();
    res.json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
```

## Creating Pages

Pages are created by adding `.jsx` files to the `pages` directory. The file path determines the route URL.

### Basic Page Example:

```jsx
// pages/about.jsx
export default function About() {
  return <h1>About Us</h1>;
}
```

Accessible at: `/about`

### Dynamic Route Example:

```jsx
// pages/user/[id].jsx
export default function UserPage({ id }) {
  return <h1>User Profile: {id}</h1>;
}
```

Accessible at: `/user/123` (id = "123")

### Nested Route Example:

```jsx
// pages/blog/[slug]/page.jsx
export default function BlogPost({ slug }) {
  return <h1>Blog Post: {slug}</h1>;
}
```

Accessible at: `/blog/my-post`

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

## Layout System

MareJS uses a hierarchical layout system similar to Next.js:

1. `_app.jsx` - The root application component that wraps all pages
2. `_MainLayout.jsx` - The main navigation layout component
3. Page-specific layouts - Can be added in route folders

### Example Layout Structure:

```jsx
// _app.jsx - Root layout
import MainLayout from './_MainLayout';

export default function App() {
  return (
    <MainLayout>
      {/* Page content goes here */}
    </MainLayout>
  );
}

// _MainLayout.jsx - Main navigation
export default function MainLayout({ children }) {
  return (
    <>
      <nav>{/* Navigation links */}</nav>
      <main>{children}</main>
    </>
  );
}
```

Layouts are automatically applied based on the file structure.

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

## 🔌 WebSocket Support

MareJS includes built-in WebSocket support with file-based routing similar to API endpoints. WebSocket handlers are placed in the `api/wss/` directory.

### Creating WebSocket Handlers

Create WebSocket handlers by adding JavaScript files to the `api/wss/` folder:

```javascript
// api/wss/chat.js
export default function chatHandler(ws, req) {
  console.log('🔌 Chat client connected');
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Welcome to the chat!'
  }));

  // Handle incoming messages
  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('📨 Received:', message);
    
    // Broadcast to all clients (implement your logic)
    ws.send(JSON.stringify({
      type: 'message',
      user: message.user,
      text: message.text,
      timestamp: new Date().toISOString()
    }));
  });

  // Handle disconnection
  ws.on('close', () => {
    console.log('🔌 Chat client disconnected');
  });
}
```

### Client-Side WebSocket Usage

Connect to WebSocket endpoints from your React components:

```jsx
// pages/chat.jsx
import { useState, useEffect } from 'react';

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:4000/api/wss/chat');
    
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
    };

    setWs(websocket);

    return () => websocket.close();
  }, []);

  const sendMessage = () => {
    if (ws && input.trim()) {
      ws.send(JSON.stringify({
        user: 'User',
        text: input
      }));
      setInput('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>{msg.user}: {msg.text}</div>
        ))}
      </div>
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

### WebSocket Routing

WebSocket endpoints follow the same file-based routing as API endpoints:

- `api/wss/chat.js` → `ws://localhost:4000/api/wss/chat`
- `api/wss/notifications.js` → `ws://localhost:4000/api/wss/notifications`
- `api/wss/game/[room].js` → `ws://localhost:4000/api/wss/game/room123`