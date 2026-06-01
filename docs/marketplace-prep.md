# Marketplace Preparation

This repo is ready for local VS Code and VS Code Insiders testing before any Marketplace submission.

## Pre-Publish Checklist

- Confirm the extension name and Marketplace publisher ID.
- Confirm the README attribution to Erfan Khadivar's AMOLED Black Theme is acceptable.
- Confirm `LICENSE` and `THIRD_PARTY_NOTICES.md` preserve the upstream MIT notice.
- Run `npm run validate`.
- Run `npm run package`.
- Install the VSIX with `code-insiders --install-extension ./amoled-shiny-0.0.1.vsix --force`.
- Optionally install the same VSIX in stable VS Code with `code --install-extension ./amoled-shiny-0.0.1.vsix --force`.
- Confirm the theme picker shows all six variants: `AMOLED Shiny`, `AMOLED Shiny Codex`, `AMOLED Shiny Codex 2`, `AMOLED Shiny Codex 3`, `AMOLED Shiny Codex 4`, and `AMOLED Shiny Codex 5`.
- Select each variant at least once and inspect syntax highlighting on representative TypeScript, Markdown, JSON, and PowerShell files.
- Confirm the workbench colors and syntax colors match the intended look.

## Publishing Commands

After the local test pass is approved:

```powershell
npx vsce login <publisher-id>
npx vsce publish
```

Publishing requires a Visual Studio Marketplace publisher and an Azure DevOps Personal Access Token with Marketplace Manage scope.
