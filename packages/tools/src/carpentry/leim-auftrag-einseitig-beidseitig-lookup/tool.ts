import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type GlueApplicationRate = "one-sided" | "two-sided";

export type GlueApplicationRateInput = {
  readonly application: GlueApplicationRate;
};

export type GlueApplicationRateOutput = {
  readonly recommendedGlueGramsPerM2: number;
};

const RECOMMENDED_GLUE_GRAMS_PER_M2: Record<GlueApplicationRate, number> = {
  "one-sided": 150,
  "two-sided": 100,
};

export const glueApplicationRateExample = {
  input: { application: "one-sided" },
  output: { recommendedGlueGramsPerM2: 150 },
} satisfies ToolExample<GlueApplicationRateInput, GlueApplicationRateOutput>;

export const glueApplicationRateTool = createSimpleTool({
  id: "carpentry/leim-auftrag-einseitig-beidseitig-lookup",
  title: "Glue Application Rate Lookup",
  description:
    "Look up the recommended glue amount in grams per square metre for one-sided or two-sided application.",
  inputs: [
    {
      description:
        "Application mode: one-sided (150 g/m²) or two-sided (100 g/m²).",
      enum: ["one-sided", "two-sided"],
      id: "application",
      kind: "string",
      label: "Application",
    },
  ],
  outputs: [
    {
      description: "Recommended glue amount in grams per square metre.",
      format: "mass",
      id: "recommendedGlueGramsPerM2",
      kind: "number",
      label: "Recommended glue",
      unit: "g/m²",
    },
  ],
  calculate: (input) => ({
    recommendedGlueGramsPerM2:
      RECOMMENDED_GLUE_GRAMS_PER_M2[input.application as GlueApplicationRate],
  }),
});
export const runGlueApplicationRate = glueApplicationRateTool.execute;
export default glueApplicationRateTool;
