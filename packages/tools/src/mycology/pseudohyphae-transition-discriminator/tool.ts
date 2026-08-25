import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PseudohyphaeTransitionDiscriminatorInput = {
  readonly form: "budding-yeast-only" | "pseudohyphal" | "true-hyphal";
};

export type PseudohyphaeTransitionDiscriminatorOutput = {
  readonly morphologyClass: PseudohyphaeTransitionDiscriminatorInput["form"];
};

export const pseudohyphaeTransitionDiscriminatorExample = {
  input: { form: "pseudohyphal" },
  output: { morphologyClass: "pseudohyphal" },
} satisfies ToolExample<
  PseudohyphaeTransitionDiscriminatorInput,
  PseudohyphaeTransitionDiscriminatorOutput
>;

export const OBSERVED_FORMS = [
  "budding-yeast-only",
  "pseudohyphal",
  "true-hyphal",
] as const;

export const pseudohyphaeTransitionDiscriminatorTool = createSimpleTool({
  id: "mycology/pseudohyphae-transition-discriminator",
  title: "Pseudohyphae Discriminator",
  description:
    "Validate and record whether the observed morphology is budding yeast only, pseudohyphal, or true hyphal.",
  inputs: [
    {
      enum: [...OBSERVED_FORMS],
      id: "form",
      kind: "string",
      label: "Observed form",
    },
  ],
  outputs: [
    {
      enum: [...OBSERVED_FORMS],
      id: "morphologyClass",
      kind: "string",
      label: "Morphology class",
    },
  ],
  calculate: (input) => ({
    morphologyClass:
      input.form as PseudohyphaeTransitionDiscriminatorInput["form"],
  }),
});
export const runPseudohyphaeTransitionDiscriminator =
  pseudohyphaeTransitionDiscriminatorTool.execute;
export default pseudohyphaeTransitionDiscriminatorTool;
