import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const principles = {
  access: {
    principle:
      "Design modification options without making essential participation depend on wealth, status, or geography.",
    test: "Who is excluded by cost, access, training, or care requirements?",
  },
  autonomy: {
    principle:
      "Respect a competent person's informed choice about their body and available modification options.",
    test: "Is consent specific, informed, voluntary, and revisable?",
  },
  informedConsent: {
    principle:
      "Disclose material risks, alternatives, uncertainty, and downstream choices before modification.",
    test: "Can the person understand and revisit the decision without coercion?",
  },
  reversibility: {
    principle:
      "Prefer options that preserve future choice, function, and options for revision or removal.",
    test: "What becomes difficult or impossible to reverse?",
  },
} as const;

export type MorphologicalPrinciple = keyof typeof principles;

export type MorphologicalFreedomInput = {
  readonly principle: MorphologicalPrinciple;
};

export type MorphologicalFreedomOutput = {
  readonly principle: MorphologicalPrinciple;
  readonly principleText: string;
  readonly testQuestion: string;
};

export const lookupMorphologicalFreedomPrinciple = (
  input: MorphologicalFreedomInput,
): MorphologicalFreedomOutput => {
  const principle = principles[input.principle];
  if (principle === undefined)
    simpleError(
      "principle",
      "Morphological-freedom principle is not supported.",
      "unsupported_morphological_principle",
    );
  return {
    principle: input.principle,
    principleText: principle.principle,
    testQuestion: principle.test,
  };
};

export const morphologicalFreedomExample = {
  input: { principle: "reversibility" },
  output: {
    principle: "reversibility",
    principleText:
      "Prefer options that preserve future choice, function, and options for revision or removal.",
    testQuestion: "What becomes difficult or impossible to reverse?",
  },
} satisfies ToolExample<MorphologicalFreedomInput, MorphologicalFreedomOutput>;

export const morphologicalFreedomTool = createSimpleTool({
  calculate: (input) =>
    lookupMorphologicalFreedomPrinciple({
      principle: input.principle as MorphologicalPrinciple,
    }),
  description:
    "Return a body-modification design principle and a practical test question for autonomy, consent, reversibility, or access.",
  id: "futurology/morphological-freedom-body-modification-principle-lookup",
  inputs: [
    {
      enum: ["autonomy", "informedConsent", "reversibility", "access"],
      id: "principle",
      kind: "string",
      label: "Morphological-freedom principle",
    },
  ],
  outputs: [
    {
      id: "principle",
      kind: "string",
      label: "Morphological-freedom principle",
    },
    { id: "principleText", kind: "string", label: "Principle text" },
    { id: "testQuestion", kind: "string", label: "Test question" },
  ],
  title: "Morphological Freedom Body Modification Principle Lookup",
});

export const runMorphologicalFreedom = morphologicalFreedomTool.execute;
export default morphologicalFreedomTool;
