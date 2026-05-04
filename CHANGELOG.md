# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-05-04

Initial public release.

### Added
- `/report` Claude Code skill: reads git commits, groups them thematically, and produces a daily work report ready to send.
- Bilingual output: Turkish by default, English via `-en` flag, explicit Turkish via `-tr`.
- Interactive mode with name/company/project/commit-range prompts; preferences are saved to `~/.claude/report-preferences.json` for one-click reuse.
- `--direkt` mode: zero questions, uses saved preferences, auto-saves to `~/Desktop/rapor.md`.
- Multi-report file format with `--------` separator between runs.
- NPM distribution as `hootbu-report-skill` with an installer CLI (`hootbu-report-skill install` / `uninstall`).
- MIT license, bilingual README (Turkish / English).
