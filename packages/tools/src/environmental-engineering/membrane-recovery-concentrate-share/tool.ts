import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feedVolume: number;
  readonly permeateVolume: number;
};
export type Output = {
  readonly recoveryFraction: number;
  readonly concentrateVolume: number;
  readonly concentrateFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedVolume: { type: "number", exclusiveMinimum: 0 },
    permeateVolume: { type: "number", minimum: 0 },
  },
  required: ["feedVolume", "permeateVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recoveryFraction: { type: "number" },
    concentrateVolume: { type: "number" },
    concentrateFraction: { type: "number" },
  },
  required: ["recoveryFraction", "concentrateVolume", "concentrateFraction"],
} as const;
/** Partition measured feed volume into permeate and concentrate assuming a closed additive-volume balance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { feedVolume, permeateVolume } = request;
  const compute = (): Output => {
    (H.domain(feedVolume > 0, "feedVolume"), feedVolume);
    H.domain(
      permeateVolume >= 0 && permeateVolume <= feedVolume,
      "permeateVolume",
    );
    return {
      recoveryFraction: permeateVolume / feedVolume,
      concentrateVolume: feedVolume - permeateVolume,
      concentrateFraction: (feedVolume - permeateVolume) / feedVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { feedVolume: 100, permeateVolume: 75 },
  output: {
    recoveryFraction: 0.75,
    concentrateVolume: 25,
    concentrateFraction: 0.25,
  },
} satisfies ToolExample<Input, Output>;
export const membraneRecoveryConcentrateShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "environmental-engineering",
        "environmental engineering",
        "engineering",
      ],
      keywords: ["environmental engineering", "engineering"],
    },
    id: "environmental-engineering/membrane-recovery-concentrate-share",
    title: "Membrane Recovery Concentrate Share",
    description:
      "Partition measured feed volume into permeate and concentrate assuming a closed additive-volume balance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        feedVolume: { type: "number", exclusiveMinimum: 0 },
        permeateVolume: { type: "number", minimum: 0 },
      },
      required: ["feedVolume", "permeateVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recoveryFraction: { type: "number" },
        concentrateVolume: { type: "number" },
        concentrateFraction: { type: "number" },
      },
      required: [
        "recoveryFraction",
        "concentrateVolume",
        "concentrateFraction",
      ],
    },
    ports: {
      inputs: [
        {
          id: "feedVolume",
          label: "Feed Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "permeateVolume",
          label: "Permeate Volume",
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
          id: "concentrateVolume",
          label: "Concentrate Volume",
          valueType: { type: "number" },
        },
        {
          id: "concentrateFraction",
          label: "Concentrate Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = membraneRecoveryConcentrateShareTool.execute;
export default membraneRecoveryConcentrateShareTool;
