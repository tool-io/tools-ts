import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ConicGradientDegreeSegmentsPieInput = {
  readonly weights: ReadonlyArray<number>;
};
export type ConicGradientDegreeSegmentsPieOutput = {
  readonly startDegrees: ReadonlyArray<number>;
  readonly endDegrees: ReadonlyArray<number>;
  readonly fractions: ReadonlyArray<number>;
};
export const conicGradientDegreeSegmentsPieInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "weights": {
      "type": "array",
      "items": {
        "type": "number",
        "minimum": 0
      },
      "minItems": 1,
      "maxItems": 1000,
      "description": "Pie segment weights"
    }
  },
  "required": [
    "weights"
  ]
} as const satisfies ToolJsonSchema;
export const conicGradientDegreeSegmentsPieOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "startDegrees": {
      "type": "array",
      "items": {
        "type": "number",
        "minimum": 0
      },
      "description": "Segment start angles"
    },
    "endDegrees": {
      "type": "array",
      "items": {
        "type": "number",
        "minimum": 0
      },
      "description": "Segment end angles"
    },
    "fractions": {
      "type": "array",
      "items": {
        "type": "number",
        "minimum": 0
      },
      "description": "Normalized segment fractions"
    }
  },
  "required": [
    "startDegrees",
    "endDegrees",
    "fractions"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-images-4/#conic-gradients
export const calculateConicGradientDegreeSegmentsPie = (rawInput: unknown): ToolResult<ConicGradientDegreeSegmentsPieOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly weights?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "weights"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const weightsValue = candidate.weights;
  if (!Array.isArray(weightsValue)) return issue("weights", "invalid_type", "Enter a dense array.");
  if (weightsValue.length < 1) return issue("weights", "out_of_range", "Too few entries.");
  if (weightsValue.length > 1000) return issue("weights", "resource_limit", "Array exceeds the 1000-entry resource limit.");
  const validatedWeights: number[] = [];
  for (let index = 0; index < weightsValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(weightsValue, index)) return issue(`weights.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = weightsValue[index];
    if (typeof item !== "number" || !Number.isFinite(item)) return issue(`weights.${index}`, "invalid_type", "Enter a finite number.");
    if (item < 0) return issue(`weights.${index}`, "out_of_range", "Value is outside the accepted range.");
    validatedWeights.push(item);
  }

  const input: ConicGradientDegreeSegmentsPieInput = { weights: validatedWeights };
  const maximum = Math.max(...input.weights);
  if (maximum === 0) return issue("weights", "zero_total", "At least one segment must have positive weight.");
  const scaled = input.weights.map((weight) => weight / maximum);
  const total = scaled.reduce((sum, weight) => sum + weight, 0);
  const fractions = scaled.map((weight) => weight / total);
  const startDegrees: number[] = [], endDegrees: number[] = [];
  let cumulative = 0;
  for (let index = 0; index < scaled.length; index++) {
    startDegrees.push(360 * (cumulative / total));
    cumulative += scaled[index] ?? 0;
    endDegrees.push(index === scaled.length - 1 ? 360 : Math.min(360, 360 * (cumulative / total)));
  }
  return toolSuccess({ startDegrees, endDegrees, fractions });
};
export const example = {
  input: {
    "weights": [
      1,
      1,
      2
    ]
  },
  output: {
    "startDegrees": [
      0,
      90,
      180
    ],
    "endDegrees": [
      90,
      180,
      360
    ],
    "fractions": [
      0.25,
      0.25,
      0.5
    ]
  },
} satisfies ToolExample<ConicGradientDegreeSegmentsPieInput, ConicGradientDegreeSegmentsPieOutput>;
export const conicGradientDegreeSegmentsPieTool = defineTool<ConicGradientDegreeSegmentsPieInput, ConicGradientDegreeSegmentsPieOutput>({
  id: "css/conic-gradient-degree-segments-pie",
  title: "Conic-Gradient Degree Segments Pie Fractions",
  description: "Convert nonnegative pie weights into consecutive conic-gradient angle stops totaling one turn.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: conicGradientDegreeSegmentsPieInputSchema,
  outputSchema: conicGradientDegreeSegmentsPieOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "weights",
        "label": "Pie segment weights",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "number"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "startDegrees",
        "label": "Segment start angles",
        "valueType": {
          "type": "list",
          "items": {
            "type": "number",
            "unit": "deg"
          }
        }
      },
      {
        "id": "endDegrees",
        "label": "Segment end angles",
        "valueType": {
          "type": "list",
          "items": {
            "type": "number",
            "unit": "deg"
          }
        }
      },
      {
        "id": "fractions",
        "label": "Normalized segment fractions",
        "valueType": {
          "type": "list",
          "items": {
            "type": "number"
          }
        }
      }
    ]
  },
  execute: calculateConicGradientDegreeSegmentsPie,
});
export const runConicGradientDegreeSegmentsPie = conicGradientDegreeSegmentsPieTool.execute;
export default conicGradientDegreeSegmentsPieTool;
