import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrownTurnsFullWindInput = Readonly<{
  readonly usableBarrelTurns: number;
  readonly crownTurnsPerBarrelTurn: number;
}>;
export type CrownTurnsFullWindOutput = Readonly<{
  readonly crownTurns: number;
}>;

export const calculateCrownTurnsFullWind = (
  x: CrownTurnsFullWindInput,
): CrownTurnsFullWindOutput => {
  if (!Number.isFinite(x.usableBarrelTurns) || x.usableBarrelTurns <= 0)
    simpleError("usableBarrelTurns", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.crownTurnsPerBarrelTurn) ||
    x.crownTurnsPerBarrelTurn <= 0
  )
    simpleError("crownTurnsPerBarrelTurn", "Provide a finite positive number.");
  const crownTurns = x.usableBarrelTurns * x.crownTurnsPerBarrelTurn;
  if (!Number.isFinite(crownTurns))
    simpleError(
      "crownTurns",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { crownTurns: Object.is(crownTurns, -0) ? 0 : crownTurns };
};

export const example = {
  input: {
    usableBarrelTurns: 8,
    crownTurnsPerBarrelTurn: 4,
  },
  output: { crownTurns: 32 },
} satisfies ToolExample<CrownTurnsFullWindInput, CrownTurnsFullWindOutput>;

export const tool = createSimpleTool({
  id: "horology/crown-turns-full-wind",
  title: "Crown Turns Full Wind",
  description:
    "Crown turns to fully wind a mainspring from usable barrel turns and crown turns per barrel turn.",
  inputs: [
    {
      id: "usableBarrelTurns",
      kind: "number",
      label: "Usable Barrel Turns",
      unit: "turn",
      minimum: 0,
    },
    {
      id: "crownTurnsPerBarrelTurn",
      kind: "number",
      label: "Crown Turns Per Barrel Turn",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "crownTurns", kind: "number", label: "Crown Turns", unit: "turn" },
  ],
  calculate: (input) =>
    calculateCrownTurnsFullWind({
      usableBarrelTurns: input.usableBarrelTurns as number,
      crownTurnsPerBarrelTurn: input.crownTurnsPerBarrelTurn as number,
    }),
});
export const crownTurnsFullWindTool = tool;
export const runCrownTurnsFullWind = tool.execute;
export default tool;
