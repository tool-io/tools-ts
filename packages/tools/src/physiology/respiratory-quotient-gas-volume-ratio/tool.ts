import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly carbonDioxideVolume: number;
  readonly oxygenVolume: number;
  readonly co2Correction: number;
  readonly oxygenCorrection: number;
};
export type Output = {
  readonly correctedCo2: number;
  readonly correctedOxygen: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    carbonDioxideVolume: { type: "number", minimum: 0 },
    oxygenVolume: { type: "number", exclusiveMinimum: 0 },
    co2Correction: { type: "number", exclusiveMinimum: 0 },
    oxygenCorrection: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "carbonDioxideVolume",
    "oxygenVolume",
    "co2Correction",
    "oxygenCorrection",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedCo2: { type: "number" },
    correctedOxygen: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["correctedCo2", "correctedOxygen", "ratio"],
} as const;
/** CO2/O2 ratio with explicit matched gas-condition correction factors; no substrate oxidation or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { carbonDioxideVolume, oxygenVolume, co2Correction, oxygenCorrection } =
    request;
  const compute = (): Output => {
    H.domain(carbonDioxideVolume >= 0);
    H.positive(oxygenVolume);
    H.positive(co2Correction);
    H.positive(oxygenCorrection);
    return {
      correctedCo2: carbonDioxideVolume * co2Correction,
      correctedOxygen: oxygenVolume * oxygenCorrection,
      ratio:
        (carbonDioxideVolume * co2Correction) /
        (oxygenVolume * oxygenCorrection),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    carbonDioxideVolume: 200,
    oxygenVolume: 250,
    co2Correction: 1,
    oxygenCorrection: 1,
  },
  output: { correctedCo2: 200, correctedOxygen: 250, ratio: 0.8 },
} satisfies ToolExample<Input, Output>;
export const respiratoryQuotientGasVolumeRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/respiratory-quotient-gas-volume-ratio",
    title: "Respiratory Quotient Gas Volume Ratio Tool",
    description:
      "CO2/O2 ratio with explicit matched gas-condition correction factors; no substrate oxidation or clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        carbonDioxideVolume: { type: "number", minimum: 0 },
        oxygenVolume: { type: "number", exclusiveMinimum: 0 },
        co2Correction: { type: "number", exclusiveMinimum: 0 },
        oxygenCorrection: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "carbonDioxideVolume",
        "oxygenVolume",
        "co2Correction",
        "oxygenCorrection",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedCo2: { type: "number" },
        correctedOxygen: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["correctedCo2", "correctedOxygen", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "carbonDioxideVolume",
          label: "Carbon Dioxide Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oxygenVolume",
          label: "Oxygen Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "co2Correction",
          label: "Co2Correction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oxygenCorrection",
          label: "Oxygen Correction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedCo2",
          label: "Corrected Co2",
          valueType: { type: "number" },
        },
        {
          id: "correctedOxygen",
          label: "Corrected Oxygen",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = respiratoryQuotientGasVolumeRatioTool.execute;
export default respiratoryQuotientGasVolumeRatioTool;
