#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('MCP Servers Consolidation Setup');
console.log('===============================');

// Default configuration
const defaultConfig = {
  claudeDesktopPath: '/home/neno/claude-desktop-debian',
  enabledServers: [
    'brave-search',
    'filesystem',
    'memory',
    'github',
    'sequential-thinking',
    'playwright'
  ],
  autostart: true
};

// Create .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('Creating .env file...');
  fs.writeFileSync(envPath, `CLAUDE_DESKTOP_PATH=${defaultConfig.claudeDesktopPath}\n`);
}

// Ask for Claude Desktop path
rl.question(`Enter path to Claude Desktop (default: ${defaultConfig.claudeDesktopPath}): `, (claudeDesktopPath) => {
  let configPath = claudeDesktopPath || defaultConfig.claudeDesktopPath;
  
  // Update .env file
  fs.writeFileSync(envPath, `CLAUDE_DESKTOP_PATH=${configPath}\n`);
  
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Create PM2 ecosystem.config.js
  console.log('Creating PM2 startup configuration...');
  const pm2Config = `
module.exports = {
  apps : [{
    name: 'mcp-servers',
    script: 'index.js',
    watch: false,
    env: {
      NODE_ENV: 'production',
      CLAUDE_DESKTOP_PATH: '${configPath}'
    },
    autorestart: true
  }]
};
`;
  
  fs.writeFileSync(path.join(__dirname, 'ecosystem.config.js'), pm2Config);
  
  // Create connection info for Claude Desktop
  console.log('Creating MCP servers info file for Claude Desktop...');
  
  // Directory for Claude Desktop configuration
  const claudeDesktopConfig = path.join(configPath, 'mcp-servers', 'config');
  
  if (!fs.existsSync(claudeDesktopConfig)) {
    fs.mkdirSync(claudeDesktopConfig, { recursive: true });
  }
  
  // Create MCP servers list
  const mcpInfo = {
    servers: [
      {
        name: 'Brave Search',
        packageName: '@modelcontextprotocol/server-brave-search',
        enabled: true,
        startCommand: 'npx @modelcontextprotocol/server-brave-search'
      },
      {
        name: 'Filesystem',
        packageName: '@modelcontextprotocol/server-filesystem',
        enabled: true,
        startCommand: 'npx @modelcontextprotocol/server-filesystem'
      },
      {
        name: 'Memory',
        packageName: '@modelcontextprotocol/server-memory',
        enabled: true,
        startCommand: 'npx @modelcontextprotocol/server-memory'
      },
      {
        name: 'GitHub',
        packageName: '@modelcontextprotocol/server-github',
        enabled: true,
        startCommand: 'npx @modelcontextprotocol/server-github'
      },
      {
        name: 'Sequential Thinking',
        packageName: '@modelcontextprotocol/server-sequential-thinking',
        enabled: true,
        startCommand: 'npx @modelcontextprotocol/server-sequential-thinking'
      },
      {
        name: 'Playwright',
        enabled: true,
        customPath: path.join(__dirname, 'servers', 'playwright-server'),
        startCommand: 'npm run start',
        capabilities: [
          'browser automation',
          'screenshot capture',
          'webpage interaction'
        ]
      }
    ],
    managedBy: 'consolidated-mcp-servers',
    startCommand: 'cd /home/neno/mcp-servers-consolidated && npm run start:all',
    version: '1.0.0'
  };
  
  fs.writeFileSync(
    path.join(claudeDesktopConfig, 'mcp-servers.json'),
    JSON.stringify(mcpInfo, null, 2)
  );
  
  // Create startup script
  console.log('Creating startup script...');
  const startupScript = `#!/bin/bash
# Start consolidated MCP servers for Claude Desktop
cd ${__dirname}
npm run start:all
`;
  
  const startupPath = path.join(__dirname, 'start-mcp-servers.sh');
  fs.writeFileSync(startupPath, startupScript);
  fs.chmodSync(startupPath, '755');
  
  // Create a symbolic link in Claude Desktop directory
  const linkPath = path.join(configPath, 'start-mcp-servers.sh');
  try {
    if (fs.existsSync(linkPath)) {
      fs.unlinkSync(linkPath);
    }
    fs.symlinkSync(startupPath, linkPath);
    console.log(`Created symbolic link at ${linkPath}`);
  } catch (err) {
    console.error(`Error creating symbolic link: ${err.message}`);
  }
  
  console.log('\nSetup complete!');
  console.log('\nTo start the MCP servers:');
  console.log('  npm run start:all');
  console.log('\nTo add to startup:');
  console.log('  npx pm2 start ecosystem.config.js');
  console.log('  npx pm2 save');
  console.log('  npx pm2 startup');
  console.log('\nClaude Desktop can now access all MCP servers from a single location.');
  
  rl.close();
});