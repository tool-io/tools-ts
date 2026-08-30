import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { binomial } from "../pascal-row/tool.js";

export type MultinomialCoefficientInput = {
  readonly counts: ReadonlyArray<number>;
};
export type MultinomialCoefficientOutput = {
  readonly value: string;
};

export const multinomialCoefficientInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 2000,
      },
      minItems: 0,
      maxItems: 128,
      description: "Nonnegative category counts",
    },
  },
  required: ["counts"],
} as const satisfies ToolJsonSchema;
export const multinomialCoefficientOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Multinomial arrangement count",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/26.4
export const calculateMultinomialCoefficient = (rawInput: unknown): ToolResult<MultinomialCoefficientOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly counts?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["counts"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const countsValue = candidate.counts;
  if (!Array.isArray(countsValue))
    return issue("counts", "invalid_type", "Enter a dense array.");
  if (countsValue.length < 0)
    return issue("counts", "out_of_range", "Array needs at least 0 entries.");
  if (countsValue.length > 128)
    return issue("counts", "resource_limit", "Array exceeds the 128-entry resource limit.");
  const validatedCounts: number[] = [];
  for (let index = 0; index < countsValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(countsValue, index))
      return issue(`counts.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = countsValue[index];
    if (typeof item !== "number" || !Number.isSafeInteger(item))
      return issue(`counts.${index}`, "invalid_type", "Enter a finite safe integer.");
    if (item < 0)
      return issue(`counts.${index}`, "out_of_range", "Value must be at least 0.");
    if (item > 2000)
      return issue(`counts.${index}`, "out_of_range", "Value must be at most 2000.");
    validatedCounts.push(item);
  }
  const input: MultinomialCoefficientInput = { counts: validatedCounts };
  let total = 0, result = 1n;
  for (const count of input.counts) {
    total += count;
    if (total > 2000) return issue("counts", "resource_limit", "Total element count exceeds 2000.");
    result *= binomial(total, count);
  }
  return toolSuccess({ value: result.toString() });
};

export const example = {
  input: {
    counts: [2, 3, 1],
  },
  output: {
    value: "60",
  },
} satisfies ToolExample<MultinomialCoefficientInput, MultinomialCoefficientOutput>;

export const multinomialCoefficientTool = defineTool<MultinomialCoefficientInput, MultinomialCoefficientOutput>({
  id: "math/multinomial-coefficient",
  title: "Multinomial Coefficient",
  description: "Count arrangements with the supplied nonnegative category counts using exact arithmetic; at most 128 categories and 2,000 total elements are admitted.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: multinomialCoefficientInputSchema,
  outputSchema: multinomialCoefficientOutputSchema,
  ports: {
    inputs: [
      {
        id: "counts",
        label: "Nonnegative category counts",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Multinomial arrangement count",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateMultinomialCoefficient,
});
export const runMultinomialCoefficient = multinomialCoefficientTool.execute;
export default multinomialCoefficientTool;
