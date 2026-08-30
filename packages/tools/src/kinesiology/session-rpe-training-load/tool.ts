import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly durationMinutes: number;
  readonly sessionRpe: number;
  readonly rpeMaximum: number;
}>;
export type Output = Readonly<{
  readonly sessionLoad: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.durationMinutes <= 0 ||
    input.rpeMaximum <= 0 ||
    input.sessionRpe < 0 ||
    input.sessionRpe > input.rpeMaximum
  )
    simpleError(
      "sessionRpe",
      "Positive duration, RPE scale maximum, and in-range RPE required.",
    );
  return { sessionLoad: input.durationMinutes * input.sessionRpe };
};
export const exampleInput = {
  durationMinutes: 60,
  sessionRpe: 5,
  rpeMaximum: 10,
} satisfies Input;
export const exampleOutput = { sessionLoad: 300 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/session-rpe-training-load",
  title: "Session RPE Training Load",
  description: "Calculate session-RPE training load in arbitrary units.",
  inputs: [
    { id: "durationMinutes", label: "Duration minutes", kind: "number" },
    { id: "sessionRpe", label: "Session rpe", kind: "number" },
    { id: "rpeMaximum", label: "Rpe maximum", kind: "number" },
  ],
  outputs: [{ id: "sessionLoad", label: "Session load", kind: "number" }],
  calculate: (value) =>
    calculate({
      durationMinutes: value.durationMinutes as number,
      sessionRpe: value.sessionRpe as number,
      rpeMaximum: value.rpeMaximum as number,
    }),
});
export const run = tool.execute;
export default tool;
