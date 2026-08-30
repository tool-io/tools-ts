import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GmtHandOffsetInput = Readonly<{
  readonly utcHour: number;
  readonly utcMinute: number;
}>;
export type GmtHandOffsetOutput = Readonly<{
  readonly dialDegrees: number;
}>;

export const calculateGmtHandOffset = (
  x: GmtHandOffsetInput,
): GmtHandOffsetOutput => {
  if (!Number.isFinite(x.utcHour) || x.utcHour < 0)
    simpleError("utcHour", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.utcMinute) || x.utcMinute < 0)
    simpleError("utcMinute", "Provide a finite nonnegative number.");
  if (!(
    Number.isInteger(x.utcHour) &&
    x.utcHour < 24 &&
    Number.isInteger(x.utcMinute) &&
    x.utcMinute < 60
  ))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const dialDegrees = 15 * (x.utcHour + x.utcMinute / 60);
  if (!Number.isFinite(dialDegrees))
    simpleError(
      "dialDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { dialDegrees: Object.is(dialDegrees, -0) ? 0 : dialDegrees };
};

export const example = {
  input: {
    utcHour: 12,
    utcMinute: 0,
  },
  output: { dialDegrees: 180 },
} satisfies ToolExample<GmtHandOffsetInput, GmtHandOffsetOutput>;

export const tool = createSimpleTool({
  id: "horology/gmt-hand-offset",
  title: "Gmt Hand Offset",
  description:
    "GMT hand angle relative to the 12 o'clock position on a 24-hour dial from UTC hour and minute.",
  inputs: [
    { id: "utcHour", kind: "number", label: "Utc Hour", minimum: 0 },
    { id: "utcMinute", kind: "number", label: "Utc Minute", minimum: 0 },
  ],
  outputs: [
    { id: "dialDegrees", kind: "number", label: "Dial Degrees", unit: "deg" },
  ],
  calculate: (input) =>
    calculateGmtHandOffset({
      utcHour: input.utcHour as number,
      utcMinute: input.utcMinute as number,
    }),
});
export const gmtHandOffsetTool = tool;
export const runGmtHandOffset = tool.execute;
export default tool;
