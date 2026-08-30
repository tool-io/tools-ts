import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sourceBoundaryBp: number;
  readonly observedBoundaryBp: number;
  readonly referenceBoundaryBp: number;
}>;
export type Output = Readonly<{
  readonly spreadExtentBp: number;
  readonly spreadChangeBp: number;
  readonly direction: string;
}>;

export const calculate = (input: Input): Output => {
  const spreadExtentBp = input.observedBoundaryBp - input.sourceBoundaryBp,
    spreadChangeBp =
      spreadExtentBp - (input.referenceBoundaryBp - input.sourceBoundaryBp);
  return {
    spreadExtentBp,
    spreadChangeBp,
    direction:
      spreadChangeBp > 0
        ? "expanded"
        : spreadChangeBp < 0
          ? "contracted"
          : "unchanged",
  };
};

export const exampleInput = {
  sourceBoundaryBp: 100,
  observedBoundaryBp: 500,
  referenceBoundaryBp: 400,
} satisfies Input;
export const exampleOutput = {
  spreadExtentBp: 400,
  spreadChangeBp: 100,
  direction: "expanded",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      sourceBoundaryBp: input.sourceBoundaryBp as number,
      observedBoundaryBp: input.observedBoundaryBp as number,
      referenceBoundaryBp: input.referenceBoundaryBp as number,
    }),
  description: "Measure heterochromatin spread relative to a reference.",
  id: "epigenetics/heterochromatin-spread",
  inputs: [
    { id: "sourceBoundaryBp", label: "Source boundary", kind: "number" },
    { id: "observedBoundaryBp", label: "Observed boundary", kind: "number" },
    { id: "referenceBoundaryBp", label: "Reference boundary", kind: "number" },
  ],
  outputs: [
    { id: "spreadExtentBp", label: "Spread extent", kind: "number" },
    { id: "spreadChangeBp", label: "Spread change", kind: "number" },
    {
      id: "direction",
      label: "Direction",
      kind: "string",
      enum: ["expanded", "contracted", "unchanged"],
    },
  ],
  title: "Heterochromatin Spread",
});

export const run = tool.execute;
export default tool;
