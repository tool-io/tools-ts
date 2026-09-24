import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tp: number;
  readonly tn: number;
  readonly fp: number;
  readonly fn: number;
};
export type Output = { readonly denominator: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tp: { type: "integer" },
    tn: { type: "integer" },
    fp: { type: "integer" },
    fn: { type: "integer" },
  },
  required: ["tp", "tn", "fp", "fn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { denominator: { type: "number" } },
  required: ["denominator"],
} as const;
/** Calculate binary matthews denominator factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tp, tn, fp, fn } = request;
  const compute = (): Output => {
    for (const x of [tp, tn, fp, fn]) H.integer(x, 0);
    return {
      denominator: Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tp: 3, tn: 4, fp: 1, fn: 2 },
  output: { denominator: 24.49489742783178 },
} satisfies ToolExample<Input, Output>;
export const binaryMatthewsDenominatorFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/binary-matthews-denominator-factor",
    title: "Binary Matthews Denominator Factor Tool",
    description:
      "Calculate binary matthews denominator factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tp: { type: "integer" },
        tn: { type: "integer" },
        fp: { type: "integer" },
        fn: { type: "integer" },
      },
      required: ["tp", "tn", "fp", "fn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { denominator: { type: "number" } },
      required: ["denominator"],
    },
    ports: {
      inputs: [
        {
          id: "tp",
          label: "Tp",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "tn",
          label: "Tn",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fp",
          label: "Fp",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fn",
          label: "Fn",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = binaryMatthewsDenominatorFactorTool.execute;
export default binaryMatthewsDenominatorFactorTool;
