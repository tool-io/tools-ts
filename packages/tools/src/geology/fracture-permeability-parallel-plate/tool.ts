import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly hydraulicAperturesM: readonly number[];
}>;
export type Output = Readonly<{
  readonly parallelPlateIntrinsicPermeabilitiesM2: readonly number[];
}>;
const inputFields = [
  {
    id: "hydraulicAperturesM",
    label: "Hydraulic apertures m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.hydraulicAperturesM.forEach((v) => positive(v, "hydraulicAperturesM"));
  if (!input.hydraulicAperturesM.length)
    simpleError("aperture", "Measured apertures required.");
  return {
    parallelPlateIntrinsicPermeabilitiesM2: input.hydraulicAperturesM.map(
      (b) => (b * b) / 12,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  hydraulicAperturesM: [0.01, 0.02],
} satisfies Input;
export const exampleOutput = {
  parallelPlateIntrinsicPermeabilitiesM2: [
    8.333333333333334e-6, 3.3333333333333335e-5,
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/fracture-permeability-parallel-plate",
  title: "Geology Fracture Permeability Parallel Plate Calculator",
  description:
    "Smooth ideal fracture intrinsic k=b²/12, independently established hydraulic apertures, not visual width or bulk rock permeability. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "parallelPlateIntrinsicPermeabilitiesM2",
      label: "Parallel plate intrinsic permeabilities m2",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      hydraulicAperturesM: value.hydraulicAperturesM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
