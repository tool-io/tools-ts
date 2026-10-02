import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly ec50: number;
  readonly hill: number;
  readonly baseline: number;
  readonly maximumEffect: number;
};
export type Output = {
  readonly fraction: number;
  readonly logit: number;
  readonly effect: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", exclusiveMinimum: 0 },
    ec50: { type: "number", exclusiveMinimum: 0 },
    hill: { type: "number", exclusiveMinimum: 0 },
    baseline: { type: "number" },
    maximumEffect: { type: "number" },
  },
  required: ["concentration", "ec50", "hill", "baseline", "maximumEffect"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number" },
    logit: { type: "number" },
    effect: { type: "number" },
  },
  required: ["fraction", "logit", "effect"],
} as const;
/** Stable supplied Hill/Emax research response and logit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, ec50, hill, baseline, maximumEffect } = request;
  const compute = (): Output => {
    H.positive(concentration);
    H.positive(ec50);
    H.positive(hill);
    const logit = hill * (Math.log(concentration) - Math.log(ec50)),
      fraction =
        logit >= 0
          ? 1 / (1 + Math.exp(-logit))
          : Math.exp(logit) / (1 + Math.exp(logit));
    return { fraction, logit, effect: baseline + maximumEffect * fraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 4, ec50: 2, hill: 2, baseline: 1, maximumEffect: 10 },
  output: { fraction: 0.8, logit: 1.3862943611198906, effect: 9 },
} satisfies ToolExample<Input, Output>;
export const sigmoidEmaxLogitSlopeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacodynamics/sigmoid-emax-logit-slope-term",
    title: "Sigmoid Emax Logit Slope Term Tool",
    description: "Stable supplied Hill/Emax research response and logit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number", exclusiveMinimum: 0 },
        ec50: { type: "number", exclusiveMinimum: 0 },
        hill: { type: "number", exclusiveMinimum: 0 },
        baseline: { type: "number" },
        maximumEffect: { type: "number" },
      },
      required: ["concentration", "ec50", "hill", "baseline", "maximumEffect"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        logit: { type: "number" },
        effect: { type: "number" },
      },
      required: ["fraction", "logit", "effect"],
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
          id: "hill",
          label: "Hill",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseline",
          label: "Baseline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximumEffect",
          label: "Maximum Effect",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "logit", label: "Logit", valueType: { type: "number" } },
        { id: "effect", label: "Effect", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sigmoidEmaxLogitSlopeTermTool.execute;
export default sigmoidEmaxLogitSlopeTermTool;
