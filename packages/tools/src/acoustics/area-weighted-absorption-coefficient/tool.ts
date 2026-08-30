import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AreaWeightedAbsorptionCoefficientInput = Readonly<{
  readonly firstSquareMeters: number;
  readonly firstCoefficient: number;
  readonly secondSquareMeters: number;
  readonly secondCoefficient: number;
}>;
export type AreaWeightedAbsorptionCoefficientOutput = Readonly<{
  readonly meanCoefficient: number;
}>;

export const calculateAreaWeightedAbsorptionCoefficient = (
  x: AreaWeightedAbsorptionCoefficientInput,
): AreaWeightedAbsorptionCoefficientOutput => {
  if (!Number.isFinite(x.firstSquareMeters) || x.firstSquareMeters < 0)
    simpleError("firstSquareMeters", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.firstCoefficient) || x.firstCoefficient < 0)
    simpleError("firstCoefficient", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.secondSquareMeters) || x.secondSquareMeters < 0)
    simpleError("secondSquareMeters", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.secondCoefficient) || x.secondCoefficient < 0)
    simpleError("secondCoefficient", "Provide a finite nonnegative number.");
  if (!(
    x.firstCoefficient <= 1 &&
    x.secondCoefficient <= 1 &&
    x.firstSquareMeters + x.secondSquareMeters > 0
  ))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const meanCoefficient =
    (x.firstSquareMeters * x.firstCoefficient +
      x.secondSquareMeters * x.secondCoefficient) /
    (x.firstSquareMeters + x.secondSquareMeters);
  if (!Number.isFinite(meanCoefficient))
    simpleError(
      "meanCoefficient",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    meanCoefficient: Object.is(meanCoefficient, -0) ? 0 : meanCoefficient,
  };
};

export const example = {
  input: {
    firstSquareMeters: 50,
    firstCoefficient: 0.2,
    secondSquareMeters: 50,
    secondCoefficient: 0.4,
  },
  output: { meanCoefficient: 0.3 },
} satisfies ToolExample<
  AreaWeightedAbsorptionCoefficientInput,
  AreaWeightedAbsorptionCoefficientOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/area-weighted-absorption-coefficient",
  title: "Area Weighted Absorption Coefficient",
  description:
    "Area-weighted mean absorption coefficient of two surface materials.",
  inputs: [
    {
      id: "firstSquareMeters",
      kind: "number",
      label: "First Square Meters",
      unit: "m2",
      minimum: 0,
    },
    {
      id: "firstCoefficient",
      kind: "number",
      label: "First Coefficient",
      minimum: 0,
    },
    {
      id: "secondSquareMeters",
      kind: "number",
      label: "Second Square Meters",
      unit: "m2",
      minimum: 0,
    },
    {
      id: "secondCoefficient",
      kind: "number",
      label: "Second Coefficient",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "meanCoefficient", kind: "number", label: "Mean Coefficient" },
  ],
  calculate: (input) =>
    calculateAreaWeightedAbsorptionCoefficient({
      firstSquareMeters: input.firstSquareMeters as number,
      firstCoefficient: input.firstCoefficient as number,
      secondSquareMeters: input.secondSquareMeters as number,
      secondCoefficient: input.secondCoefficient as number,
    }),
});
export const areaWeightedAbsorptionCoefficientTool = tool;
export const runAreaWeightedAbsorptionCoefficient = tool.execute;
export default tool;
