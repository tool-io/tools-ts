import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type LactophenolClarityRaterInput = {
  readonly clarity: "clear" | "partially-refractile" | "refractile";
};

export type LactophenolClarityRaterOutput = {
  readonly clarity: string;
};

export const lactophenolClarityRaterExample = {
  input: { clarity: "partially-refractile" },
  output: { clarity: "partially-refractile" },
} satisfies ToolExample<
  LactophenolClarityRaterInput,
  LactophenolClarityRaterOutput
>;

export const lactophenolClarityRaterTool = createSimpleTool({
  id: "mycology/lactophenol-clarity-rater",
  title: "Clarity Rater",
  description:
    "Validate and record the observed clarity or refractility of a lactophenol mount without assigning a nonstandard numeric severity score.",
  inputs: [
    {
      enum: ["clear", "partially-refractile", "refractile"],
      id: "clarity",
      kind: "string",
      label: "Mount clarity",
    },
  ],
  outputs: [
    {
      enum: ["clear", "partially-refractile", "refractile"],
      id: "clarity",
      kind: "string",
      label: "Clarity",
    },
  ],
  calculate: (input) => {
    const clarity = input.clarity as LactophenolClarityRaterInput["clarity"];
    return { clarity };
  },
});
export const runLactophenolClarityRater = lactophenolClarityRaterTool.execute;
export default lactophenolClarityRaterTool;
