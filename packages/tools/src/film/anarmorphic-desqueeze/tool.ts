import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AnarmorphicDesqueezeInput = Readonly<{
  readonly recordedWidthPixels: number;
  readonly squeezeFactor: number;
}>;
export type AnarmorphicDesqueezeOutput = Readonly<{
  readonly displayWidthPixels: number;
}>;

export const calculateAnarmorphicDesqueeze = (
  x: AnarmorphicDesqueezeInput,
): AnarmorphicDesqueezeOutput => {
  if (!Number.isFinite(x.recordedWidthPixels) || x.recordedWidthPixels < 1)
    simpleError("recordedWidthPixels", "Provide a finite number at least 1.");
  if (!Number.isFinite(x.squeezeFactor) || x.squeezeFactor < 0)
    simpleError("squeezeFactor", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.recordedWidthPixels))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const displayWidthPixels = x.recordedWidthPixels * x.squeezeFactor;
  if (!Number.isFinite(displayWidthPixels))
    simpleError(
      "displayWidthPixels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    displayWidthPixels: Object.is(displayWidthPixels, -0)
      ? 0
      : displayWidthPixels,
  };
};

export const example = {
  input: { recordedWidthPixels: 1920, squeezeFactor: 2 },
  output: { displayWidthPixels: 3840 },
} satisfies ToolExample<AnarmorphicDesqueezeInput, AnarmorphicDesqueezeOutput>;

export const tool = createSimpleTool({
  id: "film/anarmorphic-desqueeze",
  title: "Anarmorphic Desqueeze",
  description:
    "Display width in pixels after horizontal desqueeze of recorded anamorphic pixels by the supplied squeeze factor.",
  inputs: [
    {
      id: "recordedWidthPixels",
      kind: "integer",
      label: "Recorded Width Pixels",
      unit: "px",
      minimum: 1,
    },
    {
      id: "squeezeFactor",
      kind: "number",
      label: "Squeeze Factor",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "displayWidthPixels",
      kind: "number",
      label: "Display Width Pixels",
      unit: "px",
    },
  ],
  calculate: (input) =>
    calculateAnarmorphicDesqueeze({
      recordedWidthPixels: input.recordedWidthPixels as number,
      squeezeFactor: input.squeezeFactor as number,
    }),
});
export const anarmorphicDesqueezeTool = tool;
export const runAnarmorphicDesqueeze = tool.execute;
export default tool;
