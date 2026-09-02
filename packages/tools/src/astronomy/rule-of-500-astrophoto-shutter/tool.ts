import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly focalLengthMm: number;
  readonly callerSensorCropFactor: number;
  readonly callerHeuristicNumerator: number;
}>;
export type Output = Readonly<{ readonly heuristicShutterSeconds: number }>;
const inputFields = [
  { id: "focalLengthMm", label: "Focal length mm", kind: "number" },
  {
    id: "callerSensorCropFactor",
    label: "Caller sensor crop factor",
    kind: "number",
  },
  {
    id: "callerHeuristicNumerator",
    label: "Caller heuristic numerator",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.focalLengthMm, "focalLengthMm");
  positive(input.callerSensorCropFactor, "callerSensorCropFactor");
  positive(input.callerHeuristicNumerator, "callerHeuristicNumerator");
  return {
    heuristicShutterSeconds:
      input.callerHeuristicNumerator /
      (input.focalLengthMm * input.callerSensorCropFactor),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  focalLengthMm: 50,
  callerSensorCropFactor: 1,
  callerHeuristicNumerator: 500,
} satisfies Input;
export const exampleOutput = { heuristicShutterSeconds: 10 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/rule-of-500-astrophoto-shutter",
  title: "Rule of 500 Astrophotography Shutter",
  description:
    "Caller explicit historical 500-rule exposure heuristic, not pixel-accurate star-trail tolerance or guaranteed sharp exposure. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "heuristicShutterSeconds",
      label: "Heuristic shutter seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      focalLengthMm: value.focalLengthMm as number,
      callerSensorCropFactor: value.callerSensorCropFactor as number,
      callerHeuristicNumerator: value.callerHeuristicNumerator as number,
    }),
});
export const run = tool.execute;
export default tool;
