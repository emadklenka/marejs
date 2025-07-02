export default function TeamsMain() {
    return (
        <>
            <h1>Teams Page</h1>
            <p>
                This is the main teams page. MareJS makes it easy to organize content using folders and files.
            </p>
            <p>
                <b>About <code>(dummy)</code> folders:</b><br/>
                Folders wrapped in parentheses, like <code>(dummy)</code>, are ignored in the URL path. Use them to categorize or group your pages for better organization, without affecting the route. Here, <code>src/pages/(dummy)/teams/page.jsx</code> becomes <code>/teams</code>.
            </p>
            <ul>
                <li>Each file in <code>src/pages/(dummy)/teams/</code> becomes a route under <code>/teams</code>.</li>
                <li>Dynamic team pages can be created using <code>[id]/page.jsx</code> for routes like <code>/teams/1</code>.</li>
            </ul>
            <p>
                <b>Layouts in MareJS:</b><br/>
                You can add a <code>layout.jsx</code> file inside <code>src/pages/(dummy)/teams/</code> to provide a custom layout for all teams pages. Layouts let you share navigation, headers, or other UI across related pages.
            </p>
            <p>
                To add a new team page, just add a new file or folder in <code>src/pages/(dummy)/teams/</code>.<br/>
                <br/>
                Edit <code>src/pages/(dummy)/teams/page.jsx</code> to change this page.
            </p>
        </>
    );
}