import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly riseM: number;
  readonly horizontalRunM: number;
}>;
export type Output = Readonly<{
  readonly signedGradientPercent: number;
  readonly signedInclinationDegrees: number;
  readonly slopeDistanceM: number;
}>;
const inputFields = [
  { id: "riseM", label: "Rise m", kind: "number" },
  { id: "horizontalRunM", label: "Horizontal run m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.horizontalRunM, "horizontalRunM");
  return {
    signedGradientPercent: (100 * input.riseM) / input.horizontalRunM,
    signedInclinationDegrees:
      (Math.atan2(input.riseM, input.horizontalRunM) * 180) / Math.PI,
    slopeDistanceM: Math.hypot(input.riseM, input.horizontalRunM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { riseM: -10, horizontalRunM: 100 } satisfies Input;
export const exampleOutput = {
  signedGradientPercent: -10,
  signedInclinationDegrees: -5.710593137499643,
  slopeDistanceM: 100.4987562112089,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ramp-gradient",
  title: "Ramp Gradient",
  description:
    "Calculate signed ramp grade, angle and slope distance; descending grades are preserved and no road acceptance criterion is embedded.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedGradientPercent",
      label: "Signed gradient percent",
      kind: "number",
    },
    {
      id: "signedInclinationDegrees",
      label: "Signed inclination degrees",
      kind: "number",
    },
    { id: "slopeDistanceM", label: "Slope distance m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      riseM: value.riseM as number,
      horizontalRunM: value.horizontalRunM as number,
    }),
});
export const run = tool.execute;
export default tool;
