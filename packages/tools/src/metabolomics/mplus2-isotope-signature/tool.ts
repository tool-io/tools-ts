import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly mPlusZeroIntensity: number;
  readonly mPlusTwoIntensity: number;
  readonly chlorineReferencePercent: number;
  readonly sulfurReferencePercent: number;
  readonly maximumDeviationPoints: number;
}>;
export type Output = Readonly<{
  readonly mPlusTwoPercent: number;
  readonly signature: string;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.mPlusZeroIntensity <= 0 ||
    input.mPlusTwoIntensity < 0 ||
    input.maximumDeviationPoints < 0
  )
    simpleError("mPlusZeroIntensity", "Positive monoisotopic signal required.");
  const mPlusTwoPercent =
      (input.mPlusTwoIntensity / input.mPlusZeroIntensity) * 100,
    c = Math.abs(mPlusTwoPercent - input.chlorineReferencePercent),
    s = Math.abs(mPlusTwoPercent - input.sulfurReferencePercent);
  return {
    mPlusTwoPercent,
    signature:
      Math.min(c, s) > input.maximumDeviationPoints
        ? "unmatched"
        : c <= s
          ? "chlorine-like"
          : "sulfur-like",
  };
};
export const exampleInput = {
  mPlusZeroIntensity: 100,
  mPlusTwoIntensity: 30,
  chlorineReferencePercent: 32,
  sulfurReferencePercent: 4,
  maximumDeviationPoints: 5,
} satisfies Input;
export const exampleOutput = {
  mPlusTwoPercent: 30,
  signature: "chlorine-like",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/mplus2-isotope-signature",
  title: "MPLUS2 Isotope Signature",
  description:
    "Compare M+2 isotope intensity with caller-provided chlorine/sulfur references.",
  inputs: [
    {
      id: "mPlusZeroIntensity",
      kind: "number",
      label: "M plus zero intensity",
    },
    { id: "mPlusTwoIntensity", kind: "number", label: "M plus two intensity" },
    {
      id: "chlorineReferencePercent",
      kind: "number",
      label: "Chlorine reference percent",
    },
    {
      id: "sulfurReferencePercent",
      kind: "number",
      label: "Sulfur reference percent",
    },
    {
      id: "maximumDeviationPoints",
      kind: "number",
      label: "Maximum deviation points",
    },
  ],
  outputs: [
    { id: "mPlusTwoPercent", kind: "number", label: "M plus two percent" },
    { id: "signature", kind: "string", label: "Signature" },
  ],
  calculate: (value) =>
    calculate({
      mPlusZeroIntensity: value.mPlusZeroIntensity as number,
      mPlusTwoIntensity: value.mPlusTwoIntensity as number,
      chlorineReferencePercent: value.chlorineReferencePercent as number,
      sulfurReferencePercent: value.sulfurReferencePercent as number,
      maximumDeviationPoints: value.maximumDeviationPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
