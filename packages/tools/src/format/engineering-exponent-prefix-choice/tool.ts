import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exponent: number;
  readonly exponents: readonly number[];
  readonly prefixes: readonly string[];
};
export type Output = { readonly prefix: string; readonly matched: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exponent: { type: "integer" },
    exponents: { type: "array", maxItems: 256, items: { type: "integer" } },
    prefixes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["exponent", "exponents", "prefixes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefix: { type: "string", maxLength: 8192 },
    matched: { type: "boolean" },
  },
  required: ["prefix", "matched"],
} as const;
/** Look up an exact engineering exponent in a caller-supplied prefix table; absent exponents are explicit. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { exponent, exponents, prefixes } = input;
  const compute = (): Output => {
    H.sameLength(exponents, prefixes);
    H.domain(new Set(exponents).size === exponents.length);
    const i = exponents.indexOf(exponent);
    return { prefix: i < 0 ? "" : prefixes[i], matched: i >= 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { exponent: 3, exponents: [-3, 0, 3], prefixes: ["m", "", "k"] },
  output: { prefix: "k", matched: true },
} satisfies ToolExample<Input, Output>;
export const engineeringExponentPrefixChoiceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/engineering-exponent-prefix-choice",
    title: "Engineering Exponent Prefix Choice Tool",
    description:
      "Look up an exact engineering exponent in a caller-supplied prefix table; absent exponents are explicit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exponent: { type: "integer" },
        exponents: { type: "array", maxItems: 256, items: { type: "integer" } },
        prefixes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["exponent", "exponents", "prefixes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefix: { type: "string", maxLength: 8192 },
        matched: { type: "boolean" },
      },
      required: ["prefix", "matched"],
    },
    ports: {
      inputs: [
        {
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exponents",
          label: "Exponents",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "prefixes",
          label: "Prefixes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "prefix", label: "Prefix", valueType: { type: "string" } },
        { id: "matched", label: "Matched", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = engineeringExponentPrefixChoiceTool.execute;
export default engineeringExponentPrefixChoiceTool;
