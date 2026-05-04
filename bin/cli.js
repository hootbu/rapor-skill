#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');

const SKILL_NAME = 'report';
const skillSrc = path.resolve(__dirname, '..');
const claudeDir = path.join(os.homedir(), '.claude');
const skillsDir = path.join(claudeDir, 'skills');
const linkPath = path.join(skillsDir, SKILL_NAME);

const args = process.argv.slice(2);
const cmd = args[0] || 'install';
const force = args.includes('--force') || args.includes('-f');

function pathExists(p) {
  try { fs.lstatSync(p); return true; } catch { return false; }
}

function help() {
  console.log(`
hootbu-report-skill — Claude Code daily report skill

Usage:
  hootbu-report-skill install            Install the skill
  hootbu-report-skill install --force    Reinstall (overwrites existing)
  hootbu-report-skill uninstall          Remove the skill
  hootbu-report-skill help               Show this message

After installing, open Claude Code in any git repo and run:
  /report          Turkish (default), interactive
  /report -en      English, interactive
  /report --direkt Auto-save today's report to ~/Desktop/rapor.md

Source: https://github.com/Hootbu/rapor-skill
`);
}

function ensureClaude() {
  if (!fs.existsSync(claudeDir)) {
    console.error(`Error: ${claudeDir} not found.`);
    console.error(`Is Claude Code installed? See https://claude.ai/code`);
    process.exit(1);
  }
}

function install() {
  ensureClaude();
  fs.mkdirSync(skillsDir, { recursive: true });

  if (pathExists(linkPath)) {
    if (!force) {
      console.log(`Already installed at ${linkPath}`);
      console.log(`Run "hootbu-report-skill install --force" to reinstall,`);
      console.log(`or "hootbu-report-skill uninstall" to remove first.`);
      return;
    }
    fs.rmSync(linkPath, { recursive: true, force: true });
  }

  try {
    fs.symlinkSync(skillSrc, linkPath, 'dir');
  } catch (err) {
    if (process.platform === 'win32') {
      fs.symlinkSync(skillSrc, linkPath, 'junction');
    } else {
      throw err;
    }
  }

  console.log(`Installed: ${linkPath} -> ${skillSrc}`);
  console.log(`Open Claude Code in a git repo and run /report`);
}

function uninstall() {
  if (!pathExists(linkPath)) {
    console.log(`Nothing to remove at ${linkPath}`);
    return;
  }
  fs.rmSync(linkPath, { recursive: true, force: true });
  console.log(`Removed: ${linkPath}`);
}

switch (cmd) {
  case 'install':
    install();
    break;
  case 'uninstall':
  case 'remove':
    uninstall();
    break;
  case 'help':
  case '--help':
  case '-h':
    help();
    break;
  default:
    console.error(`Unknown command: ${cmd}`);
    help();
    process.exit(1);
}
