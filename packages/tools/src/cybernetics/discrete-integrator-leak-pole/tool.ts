import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly leakRate: number; readonly step: number };
export type Output = {
  readonly pole: number;
  readonly asymptoticallyStable: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leakRate: { type: "number", minimum: 0 },
    step: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["leakRate", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pole: { type: "number" },
    asymptoticallyStable: { type: "boolean" },
  },
  required: ["pole", "asymptoticallyStable"],
} as const;
/** Return the forward-Euler pole of a supplied leaky integrator and its strict unit-circle stability flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leakRate, step } = request;
  const compute = (): Output => {
    H.domain(leakRate >= 0);
    H.positive(step);
    return {
      pole: 1 - leakRate * step,
      asymptoticallyStable: Math.abs(1 - leakRate * step) < 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leakRate: 0.2, step: 1 },
  output: { pole: 0.8, asymptoticallyStable: true },
} satisfies ToolExample<Input, Output>;
export const discreteIntegratorLeakPoleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/discrete-integrator-leak-pole",
    title: "Discrete Integrator Leak Pole Tool",
    description:
      "Return the forward-Euler pole of a supplied leaky integrator and its strict unit-circle stability flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leakRate: { type: "number", minimum: 0 },
        step: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["leakRate", "step"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pole: { type: "number" },
        asymptoticallyStable: { type: "boolean" },
      },
      required: ["pole", "asymptoticallyStable"],
    },
    ports: {
      inputs: [
        {
          id: "leakRate",
          label: "Leak Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "pole", label: "Pole", valueType: { type: "number" } },
        {
          id: "asymptoticallyStable",
          label: "Asymptotically Stable",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = discreteIntegratorLeakPoleTool.execute;
export default discreteIntegratorLeakPoleTool;
