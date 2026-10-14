import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, erfc } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualEbNoLinear: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualEbNoLinear", label: "Actual eb no linear", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(input.actualEbNoLinear, "actualEbNoLinear");
  return { value: 0.5 * erfc(Math.sqrt(input.actualEbNoLinear)) };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualEbNoLinear: 1 },
  output: { result: { value: 0.07864960611999666 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/bit-error-rate-from-snr",
  title: "Bit Error Rate From Snr Calculator",
  description:
    "Explicit coherentBPSKAWGNBER=.5erfc(\u221aEb/N0), bit-energy signal to noise linear not arbitrary SNR or other modulation/fading. Actual matched units/topology and independently established parameters; not a safe device/electrical design or verified manufacturer rating.",
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
