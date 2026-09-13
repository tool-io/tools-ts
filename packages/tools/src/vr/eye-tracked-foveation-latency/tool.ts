import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualNewFoveationPhotonTimestampMs: number;
  readonly actualMatchedGazeSampleTimestampMs: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualNewFoveationPhotonTimestampMs",
    label: "Actual new foveation photon time stamp ms",
    kind: "number",
  },
  {
    id: "actualMatchedGazeSampleTimestampMs",
    label: "Actual matched gaze sample time stamp ms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.actualNewFoveationPhotonTimestampMs <
    input.actualMatchedGazeSampleTimestampMs
  )
    simpleError("times", "Actualmatchedorderedtimestamps.");
  return {
    value:
      input.actualNewFoveationPhotonTimestampMs -
      input.actualMatchedGazeSampleTimestampMs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualNewFoveationPhotonTimestampMs: 10,
    actualMatchedGazeSampleTimestampMs: 5,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/eye-tracked-foveation-latency",
  title: "Eye Tracked Foveation Latency Calculator",
  description:
    "Actual gaze-to-new foveated-region photon latency for independently aligned sample/eventms, not generic tracking stage sumor headset prediction delay.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
