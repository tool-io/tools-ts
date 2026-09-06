import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerSectionAreasM2: readonly number[];
  readonly observedUpperLayerSeawardVelocityMSecond: readonly number[];
  readonly callerMatchedFreshwaterResidualVelocityMSecond: readonly number[];
}>;
export type Output = Readonly<{
  readonly areaWeightedEstuarineCirculationRatioUe: number;
}>;
const inputFields = [
  {
    id: "callerSectionAreasM2",
    label: "Caller section areas m2",
    kind: "numberList",
  },
  {
    id: "observedUpperLayerSeawardVelocityMSecond",
    label: "Observed upper layer seaward velocity m second",
    kind: "numberList",
  },
  {
    id: "callerMatchedFreshwaterResidualVelocityMSecond",
    label: "Caller matched freshwater residual velocity m second",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerSectionAreasM2.forEach((v) =>
    positive(v, "callerSectionAreasM2"),
  );
  input.callerMatchedFreshwaterResidualVelocityMSecond.forEach((v) =>
    positive(v, "callerMatchedFreshwaterResidualVelocityMSecond"),
  );
  aligned(
    input.callerSectionAreasM2,
    input.observedUpperLayerSeawardVelocityMSecond,
    "callerSectionAreasM2",
  );
  aligned(
    input.callerSectionAreasM2,
    input.callerMatchedFreshwaterResidualVelocityMSecond,
    "callerSectionAreasM2",
  );
  return {
    areaWeightedEstuarineCirculationRatioUe:
      sum(
        input.callerSectionAreasM2.map(
          (v, i) => v * input.observedUpperLayerSeawardVelocityMSecond[i],
        ),
      ) /
      sum(
        input.callerSectionAreasM2.map(
          (v, i) => v * input.callerMatchedFreshwaterResidualVelocityMSecond[i],
        ),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSectionAreasM2: [1, 2],
  observedUpperLayerSeawardVelocityMSecond: [2, 1],
  callerMatchedFreshwaterResidualVelocityMSecond: [0.5, 0.5],
} satisfies Input;
export const exampleOutput = {
  areaWeightedEstuarineCirculationRatioUe: 2.6666666666666665,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/estuarine-circulation-ratio-ue",
  title: "Estuarine Circulation Ratio UE Calculator",
  description:
    "Hansen–Rattray style surface/residual velocity ratio over actual weighted sections, signed velocity retained; no inferred two-layer salt balance. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "areaWeightedEstuarineCirculationRatioUe",
      label: "Area weighted estuarine circulation ratio ue",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSectionAreasM2: value.callerSectionAreasM2 as readonly number[],
      observedUpperLayerSeawardVelocityMSecond:
        value.observedUpperLayerSeawardVelocityMSecond as readonly number[],
      callerMatchedFreshwaterResidualVelocityMSecond:
        value.callerMatchedFreshwaterResidualVelocityMSecond as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
