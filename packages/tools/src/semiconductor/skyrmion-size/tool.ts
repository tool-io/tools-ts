import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  crossings,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedSkyrmionRadialDistancesNm: readonly number[];
  readonly observedOutOfPlaneMagnetization: readonly number[];
  readonly callerDomainBoundaryMagnetization: number;
}>;
export type Output = Readonly<{
  readonly observedSkyrmionBoundaryRadiiNm: readonly number[];
  readonly observedSkyrmionDiametersNm: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSkyrmionRadialDistancesNm",
    label: "Observed skyrmion radial distances nm",
    kind: "numberList",
  },
  {
    id: "observedOutOfPlaneMagnetization",
    label: "Observed out of plane magnetization",
    kind: "numberList",
  },
  {
    id: "callerDomainBoundaryMagnetization",
    label: "Caller domain boundary magnetization",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSkyrmionRadialDistancesNm.forEach((v) =>
    nonnegative(v, "observedSkyrmionRadialDistancesNm"),
  );
  if (
    input.observedOutOfPlaneMagnetization.some((v) => v < -1 || v > 1) ||
    Math.abs(input.callerDomainBoundaryMagnetization) > 1
  )
    simpleError(
      "magnetization",
      "Normalized measured magnetization and boundary in [-1,1].",
    );
  const radii = crossings(
    input.observedSkyrmionRadialDistancesNm,
    input.observedOutOfPlaneMagnetization,
    input.callerDomainBoundaryMagnetization,
  );
  return {
    observedSkyrmionBoundaryRadiiNm: radii,
    observedSkyrmionDiametersNm: radii.map((v) => 2 * v),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSkyrmionRadialDistancesNm: [0, 1, 2],
  observedOutOfPlaneMagnetization: [-1, 0, 1],
  callerDomainBoundaryMagnetization: 0,
} satisfies Input;
export const exampleOutput = {
  observedSkyrmionBoundaryRadiiNm: [1],
  observedSkyrmionDiametersNm: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/skyrmion-size",
  title: "Semiconductor Skyrmion Size Calculator",
  description:
    "Extract actual radial skyrmion boundary crossings from normalized magnetization, all crossings retained; no fixed exchange/DMI size estimate or topological classification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSkyrmionBoundaryRadiiNm",
      label: "Observed skyrmion boundary radii nm",
      kind: "numberList",
    },
    {
      id: "observedSkyrmionDiametersNm",
      label: "Observed skyrmion diameters nm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSkyrmionRadialDistancesNm:
        value.observedSkyrmionRadialDistancesNm as readonly number[],
      observedOutOfPlaneMagnetization:
        value.observedOutOfPlaneMagnetization as readonly number[],
      callerDomainBoundaryMagnetization:
        value.callerDomainBoundaryMagnetization as number,
    }),
});
export const run = tool.execute;
export default tool;
