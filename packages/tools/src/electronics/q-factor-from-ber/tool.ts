import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  fraction,
  normalQuantile,
} from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualMeasuredBerFraction: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredBerFraction",
    label: "Actual measured ber fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.actualMeasuredBerFraction, "actualMeasuredBerFraction");
  if (
    input.actualMeasuredBerFraction <= 0 ||
    input.actualMeasuredBerFraction >= 1
  )
    simpleError("BER", "Actual interior BER.");
  return { value: normalQuantile(1 - input.actualMeasuredBerFraction) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualMeasuredBerFraction: 0.5 },
  output: { result: { value: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/q-factor-from-ber",
  title: "Q Factor From Ber Calculator",
  description:
    "Gaussian Qfactor from BER=1\u2212\u03a6(Q), actual0<BER<1; not optical power factor or universal modulation inverse. Actual matched units/topology and independently established parameters; not a safe device/electrical design or verified manufacturer rating.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
