import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const marblingScoreExample = {
  input: { intramuscularFatPercent: 4 },
} satisfies ToolExample<{
  readonly intramuscularFatPercent: number;
}>;

export const marblingScoreTool = createSimpleTool({
  id: "biology/marbling-score",
  title: "Marbling Score Lookup",
  description:
    "Classify a marbling score from the intramuscular fat percentage between one and thirteen percent.",
  inputs: [
    {
      id: "intramuscularFatPercent",
      label: "Intramuscular fat percent",
      kind: "number",
      maximum: 13,
      minimum: 1,
    },
  ],
  outputs: [
    { id: "marblingCategory", label: "Marbling category", kind: "string" },
  ],
  calculate: (input) => {
    const intramuscularFatPercent = input.intramuscularFatPercent as number;
    return {
      marblingCategory:
        intramuscularFatPercent < 3
          ? "slight"
          : intramuscularFatPercent < 6
            ? "modest"
            : intramuscularFatPercent < 9
              ? "moderate"
              : "abundant",
    };
  },
});
export const runMarblingScore = marblingScoreTool.execute;
export default marblingScoreTool;
