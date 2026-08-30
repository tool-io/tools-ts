import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WedgeMechanicalAdvantageInput = Readonly<{
  readonly wedgeLengthMeters: number;
  readonly riseMeters: number;
}>;
export type WedgeMechanicalAdvantageOutput = Readonly<{
  readonly mechanicalAdvantage: number;
}>;

export const calculateWedgeMechanicalAdvantage = (
  x: WedgeMechanicalAdvantageInput,
): WedgeMechanicalAdvantageOutput => {
  if (!Number.isFinite(x.wedgeLengthMeters) || x.wedgeLengthMeters < 0)
    simpleError("wedgeLengthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.riseMeters) || x.riseMeters < 0)
    simpleError("riseMeters", "Provide a finite number at least 0.");
  if (x.riseMeters > x.wedgeLengthMeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const mechanicalAdvantage = x.wedgeLengthMeters / x.riseMeters;
  if (!Number.isFinite(mechanicalAdvantage))
    simpleError(
      "mechanicalAdvantage",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    mechanicalAdvantage: Object.is(mechanicalAdvantage, -0)
      ? 0
      : mechanicalAdvantage,
  };
};

export const example = {
  input: { wedgeLengthMeters: 0.5, riseMeters: 0.1 },
  output: { mechanicalAdvantage: 5 },
} satisfies ToolExample<
  WedgeMechanicalAdvantageInput,
  WedgeMechanicalAdvantageOutput
>;

export const tool = createSimpleTool({
  id: "engineering/wedge-mechanical-advantage",
  title: "Wedge Mechanical Advantage",
  description:
    "Ideal frictionless wedge mechanical advantage as driven length divided by wedge rise.",
  inputs: [
    {
      id: "wedgeLengthMeters",
      kind: "number",
      label: "Wedge Length Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "riseMeters",
      kind: "number",
      label: "Rise Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "mechanicalAdvantage",
      kind: "number",
      label: "Mechanical Advantage",
    },
  ],
  calculate: (input) =>
    calculateWedgeMechanicalAdvantage({
      wedgeLengthMeters: input.wedgeLengthMeters as number,
      riseMeters: input.riseMeters as number,
    }),
});
export const wedgeMechanicalAdvantageTool = tool;
export const runWedgeMechanicalAdvantage = tool.execute;
export default tool;
