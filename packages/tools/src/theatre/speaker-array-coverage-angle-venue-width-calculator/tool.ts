import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch33-shared.js";
export type Input = Readonly<{
  readonly speakerToAudiencePlaneDistanceM: number;
  readonly audiencePlaneWidthM: number;
  readonly callerMeasuredHorizontalCoverageDegrees: number;
}>;
export type Output = Readonly<{
  readonly requiredHorizontalCoverageDegrees: number;
  readonly modeledCoverageWidthM: number;
  readonly withinCallerCoverageEnvelope: boolean;
}>;
const inputFields = [
  {
    id: "speakerToAudiencePlaneDistanceM",
    label: "Speaker to audience plane distance m",
    kind: "number",
  },
  {
    id: "audiencePlaneWidthM",
    label: "Audience plane width m",
    kind: "number",
  },
  {
    id: "callerMeasuredHorizontalCoverageDegrees",
    label: "Caller measured horizontal coverage degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.speakerToAudiencePlaneDistanceM,
    "speakerToAudiencePlaneDistanceM",
  );
  positive(input.audiencePlaneWidthM, "audiencePlaneWidthM");
  positive(
    input.callerMeasuredHorizontalCoverageDegrees,
    "callerMeasuredHorizontalCoverageDegrees",
  );
  if (input.callerMeasuredHorizontalCoverageDegrees >= 180)
    simpleError(
      "angle",
      "Finite forward coverage angle <180 degrees required.",
    );
  const required =
      (2 *
        Math.atan2(
          input.audiencePlaneWidthM / 2,
          input.speakerToAudiencePlaneDistanceM,
        ) *
        180) /
      Math.PI,
    width =
      2 *
      input.speakerToAudiencePlaneDistanceM *
      Math.tan((input.callerMeasuredHorizontalCoverageDegrees * Math.PI) / 360);
  return {
    requiredHorizontalCoverageDegrees: required,
    modeledCoverageWidthM: width,
    withinCallerCoverageEnvelope:
      required <= input.callerMeasuredHorizontalCoverageDegrees,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  speakerToAudiencePlaneDistanceM: 10,
  audiencePlaneWidthM: 20,
  callerMeasuredHorizontalCoverageDegrees: 90,
} satisfies Input;
export const exampleOutput = {
  requiredHorizontalCoverageDegrees: 90,
  modeledCoverageWidthM: 20,
  withinCallerCoverageEnvelope: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/speaker-array-coverage-angle-venue-width-calculator",
  title: "Speaker Array Coverage Angle Venue Width Calculator",
  description:
    "Compare measured speaker horizontal coverage with a caller centered audience-plane footprint; ideal angular envelope, not SPL uniformity, frequency-dependent array design or acoustic prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredHorizontalCoverageDegrees",
      label: "Required horizontal coverage degrees",
      kind: "number",
    },
    {
      id: "modeledCoverageWidthM",
      label: "Modeled coverage width m",
      kind: "number",
    },
    {
      id: "withinCallerCoverageEnvelope",
      label: "Within caller coverage envelope",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      speakerToAudiencePlaneDistanceM:
        value.speakerToAudiencePlaneDistanceM as number,
      audiencePlaneWidthM: value.audiencePlaneWidthM as number,
      callerMeasuredHorizontalCoverageDegrees:
        value.callerMeasuredHorizontalCoverageDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
