import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const focuses = {
  intergenerational: {
    caution:
      "Work with relevant Indigenous communities rather than treating a phrase as a universal checklist.",
    principle:
      "Evaluate whether decisions preserve options and responsibility across multiple generations.",
  },
  reciprocity: {
    caution:
      "Relationships and responsibilities are community-specific and require local guidance.",
    principle:
      "Examine reciprocal obligations among people, communities, ecosystems, and future decision-makers.",
  },
  stewardship: {
    caution:
      "Do not substitute generic consultation for governance authority or community-defined stewardship.",
    principle:
      "Treat land, water, knowledge, and cultural resources as relationships requiring care rather than extraction.",
  },
  systemsThinking: {
    caution:
      "Long-term systems thinking should be paired with community-defined priorities and knowledge.",
    principle:
      "Include downstream, cumulative, and cross-generational effects in the decision boundary.",
  },
} as const;

export type SeventhGenerationFocus = keyof typeof focuses;

export type SeventhGenerationInput = {
  readonly focus: SeventhGenerationFocus;
};

export type SeventhGenerationOutput = {
  readonly culturalConsultationCaution: string;
  readonly focus: SeventhGenerationFocus;
  readonly principle: string;
};

export const lookupSeventhGenerationPrinciple = (
  input: SeventhGenerationInput,
): SeventhGenerationOutput => {
  const focus = focuses[input.focus];
  if (focus === undefined)
    simpleError(
      "focus",
      "Seventh-generation focus is not supported.",
      "unsupported_seventh_generation_focus",
    );
  return {
    culturalConsultationCaution: focus.caution,
    focus: input.focus,
    principle: focus.principle,
  };
};

export const seventhGenerationExample = {
  input: { focus: "stewardship" },
  output: {
    culturalConsultationCaution:
      "Do not substitute generic consultation for governance authority or community-defined stewardship.",
    focus: "stewardship",
    principle:
      "Treat land, water, knowledge, and cultural resources as relationships requiring care rather than extraction.",
  },
} satisfies ToolExample<SeventhGenerationInput, SeventhGenerationOutput>;

export const seventhGenerationTool = createSimpleTool({
  calculate: (input) =>
    lookupSeventhGenerationPrinciple({
      focus: input.focus as SeventhGenerationFocus,
    }),
  description:
    "Return a generic long-term stewardship or systems principle with an explicit community-consultation caution.",
  id: "futurology/seventh-generation-indigenous-sustainability-principle-lookup",
  inputs: [
    {
      enum: [
        "stewardship",
        "intergenerational",
        "reciprocity",
        "systemsThinking",
      ],
      id: "focus",
      kind: "string",
      label: "Seventh-generation focus",
    },
  ],
  outputs: [
    {
      id: "culturalConsultationCaution",
      kind: "string",
      label: "Cultural consultation caution",
    },
    { id: "focus", kind: "string", label: "Seventh-generation focus" },
    { id: "principle", kind: "string", label: "Sustainability principle" },
  ],
  title: "Seventh Generation Indigenous Sustainability Principle Lookup",
});

export const runSeventhGeneration = seventhGenerationTool.execute;
export default seventhGenerationTool;
