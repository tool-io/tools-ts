import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrainSlopeFallPerFootInput = Readonly<{
  readonly runFeet: number;
  readonly slopeInchesPerFoot: number;
}>;
export type DrainSlopeFallPerFootOutput = Readonly<{
  readonly fallInches: number;
}>;

export const calculateDrainSlopeFallPerFoot = (
  x: DrainSlopeFallPerFootInput,
): DrainSlopeFallPerFootOutput => {
  if (!Number.isFinite(x.runFeet) || x.runFeet < 0)
    simpleError("runFeet", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.slopeInchesPerFoot) || x.slopeInchesPerFoot < 0)
    simpleError("slopeInchesPerFoot", "Provide a finite number at least 0.");
  const fallInches = x.runFeet * x.slopeInchesPerFoot;
  if (!Number.isFinite(fallInches))
    simpleError("fallInches", "The inputs produce an invalid result.");
  return { fallInches: Object.is(fallInches, -0) ? 0 : fallInches };
};

export const example = {
  input: { runFeet: 20, slopeInchesPerFoot: 0.25 },
  output: { fallInches: 5 },
} satisfies ToolExample<
  DrainSlopeFallPerFootInput,
  DrainSlopeFallPerFootOutput
>;

export const tool = createSimpleTool({
  id: "construction/drain-slope-fall-per-foot",
  title: "Drain Slope Fall Per Foot",
  description:
    "Convert a drain's horizontal run in feet and specified fall in inches per foot into total fall.",
  inputs: [
    {
      id: "runFeet",
      kind: "number",
      label: "Horizontal run",
      unit: "ft",
      minimum: 0,
    },
    {
      id: "slopeInchesPerFoot",
      kind: "number",
      label: "Fall per foot",
      unit: "in/ft",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "fallInches", kind: "number", label: "Total drain fall", unit: "in" },
  ],
  calculate: (input) =>
    calculateDrainSlopeFallPerFoot({
      runFeet: input.runFeet as number,
      slopeInchesPerFoot: input.slopeInchesPerFoot as number,
    }),
});
export const drainSlopeFallPerFootTool = tool;
export const runDrainSlopeFallPerFoot = tool.execute;
export default tool;
