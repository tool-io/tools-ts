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
  nonnegative,
  fraction,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly apertureDiameterMm: number;
  readonly centralObstructionDiameterMm: number;
  readonly eyePupilDiameterMm: number;
  readonly callerOpticalThroughputFraction: number;
}>;
export type Output = Readonly<{
  readonly conditionalRelativePhotonCollection: number;
}>;
const inputFields = [
  { id: "apertureDiameterMm", label: "Aperture diameter mm", kind: "number" },
  {
    id: "centralObstructionDiameterMm",
    label: "Central obstruction diameter mm",
    kind: "number",
  },
  { id: "eyePupilDiameterMm", label: "Eye pupil diameter mm", kind: "number" },
  {
    id: "callerOpticalThroughputFraction",
    label: "Caller optical throughput fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.apertureDiameterMm, "apertureDiameterMm");
  positive(input.eyePupilDiameterMm, "eyePupilDiameterMm");
  nonnegative(
    input.centralObstructionDiameterMm,
    "centralObstructionDiameterMm",
  );
  fraction(
    input.callerOpticalThroughputFraction,
    "callerOpticalThroughputFraction",
  );
  if (input.centralObstructionDiameterMm >= input.apertureDiameterMm)
    simpleError("aperture", "Obstruction smaller than aperture.");
  return {
    conditionalRelativePhotonCollection:
      ((input.apertureDiameterMm ** 2 -
        input.centralObstructionDiameterMm ** 2) /
        input.eyePupilDiameterMm ** 2) *
      input.callerOpticalThroughputFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  apertureDiameterMm: 100,
  centralObstructionDiameterMm: 20,
  eyePupilDiameterMm: 5,
  callerOpticalThroughputFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  conditionalRelativePhotonCollection: 307.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/telescope-light-gathering-vs-eye",
  title: "Light Gathering Power vs Eye Calculator",
  description:
    "Effective unobscured collecting area×independent throughput relative to eye pupil, not visual surface-brightness gain or photopic sensitivity. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalRelativePhotonCollection",
      label: "Conditional relative photon collection",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      apertureDiameterMm: value.apertureDiameterMm as number,
      centralObstructionDiameterMm:
        value.centralObstructionDiameterMm as number,
      eyePupilDiameterMm: value.eyePupilDiameterMm as number,
      callerOpticalThroughputFraction:
        value.callerOpticalThroughputFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
