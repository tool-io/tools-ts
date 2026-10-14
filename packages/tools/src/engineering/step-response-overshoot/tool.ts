import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch49-shared.js";
export type Input = Readonly<{ readonly dampingRatio: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "dampingRatio", label: "Damping ratio", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.dampingRatio, "dampingRatio");
  if (input.dampingRatio >= 1) simpleError("zeta", "0<ζ<1.");
  return {
    value:
      100 *
      Math.exp(
        (-Math.PI * input.dampingRatio) /
          Math.sqrt(1 - input.dampingRatio ** 2),
      ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { dampingRatio: 0.5 },
  output: { result: { value: 16.303353482158048 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/step-response-overshoot",
  title: "Step Response Overshoot Calculator",
  description:
    "Ideal underdamped second order unit-step overshoot,0<\u03b6<1; not measured nonlinear/system overshoot. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
