import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly disturbedPointFlags: readonly number[];
  readonly representedPointAreasM2: readonly number[];
  readonly callerMaximumDisturbedFraction: number;
}>;
export type Output = Readonly<{
  readonly areaWeightedSoilDisturbancePercent: number;
  readonly aboveCallerDisturbanceLimit: boolean;
}>;
const inputFields = [
  {
    id: "disturbedPointFlags",
    label: "Disturbed point flags",
    kind: "numberList",
  },
  {
    id: "representedPointAreasM2",
    label: "Represented point areas m2",
    kind: "numberList",
  },
  {
    id: "callerMaximumDisturbedFraction",
    label: "Caller maximum disturbed fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedPointAreasM2.forEach((v) =>
    positive(v, "representedPointAreasM2"),
  );
  fraction(
    input.callerMaximumDisturbedFraction,
    "callerMaximumDisturbedFraction",
  );
  input.disturbedPointFlags.forEach((v) => count(v, "disturbedPointFlags"));
  aligned(
    input.disturbedPointFlags,
    input.representedPointAreasM2,
    "disturbedPointFlags",
  );
  if (input.disturbedPointFlags.some((v) => v !== 0 && v !== 1))
    simpleError("flags", "Binary observed soil disturbance required.");
  const share =
    input.disturbedPointFlags.reduce(
      (s, v, i) => s + v * input.representedPointAreasM2[i],
      0,
    ) / input.representedPointAreasM2.reduce((a, b) => a + b, 0);
  return {
    areaWeightedSoilDisturbancePercent: 100 * share,
    aboveCallerDisturbanceLimit: share > input.callerMaximumDisturbedFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  disturbedPointFlags: [1, 0, 1],
  representedPointAreasM2: [1, 2, 3],
  callerMaximumDisturbedFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  areaWeightedSoilDisturbancePercent: 66.66666666666667,
  aboveCallerDisturbanceLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/site-preparation-scarification-soil-disturbance-percent",
  title: "Scarification Soil Disturbance Percent",
  description:
    "Audit observed scarification point disturbance with physical representation weights and caller upper limit; no beneficial soil-preparation assumption or ecological/regulatory suitability certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "areaWeightedSoilDisturbancePercent",
      label: "Area weighted soil disturbance percent",
      kind: "number",
    },
    {
      id: "aboveCallerDisturbanceLimit",
      label: "Above caller disturbance limit",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      disturbedPointFlags: value.disturbedPointFlags as readonly number[],
      representedPointAreasM2:
        value.representedPointAreasM2 as readonly number[],
      callerMaximumDisturbedFraction:
        value.callerMaximumDisturbedFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
