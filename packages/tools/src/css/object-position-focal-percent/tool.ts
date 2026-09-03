import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly contentWidthPx: number;
  readonly contentHeightPx: number;
  readonly renderedObjectWidthPx: number;
  readonly renderedObjectHeightPx: number;
  readonly positionXPercent: number;
  readonly positionYPercent: number;
}>;
export type Output = Readonly<{
  readonly objectOffsetX: number;
  readonly objectOffsetY: number;
}>;
const inputFields = [
  { id: "contentWidthPx", label: "Content width px", kind: "number" },
  { id: "contentHeightPx", label: "Content height px", kind: "number" },
  {
    id: "renderedObjectWidthPx",
    label: "Rendered object width px",
    kind: "number",
  },
  {
    id: "renderedObjectHeightPx",
    label: "Rendered object height px",
    kind: "number",
  },
  { id: "positionXPercent", label: "Position x percent", kind: "number" },
  { id: "positionYPercent", label: "Position y percent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.contentWidthPx, "contentWidthPx");
  nonnegative(input.contentHeightPx, "contentHeightPx");
  nonnegative(input.renderedObjectWidthPx, "renderedObjectWidthPx");
  nonnegative(input.renderedObjectHeightPx, "renderedObjectHeightPx");
  return {
    objectOffsetX:
      ((input.contentWidthPx - input.renderedObjectWidthPx) *
        input.positionXPercent) /
      100,
    objectOffsetY:
      ((input.contentHeightPx - input.renderedObjectHeightPx) *
        input.positionYPercent) /
      100,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  contentWidthPx: 100,
  contentHeightPx: 80,
  renderedObjectWidthPx: 200,
  renderedObjectHeightPx: 100,
  positionXPercent: 25,
  positionYPercent: 50,
} satisfies Input;
export const exampleOutput = {
  objectOffsetX: -25,
  objectOffsetY: -10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/object-position-focal-percent",
  title: "object-position Focal Percent Placement",
  description:
    "Two-axis object-position percentage alignment for independently rendered object size, not percent of source focal coordinate, object-fit scaling or background-position alias. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "objectOffsetX", label: "Object offset x", kind: "number" },
    { id: "objectOffsetY", label: "Object offset y", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      contentWidthPx: value.contentWidthPx as number,
      contentHeightPx: value.contentHeightPx as number,
      renderedObjectWidthPx: value.renderedObjectWidthPx as number,
      renderedObjectHeightPx: value.renderedObjectHeightPx as number,
      positionXPercent: value.positionXPercent as number,
      positionYPercent: value.positionYPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
