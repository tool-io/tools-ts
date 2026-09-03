import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{ readonly callerCycleDurationSeconds: number }>;
export type Output = Readonly<{
  readonly threePulseTimesSeconds: readonly number[];
  readonly twoPulseTimesSeconds: readonly number[];
  readonly coincidentPulseTimesSeconds: readonly number[];
}>;
const inputFields = [
  {
    id: "callerCycleDurationSeconds",
    label: "Caller cycle duration seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerCycleDurationSeconds, "callerCycleDurationSeconds");
  return {
    threePulseTimesSeconds: [
      0,
      input.callerCycleDurationSeconds / 3,
      (2 * input.callerCycleDurationSeconds) / 3,
    ],
    twoPulseTimesSeconds: [0, input.callerCycleDurationSeconds / 2],
    coincidentPulseTimesSeconds: [0],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { callerCycleDurationSeconds: 6 } satisfies Input;
export const exampleOutput = {
  threePulseTimesSeconds: [0, 2, 4],
  twoPulseTimesSeconds: [0, 3],
  coincidentPulseTimesSeconds: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/polyrhythm-3-against-2-clap-grid-generator",
  title: "Polyrhythm 3-against-2 Clap Grid Generator",
  description:
    "Endpoint-exclusive 3-against-2 pulse grid over one caller common cycle; common cycle end is next cycle start, not a duplicated seventh point. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "threePulseTimesSeconds",
      label: "Three pulse times seconds",
      kind: "numberList",
    },
    {
      id: "twoPulseTimesSeconds",
      label: "Two pulse times seconds",
      kind: "numberList",
    },
    {
      id: "coincidentPulseTimesSeconds",
      label: "Coincident pulse times seconds",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCycleDurationSeconds: value.callerCycleDurationSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
