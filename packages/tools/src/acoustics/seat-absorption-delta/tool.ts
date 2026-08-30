import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly emptyEquivalentAbsorptionSquareMeters: number;
  readonly occupiedEquivalentAbsorptionSquareMeters: number;
  readonly seatCount: number;
}>;
export type Output = Readonly<{
  readonly totalDeltaSquareMeters: number;
  readonly deltaPerSeatSquareMeters: number;
}>;

export const calculate = (input: Input): Output => {
  for (const [field, value] of [
    [
      "emptyEquivalentAbsorptionSquareMeters",
      input.emptyEquivalentAbsorptionSquareMeters,
    ],
    [
      "occupiedEquivalentAbsorptionSquareMeters",
      input.occupiedEquivalentAbsorptionSquareMeters,
    ],
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        "Equivalent absorption must be finite and nonnegative.",
        "invalid_absorption",
      );
  if (!Number.isSafeInteger(input.seatCount) || input.seatCount < 1)
    simpleError(
      "seatCount",
      "Seat count must be positive.",
      "invalid_seat_count",
    );
  const totalDeltaSquareMeters =
    input.occupiedEquivalentAbsorptionSquareMeters -
    input.emptyEquivalentAbsorptionSquareMeters;
  const deltaPerSeatSquareMeters = totalDeltaSquareMeters / input.seatCount;
  if (!Number.isFinite(deltaPerSeatSquareMeters))
    simpleError(
      "deltaPerSeatSquareMeters",
      "Inputs produce an out-of-range result.",
      "numeric_overflow",
    );
  return {
    totalDeltaSquareMeters,
    deltaPerSeatSquareMeters,
  };
};

export const example = {
  input: {
    emptyEquivalentAbsorptionSquareMeters: 30,
    occupiedEquivalentAbsorptionSquareMeters: 50,
    seatCount: 100,
  },
  output: { totalDeltaSquareMeters: 20, deltaPerSeatSquareMeters: 0.2 },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    emptyEquivalentAbsorptionSquareMeters: 10,
    occupiedEquivalentAbsorptionSquareMeters: 10,
    seatCount: 20,
  },
  output: { totalDeltaSquareMeters: 0, deltaPerSeatSquareMeters: 0 },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      emptyEquivalentAbsorptionSquareMeters:
        input.emptyEquivalentAbsorptionSquareMeters as number,
      occupiedEquivalentAbsorptionSquareMeters:
        input.occupiedEquivalentAbsorptionSquareMeters as number,
      seatCount: input.seatCount as number,
    }),
  description:
    "Calculate the signed occupied-minus-empty equivalent absorption for a seating sample and per seat.",
  id: "acoustics/seat-absorption-delta",
  inputs: [
    {
      id: "emptyEquivalentAbsorptionSquareMeters",
      kind: "number",
      label: "Empty-seat equivalent absorption",
      minimum: 0,
      unit: "m²",
    },
    {
      id: "occupiedEquivalentAbsorptionSquareMeters",
      kind: "number",
      label: "Occupied-seat equivalent absorption",
      minimum: 0,
      unit: "m²",
    },
    { id: "seatCount", kind: "integer", label: "Seat count", minimum: 1 },
  ],
  outputs: [
    {
      id: "totalDeltaSquareMeters",
      kind: "number",
      label: "Total occupied-minus-empty delta",
      unit: "m²",
    },
    {
      id: "deltaPerSeatSquareMeters",
      kind: "number",
      label: "Delta per seat",
      unit: "m²/seat",
    },
  ],
  title: "Seat Absorption Delta",
});

export const run = tool.execute;
export default tool;
