# 🧠 MareJS – AI Developer Prompt

You are working with a custom full-stack JavaScript framework called **MareJS**.

Use this guide to understand how to build features using MareJS conventions.

---

## 🚀 Framework Overview

- **Frontend**: React (18.2.0)  
- **Backend**: Express.js (4.18.2)  
- **Bundler**: Vite  
- **Routing**: Fully **file-based** for both frontend and backend  
- **Hot Reloading**: Built-in for rapid development  

---

## 📁 Project Structure

```
src/
├── pages/          # Frontend routes (React)
│   ├── index.jsx   # Route: /
│   ├── about.jsx   # Route: /about
│   └── blog/
│       ├── layout.jsx
│       └── page.jsx
├── api/            # Backend API (Express handlers)
│   └── user/
│       └── [id].js # Route: /api/user/123
├── public/         # Static assets (images, CSS, etc.)
```

---

## 🌐 Frontend Routing (`pages/`)

- Files in `pages/` become frontend routes automatically.
- Folders create nested routes.
- Files named `[param].jsx` create **dynamic routes**.

### ✅ Examples:

| File Path                     | URL Route           |
|------------------------------|---------------------|
| `pages/index.jsx`            | `/`                 |
| `pages/about.jsx`            | `/about`            |
| `pages/user/[id].jsx`        | `/user/123`         |
| `pages/blog/post.jsx`        | `/blog/post`        |

---

## 🧱 Layout System

MareJS supports layouts similar to Next.js.

### Global Layouts

- `pages/_app.jsx` wraps the entire app.
- `pages/_MainLayout.jsx` handles navigation or global UI.

### Folder-Based Layouts

- If a folder (e.g. `pages/news/`) contains a `layout.jsx`, it **automatically wraps** all pages inside that folder.

#### ✅ Example:

```
pages/
└── news/
    ├── layout.jsx
    └── page.jsx
```

**Route**: `/news`  
**Behavior**: `layout.jsx` wraps `page.jsx` automatically.

```jsx
// pages/news/layout.jsx
export default function LayoutNews({ children, id }) {
  return (
    <div className="news-layout">
      <div className="news-header">News Layout {id}</div>
      <div className="news-content">{children}</div>
    </div>
  );
}
```

All child pages will be rendered inside the `children` placeholder.

---

## ⚙️ Backend Routing (`api/`)

- Files in `api/` become backend REST endpoints.
- Dynamic routes are created using `[param].js`.

### ✅ Example:

```js
// api/user/[id].js
export default async function handler(req, res) {
  res.json({ id: req.params.id });
}
```

**Route**: `GET /api/user/123`

---

## ✅ How to Work in MareJS

When asked to build a feature:

### 🔹 If it's a **frontend page**:

- Create a `.jsx` file inside `pages/`
- Use folder structure to define nested routes
- Add `layout.jsx` to any folder to wrap child pages

### 🔹 If it's a **backend API**:

- Create a `.js` file inside `api/`
- Use `req.params` for dynamic segments
- Do not manually define routes — MareJS handles it automatically

---

## 📌 Reminder

- Do **not** touch `.marejs/` — it's reserved for framework internals.
- Static assets go in `/public` and are accessed via `/assets/...`

---

Happy coding with MareJS! 🚀
