import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StairStringerLengthCarpentryInput = Readonly<{
  readonly totalRunMeters: number;
  readonly totalRiseMeters: number;
}>;
export type StairStringerLengthCarpentryOutput = Readonly<{
  readonly stringerMeters: number;
}>;

export const calculateStairStringerLengthCarpentry = (
  x: StairStringerLengthCarpentryInput,
): StairStringerLengthCarpentryOutput => {
  if (!Number.isFinite(x.totalRunMeters) || x.totalRunMeters < 0)
    simpleError("totalRunMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.totalRiseMeters) || x.totalRiseMeters < 0)
    simpleError("totalRiseMeters", "Provide a finite number at least 0.");
  const stringerMeters = Math.hypot(x.totalRunMeters, x.totalRiseMeters);
  if (!Number.isFinite(stringerMeters))
    simpleError(
      "stringerMeters",
      "Inputs produce an undefined or non-finite result.",
    );
  return { stringerMeters: Object.is(stringerMeters, -0) ? 0 : stringerMeters };
};

export const example = {
  input: { totalRunMeters: 3, totalRiseMeters: 4 },
  output: { stringerMeters: 5 },
} satisfies ToolExample<
  StairStringerLengthCarpentryInput,
  StairStringerLengthCarpentryOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/stair-stringer-length-carpentry",
  title: "Stair Stringer Length Carpentry",
  description:
    "Theoretical straight stair-stringer run length from total horizontal run and vertical rise, before end cuts or overhangs.",
  inputs: [
    {
      id: "totalRunMeters",
      kind: "number",
      label: "Total Run Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "totalRiseMeters",
      kind: "number",
      label: "Total Rise Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "stringerMeters",
      kind: "number",
      label: "Stringer Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateStairStringerLengthCarpentry({
      totalRunMeters: input.totalRunMeters as number,
      totalRiseMeters: input.totalRiseMeters as number,
    }),
});
export const stairStringerLengthCarpentryTool = tool;
export const runStairStringerLengthCarpentry = tool.execute;
export default tool;
