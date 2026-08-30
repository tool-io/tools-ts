import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  layerGeometry,
} from "../shared.js";
export type Input = Readonly<{
  readonly depthBoundariesM: readonly number[];
  readonly layerAreasM2: readonly number[];
  readonly layerDensitiesKgPerM3: readonly number[];
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly schmidtStabilityJPerM2: number;
  readonly volumeMeanDensityKgPerM3: number;
  readonly volumeCentroidDepthM: number;
}>;
const inputFields = [
  { id: "depthBoundariesM", label: "Depth boundaries m", kind: "numberList" },
  { id: "layerAreasM2", label: "Layer areas m2", kind: "numberList" },
  {
    id: "layerDensitiesKgPerM3",
    label: "Layer densities kg per m3",
    kind: "numberList",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.layerDensitiesKgPerM3.forEach((v) =>
    positive(v, "layerDensitiesKgPerM3"),
  );
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  aligned(input.layerAreasM2, input.layerDensitiesKgPerM3, "layerAreasM2");
  const g = layerGeometry(input.depthBoundariesM, input.layerAreasM2),
    v = g.volumes.reduce((a, b) => a + b, 0),
    volumeMeanDensityKgPerM3 =
      g.volumes.reduce((s, x, i) => s + x * input.layerDensitiesKgPerM3[i], 0) /
      v,
    volumeCentroidDepthM =
      g.volumes.reduce((s, x, i) => s + x * g.centers[i], 0) / v,
    schmidtStabilityJPerM2 =
      (input.gravityMPerSecondSquared / g.surfaceArea) *
      g.volumes.reduce(
        (s, x, i) =>
          s +
          x *
            (g.centers[i] - volumeCentroidDepthM) *
            (input.layerDensitiesKgPerM3[i] - volumeMeanDensityKgPerM3),
        0,
      );
  return {
    schmidtStabilityJPerM2,
    volumeMeanDensityKgPerM3,
    volumeCentroidDepthM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthBoundariesM: [0, 1, 2],
  layerAreasM2: [10, 10],
  layerDensitiesKgPerM3: [1000, 1002],
  gravityMPerSecondSquared: 10,
} satisfies Input;
export const exampleOutput = {
  schmidtStabilityJPerM2: 10,
  volumeMeanDensityKgPerM3: 1001,
  volumeCentroidDepthM: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/schmidt-stability-index",
  title: "Schmidt Stability Index",
  description:
    "Compute signed Schmidt potential-energy stability from piecewise-constant layer areas/densities and depth-positive-down centers; negative values indicate an inverted profile, not positive mixing energy.",
  inputs: inputFields,
  outputs: [
    {
      id: "schmidtStabilityJPerM2",
      label: "Schmidt stability j per m2",
      kind: "number",
    },
    {
      id: "volumeMeanDensityKgPerM3",
      label: "Volume mean density kg per m3",
      kind: "number",
    },
    {
      id: "volumeCentroidDepthM",
      label: "Volume centroid depth m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      depthBoundariesM: value.depthBoundariesM as readonly number[],
      layerAreasM2: value.layerAreasM2 as readonly number[],
      layerDensitiesKgPerM3: value.layerDensitiesKgPerM3 as readonly number[],
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
