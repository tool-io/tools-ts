import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  start: number;
  end: number;
  steps: number;
  seed: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "start", label: "start", kind: "integer" },
  { id: "end", label: "end", kind: "integer" },
  { id: "steps", label: "steps", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.steps, 1, 127);
  H.int(i.start, -1e6, 1e6);
  H.int(i.end, -1e6, 1e6);
  const count = (i.steps + i.end - i.start) / 2;
  H.int(count, 0, i.steps);
  const up = new Set(H.choosePositions(i.steps, count, random)),
    increments = Array.from({ length: i.steps }, (_, j) =>
      up.has(j) ? 1 : -1,
    ),
    states = [i.start],
    support = H.choose(i.steps, count);
  for (const step of increments) states.push(states.at(-1)! + step);
  return H.finish({
    seed: i.seed,
    increments,
    states,
    support: String(support),
  });
};
export const example = {
  input: { start: 0, end: 0, steps: 4, seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      increments: [1, 1, -1, -1],
      states: [0, 1, 2, 1, 0],
      support: "6",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/fixed-endpoint-unit-walk",
  title: "Random Fixed-Endpoint Unit Walk",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Uniformly sample all unit-step walks with specified start/end and step count by choosing exactly the required up-step subset; impossible endpoint/parity requests reject.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
