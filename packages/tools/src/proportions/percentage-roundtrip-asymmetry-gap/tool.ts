import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly fraction: number };
export type Output = { readonly reverseFraction: number; readonly sum: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number", exclusiveMinimum: -1 } },
  required: ["fraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reverseFraction: { type: "number" }, sum: { type: "number" } },
  required: ["reverseFraction", "sum"],
} as const;
/** Calculate percentage roundtrip asymmetry gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fraction } = request;
  const compute = (): Output => {
    H.domain(fraction > -1);
    const reverseFraction = -fraction / (1 + fraction);
    return { reverseFraction, sum: fraction + reverseFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fraction: 0.25 },
  output: { reverseFraction: -0.2, sum: 0.04999999999999999 },
} satisfies ToolExample<Input, Output>;
export const percentageRoundtripAsymmetryGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/percentage-roundtrip-asymmetry-gap",
    title: "Percentage Roundtrip Asymmetry Gap Tool",
    description:
      "Calculate percentage roundtrip asymmetry gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fraction: { type: "number", exclusiveMinimum: -1 } },
      required: ["fraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reverseFraction: { type: "number" },
        sum: { type: "number" },
      },
      required: ["reverseFraction", "sum"],
    },
    ports: {
      inputs: [
        {
          id: "fraction",
          label: "Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reverseFraction",
          label: "Reverse Fraction",
          valueType: { type: "number" },
        },
        { id: "sum", label: "Sum", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = percentageRoundtripAsymmetryGapTool.execute;
export default percentageRoundtripAsymmetryGapTool;
