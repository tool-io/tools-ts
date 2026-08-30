import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OffCenterStrikePercentInput = Readonly<{
  readonly designOffsetMillimeters: number;
  readonly planchetDiameterMillimeters: number;
}>;
export type OffCenterStrikePercentOutput = Readonly<{
  readonly linearOffsetPercent: number;
}>;

export const calculateOffCenterStrikePercent = (
  x: OffCenterStrikePercentInput,
): OffCenterStrikePercentOutput => {
  if (
    !Number.isFinite(x.designOffsetMillimeters) ||
    x.designOffsetMillimeters < 0
  )
    simpleError(
      "designOffsetMillimeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.planchetDiameterMillimeters) ||
    x.planchetDiameterMillimeters <= 0
  )
    simpleError(
      "planchetDiameterMillimeters",
      "Provide a finite positive number.",
    );
  if (x.designOffsetMillimeters > x.planchetDiameterMillimeters)
    simpleError(
      "designOffsetMillimeters",
      "Offset cannot exceed planchet diameter.",
    );
  const linearOffsetPercent =
    (x.designOffsetMillimeters / x.planchetDiameterMillimeters) * 100;
  if (!Number.isFinite(linearOffsetPercent))
    simpleError(
      "linearOffsetPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    linearOffsetPercent: Object.is(linearOffsetPercent, -0)
      ? 0
      : linearOffsetPercent,
  };
};

export const example = {
  input: {
    designOffsetMillimeters: 2,
    planchetDiameterMillimeters: 20,
  },
  output: { linearOffsetPercent: 10 },
} satisfies ToolExample<
  OffCenterStrikePercentInput,
  OffCenterStrikePercentOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/off-center-strike-percent",
  title: "Off Center Strike Percent",
  description:
    "Express measured strike-center displacement as a percentage of planchet diameter; this is not a grading-service label.",
  inputs: [
    {
      id: "designOffsetMillimeters",
      kind: "number",
      label: "Design Offset Millimeters",
      unit: "mm",
    },
    {
      id: "planchetDiameterMillimeters",
      kind: "number",
      label: "Planchet Diameter Millimeters",
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "linearOffsetPercent",
      kind: "number",
      label: "Linear Offset Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateOffCenterStrikePercent({
      designOffsetMillimeters: input.designOffsetMillimeters as number,
      planchetDiameterMillimeters: input.planchetDiameterMillimeters as number,
    }),
});
export const runOffCenterStrikePercent = tool.execute;
export default tool;
