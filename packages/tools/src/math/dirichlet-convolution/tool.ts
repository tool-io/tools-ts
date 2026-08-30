import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type DirichletConvolutionInput = {
  readonly left: ReadonlyArray<string>;
  readonly right: ReadonlyArray<string>;
};
export type DirichletConvolutionOutput = {
  readonly values: ReadonlyArray<string>;
};

export const dirichletConvolutionInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: {
      type: "array",
      items: {
        type: "string",
        pattern: "^-?(0|[1-9][0-9]*)$",
        maxLength: 200,
      },
      minItems: 0,
      maxItems: 1000,
      description: "Values f(1) through f(N)",
    },
    right: {
      type: "array",
      items: {
        type: "string",
        pattern: "^-?(0|[1-9][0-9]*)$",
        maxLength: 200,
      },
      minItems: 0,
      maxItems: 1000,
      description: "Values g(1) through g(N)",
    },
  },
  required: ["left", "right"],
} as const satisfies ToolJsonSchema;
export const dirichletConvolutionOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: {
      type: "array",
      items: {
        type: "string",
        pattern: "^-?(0|[1-9][0-9]*)$",
      },
      description: "Dirichlet convolution h(1) through h(N)",
    },
  },
  required: ["values"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/27.5
export const calculateDirichletConvolution = (rawInput: unknown): ToolResult<DirichletConvolutionOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly left?: unknown;
    readonly right?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["left", "right"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const leftValue = candidate.left;
  if (!Array.isArray(leftValue))
    return issue("left", "invalid_type", "Enter a dense array.");
  if (leftValue.length < 0)
    return issue("left", "out_of_range", "Array needs at least 0 entries.");
  if (leftValue.length > 1000)
    return issue("left", "resource_limit", "Array exceeds the 1000-entry resource limit.");
  const validatedLeft: string[] = [];
  for (let index = 0; index < leftValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(leftValue, index))
      return issue(`left.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = leftValue[index];
    if (typeof item !== "string")
      return issue(`left.${index}`, "invalid_type", "Enter an integer as a decimal string.");
    if (item.length > 200)
      return issue(`left.${index}`, "resource_limit", "Decimal input exceeds the 200-character resource limit.");
    if (!/^-?(0|[1-9][0-9]*)$/.test(item))
      return issue(`left.${index}`, "invalid_format", "Enter a canonical decimal integer with the required sign.");
    validatedLeft.push(item);
  }
  const rightValue = candidate.right;
  if (!Array.isArray(rightValue))
    return issue("right", "invalid_type", "Enter a dense array.");
  if (rightValue.length < 0)
    return issue("right", "out_of_range", "Array needs at least 0 entries.");
  if (rightValue.length > 1000)
    return issue("right", "resource_limit", "Array exceeds the 1000-entry resource limit.");
  const validatedRight: string[] = [];
  for (let index = 0; index < rightValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(rightValue, index))
      return issue(`right.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = rightValue[index];
    if (typeof item !== "string")
      return issue(`right.${index}`, "invalid_type", "Enter an integer as a decimal string.");
    if (item.length > 200)
      return issue(`right.${index}`, "resource_limit", "Decimal input exceeds the 200-character resource limit.");
    if (!/^-?(0|[1-9][0-9]*)$/.test(item))
      return issue(`right.${index}`, "invalid_format", "Enter a canonical decimal integer with the required sign.");
    validatedRight.push(item);
  }
  const input: DirichletConvolutionInput = { left: validatedLeft, right: validatedRight };
  if (input.left.length !== input.right.length) return issue("right", "length_mismatch", "Arithmetic-function prefixes must have equal lengths.");
  const left = input.left.map((value) => BigInt(value)), right = input.right.map((value) => BigInt(value));
  const values = Array<bigint>(left.length).fill(0n);
  for (let divisor = 1; divisor <= left.length; divisor++) {
    for (let quotient = 1; quotient <= Math.floor(left.length / divisor); quotient++) {
      const index = divisor * quotient - 1;
      values[index] = (values[index] ?? 0n) + (left[divisor - 1] ?? 0n) * (right[quotient - 1] ?? 0n);
    }
  }
  return toolSuccess({ values: values.map((value) => value.toString()) });
};

export const example = {
  input: {
    left: ["1", "1", "1", "1", "1", "1"],
    right: ["1", "2", "3", "4", "5", "6"],
  },
  output: {
    values: ["1", "3", "4", "7", "6", "12"],
  },
} satisfies ToolExample<DirichletConvolutionInput, DirichletConvolutionOutput>;

export const dirichletConvolutionTool = defineTool<DirichletConvolutionInput, DirichletConvolutionOutput>({
  id: "math/dirichlet-convolution",
  title: "Dirichlet Convolution Prefix",
  description: "Compute h(n)=Σ(d|n)f(d)g(n/d) for equally sized arithmetic-function prefixes starting at n=1, using exact integers and at most 1,000 terms.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: dirichletConvolutionInputSchema,
  outputSchema: dirichletConvolutionOutputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Values f(1) through f(N)",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
            format: "integer/arbitrary",
          },
        },
      },
      {
        id: "right",
        label: "Values g(1) through g(N)",
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
        label: "Dirichlet convolution h(1) through h(N)",
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
  execute: calculateDirichletConvolution,
});
export const runDirichletConvolution = dirichletConvolutionTool.execute;
export default dirichletConvolutionTool;
