import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteShrinkageStrainInput = Readonly<{
  readonly initialLengthMillimeters: number;
  readonly finalLengthMillimeters: number;
}>;
export type ConcreteShrinkageStrainOutput = Readonly<{
  readonly shrinkageStrain: number;
}>;

export const calculateConcreteShrinkageStrain = (
  x: ConcreteShrinkageStrainInput,
): ConcreteShrinkageStrainOutput => {
  if (
    !Number.isFinite(x.initialLengthMillimeters) ||
    x.initialLengthMillimeters < 0
  )
    simpleError(
      "initialLengthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.finalLengthMillimeters) ||
    x.finalLengthMillimeters < 0
  )
    simpleError(
      "finalLengthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (x.finalLengthMillimeters > x.initialLengthMillimeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const shrinkageStrain =
    (x.initialLengthMillimeters - x.finalLengthMillimeters) /
    x.initialLengthMillimeters;
  if (!Number.isFinite(shrinkageStrain))
    simpleError(
      "shrinkageStrain",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    shrinkageStrain: Object.is(shrinkageStrain, -0) ? 0 : shrinkageStrain,
  };
};

export const example = {
  input: { initialLengthMillimeters: 1000, finalLengthMillimeters: 999.5 },
  output: { shrinkageStrain: 0.0005 },
} satisfies ToolExample<
  ConcreteShrinkageStrainInput,
  ConcreteShrinkageStrainOutput
>;

export const tool = createSimpleTool({
  id: "engineering/concrete-shrinkage-strain",
  title: "Concrete Shrinkage Strain",
  description:
    "Positive measured concrete shrinkage strain from a reduction in length divided by initial gauge length.",
  inputs: [
    {
      id: "initialLengthMillimeters",
      kind: "number",
      label: "Initial Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "finalLengthMillimeters",
      kind: "number",
      label: "Final Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "shrinkageStrain", kind: "number", label: "Shrinkage Strain" },
  ],
  calculate: (input) =>
    calculateConcreteShrinkageStrain({
      initialLengthMillimeters: input.initialLengthMillimeters as number,
      finalLengthMillimeters: input.finalLengthMillimeters as number,
    }),
});
export const concreteShrinkageStrainTool = tool;
export const runConcreteShrinkageStrain = tool.execute;
export default tool;
