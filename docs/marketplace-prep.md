# Marketplace Preparation

This repo is ready for local VS Code Insiders testing before any Marketplace submission.

## Pre-Publish Checklist

- Confirm the extension name and Marketplace publisher ID.
- Confirm the README attribution to Erfan Khadivar's AMOLED Black Theme is acceptable.
- Confirm `LICENSE` and `THIRD_PARTY_NOTICES.md` preserve the upstream MIT notice.
- Run `npm run validate`.
- Run `npm run package`.
- Install the VSIX with `code-insiders --install-extension ./amoled-black-shiny-insiders-0.0.1.vsix --force`.
- In VS Code Insiders, select `AMOLED Black Shiny Insiders` from the theme picker.
- Confirm the workbench colors and syntax colors match the intended look.

## Publishing Commands

After the local test pass is approved:

```powershell
npx vsce login <publisher-id>
npx vsce publish
```

Publishing requires a Visual Studio Marketplace publisher and an Azure DevOps Personal Access Token with Marketplace Manage scope.
