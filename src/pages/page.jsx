import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">Welcome to MareJS</h1>

      <p className="text-base">
        MareJS uses a <strong>file-based routing</strong> system inspired by Next.js.
        Each file inside <code>src/pages/</code> automatically becomes a route.
      </p>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">How to use:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Create a new file in <code>src/pages/</code> to add a new route.</li>
          <li>Use folders and <code>page.jsx</code> for nested routes.</li>
          <li>
            Dynamic routes are supported using <code>[param]</code> in folder names,
            e.g. <Link to="/news/1" className="text-blue-600 underline">/news/1</Link>.
          </li>
          <li>
            <strong>Dummy folders:</strong> Wrap folders in parentheses to group pages without affecting the URL.
            Example: <code>src/pages/(dummy)/news/page.jsx</code> becomes <code>/news</code>.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">Layouts:</h2>
        <p className="text-base">
          MareJS supports layouts using special files like <code>_MainLayout.jsx</code> and
          <code> layout.jsx</code>. Layouts help you reuse navigation, headers, or other UI
          components across pages — and you can nest layouts for different sections.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">Example Routes:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><Link to="/news/1" className="text-blue-600 underline">News 1</Link></li>
          <li><Link to="/news/1100" className="text-blue-600 underline">News 1100</Link></li>
          <li><Link to="/hello" className="text-blue-600 underline">Hello Page</Link></li>
        </ul>
      </section>

      <p className="text-sm text-gray-600">
        ✏️ Edit <code>src/pages/page.jsx</code> to change this page.<br />
        ⚡ Enjoy rapid development with hot reload, layouts, and simple routing!
      </p>
    </div>
  );
}
