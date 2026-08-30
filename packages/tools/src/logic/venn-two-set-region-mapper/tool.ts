import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type VennTwoSetRegionMapperInput = {
  readonly inA: boolean;
  readonly inB: boolean;
};
export type VennTwoSetRegionMapperOutput = {
  readonly regionIndex: number;
  readonly region: "outside" | "a-only" | "b-only" | "intersection";
};
export const vennTwoSetRegionMapperInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "inA": {
      "type": "boolean",
      "description": "In A"
    },
    "inB": {
      "type": "boolean",
      "description": "In B"
    }
  },
  "required": [
    "inA",
    "inB"
  ]
} as const satisfies ToolJsonSchema;
export const vennTwoSetRegionMapperOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "regionIndex": {
      "type": "integer",
      "minimum": 0,
      "maximum": 3,
      "description": "Binary region index"
    },
    "region": {
      "type": "string",
      "enum": [
        "outside",
        "a-only",
        "b-only",
        "intersection"
      ],
      "description": "Venn region"
    }
  },
  "required": [
    "regionIndex",
    "region"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm
export const calculateVennTwoSetRegionMapper = (rawInput: unknown): ToolResult<VennTwoSetRegionMapperOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly inA?: unknown; readonly inB?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "inA",
  "inB"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const inAValue = candidate.inA;
  if (typeof inAValue !== "boolean") return issue("inA", "invalid_type", "Enter a boolean value.");
  const inBValue = candidate.inB;
  if (typeof inBValue !== "boolean") return issue("inB", "invalid_type", "Enter a boolean value.");

  const input: VennTwoSetRegionMapperInput = { inA: inAValue, inB: inBValue };
  const regionIndex = Number(input.inA) * 2 + Number(input.inB);
  const region = input.inA ? (input.inB ? "intersection" : "a-only") : (input.inB ? "b-only" : "outside");
  return toolSuccess({ regionIndex, region });
};
export const example = {
  input: {
    "inA": true,
    "inB": true
  },
  output: {
    "regionIndex": 3,
    "region": "intersection"
  },
} satisfies ToolExample<VennTwoSetRegionMapperInput, VennTwoSetRegionMapperOutput>;
export const vennTwoSetRegionMapperTool = defineTool<VennTwoSetRegionMapperInput, VennTwoSetRegionMapperOutput>({
  id: "logic/venn-two-set-region-mapper",
  title: "Venn Diagram Two-Set Region Number Mapper (0-3)",
  description: "Map two Boolean set memberships to a Venn region using A as the most significant bit.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: vennTwoSetRegionMapperInputSchema,
  outputSchema: vennTwoSetRegionMapperOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "inA",
        "label": "In A",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "inB",
        "label": "In B",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "regionIndex",
        "label": "Binary region index",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "region",
        "label": "Venn region",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateVennTwoSetRegionMapper,
});
export const runVennTwoSetRegionMapper = vennTwoSetRegionMapperTool.execute;
export default vennTwoSetRegionMapperTool;
