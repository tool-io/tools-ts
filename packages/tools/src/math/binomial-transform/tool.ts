import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type BinomialTransformInput = {
  readonly values: ReadonlyArray<string>;
};
export type BinomialTransformOutput = {
  readonly values: ReadonlyArray<string>;
};

export const binomialTransformInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: {
      type: "array",
      items: {
        type: "string",
        pattern: "^-?(0|[1-9][0-9]*)$",
        maxLength: 200,
      },
      minItems: 0,
      maxItems: 256,
      description: "Sequence prefix starting at index zero",
    },
  },
  required: ["values"],
} as const satisfies ToolJsonSchema;
export const binomialTransformOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: {
      type: "array",
      items: {
        type: "string",
        pattern: "^-?(0|[1-9][0-9]*)$",
      },
      description: "Binomial transform prefix",
    },
  },
  required: ["values"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/wiki/Binomial_transform
export const calculateBinomialTransform = (rawInput: unknown): ToolResult<BinomialTransformOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly values?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["values"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const valuesValue = candidate.values;
  if (!Array.isArray(valuesValue))
    return issue("values", "invalid_type", "Enter a dense array.");
  if (valuesValue.length < 0)
    return issue("values", "out_of_range", "Array needs at least 0 entries.");
  if (valuesValue.length > 256)
    return issue("values", "resource_limit", "Array exceeds the 256-entry resource limit.");
  const validatedValues: string[] = [];
  for (let index = 0; index < valuesValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(valuesValue, index))
      return issue(`values.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = valuesValue[index];
    if (typeof item !== "string")
      return issue(`values.${index}`, "invalid_type", "Enter an integer as a decimal string.");
    if (item.length > 200)
      return issue(`values.${index}`, "resource_limit", "Decimal input exceeds the 200-character resource limit.");
    if (!/^-?(0|[1-9][0-9]*)$/.test(item))
      return issue(`values.${index}`, "invalid_format", "Enter a canonical decimal integer with the required sign.");
    validatedValues.push(item);
  }
  const input: BinomialTransformInput = { values: validatedValues };
  const values: string[] = [];
  const source = input.values.map((value) => BigInt(value));
  for (let n = 0; n < source.length; n++) {
    let total = 0n, coefficient = 1n;
    for (let k = 0; k <= n; k++) {
      total += coefficient * (source[k] ?? 0n);
      if (k < n) coefficient = coefficient * BigInt(n - k) / BigInt(k + 1);
    }
    values.push(total.toString());
  }
  return toolSuccess({ values });
};

export const example = {
  input: {
    values: ["1", "2", "3", "4"],
  },
  output: {
    values: ["1", "3", "8", "20"],
  },
} satisfies ToolExample<BinomialTransformInput, BinomialTransformOutput>;

export const binomialTransformTool = defineTool<BinomialTransformInput, BinomialTransformOutput>({
  id: "math/binomial-transform",
  title: "Binomial Transform of an Integer Sequence",
  description: "Transform a zero-indexed prefix by b(n)=ΣC(n,k)a(k) using exact decimal integers; empty prefixes are allowed and input is capped at 256 terms.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: binomialTransformInputSchema,
  outputSchema: binomialTransformOutputSchema,
  ports: {
    inputs: [
      {
        id: "values",
        label: "Sequence prefix starting at index zero",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
            format: "integer/arbitrary",
          },
        },
      },
    ],
    outputs: [
      {
        id: "values",
        label: "Binomial transform prefix",
        valueType: {
          type: "list",
          items: {
            type: "string",
            format: "integer/arbitrary",
          },
        },
      },
    ],
  },
  execute: calculateBinomialTransform,
});
export const runBinomialTransform = binomialTransformTool.execute;
export default binomialTransformTool;
