# Repository rules for future agents

- Change only files named in the task.
- Never refactor or reformat unrelated files.
- Machine and content data lives in `content/*.json`; adding a machine means adding a file, never editing other machines.
- Run `npm run verify` before every push, and never push if it fails.
- Work on a branch; never commit to `main`.
- Stage only changed files.
- Never invent specs, numbers, awards, or customer names.
- Never write secrets to the repository.
- Write UTF-8 files with LF line endings. Do not use PowerShell `Set-Content`, `Out-File`, or `>` redirection; use a patch tool or `node fs.writeFileSync(path, text, 'utf8')`.
