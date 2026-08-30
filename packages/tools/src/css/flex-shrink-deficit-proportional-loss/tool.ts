import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type FlexShrinkDeficitProportionalLossInput = {
  readonly deficit: number;
  readonly baseSizes: ReadonlyArray<number>;
  readonly shrinkFactors: ReadonlyArray<number>;
};
export type FlexShrinkDeficitProportionalLossOutput = {
  readonly losses: ReadonlyArray<number>;
  readonly undistributedDeficit: number;
};
export const flexShrinkDeficitProportionalLossInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "deficit": {
      "type": "number",
      "minimum": 0,
      "description": "Space deficit"
    },
    "baseSizes": {
      "type": "array",
      "items": {
        "type": "number",
        "minimum": 0
      },
      "minItems": 1,
      "maxItems": 1000,
      "description": "Flex base sizes"
    },
    "shrinkFactors": {
      "type": "array",
      "items": {
        "type": "number",
        "minimum": 0
      },
      "minItems": 1,
      "maxItems": 1000,
      "description": "Flex shrink factors"
    }
  },
  "required": [
    "deficit",
    "baseSizes",
    "shrinkFactors"
  ]
} as const satisfies ToolJsonSchema;
export const flexShrinkDeficitProportionalLossOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "losses": {
      "type": "array",
      "items": {
        "type": "number",
        "minimum": 0
      },
      "description": "Initial proportional losses"
    },
    "undistributedDeficit": {
      "type": "number",
      "minimum": 0,
      "description": "Undistributed deficit"
    }
  },
  "required": [
    "losses",
    "undistributedDeficit"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-flexbox-1/#resolve-flexible-lengths
export const calculateFlexShrinkDeficitProportionalLoss = (rawInput: unknown): ToolResult<FlexShrinkDeficitProportionalLossOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly deficit?: unknown; readonly baseSizes?: unknown; readonly shrinkFactors?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "deficit",
  "baseSizes",
  "shrinkFactors"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const deficitValue = candidate.deficit;
  if (typeof deficitValue !== "number" || !Number.isFinite(deficitValue)) return issue("deficit", "invalid_type", "Enter a finite number.");
  if (deficitValue < 0) return issue("deficit", "out_of_range", "Value is outside the accepted range.");
  const baseSizesValue = candidate.baseSizes;
  if (!Array.isArray(baseSizesValue)) return issue("baseSizes", "invalid_type", "Enter a dense array.");
  if (baseSizesValue.length < 1) return issue("baseSizes", "out_of_range", "Too few entries.");
  if (baseSizesValue.length > 1000) return issue("baseSizes", "resource_limit", "Array exceeds the 1000-entry resource limit.");
  const validatedBasesizes: number[] = [];
  for (let index = 0; index < baseSizesValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(baseSizesValue, index)) return issue(`baseSizes.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = baseSizesValue[index];
    if (typeof item !== "number" || !Number.isFinite(item)) return issue(`baseSizes.${index}`, "invalid_type", "Enter a finite number.");
    if (item < 0) return issue(`baseSizes.${index}`, "out_of_range", "Value is outside the accepted range.");
    validatedBasesizes.push(item);
  }
  const shrinkFactorsValue = candidate.shrinkFactors;
  if (!Array.isArray(shrinkFactorsValue)) return issue("shrinkFactors", "invalid_type", "Enter a dense array.");
  if (shrinkFactorsValue.length < 1) return issue("shrinkFactors", "out_of_range", "Too few entries.");
  if (shrinkFactorsValue.length > 1000) return issue("shrinkFactors", "resource_limit", "Array exceeds the 1000-entry resource limit.");
  const validatedShrinkfactors: number[] = [];
  for (let index = 0; index < shrinkFactorsValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(shrinkFactorsValue, index)) return issue(`shrinkFactors.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = shrinkFactorsValue[index];
    if (typeof item !== "number" || !Number.isFinite(item)) return issue(`shrinkFactors.${index}`, "invalid_type", "Enter a finite number.");
    if (item < 0) return issue(`shrinkFactors.${index}`, "out_of_range", "Value is outside the accepted range.");
    validatedShrinkfactors.push(item);
  }

  const input: FlexShrinkDeficitProportionalLossInput = { deficit: deficitValue, baseSizes: validatedBasesizes, shrinkFactors: validatedShrinkfactors };
  if (input.baseSizes.length !== input.shrinkFactors.length) return issue("shrinkFactors", "length_mismatch", "Provide one shrink factor per base size.");
  const weights = input.baseSizes.map((size, index) => size * (input.shrinkFactors[index] ?? 0));
  const needsLog = weights.some((weight, index) => !Number.isFinite(weight) || (weight === 0 && (input.baseSizes[index] ?? 0) > 0 && (input.shrinkFactors[index] ?? 0) > 0));
  let scaled: number[];
  if (needsLog) {
    const logs = input.baseSizes.map((size, index) => size === 0 || input.shrinkFactors[index] === 0 ? -Infinity : Math.log(size) + Math.log(input.shrinkFactors[index] ?? 0));
    const maximum = Math.max(...logs);
    scaled = logs.map((log) => log === -Infinity ? 0 : Math.exp(log - maximum));
  } else {
    const maximum = Math.max(...weights);
    scaled = weights.map((weight) => maximum === 0 ? 0 : weight / maximum);
  }
  const total = scaled.reduce((sum, weight) => sum + weight, 0);
  const fraction = Math.min(1, input.shrinkFactors.reduce((sum, factor) => sum + factor, 0));
  return toolSuccess({ losses: scaled.map((weight) => total === 0 ? 0 : input.deficit * fraction * (weight / total)), undistributedDeficit: total === 0 ? input.deficit : input.deficit * (1 - fraction) });
};
export const example = {
  input: {
    "deficit": 60,
    "baseSizes": [
      100,
      200
    ],
    "shrinkFactors": [
      1,
      1
    ]
  },
  output: {
    "losses": [
      20,
      40
    ],
    "undistributedDeficit": 0
  },
} satisfies ToolExample<FlexShrinkDeficitProportionalLossInput, FlexShrinkDeficitProportionalLossOutput>;
export const flexShrinkDeficitProportionalLossTool = defineTool<FlexShrinkDeficitProportionalLossInput, FlexShrinkDeficitProportionalLossOutput>({
  id: "css/flex-shrink-deficit-proportional-loss",
  title: "Flex Shrink Deficit Proportional Loss",
  description: "Compute initial flex shrink losses with partial filling before min-size freezing, using factors multiplied by base sizes.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: flexShrinkDeficitProportionalLossInputSchema,
  outputSchema: flexShrinkDeficitProportionalLossOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "deficit",
        "label": "Space deficit",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "baseSizes",
        "label": "Flex base sizes",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "number",
            "unit": "px"
          }
        }
      },
      {
        "id": "shrinkFactors",
        "label": "Flex shrink factors",
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
        "id": "losses",
        "label": "Initial proportional losses",
        "valueType": {
          "type": "list",
          "items": {
            "type": "number",
            "unit": "px"
          }
        }
      },
      {
        "id": "undistributedDeficit",
        "label": "Undistributed deficit",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ]
  },
  execute: calculateFlexShrinkDeficitProportionalLoss,
});
export const runFlexShrinkDeficitProportionalLoss = flexShrinkDeficitProportionalLossTool.execute;
export default flexShrinkDeficitProportionalLossTool;
