import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RetrogradeSpanDegreesInput = Readonly<{
  readonly startDegrees: number;
  readonly endDegrees: number;
}>;
export type RetrogradeSpanDegreesOutput = Readonly<{
  readonly sweepDegrees: number;
}>;

export const calculateRetrogradeSpanDegrees = (
  x: RetrogradeSpanDegreesInput,
): RetrogradeSpanDegreesOutput => {
  if (!Number.isFinite(x.startDegrees) || x.startDegrees < 0)
    simpleError("startDegrees", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.endDegrees) || x.endDegrees < 0)
    simpleError("endDegrees", "Provide a finite nonnegative number.");
  if (!(x.endDegrees >= x.startDegrees && x.endDegrees <= 360))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const sweepDegrees = x.endDegrees - x.startDegrees;
  if (!Number.isFinite(sweepDegrees))
    simpleError(
      "sweepDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { sweepDegrees: Object.is(sweepDegrees, -0) ? 0 : sweepDegrees };
};

export const example = {
  input: {
    startDegrees: 30,
    endDegrees: 150,
  },
  output: { sweepDegrees: 120 },
} satisfies ToolExample<
  RetrogradeSpanDegreesInput,
  RetrogradeSpanDegreesOutput
>;

export const tool = createSimpleTool({
  id: "horology/retrograde-span-degrees",
  title: "Retrograde Span Degrees",
  description:
    "Positive angular sweep of a retrograde indicator from start angle to end angle.",
  inputs: [
    {
      id: "startDegrees",
      kind: "number",
      label: "Start Degrees",
      unit: "deg",
      minimum: 0,
    },
    {
      id: "endDegrees",
      kind: "number",
      label: "End Degrees",
      unit: "deg",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "sweepDegrees", kind: "number", label: "Sweep Degrees", unit: "deg" },
  ],
  calculate: (input) =>
    calculateRetrogradeSpanDegrees({
      startDegrees: input.startDegrees as number,
      endDegrees: input.endDegrees as number,
    }),
});
export const retrogradeSpanDegreesTool = tool;
export const runRetrogradeSpanDegrees = tool.execute;
export default tool;
