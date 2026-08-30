import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type HeadingLevelOrderSequenceCheckerInput = {
  readonly levels: ReadonlyArray<number>;
};
export type HeadingLevelOrderSequenceCheckerOutput = {
  readonly skippedAt: ReadonlyArray<number>;
  readonly hasUpwardSkips: boolean;
};
export const headingLevelOrderSequenceCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "levels": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 1,
        "maximum": 6
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Levels"
    }
  },
  "required": [
    "levels"
  ]
} as const satisfies ToolJsonSchema;
export const headingLevelOrderSequenceCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "skippedAt": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0,
        "maximum": 9007199254740991
      },
      "description": "Skipped At"
    },
    "hasUpwardSkips": {
      "type": "boolean",
      "description": "Has Upward Skips"
    }
  },
  "required": [
    "skippedAt",
    "hasUpwardSkips"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/WAI/tutorials/page-structure/headings/
export const calculateHeadingLevelOrderSequenceChecker = (rawInput: unknown): ToolResult<HeadingLevelOrderSequenceCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly levels?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "levels"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const levelsValue = candidate.levels;
if (!Array.isArray(levelsValue)) return issue("levels", "invalid_type", "Enter a dense array.");
if (levelsValue.length < 0) return issue("levels", "out_of_range", "Too few entries.");
if (levelsValue.length > 10000) return issue("levels", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedLevels: number[] = [];
for (let index = 0; index < levelsValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(levelsValue, index)) return issue(`levels.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = levelsValue[index];
if (typeof item !== "number" || !Number.isSafeInteger(item)) return issue(`levels.${index}`, "invalid_type", "Enter a finite safe integer.");
if (item < 1) return issue(`levels.${index}`, "out_of_range", "Value is outside the accepted range.");
if (item > 6) return issue(`levels.${index}`, "out_of_range", "Value is outside the accepted range.");
validatedLevels.push(item);
}
  const input: HeadingLevelOrderSequenceCheckerInput = { levels: validatedLevels };
 const skippedAt: number[] = [];
 for (let index = 1; index < input.levels.length; index++) {
   const previous = input.levels[index - 1], current = input.levels[index];
   if (previous !== undefined && current !== undefined && current > previous + 1) skippedAt.push(index);
 }
 return toolSuccess({ skippedAt, hasUpwardSkips: skippedAt.length > 0 });
};
export const example = {
  "input": {
    "levels": [
      1,
      2,
      4,
      2,
      3
    ]
  },
  "output": {
    "skippedAt": [
      2
    ],
    "hasUpwardSkips": true
  }
} satisfies ToolExample<HeadingLevelOrderSequenceCheckerInput, HeadingLevelOrderSequenceCheckerOutput>;
export const headingLevelOrderSequenceCheckerTool = defineTool<HeadingLevelOrderSequenceCheckerInput, HeadingLevelOrderSequenceCheckerOutput>({
  id: "html/heading-level-order-sequence-checker",
  title: "Heading Level h1\u2013h6 Order Sequence Check",
  description: "Finds adjacent upward jumps greater than one in supplied heading levels. Returns zero-based positions; this outline heuristic does not establish a WCAG failure.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: headingLevelOrderSequenceCheckerInputSchema,
  outputSchema: headingLevelOrderSequenceCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "levels",
        "label": "Levels",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "skippedAt",
        "label": "Skipped At",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      },
      {
        "id": "hasUpwardSkips",
        "label": "Has Upward Skips",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateHeadingLevelOrderSequenceChecker,
});
export const runHeadingLevelOrderSequenceChecker = headingLevelOrderSequenceCheckerTool.execute;
export default headingLevelOrderSequenceCheckerTool;
