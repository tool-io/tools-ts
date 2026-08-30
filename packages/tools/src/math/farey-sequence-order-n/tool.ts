import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type FareySequenceOrderNInput = {
  readonly order: number;
};
export type FareySequenceOrderNOutput = {
  readonly fractions: ReadonlyArray<{ readonly numerator: number; readonly denominator: number; }>;
};

export const fareySequenceOrderNInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    order: {
      type: "integer",
      minimum: 1,
      maximum: 300,
      description: "Farey order (resource limit 300)",
    },
  },
  required: ["order"],
} as const satisfies ToolJsonSchema;
export const fareySequenceOrderNOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fractions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          numerator: {
            type: "integer",
            minimum: 0,
          },
          denominator: {
            type: "integer",
            minimum: 1,
          },
        },
        required: ["numerator", "denominator"],
      },
      description: "Ordered reduced fractions",
    },
  },
  required: ["fractions"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A005728
export const calculateFareySequenceOrderN = (rawInput: unknown): ToolResult<FareySequenceOrderNOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly order?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["order"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const orderValue = candidate.order;
  if (typeof orderValue !== "number" || !Number.isSafeInteger(orderValue))
    return issue("order", "invalid_type", "Enter a finite safe integer.");
  if (orderValue < 1)
    return issue("order", "out_of_range", "Value must be at least 1.");
  if (orderValue > 300)
    return issue("order", "resource_limit", "Value must be at most 300.");
  const input: FareySequenceOrderNInput = { order: orderValue };
  const n = input.order;
  let a = 0, b = 1, c = 1, d = n;
  const fractions = [{ numerator: 0, denominator: 1 }];
  while (c <= n) {
    fractions.push({ numerator: c, denominator: d });
    const k = Math.floor((n + b) / d);
    [a, b, c, d] = [c, d, k * c - a, k * d - b];
  }
  return toolSuccess({ fractions });
};

export const example = {
  input: {
    order: 4,
  },
  output: {
    fractions: [
      {
        numerator: 0,
        denominator: 1,
      },
      {
        numerator: 1,
        denominator: 4,
      },
      {
        numerator: 1,
        denominator: 3,
      },
      {
        numerator: 1,
        denominator: 2,
      },
      {
        numerator: 2,
        denominator: 3,
      },
      {
        numerator: 3,
        denominator: 4,
      },
      {
        numerator: 1,
        denominator: 1,
      },
    ],
  },
} satisfies ToolExample<FareySequenceOrderNInput, FareySequenceOrderNOutput>;

export const fareySequenceOrderNTool = defineTool<FareySequenceOrderNInput, FareySequenceOrderNOutput>({
  id: "math/farey-sequence-order-n",
  title: "Farey Sequence of Order n",
  description: "List the reduced fractions from zero to one in increasing order with denominators at most n; order is capped at 300 to bound the output size.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: fareySequenceOrderNInputSchema,
  outputSchema: fareySequenceOrderNOutputSchema,
  ports: {
    inputs: [
      {
        id: "order",
        label: "Farey order (resource limit 300)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "fractions",
        label: "Ordered reduced fractions",
        valueType: {
          type: "list",
          items: {
            type: "object",
          },
        },
      },
    ],
  },
  execute: calculateFareySequenceOrderN,
});
export const runFareySequenceOrderN = fareySequenceOrderNTool.execute;
export default fareySequenceOrderNTool;
