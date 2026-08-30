import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const categoryMaps = {
  ethicsAndValues: [
    "Safety",
    "Failure Transparency",
    "Judicial Transparency",
    "Responsibility",
    "Value Alignment",
    "Human Values",
    "Personal Privacy",
    "Liberty and Privacy",
    "Shared Benefit",
    "Shared Prosperity",
    "Human Control",
    "Non-subversion",
    "AI Arms Race",
  ],
  longerTermIssues: [
    "Capability Caution",
    "Importance",
    "Risks",
    "Recursive Self-Improvement",
    "Common Good",
  ],
  researchIssues: [
    "Research Goal",
    "Research Funding",
    "Science-Policy Link",
    "Research Culture",
    "Race Avoidance",
  ],
} as const;

export type AsilomarCategory = keyof typeof categoryMaps;

export type AsilomarCategoryInput = {
  readonly category: AsilomarCategory;
};

export type AsilomarCategoryOutput = {
  readonly category: AsilomarCategory;
  readonly principleCount: number;
  readonly principleNames: ReadonlyArray<string>;
};

export const lookupAsilomarPrincipleCategory = (
  input: AsilomarCategoryInput,
): AsilomarCategoryOutput => {
  const principleNames = categoryMaps[input.category];
  if (principleNames === undefined)
    simpleError(
      "category",
      "Category is not supported.",
      "unsupported_principle_category",
    );
  return {
    category: input.category,
    principleCount: principleNames.length,
    principleNames: [...principleNames],
  };
};

export const asilomarCategoryExample = {
  input: { category: "researchIssues" },
  output: {
    category: "researchIssues",
    principleCount: 5,
    principleNames: [
      "Research Goal",
      "Research Funding",
      "Science-Policy Link",
      "Research Culture",
      "Race Avoidance",
    ],
  },
} satisfies ToolExample<AsilomarCategoryInput, AsilomarCategoryOutput>;

export const asilomarCategoryTool = createSimpleTool({
  calculate: (input) =>
    lookupAsilomarPrincipleCategory({
      category: input.category as AsilomarCategory,
    }),
  description:
    "List the named Asilomar AI Principles in their published category: research issues, ethics and values, or longer-term issues.",
  id: "futurology/asilomar-principles-category-map-lookup",
  inputs: [
    {
      enum: ["ethicsAndValues", "longerTermIssues", "researchIssues"],
      id: "category",
      kind: "string",
      label: "Principle category",
    },
  ],
  outputs: [
    { id: "category", kind: "string", label: "Principle category" },
    {
      id: "principleCount",
      kind: "integer",
      label: "Principles in category",
      minimum: 1,
    },
    { id: "principleNames", kind: "stringList", label: "Principle names" },
  ],
  title: "Asilomar AI Principles Category Lookup",
});

export const runAsilomarCategory = asilomarCategoryTool.execute;
export default asilomarCategoryTool;
