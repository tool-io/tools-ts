import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly subunits: string; readonly perMajor: string };
export type Output = {
  readonly majorDecimal: string;
  readonly remainderDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subunits: { type: "string", maxLength: 8192 },
    perMajor: { type: "string", maxLength: 8192 },
  },
  required: ["subunits", "perMajor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    majorDecimal: { type: "string", maxLength: 8192 },
    remainderDecimal: { type: "string", maxLength: 8192 },
  },
  required: ["majorDecimal", "remainderDecimal"],
} as const;
/** Decompose nonnegative supplied historical subunits under an explicit radix without a currency dataset. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { subunits, perMajor } = request;
  const compute = (): Output => {
    const n = H.decimal(subunits),
      d = H.decimal(perMajor);
    H.domain(n >= 0n && d > 0n);
    return {
      majorDecimal: (n / d).toString(),
      remainderDecimal: (n % d).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { subunits: "245", perMajor: "12" },
  output: { majorDecimal: "20", remainderDecimal: "5" },
} satisfies ToolExample<Input, Output>;
export const oldCurrencySubunitRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/old-currency-subunit-remainder",
    title: "Old Currency Subunit Remainder Tool",
    description:
      "Decompose nonnegative supplied historical subunits under an explicit radix without a currency dataset.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        subunits: { type: "string", maxLength: 8192 },
        perMajor: { type: "string", maxLength: 8192 },
      },
      required: ["subunits", "perMajor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        majorDecimal: { type: "string", maxLength: 8192 },
        remainderDecimal: { type: "string", maxLength: 8192 },
      },
      required: ["majorDecimal", "remainderDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "subunits",
          label: "Subunits",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "perMajor",
          label: "Per Major",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "majorDecimal",
          label: "Major Decimal",
          valueType: { type: "string" },
        },
        {
          id: "remainderDecimal",
          label: "Remainder Decimal",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = oldCurrencySubunitRemainderTool.execute;
export default oldCurrencySubunitRemainderTool;
