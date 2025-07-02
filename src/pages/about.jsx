export default function About() {
    return (
        <>
            <h1>About MareJS</h1>
            <p>
                MareJS is a modern React framework inspired by Next.js, designed for rapid development and simplicity.
            </p>
            <ul>
                <li><b>File-based routing:</b> Every file in <code>src/pages/</code> becomes a route automatically.</li>
                <li><b>Dynamic routes:</b> Use folders like <code>[id]</code> for dynamic parameters (e.g., <code>/news/1</code>).</li>
                <li>
                    <b>Dummy folders for categorization:</b> Folders wrapped in parentheses, like <code>(dummy)</code>, are ignored in the URL path. Use them to organize or group your pages without affecting the route. For example, <code>src/pages/(dummy)/news/page.jsx</code> becomes <code>/news</code>.
                </li>
                <li><b>Hot reload:</b> Edit your files and see changes instantly.</li>
                <li><b>Easy API routes:</b> Add serverless functions in the <code>/api</code> folder.</li>
            </ul>
            <p>
                <b>Layouts:</b> MareJS supports layouts using special files like <code>_MainLayout.jsx</code> at the root and <code>layout.jsx</code> inside folders. Layouts let you share navigation, headers, or other UI across multiple pages. You can nest layouts for different sections of your app.<br/>
                For example, <code>src/pages/(dummy)/news/layout.jsx</code> would provide a layout for all news pages.
            </p>
            <p>
                To add a new page, just create a new file in <code>src/pages/</code>.<br/>
                For nested routes, use folders and a <code>page.jsx</code> file.<br/>
                <br/>
                <b>Example:</b> <code>src/pages/about.jsx</code> becomes <code>/about</code>
            </p>
        </>
    );
}