import { Link } from "react-router-dom";

export default function Hello() {
    return (
        <>
            <Link to="/"> Home </Link>
            <h1>Hello Page</h1>
            <p>
                This is a custom page in MareJS, demonstrating how to add your own routes and use static assets.
            </p>
            <p>
                <b>Usage:</b>
                <ul>
                    <li>Create a new file in <code>src/pages/</code> to add a new route.</li>
                    <li>Static assets (like images) can be placed in the <code>public/</code> folder and referenced directly.</li>
                    <li>
                        <b>Dummy folders:</b> You can use folders wrapped in parentheses, like <code>(category)</code>, to organize your pages without affecting the URL path. This helps keep your project structure clean.
                    </li>
                </ul>
            </p>
            <p>
                <b>Layouts in MareJS:</b><br/>
                Layouts let you share navigation, headers, or other UI across multiple pages. The main layout is defined in <code>src/_MainLayout.jsx</code> and is applied to all pages. You can also add <code>layout.jsx</code> files inside folders for section-specific layouts.
            </p>
            <p>
                The image below is loaded from <code>public/marejs_fine.webp</code>:
            </p>
            <hr/>
            <img src="/marejs_fine.webp" alt="MareJS logo" style={{maxWidth: "300px"}} />
            <p>
                Edit <code>src/pages/hello/page.jsx</code> to change this page.
            </p>
        </>
    );
}