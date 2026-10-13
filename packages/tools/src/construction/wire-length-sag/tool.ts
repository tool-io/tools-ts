import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyFitCatenaryA: number;
  readonly actualHorizontalSpan: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerIndependentlyFitCatenaryA",
    label: "Caller independently fit catenary a",
    kind: "number",
  },
  {
    id: "actualHorizontalSpan",
    label: "Actual horizontal span",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(
    input.callerIndependentlyFitCatenaryA,
    "callerIndependentlyFitCatenaryA",
  );
  nonnegative(input.actualHorizontalSpan, "actualHorizontalSpan");
  return {
    value:
      input.callerIndependentlyFitCatenaryA *
      2 *
      Math.sinh(
        input.actualHorizontalSpan /
          (2 * input.callerIndependentlyFitCatenaryA),
      ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerIndependentlyFitCatenaryA: 2, actualHorizontalSpan: 4 },
  output: { result: { value: 4.7008047745752055 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/wire-length-sag",
  title: "Wire Length With Sag Calculator",
  description:
    "Equal height exact catenary wire arclength2a sinh(L/2a), afittedactualH/wexternally, not parabolic length or automatically safe wire tension. Actual independently established design/material/calibration and matched units; not a safe work instruction, code compliance or engineering approval.",
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
