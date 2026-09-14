import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly baselinePx: number;
  readonly multiplier: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "baselinePx", label: "Baseline px", kind: "number" },
  { id: "multiplier", label: "Multiplier", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.baselinePx, "base");
  bounded(i.multiplier, "multiplier", 0, 1000000);
  return { spacingPx: i.baselinePx * i.multiplier };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { baselinePx: 4, multiplier: 6 },
  output: { result: { spacingPx: 24 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/vertical-rhythm-multiplier-base-unit",
  title: "Vertical Rhythm Multiplier Base Unit",
  description:
    "Vertical rhythm spacing from a caller baseline unit and integer multiplier.",
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
