import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type JsonFlattenInput = {
  readonly document: Record<string, unknown>;
};

export type JsonFlattenOutput = {
  readonly flat: Record<string, boolean | number | string | null>;
};

export const jsonFlattenInputSchema = {
  additionalProperties: false,
  properties: {
    document: {
      additionalProperties: true,
      description:
        "JSON object with nested objects, arrays, and primitive leaves.",
      type: "object",
    },
  },
  required: ["document"],
  type: "object",
} as const;

export const jsonFlattenOutputSchema = {
  additionalProperties: false,
  properties: {
    flat: {
      additionalProperties: {
        anyOf: [
          { type: "boolean" },
          { type: "integer" },
          { type: "null" },
          { type: "number" },
          { type: "string" },
        ],
        description: "Leaf value addressed by its dot path.",
      },
      description: "Flattened leaves keyed by dot paths such as a.0.b.",
      type: "object",
    },
  },
  required: ["flat"],
  type: "object",
} as const;

export const jsonFlattenExample = {
  input: { document: { a: { b: [1, { c: true }] }, d: null } },
  output: {
    flat: { "a.b.0": 1, "a.b.1.c": true, d: null },
  },
} satisfies ToolExample<JsonFlattenInput, JsonFlattenOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const LEAF_TYPES = new Set(["boolean", "number", "string"]);

const isLeaf = (value: unknown): boolean =>
  value === null ||
  typeof value === "string" ||
  typeof value === "boolean" ||
  (typeof value === "number" && Number.isFinite(value));

export const isJsonFlattenOutput = (
  value: unknown,
): value is JsonFlattenOutput => isRecord(value) && isRecord(value.flat);

export const calculateJsonFlatten = (
  input: unknown,
): ToolResult<JsonFlattenOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object with a document property.",
      },
    ]);

  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (field !== "document")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const document = input.document;
  if (document === undefined)
    return invalidInput([
      ...issues,
      {
        code: "document_required",
        field: "document",
        message: "document is required.",
      },
    ]);
  if (!isRecord(document))
    return invalidInput([
      ...issues,
      {
        code: "document_invalid",
        field: "document",
        message: "document must be a JSON object.",
      },
    ]);
  const limitIssue = resourceLimitIssue(
    "generatedValues",
    Object.keys(document).length,
    "document",
  );
  if (limitIssue) return invalidInput([...issues, limitIssue]);
  if (issues.length > 0) return invalidInput(issues);

  const flat: Record<string, boolean | number | string | null> = {};
  const walk = (node: unknown, path: string): void => {
    if (isLeaf(node)) {
      flat[path] = node as boolean | number | string | null;
      return;
    }
    if (Array.isArray(node)) {
      if (node.length === 0) {
        flat[path] = "";
        return;
      }
      node.forEach((entry, index) =>
        walk(entry, path === "" ? String(index) : `${path}.${index}`),
      );
      return;
    }
    if (isRecord(node)) {
      const keys = Object.keys(node);
      if (keys.length === 0) {
        flat[path] = "";
        return;
      }
      for (const key of keys)
        walk(node[key], path === "" ? key : `${path}.${key}`);
    }
  };
  walk(document, "");
  return toolSuccess({ flat });
};

export const jsonFlattenTool = defineTool<JsonFlattenInput, JsonFlattenOutput>({
  contractVersion: 1,
  description:
    "Flatten a JSON object into single-level dot-path keys pointing at primitive leaves.",
  discovery: {
    aliases: ["flatten-json"],
    keywords: ["flatten", "json", "paths"],
  },
  execute: calculateJsonFlatten,
  execution: { kind: "pure" },
  id: "json/flatten",
  inputSchema: jsonFlattenInputSchema,
  outputSchema: jsonFlattenOutputSchema,
  ports: {
    inputs: [
      {
        description: "Nested JSON object.",
        id: "document",
        label: "Document",
        required: true,
        valueType: { format: "document/json-object", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Dot-path keyed leaf values.",
        id: "flat",
        label: "Flat map",
        valueType: { format: "json/flat-map", type: "object" },
      },
    ],
  },
  title: "JSON Flatten",
});

export const runJsonFlatten = jsonFlattenTool.execute;
export default jsonFlattenTool;
