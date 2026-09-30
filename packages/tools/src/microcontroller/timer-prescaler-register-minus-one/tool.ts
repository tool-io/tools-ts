import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  prescalerDivisor: number;
  registerBits: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "prescalerDivisor", label: "Prescaler divisor", kind: "integer" },
  { id: "registerBits", label: "Register bits", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.registerBits, 1, 32);
  H.int(i.prescalerDivisor, 1, 2 ** i.registerBits);
  return H.finish({ registerValue: i.prescalerDivisor - 1 });
};
export const example = {
  input: { prescalerDivisor: 16, registerBits: 8 },
  output: { result: { registerValue: 15 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "microcontroller/timer-prescaler-register-minus-one",
  title: "Microcontroller: Timer Prescaler Register Minus One Tool",
  description:
    "Encode an explicitly declared timer divide-by-(register+1) prescaler, validating register capacity; does not assume this convention applies to every microcontroller.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { registerValue: { type: "number" } },
        required: ["registerValue"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
