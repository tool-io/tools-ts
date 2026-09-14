import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly denominatorA: number;
  readonly denominatorB: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "denominatorA", label: "Denominator a", kind: "number" },
  { id: "denominatorB", label: "Denominator b", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.denominatorA, "A");
  positive(i.denominatorB, "B");
  return {
    largerScale:
      i.denominatorA === i.denominatorB
        ? "tie"
        : i.denominatorA < i.denominatorB
          ? "A"
          : "B",
    linearDetailRatioAtoB: i.denominatorB / i.denominatorA,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { denominatorA: 10000, denominatorB: 20000 },
  output: { result: { largerScale: "A", linearDetailRatioAtoB: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/scale-denominator-comparator",
  title: "Map Scale 1:x Denominator Comparator",
  description:
    "Compare representative fractions: smaller denominator is larger scale; no actual map accuracy implication.",
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
