import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type RubricationTraceFlagInput = {
  readonly residuePresent: boolean;
  readonly hueCategory: "red" | "non-red";
};

export type RubricationTraceFlagOutput = {
  readonly rubricationSuspected: boolean;
};

export const calculateRubricationTraceFlag = (
  input: RubricationTraceFlagInput,
): RubricationTraceFlagOutput => ({
  rubricationSuspected: input.residuePresent && input.hueCategory === "red",
});

export const rubricationTraceFlagExample = {
  input: { residuePresent: true, hueCategory: "red" },
  output: { rubricationSuspected: true },
} satisfies ToolExample<RubricationTraceFlagInput, RubricationTraceFlagOutput>;

export const rubricationTraceFlagTool = createSimpleTool({
  id: "epigraphy/rubrication-trace-flag",
  title: "Rubrication Paint Trace Residue Detection Flag",
  description:
    "Raise a rubrication flag when pigment residue is present on the inscription surface and its observed hue category is red.",
  inputs: [
    {
      description: "Whether pigment residue was detected on the surface.",
      id: "residuePresent",
      kind: "boolean",
      label: "Residue present",
    },
    {
      default: "non-red",
      description: "Observed dominant hue category of the residue.",
      enum: ["red", "non-red"],
      id: "hueCategory",
      kind: "string",
      label: "Hue category",
    },
  ],
  outputs: [
    {
      description: "Whether the evidence supports suspected rubrication.",
      id: "rubricationSuspected",
      kind: "boolean",
      label: "Rubrication suspected",
    },
  ],
  calculate: (input) =>
    calculateRubricationTraceFlag(
      input as unknown as RubricationTraceFlagInput,
    ),
});

export const runRubricationTraceFlag = rubricationTraceFlagTool.execute;
export default rubricationTraceFlagTool;
