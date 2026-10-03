import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly co2Fractions: readonly number[];
  readonly flowVolumes: readonly number[];
};
export type Output = {
  readonly volumeWeightedCo2: number;
  readonly exhaledVolume: number;
  readonly meanFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    co2Fractions: { type: "array", maxItems: 256, items: { type: "number" } },
    flowVolumes: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["co2Fractions", "flowVolumes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumeWeightedCo2: { type: "number" },
    exhaledVolume: { type: "number" },
    meanFraction: { type: "number" },
  },
  required: ["volumeWeightedCo2", "exhaledVolume", "meanFraction"],
} as const;
/** One supplied volume-binned breath CO2 integral with fractions on a coherent gas-condition basis, without capnogram segmentation or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { co2Fractions, flowVolumes } = request;
  const compute = (): Output => {
    H.sameLength(co2Fractions, flowVolumes);
    H.domain(
      co2Fractions.every((x) => x >= 0 && x <= 1) &&
        flowVolumes.every((x) => x >= 0) &&
        flowVolumes.reduce((a, b) => a + b, 0) > 0,
    );
    return {
      volumeWeightedCo2: H.dot(co2Fractions, flowVolumes),
      exhaledVolume: flowVolumes.reduce((a, b) => a + b, 0),
      meanFraction:
        H.dot(co2Fractions, flowVolumes) /
        flowVolumes.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { co2Fractions: [0.02, 0.04], flowVolumes: [100, 300] },
  output: { volumeWeightedCo2: 14, exhaledVolume: 400, meanFraction: 0.035 },
} satisfies ToolExample<Input, Output>;
export const capnogramOneBreathAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/capnogram-one-breath-area-term",
    title: "Capnogram One Breath Area Term Tool",
    description:
      "One supplied volume-binned breath CO2 integral with fractions on a coherent gas-condition basis, without capnogram segmentation or clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        co2Fractions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        flowVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["co2Fractions", "flowVolumes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumeWeightedCo2: { type: "number" },
        exhaledVolume: { type: "number" },
        meanFraction: { type: "number" },
      },
      required: ["volumeWeightedCo2", "exhaledVolume", "meanFraction"],
    },
    ports: {
      inputs: [
        {
          id: "co2Fractions",
          label: "Co2Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "flowVolumes",
          label: "Flow Volumes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "volumeWeightedCo2",
          label: "Volume Weighted Co2",
          valueType: { type: "number" },
        },
        {
          id: "exhaledVolume",
          label: "Exhaled Volume",
          valueType: { type: "number" },
        },
        {
          id: "meanFraction",
          label: "Mean Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = capnogramOneBreathAreaTermTool.execute;
export default capnogramOneBreathAreaTermTool;
