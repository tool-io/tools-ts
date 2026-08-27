import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StrikeDipToDipDirectionInput = {
  readonly strikeDeg: number;
  readonly rule?: "right-hand-rule" | "left-hand-rule";
};

export type StrikeDipToDipDirectionOutput = {
  readonly dipDirectionDeg: number;
};

export const calculateStrikeDipToDipDirection = (
  input: StrikeDipToDipDirectionInput,
): StrikeDipToDipDirectionOutput => {
  const { strikeDeg } = input;
  const rule = input.rule ?? "right-hand-rule";
  if (!(strikeDeg >= 0 && strikeDeg < 360))
    simpleError(
      "strikeDeg",
      "Strike must be in the range [0, 360) degrees.",
      "invalid_azimuth",
    );
  const raw = rule === "right-hand-rule" ? strikeDeg + 90 : strikeDeg - 90;
  return { dipDirectionDeg: ((raw % 360) + 360) % 360 };
};

export const strikeDipToDipDirectionExample = {
  input: { strikeDeg: 130, rule: "right-hand-rule" },
  output: { dipDirectionDeg: 220 },
} satisfies ToolExample<
  StrikeDipToDipDirectionInput,
  StrikeDipToDipDirectionOutput
>;

export const strikeDipToDipDirectionTool = createSimpleTool({
  id: "geology/strike-dip-to-dip-direction",
  title: "Strike Dip To Dip Direction Calculator",
  description:
    "Convert strike azimuth and handedness to dip direction, which is perpendicular to strike (right-hand rule adds 90 degrees).",
  inputs: [
    {
      description: "Strike azimuth in degrees clockwise from north.",
      id: "strikeDeg",
      kind: "number",
      label: "Strike",
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
      description: "Dip direction azimuth in degrees clockwise from north.",
      id: "dipDirectionDeg",
      kind: "number",
      label: "Dip dir",
      maximum: 360,
      minimum: 0,
    },
  ],
  calculate: (input) =>
    calculateStrikeDipToDipDirection(
      input as unknown as StrikeDipToDipDirectionInput,
    ),
});

export const runStrikeDipToDipDirection = strikeDipToDipDirectionTool.execute;
export default strikeDipToDipDirectionTool;
