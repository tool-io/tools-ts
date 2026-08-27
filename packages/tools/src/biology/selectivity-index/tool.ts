import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const selectivityIndexExample = {
  input: { therapeuticIc50: 8, toxicIc50: 40 },
} satisfies ToolExample<{
  readonly therapeuticIc50: number;
  readonly toxicIc50: number;
}>;

export const selectivityIndexTool = createSimpleTool({
  id: "biology/selectivity-index",
  title: "Selectivity Index",
  description:
    "Compute the ratio of toxic IC50 to therapeutic IC50 for a compound.",
  inputs: [
    { id: "therapeuticIc50", label: "Therapeutic IC50", kind: "number" },
    { id: "toxicIc50", label: "Toxic IC50", kind: "number" },
  ],
  outputs: [
    { id: "selectivityIndex", label: "Selectivity index", kind: "number" },
  ],
  calculate: (input) => {
    const therapeuticIc50 = input.therapeuticIc50 as number;
    const toxicIc50 = input.toxicIc50 as number;
    if (therapeuticIc50 <= 0 || toxicIc50 <= 0)
      simpleError(
        "therapeuticIc50",
        "IC50 values must be greater than zero.",
        "invalid_ic50",
      );
    return { selectivityIndex: toxicIc50 / therapeuticIc50 };
  },
});
export const runSelectivityIndex = selectivityIndexTool.execute;
export default selectivityIndexTool;
