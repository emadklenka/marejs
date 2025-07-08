export default function TeamsMain() {
    return (
        <div className="container mx-auto max-w-6xl">
            {/* Hero Section */}
            <div className="hero bg-base-200 rounded-lg mb-8">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Teams Page</h1>
                        <p className="py-6">
                            This is the main teams page. MareJS makes it easy to organize content using folders and files.
                        </p>
                        <button className="btn btn-primary">Get Started</button>
                    </div>
                </div>
            </div>

            {/* Alert */}
            <div className="alert alert-info mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Welcome to the Teams section! Here you can manage and organize your team structure.</span>
            </div>

            {/* Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">
                            Dummy Folders
                            <div className="badge badge-secondary">Info</div>
                        </h2>
                        <p>Folders wrapped in parentheses, like <code className="bg-base-300 px-2 py-1 rounded">(dummy)</code>, are ignored in the URL path.</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary btn-sm">Learn More</button>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">
                            Dynamic Routes
                            <div className="badge badge-accent">Feature</div>
                        </h2>
                        <p>Dynamic team pages can be created using <code className="bg-base-300 px-2 py-1 rounded">[id]/page.jsx</code> for routes like <code className="bg-base-300 px-2 py-1 rounded">/teams/1</code>.</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-accent btn-sm">Explore</button>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">
                            Layouts
                            <div className="badge badge-primary">Pro</div>
                        </h2>
                        <p>Add a <code className="bg-base-300 px-2 py-1 rounded">layout.jsx</code> file to provide custom layouts for all teams pages.</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary btn-sm">Setup</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs tabs-boxed mb-6">
                <a className="tab tab-active">Organization</a>
                <a className="tab">Routing</a>
                <a className="tab">Layouts</a>
            </div>

            {/* Collapse/Accordion */}
            <div className="collapse collapse-plus bg-base-200 mb-4">
                <input type="radio" name="my-accordion-3" defaultChecked /> 
                <div className="collapse-title text-xl font-medium">
                    How does folder organization work?
                </div>
                <div className="collapse-content"> 
                    <p>Each file in <code className="bg-base-300 px-2 py-1 rounded">src/pages/(dummy)/teams/</code> becomes a route under <code className="bg-base-300 px-2 py-1 rounded">/teams</code>. The parentheses make the folder name invisible in the URL structure.</p>
                </div>
            </div>

            <div className="collapse collapse-plus bg-base-200 mb-4">
                <input type="radio" name="my-accordion-3" /> 
                <div className="collapse-title text-xl font-medium">
                    What are dynamic routes?
                </div>
                <div className="collapse-content"> 
                    <p>Dynamic team pages can be created using bracket notation like <code className="bg-base-300 px-2 py-1 rounded">[id]/page.jsx</code> for routes like <code className="bg-base-300 px-2 py-1 rounded">/teams/1</code>, <code className="bg-base-300 px-2 py-1 rounded">/teams/2</code>, etc.</p>
                </div>
            </div>

            <div className="collapse collapse-plus bg-base-200 mb-6">
                <input type="radio" name="my-accordion-3" /> 
                <div className="collapse-title text-xl font-medium">
                    How do layouts work in MareJS?
                </div>
                <div className="collapse-content"> 
                    <p>Layouts let you share navigation, headers, or other UI across related pages. Add a <code className="bg-base-300 px-2 py-1 rounded">layout.jsx</code> file inside your page directory to apply it to all pages in that section.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="stats shadow w-full mb-6">
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Total Teams</div>
                    <div className="stat-value text-primary">25</div>
                    <div className="stat-desc">21% more than last month</div>
                </div>
                
                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Active Projects</div>
                    <div className="stat-value text-secondary">12</div>
                    <div className="stat-desc">New projects this week</div>
                </div>
                
                <div className="stat">
                    <div className="stat-figure text-accent">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Team Members</div>
                    <div className="stat-value">86</div>
                    <div className="stat-desc">↗︎ 12 (14%)</div>
                </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Team Setup Progress</h3>
                <div className="space-y-2">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Folder Structure</span>
                            <span>100%</span>
                        </div>
                        <progress className="progress progress-success w-full" value="100" max="100"></progress>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Dynamic Routes</span>
                            <span>75%</span>
                        </div>
                        <progress className="progress progress-primary w-full" value="75" max="100"></progress>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Custom Layouts</span>
                            <span>50%</span>
                        </div>
                        <progress className="progress progress-warning w-full" value="50" max="100"></progress>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content">
                <div className="card-body">
                    <h2 className="card-title">Ready to add a new team?</h2>
                    <p>To add a new team page, just add a new file or folder in <code className="bg-black/20 px-2 py-1 rounded">src/pages/(dummy)/teams/</code>.</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-ghost">Create Team</button>
                        <button className="btn btn-outline">Documentation</button>
                    </div>
                </div>
            </div>

            {/* Footer note */}
            <div className="divider my-8"></div>
            <div className="text-center text-sm opacity-70">
                <p>Edit <code className="bg-base-300 px-2 py-1 rounded">src/pages/(dummy)/teams/page.jsx</code> to change this page.</p>
            </div>
        </div>
    );
}