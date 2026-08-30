import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FloorSqueakScrewCountInput = Readonly<{
  readonly runMeters: number;
  readonly maxSpacingMeters: number;
}>;
export type FloorSqueakScrewCountOutput = Readonly<{
  readonly screwCount: number;
}>;

export const calculateFloorSqueakScrewCount = (
  x: FloorSqueakScrewCountInput,
): FloorSqueakScrewCountOutput => {
  if (!Number.isFinite(x.runMeters) || x.runMeters < 0)
    simpleError("runMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.maxSpacingMeters) || x.maxSpacingMeters < 0)
    simpleError("maxSpacingMeters", "Provide a finite number at least 0.");
  const screwCount = Math.ceil(x.runMeters / x.maxSpacingMeters) + 1;
  if (!Number.isFinite(screwCount) || !Number.isSafeInteger(screwCount))
    simpleError(
      "screwCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { screwCount: Object.is(screwCount, -0) ? 0 : screwCount };
};

export const example = {
  input: { runMeters: 3, maxSpacingMeters: 0.3 },
  output: { screwCount: 11 },
} satisfies ToolExample<
  FloorSqueakScrewCountInput,
  FloorSqueakScrewCountOutput
>;

export const tool = createSimpleTool({
  id: "construction/floor-squeak-screw-count",
  title: "Floor Squeak Screw Count",
  description:
    "Number of equally spaced fastening positions along one measured floor-joist run, including both ends, for a supplied maximum spacing.",
  inputs: [
    {
      id: "runMeters",
      kind: "number",
      label: "Run Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "maxSpacingMeters",
      kind: "number",
      label: "Max Spacing Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [{ id: "screwCount", kind: "integer", label: "Screw Count" }],
  calculate: (input) =>
    calculateFloorSqueakScrewCount({
      runMeters: input.runMeters as number,
      maxSpacingMeters: input.maxSpacingMeters as number,
    }),
});
export const floorSqueakScrewCountTool = tool;
export const runFloorSqueakScrewCount = tool.execute;
export default tool;
