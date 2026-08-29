import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

// Usage: node scripts/create-tool-from-recipe.mjs <recipe.json> [<recipe2.json> ...]
// Recipe shape:
// {
//   dir: "geology/foo-bar",            // id === directory
//   title: "Foo Bar Calculator",
//   description: "One sentence.",
//   inputs: [{ id,label,kind,description, minimum?,maximum?,default?,enum? }],
//   outputs: [...same shapes...],
//   guards: ["if (!(input.a > 0))\n      return simpleError(\"a\", \"...\", \"invalid_a\");"],
//   formula: "return { foo: input.a * input.b };",   // body of calculate
//   calculateName?: "calculateFooBar",               // default calculate<Camel>
//   exampleInput: {...}, exampleOutput: {...},
//   specExtra?: "it(...)" extra vitest code
// }
const KIND_TYPE = {
  boolean: "boolean",
  integer: "number",
  number: "number",
  string: "string",
  bytes: "string",
  numberList: "readonly number[]",
  stringList: "readonly string[]",
  matrix: "(readonly number[])[]",
};
const TOOL_DIRECTORY_PATTERN =
  /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:\/[a-z][a-z0-9]*(?:-[a-z0-9]+)*)+$/;
const TYPESCRIPT_IDENTIFIER_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const supportedKinds = new Set([...Object.keys(KIND_TYPE), "object"]);

const fail = (message) => {
  throw new Error(`Invalid tool recipe: ${message}`);
};

const isRecord = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const validateFields = (fields, name, allowEmpty) => {
  if (!Array.isArray(fields) || (!allowEmpty && fields.length === 0))
    fail(`${name} must be ${allowEmpty ? "an array" : "a non-empty array"}.`);

  const ids = new Set();
  for (const [index, field] of fields.entries()) {
    if (!isRecord(field)) fail(`${name}[${index}] must be an object.`);
    if (
      typeof field.id !== "string" ||
      !TYPESCRIPT_IDENTIFIER_PATTERN.test(field.id)
    )
      fail(`${name}[${index}].id must be a TypeScript identifier.`);
    if (ids.has(field.id)) fail(`${name} contains duplicate id ${field.id}.`);
    ids.add(field.id);
    if (typeof field.label !== "string" || field.label.trim() === "")
      fail(`${name}[${index}].label must be a non-empty string.`);
    if (typeof field.kind !== "string" || !supportedKinds.has(field.kind))
      fail(`${name}[${index}].kind is unsupported.`);
    if (
      field.enum !== undefined &&
      (!Array.isArray(field.enum) ||
        field.enum.length === 0 ||
        field.enum.some((value) => typeof value !== "string") ||
        new Set(field.enum).size !== field.enum.length)
    )
      fail(`${name}[${index}].enum must contain unique strings.`);
    if (
      field.enum !== undefined &&
      field.kind !== "string" &&
      field.kind !== "bytes"
    )
      fail(`${name}[${index}].enum requires a string or bytes field.`);
    for (const bound of ["minimum", "maximum"]) {
      if (
        field[bound] !== undefined &&
        (typeof field[bound] !== "number" || !Number.isFinite(field[bound]))
      )
        fail(`${name}[${index}].${bound} must be finite.`);
    }
    if (
      field.minimum !== undefined &&
      field.maximum !== undefined &&
      field.minimum > field.maximum
    )
      fail(`${name}[${index}].minimum must not exceed maximum.`);
    if (field.required !== undefined && typeof field.required !== "boolean")
      fail(`${name}[${index}].required must be boolean.`);
    if (
      !allowEmpty &&
      (field.required === false || field.default !== undefined)
    )
      fail(`${name}[${index}] output fields cannot be optional or defaulted.`);
  }
};

