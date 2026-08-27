import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OnlapAngleInput = {
  readonly onlappingDipDeg: number;
  readonly substrateDipDeg: number;
};

export type OnlapAngleOutput = {
  readonly onlapAngleDeg: number;
};

export const calculateOnlapAngle = (
  input: OnlapAngleInput,
): OnlapAngleOutput => {
  const { onlappingDipDeg, substrateDipDeg } = input;
  for (const [value, field] of [
    [onlappingDipDeg, "onlappingDipDeg"],
    [substrateDipDeg, "substrateDipDeg"],
  ] as const) {
    if (!(value >= 0 && value <= 90))
      simpleError(
        field,
        "Dips must be between 0 and 90 degrees.",
        "invalid_dip",
      );
  }
  return {
    onlapAngleDeg: Math.abs(onlappingDipDeg - substrateDipDeg),
  };
};

export const onlapAngleExample = {
  input: { onlappingDipDeg: 1.5, substrateDipDeg: 6 },
  output: { onlapAngleDeg: 4.5 },
} satisfies ToolExample<OnlapAngleInput, OnlapAngleOutput>;

export const onlapAngleTool = createSimpleTool({
  id: "geology/onlap-angle",
  title: "Onlap Angle Calculator",
  description:
    "Angle between dipping strata and the inclined older surface they progressively onlap: |dip(strata) - dip(substrate)|, assuming comparable dip directions.",
  inputs: [
    {
      description: "Dip of the onlapping (younger) strata in degrees.",
      id: "onlappingDipDeg",
      kind: "number",
      label: "Strata dip",
    },
    {
      description: "Dip of the underlying surface being onlapped in degrees.",
      id: "substrateDipDeg",
      kind: "number",
      label: "Substrate dip",
    },
  ],
  outputs: [
    {
      description: "Onlap angle between strata and substrate in degrees.",
      id: "onlapAngleDeg",
      kind: "number",
      label: "Onlap angle",
    },
  ],
  calculate: (input) =>
    calculateOnlapAngle(input as unknown as OnlapAngleInput),
});

export const runOnlapAngle = onlapAngleTool.execute;
export default onlapAngleTool;
