import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WorldTimeZoneOffsetInput = Readonly<{
  readonly utcHour: number;
  readonly offsetHours: number;
}>;
export type WorldTimeZoneOffsetOutput = Readonly<{
  readonly localHour: number;
}>;

export const calculateWorldTimeZoneOffset = (
  x: WorldTimeZoneOffsetInput,
): WorldTimeZoneOffsetOutput => {
  if (!Number.isFinite(x.utcHour) || x.utcHour < 0)
    simpleError("utcHour", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.offsetHours))
    simpleError("offsetHours", "Provide a finite number.");
  if (!(x.utcHour < 24 && Math.abs(x.offsetHours) <= 14))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const localHour = (((x.utcHour + x.offsetHours) % 24) + 24) % 24;
  if (!Number.isFinite(localHour))
    simpleError(
      "localHour",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { localHour: Object.is(localHour, -0) ? 0 : localHour };
};

export const example = {
  input: {
    utcHour: 12,
    offsetHours: 5.5,
  },
  output: { localHour: 17.5 },
} satisfies ToolExample<WorldTimeZoneOffsetInput, WorldTimeZoneOffsetOutput>;

export const tool = createSimpleTool({
  id: "horology/world-time-zone-offset",
  title: "World Time Zone Offset",
  description:
    "Local 24-hour clock hour from UTC hour and a signed, possibly fractional, offset in hours; does not determine DST.",
  inputs: [
    { id: "utcHour", kind: "number", label: "Utc Hour", minimum: 0 },
    { id: "offsetHours", kind: "number", label: "Offset Hours", unit: "h" },
  ],
  outputs: [
    { id: "localHour", kind: "number", label: "Local Hour", unit: "h" },
  ],
  calculate: (input) =>
    calculateWorldTimeZoneOffset({
      utcHour: input.utcHour as number,
      offsetHours: input.offsetHours as number,
    }),
});
export const worldTimeZoneOffsetTool = tool;
export const runWorldTimeZoneOffset = tool.execute;
export default tool;
