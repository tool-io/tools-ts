import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerSpecifiedEnvelopeFraction: number;
  readonly dampingRatio: number;
  readonly naturalAngularFrequencyPerSecond: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerSpecifiedEnvelopeFraction",
    label: "Caller specified envelope fraction",
    kind: "number",
  },
  { id: "dampingRatio", label: "Damping ratio", kind: "number" },
  {
    id: "naturalAngularFrequencyPerSecond",
    label: "Natural angular frequency per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(
    input.callerSpecifiedEnvelopeFraction,
    "callerSpecifiedEnvelopeFraction",
  );
  positive(input.dampingRatio, "dampingRatio");
  positive(
    input.naturalAngularFrequencyPerSecond,
    "naturalAngularFrequencyPerSecond",
  );
  if (input.callerSpecifiedEnvelopeFraction >= 1)
    simpleError("envelope", "0<ε<1.");
  return {
    value:
      -Math.log(input.callerSpecifiedEnvelopeFraction) /
      (input.dampingRatio * input.naturalAngularFrequencyPerSecond),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerSpecifiedEnvelopeFraction: 0.02,
    dampingRatio: 0.5,
    naturalAngularFrequencyPerSecond: 2,
  },
  output: { result: { value: 3.912023005428146 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/settling-time",
  title: "Settling Time Calculator",
  description:
    "Declared exponential-envelope settling bound\u2212ln\u03b5/(\u03b6\u03c9n), not exact oscillatory crossing or universal4/(\u03b6\u03c9n).Actual0<\u03b5<1. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
