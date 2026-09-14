import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly baseRem: number;
  readonly multipliers: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "baseRem", label: "Base rem", kind: "number" },
  { id: "multipliers", label: "Multipliers", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.baseRem, "base");
  if (!i.multipliers.length || i.multipliers.length > 128)
    simpleError("multipliers", "1–128 steps.");
  i.multipliers.forEach((v) => nonnegative(v, "multiplier"));
  return { spacingRem: i.multipliers.map((v) => v * i.baseRem) };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { baseRem: 0.25, multipliers: [0, 1, 2, 4] },
  output: { result: { spacingRem: [0, 0.25, 0.5, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/rem-based-spacing-scale-generator",
  title: "rem-Based Spacing Scale Generator",
  description:
    "Apply caller selected spacing multipliers to a rem base; no implicit root pixel size.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
