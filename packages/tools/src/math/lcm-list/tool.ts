import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type LcmListInput = {
  readonly values: ReadonlyArray<string>;
};
export type LcmListOutput = {
  readonly lcm: string;
};

export const lcmListInputSchema = {
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
      minItems: 1,
      maxItems: 128,
      description: "Signed decimal integers",
    },
  },
  required: ["values"],
} as const satisfies ToolJsonSchema;
export const lcmListOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lcm: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Least common multiple",
    },
  },
  required: ["lcm"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/01%3A_Introduction/1.06%3A_The_Euclidean_Algorithm
export const calculateLcmList = (rawInput: unknown): ToolResult<LcmListOutput> => {
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
  if (valuesValue.length < 1)
    return issue("values", "out_of_range", "Array needs at least 1 entries.");
  if (valuesValue.length > 128)
    return issue("values", "resource_limit", "Array exceeds the 128-entry resource limit.");
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
  const input: LcmListInput = { values: validatedValues };
  let result = 1n;
  for (const value of input.values) {
    let next = BigInt(value);
    if (next < 0n) next = -next;
    if (next === 0n || result === 0n) { result = 0n; continue; }
    let a = result, b = next;
    while (b !== 0n) [a, b] = [b, a % b];
    result = (result / a) * next;
  }
  return toolSuccess({ lcm: result.toString() });
};

export const example = {
  input: {
    values: ["12", "-18", "30"],
  },
  output: {
    lcm: "180",
  },
} satisfies ToolExample<LcmListInput, LcmListOutput>;

export const lcmListTool = defineTool<LcmListInput, LcmListOutput>({
  id: "math/lcm-list",
  title: "Least Common Multiple of a List",
  description: "Compute the nonnegative least common multiple of 1–128 signed decimal integers using exact arithmetic; any zero entry makes the result zero.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: lcmListInputSchema,
  outputSchema: lcmListOutputSchema,
  ports: {
    inputs: [
      {
        id: "values",
        label: "Signed decimal integers",
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
        id: "lcm",
        label: "Least common multiple",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateLcmList,
});
export const runLcmList = lcmListTool.execute;
export default lcmListTool;
