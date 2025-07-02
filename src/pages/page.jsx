import { Link } from "react-router-dom";

export default function Home() {
    return (
        <>
            <h1>Welcome to MareJS</h1>
            <p>
                This is the home page. MareJS uses a <b>file-based routing</b> system inspired by Next.js.<br/>
                Each file in <code>src/pages/</code> automatically becomes a route.
            </p>
            <p>
                <b>How to use:</b>
                <ul>
                    <li>Create a new file in <code>src/pages/</code> to add a new route.</li>
                    <li>Use folders and <code>page.jsx</code> for nested routes.</li>
                    <li>Dynamic routes are supported using <code>[param]</code> in folder names (see <Link to="/news/1">/news/1</Link>).</li>
                    <li>
                        <b>Dummy folders:</b> You can use folders wrapped in parentheses, like <code>(dummy)</code>, to categorize or group pages without affecting the URL path. For example, <code>src/pages/(dummy)/news/page.jsx</code> becomes <code>/news</code>.
                    </li>
                </ul>
            </p>
            <p>
                <b>Layouts:</b> MareJS supports layouts using special files like <code>_MainLayout.jsx</code> and <code>layout.jsx</code> inside folders. Layouts let you share navigation, headers, or other UI across multiple pages. You can nest layouts for different sections of your app.
            </p>
            <p>
                <b>Example routes:</b>
            </p>
            <ul>
                <li><Link to="/news/1">News 1</Link></li>
                <li><Link to="/news/1100">News 1100</Link></li>
                <li><Link to="/hello">Hello Page</Link></li>
            </ul>
            <p>
                Edit <code>src/pages/page.jsx</code> to change this page.<br/>
                Enjoy rapid development with hot reload, layouts, and simple routing!
            </p>
        </>
    );
}