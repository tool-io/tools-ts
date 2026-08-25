import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const KOH_REACTIONS = [
  "no-change",
  "yellow",
  "orange",
  "green",
  "black",
  "reddening",
] as const;

type KohReaction = (typeof KOH_REACTIONS)[number];

export type KohReactionNoteGeneratorInput = {
  readonly reaction: KohReaction;
};

export type KohReactionNoteGeneratorOutput = {
  readonly kohNote: string;
};

export const kohReactionNoteGeneratorExample = {
  input: { reaction: "yellow" },
  output: { kohNote: "KOH: yellow reaction." },
} satisfies ToolExample<
  KohReactionNoteGeneratorInput,
  KohReactionNoteGeneratorOutput
>;

export const kohReactionNoteGeneratorTool = createSimpleTool({
  id: "mycology/koh-reaction-note-generator",
  title: "KOH Reaction Note",
  description:
    "Generate a field-note sentence for an observed KOH spot reaction.",
  inputs: [
    {
      enum: KOH_REACTIONS,
      id: "reaction",
      kind: "string",
      label: "Reaction",
    },
  ],
  outputs: [
    {
      id: "kohNote",
      kind: "string",
      label: "KOH note",
    },
  ],
  calculate: (input) => {
    const reaction = input.reaction as KohReaction;
    return { kohNote: `KOH: ${reaction} reaction.` };
  },
});
export const runKohReactionNoteGenerator = kohReactionNoteGeneratorTool.execute;
export default kohReactionNoteGeneratorTool;
