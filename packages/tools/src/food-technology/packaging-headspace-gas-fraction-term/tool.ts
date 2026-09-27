import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly headspaceVolume: number;
  readonly gasFraction: number;
  readonly totalPressure: number;
};
export type Output = {
  readonly gasVolumeEquivalent: number;
  readonly partialPressure: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headspaceVolume: { type: "number", minimum: 0 },
    gasFraction: { type: "number", minimum: 0, maximum: 1 },
    totalPressure: { type: "number", minimum: 0 },
  },
  required: ["headspaceVolume", "gasFraction", "totalPressure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gasVolumeEquivalent: { type: "number" },
    partialPressure: { type: "number" },
  },
  required: ["gasVolumeEquivalent", "partialPressure"],
} as const;
/** Calculate packaging headspace gas fraction term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { headspaceVolume, gasFraction, totalPressure } = request;
  const compute = (): Output => {
    H.domain(headspaceVolume >= 0 && totalPressure >= 0);
    H.probability(gasFraction);
    return {
      gasVolumeEquivalent: headspaceVolume * gasFraction,
      partialPressure: totalPressure * gasFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { headspaceVolume: 100, gasFraction: 0.2, totalPressure: 100 },
  output: { gasVolumeEquivalent: 20, partialPressure: 20 },
} satisfies ToolExample<Input, Output>;
export const packagingHeadspaceGasFractionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/packaging-headspace-gas-fraction-term",
    title: "Packaging Headspace Gas Fraction Term Tool",
    description:
      "Calculate packaging headspace gas fraction term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headspaceVolume: { type: "number", minimum: 0 },
        gasFraction: { type: "number", minimum: 0, maximum: 1 },
        totalPressure: { type: "number", minimum: 0 },
      },
      required: ["headspaceVolume", "gasFraction", "totalPressure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gasVolumeEquivalent: { type: "number" },
        partialPressure: { type: "number" },
      },
      required: ["gasVolumeEquivalent", "partialPressure"],
    },
    ports: {
      inputs: [
        {
          id: "headspaceVolume",
          label: "Headspace Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gasFraction",
          label: "Gas Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "totalPressure",
          label: "Total Pressure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "gasVolumeEquivalent",
          label: "Gas Volume Equivalent",
          valueType: { type: "number" },
        },
        {
          id: "partialPressure",
          label: "Partial Pressure",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = packagingHeadspaceGasFractionTermTool.execute;
export default packagingHeadspaceGasFractionTermTool;
