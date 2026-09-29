import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spikedMeasured: number;
  readonly unspikedMeasured: number;
  readonly spikeAdded: number;
};
export type Output = {
  readonly recovered: number;
  readonly recoveryFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spikedMeasured: { type: "number" },
    unspikedMeasured: { type: "number" },
    spikeAdded: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["spikedMeasured", "unspikedMeasured", "spikeAdded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recovered: { type: "number" },
    recoveryFraction: { type: "number" },
  },
  required: ["recovered", "recoveryFraction"],
} as const;
/** Spike recovery from matched concentration-basis observations; dilution and volume changes must already be accounted for. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spikedMeasured, unspikedMeasured, spikeAdded } = request;
  const compute = (): Output => {
    H.positive(spikeAdded);
    return {
      recovered: spikedMeasured - unspikedMeasured,
      recoveryFraction: (spikedMeasured - unspikedMeasured) / spikeAdded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { spikedMeasured: 30, unspikedMeasured: 10, spikeAdded: 25 },
  output: { recovered: 20, recoveryFraction: 0.8 },
} satisfies ToolExample<Input, Output>;
export const immunoassayStandardRecoveryRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/immunoassay-standard-recovery-ratio",
    title: "Immunoassay Standard Recovery Ratio Tool",
    description:
      "Spike recovery from matched concentration-basis observations; dilution and volume changes must already be accounted for.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spikedMeasured: { type: "number" },
        unspikedMeasured: { type: "number" },
        spikeAdded: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["spikedMeasured", "unspikedMeasured", "spikeAdded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recovered: { type: "number" },
        recoveryFraction: { type: "number" },
      },
      required: ["recovered", "recoveryFraction"],
    },
    ports: {
      inputs: [
        {
          id: "spikedMeasured",
          label: "Spiked Measured",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unspikedMeasured",
          label: "Unspiked Measured",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spikeAdded",
          label: "Spike Added",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "recovered", label: "Recovered", valueType: { type: "number" } },
        {
          id: "recoveryFraction",
          label: "Recovery Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = immunoassayStandardRecoveryRatioTool.execute;
export default immunoassayStandardRecoveryRatioTool;
