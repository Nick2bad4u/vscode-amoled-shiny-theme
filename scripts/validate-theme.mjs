import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const packageJsonPath = join(repoRoot, "package.json");
const themePath = join(repoRoot, "themes", "amoled-black-shiny-insiders-color-theme.json");

const manifest = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const theme = JSON.parse(readFileSync(themePath, "utf8"));

const contributedTheme = manifest.contributes?.themes?.[0];
const failures = [];

if (!contributedTheme) {
  failures.push("package.json must contribute one theme.");
}

if (contributedTheme?.label !== "AMOLED Black Shiny Insiders") {
  failures.push("Theme picker label must be AMOLED Black Shiny Insiders.");
}

if (contributedTheme?.uiTheme !== "vs-dark") {
  failures.push("Theme must target the dark VS Code UI.");
}

if (contributedTheme?.path !== "./themes/amoled-black-shiny-insiders-color-theme.json") {
  failures.push("package.json theme path does not match the generated theme file.");
}

if (theme.name !== "AMOLED Black Shiny Insiders") {
  failures.push("Theme JSON name is incorrect.");
}

if (theme.type !== "dark") {
  failures.push("Theme JSON type must be dark.");
}

if (!theme.colors || Object.keys(theme.colors).length < 900) {
  failures.push("Theme should contain the merged workbench color customizations.");
}

if (!Array.isArray(theme.tokenColors) || theme.tokenColors.length < 40) {
  failures.push("Theme should preserve the AMOLED Black Shiny TextMate token color rules.");
}

if (theme.colors.$schema) {
  failures.push("workbench.colorCustomizations $schema must not be copied into theme colors.");
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Theme validation passed.");
console.log(`Workbench colors: ${Object.keys(theme.colors).length}`);
console.log(`Token color rules: ${theme.tokenColors.length}`);
