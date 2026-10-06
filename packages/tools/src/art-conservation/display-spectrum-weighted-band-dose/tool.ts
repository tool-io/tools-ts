import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bandIrradiances: readonly number[];
  readonly sensitivityWeights: readonly number[];
  readonly exposureHours: number;
};
export type Output = { readonly weightedDose: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bandIrradiances: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    sensitivityWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    exposureHours: { type: "number", minimum: 0 },
  },
  required: ["bandIrradiances", "sensitivityWeights", "exposureHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedDose: { type: "number" } },
  required: ["weightedDose"],
} as const;
/** Integrate explicit band irradiances with caller-supplied nonnegative sensitivity weights over constant exposure hours; weights define the resulting dose scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bandIrradiances, sensitivityWeights, exposureHours } = request;
  const compute = (): Output => {
    H.domain(
      bandIrradiances.length === sensitivityWeights.length,
      "sensitivityWeights",
    );
    H.domain(exposureHours >= 0, "exposureHours");
    bandIrradiances.forEach((v) => H.domain(v >= 0, "bandIrradiances"));
    sensitivityWeights.forEach((v) => H.domain(v >= 0, "sensitivityWeights"));
    return {
      weightedDose:
        bandIrradiances.reduce((a, v, i) => a + v * sensitivityWeights[i], 0) *
        exposureHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bandIrradiances: [2, 3],
    sensitivityWeights: [0.5, 2],
    exposureHours: 4,
  },
  output: { weightedDose: 28 },
} satisfies ToolExample<Input, Output>;
export const displaySpectrumWeightedBandDoseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-conservation", "art conservation", "arts and design"],
      keywords: ["art conservation", "arts and design"],
    },
    id: "art-conservation/display-spectrum-weighted-band-dose",
    title: "Display Spectrum Weighted Band Dose",
    description:
      "Integrate explicit band irradiances with caller-supplied nonnegative sensitivity weights over constant exposure hours; weights define the resulting dose scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bandIrradiances: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        sensitivityWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        exposureHours: { type: "number", minimum: 0 },
      },
      required: ["bandIrradiances", "sensitivityWeights", "exposureHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weightedDose: { type: "number" } },
      required: ["weightedDose"],
    },
    ports: {
      inputs: [
        {
          id: "bandIrradiances",
          label: "Band Irradiances",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sensitivityWeights",
          label: "Sensitivity Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "exposureHours",
          label: "Exposure Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedDose",
          label: "Weighted Dose",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = displaySpectrumWeightedBandDoseTool.execute;
export default displaySpectrumWeightedBandDoseTool;
