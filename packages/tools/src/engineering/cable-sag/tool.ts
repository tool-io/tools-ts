import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualUniformLoadPerHorizontalMeter: number;
  readonly actualSpanMeters: number;
  readonly callerIndependentHorizontalTensionNewtons: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualUniformLoadPerHorizontalMeter",
    label: "Actual uniform load per horizontal meter",
    kind: "number",
  },
  { id: "actualSpanMeters", label: "Actual span meters", kind: "number" },
  {
    id: "callerIndependentHorizontalTensionNewtons",
    label: "Caller independent horizontal tension new tons",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualUniformLoadPerHorizontalMeter,
    "actualUniformLoadPerHorizontalMeter",
  );
  positive(input.actualSpanMeters, "actualSpanMeters");
  positive(
    input.callerIndependentHorizontalTensionNewtons,
    "callerIndependentHorizontalTensionNewtons",
  );
  return {
    value:
      (input.actualUniformLoadPerHorizontalMeter *
        input.actualSpanMeters ** 2) /
      (8 * input.callerIndependentHorizontalTensionNewtons),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualUniformLoadPerHorizontalMeter: 1,
    actualSpanMeters: 4,
    callerIndependentHorizontalTensionNewtons: 1,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/cable-sag",
  title: "Cable Sag Calculator",
  description:
    "Ideal small sag parabola uniform horizontal loadwL\u00b2/(8H), not catenary self weight, safe cable tension or support load. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
