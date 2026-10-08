import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recoveredLength: number;
  readonly drilledInterval: number;
};
export type Output = {
  readonly recoveryFraction: number;
  readonly excessRecoveredLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recoveredLength: { type: "number", minimum: 0 },
    drilledInterval: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recoveredLength", "drilledInterval"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recoveryFraction: { type: "number" },
    excessRecoveredLength: { type: "number" },
  },
  required: ["recoveryFraction", "excessRecoveredLength"],
} as const;
/** Compare explicit recovered core length with drilled interval, retaining apparent recovery above unity for review. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recoveredLength, drilledInterval } = request;
  const compute = (): Output => {
    H.domain(recoveredLength >= 0, "recoveredLength");
    (H.domain(drilledInterval > 0, "drilledInterval"), drilledInterval);
    return {
      recoveryFraction: recoveredLength / drilledInterval,
      excessRecoveredLength: Math.max(0, recoveredLength - drilledInterval),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recoveredLength: 8, drilledInterval: 10 },
  output: { recoveryFraction: 0.8, excessRecoveredLength: 0 },
} satisfies ToolExample<Input, Output>;
export const geologicCoreRecoveryFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "earth-science",
        "earth science",
        "earth and environmental sciences",
      ],
      keywords: ["earth science", "earth and environmental sciences"],
    },
    id: "earth-science/geologic-core-recovery-fraction",
    title: "Geologic Core Recovery Fraction",
    description:
      "Compare explicit recovered core length with drilled interval, retaining apparent recovery above unity for review.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recoveredLength: { type: "number", minimum: 0 },
        drilledInterval: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recoveredLength", "drilledInterval"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recoveryFraction: { type: "number" },
        excessRecoveredLength: { type: "number" },
      },
      required: ["recoveryFraction", "excessRecoveredLength"],
    },
    ports: {
      inputs: [
        {
          id: "recoveredLength",
          label: "Recovered Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drilledInterval",
          label: "Drilled Interval",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recoveryFraction",
          label: "Recovery Fraction",
          valueType: { type: "number" },
        },
        {
          id: "excessRecoveredLength",
          label: "Excess Recovered Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = geologicCoreRecoveryFractionTool.execute;
export default geologicCoreRecoveryFractionTool;
