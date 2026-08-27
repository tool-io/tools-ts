import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DipDirectionToStrikeInput = {
  readonly dipDirectionDeg: number;
  readonly rule?: "right-hand-rule" | "left-hand-rule";
};

export type DipDirectionToStrikeOutput = {
  readonly strikeDeg: number;
};

export const calculateDipDirectionToStrike = (
  input: DipDirectionToStrikeInput,
): DipDirectionToStrikeOutput => {
  const { dipDirectionDeg } = input;
  const rule = input.rule ?? "right-hand-rule";
  if (!(dipDirectionDeg >= 0 && dipDirectionDeg < 360))
    simpleError(
      "dipDirectionDeg",
      "Dip direction must be in the range [0, 360) degrees.",
      "invalid_azimuth",
    );
  const raw =
    rule === "right-hand-rule" ? dipDirectionDeg - 90 : dipDirectionDeg + 90;
  return { strikeDeg: ((raw % 360) + 360) % 360 };
};

export const dipDirectionToStrikeExample = {
  input: { dipDirectionDeg: 220, rule: "right-hand-rule" },
  output: { strikeDeg: 130 },
} satisfies ToolExample<DipDirectionToStrikeInput, DipDirectionToStrikeOutput>;

export const dipDirectionToStrikeTool = createSimpleTool({
  id: "geology/dip-direction-to-strike",
  title: "Dip Direction To Strike Calculator",
  description:
    "Convert a dip direction azimuth to the perpendicular strike azimuth (right-hand rule subtracts 90 degrees).",
  inputs: [
    {
      description: "Dip direction azimuth in degrees clockwise from north.",
      id: "dipDirectionDeg",
      kind: "number",
      label: "Dip dir",
      maximum: 360,
      minimum: 0,
    },
    {
      default: "right-hand-rule",
      description: "Handedness relating dip direction to strike.",
      enum: ["right-hand-rule", "left-hand-rule"],
      id: "rule",
      kind: "string",
      label: "Rule",
    },
  ],
  outputs: [
    {
      description: "Strike azimuth in degrees clockwise from north.",
      id: "strikeDeg",
      kind: "number",
      label: "Strike",
      maximum: 360,
      minimum: 0,
    },
  ],
  calculate: (input) =>
    calculateDipDirectionToStrike(
      input as unknown as DipDirectionToStrikeInput,
    ),
});

export const runDipDirectionToStrike = dipDirectionToStrikeTool.execute;
export default dipDirectionToStrikeTool;
