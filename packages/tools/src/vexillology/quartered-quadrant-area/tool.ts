import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly fly: number;
  readonly hoist: number;
  readonly verticalSplitX: number;
  readonly horizontalSplitY: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fly", label: "Fly", kind: "number" },
  { id: "hoist", label: "Hoist", kind: "number" },
  { id: "verticalSplitX", label: "Vertical split x", kind: "number" },
  { id: "horizontalSplitY", label: "Horizontal split y", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.fly, "fly");
  positive(input.hoist, "hoist");
  if (
    input.verticalSplitX < 0 ||
    input.verticalSplitX > input.fly ||
    input.horizontalSplitY < 0 ||
    input.horizontalSplitY > input.hoist
  )
    simpleError("splits", "Inside field.");
  return {
    quadrantAreas: [
      input.verticalSplitX * input.horizontalSplitY,
      (input.fly - input.verticalSplitX) * input.horizontalSplitY,
      input.verticalSplitX * (input.hoist - input.horizontalSplitY),
      (input.fly - input.verticalSplitX) *
        (input.hoist - input.horizontalSplitY),
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { fly: 200, hoist: 100, verticalSplitX: 80, horizontalSplitY: 40 },
  output: { result: { quadrantAreas: [3200, 4800, 4800, 7200] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/quartered-quadrant-area",
  title: "Quartered Field Quadrant Area Calculator",
  description:
    "Actual rectangular flag quadrant areas in viewer row-major order, not assume equal quarters for off-center splits.",
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
