import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PicaToInchesInput = Readonly<{
  readonly picas: number;
}>;
export type PicaToInchesOutput = Readonly<{
  readonly inches: number;
}>;

export const calculatePicaToInches = (
  x: PicaToInchesInput,
): PicaToInchesOutput => {
  if (!Number.isFinite(x.picas) || x.picas < 0)
    simpleError("picas", "Provide a finite nonnegative number.");
  const inches = x.picas / 6;
  if (!Number.isFinite(inches))
    simpleError(
      "inches",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { inches: Object.is(inches, -0) ? 0 : inches };
};

export const example = {
  input: {
    picas: 6,
  },
  output: { inches: 1 },
} satisfies ToolExample<PicaToInchesInput, PicaToInchesOutput>;

export const tool = createSimpleTool({
  id: "typography/pica-to-inches",
  title: "Pica To Inches",
  description: "CSS inches from picas: six picas make one CSS inch.",
  inputs: [
    { id: "picas", kind: "number", label: "Picas", unit: "pc", minimum: 0 },
  ],
  outputs: [{ id: "inches", kind: "number", label: "Inches", unit: "in" }],
  calculate: (input) =>
    calculatePicaToInches({
      picas: input.picas as number,
    }),
});
export const picaToInchesTool = tool;
export const runPicaToInches = tool.execute;
export default tool;
