export default function NewsMain() {
    return (
        <>
            <h1>News Page</h1>
            <p>
                This is the main news page. MareJS supports <b>dynamic routing</b> using folder names in <code>src/pages/</code>.<br/>
                For example, <code>src/pages/(dummy)/news/[id]/page.jsx</code> will match routes like <code>/news/1</code>, <code>/news/42</code>, etc.
            </p>
            <p>
                <b>About <code>(dummy)</code> folders:</b><br/>
                Folders wrapped in parentheses, like <code>(dummy)</code>, are ignored in the URL path. You can use them to categorize or group your pages for better organization, without affecting the route. Here, <code>src/pages/(dummy)/news/page.jsx</code> becomes <code>/news</code>.
            </p>
            <ul>
                <li>To add a new news article page, just add a new file or use the <code>[id]</code> folder for dynamic content.</li>
                <li>Try visiting <code>/news/1</code> or <code>/news/1100</code> to see dynamic routing in action.</li>
            </ul>
            <p>
                <b>Layouts in MareJS:</b><br/>
                You can add a <code>layout.jsx</code> file inside <code>src/pages/(dummy)/news/</code> to provide a custom layout for all news pages. Layouts let you share navigation, headers, or other UI across related pages.
            </p>
            <p>
                Edit <code>src/pages/(dummy)/news/page.jsx</code> to change this page.
            </p>
        </>
    );
}