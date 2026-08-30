import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly ceilingHeightMeters: number;
  readonly maximumCubicMetersPerSeat: number;
  readonly maximumHeightMeters: number;
  readonly minimumCubicMetersPerSeat: number;
  readonly minimumHeightMeters: number;
  readonly roomVolumeCubicMeters: number;
  readonly seatCount: number;
}>;
export type Output = Readonly<{
  readonly cubicMetersPerSeat: number;
  readonly heightWithinRange: boolean;
  readonly volumePerSeatWithinRange: boolean;
  readonly withinBothRanges: boolean;
}>;

export const calculate = (input: Input): Output => {
  for (const [field, value] of Object.entries(input))
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        "Numeric values must be finite and nonnegative.",
        "invalid_value",
      );
  if (!Number.isSafeInteger(input.seatCount) || input.seatCount < 1)
    simpleError(
      "seatCount",
      "Seat count must be positive.",
      "invalid_seat_count",
    );
  if (
    input.minimumCubicMetersPerSeat > input.maximumCubicMetersPerSeat ||
    input.minimumHeightMeters > input.maximumHeightMeters
  )
    simpleError(
      "minimumCubicMetersPerSeat",
      "Minimums must not exceed maximums.",
      "invalid_range",
    );
  const cubicMetersPerSeat = input.roomVolumeCubicMeters / input.seatCount;
  if (!Number.isFinite(cubicMetersPerSeat) || cubicMetersPerSeat <= 0)
    simpleError(
      "roomVolumeCubicMeters",
      "Volume per seat is out of range.",
      "numeric_overflow",
    );
  const heightWithinRange =
    input.ceilingHeightMeters >= input.minimumHeightMeters &&
    input.ceilingHeightMeters <= input.maximumHeightMeters;
  const volumePerSeatWithinRange =
    cubicMetersPerSeat >= input.minimumCubicMetersPerSeat &&
    cubicMetersPerSeat <= input.maximumCubicMetersPerSeat;
  return {
    cubicMetersPerSeat,
    heightWithinRange,
    volumePerSeatWithinRange,
    withinBothRanges: heightWithinRange && volumePerSeatWithinRange,
  };
};

export const example = {
  input: {
    ceilingHeightMeters: 18,
    maximumCubicMetersPerSeat: 12,
    maximumHeightMeters: 25,
    minimumCubicMetersPerSeat: 8,
    minimumHeightMeters: 15,
    roomVolumeCubicMeters: 20000,
    seatCount: 2000,
  },
  output: {
    cubicMetersPerSeat: 10,
    heightWithinRange: true,
    volumePerSeatWithinRange: true,
    withinBothRanges: true,
  },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    ceilingHeightMeters: 10,
    maximumCubicMetersPerSeat: 12,
    maximumHeightMeters: 25,
    minimumCubicMetersPerSeat: 8,
    minimumHeightMeters: 15,
    roomVolumeCubicMeters: 10000,
    seatCount: 2000,
  },
  output: {
    cubicMetersPerSeat: 5,
    heightWithinRange: false,
    volumePerSeatWithinRange: false,
    withinBothRanges: false,
  },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      ceilingHeightMeters: input.ceilingHeightMeters as number,
      maximumCubicMetersPerSeat: input.maximumCubicMetersPerSeat as number,
      maximumHeightMeters: input.maximumHeightMeters as number,
      minimumCubicMetersPerSeat: input.minimumCubicMetersPerSeat as number,
      minimumHeightMeters: input.minimumHeightMeters as number,
      roomVolumeCubicMeters: input.roomVolumeCubicMeters as number,
      seatCount: input.seatCount as number,
    }),
  description:
    "Screen volume per seat and ceiling height against explicit caller-supplied ranges rather than universal hall norms.",
  id: "acoustics/concert-hall-geometry-screen",
  inputs: [
    {
      id: "ceilingHeightMeters",
      kind: "number",
      label: "Ceiling height",
      minimum: 0,
      unit: "m",
    },
    {
      id: "maximumCubicMetersPerSeat",
      kind: "number",
      label: "Maximum volume per seat",
      minimum: 0,
    },
    {
      id: "maximumHeightMeters",
      kind: "number",
      label: "Maximum height",
      minimum: 0,
      unit: "m",
    },
    {
      id: "minimumCubicMetersPerSeat",
      kind: "number",
      label: "Minimum volume per seat",
      minimum: 0,
    },
    {
      id: "minimumHeightMeters",
      kind: "number",
      label: "Minimum height",
      minimum: 0,
      unit: "m",
    },
    {
      id: "roomVolumeCubicMeters",
      kind: "number",
      label: "Room volume",
      minimum: 0,
      unit: "m³",
    },
    { id: "seatCount", kind: "integer", label: "Seat count", minimum: 1 },
  ],
  outputs: [
    {
      id: "cubicMetersPerSeat",
      kind: "number",
      label: "Volume per seat",
      minimum: 0,
    },
    { id: "heightWithinRange", kind: "boolean", label: "Height within range" },
    {
      id: "volumePerSeatWithinRange",
      kind: "boolean",
      label: "Volume per seat within range",
    },
    { id: "withinBothRanges", kind: "boolean", label: "Within both ranges" },
  ],
  title: "Concert Hall Geometry Screen",
});

export const run = tool.execute;
export default tool;
