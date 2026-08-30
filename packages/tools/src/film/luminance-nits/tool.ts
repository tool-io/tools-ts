import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LuminanceNitsInput = Readonly<{
  readonly intensityCandelas: number;
  readonly projectedAreaSquareMeters: number;
}>;
export type LuminanceNitsOutput = Readonly<{
  readonly luminanceNits: number;
}>;

export const calculateLuminanceNits = (
  x: LuminanceNitsInput,
): LuminanceNitsOutput => {
  if (!Number.isFinite(x.intensityCandelas) || x.intensityCandelas < 0)
    simpleError("intensityCandelas", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.projectedAreaSquareMeters) ||
    x.projectedAreaSquareMeters < 0
  )
    simpleError(
      "projectedAreaSquareMeters",
      "Provide a finite number at least 0.",
    );
  const luminanceNits = x.intensityCandelas / x.projectedAreaSquareMeters;
  if (!Number.isFinite(luminanceNits))
    simpleError(
      "luminanceNits",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { luminanceNits: Object.is(luminanceNits, -0) ? 0 : luminanceNits };
};

export const example = {
  input: { intensityCandelas: 100, projectedAreaSquareMeters: 1 },
  output: { luminanceNits: 100 },
} satisfies ToolExample<LuminanceNitsInput, LuminanceNitsOutput>;

export const tool = createSimpleTool({
  id: "film/luminance-nits",
  title: "Luminance Nits",
  description:
    "Directional luminance in nits (cd/m²) from luminous intensity in candelas divided by projected emitting area.",
  inputs: [
    {
      id: "intensityCandelas",
      kind: "number",
      label: "Intensity Candelas",
      unit: "cd",
      minimum: 0,
    },
    {
      id: "projectedAreaSquareMeters",
      kind: "number",
      label: "Projected Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "luminanceNits",
      kind: "number",
      label: "Luminance Nits",
      unit: "cd/m²",
    },
  ],
  calculate: (input) =>
    calculateLuminanceNits({
      intensityCandelas: input.intensityCandelas as number,
      projectedAreaSquareMeters: input.projectedAreaSquareMeters as number,
    }),
});
export const luminanceNitsTool = tool;
export const runLuminanceNits = tool.execute;
export default tool;
