#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configuration for all MCP servers
const MCP_SERVERS = [
  {
    name: 'brave-search',
    packageName: '@modelcontextprotocol/server-brave-search',
    enabled: true,
    env: {},
    startCmd: 'npx',
    startArgs: ['@modelcontextprotocol/server-brave-search'],
  },
  {
    name: 'filesystem',
    packageName: '@modelcontextprotocol/server-filesystem',
    enabled: true,
    env: {},
    startCmd: 'npx',
    startArgs: ['@modelcontextprotocol/server-filesystem'],
  },
  {
    name: 'memory',
    packageName: '@modelcontextprotocol/server-memory',
    enabled: true,
    env: {},
    startCmd: 'npx',
    startArgs: ['@modelcontextprotocol/server-memory'],
  },
  {
    name: 'github',
    packageName: '@modelcontextprotocol/server-github',
    enabled: true,
    env: {},
    startCmd: 'npx',
    startArgs: ['@modelcontextprotocol/server-github'],
  },
  {
    name: 'sequential-thinking',
    packageName: '@modelcontextprotocol/server-sequential-thinking',
    enabled: true,
    env: {},
    startCmd: 'npx',
    startArgs: ['@modelcontextprotocol/server-sequential-thinking'],
  },
  {
    name: 'playwright',
    enabled: true,
    env: {},
    startCmd: 'npm',
    startArgs: ['run', 'start:playwright'],
    customStart: true,
  },
];

// Create servers directory if it doesn't exist
const serversDir = path.join(__dirname, 'servers');
if (!fs.existsSync(serversDir)) {
  fs.mkdirSync(serversDir, { recursive: true });
}

// Create playwright-server directory if it doesn't exist
const playwrightDir = path.join(serversDir, 'playwright-server');
if (!fs.existsSync(playwrightDir)) {
  fs.mkdirSync(playwrightDir, { recursive: true });
  
  // Copy playwright server files
  const sourceDir = '/home/neno/Dev/Ai-Assistans/playwright-server';
  if (fs.existsSync(sourceDir)) {
    console.log(`Copying Playwright server from ${sourceDir}`);
    
    // Copy package.json
    fs.copyFileSync(
      path.join(sourceDir, 'package.json'),
      path.join(playwrightDir, 'package.json')
    );
    
    // Create src directory
    const srcDir = path.join(playwrightDir, 'src');
    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir, { recursive: true });
    }
    
    // Copy index.ts
    fs.copyFileSync(
      path.join(sourceDir, 'src', 'index.ts'),
      path.join(srcDir, 'index.ts')
    );
    
    // Install dependencies
    console.log('Installing Playwright server dependencies...');
    const npm = spawn('npm', ['install'], { cwd: playwrightDir });
    
    npm.stdout.on('data', (data) => {
      console.log(`Playwright npm: ${data}`);
    });
    
    npm.stderr.on('data', (data) => {
      console.error(`Playwright npm error: ${data}`);
    });
    
    npm.on('close', (code) => {
      if (code === 0) {
        console.log('Playwright server dependencies installed successfully');
        
        // Build typescript
        console.log('Building Playwright server...');
        const build = spawn('npm', ['run', 'build'], { cwd: playwrightDir });
        
        build.stdout.on('data', (data) => {
          console.log(`Playwright build: ${data}`);
        });
        
        build.stderr.on('data', (data) => {
          console.error(`Playwright build error: ${data}`);
        });
        
        build.on('close', (code) => {
          if (code === 0) {
            console.log('Playwright server built successfully');
          } else {
            console.error(`Playwright build failed with code ${code}`);
          }
        });
      } else {
        console.error(`Playwright npm install failed with code ${code}`);
      }
    });
  } else {
    console.error(`Playwright source not found at ${sourceDir}`);
  }
}

// Create configuration file
const config = {
  servers: MCP_SERVERS,
  claudeDesktopPath: process.env.CLAUDE_DESKTOP_PATH || '/home/neno/claude-desktop-debian'
};

fs.writeFileSync(
  path.join(__dirname, 'config.json'),
  JSON.stringify(config, null, 2)
);

// Start all enabled servers
console.log('Starting MCP servers...');

let runningProcesses = [];

function startServer(server) {
  if (!server.enabled) {
    console.log(`Server ${server.name} is disabled, skipping`);
    return;
  }

  console.log(`Starting ${server.name} server...`);
  const env = { ...process.env, ...server.env };
  
  const proc = spawn(server.startCmd, server.startArgs, { 
    env,
    stdio: 'pipe',
    shell: true
  });
  
  proc.stdout.on('data', (data) => {
    console.log(`[${server.name}] ${data}`);
  });
  
  proc.stderr.on('data', (data) => {
    console.error(`[${server.name}] Error: ${data}`);
  });
  
  proc.on('close', (code) => {
    console.log(`${server.name} server exited with code ${code}`);
    
    // Remove from running processes
    runningProcesses = runningProcesses.filter(p => p.proc !== proc);
    
    // Restart server if it crashes
    if (code !== 0 && code !== null) {
      console.log(`Restarting ${server.name} server...`);
      setTimeout(() => {
        startServer(server);
      }, 5000);
    }
  });
  
  runningProcesses.push({ 
    name: server.name,
    proc
  });
  
  console.log(`${server.name} server started`);
}

// Start all enabled servers
MCP_SERVERS.forEach(startServer);

console.log('All MCP servers started');

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down all MCP servers...');
  
  runningProcesses.forEach(({ name, proc }) => {
    console.log(`Stopping ${name} server...`);
    proc.kill('SIGINT');
  });
  
  setTimeout(() => {
    console.log('Goodbye!');
    process.exit(0);
  }, 1000);
});