# Contributing

Thanks for taking the time to look at this project. It's small and aims to stay that way, but improvements and bug reports are welcome.

## Reporting bugs

Open an issue at https://github.com/Hootbu/rapor-skill/issues with:

- What you ran (`/report`, `/report -en`, `/report --direkt`, etc.)
- What you expected
- What actually happened (paste the output if you can)
- Your OS and Claude Code version

## Suggesting features

Open an issue first describing the use case before opening a PR. Smaller is better — if a flag, a tone tweak, or a format adjustment can solve it, prefer that over new infrastructure.

## Pull requests

- Branch from `main`.
- Keep commits focused. Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) — `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.
- For changes to `SKILL.md`, run `/report` and `/report -en --direkt` in a real git repo and confirm the output still matches the documented format.
- For changes to `bin/cli.js`, manually verify both `install` and `uninstall` against `~/.claude/skills/report` on your machine.
- Update `CHANGELOG.md` under an `## [Unreleased]` section.

## Style

- Code-level identifiers (file names, function names, variable names) must never appear in generated reports — that's a hard rule of the skill.
- Prefer plain language over marketing tone, both in the report output and in this repo's docs.

## License

By contributing, you agree your contributions will be licensed under the MIT License.
