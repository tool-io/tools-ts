import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const TASTES = ["mild", "acrid", "peppery", "bitter", "farinaceous"] as const;
type Taste = (typeof TASTES)[number];

export type TasteCodedEntryCheckerInput = {
  readonly taste: Taste;
};

export type TasteCodedEntryCheckerOutput = {
  readonly taste: Taste;
};

export const tasteCodedEntryCheckerExample = {
  input: { taste: "peppery" },
  output: { taste: "peppery" },
} satisfies ToolExample<
  TasteCodedEntryCheckerInput,
  TasteCodedEntryCheckerOutput
>;

export const tasteCodedEntryCheckerTool = createSimpleTool({
  id: "mycology/taste-coded-entry-checker",
  title: "Taste Entry Checker",
  description:
    "Validate and record an existing taste observation without assigning an arbitrary numeric severity code; never taste an unidentified or potentially toxic fungus.",
  inputs: [
    {
      enum: TASTES,
      id: "taste",
      kind: "string",
      label: "Taste",
    },
  ],
  outputs: [
    {
      enum: TASTES,
      id: "taste",
      kind: "string",
      label: "Taste",
    },
  ],
  calculate: (input) => {
    const taste = input.taste as Taste;
    return { taste };
  },
});
export const runTasteCodedEntryChecker = tasteCodedEntryCheckerTool.execute;
export default tasteCodedEntryCheckerTool;
