import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly ec50: number;
  readonly maximumEffect: number;
  readonly baseline: number;
};
export type Output = { readonly fraction: number; readonly effect: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", minimum: 0 },
    ec50: { type: "number", exclusiveMinimum: 0 },
    maximumEffect: { type: "number" },
    baseline: { type: "number" },
  },
  required: ["concentration", "ec50", "maximumEffect", "baseline"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, effect: { type: "number" } },
  required: ["fraction", "effect"],
} as const;
/** Evaluate a supplied one-site research Emax curve without fitting or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, ec50, maximumEffect, baseline } = request;
  const compute = (): Output => {
    H.domain(concentration >= 0);
    H.positive(ec50);
    const fraction =
      concentration > ec50
        ? 1 / (1 + ec50 / concentration)
        : concentration / ec50 / (1 + concentration / ec50);
    return { fraction, effect: baseline + maximumEffect * fraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 2, ec50: 2, maximumEffect: 10, baseline: 1 },
  output: { fraction: 0.5, effect: 6 },
} satisfies ToolExample<Input, Output>;
export const emaxOneConcentrationResponseTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacodynamics/emax-one-concentration-response-term",
    title: "Emax One Concentration Response Term Tool",
    description:
      "Evaluate a supplied one-site research Emax curve without fitting or clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number", minimum: 0 },
        ec50: { type: "number", exclusiveMinimum: 0 },
        maximumEffect: { type: "number" },
        baseline: { type: "number" },
      },
      required: ["concentration", "ec50", "maximumEffect", "baseline"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fraction: { type: "number" }, effect: { type: "number" } },
      required: ["fraction", "effect"],
    },
    ports: {
      inputs: [
        {
          id: "concentration",
          label: "Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ec50",
          label: "Ec50",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximumEffect",
          label: "Maximum Effect",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseline",
          label: "Baseline",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "effect", label: "Effect", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = emaxOneConcentrationResponseTermTool.execute;
export default emaxOneConcentrationResponseTermTool;
