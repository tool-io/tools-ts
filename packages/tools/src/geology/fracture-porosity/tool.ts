import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly fractureAreasM2: readonly number[];
  readonly openAperturesM: readonly number[];
  readonly independentOverlapVolumeM3: number;
  readonly bulkVolumeM3: number;
}>;
export type Output = Readonly<{ readonly fracturePorosity: number }>;
const inputFields = [
  { id: "fractureAreasM2", label: "Fracture areas m2", kind: "numberList" },
  { id: "openAperturesM", label: "Open apertures m", kind: "numberList" },
  {
    id: "independentOverlapVolumeM3",
    label: "Independent overlap volume m3",
    kind: "number",
  },
  { id: "bulkVolumeM3", label: "Bulk volume m3", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.fractureAreasM2.forEach((v) => positive(v, "fractureAreasM2"));
  positive(input.bulkVolumeM3, "bulkVolumeM3");
  input.openAperturesM.forEach((v) => nonnegative(v, "openAperturesM"));
  nonnegative(input.independentOverlapVolumeM3, "independentOverlapVolumeM3");
  aligned(input.fractureAreasM2, input.openAperturesM, "fractureAreasM2");
  const v = nonnegative(
      sum(input.fractureAreasM2.map((a, i) => a * input.openAperturesM[i])) -
        input.independentOverlapVolumeM3,
      "unique voids",
    ),
    f = v / input.bulkVolumeM3;
  fraction(f, "porosity");
  return { fracturePorosity: f };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fractureAreasM2: [1, 2],
  openAperturesM: [0.01, 0.02],
  independentOverlapVolumeM3: 0.005,
  bulkVolumeM3: 1,
} satisfies Input;
export const exampleOutput = { fracturePorosity: 0.045 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/fracture-porosity",
  title: "Geology Fracture Porosity Calculator",
  description:
    "Actual area×aperture fracture inventory with mapped overlap subtraction, not inferred permeability. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "fracturePorosity", label: "Fracture porosity", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      fractureAreasM2: value.fractureAreasM2 as readonly number[],
      openAperturesM: value.openAperturesM as readonly number[],
      independentOverlapVolumeM3: value.independentOverlapVolumeM3 as number,
      bulkVolumeM3: value.bulkVolumeM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
