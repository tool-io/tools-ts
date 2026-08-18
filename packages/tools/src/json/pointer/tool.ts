import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type JsonPointerInput = {
  readonly document: unknown;
  readonly pointer: string;
};

export type JsonPointerOutput = {
  readonly found: boolean;
  readonly valueJson: string | null;
};

export const jsonPointerInputSchema = {
  additionalProperties: false,
  description: "Any JSON document to resolve against.",
  type: "object",
} as const;

export const jsonPointerOutputSchema = {
  additionalProperties: false,
  properties: {
    found: { description: "Whether the pointer resolved.", type: "boolean" },
    valueJson: {
      anyOf: [{ type: "null" }, { type: "string" }],
      description:
        "JSON-encoded resolved value, or null when the pointer did not resolve.",
    },
  },
  required: ["found", "valueJson"],
  type: "object",
} as const;

export const jsonPointerExample = {
  input: { document: { a: [10, { b: "x" }] }, pointer: "/a/1/b" },
  output: { found: true, valueJson: '"x"' },
} satisfies ToolExample<JsonPointerInput, JsonPointerOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const unescapeToken = (token: string): string =>
  token.replaceAll("~1", "/").replaceAll("~0", "~");

export const isJsonPointerOutput = (
  value: unknown,
): value is JsonPointerOutput =>
  isRecord(value) && typeof value.found === "boolean";

export const calculateJsonPointer = (
  input: unknown,
): ToolResult<JsonPointerOutput> => {
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
    if (field !== "document" && field !== "pointer")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const pointer = input.pointer;
  if (typeof pointer !== "string")
    return invalidInput([
      ...issues,
      {
        code: "pointer_required",
        field: "pointer",
        message: "pointer must be a string.",
      },
    ]);
  if (pointer.length > 0 && !pointer.startsWith("/"))
    return invalidInput([
      ...issues,
      {
        code: "pointer_invalid",
        field: "pointer",
        message:
          'pointer must be empty or start with "/" per RFC 6901.',
      },
    ]);
  if (issues.length > 0) return invalidInput(issues);

  let node: unknown = input.document;
  if (pointer.length > 0) {
    for (const rawToken of pointer.slice(1).split("/")) {
      const token = unescapeToken(rawToken);
      if (Array.isArray(node)) {
        if (!/^\d+$/.test(token) || Number(token) >= node.length) {
          return toolSuccess({ found: false, valueJson: null });
        }
        node = node[Number(token)];
      } else if (isRecord(node)) {
        if (!(token in node)) return toolSuccess({ found: false, valueJson: null });
        node = node[token];
      } else return toolSuccess({ found: false, valueJson: null });
    }
  }
  return toolSuccess({
    found: true,
    valueJson: JSON.stringify(node ?? null),
  });
};

export const jsonPointerTool = defineTool<
  JsonPointerInput,
  JsonPointerOutput
>({
  contractVersion: 1,
  description:
    "Resolve an RFC 6901 JSON Pointer against a document and report the located value.",
  discovery: {
    aliases: ["json-pointer-resolver", "rfc6901"],
    keywords: ["json", "lookup", "pointer", "rfc6901"],
  },
  execute: calculateJsonPointer,
  execution: { kind: "pure" },
  id: "json/pointer",
  inputSchema: jsonPointerInputSchema,
  outputSchema: jsonPointerOutputSchema,
  ports: {
    inputs: [
      {
        description: "Document to resolve against.",
        id: "probe",
        label: "Document probe",
        path: [],
        required: true,
        valueType: { format: "document/json", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Whether the pointer resolved.",
        id: "found",
        label: "Found",
        valueType: { type: "boolean" },
      },
      {
        description: "JSON-encoded resolved value or null.",
        id: "valueJson",
        label: "Value JSON",
        valueType: { format: "document/json", type: "string" },
      },
    ],
  },
  title: "JSON Pointer Resolver",
});

export const runJsonPointer = jsonPointerTool.execute;
export default jsonPointerTool;
