import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RoofingFeltRollsInput = Readonly<{
  readonly roofAreaM2: number;
  readonly effectiveCoveragePerRollM2: number;
  readonly wastePercent: number;
}>;
export type RoofingFeltRollsOutput = Readonly<{
  readonly rollCount: number;
}>;

export const calculateRoofingFeltRolls = (
  x: RoofingFeltRollsInput,
): RoofingFeltRollsOutput => {
  if (!Number.isFinite(x.roofAreaM2) || x.roofAreaM2 < 0)
    simpleError("roofAreaM2", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.effectiveCoveragePerRollM2) ||
    x.effectiveCoveragePerRollM2 < 0
  )
    simpleError(
      "effectiveCoveragePerRollM2",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.wastePercent) || x.wastePercent < 0)
    simpleError("wastePercent", "Provide a finite number at least 0.");
  if (!(x.effectiveCoveragePerRollM2 > 0))
    simpleError(
      "effectiveCoveragePerRollM2",
      "Effective coverage must be positive.",
    );
  const rollCount = Math.ceil(
    (x.roofAreaM2 * (1 + x.wastePercent / 100)) / x.effectiveCoveragePerRollM2,
  );
  if (!Number.isFinite(rollCount) || !Number.isSafeInteger(rollCount))
    simpleError("rollCount", "The inputs produce an invalid result.");
  return { rollCount: Object.is(rollCount, -0) ? 0 : rollCount };
};

export const example = {
  input: { roofAreaM2: 100, effectiveCoveragePerRollM2: 20, wastePercent: 10 },
  output: { rollCount: 6 },
} satisfies ToolExample<RoofingFeltRollsInput, RoofingFeltRollsOutput>;

export const tool = createSimpleTool({
  id: "construction/roofing-felt-rolls",
  title: "Roofing Felt Rolls",
  description:
    "Round up underlayment rolls using each roll's effective coverage after laps, not its nominal material area.",
  inputs: [
    {
      id: "roofAreaM2",
      kind: "number",
      label: "Roof area",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "effectiveCoveragePerRollM2",
      kind: "number",
      label: "Effective coverage per roll",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "wastePercent",
      kind: "number",
      label: "Waste allowance",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [{ id: "rollCount", kind: "integer", label: "Rolls required" }],
  calculate: (input) =>
    calculateRoofingFeltRolls({
      roofAreaM2: input.roofAreaM2 as number,
      effectiveCoveragePerRollM2: input.effectiveCoveragePerRollM2 as number,
      wastePercent: input.wastePercent as number,
    }),
});
export const roofingFeltRollsTool = tool;
export const runRoofingFeltRolls = tool.execute;
export default tool;
