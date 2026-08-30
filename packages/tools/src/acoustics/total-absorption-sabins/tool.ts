import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TotalAbsorptionSabinsInput = Readonly<{
  readonly surfaceSquareMeters: number;
  readonly absorptionCoefficient: number;
}>;
export type TotalAbsorptionSabinsOutput = Readonly<{
  readonly absorptionSabins: number;
}>;

export const calculateTotalAbsorptionSabins = (
  x: TotalAbsorptionSabinsInput,
): TotalAbsorptionSabinsOutput => {
  if (!Number.isFinite(x.surfaceSquareMeters) || x.surfaceSquareMeters < 0)
    simpleError("surfaceSquareMeters", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.absorptionCoefficient) || x.absorptionCoefficient < 0)
    simpleError(
      "absorptionCoefficient",
      "Provide a finite nonnegative number.",
    );
  if (!(x.absorptionCoefficient <= 1))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const absorptionSabins = x.surfaceSquareMeters * x.absorptionCoefficient;
  if (!Number.isFinite(absorptionSabins))
    simpleError(
      "absorptionSabins",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    absorptionSabins: Object.is(absorptionSabins, -0) ? 0 : absorptionSabins,
  };
};

export const example = {
  input: {
    surfaceSquareMeters: 100,
    absorptionCoefficient: 0.2,
  },
  output: { absorptionSabins: 20 },
} satisfies ToolExample<
  TotalAbsorptionSabinsInput,
  TotalAbsorptionSabinsOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/total-absorption-sabins",
  title: "Total Absorption Sabins",
  description:
    "Equivalent sound absorption area in metric sabins from surface area and absorption coefficient.",
  inputs: [
    {
      id: "surfaceSquareMeters",
      kind: "number",
      label: "Surface Square Meters",
      unit: "m2",
      minimum: 0,
    },
    {
      id: "absorptionCoefficient",
      kind: "number",
      label: "Absorption Coefficient",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "absorptionSabins",
      kind: "number",
      label: "Absorption Sabins",
      unit: "m2",
    },
  ],
  calculate: (input) =>
    calculateTotalAbsorptionSabins({
      surfaceSquareMeters: input.surfaceSquareMeters as number,
      absorptionCoefficient: input.absorptionCoefficient as number,
    }),
});
export const totalAbsorptionSabinsTool = tool;
export const runTotalAbsorptionSabins = tool.execute;
export default tool;
