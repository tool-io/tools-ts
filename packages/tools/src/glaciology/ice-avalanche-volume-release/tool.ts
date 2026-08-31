import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly releasePatchAreasM2: readonly number[];
  readonly detachedThicknessesM: readonly number[];
  readonly observedDetachedFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly detachedPatchVolumesM3: readonly number[];
  readonly totalDetachedVolumeM3: number;
}>;
const inputFields = [
  {
    id: "releasePatchAreasM2",
    label: "Release patch areas m2",
    kind: "numberList",
  },
  {
    id: "detachedThicknessesM",
    label: "Detached thicknesses m",
    kind: "numberList",
  },
  {
    id: "observedDetachedFractions",
    label: "Observed detached fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.releasePatchAreasM2.forEach((v) =>
    nonnegative(v, "releasePatchAreasM2"),
  );
  input.detachedThicknessesM.forEach((v) =>
    nonnegative(v, "detachedThicknessesM"),
  );
  input.observedDetachedFractions.forEach((v) =>
    fraction(v, "observedDetachedFractions"),
  );
  aligned(
    input.releasePatchAreasM2,
    input.detachedThicknessesM,
    "releasePatchAreasM2",
  );
  aligned(
    input.releasePatchAreasM2,
    input.observedDetachedFractions,
    "releasePatchAreasM2",
  );
  const volumes = input.releasePatchAreasM2.map(
    (a, i) =>
      a * input.detachedThicknessesM[i] * input.observedDetachedFractions[i],
  );
  return {
    detachedPatchVolumesM3: volumes,
    totalDetachedVolumeM3: sum(volumes),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  releasePatchAreasM2: [10, 20],
  detachedThicknessesM: [2, 3],
  observedDetachedFractions: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  detachedPatchVolumesM3: [10, 60],
  totalDetachedVolumeM3: 70,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/ice-avalanche-volume-release",
  title: "Ice Avalanche Volume Release Calculator",
  description:
    "Inventory observed detached avalanche patches under explicit release fractions, not a predicted probability of release or runout/hazard calculation.",
  inputs: inputFields,
  outputs: [
    {
      id: "detachedPatchVolumesM3",
      label: "Detached patch volumes m3",
      kind: "numberList",
    },
    {
      id: "totalDetachedVolumeM3",
      label: "Total detached volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      releasePatchAreasM2: value.releasePatchAreasM2 as readonly number[],
      detachedThicknessesM: value.detachedThicknessesM as readonly number[],
      observedDetachedFractions:
        value.observedDetachedFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
