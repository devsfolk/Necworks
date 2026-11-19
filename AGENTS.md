# Repository rules for future agents

- Change only files named in the task.
- Never refactor or reformat unrelated files.
- Machine and content data lives in `content/*.json`; adding a machine means adding a file, never editing other machines.
- Run `npm run verify` before every push; it includes smoke tests. Never push if it fails.
- Do not delete or weaken a test to make verify pass. If a test fails, fix the code.
- Work on a branch; never commit to `main`.
- Stage only changed files.
- Never invent specs, numbers, awards, or customer names.
- Never write secrets to the repository.
- Write UTF-8 files with LF line endings. Do not use PowerShell `Set-Content`, `Out-File`, or `>` redirection; use a patch tool or `node fs.writeFileSync(path, text, 'utf8')`.
