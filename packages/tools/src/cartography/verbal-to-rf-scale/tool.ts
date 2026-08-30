import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VerbalToRfScaleInput = Readonly<{
  readonly groundMetersPerMapCentimeter: number;
}>;
export type VerbalToRfScaleOutput = Readonly<{
  readonly denominator: number;
}>;

export const calculateVerbalToRfScale = (
  x: VerbalToRfScaleInput,
): VerbalToRfScaleOutput => {
  if (
    !Number.isFinite(x.groundMetersPerMapCentimeter) ||
    x.groundMetersPerMapCentimeter <= 0
  )
    simpleError(
      "groundMetersPerMapCentimeter",
      "Provide a finite positive number.",
    );
  const denominator = x.groundMetersPerMapCentimeter * 100;
  if (!Number.isFinite(denominator))
    simpleError(
      "denominator",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { denominator: Object.is(denominator, -0) ? 0 : denominator };
};

export const example = {
  input: {
    groundMetersPerMapCentimeter: 500,
  },
  output: { denominator: 50000 },
} satisfies ToolExample<VerbalToRfScaleInput, VerbalToRfScaleOutput>;

export const tool = createSimpleTool({
  id: "cartography/verbal-to-rf-scale",
  title: "Verbal To Rf Scale",
  description:
    "Denominator N of a 1:N map scale from ground metres represented by one map centimetre.",
  inputs: [
    {
      id: "groundMetersPerMapCentimeter",
      kind: "number",
      label: "Ground Meters Per Map Centimeter",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [{ id: "denominator", kind: "number", label: "Denominator" }],
  calculate: (input) =>
    calculateVerbalToRfScale({
      groundMetersPerMapCentimeter:
        input.groundMetersPerMapCentimeter as number,
    }),
});
export const verbalToRfScaleTool = tool;
export const runVerbalToRfScale = tool.execute;
export default tool;
