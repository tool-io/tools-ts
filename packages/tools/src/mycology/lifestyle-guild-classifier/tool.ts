import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type LifestyleGuildClassifierInput = {
  readonly guild:
    | "ectomycorrhizal"
    | "saprotrophic"
    | "pathogenic"
    | "parasitic"
    | "lichenized"
    | "entomopathogenic";
};

export type LifestyleGuildClassifierOutput = {
  readonly guild: string;
};

export const lifestyleGuildClassifierExample = {
  input: { guild: "ectomycorrhizal" },
  output: { guild: "ectomycorrhizal" },
} satisfies ToolExample<
  LifestyleGuildClassifierInput,
  LifestyleGuildClassifierOutput
>;

export const lifestyleGuildClassifierTool = createSimpleTool({
  id: "mycology/lifestyle-guild-classifier",
  title: "Guild Classifier",
  description:
    "Validate and record a fungal ecological guild without collapsing broad pathogenic or parasitic guilds into an unsupported single trophic strategy.",
  inputs: [
    {
      enum: [
        "ectomycorrhizal",
        "saprotrophic",
        "pathogenic",
        "parasitic",
        "lichenized",
        "entomopathogenic",
      ],
      id: "guild",
      kind: "string",
      label: "Ecological guild",
    },
  ],
  outputs: [
    {
      enum: [
        "ectomycorrhizal",
        "saprotrophic",
        "pathogenic",
        "parasitic",
        "lichenized",
        "entomopathogenic",
      ],
      id: "guild",
      kind: "string",
      label: "Guild",
    },
  ],
  calculate: (input) => {
    const guild = input.guild as string;
    return { guild };
  },
});
export const runLifestyleGuildClassifier = lifestyleGuildClassifierTool.execute;
export default lifestyleGuildClassifierTool;
