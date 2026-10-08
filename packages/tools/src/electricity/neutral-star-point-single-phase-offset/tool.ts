import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly neutralPotentialVolts: number;
  readonly phasePotentialVolts: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    neutralPotentialVolts: { type: "number" },
    phasePotentialVolts: { type: "number" },
  },
  required: ["neutralPotentialVolts", "phasePotentialVolts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit neutral-point potential from a phase potential on the same scalar instantaneous reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { neutralPotentialVolts, phasePotentialVolts } = request;
  const compute = (): Output => {
    return { signedGap: phasePotentialVolts - neutralPotentialVolts };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { neutralPotentialVolts: 12, phasePotentialVolts: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const neutralStarPointSinglePhaseOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["electricity", "engineering"],
      keywords: ["electricity", "engineering"],
    },
    id: "electricity/neutral-star-point-single-phase-offset",
    title: "Neutral Star Point Single Phase Offset",
    description:
      "Subtract an explicit neutral-point potential from a phase potential on the same scalar instantaneous reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        neutralPotentialVolts: { type: "number" },
        phasePotentialVolts: { type: "number" },
      },
      required: ["neutralPotentialVolts", "phasePotentialVolts"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "neutralPotentialVolts",
          label: "Neutral Potential Volts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "phasePotentialVolts",
          label: "Phase Potential Volts",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = neutralStarPointSinglePhaseOffsetTool.execute;
export default neutralStarPointSinglePhaseOffsetTool;
