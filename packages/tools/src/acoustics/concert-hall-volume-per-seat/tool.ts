import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly roomVolumeCubicMeters: number;
  readonly seatCount: number;
}>;
export type Output = Readonly<{ readonly cubicMetersPerSeat: number }>;

export const calculate = (input: Input): Output => {
  if (
    !Number.isFinite(input.roomVolumeCubicMeters) ||
    input.roomVolumeCubicMeters <= 0
  )
    simpleError(
      "roomVolumeCubicMeters",
      "Room volume must be finite and positive.",
      "invalid_volume",
    );
  if (!Number.isSafeInteger(input.seatCount) || input.seatCount < 1)
    simpleError(
      "seatCount",
      "Seat count must be a positive safe integer.",
      "invalid_seat_count",
    );
  const cubicMetersPerSeat = input.roomVolumeCubicMeters / input.seatCount;
  if (!Number.isFinite(cubicMetersPerSeat) || cubicMetersPerSeat <= 0)
    simpleError(
      "cubicMetersPerSeat",
      "Result is out of range.",
      "numeric_overflow",
    );
  return { cubicMetersPerSeat };
};

export const example = {
  input: { roomVolumeCubicMeters: 18000, seatCount: 2000 },
  output: { cubicMetersPerSeat: 9 },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: { roomVolumeCubicMeters: 12, seatCount: 1 },
  output: { cubicMetersPerSeat: 12 },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      roomVolumeCubicMeters: input.roomVolumeCubicMeters as number,
      seatCount: input.seatCount as number,
    }),
  description:
    "Calculate room volume per audience seat from caller-supplied hall volume and seat count; no universal benchmark is asserted.",
  id: "acoustics/concert-hall-volume-per-seat",
  inputs: [
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
      unit: "m³/seat",
    },
  ],
  title: "Concert Hall Volume per Seat",
});

export const run = tool.execute;
export default tool;
