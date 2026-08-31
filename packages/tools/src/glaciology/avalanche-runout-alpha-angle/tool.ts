import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly releaseElevationM: number;
  readonly observedRunoutElevationM: number;
  readonly horizontalRunoutDistanceM: number;
}>;
export type Output = Readonly<{ readonly observedRunoutAlphaDegrees: number }>;
const inputFields = [
  { id: "releaseElevationM", label: "Release elevation m", kind: "number" },
  {
    id: "observedRunoutElevationM",
    label: "Observed runout elevation m",
    kind: "number",
  },
  {
    id: "horizontalRunoutDistanceM",
    label: "Horizontal runout distance m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.horizontalRunoutDistanceM, "horizontalRunoutDistanceM");
  if (input.releaseElevationM < input.observedRunoutElevationM)
    simpleError("runout", "Observed runout must not be above release.");
  return {
    observedRunoutAlphaDegrees:
      (Math.atan2(
        input.releaseElevationM - input.observedRunoutElevationM,
        input.horizontalRunoutDistanceM,
      ) *
        180) /
      Math.PI,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  releaseElevationM: 1000,
  observedRunoutElevationM: 500,
  horizontalRunoutDistanceM: 1000,
} satisfies Input;
export const exampleOutput = {
  observedRunoutAlphaDegrees: 26.56505117707799,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/avalanche-runout-alpha-angle",
  title: "Avalanche Runout Alpha Angle Calculator",
  description:
    "Compute observed release-to-runout alpha angle from physical measured horizontal distance/drop; not an avalanche prediction, GIS/geodesy transformation or safe runout exclusion zone.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRunoutAlphaDegrees",
      label: "Observed runout alpha degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      releaseElevationM: value.releaseElevationM as number,
      observedRunoutElevationM: value.observedRunoutElevationM as number,
      horizontalRunoutDistanceM: value.horizontalRunoutDistanceM as number,
    }),
});
export const run = tool.execute;
export default tool;
