import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type JsonUnflattenInput = {
  readonly flat: Record<string, boolean | number | string | null>;
};

export type JsonUnflattenOutput = {
  readonly document: Record<string, unknown>;
};

export const jsonUnflattenInputSchema = {
  additionalProperties: {
    anyOf: [
      { type: "boolean" },
      { type: "null" },
      { type: "number" },
      { type: "string" },
    ],
    description: "Leaf value at the dot path.",
  },
  description: "Flat map of dot paths to primitive leaves.",
  properties: {},
  required: [],
  type: "object",
} as const;

export const jsonUnflattenOutputSchema = {
  additionalProperties: true,
  description: "Rebuilt nested JSON object.",
  type: "object",
} as const;

export const jsonUnflattenExample = {
  input: { flat: { "a.b.0": 1, "a.b.1.c": true, d: null } },
  output: { document: { a: { b: [1, { c: true }] }, d: null } },
} satisfies ToolExample<JsonUnflattenInput, JsonUnflattenOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const LEAF_TYPES = new Set(["boolean", "number", "string"]);

export const isJsonUnflattenOutput = (
  value: unknown,
): value is JsonUnflattenOutput => isRecord(value) && isRecord(value.document);

export const calculateJsonUnflatten = (
  input: unknown,
): ToolResult<JsonUnflattenOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object with a flat property.",
      },
    ]);

  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (field !== "flat")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const flat = input.flat;
  if (flat === undefined || !isRecord(flat))
    return invalidInput([
      ...issues,
      {
        code: "flat_required",
        field: "flat",
        message: "flat is required as an object.",
      },
    ]);
  const entries = Object.entries(flat);
  const limitIssue = resourceLimitIssue(
    "generatedValues",
    entries.length,
    "flat",
  );
  if (limitIssue) return invalidInput([...issues, limitIssue]);
  for (const [key, value] of entries)
    if (value !== null && !LEAF_TYPES.has(typeof value))
      return invalidInput([
        ...issues,
        {
          code: "leaf_invalid",
          field: `flat.${key}`,
          message: `flat.${key} must be a boolean, number, string, or null.`,
        },
      ]);
  if (issues.length > 0) return invalidInput(issues);

  const document: Record<string, unknown> = {};
  for (const [path, leaf] of entries) {
    const segments = path.split(".");
    let node: Record<string, unknown> | unknown[] = document;
    for (let index = 0; index < segments.length - 1; index += 1) {
      const segment = segments[index];
      const nextIsArray = /^\d+$/.test(segments[index + 1]);
      const existing = (node as Record<string, unknown>)[segment];
      if (existing === undefined)
        (node as Record<string, unknown>)[segment] = nextIsArray ? [] : {};
      else if (!isRecord(existing) && !Array.isArray(existing))
        return invalidInput([
          {
            code: "path_conflict",
            field: `flat.${path}`,
            message: `Path segment "${segment}" conflicts with an existing leaf.`,
          },
        ]);
      node = (node as Record<string, unknown>)[segment] as
        | Record<string, unknown>
        | unknown[];
    }
    const last = segments[segments.length - 1];
    if (/^\d+$/.test(last)) {
      const array = node as unknown[];
      array[Number(last)] = leaf;
    } else (node as Record<string, unknown>)[last] = leaf;
  }
  return toolSuccess({ document });
};

export const jsonUnflattenTool = defineTool<
  JsonUnflattenInput,
  JsonUnflattenOutput
>({
  contractVersion: 1,
  description:
    "Rebuild a nested JSON object from dot-path keys, expanding numeric segments into arrays.",
  discovery: {
    aliases: ["expand-json", "unflatten-json"],
    keywords: ["expand", "json", "paths", "unflatten"],
  },
  execute: calculateJsonUnflatten,
  execution: { kind: "pure" },
  id: "json/unflatten",
  inputSchema: jsonUnflattenInputSchema,
  outputSchema: jsonUnflattenOutputSchema,
  ports: {
    inputs: [
      {
        description: "Dot-path keyed leaves.",
        id: "probe",
        label: "Flat map",
        path: [],
        required: true,
        valueType: { format: "json/flat-map", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Rebuilt nested document.",
        id: "document",
        label: "Document",
        path: [],
        valueType: { format: "document/json-object", type: "object" },
      },
    ],
  },
  title: "JSON Unflatten",
});

export const runJsonUnflatten = jsonUnflattenTool.execute;
export default jsonUnflattenTool;
