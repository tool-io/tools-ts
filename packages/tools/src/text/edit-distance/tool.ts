import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type EditDistanceInput = {
  readonly a: string;
  readonly b: string;
};

export type EditDistanceOutput = {
  readonly distance: number;
};

export const editDistanceInputSchema = {
  additionalProperties: false,
  properties: {
    a: {
      description: "First string, compared by Unicode code points.",
      maxLength: 2048,
      type: "string",
    },
    b: {
      description: "Second string, compared by Unicode code points.",
      maxLength: 2048,
      type: "string",
    },
  },
  required: ["a", "b"],
  type: "object",
} as const;

export const editDistanceOutputSchema = {
  additionalProperties: false,
  properties: {
    distance: {
      description: "Minimum single-element insertions, deletions, and substitutions.",
      minimum: 0,
      type: "integer",
    },
  },
  required: ["distance"],
  type: "object",
} as const;

export const editDistanceExample = {
  input: { a: "kitten", b: "sitting" },
  output: { distance: 3 },
} satisfies ToolExample<EditDistanceInput, EditDistanceOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const MAX_LENGTH = 2048;

export const isEditDistanceOutput = (
  value: unknown,
): value is EditDistanceOutput =>
  isRecord(value) && Number.isSafeInteger(value.distance);

const stringIssues = (field: string, value: unknown): ToolIssue | undefined =>
  typeof value !== "string" || Array.from(value).length > MAX_LENGTH
    ? {
        code: `${field}_invalid`,
        field,
        message: `${field} must be a string of at most ${MAX_LENGTH} characters.`,
      }
    : undefined;

export const calculateEditDistance = (
  input: unknown,
): ToolResult<EditDistanceOutput> => {
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
    if (field !== "a" && field !== "b")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  for (const field of ["a", "b"] as const) {
    if (input[field] === undefined)
      issues.push({
        code: `${field}_required`,
        field,
        message: `${field} is required.`,
      });
    else {
      const issue = stringIssues(field, input[field]);
      if (issue) issues.push(issue);
    }
  }
  if (issues.length > 0) return invalidInput(issues);

  const left = Array.from(input.a as string);
  const right = Array.from(input.b as string);

  let previous = Array.from({ length: right.length + 1 }, (_, j) => j);
  for (let i = 1; i <= left.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= right.length; j += 1)
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1),
      );
    previous = current;
  }

  return toolSuccess({ distance: previous[right.length] });
};

export const editDistanceTool = defineTool<EditDistanceInput, EditDistanceOutput>({
  contractVersion: 1,
  description:
    "Compute the Levenshtein edit distance between two strings by Unicode code points.",
  discovery: {
    aliases: ["levenshtein-distance", "string-diff", "typo-distance"],
    keywords: ["distance", "fuzzy", "levenshtein", "similarity", "text"],
  },
  execute: calculateEditDistance,
  execution: { kind: "pure" },
  id: "text/edit-distance",
  inputSchema: editDistanceInputSchema,
  outputSchema: editDistanceOutputSchema,
  ports: {
    inputs: [
      {
        description: "First string.",
        id: "a",
        label: "String A",
        valueType: { type: "string" },
      },
      {
        description: "Second string.",
        id: "b",
        label: "String B",
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        description: "Minimum edits to transform A into B.",
        id: "distance",
        label: "Edit distance",
        valueType: { format: "count", type: "integer" },
      },
    ],
  },
  title: "Edit Distance",
});

export const runEditDistance = editDistanceTool.execute;
export default editDistanceTool;
