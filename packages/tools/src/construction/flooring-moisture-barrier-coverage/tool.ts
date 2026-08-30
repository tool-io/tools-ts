import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlooringMoistureBarrierCoverageInput = Readonly<{
  readonly floorSquareMeters: number;
  readonly effectiveSquareMetersPerRoll: number;
}>;
export type FlooringMoistureBarrierCoverageOutput = Readonly<{
  readonly rollCount: number;
}>;

export const calculateFlooringMoistureBarrierCoverage = (
  x: FlooringMoistureBarrierCoverageInput,
): FlooringMoistureBarrierCoverageOutput => {
  if (!Number.isFinite(x.floorSquareMeters) || x.floorSquareMeters < 0)
    simpleError("floorSquareMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.effectiveSquareMetersPerRoll) ||
    x.effectiveSquareMetersPerRoll < 0
  )
    simpleError(
      "effectiveSquareMetersPerRoll",
      "Provide a finite number at least 0.",
    );
  const rollCount = Math.ceil(
    x.floorSquareMeters / x.effectiveSquareMetersPerRoll,
  );
  if (!Number.isFinite(rollCount) || !Number.isSafeInteger(rollCount))
    simpleError(
      "rollCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { rollCount: Object.is(rollCount, -0) ? 0 : rollCount };
};

export const example = {
  input: { floorSquareMeters: 100, effectiveSquareMetersPerRoll: 25 },
  output: { rollCount: 4 },
} satisfies ToolExample<
  FlooringMoistureBarrierCoverageInput,
  FlooringMoistureBarrierCoverageOutput
>;

export const tool = createSimpleTool({
  id: "construction/flooring-moisture-barrier-coverage",
  title: "Flooring Moisture Barrier Coverage",
  description:
    "Moisture-barrier roll count from floor area and effective net coverage per roll after lap seams and cuts.",
  inputs: [
    {
      id: "floorSquareMeters",
      kind: "number",
      label: "Floor Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "effectiveSquareMetersPerRoll",
      kind: "number",
      label: "Effective Square Meters Per Roll",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [{ id: "rollCount", kind: "integer", label: "Roll Count" }],
  calculate: (input) =>
    calculateFlooringMoistureBarrierCoverage({
      floorSquareMeters: input.floorSquareMeters as number,
      effectiveSquareMetersPerRoll:
        input.effectiveSquareMetersPerRoll as number,
    }),
});
export const flooringMoistureBarrierCoverageTool = tool;
export const runFlooringMoistureBarrierCoverage = tool.execute;
export default tool;
