import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type JsonPrettyPrintInput = {
  readonly indent?: number;
  readonly json: string;
};

export type JsonPrettyPrintOutput = {
  readonly pretty: string;
};

export const jsonPrettyPrintInputSchema = {
  additionalProperties: false,
  properties: {
    indent: {
      description: "Spaces per indentation level.",
      maximum: 8,
      minimum: 1,
      type: "integer",
    },
    json: {
      description: "JSON text to pretty-print.",
      maxLength: 1000000,
      minLength: 1,
      type: "string",
    },
  },
  required: ["json"],
  type: "object",
} as const;

export const jsonPrettyPrintOutputSchema = {
  additionalProperties: false,
  properties: {
    pretty: {
      description: "Formatted JSON ending with a newline.",
      minLength: 0,
      type: "string",
    },
  },
  required: ["pretty"],
  type: "object",
} as const;

export const jsonPrettyPrintExample = {
  input: { json: '{"a":1,"b":[true,null]}' },
  output: { pretty: '{\n  "a": 1,\n  "b": [\n    true,\n    null\n  ]\n}\n' },
} satisfies ToolExample<JsonPrettyPrintInput, JsonPrettyPrintOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isJsonPrettyPrintOutput = (
  value: unknown,
): value is JsonPrettyPrintOutput =>
  isRecord(value) && typeof value.pretty === "string";

export const calculateJsonPrettyPrint = (
  input: unknown,
): ToolResult<JsonPrettyPrintOutput> => {
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
    if (field !== "indent" && field !== "json")
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

  const indent =
    input.indent === undefined ? 2 : Number(input.indent);
  if (!Number.isSafeInteger(indent) || indent < 1 || indent > 8)
    return invalidInput([
      ...issues,
      {
        code: "indent_invalid",
        field: "indent",
        message: "indent must be an integer between 1 and 8.",
      },
    ]);
  if (issues.length > 0) return invalidInput(issues);

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return invalidInput([
      {
        code: "json_invalid",
        field: "json",
        message: "json must contain valid JSON.",
      },
    ]);
  }
  return toolSuccess({ pretty: `${JSON.stringify(parsed, null, indent)}\n` });
};

export const jsonPrettyPrintTool = defineTool<
  JsonPrettyPrintInput,
  JsonPrettyPrintOutput
>({
  contractVersion: 1,
  description:
    "Format JSON text with consistent indentation and a trailing newline.",
  discovery: {
    aliases: ["beautify-json", "format-json"],
    keywords: ["format", "indent", "json", "pretty"],
  },
  execute: calculateJsonPrettyPrint,
  execution: { kind: "pure" },
  id: "json/pretty-print",
  inputSchema: jsonPrettyPrintInputSchema,
  outputSchema: jsonPrettyPrintOutputSchema,
  ports: {
    inputs: [
      {
        description: "JSON text to format.",
        id: "json",
        label: "JSON",
        required: true,
        valueType: { format: "document/json", type: "string" },
      },
      {
        description: "Spaces per indentation level.",
        id: "indent",
        label: "Indent",
        valueType: { format: "count", type: "integer" },
      },
    ],
    outputs: [
      {
        description: "Formatted JSON.",
        id: "pretty",
        label: "Pretty",
        valueType: { format: "document/json", type: "string" },
      },
    ],
  },
  title: "JSON Pretty Printer",
});

export const runJsonPrettyPrint = jsonPrettyPrintTool.execute;
export default jsonPrettyPrintTool;
