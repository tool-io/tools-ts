import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectedDepth: number;
  readonly efficiency: number;
  readonly referenceDepth: number;
};
export type Output = {
  readonly correctedDepth: number;
  readonly referenceResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectedDepth: { type: "number", minimum: 0 },
    efficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    referenceDepth: { type: "number", minimum: 0 },
  },
  required: ["collectedDepth", "efficiency", "referenceDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedDepth: { type: "number" },
    referenceResidual: { type: "number" },
  },
  required: ["correctedDepth", "referenceResidual"],
} as const;
/** Calculate rainfall gauge catch efficiency factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectedDepth, efficiency, referenceDepth } = request;
  const compute = (): Output => {
    H.domain(
      collectedDepth >= 0 &&
        efficiency > 0 &&
        efficiency <= 1 &&
        referenceDepth >= 0,
    );
    return {
      correctedDepth: collectedDepth / efficiency,
      referenceResidual: collectedDepth / efficiency - referenceDepth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectedDepth: 8, efficiency: 0.8, referenceDepth: 12 },
  output: { correctedDepth: 10, referenceResidual: -2 },
} satisfies ToolExample<Input, Output>;
export const rainfallGaugeCatchEfficiencyFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/rainfall-gauge-catch-efficiency-factor",
    title: "Rainfall Gauge Catch Efficiency Factor Tool",
    description:
      "Calculate rainfall gauge catch efficiency factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectedDepth: { type: "number", minimum: 0 },
        efficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        referenceDepth: { type: "number", minimum: 0 },
      },
      required: ["collectedDepth", "efficiency", "referenceDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedDepth: { type: "number" },
        referenceResidual: { type: "number" },
      },
      required: ["correctedDepth", "referenceResidual"],
    },
    ports: {
      inputs: [
        {
          id: "collectedDepth",
          label: "Collected Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "efficiency",
          label: "Efficiency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDepth",
          label: "Reference Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedDepth",
          label: "Corrected Depth",
          valueType: { type: "number" },
        },
        {
          id: "referenceResidual",
          label: "Reference Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rainfallGaugeCatchEfficiencyFactorTool.execute;
export default rainfallGaugeCatchEfficiencyFactorTool;
