import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  initial: number;
  minimum: number;
  maximum: number;
  steps: number;
  seed: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "initial", label: "initial", kind: "integer" },
  { id: "minimum", label: "minimum", kind: "integer" },
  { id: "maximum", label: "maximum", kind: "integer" },
  { id: "steps", label: "steps", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.minimum, -1000000, 1000000);
  H.int(i.maximum, i.minimum + 1, 1000000);
  H.int(i.initial, i.minimum, i.maximum);
  H.int(i.steps, 1, 127);
  const states = [i.initial],
    proposals: number[] = [];
  for (let j = 0; j < i.steps; j++) {
    const step = H.randint(0, 1, random) ? 1 : -1;
    proposals.push(step);
    const old = states.at(-1)!;
    states.push(old === i.minimum || old === i.maximum ? old : old + step);
  }
  return H.finish({ seed: i.seed, states, proposals });
};
export const example = {
  input: { initial: 1, minimum: 0, maximum: 2, steps: 3, seed: "batch56" },
  output: {
    result: { seed: "batch56", states: [1, 0, 0, 0], proposals: [-1, -1, -1] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/absorbing-integer-walk",
  title: "Random Absorbing Integer Walk",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Generate fair independent unit-step proposals and hold at a boundary after the first hit in an explicit bounded integer interval; proposals still draw after absorption for replay.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
