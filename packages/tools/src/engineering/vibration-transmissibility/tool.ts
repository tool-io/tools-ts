import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly dampingRatio: number;
  readonly frequencyRatio: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "dampingRatio", label: "Damping ratio", kind: "number" },
  { id: "frequencyRatio", label: "Frequency ratio", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(input.dampingRatio, "dampingRatio");
  nonnegative(input.frequencyRatio, "frequencyRatio");
  positive(
    (1 - input.frequencyRatio ** 2) ** 2 +
      (2 * input.dampingRatio * input.frequencyRatio) ** 2,
    "denominator",
  );
  return {
    value: Math.sqrt(
      (1 + (2 * input.dampingRatio * input.frequencyRatio) ** 2) /
        ((1 - input.frequencyRatio ** 2) ** 2 +
          (2 * input.dampingRatio * input.frequencyRatio) ** 2),
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { dampingRatio: 0.5, frequencyRatio: 0 },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/vibration-transmissibility",
  title: "Vibration Transmissibility Calculator",
  description:
    "Ideal single degree displacement/force transmissibility at frequency ratio r=\u03c9/\u03c9n, actual damping\u03b6; no base isolation safety or multidof response. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
