import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly projectorCount: number;
  readonly imageWidthPixels: number;
  readonly overlapPercent: number;
}>;
export type Output = Readonly<{
  readonly overlapPixels: number;
  readonly blendedCanvasWidthPixels: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.overlapPercent >= 100)
    simpleError(
      "overlapPercent",
      "Overlap must be less than 100 percent.",
      "invalid_overlap",
    );
  const overlapPixels = (input.imageWidthPixels * input.overlapPercent) / 100;
  return {
    overlapPixels,
    blendedCanvasWidthPixels:
      input.projectorCount * input.imageWidthPixels -
      (input.projectorCount - 1) * overlapPixels,
  };
};

export const exampleInput = {
  projectorCount: 3,
  imageWidthPixels: 1920,
  overlapPercent: 15,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  projectorCount: 1,
  imageWidthPixels: 1920,
  overlapPercent: 15,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      projectorCount: input.projectorCount as number,
      imageWidthPixels: input.imageWidthPixels as number,
      overlapPercent: input.overlapPercent as number,
    }),
  description:
    "Calculate overlap pixels and total blended width for a horizontal projector row.",
  id: "theatre/edge-blend-overlap",
  inputs: [
    {
      id: "projectorCount",
      label: "Projector count",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "imageWidthPixels",
      label: "Image width per projector",
      kind: "integer",
      minimum: 1,
      unit: "px",
    },
    {
      id: "overlapPercent",
      label: "Adjacent overlap",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "overlapPixels",
      label: "Overlap per seam",
      kind: "number",
      minimum: 0,
      unit: "px",
    },
    {
      id: "blendedCanvasWidthPixels",
      label: "Blended canvas width",
      kind: "number",
      minimum: 0,
      unit: "px",
    },
  ],
  title: "Edge-Blend Overlap",
});

export const run = tool.execute;
export default tool;
