<div align="center">
  <img src="https://repository-images.githubusercontent.com/863301590/8529612f-d102-4a7d-9977-b722aa32ea6d" width="600">

  <h1>🌊 MareJS</h1>
  <h3>The Full-Stack Framework Built for Young Developers</h3>

  <p>
    <strong>Open Source • File-Based Routing • Security-First • Next.js-Like Experience</strong>
  </p>

  <div>
    <img src="https://img.shields.io/badge/React-18.2.0-blue?logo=react" alt="React">
    <img src="https://img.shields.io/badge/Express-4.18.2-green?logo=express" alt="Express">
    <img src="https://img.shields.io/badge/Vite-4.4.0-yellow?logo=vite" alt="Vite">
    <img src="https://img.shields.io/badge/License-MIT-brightgreen" alt="License">
    <img src="https://img.shields.io/badge/Security-WAF%20Protected-red" alt="Security">
  </div>

  <br>

  <p><em>Zero configuration. Maximum productivity. Built by developers, for developers.</em></p>
</div>

---

## 🎯 Why MareJS?

MareJS was created to **empower young developers** to build production-ready web applications without the overwhelming complexity of modern frameworks. Whether you're building your first app or your tenth, MareJS provides:

✨ **The simplicity of Next.js** - Brilliant JSX file-based routing with layouts
🛡️ **Enterprise-grade security** - Built-in Web Application Firewall (WAF)
🚀 **Zero configuration** - Start coding immediately, no setup required
⚡ **Lightning-fast development** - Hot reload, instant feedback, pure joy
🎓 **Learn by doing** - Clean code structure that teaches best practices
⚔️ **Battle-tested** - Running production SaaS applications with real users

**Perfect for:**
- 👨‍🎓 Students learning full-stack development
- 🚀 Startups building MVPs quickly
- 💼 SaaS companies needing a Next.js alternative
- 💡 Developers who want to focus on features, not configuration
- 🌍 Anyone who believes in open-source collaboration

---

## 💎 What Makes MareJS Special?

### 🎨 Next.js-Like File-Based Routing (Frontend)

Create beautiful React applications with the same developer experience as Next.js:

```jsx
// pages/index.jsx → Your home page at '/'
export default function Home() {
  return <h1>Welcome to MareJS!</h1>;
}

// pages/blog/[slug].jsx → Dynamic blog posts
export default function BlogPost({ slug }) {
  return <article>Blog post: {slug}</article>;
}

// pages/_MainLayout.jsx → Shared layout for all pages
export default function MainLayout({ children }) {
  return (
    <>
      <nav>{/* Your navigation */}</nav>
      <main>{children}</main>
    </>
  );
}
```

**No routing configuration. Just create files.** MareJS handles the rest.

### 🔌 File-Based API Routing (Backend)

Build powerful APIs with the same file-based approach:

```javascript
// api/hello.js → Responds to /api/hello
export default (req, res) => {
  res.json({ message: 'Hello World!' });
};

// api/users/[id].js → Dynamic user endpoint
export default (req, res) => {
  const { id } = req.params;
  res.json({ userId: id });
};

// api/public/webhook.js → Public endpoint (no auth)
export default (req, res) => {
  res.json({ status: 'ok' });
};
```

**Routes in `/api/public/*` are accessible to everyone.**
**All other routes require authentication.** Simple and secure.

### 🛡️ Built-In Web Application Firewall (WAF)

**This is what sets MareJS apart.** Most frameworks leave security as an afterthought. MareJS comes with enterprise-grade protection **out of the box**:

- ✅ **XSS Protection** - Blocks script injection attacks
- ✅ **SQL Injection Defense** - Context-aware detection with minimal false positives
- ✅ **Path Traversal Prevention** - Stops directory traversal attacks
- ✅ **Smart Detection** - Allows legitimate data while blocking attacks
- ✅ **Zero Configuration** - Works immediately, customize as needed

Example: WAF automatically blocks this attack:
```bash
# Attacker tries SQL injection
GET /api/user?id=' OR 1=1--

# MareJS responds:
HTTP 403 Forbidden
{
  "error": "Forbidden",
  "message": "Request blocked by Web Application Firewall",
  "threats": [{ "type": "SQL Injection", "parameter": "query.id" }]
}
```

**Learn more about security:** See `docs/serverside.txt` for complete WAF documentation.

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

---

## 🚀 Quick Start

Get up and running in 60 seconds:

### 1. Create Your Project

