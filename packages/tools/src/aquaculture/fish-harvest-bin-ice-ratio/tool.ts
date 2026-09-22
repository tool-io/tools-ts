import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fishMass: number;
  readonly iceToFishRatio: number;
  readonly binTare: number;
};
export type Output = { readonly iceMass: number; readonly loadedMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fishMass: { type: "number", minimum: 0 },
    iceToFishRatio: { type: "number", minimum: 0 },
    binTare: { type: "number", minimum: 0 },
  },
  required: ["fishMass", "iceToFishRatio", "binTare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { iceMass: { type: "number" }, loadedMass: { type: "number" } },
  required: ["iceMass", "loadedMass"],
} as const;
/** Apply an explicitly supplied ice ratio without selecting a storage or temperature-control standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fishMass, iceToFishRatio, binTare } = request;
  const compute = (): Output => {
    H.domain(fishMass >= 0 && iceToFishRatio >= 0 && binTare >= 0);
    return {
      iceMass: fishMass * iceToFishRatio,
      loadedMass: fishMass * (1 + iceToFishRatio) + binTare,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fishMass: 100, iceToFishRatio: 0.5, binTare: 10 },
  output: { iceMass: 50, loadedMass: 160 },
} satisfies ToolExample<Input, Output>;
export const fishHarvestBinIceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/fish-harvest-bin-ice-ratio",
    title: "Fish Harvest Bin Ice Ratio Tool",
    description:
      "Apply an explicitly supplied ice ratio without selecting a storage or temperature-control standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fishMass: { type: "number", minimum: 0 },
        iceToFishRatio: { type: "number", minimum: 0 },
        binTare: { type: "number", minimum: 0 },
      },
      required: ["fishMass", "iceToFishRatio", "binTare"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        iceMass: { type: "number" },
        loadedMass: { type: "number" },
      },
      required: ["iceMass", "loadedMass"],
    },
    ports: {
      inputs: [
        {
          id: "fishMass",
          label: "Fish Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "iceToFishRatio",
          label: "Ice To Fish Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "binTare",
          label: "Bin Tare",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "iceMass", label: "Ice Mass", valueType: { type: "number" } },
        {
          id: "loadedMass",
          label: "Loaded Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fishHarvestBinIceRatioTool.execute;
export default fishHarvestBinIceRatioTool;
