import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RebarStirrupSpacingInput = Readonly<{
  readonly cageLengthMillimeters: number;
  readonly stirrupCount: number;
}>;
export type RebarStirrupSpacingOutput = Readonly<{
  readonly centerSpacingMillimeters: number;
}>;

export const calculateRebarStirrupSpacing = (
  x: RebarStirrupSpacingInput,
): RebarStirrupSpacingOutput => {
  if (!Number.isFinite(x.cageLengthMillimeters) || x.cageLengthMillimeters < 0)
    simpleError("cageLengthMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.stirrupCount) ||
    !Number.isSafeInteger(x.stirrupCount) ||
    x.stirrupCount < 0
  )
    simpleError("stirrupCount", "Provide a safe integer at least 0.");
  if (!Number.isSafeInteger(x.stirrupCount) || x.stirrupCount < 2)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const centerSpacingMillimeters =
    x.cageLengthMillimeters / (x.stirrupCount - 1);
  if (!Number.isFinite(centerSpacingMillimeters))
    simpleError(
      "centerSpacingMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    centerSpacingMillimeters: Object.is(centerSpacingMillimeters, -0)
      ? 0
      : centerSpacingMillimeters,
  };
};

export const example = {
  input: { cageLengthMillimeters: 1000, stirrupCount: 6 },
  output: { centerSpacingMillimeters: 200 },
} satisfies ToolExample<RebarStirrupSpacingInput, RebarStirrupSpacingOutput>;

export const tool = createSimpleTool({
  id: "construction/rebar-stirrup-spacing",
  title: "Rebar Stirrup Spacing",
  description:
    "Equal center spacing when a selected number of stirrups spans from first to last center over a specified cage length.",
  inputs: [
    {
      id: "cageLengthMillimeters",
      kind: "number",
      label: "Cage Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
    { id: "stirrupCount", kind: "integer", label: "Stirrup Count", minimum: 0 },
  ],
  outputs: [
    {
      id: "centerSpacingMillimeters",
      kind: "number",
      label: "Center Spacing Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateRebarStirrupSpacing({
      cageLengthMillimeters: input.cageLengthMillimeters as number,
      stirrupCount: input.stirrupCount as number,
    }),
});
export const rebarStirrupSpacingTool = tool;
export const runRebarStirrupSpacing = tool.execute;
export default tool;
