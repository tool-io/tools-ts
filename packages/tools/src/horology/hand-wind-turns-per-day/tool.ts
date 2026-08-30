import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HandWindTurnsPerDayInput = Readonly<{
  readonly crownTurnsFullWind: number;
  readonly powerReserveHours: number;
}>;
export type HandWindTurnsPerDayOutput = Readonly<{
  readonly turnsPerDay: number;
}>;

export const calculateHandWindTurnsPerDay = (
  x: HandWindTurnsPerDayInput,
): HandWindTurnsPerDayOutput => {
  if (!Number.isFinite(x.crownTurnsFullWind) || x.crownTurnsFullWind <= 0)
    simpleError("crownTurnsFullWind", "Provide a finite positive number.");
  if (!Number.isFinite(x.powerReserveHours) || x.powerReserveHours <= 0)
    simpleError("powerReserveHours", "Provide a finite positive number.");
  const turnsPerDay = (24 * x.crownTurnsFullWind) / x.powerReserveHours;
  if (!Number.isFinite(turnsPerDay))
    simpleError(
      "turnsPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { turnsPerDay: Object.is(turnsPerDay, -0) ? 0 : turnsPerDay };
};

export const example = {
  input: {
    crownTurnsFullWind: 32,
    powerReserveHours: 48,
  },
  output: { turnsPerDay: 16 },
} satisfies ToolExample<HandWindTurnsPerDayInput, HandWindTurnsPerDayOutput>;

export const tool = createSimpleTool({
  id: "horology/hand-wind-turns-per-day",
  title: "Hand Wind Turns Per Day",
  description:
    "Average crown turns per day needed to replace a full wind distributed over its power reserve.",
  inputs: [
    {
      id: "crownTurnsFullWind",
      kind: "number",
      label: "Crown Turns Full Wind",
      unit: "turn",
      minimum: 0,
    },
    {
      id: "powerReserveHours",
      kind: "number",
      label: "Power Reserve Hours",
      unit: "h",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "turnsPerDay",
      kind: "number",
      label: "Turns Per Day",
      unit: "turn/day",
    },
  ],
  calculate: (input) =>
    calculateHandWindTurnsPerDay({
      crownTurnsFullWind: input.crownTurnsFullWind as number,
      powerReserveHours: input.powerReserveHours as number,
    }),
});
export const handWindTurnsPerDayTool = tool;
export const runHandWindTurnsPerDay = tool.execute;
export default tool;
