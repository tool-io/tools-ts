import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ParasequenceThicknessInput = {
  readonly parasequenceSetThicknessM: number;
  readonly parasequenceCount: number;
};

export type ParasequenceThicknessOutput = {
  readonly meanParasequenceThicknessM: number;
};

export const calculateParasequenceThickness = (
  input: ParasequenceThicknessInput,
): ParasequenceThicknessOutput => {
  const { parasequenceSetThicknessM, parasequenceCount } = input;
  if (!(parasequenceSetThicknessM >= 0))
    simpleError(
      "parasequenceSetThicknessM",
      "Set thickness must be non-negative.",
      "invalid_thickness",
    );
  if (!(Number.isInteger(parasequenceCount) && parasequenceCount > 0))
    simpleError(
      "parasequenceCount",
      "Parasequence count must be a positive integer.",
      "invalid_count",
    );
  return {
    meanParasequenceThicknessM: parasequenceSetThicknessM / parasequenceCount,
  };
};

export const parasequenceThicknessExample = {
  input: { parasequenceSetThicknessM: 132, parasequenceCount: 6 },
  output: { meanParasequenceThicknessM: 22 },
} satisfies ToolExample<
  ParasequenceThicknessInput,
  ParasequenceThicknessOutput
>;

export const parasequenceThicknessTool = createSimpleTool({
  id: "geology/parasequence-thickness",
  title: "Parasequence Thickness Calculator",
  description:
    "Mean parasequence thickness from the measured thickness of a parasequence set divided by its number of parasequences.",
  inputs: [
    {
      description:
        "Total measured thickness of the parasequence set in metres.",
      id: "parasequenceSetThicknessM",
      kind: "number",
      label: "Set thickness",
      unit: "m",
    },
    {
      description: "Number of parasequences in the set.",
      id: "parasequenceCount",
      kind: "number",
      label: "Parasequence count",
    },
  ],
  outputs: [
    {
      description: "Mean thickness per parasequence in metres.",
      id: "meanParasequenceThicknessM",
      kind: "number",
      label: "Mean thickness",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateParasequenceThickness(
      input as unknown as ParasequenceThicknessInput,
    ),
});

export const runParasequenceThickness = parasequenceThicknessTool.execute;
export default parasequenceThicknessTool;
