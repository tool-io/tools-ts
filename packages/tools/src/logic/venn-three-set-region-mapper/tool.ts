import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type VennThreeSetRegionMapperInput = {
  readonly inA: boolean;
  readonly inB: boolean;
  readonly inC: boolean;
};
export type VennThreeSetRegionMapperOutput = {
  readonly regionIndex: number;
  readonly membershipBits: string;
  readonly memberOf: ReadonlyArray<"A" | "B" | "C">;
};
export const vennThreeSetRegionMapperInputSchema = {
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
    },
    "inC": {
      "type": "boolean",
      "description": "In C"
    }
  },
  "required": [
    "inA",
    "inB",
    "inC"
  ]
} as const satisfies ToolJsonSchema;
export const vennThreeSetRegionMapperOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "regionIndex": {
      "type": "integer",
      "minimum": 0,
      "maximum": 7,
      "description": "Binary region index"
    },
    "membershipBits": {
      "type": "string",
      "description": "Membership bits in A, B, C order"
    },
    "memberOf": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "A",
          "B",
          "C"
        ]
      },
      "description": "Containing sets"
    }
  },
  "required": [
    "regionIndex",
    "membershipBits",
    "memberOf"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm
export const calculateVennThreeSetRegionMapper = (rawInput: unknown): ToolResult<VennThreeSetRegionMapperOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly inA?: unknown; readonly inB?: unknown; readonly inC?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "inA",
  "inB",
  "inC"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const inAValue = candidate.inA;
  if (typeof inAValue !== "boolean") return issue("inA", "invalid_type", "Enter a boolean value.");
  const inBValue = candidate.inB;
  if (typeof inBValue !== "boolean") return issue("inB", "invalid_type", "Enter a boolean value.");
  const inCValue = candidate.inC;
  if (typeof inCValue !== "boolean") return issue("inC", "invalid_type", "Enter a boolean value.");

  const input: VennThreeSetRegionMapperInput = { inA: inAValue, inB: inBValue, inC: inCValue };
  const regionIndex = Number(input.inA) * 4 + Number(input.inB) * 2 + Number(input.inC);
  const memberOf: ("A" | "B" | "C")[] = [];
  if (input.inA) memberOf.push("A");
  if (input.inB) memberOf.push("B");
  if (input.inC) memberOf.push("C");
  return toolSuccess({ regionIndex, membershipBits: `${Number(input.inA)}${Number(input.inB)}${Number(input.inC)}`, memberOf });
};
export const example = {
  input: {
    "inA": true,
    "inB": false,
    "inC": true
  },
  output: {
    "regionIndex": 5,
    "membershipBits": "101",
    "memberOf": [
      "A",
      "C"
    ]
  },
} satisfies ToolExample<VennThreeSetRegionMapperInput, VennThreeSetRegionMapperOutput>;
export const vennThreeSetRegionMapperTool = defineTool<VennThreeSetRegionMapperInput, VennThreeSetRegionMapperOutput>({
  id: "logic/venn-three-set-region-mapper",
  title: "Venn Diagram Three-Set Region Number Mapper (0-7)",
  description: "Map three Boolean set memberships to a Venn region index and the list of containing sets.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: vennThreeSetRegionMapperInputSchema,
  outputSchema: vennThreeSetRegionMapperOutputSchema,
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
      },
      {
        "id": "inC",
        "label": "In C",
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
        "id": "membershipBits",
        "label": "Membership bits in A, B, C order",
        "valueType": {
          "type": "string",
          "format": "binary"
        }
      },
      {
        "id": "memberOf",
        "label": "Containing sets",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ]
  },
  execute: calculateVennThreeSetRegionMapper,
});
export const runVennThreeSetRegionMapper = vennThreeSetRegionMapperTool.execute;
export default vennThreeSetRegionMapperTool;
