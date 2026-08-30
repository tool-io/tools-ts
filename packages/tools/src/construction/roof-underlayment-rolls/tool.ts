import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RoofUnderlaymentRollsInput = Readonly<{
  readonly roofSquareMeters: number;
  readonly effectiveSquareMetersPerRoll: number;
  readonly wastePercent: number;
}>;
export type RoofUnderlaymentRollsOutput = Readonly<{
  readonly rollCount: number;
}>;

export const calculateRoofUnderlaymentRolls = (
  x: RoofUnderlaymentRollsInput,
): RoofUnderlaymentRollsOutput => {
  if (!Number.isFinite(x.roofSquareMeters) || x.roofSquareMeters < 0)
    simpleError("roofSquareMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.effectiveSquareMetersPerRoll) ||
    x.effectiveSquareMetersPerRoll < 0
  )
    simpleError(
      "effectiveSquareMetersPerRoll",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.wastePercent) || x.wastePercent < 0)
    simpleError("wastePercent", "Provide a finite number at least 0.");
  const rollCount = Math.ceil(
    (x.roofSquareMeters * (1 + x.wastePercent / 100)) /
      x.effectiveSquareMetersPerRoll,
  );
  if (!Number.isFinite(rollCount) || !Number.isSafeInteger(rollCount))
    simpleError(
      "rollCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { rollCount: Object.is(rollCount, -0) ? 0 : rollCount };
};

export const example = {
  input: {
    roofSquareMeters: 100,
    effectiveSquareMetersPerRoll: 20,
    wastePercent: 10,
  },
  output: { rollCount: 6 },
} satisfies ToolExample<
  RoofUnderlaymentRollsInput,
  RoofUnderlaymentRollsOutput
>;

export const tool = createSimpleTool({
  id: "construction/roof-underlayment-rolls",
  title: "Roof Underlayment Rolls",
  description:
    "Roof underlayment roll count from required coverage and net effective coverage per roll after overlaps.",
  inputs: [
    {
      id: "roofSquareMeters",
      kind: "number",
      label: "Roof Square Meters",
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
    {
      id: "wastePercent",
      kind: "number",
      label: "Waste Percent",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [{ id: "rollCount", kind: "integer", label: "Roll Count" }],
  calculate: (input) =>
    calculateRoofUnderlaymentRolls({
      roofSquareMeters: input.roofSquareMeters as number,
      effectiveSquareMetersPerRoll:
        input.effectiveSquareMetersPerRoll as number,
      wastePercent: input.wastePercent as number,
    }),
});
export const roofUnderlaymentRollsTool = tool;
export const runRoofUnderlaymentRolls = tool.execute;
export default tool;
