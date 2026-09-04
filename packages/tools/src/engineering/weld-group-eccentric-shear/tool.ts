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
  aligned,
  sum,
  shape,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedWeldPatchAreasM2: readonly number[];
  readonly observedWeldPatchCentersXyM: readonly (readonly number[])[];
  readonly directForceXyN: readonly number[];
  readonly eccentricMomentNm: number;
}>;
export type Output = Readonly<{
  readonly patchShearTractionsPa: readonly (readonly number[])[];
  readonly maximumPatchTractionPa: number;
}>;
const inputFields = [
  {
    id: "observedWeldPatchAreasM2",
    label: "Observed weld patch areas m2",
    kind: "numberList",
  },
  {
    id: "observedWeldPatchCentersXyM",
    label: "Observed weld patch centers xy m",
    kind: "matrix",
  },
  { id: "directForceXyN", label: "Direct force xy n", kind: "numberList" },
  { id: "eccentricMomentNm", label: "Eccentric moment nm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedWeldPatchAreasM2.forEach((v) =>
    positive(v, "observedWeldPatchAreasM2"),
  );
  if (
    shape(input.observedWeldPatchCentersXyM, "patches") !== 2 ||
    input.directForceXyN.length !== 2
  )
    simpleError("XY", "Actual local planar patch centers and loadXY.");
  aligned(
    input.observedWeldPatchAreasM2,
    input.observedWeldPatchCentersXyM,
    "patches",
  );
  const total = sum(input.observedWeldPatchAreasM2),
    cx =
      sum(
        input.observedWeldPatchCentersXyM.map(
          (p, i) => p[0] * input.observedWeldPatchAreasM2[i],
        ),
      ) / total,
    cy =
      sum(
        input.observedWeldPatchCentersXyM.map(
          (p, i) => p[1] * input.observedWeldPatchAreasM2[i],
        ),
      ) / total,
    J = sum(
      input.observedWeldPatchCentersXyM.map(
        (p, i) =>
          input.observedWeldPatchAreasM2[i] *
          ((p[0] - cx) ** 2 + (p[1] - cy) ** 2),
      ),
    );
  positive(J, "polar area centroid sum");
  const tractions = input.observedWeldPatchCentersXyM.map(([x, y]) => [
    input.directForceXyN[0] / total - (input.eccentricMomentNm * (y - cy)) / J,
    input.directForceXyN[1] / total + (input.eccentricMomentNm * (x - cx)) / J,
  ]);
  return {
    patchShearTractionsPa: tractions,
    maximumPatchTractionPa: Math.max(...tractions.map((p) => Math.hypot(...p))),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWeldPatchAreasM2: [1, 1],
  observedWeldPatchCentersXyM: [
    [-1, 0],
    [1, 0],
  ],
  directForceXyN: [0, 2],
  eccentricMomentNm: 2,
} satisfies Input;
export const exampleOutput = {
  patchShearTractionsPa: [
    [0, 0],
    [0, 2],
  ],
  maximumPatchTractionPa: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/weld-group-eccentric-shear",
  title: "Eccentric Weld Group Shear Calculator",
  description:
    "Elastic eccentric shear over independently measured discrete weld throat patches, direct plus centroid moment, not continuous-weld stress concentration or capacity. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "patchShearTractionsPa",
      label: "Patch shear tractions pa",
      kind: "matrix",
    },
    {
      id: "maximumPatchTractionPa",
      label: "Maximum patch traction pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWeldPatchAreasM2:
        value.observedWeldPatchAreasM2 as readonly number[],
      observedWeldPatchCentersXyM:
        value.observedWeldPatchCentersXyM as readonly (readonly number[])[],
      directForceXyN: value.directForceXyN as readonly number[],
      eccentricMomentNm: value.eccentricMomentNm as number,
    }),
});
export const run = tool.execute;
export default tool;
