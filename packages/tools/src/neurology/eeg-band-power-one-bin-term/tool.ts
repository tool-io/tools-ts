import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly powerDensity: number;
  readonly binWidthHz: number;
  readonly overlapFraction: number;
  readonly totalBandPower: number;
};
export type Output = {
  readonly binContribution: number;
  readonly relativeBandContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    powerDensity: { type: "number", minimum: 0 },
    binWidthHz: { type: "number", minimum: 0 },
    overlapFraction: { type: "number", minimum: 0, maximum: 1 },
    totalBandPower: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["powerDensity", "binWidthHz", "overlapFraction", "totalBandPower"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    binContribution: { type: "number" },
    relativeBandContribution: { type: "number" },
  },
  required: ["binContribution", "relativeBandContribution"],
} as const;
/** One PSD-bin overlap contribution with a supplied total-power denominator, without EEG feature classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { powerDensity, binWidthHz, overlapFraction, totalBandPower } = request;
  const compute = (): Output => {
    H.domain(powerDensity >= 0 && binWidthHz >= 0);
    H.probability(overlapFraction);
    H.positive(totalBandPower);
    return {
      binContribution: powerDensity * binWidthHz * overlapFraction,
      relativeBandContribution:
        (powerDensity * binWidthHz * overlapFraction) / totalBandPower,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    powerDensity: 2,
    binWidthHz: 0.5,
    overlapFraction: 0.8,
    totalBandPower: 10,
  },
  output: { binContribution: 0.8, relativeBandContribution: 0.08 },
} satisfies ToolExample<Input, Output>;
export const eegBandPowerOneBinTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/eeg-band-power-one-bin-term",
    title: "EEG Band Power One Bin Term Tool",
    description:
      "One PSD-bin overlap contribution with a supplied total-power denominator, without EEG feature classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        powerDensity: { type: "number", minimum: 0 },
        binWidthHz: { type: "number", minimum: 0 },
        overlapFraction: { type: "number", minimum: 0, maximum: 1 },
        totalBandPower: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "powerDensity",
        "binWidthHz",
        "overlapFraction",
        "totalBandPower",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        binContribution: { type: "number" },
        relativeBandContribution: { type: "number" },
      },
      required: ["binContribution", "relativeBandContribution"],
    },
    ports: {
      inputs: [
        {
          id: "powerDensity",
          label: "Power Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "binWidthHz",
          label: "Bin Width Hz",
          required: true,
          valueType: { type: "number", unit: "Hz" },
        },
        {
          id: "overlapFraction",
          label: "Overlap Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalBandPower",
          label: "Total Band Power",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "binContribution",
          label: "Bin Contribution",
          valueType: { type: "number" },
        },
        {
          id: "relativeBandContribution",
          label: "Relative Band Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = eegBandPowerOneBinTermTool.execute;
export default eegBandPowerOneBinTermTool;
