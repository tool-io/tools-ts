import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MainspringTurnsPowerReserveInput = Readonly<{
  readonly usableBarrelTurns: number;
  readonly hoursPerBarrelTurn: number;
}>;
export type MainspringTurnsPowerReserveOutput = Readonly<{
  readonly reserveHours: number;
}>;

export const calculateMainspringTurnsPowerReserve = (
  x: MainspringTurnsPowerReserveInput,
): MainspringTurnsPowerReserveOutput => {
  if (!Number.isFinite(x.usableBarrelTurns) || x.usableBarrelTurns <= 0)
    simpleError("usableBarrelTurns", "Provide a finite positive number.");
  if (!Number.isFinite(x.hoursPerBarrelTurn) || x.hoursPerBarrelTurn <= 0)
    simpleError("hoursPerBarrelTurn", "Provide a finite positive number.");
  const reserveHours = x.usableBarrelTurns * x.hoursPerBarrelTurn;
  if (!Number.isFinite(reserveHours))
    simpleError(
      "reserveHours",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { reserveHours: Object.is(reserveHours, -0) ? 0 : reserveHours };
};

export const example = {
  input: {
    usableBarrelTurns: 8,
    hoursPerBarrelTurn: 5,
  },
  output: { reserveHours: 40 },
} satisfies ToolExample<
  MainspringTurnsPowerReserveInput,
  MainspringTurnsPowerReserveOutput
>;

export const tool = createSimpleTool({
  id: "horology/mainspring-turns-power-reserve",
  title: "Mainspring Turns Power Reserve",
  description:
    "Ideal running hours from usable barrel turns and measured running hours per barrel turn.",
  inputs: [
    {
      id: "usableBarrelTurns",
      kind: "number",
      label: "Usable Barrel Turns",
      unit: "turn",
      minimum: 0,
    },
    {
      id: "hoursPerBarrelTurn",
      kind: "number",
      label: "Hours Per Barrel Turn",
      unit: "h/turn",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "reserveHours", kind: "number", label: "Reserve Hours", unit: "h" },
  ],
  calculate: (input) =>
    calculateMainspringTurnsPowerReserve({
      usableBarrelTurns: input.usableBarrelTurns as number,
      hoursPerBarrelTurn: input.hoursPerBarrelTurn as number,
    }),
});
export const mainspringTurnsPowerReserveTool = tool;
export const runMainspringTurnsPowerReserve = tool.execute;
export default tool;
