# Consolidated MCP Servers for Claude Desktop

This repository contains a consolidated setup for all MCP (Model Context Protocol) servers used by Claude Desktop.

## Included MCP Servers

- **Brave Search** - Web search capabilities
- **Filesystem** - Local file access
- **Memory** - Persistent memory storage
- **GitHub** - GitHub repository access
- **Sequential Thinking** - Enhanced reasoning capabilities
- **Playwright** - Browser automation and web interaction

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/username/mcp-servers-consolidated.git
   cd mcp-servers-consolidated
   ```

2. Run the setup script:
   ```bash
   node setup.js
   ```
   
   Follow the prompts to configure the MCP servers for your Claude Desktop installation.

3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Starting All MCP Servers

```bash
npm run start:all
```

### Starting Individual Servers

To start the Playwright server:
```bash
npm run start:playwright
```

## Auto-starting with System

The setup creates a PM2 configuration that can be used to start the MCP servers automatically:

```bash
npx pm2 start ecosystem.config.js
npx pm2 save
npx pm2 startup
```

Follow the instructions from the last command to complete the setup.

## Claude Desktop Integration

The setup script automatically creates the necessary configuration files for Claude Desktop to discover and use these MCP servers. The configuration is stored in:

```
/home/neno/claude-desktop-debian/mcp-servers/config/mcp-servers.json
```

## Manual Configuration

If you need to manually configure Claude Desktop to use these servers, add the following to your Claude Desktop configuration:

```json
{
  "mcp": {
    "servers": [
      "@modelcontextprotocol/server-brave-search",
      "@modelcontextprotocol/server-filesystem",
      "@modelcontextprotocol/server-memory",
      "@modelcontextprotocol/server-github",
      "@modelcontextprotocol/server-sequential-thinking",
      "/home/neno/mcp-servers-consolidated/servers/playwright-server"
    ]
  }
}
```

## Troubleshooting

If you encounter issues with any of the MCP servers:

1. Check the logs:
   ```bash
   tail -f ~/.pm2/logs/mcp-servers-out.log
   tail -f ~/.pm2/logs/mcp-servers-error.log
   ```

2. Restart the servers:
   ```bash
   npm run start:all
   ```

3. Check individual server status:
   ```bash
   npx pm2 ls
   ```

## Updating

To update the MCP servers to their latest versions:

```bash
npm update
npm run setup
```