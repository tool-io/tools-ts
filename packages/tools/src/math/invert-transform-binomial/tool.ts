import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type InvertTransformBinomialInput = {
  readonly values: ReadonlyArray<string>;
};
export type InvertTransformBinomialOutput = {
  readonly values: ReadonlyArray<string>;
};

export const invertTransformBinomialInputSchema = {
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
      description: "Binomial transform prefix starting at index zero",
    },
  },
  required: ["values"],
} as const satisfies ToolJsonSchema;
export const invertTransformBinomialOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: {
      type: "array",
      items: {
        type: "string",
        pattern: "^-?(0|[1-9][0-9]*)$",
      },
      description: "Recovered sequence prefix",
    },
  },
  required: ["values"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/wiki/Binomial_transform
export const calculateInvertTransformBinomial = (rawInput: unknown): ToolResult<InvertTransformBinomialOutput> => {
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
  const input: InvertTransformBinomialInput = { values: validatedValues };
  const values: string[] = [];
  const source = input.values.map((value) => BigInt(value));
  for (let n = 0; n < source.length; n++) {
    let total = 0n, coefficient = 1n;
    for (let k = 0; k <= n; k++) {
      const term = coefficient * (source[k] ?? 0n);
      total += (n - k) % 2 === 0 ? term : -term;
      if (k < n) coefficient = coefficient * BigInt(n - k) / BigInt(k + 1);
    }
    values.push(total.toString());
  }
  return toolSuccess({ values });
};

export const example = {
  input: {
    values: ["1", "3", "8", "20"],
  },
  output: {
    values: ["1", "2", "3", "4"],
  },
} satisfies ToolExample<InvertTransformBinomialInput, InvertTransformBinomialOutput>;

export const invertTransformBinomialTool = defineTool<InvertTransformBinomialInput, InvertTransformBinomialOutput>({
  id: "math/invert-transform-binomial",
  title: "Inverse Binomial Transform",
  description: "Invert a zero-indexed binomial-transform prefix by a(n)=Σ(−1)^(n−k)C(n,k)b(k) using exact decimal integers and at most 256 terms.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: invertTransformBinomialInputSchema,
  outputSchema: invertTransformBinomialOutputSchema,
  ports: {
    inputs: [
      {
        id: "values",
        label: "Binomial transform prefix starting at index zero",
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
        label: "Recovered sequence prefix",
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
  execute: calculateInvertTransformBinomial,
});
export const runInvertTransformBinomial = invertTransformBinomialTool.execute;
export default invertTransformBinomialTool;
