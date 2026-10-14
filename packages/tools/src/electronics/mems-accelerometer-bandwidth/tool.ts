import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerActualFirstOrderLowPassTimeConstantSeconds: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerActualFirstOrderLowPassTimeConstantSeconds",
    label: "Caller actual first order low pass time constant seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(
    input.callerActualFirstOrderLowPassTimeConstantSeconds,
    "callerActualFirstOrderLowPassTimeConstantSeconds",
  );
  return {
    value:
      1 /
      (2 * Math.PI * input.callerActualFirstOrderLowPassTimeConstantSeconds),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerActualFirstOrderLowPassTimeConstantSeconds: 1 },
  output: { result: { value: 0.15915494309189535 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/mems-accelerometer-bandwidth",
  title: "MEMS Accelerometer Bandwidth Calculator",
  description:
    "Restricted MEMS signal chain first order RC\u22123dBbandwidth1/(2\u03c0\u03c4), actual measured/fitted\u03c4, not mechanical resonance/Qor multi-pole manufacturer bandwidth. Actual matched units/topology and independently established parameters; not a safe device/electrical design or verified manufacturer rating.",
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
