import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly horizontalOrder: number;
  readonly verticalOrder: number;
  readonly xOverWaist: number;
  readonly yOverWaist: number;
}>;
export type Output = Readonly<{
  readonly relativeIntensity: number;
  readonly modeLabel: string;
}>;

export const calculate = (input: Input): Output => {
  const hx =
    input.horizontalOrder === 0 ? 1 : 2 * Math.SQRT2 * input.xOverWaist;
  const hy = input.verticalOrder === 0 ? 1 : 2 * Math.SQRT2 * input.yOverWaist;
  const relativeIntensity =
    hx *
    hx *
    hy *
    hy *
    Math.exp(-2 * (input.xOverWaist ** 2 + input.yOverWaist ** 2));
  return {
    relativeIntensity,
    modeLabel: `TEM${input.horizontalOrder}${input.verticalOrder}` as
      "TEM00" | "TEM01" | "TEM10" | "TEM11",
  };
};

export const exampleInput = {
  horizontalOrder: 0,
  verticalOrder: 0,
  xOverWaist: 0,
  yOverWaist: 0,
} satisfies Input;
export const exampleOutput = {
  relativeIntensity: 1,
  modeLabel: "TEM00",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      horizontalOrder: input.horizontalOrder as number,
      verticalOrder: input.verticalOrder as number,
      xOverWaist: input.xOverWaist as number,
      yOverWaist: input.yOverWaist as number,
    }),
  description:
    "Evaluate low-order Hermite–Gaussian transverse-mode intensity at a normalized coordinate.",
  id: "laser/hermite-gaussian-mode-profile",
  inputs: [
    {
      id: "horizontalOrder",
      label: "Horizontal mode order",
      kind: "integer",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "verticalOrder",
      label: "Vertical mode order",
      kind: "integer",
      minimum: 0,
      maximum: 1,
    },
    { id: "xOverWaist", label: "Normalized X coordinate", kind: "number" },
    { id: "yOverWaist", label: "Normalized Y coordinate", kind: "number" },
  ],
  outputs: [
    {
      id: "relativeIntensity",
      label: "Unnormalized Hermite–Gaussian intensity",
      kind: "number",
      minimum: 0,
    },
    {
      id: "modeLabel",
      label: "Mode label",
      kind: "string",
      enum: ["TEM00", "TEM01", "TEM10", "TEM11"],
    },
  ],
  title: "Hermite\u2013Gaussian Mode Profile",
});

export const run = tool.execute;
export default tool;
