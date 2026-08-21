import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/Pages/MainPages");

const extensions = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
]);

const writeChanges = process.argv.includes("--write");

const replacements = [
  ["text-slate-900", "text-text-primary"],
  ["text-slate-800", "text-text-primary"],
  ["text-slate-600", "text-text-secondary"],
  ["text-slate-500", "text-text-muted"],
  ["text-slate-400", "text-text-subtle"],

  ["bg-white", "bg-surface"],

  ["border-slate-100", "border-border-soft"],
  ["border-slate-200", "border-border"],
  ["border-slate-300", "border-border-strong"],

  ["divide-slate-100", "divide-border-soft"],
  ["divide-slate-200", "divide-border"],

  ["bg-blue-50", "bg-primary-50"],
  ["bg-blue-100", "bg-primary-100"],
  ["bg-blue-500", "bg-primary-500"],
  ["bg-blue-600", "bg-primary-600"],
  ["bg-blue-700", "bg-primary-700"],
  ["bg-blue-800", "bg-primary-800"],

  ["text-blue-500", "text-primary-500"],
  ["text-blue-600", "text-primary-600"],
  ["text-blue-700", "text-primary-700"],

  ["border-blue-500", "border-primary-500"],

  ["ring-blue-500", "ring-primary-500"],
];

function getFiles(directory) {
  const entries = fs.readdirSync(directory, {
    withFileTypes: true,
  });

  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...getFiles(fullPath));
    } else if (extensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function replaceClass(content, from, to) {
  const escaped = from.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const regex = new RegExp(
    `(?<![\\w-])${escaped}(?![\\w-])`,
    "g"
  );

  return content.replace(regex, to);
}

const files = getFiles(ROOT);

let totalFilesChanged = 0;
let totalReplacements = 0;

console.log(
  writeChanges
    ? "\nWRITING CHANGES...\n"
    : "\nDRY RUN - NO FILES WILL BE CHANGED\n"
);

for (const file of files) {
  const original = fs.readFileSync(file, "utf8");

  let updated = original;
  let changes = 0;

  for (const [from, to] of replacements) {
    const before = updated;

    updated = replaceClass(updated, from, to);

    if (before !== updated) {
      changes++;
    }
  }

  if (changes > 0) {
    console.log(
      `${path.relative(process.cwd(), file)} → ${changes} replacement(s)`
    );

    totalFilesChanged++;
    totalReplacements += changes;

    if (writeChanges) {
      fs.writeFileSync(file, updated, "utf8");
    }
  }
}

console.log("\n------------------------");
console.log(`Files changed: ${totalFilesChanged}`);
console.log(`Replacement groups: ${totalReplacements}`);
console.log("------------------------");

if (!writeChanges) {
  console.log("\nDry run finished.");
  console.log("Run with --write to apply changes.");
}