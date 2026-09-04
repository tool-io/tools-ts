import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedScreenMinutesSinceBreak: number;
  readonly observedLastDistanceFeet: number;
  readonly observedLastBreakSeconds: number;
}>;
export type Output = Readonly<{
  readonly minutesUntilNamed20MinuteReminder: number;
  readonly signedDistanceFeetReserve: number;
  readonly signedBreakSecondsReserve: number;
}>;
const inputFields = [
  {
    id: "observedScreenMinutesSinceBreak",
    label: "Observed screen minutes since break",
    kind: "number",
  },
  {
    id: "observedLastDistanceFeet",
    label: "Observed last distance feet",
    kind: "number",
  },
  {
    id: "observedLastBreakSeconds",
    label: "Observed last break seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.observedScreenMinutesSinceBreak,
    "observedScreenMinutesSinceBreak",
  );
  nonnegative(input.observedLastDistanceFeet, "observedLastDistanceFeet");
  nonnegative(input.observedLastBreakSeconds, "observedLastBreakSeconds");
  return {
    minutesUntilNamed20MinuteReminder: Math.max(
      0,
      20 - input.observedScreenMinutesSinceBreak,
    ),
    signedDistanceFeetReserve: input.observedLastDistanceFeet - 20,
    signedBreakSecondsReserve: input.observedLastBreakSeconds - 20,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedScreenMinutesSinceBreak: 25,
  observedLastDistanceFeet: 25,
  observedLastBreakSeconds: 15,
} satisfies Input;
export const exampleOutput = {
  minutesUntilNamed20MinuteReminder: 0,
  signedDistanceFeetReserve: 5,
  signedBreakSecondsReserve: -5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/202020-rule-timer-helper",
  title: "20-20-20 Rule Compliance Interval Timer Helper",
  description:
    "Named20min/20ft/20 sec reminder arithmetic from supplied observations; does not schedule an OS timer or establish eye health. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "minutesUntilNamed20MinuteReminder",
      label: "Minutes until named20 minute reminder",
      kind: "number",
    },
    {
      id: "signedDistanceFeetReserve",
      label: "Signed distance feet reserve",
      kind: "number",
    },
    {
      id: "signedBreakSecondsReserve",
      label: "Signed break seconds reserve",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedScreenMinutesSinceBreak:
        value.observedScreenMinutesSinceBreak as number,
      observedLastDistanceFeet: value.observedLastDistanceFeet as number,
      observedLastBreakSeconds: value.observedLastBreakSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
