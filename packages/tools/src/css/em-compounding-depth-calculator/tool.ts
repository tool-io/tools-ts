import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type EmCompoundingDepthCalculatorInput = {
  readonly rootSize: number;
  readonly multipliers: ReadonlyArray<number>;
};
export type EmCompoundingDepthCalculatorOutput = {
  readonly fontSize: number;
  readonly depth: number;
};
export const emCompoundingDepthCalculatorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "rootSize": {
      "type": "number",
      "minimum": 0,
      "description": "Root font size"
    },
    "multipliers": {
      "type": "array",
      "items": {
        "type": "number",
        "minimum": 0
      },
      "minItems": 0,
      "maxItems": 1000,
      "description": "Nested em multipliers"
    }
  },
  "required": [
    "rootSize",
    "multipliers"
  ]
} as const satisfies ToolJsonSchema;
export const emCompoundingDepthCalculatorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "fontSize": {
      "type": "number",
      "minimum": 0,
      "description": "Final font size"
    },
    "depth": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Nesting depth"
    }
  },
  "required": [
    "fontSize",
    "depth"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-values-3/#font-relative-lengths
export const calculateEmCompoundingDepthCalculator = (rawInput: unknown): ToolResult<EmCompoundingDepthCalculatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly rootSize?: unknown; readonly multipliers?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "rootSize",
  "multipliers"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const rootSizeValue = candidate.rootSize;
  if (typeof rootSizeValue !== "number" || !Number.isFinite(rootSizeValue)) return issue("rootSize", "invalid_type", "Enter a finite number.");
  if (rootSizeValue < 0) return issue("rootSize", "out_of_range", "Value is outside the accepted range.");
  const multipliersValue = candidate.multipliers;
  if (!Array.isArray(multipliersValue)) return issue("multipliers", "invalid_type", "Enter a dense array.");
  if (multipliersValue.length < 0) return issue("multipliers", "out_of_range", "Too few entries.");
  if (multipliersValue.length > 1000) return issue("multipliers", "resource_limit", "Array exceeds the 1000-entry resource limit.");
  const validatedMultipliers: number[] = [];
  for (let index = 0; index < multipliersValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(multipliersValue, index)) return issue(`multipliers.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = multipliersValue[index];
    if (typeof item !== "number" || !Number.isFinite(item)) return issue(`multipliers.${index}`, "invalid_type", "Enter a finite number.");
    if (item < 0) return issue(`multipliers.${index}`, "out_of_range", "Value is outside the accepted range.");
    validatedMultipliers.push(item);
  }

  const input: EmCompoundingDepthCalculatorInput = { rootSize: rootSizeValue, multipliers: validatedMultipliers };
  if (input.rootSize === 0 || input.multipliers.includes(0)) return toolSuccess({ fontSize: 0, depth: input.multipliers.length });
  let fontSize = input.rootSize;
  let logSize = Math.log(input.rootSize);
  let lostRange = false;
  for (const multiplier of input.multipliers) {
    fontSize *= multiplier;
    logSize += Math.log(multiplier);
    if (!Number.isFinite(fontSize) || fontSize === 0) lostRange = true;
  }
  if (lostRange) fontSize = Math.exp(logSize);
  if (!Number.isFinite(fontSize)) return issue("multipliers", "numeric_overflow", "The final font size exceeds finite number range.");
  return toolSuccess({ fontSize, depth: input.multipliers.length });
};
export const example = {
  input: {
    "rootSize": 16,
    "multipliers": [
      1.5,
      1.5
    ]
  },
  output: {
    "fontSize": 36,
    "depth": 2
  },
} satisfies ToolExample<EmCompoundingDepthCalculatorInput, EmCompoundingDepthCalculatorOutput>;
export const emCompoundingDepthCalculatorTool = defineTool<EmCompoundingDepthCalculatorInput, EmCompoundingDepthCalculatorOutput>({
  id: "css/em-compounding-depth-calculator",
  title: "em Font-Size Compounding Depth Calculator",
  description: "Calculate a nested font size from a root size and successive nonnegative em font-size multipliers.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: emCompoundingDepthCalculatorInputSchema,
  outputSchema: emCompoundingDepthCalculatorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "rootSize",
        "label": "Root font size",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "multipliers",
        "label": "Nested em multipliers",
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
        "id": "fontSize",
        "label": "Final font size",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "depth",
        "label": "Nesting depth",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateEmCompoundingDepthCalculator,
});
export const runEmCompoundingDepthCalculator = emCompoundingDepthCalculatorTool.execute;
export default emCompoundingDepthCalculatorTool;
