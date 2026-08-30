import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const categories = {
  biosecurity: {
    definition:
      "A pathway involving biological agents or biological capability.",
    question:
      "What controls could prevent creation, release, or cascading spread?",
  },
  climate: {
    definition:
      "A pathway involving durable or large-scale climate disruption.",
    question:
      "What compounding, irreversible, and distributional effects matter?",
  },
  deliberate: {
    definition: "A pathway in which an actor intentionally causes severe harm.",
    question:
      "What actors, incentives, access, and safeguards affect deliberate action?",
  },
  malfunction: {
    definition:
      "A pathway in which system behavior contributes to severe harm.",
    question:
      "Which failure modes are plausible under normal and adversarial conditions?",
  },
  nuclear: {
    definition:
      "A pathway involving nuclear weapons, materials, or strategic escalation.",
    question:
      "What escalation, launch, and recovery dynamics could produce severe harm?",
  },
  other: {
    definition:
      "A severe-risk pathway not represented by the built-in categories.",
    question: "What mechanism, actors, and safeguards should be investigated?",
  },
  pandemic: {
    definition:
      "A pathway involving a high-consequence infectious disease event.",
    question:
      "How could prevention, detection, response, and recovery fail together?",
  },
  structural: {
    definition:
      "A pathway in which interconnected systems produce severe or irreversible harm.",
    question:
      "Which dependencies, feedback loops, and recovery failures amplify harm?",
  },
} as const;

export type ExistentialRiskCategory = keyof typeof categories;

export type ExistentialRiskTaxonomyInput = {
  readonly riskCategory: ExistentialRiskCategory;
};

export type ExistentialRiskTaxonomyOutput = {
  readonly analysisQuestion: string;
  readonly riskCategory: ExistentialRiskCategory;
  readonly taxonomyDefinition: string;
};

export const lookupExistentialRiskCategory = (
  input: ExistentialRiskTaxonomyInput,
): ExistentialRiskTaxonomyOutput => {
  const category = categories[input.riskCategory];
  if (category === undefined)
    simpleError(
      "riskCategory",
      "Risk category is not supported.",
      "unsupported_existential_risk_category",
    );
  return {
    analysisQuestion: category.question,
    riskCategory: input.riskCategory,
    taxonomyDefinition: category.definition,
  };
};

export const existentialRiskTaxonomyExample = {
  input: { riskCategory: "structural" },
  output: {
    analysisQuestion:
      "Which dependencies, feedback loops, and recovery failures amplify harm?",
    riskCategory: "structural",
    taxonomyDefinition:
      "A pathway in which interconnected systems produce severe or irreversible harm.",
  },
} satisfies ToolExample<
  ExistentialRiskTaxonomyInput,
  ExistentialRiskTaxonomyOutput
>;

export const existentialRiskTaxonomyTool = createSimpleTool({
  calculate: (input) =>
    lookupExistentialRiskCategory({
      riskCategory: input.riskCategory as ExistentialRiskCategory,
    }),
  description:
    "Return a definition and analysis question for a caller-selected category of existential or catastrophic risk.",
  id: "futurology/existential-risk-category-taxonomy-lookup",
  inputs: [
    {
      enum: [
        "malfunction",
        "deliberate",
        "structural",
        "biosecurity",
        "nuclear",
        "climate",
        "pandemic",
        "other",
      ],
      id: "riskCategory",
      kind: "string",
      label: "Existential risk category",
    },
  ],
  outputs: [
    { id: "analysisQuestion", kind: "string", label: "Analysis question" },
    { id: "riskCategory", kind: "string", label: "Existential risk category" },
    { id: "taxonomyDefinition", kind: "string", label: "Taxonomy definition" },
  ],
  title: "Existential Risk Category Taxonomy Lookup",
});

export const runExistentialRiskTaxonomy = existentialRiskTaxonomyTool.execute;
export default existentialRiskTaxonomyTool;
