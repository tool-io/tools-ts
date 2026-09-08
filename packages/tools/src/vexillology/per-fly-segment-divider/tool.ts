import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bands,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly fly: number;
  readonly callerOrderedFlyWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fly", label: "Fly", kind: "number" },
  {
    id: "callerOrderedFlyWeights",
    label: "Caller ordered fly weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.callerOrderedFlyWeights.length !== 3)
    simpleError("segments", "Exactly three explicit hoist-to-fly weights.");
  return bands(input.fly, input.callerOrderedFlyWeights);
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { fly: 180, callerOrderedFlyWeights: [1, 1, 1] },
  output: { result: { boundaries: [0, 60, 120, 180], widths: [60, 60, 60] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/per-fly-segment-divider",
  title: "Triband Per-Fly Segment Divider",
  description:
    "Ordered per-fly triband boundary positions along hoist-to-fly axis; caller tincture order independent.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
