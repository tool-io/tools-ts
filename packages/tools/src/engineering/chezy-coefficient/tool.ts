import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChezyCoefficientInput = Readonly<{
  readonly manningN: number;
  readonly hydraulicRadiusMeters: number;
}>;
export type ChezyCoefficientOutput = Readonly<{
  readonly chezyMetersHalfPerSecond: number;
}>;

export const calculateChezyCoefficient = (
  x: ChezyCoefficientInput,
): ChezyCoefficientOutput => {
  if (!Number.isFinite(x.manningN) || x.manningN < 0)
    simpleError("manningN", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.hydraulicRadiusMeters) || x.hydraulicRadiusMeters < 0)
    simpleError("hydraulicRadiusMeters", "Provide a finite number at least 0.");
  const chezyMetersHalfPerSecond =
    x.hydraulicRadiusMeters ** (1 / 6) / x.manningN;
  if (!Number.isFinite(chezyMetersHalfPerSecond))
    simpleError(
      "chezyMetersHalfPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    chezyMetersHalfPerSecond: Object.is(chezyMetersHalfPerSecond, -0)
      ? 0
      : chezyMetersHalfPerSecond,
  };
};

export const example = {
  input: { manningN: 0.03, hydraulicRadiusMeters: 1 },
  output: { chezyMetersHalfPerSecond: 33.333333333333336 },
} satisfies ToolExample<ChezyCoefficientInput, ChezyCoefficientOutput>;

export const tool = createSimpleTool({
  id: "engineering/chezy-coefficient",
  title: "Chezy Coefficient",
  description:
    "Chezy velocity coefficient derived from Manning roughness and hydraulic radius in SI units: C=R^(1/6)/n.",
  inputs: [
    { id: "manningN", kind: "number", label: "Manning N", minimum: 0 },
    {
      id: "hydraulicRadiusMeters",
      kind: "number",
      label: "Hydraulic Radius Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "chezyMetersHalfPerSecond",
      kind: "number",
      label: "Chezy Meters Half Per Second",
      unit: "m^0.5/s",
    },
  ],
  calculate: (input) =>
    calculateChezyCoefficient({
      manningN: input.manningN as number,
      hydraulicRadiusMeters: input.hydraulicRadiusMeters as number,
    }),
});
export const chezyCoefficientTool = tool;
export const runChezyCoefficient = tool.execute;
export default tool;
