import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedPitchSegmentSeconds: readonly number[];
  readonly callerAllowedTotalSeconds: number;
}>;
export type Output = Readonly<{
  readonly observedTotalPitchSeconds: number;
  readonly signedClockReserveSeconds: number;
}>;
const inputFields = [
  {
    id: "observedPitchSegmentSeconds",
    label: "Observed pitch segment seconds",
    kind: "numberList",
  },
  {
    id: "callerAllowedTotalSeconds",
    label: "Caller allowed total seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerAllowedTotalSeconds, "callerAllowedTotalSeconds");
  input.observedPitchSegmentSeconds.forEach((v) =>
    nonnegative(v, "observedPitchSegmentSeconds"),
  );
  const s = sum(input.observedPitchSegmentSeconds);
  return {
    observedTotalPitchSeconds: s,
    signedClockReserveSeconds: input.callerAllowedTotalSeconds - s,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPitchSegmentSeconds: [60, 120, 90],
  callerAllowedTotalSeconds: 300,
} satisfies Input;
export const exampleOutput = {
  observedTotalPitchSeconds: 270,
  signedClockReserveSeconds: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/demo-day-five-minute-clock-format-lookup",
  title: "Demo Day Five Minute Clock Format Lookup",
  description:
    "Actual demo-day segment clock audit against independent permitted duration (five-minute title not universal), no speech duration inferred from word count. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedTotalPitchSeconds",
      label: "Observed total pitch seconds",
      kind: "number",
    },
    {
      id: "signedClockReserveSeconds",
      label: "Signed clock reserve seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPitchSegmentSeconds:
        value.observedPitchSegmentSeconds as readonly number[],
      callerAllowedTotalSeconds: value.callerAllowedTotalSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
