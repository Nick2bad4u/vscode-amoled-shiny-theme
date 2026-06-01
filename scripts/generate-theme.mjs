import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "jsonc-parser";
import * as plist from "plist";

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

const tmThemeRoot = join(process.env.USERPROFILE, ".codex", "themes");

const themeDefinitions = [
  {
    label: "AMOLED Shiny",
    output: "amoled-shiny-color-theme.json",
    source: "json",
    sourcePath: sourceThemePath,
  },
  {
    label: "AMOLED Shiny Codex",
    output: "amoled-shiny-codex-color-theme.json",
    source: "tmTheme",
    sourcePath: join(tmThemeRoot, "converted-vscode-AmoledShinyBlack.tmTheme"),
  },
  {
    label: "AMOLED Shiny Codex 2",
    output: "amoled-shiny-codex-2-color-theme.json",
    source: "tmTheme",
    sourcePath: join(tmThemeRoot, "converted-vscode-AmoledShinyBlack2.tmTheme"),
  },
  {
    label: "AMOLED Shiny Codex 3",
    output: "amoled-shiny-codex-3-color-theme.json",
    source: "tmTheme",
    sourcePath: join(tmThemeRoot, "converted-vscode-AmoledShinyBlack3.tmTheme"),
  },
  {
    label: "AMOLED Shiny Codex 4",
    output: "amoled-shiny-codex-4-color-theme.json",
    source: "tmTheme",
    sourcePath: join(tmThemeRoot, "converted-vscode-AmoledShinyBlack4.tmTheme"),
  },
  {
    label: "AMOLED Shiny Codex 5",
    output: "amoled-shiny-codex-5-color-theme.json",
    source: "tmTheme",
    sourcePath: join(tmThemeRoot, "converted-vscode-AmoledShinyBlack5.tmTheme"),
  },
];

for (const path of [settingsPath, ...themeDefinitions.map((theme) => theme.sourcePath)]) {
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

function getJsonTokenColors(path) {
  const theme = parse(readFileSync(path, "utf8"));

  if (!theme || typeof theme !== "object") {
    throw new Error(`Could not parse source theme: ${path}`);
  }

  return theme.tokenColors ?? [];
}

function getTmThemeData(path) {
  const tmTheme = plist.parse(readFileSync(path, "utf8"));
  const settings = Array.isArray(tmTheme.settings) ? tmTheme.settings : [];
  const [globalSettingsEntry, ...scopedSettings] = settings;

  return {
    globalSettings: globalSettingsEntry?.scope ? undefined : globalSettingsEntry?.settings,
    tokenColors: scopedSettings
      .filter((entry) => entry?.scope && entry?.settings)
      .map((entry) => ({
        ...(entry.name ? { name: entry.name } : {}),
        scope: entry.scope,
        settings: entry.settings,
      })),
  };
}

function getColorsForVariant(globalSettings) {
  const colors = { ...workbenchColors };

  if (!globalSettings) {
    return colors;
  }

  const colorMappings = {
    background: "editor.background",
    caret: "editorCursor.foreground",
    foreground: "editor.foreground",
    invisibles: "editorWhitespace.foreground",
    lineHighlight: "editor.lineHighlightBackground",
    selection: "editor.selectionBackground",
  };

  for (const [tmThemeKey, colorKey] of Object.entries(colorMappings)) {
    if (globalSettings[tmThemeKey]) {
      colors[colorKey] = globalSettings[tmThemeKey];
    }
  }

  return colors;
}

const semanticTokenColors = settings["editor.semanticTokenColorCustomizations"];

for (const definition of themeDefinitions) {
  const sourceData =
    definition.source === "tmTheme"
      ? getTmThemeData(definition.sourcePath)
      : { tokenColors: getJsonTokenColors(definition.sourcePath) };

  const theme = {
    $schema: "vscode://schemas/color-theme",
    name: definition.label,
    type: "dark",
    semanticHighlighting: settings["editor.semanticHighlighting.enabled"] ?? true,
    colors: getColorsForVariant(sourceData.globalSettings),
    tokenColors: sourceData.tokenColors,
  };

  if (
    semanticTokenColors &&
    typeof semanticTokenColors === "object" &&
    Object.keys(semanticTokenColors).length > 0
  ) {
    theme.semanticTokenColors = semanticTokenColors;
  }

  const outputPath = join(repoRoot, "themes", definition.output);
  writeFileSync(outputPath, `${JSON.stringify(theme, null, 2)}\n`);

  console.log(`Generated ${definition.label}: ${outputPath}`);
  console.log(`  Token color rules: ${theme.tokenColors.length}`);
  console.log(`  Workbench colors: ${Object.keys(theme.colors).length}`);
  console.log(`  Semantic token colors: ${Object.keys(theme.semanticTokenColors ?? {}).length}`);
}
