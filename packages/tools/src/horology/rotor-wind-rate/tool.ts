import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RotorWindRateInput = Readonly<{
  readonly rotorRevolutionsPerHour: number;
  readonly rotorRevolutionsPerBarrelTurn: number;
}>;
export type RotorWindRateOutput = Readonly<{
  readonly barrelTurnsPerHour: number;
}>;

export const calculateRotorWindRate = (
  x: RotorWindRateInput,
): RotorWindRateOutput => {
  if (
    !Number.isFinite(x.rotorRevolutionsPerHour) ||
    x.rotorRevolutionsPerHour < 0
  )
    simpleError(
      "rotorRevolutionsPerHour",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.rotorRevolutionsPerBarrelTurn) ||
    x.rotorRevolutionsPerBarrelTurn <= 0
  )
    simpleError(
      "rotorRevolutionsPerBarrelTurn",
      "Provide a finite positive number.",
    );
  const barrelTurnsPerHour =
    x.rotorRevolutionsPerHour / x.rotorRevolutionsPerBarrelTurn;
  if (!Number.isFinite(barrelTurnsPerHour))
    simpleError(
      "barrelTurnsPerHour",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    barrelTurnsPerHour: Object.is(barrelTurnsPerHour, -0)
      ? 0
      : barrelTurnsPerHour,
  };
};

export const example = {
  input: {
    rotorRevolutionsPerHour: 1000,
    rotorRevolutionsPerBarrelTurn: 100,
  },
  output: { barrelTurnsPerHour: 10 },
} satisfies ToolExample<RotorWindRateInput, RotorWindRateOutput>;

export const tool = createSimpleTool({
  id: "horology/rotor-wind-rate",
  title: "Rotor Wind Rate",
  description:
    "Effective barrel turns per hour from rotor revolutions per hour and rotor revolutions required per barrel turn.",
  inputs: [
    {
      id: "rotorRevolutionsPerHour",
      kind: "number",
      label: "Rotor Revolutions Per Hour",
      unit: "rev/h",
      minimum: 0,
    },
    {
      id: "rotorRevolutionsPerBarrelTurn",
      kind: "number",
      label: "Rotor Revolutions Per Barrel Turn",
      unit: "rev/turn",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "barrelTurnsPerHour",
      kind: "number",
      label: "Barrel Turns Per Hour",
      unit: "turn/h",
    },
  ],
  calculate: (input) =>
    calculateRotorWindRate({
      rotorRevolutionsPerHour: input.rotorRevolutionsPerHour as number,
      rotorRevolutionsPerBarrelTurn:
        input.rotorRevolutionsPerBarrelTurn as number,
    }),
});
export const rotorWindRateTool = tool;
export const runRotorWindRate = tool.execute;
export default tool;
