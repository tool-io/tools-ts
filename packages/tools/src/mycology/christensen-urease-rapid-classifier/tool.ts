import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const ureaseRapidClassifierExample = {
  input: { ureaseClass: "slow-24-72h" },
  output: {
    reactionInterpretation:
      "Urease reaction developed during the 24-to-72-hour observation interval.",
    ureaseClass: "slow-24-72h",
  },
} satisfies ToolExample<
  { readonly ureaseClass: string },
  { readonly reactionInterpretation: string; readonly ureaseClass: string }
>;

const REACTION_INTERPRETATIONS: Record<string, string> = {
  negative: "No urease reaction was observed during the stated test interval.",
  "rapid-4h": "Urease reaction developed within four hours.",
  "slow-24-72h":
    "Urease reaction developed during the 24-to-72-hour observation interval.",
};

export const ureaseRapidClassifierTool = createSimpleTool({
  id: "mycology/christensen-urease-rapid-classifier",
  title: "Urease Rapid Classifier",
  description:
    "Record a Christensen urea agar reading as rapid, slow, or negative urease activity.",
  inputs: [
    {
      enum: ["rapid-4h", "slow-24-72h", "negative"],
      id: "ureaseClass",
      kind: "string",
      label: "Urease class",
    },
  ],
  outputs: [
    {
      enum: ["rapid-4h", "slow-24-72h", "negative"],
      id: "ureaseClass",
      kind: "string",
      label: "Urease class",
    },
    {
      id: "reactionInterpretation",
      kind: "string",
      label: "Reaction interpretation",
    },
  ],
  calculate: (input) => ({
    reactionInterpretation:
      REACTION_INTERPRETATIONS[input.ureaseClass as string],
    ureaseClass: input.ureaseClass as string,
  }),
});
export const runUreaseRapidClassifier = ureaseRapidClassifierTool.execute;
export default ureaseRapidClassifierTool;
