import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly hour24: number;
  readonly minute: number;
  readonly renderedTime: string;
}>;
export type Output = Readonly<{
  readonly expectedTime: string;
  readonly matchesExpected: boolean;
}>;

export const calculate = (input: Input): Output => {
  const period = input.hour24 < 12 ? "a.m." : "p.m.";
  const hour = input.hour24 % 12 || 12;
  const expectedTime =
    input.minute === 0
      ? `${hour} ${period}`
      : `${hour}:${String(input.minute).padStart(2, "0")} ${period}`;
  return {
    expectedTime,
    matchesExpected: input.renderedTime.trim() === expectedTime,
  };
};

export const exampleInput = {
  hour24: 13,
  minute: 5,
  renderedTime: "1:05 p.m.",
} satisfies Input;
export const exampleOutput = {
  expectedTime: "1:05 p.m.",
  matchesExpected: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      hour24: input.hour24 as number,
      minute: input.minute as number,
      renderedTime: input.renderedTime as string,
    }),
  description: "Format and validate AP-style clock time.",
  id: "journalism/ap-time-style",
  inputs: [
    {
      id: "hour24",
      label: "Hour in 24-hour time",
      kind: "integer",
      minimum: 0,
      maximum: 23,
    },
    { id: "minute", label: "Minute", kind: "integer", minimum: 0, maximum: 59 },
    { id: "renderedTime", label: "Rendered time", kind: "string" },
  ],
  outputs: [
    { id: "expectedTime", label: "Expected AP-style time", kind: "string" },
    { id: "matchesExpected", label: "Matches expected time", kind: "boolean" },
  ],
  title: "AP Time Style",
});

export const run = tool.execute;
export default tool;
