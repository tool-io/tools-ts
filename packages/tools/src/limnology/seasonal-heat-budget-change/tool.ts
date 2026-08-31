import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly layerVolumesM3: readonly number[];
  readonly initialTemperaturesC: readonly number[];
  readonly finalTemperaturesC: readonly number[];
  readonly waterDensityKgM3: number;
  readonly heatCapacityJkgK: number;
  readonly matchedLakeAreaM2: number;
}>;
export type Output = Readonly<{
  readonly layerSeasonalHeatChangesJ: readonly number[];
  readonly signedTotalSeasonalHeatChangeJ: number;
  readonly signedSeasonalHeatChangeJm2: number;
}>;
const inputFields = [
  { id: "layerVolumesM3", label: "Layer volumes m3", kind: "numberList" },
  {
    id: "initialTemperaturesC",
    label: "Initial temperatures c",
    kind: "numberList",
  },
  {
    id: "finalTemperaturesC",
    label: "Final temperatures c",
    kind: "numberList",
  },
  { id: "waterDensityKgM3", label: "Water density kg m3", kind: "number" },
  { id: "heatCapacityJkgK", label: "Heat capacity jkg k", kind: "number" },
  { id: "matchedLakeAreaM2", label: "Matched lake area m2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.waterDensityKgM3, "waterDensityKgM3");
  positive(input.heatCapacityJkgK, "heatCapacityJkgK");
  positive(input.matchedLakeAreaM2, "matchedLakeAreaM2");
  input.layerVolumesM3.forEach((v) => nonnegative(v, "layerVolumesM3"));
  aligned(input.layerVolumesM3, input.initialTemperaturesC, "layerVolumesM3");
  aligned(input.layerVolumesM3, input.finalTemperaturesC, "layerVolumesM3");
  const changes = input.layerVolumesM3.map(
      (v, i) =>
        v *
        input.waterDensityKgM3 *
        input.heatCapacityJkgK *
        (input.finalTemperaturesC[i] - input.initialTemperaturesC[i]),
    ),
    total = sum(changes);
  return {
    layerSeasonalHeatChangesJ: changes,
    signedTotalSeasonalHeatChangeJ: total,
    signedSeasonalHeatChangeJm2: total / input.matchedLakeAreaM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  layerVolumesM3: [1, 2],
  initialTemperaturesC: [10, 10],
  finalTemperaturesC: [12, 9],
  waterDensityKgM3: 1000,
  heatCapacityJkgK: 4000,
  matchedLakeAreaM2: 10,
} satisfies Input;
export const exampleOutput = {
  layerSeasonalHeatChangesJ: [8000000, -8000000],
  signedTotalSeasonalHeatChangeJ: 0,
  signedSeasonalHeatChangeJm2: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/seasonal-heat-budget-change",
  title: "Seasonal Heat Budget Change Calculator",
  description:
    "Reconcile seasonal sensible-heat change on matched fixed layer volumes with independent before/after temperatures; not absolute reference heat-content calculator, latent heat or volume-change correction.",
  inputs: inputFields,
  outputs: [
    {
      id: "layerSeasonalHeatChangesJ",
      label: "Layer seasonal heat changes j",
      kind: "numberList",
    },
    {
      id: "signedTotalSeasonalHeatChangeJ",
      label: "Signed total seasonal heat change j",
      kind: "number",
    },
    {
      id: "signedSeasonalHeatChangeJm2",
      label: "Signed seasonal heat change jm2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      layerVolumesM3: value.layerVolumesM3 as readonly number[],
      initialTemperaturesC: value.initialTemperaturesC as readonly number[],
      finalTemperaturesC: value.finalTemperaturesC as readonly number[],
      waterDensityKgM3: value.waterDensityKgM3 as number,
      heatCapacityJkgK: value.heatCapacityJkgK as number,
      matchedLakeAreaM2: value.matchedLakeAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
