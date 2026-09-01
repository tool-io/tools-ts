import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  strictlyIncreasing,
  interpolate,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerObservedIrisApertureMm: readonly number[];
  readonly matchedProjectedBeamDiametersM: readonly number[];
  readonly requestedProjectedDiameterM: number;
}>;
export type Output = Readonly<{ readonly interpolatedIrisApertureMm: number }>;
const inputFields = [
  {
    id: "callerObservedIrisApertureMm",
    label: "Caller observed iris aperture mm",
    kind: "numberList",
  },
  {
    id: "matchedProjectedBeamDiametersM",
    label: "Matched projected beam diameters m",
    kind: "numberList",
  },
  {
    id: "requestedProjectedDiameterM",
    label: "Requested projected diameter m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerObservedIrisApertureMm.forEach((v) =>
    positive(v, "callerObservedIrisApertureMm"),
  );
  input.matchedProjectedBeamDiametersM.forEach((v) =>
    positive(v, "matchedProjectedBeamDiametersM"),
  );
  positive(input.requestedProjectedDiameterM, "requestedProjectedDiameterM");
  aligned(
    input.callerObservedIrisApertureMm,
    input.matchedProjectedBeamDiametersM,
    "callerObservedIrisApertureMm",
  );
  strictlyIncreasing(input.callerObservedIrisApertureMm, "aperture");
  return {
    interpolatedIrisApertureMm: interpolate(
      input.matchedProjectedBeamDiametersM,
      input.callerObservedIrisApertureMm,
      input.requestedProjectedDiameterM,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerObservedIrisApertureMm: [10, 20, 30],
  matchedProjectedBeamDiametersM: [1, 2, 3],
  requestedProjectedDiameterM: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedIrisApertureMm: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/iris-diaphragm-aperture-range-lookup",
  title: "Iris Diaphragm Aperture Range Lookup",
  description:
    "Invert actual measured iris/beam-diameter calibration at caller matched throw only inside observed range; not a universal diaphragm scale, beam-angle assumption or fixture aperture compatibility.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedIrisApertureMm",
      label: "Interpolated iris aperture mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerObservedIrisApertureMm:
        value.callerObservedIrisApertureMm as readonly number[],
      matchedProjectedBeamDiametersM:
        value.matchedProjectedBeamDiametersM as readonly number[],
      requestedProjectedDiameterM: value.requestedProjectedDiameterM as number,
    }),
});
export const run = tool.execute;
export default tool;
