import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type UlamSpiralDiagonalInput = {
  readonly layer: string;
};
export type UlamSpiralDiagonalOutput = {
  readonly corners: ReadonlyArray<string>;
  readonly diagonalSum: string;
};

export const ulamSpiralDiagonalInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    layer: {
      type: "string",
      pattern: "^(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Nonnegative layer index; side length is 2r+1",
    },
  },
  required: ["layer"],
} as const satisfies ToolJsonSchema;
export const ulamSpiralDiagonalOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    corners: {
      type: "array",
      items: {
        type: "string",
        pattern: "^-?(0|[1-9][0-9]*)$",
      },
      description: "Corner values in descending order; center only for layer zero",
    },
    diagonalSum: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Sum of both diagonals through this layer",
    },
  },
  required: ["corners", "diagonalSum"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://projecteuler.net/problem=28
export const calculateUlamSpiralDiagonal = (rawInput: unknown): ToolResult<UlamSpiralDiagonalOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly layer?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["layer"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const layerValue = candidate.layer;
  if (typeof layerValue !== "string")
    return issue("layer", "invalid_type", "Enter an integer as a decimal string.");
  if (layerValue.length > 200)
    return issue("layer", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^(0|[1-9][0-9]*)$/.test(layerValue))
    return issue("layer", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const input: UlamSpiralDiagonalInput = { layer: layerValue };
  const r = BigInt(input.layer);
  const side = 2n * r + 1n, square = side * side;
  const corners = r === 0n ? ["1"] : [square, square - 2n * r, square - 4n * r, square - 6n * r].map((value) => value.toString());
  const diagonalSum = 1n + 16n * r * (r + 1n) * (2n * r + 1n) / 6n + 2n * r * (r + 1n) + 4n * r;
  return toolSuccess({ corners, diagonalSum: diagonalSum.toString() });
};

export const example = {
  input: {
    layer: "2",
  },
  output: {
    corners: ["25", "21", "17", "13"],
    diagonalSum: "101",
  },
} satisfies ToolExample<UlamSpiralDiagonalInput, UlamSpiralDiagonalOutput>;

export const ulamSpiralDiagonalTool = defineTool<UlamSpiralDiagonalInput, UlamSpiralDiagonalOutput>({
  id: "math/ulam-spiral-diagonal",
  title: "Ulam Spiral Diagonal Corners and Sum",
  description: "Return the diagonal corner values of square spiral layer r and the total of both diagonals through that layer, counting the central one once and using exact arithmetic.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: ulamSpiralDiagonalInputSchema,
  outputSchema: ulamSpiralDiagonalOutputSchema,
  ports: {
    inputs: [
      {
        id: "layer",
        label: "Nonnegative layer index; side length is 2r+1",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
    outputs: [
      {
        id: "corners",
        label: "Corner values in descending order; center only for layer zero",
        valueType: {
          type: "list",
          items: {
            type: "string",
            format: "integer/arbitrary",
          },
        },
      },
      {
        id: "diagonalSum",
        label: "Sum of both diagonals through this layer",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateUlamSpiralDiagonal,
});
export const runUlamSpiralDiagonal = ulamSpiralDiagonalTool.execute;
export default ulamSpiralDiagonalTool;
