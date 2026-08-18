import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type JsonMinifyInput = {
  readonly json: string;
};

export type JsonMinifyOutput = {
  readonly minified: string;
};

export const jsonMinifyInputSchema = {
  additionalProperties: false,
  properties: {
    json: {
      description: "JSON text to minify.",
      maxLength: 1000000,
      minLength: 1,
      type: "string",
    },
  },
  required: ["json"],
  type: "object",
} as const;

export const jsonMinifyOutputSchema = {
  additionalProperties: false,
  properties: {
    minified: {
      description: "Compact JSON with all insignificant whitespace removed.",
      minLength: 0,
      type: "string",
    },
  },
  required: ["minified"],
  type: "object",
} as const;

export const jsonMinifyExample = {
  input: { json: '{\n  "a": 1,\n  "b": [true, null]\n}' },
  output: { minified: '{"a":1,"b":[true,null]}' },
} satisfies ToolExample<JsonMinifyInput, JsonMinifyOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isJsonMinifyOutput = (
  value: unknown,
): value is JsonMinifyOutput =>
  isRecord(value) && typeof value.minified === "string";

const parseIssues = (field: string): ToolIssue => ({
  code: "json_invalid",
  field,
  message: `${field} must contain valid JSON.`,
});

export const calculateJsonMinify = (
  input: unknown,
): ToolResult<JsonMinifyOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (field !== "json")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const raw = input.json;
  if (raw === undefined || typeof raw !== "string" || raw.length < 1)
    return invalidInput([
      ...issues,
      {
        code: "json_required",
        field: "json",
        message: "json is required as a non-empty string.",
      },
    ]);
  if (issues.length > 0) return invalidInput(issues);

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return invalidInput([parseIssues("json")]);
  }
  return toolSuccess({ minified: JSON.stringify(parsed) });
};

export const jsonMinifyTool = defineTool<JsonMinifyInput, JsonMinifyOutput>({
  contractVersion: 1,
  description:
    "Remove all insignificant whitespace from valid JSON text while preserving values.",
  discovery: {
    aliases: ["compact-json", "minify-json"],
    keywords: ["compact", "format", "json", "minify"],
  },
  execute: calculateJsonMinify,
  execution: { kind: "pure" },
  id: "json/minify",
  inputSchema: jsonMinifyInputSchema,
  outputSchema: jsonMinifyOutputSchema,
  ports: {
    inputs: [
      {
        description: "JSON text to minify.",
        id: "json",
        label: "JSON",
        required: true,
        valueType: { format: "document/json", type: "string" },
      },
    ],
    outputs: [
      {
        description: "Compact JSON.",
        id: "minified",
        label: "Minified",
        valueType: { format: "document/json", type: "string" },
      },
    ],
  },
  title: "JSON Minifier",
});

export const runJsonMinify = jsonMinifyTool.execute;
export default jsonMinifyTool;
