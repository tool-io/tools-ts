import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RfToVerbalScaleInput = Readonly<{
  readonly denominator: number;
}>;
export type RfToVerbalScaleOutput = Readonly<{
  readonly groundMetersPerMapCentimeter: number;
}>;

export const calculateRfToVerbalScale = (
  x: RfToVerbalScaleInput,
): RfToVerbalScaleOutput => {
  if (!Number.isFinite(x.denominator) || x.denominator <= 0)
    simpleError("denominator", "Provide a finite positive number.");
  const groundMetersPerMapCentimeter = x.denominator / 100;
  if (!Number.isFinite(groundMetersPerMapCentimeter))
    simpleError(
      "groundMetersPerMapCentimeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    groundMetersPerMapCentimeter: Object.is(groundMetersPerMapCentimeter, -0)
      ? 0
      : groundMetersPerMapCentimeter,
  };
};

export const example = {
  input: {
    denominator: 50000,
  },
  output: { groundMetersPerMapCentimeter: 500 },
} satisfies ToolExample<RfToVerbalScaleInput, RfToVerbalScaleOutput>;

export const tool = createSimpleTool({
  id: "cartography/rf-to-verbal-scale",
  title: "Rf To Verbal Scale",
  description:
    "Ground metres represented by one map centimetre at a representative-fraction scale of 1:N.",
  inputs: [
    { id: "denominator", kind: "number", label: "Denominator", minimum: 0 },
  ],
  outputs: [
    {
      id: "groundMetersPerMapCentimeter",
      kind: "number",
      label: "Ground Meters Per Map Centimeter",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateRfToVerbalScale({
      denominator: input.denominator as number,
    }),
});
export const rfToVerbalScaleTool = tool;
export const runRfToVerbalScale = tool.execute;
export default tool;
