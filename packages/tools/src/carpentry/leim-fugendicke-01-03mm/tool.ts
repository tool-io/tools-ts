import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type GlueLineSpecInput = {
  readonly glueLineMm: number;
};

export type GlueLineSpecOutput = {
  readonly isWithinSpec: boolean;
};

export const glueLineSpecExample = {
  input: { glueLineMm: 0.2 },
  output: { isWithinSpec: true },
} satisfies ToolExample<GlueLineSpecInput, GlueLineSpecOutput>;

export const glueLineSpecTool = createSimpleTool({
  id: "carpentry/leim-fugendicke-01-03mm",
  title: "Glue Line Spec Check",
  description:
    "Check whether a glue line thickness stays within the 0.1 to 0.3 millimetre specification.",
  inputs: [
    {
      description: "Glue line thickness in millimetres, between zero and two.",
      id: "glueLineMm",
      kind: "number",
      label: "Glue line",
      maximum: 2,
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description:
        "Whether the glue line lies between 0.1 and 0.3 millimetres inclusive.",
      id: "isWithinSpec",
      kind: "boolean",
      label: "Within spec",
    },
  ],
  calculate: (input) => {
    const glueLineMm = input.glueLineMm as number;
    return { isWithinSpec: glueLineMm >= 0.1 && glueLineMm <= 0.3 };
  },
});
export const runGlueLineSpec = glueLineSpecTool.execute;
export default glueLineSpecTool;
