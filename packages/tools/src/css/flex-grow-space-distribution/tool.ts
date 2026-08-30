import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type FlexGrowSpaceDistributionInput = {
  readonly freeSpace: number;
  readonly growFactors: ReadonlyArray<number>;
};
export type FlexGrowSpaceDistributionOutput = {
  readonly allocations: ReadonlyArray<number>;
  readonly unallocatedSpace: number;
};
export const flexGrowSpaceDistributionInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "freeSpace": {
      "type": "number",
      "minimum": 0,
      "description": "Positive free space"
    },
    "growFactors": {
      "type": "array",
      "items": {
        "type": "number",
        "minimum": 0
      },
      "minItems": 0,
      "maxItems": 1000,
      "description": "Flex grow factors"
    }
  },
  "required": [
    "freeSpace",
    "growFactors"
  ]
} as const satisfies ToolJsonSchema;
export const flexGrowSpaceDistributionOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "allocations": {
      "type": "array",
      "items": {
        "type": "number",
        "minimum": 0
      },
      "description": "Space added to each item"
    },
    "unallocatedSpace": {
      "type": "number",
      "minimum": 0,
      "description": "Unallocated space"
    }
  },
  "required": [
    "allocations",
    "unallocatedSpace"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-flexbox-1/#resolve-flexible-lengths
export const calculateFlexGrowSpaceDistribution = (rawInput: unknown): ToolResult<FlexGrowSpaceDistributionOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly freeSpace?: unknown; readonly growFactors?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "freeSpace",
  "growFactors"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const freeSpaceValue = candidate.freeSpace;
  if (typeof freeSpaceValue !== "number" || !Number.isFinite(freeSpaceValue)) return issue("freeSpace", "invalid_type", "Enter a finite number.");
  if (freeSpaceValue < 0) return issue("freeSpace", "out_of_range", "Value is outside the accepted range.");
  const growFactorsValue = candidate.growFactors;
  if (!Array.isArray(growFactorsValue)) return issue("growFactors", "invalid_type", "Enter a dense array.");
  if (growFactorsValue.length < 0) return issue("growFactors", "out_of_range", "Too few entries.");
  if (growFactorsValue.length > 1000) return issue("growFactors", "resource_limit", "Array exceeds the 1000-entry resource limit.");
  const validatedGrowfactors: number[] = [];
  for (let index = 0; index < growFactorsValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(growFactorsValue, index)) return issue(`growFactors.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = growFactorsValue[index];
    if (typeof item !== "number" || !Number.isFinite(item)) return issue(`growFactors.${index}`, "invalid_type", "Enter a finite number.");
    if (item < 0) return issue(`growFactors.${index}`, "out_of_range", "Value is outside the accepted range.");
    validatedGrowfactors.push(item);
  }

  const input: FlexGrowSpaceDistributionInput = { freeSpace: freeSpaceValue, growFactors: validatedGrowfactors };
  const maximum = Math.max(0, ...input.growFactors);
  const scaled = input.growFactors.map((factor) => maximum === 0 ? 0 : factor / maximum);
  const total = scaled.reduce((sum, factor) => sum + factor, 0);
  const fraction = Math.min(1, maximum * total);
  const allocations = scaled.map((factor) => total === 0 ? 0 : input.freeSpace * fraction * (factor / total));
  return toolSuccess({ allocations, unallocatedSpace: input.freeSpace * (1 - fraction) });
};
export const example = {
  input: {
    "freeSpace": 120,
    "growFactors": [
      1,
      2
    ]
  },
  output: {
    "allocations": [
      40,
      80
    ],
    "unallocatedSpace": 0
  },
} satisfies ToolExample<FlexGrowSpaceDistributionInput, FlexGrowSpaceDistributionOutput>;
export const flexGrowSpaceDistributionTool = defineTool<FlexGrowSpaceDistributionInput, FlexGrowSpaceDistributionOutput>({
  id: "css/flex-grow-space-distribution",
  title: "Flex Grow Space Distribution Calculator",
  description: "Distribute positive free space across unfrozen flex items, including partial filling when grow factors sum below one.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: flexGrowSpaceDistributionInputSchema,
  outputSchema: flexGrowSpaceDistributionOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "freeSpace",
        "label": "Positive free space",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "growFactors",
        "label": "Flex grow factors",
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
        "id": "allocations",
        "label": "Space added to each item",
        "valueType": {
          "type": "list",
          "items": {
            "type": "number",
            "unit": "px"
          }
        }
      },
      {
        "id": "unallocatedSpace",
        "label": "Unallocated space",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ]
  },
  execute: calculateFlexGrowSpaceDistribution,
});
export const runFlexGrowSpaceDistribution = flexGrowSpaceDistributionTool.execute;
export default flexGrowSpaceDistributionTool;
