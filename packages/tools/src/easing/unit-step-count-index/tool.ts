import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  t: number;
  steps: number;
  jumpAtStart: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "t", label: "t", kind: "number" },
  { id: "steps", label: "steps", kind: "integer" },
  { id: "jumpAtStart", label: "jumpAtStart", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.unit(i.t);
  H.int(i.steps, 1, 1e6);
  const index = Math.min(
    i.steps,
    Math.floor(i.t * i.steps) + (i.jumpAtStart ? 1 : 0),
  );
  return H.finish({ index, value: index / i.steps });
};
export const example = {
  input: { t: 0.25, steps: 4, jumpAtStart: false },
  output: { result: { index: 1, value: 0.25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "easing/unit-step-count-index",
  title: "Unit Step Count Index",
  description:
    "Evaluate a unit step-end or step-start index with explicit positive count; both modes cap at the final step at progress one.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
