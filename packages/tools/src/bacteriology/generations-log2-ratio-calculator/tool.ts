import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly initialCount: number;
  readonly finalCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "initialCount", label: "Initial count", kind: "number" },
  { id: "finalCount", label: "Final count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.initialCount, "initial");
  positive(i.finalCount, "final");
  return {
    signedCountEquivalentGenerations:
      Math.log2(i.finalCount) - Math.log2(i.initialCount),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { initialCount: 100, finalCount: 800 },
  output: { result: { signedCountEquivalentGenerations: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/generations-log2-ratio-calculator",
  title: "Number of Generations n=log2(Nt/N0) Calculator",
  description:
    "Signed observed count-equivalent doublings, decrease retained; not direct cell division history when death/aggregation occurs.",
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
