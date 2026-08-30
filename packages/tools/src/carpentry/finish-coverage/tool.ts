import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FinishCoverageInput = Readonly<{
  readonly finishLiters: number;
  readonly coverageSquareMetersPerLiter: number;
  readonly coatCount: number;
}>;
export type FinishCoverageOutput = Readonly<{
  readonly finishedSquareMeters: number;
}>;

export const calculateFinishCoverage = (
  x: FinishCoverageInput,
): FinishCoverageOutput => {
  if (!Number.isFinite(x.finishLiters) || x.finishLiters < 0)
    simpleError("finishLiters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.coverageSquareMetersPerLiter) ||
    x.coverageSquareMetersPerLiter < 0
  )
    simpleError(
      "coverageSquareMetersPerLiter",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.coatCount) ||
    !Number.isSafeInteger(x.coatCount) ||
    x.coatCount < 0
  )
    simpleError("coatCount", "Provide a safe integer at least 0.");
  if (!Number.isSafeInteger(x.coatCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const finishedSquareMeters =
    (x.finishLiters * x.coverageSquareMetersPerLiter) / x.coatCount;
  if (!Number.isFinite(finishedSquareMeters))
    simpleError(
      "finishedSquareMeters",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    finishedSquareMeters: Object.is(finishedSquareMeters, -0)
      ? 0
      : finishedSquareMeters,
  };
};

export const example = {
  input: { finishLiters: 2, coverageSquareMetersPerLiter: 10, coatCount: 2 },
  output: { finishedSquareMeters: 10 },
} satisfies ToolExample<FinishCoverageInput, FinishCoverageOutput>;

export const tool = createSimpleTool({
  id: "carpentry/finish-coverage",
  title: "Finish Coverage",
  description:
    "Coatable surface area from available finish volume, manufacturer-stated coverage per liter and number of coats.",
  inputs: [
    {
      id: "finishLiters",
      kind: "number",
      label: "Finish Liters",
      unit: "L",
      minimum: 0,
    },
    {
      id: "coverageSquareMetersPerLiter",
      kind: "number",
      label: "Coverage Square Meters Per Liter",
      unit: "m²/L",
      minimum: 0,
    },
    { id: "coatCount", kind: "integer", label: "Coat Count", minimum: 0 },
  ],
  outputs: [
    {
      id: "finishedSquareMeters",
      kind: "number",
      label: "Finished Square Meters",
      unit: "m²",
    },
  ],
  calculate: (input) =>
    calculateFinishCoverage({
      finishLiters: input.finishLiters as number,
      coverageSquareMetersPerLiter:
        input.coverageSquareMetersPerLiter as number,
      coatCount: input.coatCount as number,
    }),
});
export const finishCoverageTool = tool;
export const runFinishCoverage = tool.execute;
export default tool;
