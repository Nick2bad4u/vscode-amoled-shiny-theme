import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const packageJsonPath = join(repoRoot, "package.json");
const expectedThemes = [
  ["AMOLED Shiny", "./themes/amoled-shiny-color-theme.json"],
  ["AMOLED Shiny Codex", "./themes/amoled-shiny-codex-color-theme.json"],
  ["AMOLED Shiny Codex 2", "./themes/amoled-shiny-codex-2-color-theme.json"],
  ["AMOLED Shiny Codex 3", "./themes/amoled-shiny-codex-3-color-theme.json"],
  ["AMOLED Shiny Codex 4", "./themes/amoled-shiny-codex-4-color-theme.json"],
  ["AMOLED Shiny Codex 5", "./themes/amoled-shiny-codex-5-color-theme.json"],
];

const manifest = JSON.parse(readFileSync(packageJsonPath, "utf8"));

const failures = [];
const contributedThemes = manifest.contributes?.themes ?? [];

if (contributedThemes.length !== expectedThemes.length) {
  failures.push(`package.json must contribute ${expectedThemes.length} themes.`);
}

for (const [index, [expectedLabel, expectedPath]] of expectedThemes.entries()) {
  const contributedTheme = contributedThemes[index];

  if (contributedTheme?.label !== expectedLabel) {
    failures.push(`Theme ${index + 1} label must be ${expectedLabel}.`);
  }

  if (contributedTheme?.uiTheme !== "vs-dark") {
    failures.push(`${expectedLabel} must target the dark VS Code UI.`);
  }

  if (contributedTheme?.path !== expectedPath) {
    failures.push(`${expectedLabel} package.json theme path is incorrect.`);
  }

  const theme = JSON.parse(readFileSync(join(repoRoot, expectedPath), "utf8"));

  if (theme.name !== expectedLabel) {
    failures.push(`${expectedLabel} theme JSON name is incorrect.`);
  }

  if (theme.type !== "dark") {
    failures.push(`${expectedLabel} theme JSON type must be dark.`);
  }

  if (!theme.colors || Object.keys(theme.colors).length < 900) {
    failures.push(`${expectedLabel} should contain the merged workbench color customizations.`);
  }

  if (!Array.isArray(theme.tokenColors) || theme.tokenColors.length < 40) {
    failures.push(`${expectedLabel} should contain TextMate token color rules.`);
  }

  if (theme.colors.$schema) {
    failures.push(`${expectedLabel} must not copy workbench.colorCustomizations $schema into theme colors.`);
  }
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Theme validation passed.");
for (const [expectedLabel, expectedPath] of expectedThemes) {
  const theme = JSON.parse(readFileSync(join(repoRoot, expectedPath), "utf8"));
  console.log(`${expectedLabel}: ${Object.keys(theme.colors).length} workbench colors, ${theme.tokenColors.length} token color rules`);
}
