import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "jsonc-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

const sourceThemePath = join(
  process.env.USERPROFILE,
  ".vscode-insiders",
  "extensions",
  "rendinjast.amoled-black-0.1.0",
  "themes",
  "amoled-dark-shiny-color-theme.json",
);

const settingsPath = join(
  process.env.APPDATA,
  "Code - Insiders",
  "User",
  "settings.json",
);

const outputPath = join(
  repoRoot,
  "themes",
  "amoled-black-shiny-insiders-color-theme.json",
);

for (const path of [sourceThemePath, settingsPath]) {
  if (!existsSync(path)) {
    throw new Error(`Required input does not exist: ${path}`);
  }
}

const sourceTheme = parse(readFileSync(sourceThemePath, "utf8"));
const settings = parse(readFileSync(settingsPath, "utf8"));

if (!sourceTheme || typeof sourceTheme !== "object") {
  throw new Error(`Could not parse source theme: ${sourceThemePath}`);
}

if (!settings || typeof settings !== "object") {
  throw new Error(`Could not parse VS Code Insiders settings: ${settingsPath}`);
}

const workbenchColors = {
  ...(sourceTheme.colors ?? {}),
  ...(settings["workbench.colorCustomizations"] ?? {}),
};

delete workbenchColors.$schema;

const theme = {
  $schema: "vscode://schemas/color-theme",
  name: "AMOLED Black Shiny Insiders",
  type: "dark",
  semanticHighlighting: settings["editor.semanticHighlighting.enabled"] ?? true,
  colors: workbenchColors,
  tokenColors: sourceTheme.tokenColors ?? [],
};

const semanticTokenColors = settings["editor.semanticTokenColorCustomizations"];
if (
  semanticTokenColors &&
  typeof semanticTokenColors === "object" &&
  Object.keys(semanticTokenColors).length > 0
) {
  theme.semanticTokenColors = semanticTokenColors;
}

writeFileSync(outputPath, `${JSON.stringify(theme, null, 2)}\n`);

console.log(`Generated ${outputPath}`);
console.log(`Source token color rules: ${theme.tokenColors.length}`);
console.log(`Workbench colors: ${Object.keys(theme.colors).length}`);
console.log(`Semantic token colors: ${Object.keys(theme.semanticTokenColors ?? {}).length}`);
