import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly hoist: number;
  readonly fly: number;
  readonly verifiedCrossCenterFlyFraction: number;
  readonly crossWidth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "hoist", label: "Hoist", kind: "number" },
  { id: "fly", label: "Fly", kind: "number" },
  {
    id: "verifiedCrossCenterFlyFraction",
    label: "Verified cross center fly fraction",
    kind: "number",
  },
  { id: "crossWidth", label: "Cross width", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.hoist, "hoist");
  positive(input.fly, "fly");
  positive(input.crossWidth, "crossWidth");
  fraction(
    input.verifiedCrossCenterFlyFraction,
    "verifiedCrossCenterFlyFraction",
  );
  const cx = input.fly * input.verifiedCrossCenterFlyFraction;
  if (
    input.crossWidth > input.hoist ||
    cx < input.crossWidth / 2 ||
    cx + input.crossWidth / 2 > input.fly
  )
    simpleError("cross", "Arms fit explicit field.");
  return {
    verticalCenterX: cx,
    horizontalCenterY: input.hoist / 2,
    verticalEdges: [cx - input.crossWidth / 2, cx + input.crossWidth / 2],
    horizontalEdges: [
      (input.hoist - input.crossWidth) / 2,
      (input.hoist + input.crossWidth) / 2,
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    hoist: 100,
    fly: 160,
    verifiedCrossCenterFlyFraction: 0.375,
    crossWidth: 20,
  },
  output: {
    result: {
      verticalCenterX: 60,
      horizontalCenterY: 50,
      verticalEdges: [50, 70],
      horizontalEdges: [40, 60],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/nordic-cross-offset",
  title: "Nordic Cross Offset Position Calculator",
  description:
    "Nordic cross coordinate construction in hoist-left, top-left y-down frame from independently verified offset/width specification, not a universal family proportion.",
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
