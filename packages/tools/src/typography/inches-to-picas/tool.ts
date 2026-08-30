import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InchesToPicasInput = Readonly<{
  readonly inches: number;
}>;
export type InchesToPicasOutput = Readonly<{
  readonly picas: number;
}>;

export const calculateInchesToPicas = (
  x: InchesToPicasInput,
): InchesToPicasOutput => {
  if (!Number.isFinite(x.inches) || x.inches < 0)
    simpleError("inches", "Provide a finite nonnegative number.");
  const picas = 6 * x.inches;
  if (!Number.isFinite(picas))
    simpleError("picas", "Inputs produce an undefined or out-of-range result.");
  return { picas: Object.is(picas, -0) ? 0 : picas };
};

export const example = {
  input: {
    inches: 1,
  },
  output: { picas: 6 },
} satisfies ToolExample<InchesToPicasInput, InchesToPicasOutput>;

export const tool = createSimpleTool({
  id: "typography/inches-to-picas",
  title: "Inches To Picas",
  description: "CSS picas from inches: one pica is 1/6 of a CSS inch.",
  inputs: [
    { id: "inches", kind: "number", label: "Inches", unit: "in", minimum: 0 },
  ],
  outputs: [{ id: "picas", kind: "number", label: "Picas", unit: "pc" }],
  calculate: (input) =>
    calculateInchesToPicas({
      inches: input.inches as number,
    }),
});
export const inchesToPicasTool = tool;
export const runInchesToPicas = tool.execute;
export default tool;
