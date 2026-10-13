import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{ readonly acceptedCounters: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "acceptedCounters", label: "Accepted counters", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  bounded(i.acceptedCounters, "counters", 1, 1000000);
  return { idealBlindGuessProbability: 1 - (1 - 1e-6) ** i.acceptedCounters };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { acceptedCounters: 1 },
  output: { result: { idealBlindGuessProbability: 1e-6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/otp-code-six-digit-hotp-window-lookup",
  title: "HOTP 6-Digit Window Lookup",
  description:
    "Ideal independent uniform six-digit HOTP acceptance probability per blind attempt over caller accepted counter window; does not generate/verify HOTP or model throttling.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { idealBlindGuessProbability: { type: "number" } },
        required: ["idealBlindGuessProbability"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
