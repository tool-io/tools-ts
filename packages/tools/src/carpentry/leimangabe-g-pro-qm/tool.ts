import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeimangabeGProQmInput = Readonly<{
  readonly adhesiveGrams: number;
  readonly coatedSquareMeters: number;
}>;
export type LeimangabeGProQmOutput = Readonly<{
  readonly gramsPerSquareMeter: number;
}>;

export const calculateLeimangabeGProQm = (
  x: LeimangabeGProQmInput,
): LeimangabeGProQmOutput => {
  if (!Number.isFinite(x.adhesiveGrams) || x.adhesiveGrams < 0)
    simpleError("adhesiveGrams", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.coatedSquareMeters) || x.coatedSquareMeters < 0)
    simpleError("coatedSquareMeters", "Provide a finite number at least 0.");
  const gramsPerSquareMeter = x.adhesiveGrams / x.coatedSquareMeters;
  if (!Number.isFinite(gramsPerSquareMeter))
    simpleError(
      "gramsPerSquareMeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    gramsPerSquareMeter: Object.is(gramsPerSquareMeter, -0)
      ? 0
      : gramsPerSquareMeter,
  };
};

export const example = {
  input: { adhesiveGrams: 200, coatedSquareMeters: 1 },
  output: { gramsPerSquareMeter: 200 },
} satisfies ToolExample<LeimangabeGProQmInput, LeimangabeGProQmOutput>;

export const tool = createSimpleTool({
  id: "carpentry/leimangabe-g-pro-qm",
  title: "Leimangabe G Pro Qm",
  description:
    "Applied adhesive spread rate in grams per square meter of coated surface, not the area of both faces unless both were coated.",
  inputs: [
    {
      id: "adhesiveGrams",
      kind: "number",
      label: "Adhesive Grams",
      unit: "g",
      minimum: 0,
    },
    {
      id: "coatedSquareMeters",
      kind: "number",
      label: "Coated Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "gramsPerSquareMeter",
      kind: "number",
      label: "Grams Per Square Meter",
      unit: "g/m²",
    },
  ],
  calculate: (input) =>
    calculateLeimangabeGProQm({
      adhesiveGrams: input.adhesiveGrams as number,
      coatedSquareMeters: input.coatedSquareMeters as number,
    }),
});
export const leimangabeGProQmTool = tool;
export const runLeimangabeGProQm = tool.execute;
export default tool;