```bash
npx github:/emadklenka/marejs my-app
cd my-app
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Start Building! 🎉

Your app is now running at **http://localhost:4000**

- 📄 Add pages in `pages/` folder
- 🔌 Add APIs in `api/` folder
- 🎨 Customize layouts in `_MainLayout.jsx`
- 🛡️ Security is already enabled (WAF protects you)

**That's it!** No webpack config, no routing setup, no security configuration. Just code.

---

## 📚 Documentation

### **New to MareJS? Start here:**

- 📖 **[Server-Side Guide](docs/serverside.txt)** - Complete backend documentation
  - Routing system explained
  - API endpoint creation
  - WAF configuration and security
  - Environment variables
  - Testing your APIs

### **Quick References:**

- 🎨 **Frontend Routing:** File-based, similar to Next.js (see Project Structure below)
- 🔌 **Backend Routing:** File-based API endpoints (see `docs/serverside.txt`)
- 🛡️ **Security (WAF):** Built-in protection (see `docs/serverside.txt`)
- 🧪 **Testing:** Run `node tests/waftest.js` for security tests

---

## 📁 Project Structure

MareJS keeps things simple and organized:

```
my-app/
├── pages/                    📄 Frontend Routes (React/JSX)
│   ├── index.jsx            → / (home page)
│   ├── about.jsx            → /about
│   ├── blog/
│   │   └── [slug].jsx       → /blog/my-post (dynamic)
│   ├── _app.jsx             → Root layout wrapper
│   └── _MainLayout.jsx      → Navigation layout
│
├── api/                      🔌 Backend Routes (Express)
│   ├── hello.js             → /api/hello
│   ├── hello/
│   │   └── index.js         → /api/hello (folder-based)
│   ├── users/
│   │   └── [id].js          → /api/users/123 (dynamic)
│   ├── public/              → 🌍 Public routes (no auth)
│   │   └── webhook.js       → /api/public/webhook
│   └── __mare_serversettings/
│       ├── server_startup.js   Server initialization
│       ├── session.js          Session config
│       ├── cors.js             CORS config
│       └── middleware.js       Auth middleware
│
├── tests/                    🧪 Test Suite
│   └── waftest.js           → WAF security tests
│
├── docs/                     📚 Documentation
│   └── serverside.txt       → Complete backend guide
│
├── .mareJS/                  ⚙️ Framework Core (DON'T EDIT)
│   ├── mare_server.js       → Main server
│   └── waf/                 → Security modules
│       ├── waf.js           → WAF middleware
│       ├── xss.js           → XSS detection
│       ├── sqli.js          → SQL injection detection
│       └── pathtraversal.js → Path traversal detection
│
├── public/                   🎨 Static Assets
│   └── assets/
│
├── saferoutes.config.js      🛡️ WAF bypass rules (optional)
├── .env                      🔐 Environment variables
└── package.json
```

### Key Directories:

**✏️ You Edit These:**
- `pages/` - Your React components (frontend routes)
- `api/` - Your API endpoints (backend routes)
- `api/__mare_serversettings/` - Server configuration
- `.env` - Environment settings
- `saferoutes.config.js` - WAF exemptions

**🚫 Don't Touch These:**
- `.mareJS/` - Framework internals (auto-generated)

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

---

## 🌍 Open Source & Community

MareJS is **100% open source** and built with ❤️ for the developer community.

### Why Open Source?

We believe that great tools should be accessible to everyone, especially young developers who are just starting their journey. MareJS is:

- ✅ **Free forever** - No premium tiers, no hidden costs
- 🤝 **Community-driven** - Your feedback shapes the future
- 📚 **Learning-friendly** - Clean, readable code to learn from
- 🚀 **Production-ready** - Battle-tested in real SaaS applications
- ⚔️ **Proven at scale** - Running live systems with actual users

### Perfect For:

- 👨‍💻 **Students** learning full-stack development
- 🎓 **Bootcamp graduates** building their portfolios
- 🚀 **Indie hackers** launching MVPs quickly
- 💡 **Developers** who value simplicity and security
- 🌱 **Anyone** starting their coding journey

### Contributing

We welcome contributions from developers of all skill levels! Whether it's:
- 🐛 Reporting bugs
- 💡 Suggesting features
- 📖 Improving documentation
- 🔧 Submitting pull requests

Every contribution makes MareJS better for the entire community.

---

## 📈 What's Next?

After you're comfortable with the basics:

1. 📖 Read the complete **[Server-Side Guide](docs/serverside.txt)**
2. 🛡️ Learn about **WAF security configuration**
3. 🧪 Run **automated tests** with `node tests/waftest.js`
4. 🔌 Explore **WebSocket support** for real-time features
5. 🚀 Deploy your app to production

---

## 💬 Philosophy

> "The best framework is the one that gets out of your way."

MareJS was born from **real frustration with Next.js complexity** while building production SaaS applications. We loved the developer experience but needed:
- **CSR instead of SSR** (SaaS apps are behind auth anyway)
- **Full Express control** (not serverless limitations)
- **Built-in security** (WAF protecting customer data)
- **Simple deployment** (VPS/Docker, not vendor lock-in)

So we built MareJS - keeping Next.js's brilliant file-based routing while removing everything that fought against SaaS architecture.

**MareJS is for builders, dreamers, and learners.**

Whether you're building your first "Hello World" or scaling a SaaS to thousands of users, MareJS gives you the tools you need without the complexity you don't.

**Battle-tested. Production-ready. Open source.**

---

## 📄 License

MareJS is open-source software licensed under the **MIT License**.

Use it for personal projects, commercial applications, or anything in between. No restrictions, no strings attached.

---

## 🙏 Acknowledgments

Built with passion for the next generation of developers.

Special thanks to the open-source community and all the frameworks that inspired MareJS:
- Next.js (file-based routing inspiration)
- Express.js (robust backend)
- React (amazing UI library)
- Vite (lightning-fast builds)

---

<div align="center">

### Ready to build something amazing?

```bash
npx github:/emadklenka/marejs my-app
cd my-app
npm run dev
```

**Start coding in 60 seconds. Deploy in minutes. Built for developers like you.**

---

Made with ❤️ for young developers everywhere

⭐ **Star us on GitHub** if MareJS helps you build better apps!

[Documentation](docs/serverside.txt) • [Report Bug](https://github.com/emadklenka/marejs/issues) • [Request Feature](https://github.com/emadklenka/marejs/issues)

</div>

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