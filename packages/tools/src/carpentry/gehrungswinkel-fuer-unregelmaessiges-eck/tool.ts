import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GehrungswinkelFuerUnregelmaessigesEckInput = Readonly<{
  readonly includedCornerDegrees: number;
}>;
export type GehrungswinkelFuerUnregelmaessigesEckOutput = Readonly<{
  readonly miterDegrees: number;
}>;

export const calculateGehrungswinkelFuerUnregelmaessigesEck = (
  x: GehrungswinkelFuerUnregelmaessigesEckInput,
): GehrungswinkelFuerUnregelmaessigesEckOutput => {
  if (!Number.isFinite(x.includedCornerDegrees) || x.includedCornerDegrees < 0)
    simpleError("includedCornerDegrees", "Provide a finite number at least 0.");
  if (x.includedCornerDegrees >= 180)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const miterDegrees = x.includedCornerDegrees / 2;
  if (!Number.isFinite(miterDegrees))
    simpleError(
      "miterDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { miterDegrees: Object.is(miterDegrees, -0) ? 0 : miterDegrees };
};

export const example = {
  input: { includedCornerDegrees: 92 },
  output: { miterDegrees: 46 },
} satisfies ToolExample<
  GehrungswinkelFuerUnregelmaessigesEckInput,
  GehrungswinkelFuerUnregelmaessigesEckOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/gehrungswinkel-fuer-unregelmaessiges-eck",
  title: "Gehrungswinkel Fuer Unregelmaessiges Eck",
  description:
    "Equal miter-saw angle for two pieces meeting at a measured non-square included corner; each piece receives half the corner angle.",
  inputs: [
    {
      id: "includedCornerDegrees",
      kind: "number",
      label: "Included Corner Degrees",
      unit: "°",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "miterDegrees", kind: "number", label: "Miter Degrees", unit: "°" },
  ],
  calculate: (input) =>
    calculateGehrungswinkelFuerUnregelmaessigesEck({
      includedCornerDegrees: input.includedCornerDegrees as number,
    }),
});
export const gehrungswinkelFuerUnregelmaessigesEckTool = tool;
export const runGehrungswinkelFuerUnregelmaessigesEck = tool.execute;
export default tool;
