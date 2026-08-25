import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const MELZER_REACTIONS = [
  "amyloid-blue-black",
  "dextrinoid-red-brown",
  "inamyloid-no-change",
] as const;

const MELZER_CLASSES = ["amyloid", "dextrinoid", "inamyloid"] as const;
type MelzerReaction = (typeof MELZER_REACTIONS)[number];
type MelzerClass = (typeof MELZER_CLASSES)[number];

const MELZER_CLASS_BY_REACTION: Record<MelzerReaction, MelzerClass> = {
  "amyloid-blue-black": "amyloid",
  "dextrinoid-red-brown": "dextrinoid",
  "inamyloid-no-change": "inamyloid",
};

export type MelzerDextrinoidAmyloidResolverInput = {
  readonly reaction: MelzerReaction;
};

export type MelzerDextrinoidAmyloidResolverOutput = {
  readonly melzerClass: MelzerClass;
};

export const melzerDextrinoidAmyloidResolverExample = {
  input: { reaction: "dextrinoid-red-brown" },
  output: { melzerClass: "dextrinoid" },
} satisfies ToolExample<
  MelzerDextrinoidAmyloidResolverInput,
  MelzerDextrinoidAmyloidResolverOutput
>;

export const melzerDextrinoidAmyloidResolverTool = createSimpleTool({
  id: "mycology/melzer-dextrinoid-amyloid-resolver",
  title: "Melzer Resolver",
  description:
    "Resolve a Melzer's reagent reaction code into its amyloid class.",
  inputs: [
    {
      enum: MELZER_REACTIONS,
      id: "reaction",
      kind: "string",
      label: "Reaction",
    },
  ],
  outputs: [
    {
      enum: MELZER_CLASSES,
      id: "melzerClass",
      kind: "string",
      label: "Melzer class",
    },
  ],
  calculate: (input) => {
    const reaction = input.reaction as MelzerReaction;
    return { melzerClass: MELZER_CLASS_BY_REACTION[reaction] };
  },
});
export const runMelzerDextrinoidAmyloidResolver =
  melzerDextrinoidAmyloidResolverTool.execute;
export default melzerDextrinoidAmyloidResolverTool;