const validateRecipe = (recipe) => {
  if (!isRecord(recipe)) fail("each recipe must be an object.");
  if (
    typeof recipe.dir !== "string" ||
    !TOOL_DIRECTORY_PATTERN.test(recipe.dir)
  )
    fail("dir must contain at least two lowercase kebab-case segments.");
  if (typeof recipe.title !== "string" || recipe.title.trim() === "")
    fail(`${recipe.dir}: title must be a non-empty string.`);
  if (
    typeof recipe.description !== "string" ||
    recipe.description.trim() === ""
  )
    fail(`${recipe.dir}: description must be a non-empty string.`);
  if (typeof recipe.formula !== "string" || recipe.formula.trim() === "")
    fail(`${recipe.dir}: formula must be a non-empty string.`);
  validateFields(recipe.inputs, `${recipe.dir}.inputs`, true);
  validateFields(recipe.outputs, `${recipe.dir}.outputs`, false);
  if (!isRecord(recipe.exampleInput) || !isRecord(recipe.exampleOutput))
    fail(`${recipe.dir}: exampleInput and exampleOutput must be objects.`);
  if (
    recipe.guards !== undefined &&
    (!Array.isArray(recipe.guards) ||
      recipe.guards.some((guard) => typeof guard !== "string"))
  )
    fail(`${recipe.dir}: guards must be an array of strings.`);
  if (
    recipe.invalidCases !== undefined &&
    (!Array.isArray(recipe.invalidCases) ||
      recipe.invalidCases.some(
        (invalidCase) => !isRecord(invalidCase) || !isRecord(invalidCase.input),
      ))
  )
    fail(
      `${recipe.dir}: invalidCases must contain objects with input objects.`,
    );
  for (const property of ["calculateName", "camelOverride"]) {
    if (
      recipe[property] !== undefined &&
      (typeof recipe[property] !== "string" ||
        !TYPESCRIPT_IDENTIFIER_PATTERN.test(recipe[property]))
    )
      fail(`${recipe.dir}: ${property} must be a TypeScript identifier.`);
  }
  if (recipe.specExtra !== undefined && typeof recipe.specExtra !== "string")
    fail(`${recipe.dir}: specExtra must be a string.`);
};
const kindType = (f) =>
  f.kind === "object"
    ? "Record<string, unknown>"
    : (KIND_TYPE[f.kind] ?? "unknown");
const tsField = (fields) =>
  fields
    .map(
      (f) =>
        `  readonly ${f.id}${f.default !== undefined || f.required === false ? "?" : ""}: ${f.enum ? f.enum.map((v) => JSON.stringify(v)).join(" | ") : kindType(f)};`,
    )
    .join("\n");
const simpleField = (f) => {
  const parts = [];
  if (f.description !== undefined)
    parts.push(`description: ${JSON.stringify(f.description)}`);
  if (f.default !== undefined)
    parts.push(`default: ${JSON.stringify(f.default)}`);
  parts.push(`id: ${JSON.stringify(f.id)}`);
  parts.push(`kind: ${JSON.stringify(f.kind)}`);
  parts.push(`label: ${JSON.stringify(f.label ?? f.id)}`);
  if (f.minimum !== undefined) parts.push(`minimum: ${f.minimum}`);
  if (f.maximum !== undefined) parts.push(`maximum: ${f.maximum}`);
  if (f.enum !== undefined) parts.push(`enum: ${JSON.stringify(f.enum)}`);
  if (f.required === false) parts.push("required: false");
  if (f.format !== undefined) parts.push(`format: ${JSON.stringify(f.format)}`);
  if (f.unit !== undefined) parts.push(`unit: ${JSON.stringify(f.unit)}`);
  return `    { ${parts.join(", ")} },`;
};

const camelOf = (dir) => {
  const seg = dir.split("/").pop();
  const p = seg.split("-");
  return (
    p[0] +
    p
      .slice(1)
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join("")
  );
};

