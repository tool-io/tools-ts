import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerLoopZeroTimeConstantSeconds: number;
  readonly callerIndependentNaturalAngularFrequencyPerSecond: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerLoopZeroTimeConstantSeconds",
    label: "Caller loop zero time constant seconds",
    kind: "number",
  },
  {
    id: "callerIndependentNaturalAngularFrequencyPerSecond",
    label: "Caller independent natural angular frequency per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(
    input.callerLoopZeroTimeConstantSeconds,
    "callerLoopZeroTimeConstantSeconds",
  );
  positive(
    input.callerIndependentNaturalAngularFrequencyPerSecond,
    "callerIndependentNaturalAngularFrequencyPerSecond",
  );
  return {
    value:
      (input.callerLoopZeroTimeConstantSeconds *
        input.callerIndependentNaturalAngularFrequencyPerSecond) /
      2,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerLoopZeroTimeConstantSeconds: 1,
    callerIndependentNaturalAngularFrequencyPerSecond: 2,
  },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/pll-damping-ratio",
  title: "Pll Damping Ratio Calculator",
  description:
    "Declared second order type II closed-loop \u03b6=\u03c4zero\u03c9n/2, explicit transfer-function convention, not viscous mechanical c/(2\u221akm). Actual matched units/topology and independently established parameters; not a safe device/electrical design or verified manufacturer rating.",
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
