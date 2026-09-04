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
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedSeatedEyeFloorCm: number;
  readonly observedMonitorCenterFloorCm: number;
  readonly observedHorizontalViewingCm: number;
  readonly callerDownwardAngleMaxDegrees: number;
}>;
export type Output = Readonly<{
  readonly observedDownwardViewingDegrees: number;
  readonly signedAngleReserveDegrees: number;
}>;
const inputFields = [
  {
    id: "observedSeatedEyeFloorCm",
    label: "Observed seated eye floor cm",
    kind: "number",
  },
  {
    id: "observedMonitorCenterFloorCm",
    label: "Observed monitor center floor cm",
    kind: "number",
  },
  {
    id: "observedHorizontalViewingCm",
    label: "Observed horizontal viewing cm",
    kind: "number",
  },
  {
    id: "callerDownwardAngleMaxDegrees",
    label: "Caller downward angle max degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedSeatedEyeFloorCm, "observedSeatedEyeFloorCm");
  positive(input.observedMonitorCenterFloorCm, "observedMonitorCenterFloorCm");
  positive(input.observedHorizontalViewingCm, "observedHorizontalViewingCm");
  nonnegative(
    input.callerDownwardAngleMaxDegrees,
    "callerDownwardAngleMaxDegrees",
  );
  if (input.callerDownwardAngleMaxDegrees >= 90)
    simpleError("policy", "Max downward angle<90.");
  const a =
    (Math.atan2(
      input.observedSeatedEyeFloorCm - input.observedMonitorCenterFloorCm,
      input.observedHorizontalViewingCm,
    ) *
      180) /
    Math.PI;
  return {
    observedDownwardViewingDegrees: a,
    signedAngleReserveDegrees: input.callerDownwardAngleMaxDegrees - a,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSeatedEyeFloorCm: 120,
  observedMonitorCenterFloorCm: 100,
  observedHorizontalViewingCm: 60,
  callerDownwardAngleMaxDegrees: 30,
} satisfies Input;
export const exampleOutput = {
  observedDownwardViewingDegrees: 18.43494882292201,
  signedAngleReserveDegrees: 11.56505117707799,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/eye-height-seated-fit-checker",
  title: "Anthropometric Eye Height Seated Monitor Fit Checker",
  description:
    "Measured seated eye/monitor geometry and explicit downward-angle reserve; upward views signed, not optimum universal fit. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDownwardViewingDegrees",
      label: "Observed downward viewing degrees",
      kind: "number",
    },
    {
      id: "signedAngleReserveDegrees",
      label: "Signed angle reserve degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSeatedEyeFloorCm: value.observedSeatedEyeFloorCm as number,
      observedMonitorCenterFloorCm:
        value.observedMonitorCenterFloorCm as number,
      observedHorizontalViewingCm: value.observedHorizontalViewingCm as number,
      callerDownwardAngleMaxDegrees:
        value.callerDownwardAngleMaxDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
