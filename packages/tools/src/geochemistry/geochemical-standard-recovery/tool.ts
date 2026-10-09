import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredValue: number;
  readonly certifiedValue: number;
};
export type Output = {
  readonly recoveryFraction: number;
  readonly signedDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredValue: { type: "number" },
    certifiedValue: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredValue", "certifiedValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recoveryFraction: { type: "number" },
    signedDifference: { type: "number" },
  },
  required: ["recoveryFraction", "signedDifference"],
} as const;
/** Compare a supplied measurement with an explicit positive reference value without selecting analytical acceptance limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredValue, certifiedValue } = request;
  const compute = (): Output => {
    (H.domain(certifiedValue > 0, "certifiedValue"), certifiedValue);
    return {
      recoveryFraction: measuredValue / certifiedValue,
      signedDifference: measuredValue - certifiedValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredValue: 9.5, certifiedValue: 10 },
  output: { recoveryFraction: 0.95, signedDifference: -0.5 },
} satisfies ToolExample<Input, Output>;
export const geochemicalStandardRecoveryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geochemistry", "chemistry"],
      keywords: ["geochemistry", "chemistry"],
    },
    id: "geochemistry/geochemical-standard-recovery",
    title: "Geochemical Standard Recovery",
    description:
      "Compare a supplied measurement with an explicit positive reference value without selecting analytical acceptance limits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredValue: { type: "number" },
        certifiedValue: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredValue", "certifiedValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recoveryFraction: { type: "number" },
        signedDifference: { type: "number" },
      },
      required: ["recoveryFraction", "signedDifference"],
    },
    ports: {
      inputs: [
        {
          id: "measuredValue",
          label: "Measured Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "certifiedValue",
          label: "Certified Value",
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
          id: "signedDifference",
          label: "Signed Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = geochemicalStandardRecoveryTool.execute;
export default geochemicalStandardRecoveryTool;
