import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnderlaymentRollsInput = Readonly<{
  readonly floorAreaM2: number;
  readonly effectiveCoveragePerRollM2: number;
}>;
export type UnderlaymentRollsOutput = Readonly<{
  readonly rollCount: number;
}>;

export const calculateUnderlaymentRolls = (
  x: UnderlaymentRollsInput,
): UnderlaymentRollsOutput => {
  if (!Number.isFinite(x.floorAreaM2) || x.floorAreaM2 < 0)
    simpleError("floorAreaM2", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.effectiveCoveragePerRollM2) ||
    x.effectiveCoveragePerRollM2 < 0
  )
    simpleError(
      "effectiveCoveragePerRollM2",
      "Provide a finite number at least 0.",
    );
  if (!(x.effectiveCoveragePerRollM2 > 0))
    simpleError("effectiveCoveragePerRollM2", "Coverage must be positive.");
  const rollCount = Math.ceil(x.floorAreaM2 / x.effectiveCoveragePerRollM2);
  if (!Number.isFinite(rollCount) || !Number.isSafeInteger(rollCount))
    simpleError("rollCount", "The inputs produce an invalid result.");
  return { rollCount: Object.is(rollCount, -0) ? 0 : rollCount };
};

export const example = {
  input: { floorAreaM2: 30, effectiveCoveragePerRollM2: 10 },
  output: { rollCount: 3 },
} satisfies ToolExample<UnderlaymentRollsInput, UnderlaymentRollsOutput>;

export const tool = createSimpleTool({
  id: "construction/underlayment-rolls",
  title: "Underlayment Rolls",
  description:
    "Round up flooring underlayment rolls from floor area and effective installed coverage per roll.",
  inputs: [
    {
      id: "floorAreaM2",
      kind: "number",
      label: "Floor area",
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
  ],
  outputs: [{ id: "rollCount", kind: "integer", label: "Rolls required" }],
  calculate: (input) =>
    calculateUnderlaymentRolls({
      floorAreaM2: input.floorAreaM2 as number,
      effectiveCoveragePerRollM2: input.effectiveCoveragePerRollM2 as number,
    }),
});
export const underlaymentRollsTool = tool;
export const runUnderlaymentRolls = tool.execute;
export default tool;
