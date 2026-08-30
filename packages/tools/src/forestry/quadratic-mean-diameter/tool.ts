import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuadraticMeanDiameterInput = Readonly<{
  readonly sumSquaredDbhCm2: number;
  readonly treeCount: number;
}>;
export type QuadraticMeanDiameterOutput = Readonly<{
  readonly quadraticMeanCentimeters: number;
}>;

export const calculateQuadraticMeanDiameter = (
  x: QuadraticMeanDiameterInput,
): QuadraticMeanDiameterOutput => {
  if (!Number.isFinite(x.sumSquaredDbhCm2) || x.sumSquaredDbhCm2 < 0)
    simpleError("sumSquaredDbhCm2", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.treeCount) ||
    !Number.isSafeInteger(x.treeCount) ||
    x.treeCount < 1
  )
    simpleError("treeCount", "Provide a positive safe integer.");
  const quadraticMeanCentimeters = Math.sqrt(x.sumSquaredDbhCm2 / x.treeCount);
  if (!Number.isFinite(quadraticMeanCentimeters))
    simpleError(
      "quadraticMeanCentimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    quadraticMeanCentimeters: Object.is(quadraticMeanCentimeters, -0)
      ? 0
      : quadraticMeanCentimeters,
  };
};

export const example = {
  input: {
    sumSquaredDbhCm2: 1200,
    treeCount: 3,
  },
  output: { quadraticMeanCentimeters: 20 },
} satisfies ToolExample<
  QuadraticMeanDiameterInput,
  QuadraticMeanDiameterOutput
>;

export const tool = createSimpleTool({
  id: "forestry/quadratic-mean-diameter",
  title: "Quadratic Mean Diameter",
  description:
    "Quadratic mean diameter in centimetres from the sum of squared DBHs and tree count.",
  inputs: [
    {
      id: "sumSquaredDbhCm2",
      kind: "number",
      label: "Sum Squared Dbh Cm 2",
      unit: "cm2",
      minimum: 0,
    },
    { id: "treeCount", kind: "integer", label: "Tree Count", minimum: 1 },
  ],
  outputs: [
    {
      id: "quadraticMeanCentimeters",
      kind: "number",
      label: "Quadratic Mean Centimeters",
      unit: "cm",
    },
  ],
  calculate: (input) =>
    calculateQuadraticMeanDiameter({
      sumSquaredDbhCm2: input.sumSquaredDbhCm2 as number,
      treeCount: input.treeCount as number,
    }),
});
export const quadraticMeanDiameterTool = tool;
export const runQuadraticMeanDiameter = tool.execute;
export default tool;
