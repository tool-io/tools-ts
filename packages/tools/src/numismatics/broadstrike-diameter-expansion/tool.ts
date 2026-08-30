import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BroadstrikeDiameterExpansionInput = Readonly<{
  readonly struckDiameterMillimeters: number;
  readonly normalDiameterMillimeters: number;
}>;
export type BroadstrikeDiameterExpansionOutput = Readonly<{
  readonly diameterExpansionPercent: number;
}>;

export const calculateBroadstrikeDiameterExpansion = (
  x: BroadstrikeDiameterExpansionInput,
): BroadstrikeDiameterExpansionOutput => {
  if (
    !Number.isFinite(x.struckDiameterMillimeters) ||
    x.struckDiameterMillimeters < 0
  )
    simpleError(
      "struckDiameterMillimeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.normalDiameterMillimeters) ||
    x.normalDiameterMillimeters <= 0
  )
    simpleError(
      "normalDiameterMillimeters",
      "Provide a finite positive number.",
    );
  if (x.struckDiameterMillimeters < x.normalDiameterMillimeters)
    simpleError(
      "struckDiameterMillimeters",
      "An expanded diameter cannot be below the normal diameter.",
    );
  const diameterExpansionPercent =
    ((x.struckDiameterMillimeters - x.normalDiameterMillimeters) /
      x.normalDiameterMillimeters) *
    100;
  if (!Number.isFinite(diameterExpansionPercent))
    simpleError(
      "diameterExpansionPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    diameterExpansionPercent: Object.is(diameterExpansionPercent, -0)
      ? 0
      : diameterExpansionPercent,
  };
};

export const example = {
  input: {
    struckDiameterMillimeters: 22,
    normalDiameterMillimeters: 20,
  },
  output: { diameterExpansionPercent: 10 },
} satisfies ToolExample<
  BroadstrikeDiameterExpansionInput,
  BroadstrikeDiameterExpansionOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/broadstrike-diameter-expansion",
  title: "Broadstrike Diameter Expansion",
  description:
    "Compare broadstruck coin diameter with the issue's normal diameter.",
  inputs: [
    {
      id: "struckDiameterMillimeters",
      kind: "number",
      label: "Struck Diameter Millimeters",
      unit: "mm",
    },
    {
      id: "normalDiameterMillimeters",
      kind: "number",
      label: "Normal Diameter Millimeters",
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "diameterExpansionPercent",
      kind: "number",
      label: "Diameter Expansion Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateBroadstrikeDiameterExpansion({
      struckDiameterMillimeters: input.struckDiameterMillimeters as number,
      normalDiameterMillimeters: input.normalDiameterMillimeters as number,
    }),
});
export const runBroadstrikeDiameterExpansion = tool.execute;
export default tool;
