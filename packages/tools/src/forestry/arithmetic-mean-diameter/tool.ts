import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ArithmeticMeanDiameterInput = Readonly<{
  readonly sumDbhCentimeters: number;
  readonly treeCount: number;
}>;
export type ArithmeticMeanDiameterOutput = Readonly<{
  readonly meanCentimeters: number;
}>;

export const calculateArithmeticMeanDiameter = (
  x: ArithmeticMeanDiameterInput,
): ArithmeticMeanDiameterOutput => {
  if (!Number.isFinite(x.sumDbhCentimeters) || x.sumDbhCentimeters < 0)
    simpleError("sumDbhCentimeters", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.treeCount) ||
    !Number.isSafeInteger(x.treeCount) ||
    x.treeCount < 1
  )
    simpleError("treeCount", "Provide a positive safe integer.");
  const meanCentimeters = x.sumDbhCentimeters / x.treeCount;
  if (!Number.isFinite(meanCentimeters))
    simpleError(
      "meanCentimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    meanCentimeters: Object.is(meanCentimeters, -0) ? 0 : meanCentimeters,
  };
};

export const example = {
  input: {
    sumDbhCentimeters: 60,
    treeCount: 3,
  },
  output: { meanCentimeters: 20 },
} satisfies ToolExample<
  ArithmeticMeanDiameterInput,
  ArithmeticMeanDiameterOutput
>;

export const tool = createSimpleTool({
  id: "forestry/arithmetic-mean-diameter",
  title: "Arithmetic Mean Diameter",
  description:
    "Arithmetic mean DBH in centimetres from summed diameters and measured tree count.",
  inputs: [
    {
      id: "sumDbhCentimeters",
      kind: "number",
      label: "Sum Dbh Centimeters",
      unit: "cm",
      minimum: 0,
    },
    { id: "treeCount", kind: "integer", label: "Tree Count", minimum: 1 },
  ],
  outputs: [
    {
      id: "meanCentimeters",
      kind: "number",
      label: "Mean Centimeters",
      unit: "cm",
    },
  ],
  calculate: (input) =>
    calculateArithmeticMeanDiameter({
      sumDbhCentimeters: input.sumDbhCentimeters as number,
      treeCount: input.treeCount as number,
    }),
});
export const arithmeticMeanDiameterTool = tool;
export const runArithmeticMeanDiameter = tool.execute;
export default tool;
