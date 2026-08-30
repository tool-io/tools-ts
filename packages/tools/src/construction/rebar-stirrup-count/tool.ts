import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RebarStirrupCountInput = Readonly<{
  readonly cageLengthMillimeters: number;
  readonly maxSpacingMillimeters: number;
}>;
export type RebarStirrupCountOutput = Readonly<{
  readonly stirrupCount: number;
}>;

export const calculateRebarStirrupCount = (
  x: RebarStirrupCountInput,
): RebarStirrupCountOutput => {
  if (!Number.isFinite(x.cageLengthMillimeters) || x.cageLengthMillimeters < 0)
    simpleError("cageLengthMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.maxSpacingMillimeters) || x.maxSpacingMillimeters < 0)
    simpleError("maxSpacingMillimeters", "Provide a finite number at least 0.");
  const stirrupCount =
    Math.ceil(x.cageLengthMillimeters / x.maxSpacingMillimeters) + 1;
  if (!Number.isFinite(stirrupCount) || !Number.isSafeInteger(stirrupCount))
    simpleError(
      "stirrupCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { stirrupCount: Object.is(stirrupCount, -0) ? 0 : stirrupCount };
};

export const example = {
  input: { cageLengthMillimeters: 1000, maxSpacingMillimeters: 200 },
  output: { stirrupCount: 6 },
} satisfies ToolExample<RebarStirrupCountInput, RebarStirrupCountOutput>;

export const tool = createSimpleTool({
  id: "construction/rebar-stirrup-count",
  title: "Rebar Stirrup Count",
  description:
    "Minimum stirrup count including both ends when no center-to-center interval may exceed a user-specified maximum.",
  inputs: [
    {
      id: "cageLengthMillimeters",
      kind: "number",
      label: "Cage Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "maxSpacingMillimeters",
      kind: "number",
      label: "Max Spacing Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [{ id: "stirrupCount", kind: "integer", label: "Stirrup Count" }],
  calculate: (input) =>
    calculateRebarStirrupCount({
      cageLengthMillimeters: input.cageLengthMillimeters as number,
      maxSpacingMillimeters: input.maxSpacingMillimeters as number,
    }),
});
export const rebarStirrupCountTool = tool;
export const runRebarStirrupCount = tool.execute;
export default tool;
