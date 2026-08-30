import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type CubicBezierEasingNamePointsLookupInput = {
  readonly keyword: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";
};
export type CubicBezierEasingNamePointsLookupOutput = {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
};
export const cubicBezierEasingNamePointsLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "keyword": {
      "type": "string",
      "enum": [
        "linear",
        "ease",
        "ease-in",
        "ease-out",
        "ease-in-out"
      ],
      "description": "Easing keyword"
    }
  },
  "required": [
    "keyword"
  ]
} as const satisfies ToolJsonSchema;
export const cubicBezierEasingNamePointsLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "x1": {
      "type": "number",
      "description": "First control point x"
    },
    "y1": {
      "type": "number",
      "description": "First control point y"
    },
    "x2": {
      "type": "number",
      "description": "Second control point x"
    },
    "y2": {
      "type": "number",
      "description": "Second control point y"
    }
  },
  "required": [
    "x1",
    "y1",
    "x2",
    "y2"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-easing-2/
export const calculateCubicBezierEasingNamePointsLookup = (rawInput: unknown): ToolResult<CubicBezierEasingNamePointsLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly keyword?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "keyword"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const keywordValue = candidate.keyword;
  if (typeof keywordValue !== "string") return issue("keyword", "invalid_type", "Enter a string value.");
  if (keywordValue !== "linear" && keywordValue !== "ease" && keywordValue !== "ease-in" && keywordValue !== "ease-out" && keywordValue !== "ease-in-out") return issue("keyword", "invalid_value", "Choose a supported value.");

  const input: CubicBezierEasingNamePointsLookupInput = { keyword: keywordValue };
  const points = { linear: [0, 0, 1, 1], ease: [0.25, 0.1, 0.25, 1], "ease-in": [0.42, 0, 1, 1], "ease-out": [0, 0, 0.58, 1], "ease-in-out": [0.42, 0, 0.58, 1] } as const;
  const [x1, y1, x2, y2] = points[input.keyword];
  return toolSuccess({ x1, y1, x2, y2 });
};
export const example = {
  input: {
    "keyword": "ease"
  },
  output: {
    "x1": 0.25,
    "y1": 0.1,
    "x2": 0.25,
    "y2": 1
  },
} satisfies ToolExample<CubicBezierEasingNamePointsLookupInput, CubicBezierEasingNamePointsLookupOutput>;
export const cubicBezierEasingNamePointsLookupTool = defineTool<CubicBezierEasingNamePointsLookupInput, CubicBezierEasingNamePointsLookupOutput>({
  id: "css/cubic-bezier-easing-name-points-lookup",
  title: "Cubic-Bezier Easing Name Control Points Lookup",
  description: "Return the two cubic Bezier control points specified for a CSS easing keyword.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: cubicBezierEasingNamePointsLookupInputSchema,
  outputSchema: cubicBezierEasingNamePointsLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "keyword",
        "label": "Easing keyword",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "x1",
        "label": "First control point x",
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "y1",
        "label": "First control point y",
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "x2",
        "label": "Second control point x",
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "y2",
        "label": "Second control point y",
        "valueType": {
          "type": "number"
        }
      }
    ]
  },
  execute: calculateCubicBezierEasingNamePointsLookup,
});
export const runCubicBezierEasingNamePointsLookup = cubicBezierEasingNamePointsLookupTool.execute;
export default cubicBezierEasingNamePointsLookupTool;
