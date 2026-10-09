import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedGradient: number;
  readonly referenceGradient: number;
};
export type Output = { readonly gradientResidual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedGradient: { type: "number" },
    referenceGradient: { type: "number" },
  },
  required: ["observedGradient", "referenceGradient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gradientResidual: { type: "number" } },
  required: ["gradientResidual"],
} as const;
/** Subtract an explicit reference channel gradient without detecting or interpreting a knickpoint. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedGradient, referenceGradient } = request;
  const compute = (): Output => {
    return { gradientResidual: observedGradient - referenceGradient };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedGradient: 0.08, referenceGradient: 0.03 },
  output: { gradientResidual: 0.05 },
} satisfies ToolExample<Input, Output>;
export const riverKnickpointGradientResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geomorphology", "earth and environmental sciences"],
      keywords: ["geomorphology", "earth and environmental sciences"],
    },
    id: "geomorphology/river-knickpoint-gradient-residual",
    title: "River Knickpoint Gradient Residual",
    description:
      "Subtract an explicit reference channel gradient without detecting or interpreting a knickpoint.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedGradient: { type: "number" },
        referenceGradient: { type: "number" },
      },
      required: ["observedGradient", "referenceGradient"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gradientResidual: { type: "number" } },
      required: ["gradientResidual"],
    },
    ports: {
      inputs: [
        {
          id: "observedGradient",
          label: "Observed Gradient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceGradient",
          label: "Reference Gradient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "gradientResidual",
          label: "Gradient Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = riverKnickpointGradientResidualTool.execute;
export default riverKnickpointGradientResidualTool;
