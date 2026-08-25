import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AmyloidSporeWallClassifierInput = {
  readonly reaction: "amyloid" | "dextrinoid" | "inamyloid";
};

export type AmyloidSporeWallClassifierOutput = {
  readonly expectedIodineAppearance: string;
  readonly wallClassification: string;
};

export const amyloidSporeWallClassifierExample = {
  input: { reaction: "amyloid" },
  output: {
    expectedIodineAppearance:
      "Blue-black to black reaction in an iodine reagent.",
    wallClassification: "Amyloid",
  },
} satisfies ToolExample<
  AmyloidSporeWallClassifierInput,
  AmyloidSporeWallClassifierOutput
>;

const WALL_CLASSIFICATIONS: Record<string, string> = {
  amyloid: "Amyloid",
  dextrinoid: "Dextrinoid",
  inamyloid: "Inamyloid",
};

const IODINE_APPEARANCES: Record<
  AmyloidSporeWallClassifierInput["reaction"],
  string
> = {
  amyloid: "Blue-black to black reaction in an iodine reagent.",
  dextrinoid: "Reddish-brown reaction in Melzer-type iodine reagent.",
  inamyloid: "No amyloid or dextrinoid color reaction observed.",
};

export const calculateAmyloidSporeWallClassifier = (
  input: AmyloidSporeWallClassifierInput,
): AmyloidSporeWallClassifierOutput => {
  const wallClassification = WALL_CLASSIFICATIONS[input.reaction];
  const expectedIodineAppearance = IODINE_APPEARANCES[input.reaction];
  if (
    wallClassification === undefined ||
    expectedIodineAppearance === undefined
  )
    return simpleError(
      "reaction",
      "Select amyloid, dextrinoid, or inamyloid.",
      "invalid_reaction",
    );
  return { expectedIodineAppearance, wallClassification };
};

export const amyloidSporeWallClassifierTool = createSimpleTool({
  id: "mycology/amyloid-spore-wall-classifier",
  title: "Amyloid Wall Classifier",
  description:
    "Classify a spore wall iodine reaction as a capitalized wall classification.",
  inputs: [
    {
      enum: ["amyloid", "inamyloid", "dextrinoid"],
      id: "reaction",
      kind: "string",
      label: "Iodine reaction",
    },
  ],
  outputs: [
    {
      id: "wallClassification",
      label: "Wall classification",
      kind: "string",
    },
    {
      id: "expectedIodineAppearance",
      label: "Expected appearance",
      kind: "string",
    },
  ],
  calculate: (input) =>
    calculateAmyloidSporeWallClassifier({
      reaction: input.reaction as AmyloidSporeWallClassifierInput["reaction"],
    }),
});
export const runAmyloidSporeWallClassifier =
  amyloidSporeWallClassifierTool.execute;
export default amyloidSporeWallClassifierTool;
