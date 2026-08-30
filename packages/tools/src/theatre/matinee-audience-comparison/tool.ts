import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly matineeTicketsSold: number;
  readonly matineeCapacity: number;
  readonly eveningTicketsSold: number;
  readonly eveningCapacity: number;
  readonly matineeRevenue: number;
  readonly eveningRevenue: number;
}>;
export type Output = Readonly<{
  readonly matineeOccupancyPercent: number;
  readonly eveningOccupancyPercent: number;
  readonly occupancyDifferencePoints: number;
  readonly revenuePerAttendeeDifference: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.matineeCapacity <= 0 ||
    input.eveningCapacity <= 0 ||
    input.matineeTicketsSold <= 0 ||
    input.eveningTicketsSold <= 0
  )
    simpleError(
      "matineeCapacity",
      "Capacities and attendance must be positive.",
      "invalid_audience",
    );
  const matineeOccupancyPercent =
      (input.matineeTicketsSold / input.matineeCapacity) * 100,
    eveningOccupancyPercent =
      (input.eveningTicketsSold / input.eveningCapacity) * 100;
  return {
    matineeOccupancyPercent,
    eveningOccupancyPercent,
    occupancyDifferencePoints:
      matineeOccupancyPercent - eveningOccupancyPercent,
    revenuePerAttendeeDifference:
      input.matineeRevenue / input.matineeTicketsSold -
      input.eveningRevenue / input.eveningTicketsSold,
  };
};

export const exampleInput = {
  matineeTicketsSold: 80,
  matineeCapacity: 100,
  eveningTicketsSold: 90,
  eveningCapacity: 100,
  matineeRevenue: 1600,
  eveningRevenue: 2700,
} satisfies Input;
export const exampleOutput = {
  matineeOccupancyPercent: 80,
  eveningOccupancyPercent: 90,
  occupancyDifferencePoints: -10,
  revenuePerAttendeeDifference: -10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      matineeTicketsSold: input.matineeTicketsSold as number,
      matineeCapacity: input.matineeCapacity as number,
      eveningTicketsSold: input.eveningTicketsSold as number,
      eveningCapacity: input.eveningCapacity as number,
      matineeRevenue: input.matineeRevenue as number,
      eveningRevenue: input.eveningRevenue as number,
    }),
  description:
    "Compare matinee and evening occupancy and revenue per attendee.",
  id: "theatre/matinee-audience-comparison",
  inputs: [
    {
      id: "matineeTicketsSold",
      label: "Matinee tickets sold",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "matineeCapacity",
      label: "Matinee capacity",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "eveningTicketsSold",
      label: "Evening tickets sold",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "eveningCapacity",
      label: "Evening capacity",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "matineeRevenue",
      label: "Matinee revenue",
      kind: "number",
      minimum: 0,
    },
    {
      id: "eveningRevenue",
      label: "Evening revenue",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "matineeOccupancyPercent",
      label: "Matinee occupancy",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "eveningOccupancyPercent",
      label: "Evening occupancy",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "occupancyDifferencePoints",
      label: "Matinee minus evening occupancy",
      kind: "number",
      unit: "percentage points",
    },
    {
      id: "revenuePerAttendeeDifference",
      label: "Matinee minus evening revenue per attendee",
      kind: "number",
    },
  ],
  title: "Matinee Audience Comparison",
});

export const run = tool.execute;
export default tool;
