import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, fraction, count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly plaqueCounts: readonly number[];
  readonly inoculumVolumesMl: readonly number[];
  readonly dilutionFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly pooledPfuPerMl: number;
  readonly platePfuPerMl: readonly number[];
  readonly totalPlaques: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.plaqueCounts, input.inoculumVolumesMl, "plaqueCounts");
  aligned(input.plaqueCounts, input.dilutionFractions, "plaqueCounts");
  let exposure = 0;
  const platePfuPerMl = input.plaqueCounts.map((v, i) => {
      count(v, "plaqueCounts");
      positive(input.inoculumVolumesMl[i], "inoculumVolumesMl");
      fraction(input.dilutionFractions[i], "dilutionFractions");
      positive(input.dilutionFractions[i], "dilutionFractions");
      const effectiveVolume =
        input.inoculumVolumesMl[i] * input.dilutionFractions[i];
      exposure += effectiveVolume;
      return v / effectiveVolume;
    }),
    totalPlaques = input.plaqueCounts.reduce((a, b) => a + b, 0);
  return {
    pooledPfuPerMl: totalPlaques / exposure,
    platePfuPerMl,
    totalPlaques,
  };
};
export const exampleInput = {
  plaqueCounts: [10, 20],
  inoculumVolumesMl: [0.1, 0.1],
  dilutionFractions: [0.01, 0.01],
} satisfies Input;
export const exampleOutput = {
  pooledPfuPerMl: 15000,
  platePfuPerMl: [10000, 20000],
  totalPlaques: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/replicate-plaque-assay-titer",
  title: "Replicate Plaque Assay Titer",
  description:
    "Estimate infectious plaque titer from effective-volume-weighted replicate plates, retaining individual plate estimates.",
  inputs: [
    { id: "plaqueCounts", label: "Plaque counts", kind: "numberList" },
    {
      id: "inoculumVolumesMl",
      label: "Inoculum volumes ml",
      kind: "numberList",
    },
    {
      id: "dilutionFractions",
      label: "Dilution fractions",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "pooledPfuPerMl", label: "Pooled pfu per ml", kind: "number" },
    { id: "platePfuPerMl", label: "Plate pfu per ml", kind: "numberList" },
    { id: "totalPlaques", label: "Total plaques", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      plaqueCounts: value.plaqueCounts as readonly number[],
      inoculumVolumesMl: value.inoculumVolumesMl as readonly number[],
      dilutionFractions: value.dilutionFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
