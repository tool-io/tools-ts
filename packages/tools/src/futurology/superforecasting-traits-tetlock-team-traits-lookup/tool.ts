import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const traits = {
  calibration: {
    practice:
      "Score forecasts and compare predicted with observed ranges over time.",
    trait:
      "Calibration seeks accurate probabilities rather than confidence or rhetorical certainty.",
  },
  diverseViews: {
    practice: "Seek independent models before discussing the group aggregate.",
    trait:
      "Diverse views reduce premature convergence and correlated blind spots.",
  },
  disciplinedUpdating: {
    practice:
      "Record updates, new evidence, and reasons whenever beliefs change.",
    trait:
      "Disciplined updating changes forecasts in response to evidence rather than identity or social pressure.",
  },
  decomposition: {
    practice:
      "Decompose a target into drivers, dependencies, and sub-forecasts.",
    trait: "Decomposition makes a complex target measurable and updateable.",
  },
  teamStructure: {
    practice:
      "Combine independent estimates before aggregation and preserve minority forecasts.",
    trait:
      "Structured aggregation combines expert judgment while retaining information from disagreement.",
  },
} as const;

export type SuperforecastingTrait = keyof typeof traits;

export type SuperforecastingTraitInput = {
  readonly trait: SuperforecastingTrait;
};

export type SuperforecastingTraitOutput = {
  readonly teamPractice: string;
  readonly trait: SuperforecastingTrait;
  readonly traitDefinition: string;
};

export const lookupSuperforecastingTrait = (
  input: SuperforecastingTraitInput,
): SuperforecastingTraitOutput => {
  const trait = traits[input.trait];
  if (trait === undefined)
    simpleError(
      "trait",
      "Superforecasting trait is not supported.",
      "unsupported_superforecasting_trait",
    );
  return {
    teamPractice: trait.practice,
    trait: input.trait,
    traitDefinition: trait.trait,
  };
};

export const superforecastingTraitExample = {
  input: { trait: "calibration" },
  output: {
    teamPractice:
      "Score forecasts and compare predicted with observed ranges over time.",
    trait: "calibration",
    traitDefinition:
      "Calibration seeks accurate probabilities rather than confidence or rhetorical certainty.",
  },
} satisfies ToolExample<
  SuperforecastingTraitInput,
  SuperforecastingTraitOutput
>;

export const superforecastingTraitTool = createSimpleTool({
  calculate: (input) =>
    lookupSuperforecastingTrait({
      trait: input.trait as SuperforecastingTrait,
    }),
  description:
    "Return the definition and team practice for a calibration, diversity, updating, decomposition, or aggregation trait.",
  id: "futurology/superforecasting-traits-tetlock-team-traits-lookup",
  inputs: [
    {
      enum: [
        "calibration",
        "diverseViews",
        "disciplinedUpdating",
        "decomposition",
        "teamStructure",
      ],
      id: "trait",
      kind: "string",
      label: "Superforecasting trait",
    },
  ],
  outputs: [
    { id: "teamPractice", kind: "string", label: "Team practice" },
    { id: "trait", kind: "string", label: "Superforecasting trait" },
    { id: "traitDefinition", kind: "string", label: "Trait definition" },
  ],
  title: "Superforecasting Traits Tetlock Team Traits Lookup",
});

export const runSuperforecastingTrait = superforecastingTraitTool.execute;
export default superforecastingTraitTool;
