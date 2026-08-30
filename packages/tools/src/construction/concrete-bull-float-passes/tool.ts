import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteBullFloatPassesInput = Readonly<{
  readonly slabWidthMeters: number;
  readonly effectiveWidthMeters: number;
}>;
export type ConcreteBullFloatPassesOutput = Readonly<{
  readonly passCount: number;
}>;

export const calculateConcreteBullFloatPasses = (
  x: ConcreteBullFloatPassesInput,
): ConcreteBullFloatPassesOutput => {
  if (!Number.isFinite(x.slabWidthMeters) || x.slabWidthMeters < 0)
    simpleError("slabWidthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.effectiveWidthMeters) || x.effectiveWidthMeters < 0)
    simpleError("effectiveWidthMeters", "Provide a finite number at least 0.");
  const passCount = Math.ceil(x.slabWidthMeters / x.effectiveWidthMeters);
  if (!Number.isFinite(passCount) || !Number.isSafeInteger(passCount))
    simpleError(
      "passCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { passCount: Object.is(passCount, -0) ? 0 : passCount };
};

export const example = {
  input: { slabWidthMeters: 10, effectiveWidthMeters: 2 },
  output: { passCount: 5 },
} satisfies ToolExample<
  ConcreteBullFloatPassesInput,
  ConcreteBullFloatPassesOutput
>;

export const tool = createSimpleTool({
  id: "construction/concrete-bull-float-passes",
  title: "Concrete Bull Float Passes",
  description:
    "Minimum number of straight bull-float lanes from slab width and effective covered width per pass after overlap.",
  inputs: [
    {
      id: "slabWidthMeters",
      kind: "number",
      label: "Slab Width Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "effectiveWidthMeters",
      kind: "number",
      label: "Effective Width Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [{ id: "passCount", kind: "integer", label: "Pass Count" }],
  calculate: (input) =>
    calculateConcreteBullFloatPasses({
      slabWidthMeters: input.slabWidthMeters as number,
      effectiveWidthMeters: input.effectiveWidthMeters as number,
    }),
});
export const concreteBullFloatPassesTool = tool;
export const runConcreteBullFloatPasses = tool.execute;
export default tool;
