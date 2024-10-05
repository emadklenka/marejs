#!/usr/bin/env node
const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log('Starting MareJsInstaller...');

// Ask the user for the project name
rl.question('Enter your project name: ', (projectName) => {
    const projectPath = path.join(process.cwd(), projectName);

    // Check if the folder already exists
    if (fs.existsSync(projectPath)) {
        console.error(`Error: A folder named ${projectName} already exists.`);
        rl.close();
        process.exit(1);
    }

    // Create a new folder with the project name
    fs.mkdirSync(projectPath);

    console.log(`Cloning repository into ${projectName}...`);

    // Clone the repo into the new folder
    try {
        execSync(`git clone https://github.com/emadklenka/marejs.git ${projectPath}`, { stdio: 'inherit' });

        console.log('Repository cloned successfully.');

        // Remove the .git directory to detach from your repo
        const gitFolderPath = path.join(projectPath, '.git');
        if (fs.existsSync(gitFolderPath)) {
            fs.rmSync(gitFolderPath, { recursive: true, force: true });
        }

        const gitFolderPath2= path.join(projectPath, '.github');
        if (fs.existsSync(gitFolderPath2)) {
            fs.rmSync(gitFolderPath2, { recursive: true, force: true });
        }

        // Remove the MareJsInstaller.cjs file from the .mareJS directory
        const installerFilePath = path.join(projectPath, '.mareJS', 'MareJsInstaller.cjs');
        if (fs.existsSync(installerFilePath)) {
            fs.rmSync(installerFilePath);
        }

        // Load package.json and remove the bin entry
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            if (packageJson.bin && packageJson.bin.marejs) {
                delete packageJson.bin.marejs;
                fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
                console.log('Removed bin entry from package.json.');
            }
        }

        // Display further instructions to the user
        console.log(`\nSuccess! Now run the following commands:`);
        console.log(`  cd ${projectName}`);
        console.log(`  pnpm i  (or npm i if pnpm is not installed)`);

        // Instructions for installing pnpm if not installed
        console.log(`\nIf pnpm is not installed, you can install it by running:`);
        console.log(`  npm install -g pnpm`);

    } catch (error) {
        console.error('Error cloning the repository:', error.message);
        process.exit(1);
    }

    rl.close();
});
