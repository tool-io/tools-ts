import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  initial: number;
  minimum: number;
  maximum: number;
  steps: number;
  stepMinimum: number;
  stepMaximum: number;
  seed: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "initial", label: "initial", kind: "integer" },
  { id: "minimum", label: "minimum", kind: "integer" },
  { id: "maximum", label: "maximum", kind: "integer" },
  { id: "steps", label: "steps", kind: "integer" },
  { id: "stepMinimum", label: "stepMinimum", kind: "integer" },
  { id: "stepMaximum", label: "stepMaximum", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.minimum, -1000000, 1000000);
  H.int(i.maximum, i.minimum, 1000000);
  H.int(i.initial, i.minimum, i.maximum);
  H.int(i.stepMinimum, -1000000, 1000000);
  H.int(i.stepMaximum, i.stepMinimum, 1000000);
  H.int(i.steps, 1, 127);
  const increments = Array.from({ length: i.steps }, () =>
      H.randint(i.stepMinimum, i.stepMaximum, random),
    ),
    states = [i.initial];
  for (const step of increments) {
    const value = states.at(-1)! + step;
    states.push(Math.max(i.minimum, Math.min(i.maximum, value)));
  }
  return H.finish({ seed: i.seed, increments, states });
};
export const example = {
  input: {
    initial: 1,
    minimum: 0,
    maximum: 3,
    steps: 3,
    stepMinimum: -1,
    stepMaximum: 1,
    seed: "batch56",
  },
  output: {
    result: { seed: "batch56", increments: [-1, -1, -1], states: [1, 0, 0, 0] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/saturating-counter-input-trace",
  title: "Random Saturating Counter Input Trace",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Draw independent uniform bounded integer increments and saturate each result to explicit inclusive endpoints; not uniform over final states or hardware fault behavior.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
