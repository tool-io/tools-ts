import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly gasWording: string; readonly fraction: number };
export type Output = { readonly percent: number; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gasWording: { type: "string", maxLength: 8192, minLength: 1 },
    fraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["gasWording", "fraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    percent: { type: "number" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["percent", "label"],
} as const;
/** Crosswalk an explicitly recorded gas fraction to percent without recommending gas concentrations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gasWording, fraction } = request;
  const compute = (): Output => {
    H.domain(gasWording.length > 0, "gasWording");
    (H.domain(fraction >= 0 && fraction <= 1, "fraction"), fraction);
    return {
      percent: fraction * 100,
      label: gasWording + " " + fraction * 100 + "%",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gasWording: "recorded gas A", fraction: 0.02 },
  output: { percent: 2, label: "recorded gas A 2%" },
} satisfies ToolExample<Input, Output>;
export const anesthesiaGasFractionPercentLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["anesthesiology", "health and medicine"],
      keywords: ["anesthesiology", "health and medicine"],
    },
    id: "anesthesiology/anesthesia-gas-fraction-percent-label",
    title: "Anesthesia Gas Fraction Percent Label",
    description:
      "Crosswalk an explicitly recorded gas fraction to percent without recommending gas concentrations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gasWording: { type: "string", maxLength: 8192, minLength: 1 },
        fraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["gasWording", "fraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        percent: { type: "number" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["percent", "label"],
    },
    ports: {
      inputs: [
        {
          id: "gasWording",
          label: "Gas Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fraction",
          label: "Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "percent", label: "Percent", valueType: { type: "number" } },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = anesthesiaGasFractionPercentLabelTool.execute;
export default anesthesiaGasFractionPercentLabelTool;
