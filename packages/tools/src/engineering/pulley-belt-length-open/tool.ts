import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PulleyBeltLengthOpenInput = Readonly<{
  readonly centerDistanceMillimeters: number;
  readonly largeDiameterMillimeters: number;
  readonly smallDiameterMillimeters: number;
}>;
export type PulleyBeltLengthOpenOutput = Readonly<{
  readonly beltLengthMillimeters: number;
}>;

export const calculatePulleyBeltLengthOpen = (
  x: PulleyBeltLengthOpenInput,
): PulleyBeltLengthOpenOutput => {
  if (
    !Number.isFinite(x.centerDistanceMillimeters) ||
    x.centerDistanceMillimeters < 0
  )
    simpleError(
      "centerDistanceMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.largeDiameterMillimeters) ||
    x.largeDiameterMillimeters < 0
  )
    simpleError(
      "largeDiameterMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.smallDiameterMillimeters) ||
    x.smallDiameterMillimeters < 0
  )
    simpleError(
      "smallDiameterMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    x.largeDiameterMillimeters < x.smallDiameterMillimeters ||
    x.centerDistanceMillimeters <=
      (x.largeDiameterMillimeters + x.smallDiameterMillimeters) / 2
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const beltLengthMillimeters =
    2 * x.centerDistanceMillimeters +
    (Math.PI * (x.largeDiameterMillimeters + x.smallDiameterMillimeters)) / 2 +
    (x.largeDiameterMillimeters - x.smallDiameterMillimeters) ** 2 /
      (4 * x.centerDistanceMillimeters);
  if (!Number.isFinite(beltLengthMillimeters))
    simpleError(
      "beltLengthMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    beltLengthMillimeters: Object.is(beltLengthMillimeters, -0)
      ? 0
      : beltLengthMillimeters,
  };
};

export const example = {
  input: {
    centerDistanceMillimeters: 500,
    largeDiameterMillimeters: 200,
    smallDiameterMillimeters: 100,
  },
  output: { beltLengthMillimeters: 1476.238898038469 },
} satisfies ToolExample<PulleyBeltLengthOpenInput, PulleyBeltLengthOpenOutput>;

export const tool = createSimpleTool({
  id: "engineering/pulley-belt-length-open",
  title: "Pulley Belt Length Open",
  description:
    "Approximate open-belt pitch length 2C+π(D+d)/2+(D−d)²/(4C) for center distance C.",
  inputs: [
    {
      id: "centerDistanceMillimeters",
      kind: "number",
      label: "Center Distance Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "largeDiameterMillimeters",
      kind: "number",
      label: "Large Diameter Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "smallDiameterMillimeters",
      kind: "number",
      label: "Small Diameter Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "beltLengthMillimeters",
      kind: "number",
      label: "Belt Length Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculatePulleyBeltLengthOpen({
      centerDistanceMillimeters: input.centerDistanceMillimeters as number,
      largeDiameterMillimeters: input.largeDiameterMillimeters as number,
      smallDiameterMillimeters: input.smallDiameterMillimeters as number,
    }),
});
export const pulleyBeltLengthOpenTool = tool;
export const runPulleyBeltLengthOpen = tool.execute;
export default tool;
