# Linux Command Trainer

A browser-based tool for learning Linux commands progressively — no terminal access required.

## A note on macOS
These commands are taught for use on Linux systems — remote servers, containers, and cloud instances. Most work identically on macOS, which shares Unix roots with Linux. Commands that aren't available on macOS are flagged in the app with their Mac equivalent where one exists.

## How it works

Commands are grouped into six categories. Work through each one across five modes, starting with Recognition and building up to Mastery. Each mode unlocks when you score 80% or higher in the previous one for that category. Scoring 90%+ on the All Commands drill unlocks the next tier across all categories at once.

### The five modes
- **Recognition** — pick the correct command from 4 options
- **Recall** — type the command from scratch
- **Scenario** — identify the right command for a real world situation
- **Realism** — type the full command including flags and arguments
- **Mastery** — expert level challenges requiring precise commands

## Features
- Five drill modes with a progressive unlock system
- Six command categories: Navigation, Files, Permissions, Search, Processes, Networking
- Finite sessions — each drill covers every command in the category exactly once
- Results screen with accuracy score and personal best tracking
- Progress page showing best scores across all mode and category combinations
- Command library — browsable reference with flags, examples and scenarios
- Mac compatibility indicators for Linux-only commands
- Passkey protected

## Getting Started

### Prerequisites
- Node.js v22+ (use `nvm use` if you have nvm installed)

### Install and run
```bash
npm install
npm run dev 
```
(You'll need a passkey from the next step to access the tool for the first time)

### Environment variables
Create a `.env` file in the project root:
Call the variable "VITE_PASSKEY" and give it any passphrase. 
VITE_PASSKEY=[yourpassphrase]
(For now it doesn't matter what value you give it, once the tool is properly deployed a shared passkey will
control access to the tool).


## Built With
- React
- Vite
- React Router

## Roadmap
See `buildplan.md` for planned features.