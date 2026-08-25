import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ConidiophoreBranchingClassifierInput = {
  readonly branching:
    "monopodial" | "penicillate" | "sympodial" | "unbranched" | "verticillate";
};

export type ConidiophoreBranchingClassifierOutput = {
  readonly branchingClass: string;
  readonly patternDescription: string;
};

const PATTERN_DESCRIPTIONS: Record<
  ConidiophoreBranchingClassifierInput["branching"],
  string
> = {
  monopodial:
    "A main conidiophore axis continues growing while lateral branches arise.",
  penicillate: "Terminal branches form a brush-like arrangement.",
  sympodial:
    "Successive growing points produce a zigzag or stepped branching pattern.",
  unbranched: "Conidia arise from a conidiophore without lateral branches.",
  verticillate: "Branches arise in one or more whorls around the main axis.",
};

export const conidiophoreBranchingClassifierExample = {
  input: { branching: "penicillate" },
  output: {
    branchingClass: "penicillate",
    patternDescription: "Terminal branches form a brush-like arrangement.",
  },
} satisfies ToolExample<
  ConidiophoreBranchingClassifierInput,
  ConidiophoreBranchingClassifierOutput
>;

export const conidiophoreBranchingClassifierTool = createSimpleTool({
  id: "mycology/conidiophore-branching-classifier",
  title: "Conidiophore Branching",
  description:
    "Classify an observed conidiophore branching pattern and explain the selected morphological term.",
  inputs: [
    {
      enum: [
        "unbranched",
        "sympodial",
        "monopodial",
        "penicillate",
        "verticillate",
      ],
      id: "branching",
      kind: "string",
      label: "Branching pattern",
    },
  ],
  outputs: [
    { id: "branchingClass", label: "Branching class", kind: "string" },
    {
      id: "patternDescription",
      label: "Pattern description",
      kind: "string",
    },
  ],
  calculate: (input) => ({
    branchingClass: input.branching as string,
    patternDescription:
      PATTERN_DESCRIPTIONS[
        input.branching as ConidiophoreBranchingClassifierInput["branching"]
      ],
  }),
});
export const runConidiophoreBranchingClassifier =
  conidiophoreBranchingClassifierTool.execute;
export default conidiophoreBranchingClassifierTool;