const emit = (r) => {
  validateRecipe(r);
  const root = path.resolve(import.meta.dirname, "..");
  const sourceRoot = path.join(root, "packages/tools/src");
  const dirPath = path.resolve(sourceRoot, r.dir);
  if (dirPath === sourceRoot || !dirPath.startsWith(`${sourceRoot}${path.sep}`))
    fail(`${r.dir}: output directory escapes packages/tools/src.`);
  const camel = r.camelOverride ?? camelOf(r.dir);
  const Camel = camel[0].toUpperCase() + camel.slice(1);
  const calc = r.calculateName ?? `calculate${Camel}`;
  const segments = r.dir.split("/").length;
  const relCore = "../".repeat(segments) + "core/example.js";
  const relSimple = "../".repeat(segments) + "core/simple.js";

  const needsSimpleError = /simpleError/.test(
    (r.guards ?? []).join("\n") + r.formula,
  );
  const importLine1 = needsSimpleError
    ? `import { createSimpleTool, simpleError } from "${relSimple}";`
    : `import { createSimpleTool } from "${relSimple}";`;

  const toolTs = `import type { ToolExample } from "${relCore}";
${importLine1}

export type ${Camel}Input = {
${tsField(r.inputs)}
};

export type ${Camel}Output = {
${tsField(r.outputs)}
};

export const ${calc} = (
  input: ${Camel}Input,
): ${Camel}Output => {
  const record = input as unknown as Record<string, unknown>;
  void record;
${(r.guards ?? []).map((g) => "  " + g).join("\n")}
  ${r.formula}
};

export const ${camel}Example = {
  input: ${JSON.stringify(r.exampleInput, null, 2)},
  output: ${JSON.stringify(r.exampleOutput, null, 2)},
} satisfies ToolExample<${Camel}Input, ${Camel}Output>;

export const ${camel}Tool = createSimpleTool({
  id: ${JSON.stringify(r.dir)},
  title: ${JSON.stringify(r.title)},
  description: ${JSON.stringify(r.description)},
  inputs: [
${r.inputs.map(simpleField).join("\n")}
  ],
  outputs: [
${r.outputs.map(simpleField).join("\n")}
  ],
  calculate: (input) => ${calc}(input as unknown as ${Camel}Input),
});

export const run${Camel} = ${camel}Tool.execute;
export default ${camel}Tool;
`;

  const indexTs = `export {
  default,
  ${camel}Example,
  ${camel}Example as example,
  ${calc},
  run${Camel},
  type ${Camel}Input,
  type ${Camel}Output,
} from "./tool.js";
`;

  const invalidTests = (r.invalidCases ?? [])
    .map(
      (
        c,
      ) => `  it("rejects invalid input (${c.code ?? c.field ?? "case"})", () => {
    expect(run${Camel}(${JSON.stringify(c.input)}).ok).toBe(false);
  });`,
    )
    .join("\n");

  const specTs = `import { describe, expect, it } from "vitest";
import {
  ${camel}Example,
  ${calc},
  run${Camel},
} from "./tool.js";

describe(${JSON.stringify(r.dir)}, () => {
  it("reproduces its canonical example exactly", () => {
    expect(run${Camel}(${camel}Example.input)).toEqual({
      ok: true,
      output: ${camel}Example.output,
    });
  });
${invalidTests ? invalidTests + "\n" : ""}${r.specExtra ?? ""}
});
`;

  const outputFiles = ["tool.ts", "index.ts", "tool.spec.ts"].map((name) =>
    path.join(dirPath, name),
  );
  const existingFile = outputFiles.find(existsSync);
  if (existingFile)
    fail(`${r.dir}: refusing to overwrite ${path.basename(existingFile)}.`);

  mkdirSync(dirPath, { recursive: true });
  writeFileSync(outputFiles[0], toolTs, { flag: "wx" });
  writeFileSync(outputFiles[1], indexTs, { flag: "wx" });
  writeFileSync(outputFiles[2], specTs, { flag: "wx" });
  console.log("created", r.dir);
};

const recipeFiles = process.argv.slice(2);
if (recipeFiles.length === 0) {
  process.stderr.write(
    "Usage: node scripts/create-tool-from-recipe.mjs <recipe.json> [<recipe2.json> ...]\n",
  );
  process.exit(2);
}

for (const file of recipeFiles) {
  const recipes = JSON.parse(readFileSync(file, "utf8"));
  if (Array.isArray(recipes) && recipes.length === 0)
    fail(`${file}: recipe array must not be empty.`);
  for (const r of Array.isArray(recipes) ? recipes : [recipes]) emit(r);
}
