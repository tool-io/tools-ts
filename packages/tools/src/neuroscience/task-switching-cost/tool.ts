import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedSwitchTrialRtMs: number;
  readonly actualQualifiedRepeatTrialRtMs: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualQualifiedSwitchTrialRtMs",
    label: "Actual qualified switch trial rt ms",
    kind: "number",
  },
  {
    id: "actualQualifiedRepeatTrialRtMs",
    label: "Actual qualified repeat trial rt ms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualQualifiedSwitchTrialRtMs,
    "actualQualifiedSwitchTrialRtMs",
  );
  nonnegative(
    input.actualQualifiedRepeatTrialRtMs,
    "actualQualifiedRepeatTrialRtMs",
  );
  return {
    value:
      input.actualQualifiedSwitchTrialRtMs -
      input.actualQualifiedRepeatTrialRtMs,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedSwitchTrialRtMs: 5,
    actualQualifiedRepeatTrialRtMs: 3,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/task-switching-cost",
  title: "Task Switching Cost Calculator",
  description:
    "Observed task switch minus same-repeat RT cost; signed result retained, actual matching units and definitions independently established.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
