import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type PerspectiveZScaleFactorInput = {
  readonly perspective: number;
  readonly z: number;
};
export type PerspectiveZScaleFactorOutput = {
  readonly scale: number;
  readonly usedPerspective: number;
};
export const perspectiveZScaleFactorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "perspective": {
      "type": "number",
      "minimum": 0,
      "description": "Perspective distance"
    },
    "z": {
      "type": "number",
      "description": "Z"
    }
  },
  "required": [
    "perspective",
    "z"
  ]
} as const satisfies ToolJsonSchema;
export const perspectiveZScaleFactorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "scale": {
      "type": "number",
      "minimum": 0,
      "description": "Scale"
    },
    "usedPerspective": {
      "type": "number",
      "minimum": 1,
      "description": "Used perspective"
    }
  },
  "required": [
    "scale",
    "usedPerspective"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-transforms-2/#perspective-property
export const calculatePerspectiveZScaleFactor = (rawInput: unknown): ToolResult<PerspectiveZScaleFactorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly perspective?: unknown; readonly z?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "perspective",
  "z"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const perspectiveValue = candidate.perspective;
  if (typeof perspectiveValue !== "number" || !Number.isFinite(perspectiveValue)) return issue("perspective", "invalid_type", "Enter a finite number.");
  if (perspectiveValue < 0) return issue("perspective", "out_of_range", "Perspective must be nonnegative.");
  const zValue = candidate.z;
  if (typeof zValue !== "number" || !Number.isFinite(zValue)) return issue("z", "invalid_type", "Enter a finite number.");
  const input: PerspectiveZScaleFactorInput = { perspective: perspectiveValue, z: zValue };
  const usedPerspective = Math.max(1, input.perspective);
  if (input.z >= usedPerspective) return issue("z", "viewer_plane", "Point lies on or behind the viewer plane.");
  const denominator = usedPerspective - input.z;
  const scale = Number.isFinite(denominator) ? usedPerspective / denominator : 1 / (1 - input.z / usedPerspective);
  if (!Number.isFinite(scale) || scale <= 0) return issue("z", "numeric_range", "Perspective scale is outside representable number range.");
  return toolSuccess({ scale, usedPerspective });
};
export const example = {
  input: {
    "perspective": 500,
    "z": 250
  },
  output: {
    "scale": 2,
    "usedPerspective": 500
  },
} satisfies ToolExample<PerspectiveZScaleFactorInput, PerspectiveZScaleFactorOutput>;
export const perspectiveZScaleFactorTool = defineTool<PerspectiveZScaleFactorInput, PerspectiveZScaleFactorOutput>({
  id: "css/perspective-z-scale-factor",
  title: "Perspective z Scale Factor",
  description: "Compute CSS perspective scale at depth z using the used perspective distance clamped to at least 1px, rejecting points on or behind the viewer plane; distances use the same pixel units.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: perspectiveZScaleFactorInputSchema,
  outputSchema: perspectiveZScaleFactorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "perspective",
        "label": "Perspective distance",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "z",
        "label": "Z",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ],
    "outputs": [
      {
        "id": "scale",
        "label": "Scale",
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "usedPerspective",
        "label": "Used perspective",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ]
  },
  execute: calculatePerspectiveZScaleFactor,
});
export const runPerspectiveZScaleFactor = perspectiveZScaleFactorTool.execute;
export default perspectiveZScaleFactorTool;
