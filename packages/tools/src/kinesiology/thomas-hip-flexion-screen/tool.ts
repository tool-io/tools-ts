import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly thighElevationDegrees: number;
  readonly maximumElevationDegrees: number;
  readonly kneeFlexionDegrees: number;
  readonly minimumKneeFlexionDegrees: number;
}>;
export type Output = Readonly<{
  readonly thighExcessDegrees: number;
  readonly hipFlexionLimitFlag: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.maximumElevationDegrees < 0 || input.minimumKneeFlexionDegrees < 0)
    simpleError(
      "maximumElevationDegrees",
      "Nonnegative Thomas-test screening cutoffs required.",
    );
  return {
    thighExcessDegrees:
      input.thighElevationDegrees - input.maximumElevationDegrees,
    hipFlexionLimitFlag:
      input.thighElevationDegrees > input.maximumElevationDegrees &&
      input.kneeFlexionDegrees >= input.minimumKneeFlexionDegrees,
  };
};
export const exampleInput = {
  thighElevationDegrees: 15,
  maximumElevationDegrees: 5,
  kneeFlexionDegrees: 80,
  minimumKneeFlexionDegrees: 70,
} satisfies Input;
export const exampleOutput = {
  thighExcessDegrees: 10,
  hipFlexionLimitFlag: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/thomas-hip-flexion-screen",
  title: "Thomas Hip Flexion Screen",
  description:
    "Screen Thomas-test thigh rise while checking sufficient knee flexion.",
  inputs: [
    {
      id: "thighElevationDegrees",
      label: "Thigh elevation degrees",
      kind: "number",
    },
    {
      id: "maximumElevationDegrees",
      label: "Maximum elevation degrees",
      kind: "number",
    },
    { id: "kneeFlexionDegrees", label: "Knee flexion degrees", kind: "number" },
    {
      id: "minimumKneeFlexionDegrees",
      label: "Minimum knee flexion degrees",
      kind: "number",
    },
  ],
  outputs: [
    { id: "thighExcessDegrees", label: "Thigh excess degrees", kind: "number" },
    {
      id: "hipFlexionLimitFlag",
      label: "Hip flexion limit flag",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      thighElevationDegrees: value.thighElevationDegrees as number,
      maximumElevationDegrees: value.maximumElevationDegrees as number,
      kneeFlexionDegrees: value.kneeFlexionDegrees as number,
      minimumKneeFlexionDegrees: value.minimumKneeFlexionDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
