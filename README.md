# AMOLED Shiny

A standalone VS Code theme extension for VS Code and VS Code Insiders. It starts from Erfan Khadivar's MIT-licensed [AMOLED Black Theme](https://github.com/rendinjast/amoled-black), preserves the `AMOLED Black Shiny` TextMate syntax highlighting, and bakes Nick's current workbench colors into the theme.

The result is meant to replace a pile of user settings with a real theme extension that can be versioned, packaged, installed, and eventually published.

## Theme

- Theme picker label: `AMOLED Shiny`
- Source syntax theme: `rendinjast.amoled-black-0.1.0`
- Local source settings: `%APPDATA%\Code - Insiders\User\settings.json`
- Generated theme file: `themes/amoled-shiny-color-theme.json`

## Development

Install dependencies:

```powershell
npm install
```

Regenerate the theme from the installed AMOLED Black Shiny extension and current VS Code Insiders settings:

```powershell
npm run generate
```

Validate the generated theme and package contents:

```powershell
npm run validate
```

Package the extension as a VSIX:

```powershell
npm run package
```

Install the packaged theme into VS Code Insiders:

```powershell
npm run install:insiders
```

Install the packaged theme into stable VS Code:

```powershell
npm run install:code
```

Open the extension in an Insiders Extension Development Host:

```powershell
npm run open:dev
```

Then use the Color Theme picker and choose `AMOLED Shiny`.

## Updating Colors Later

To update workbench colors:

1. Edit `workbench.colorCustomizations` in VS Code or VS Code Insiders settings.
2. Run `npm run generate`.
3. Review the diff in `themes/amoled-shiny-color-theme.json`.
4. Run `npm run validate` and reinstall/package as needed.

To update token colors:

1. Edit the installed upstream source theme or manually edit `tokenColors` in the generated theme.
2. Prefer adding a repeatable transformation to `scripts/generate-theme.mjs` if the change should survive regeneration.
3. Run `npm run validate`.

To update semantic token colors:

1. Add `editor.semanticTokenColorCustomizations` in VS Code or VS Code Insiders settings.
2. Run `npm run generate`.
3. Check that `semanticTokenColors` appears in the generated theme.

## License Guidance

This extension is MIT licensed. The syntax token rules are derived from Erfan Khadivar's MIT-licensed AMOLED Black Theme, so the original copyright and license notice are preserved in `THIRD_PARTY_NOTICES.md` and `LICENSE`.

Before publishing to the Visual Studio Marketplace, confirm your Marketplace publisher ID and verify that the original attribution remains visible in this README and the third-party notices.

## Marketplace Preparation

Do not publish until the local VS Code and VS Code Insiders test pass has been reviewed. The official VS Code docs currently recommend `@vscode/vsce` for packaging and publishing extensions, and the package script uses that tool.
