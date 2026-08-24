import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HistoriatedInitialTierClassifierInput = {
  readonly humanFigureCount: number;
  readonly animalFigureCount: number;
  readonly narrativeScene: boolean;
};

export type HistoriatedInitialTierClassifierOutput = {
  readonly tier: "decorated" | "inhabited" | "historiated";
  readonly figureTotal: number;
};

export const calculateHistoriatedInitialTierClassifier = (
  input: HistoriatedInitialTierClassifierInput,
): HistoriatedInitialTierClassifierOutput => {
  if (!(
    Number.isSafeInteger(input.humanFigureCount) && input.humanFigureCount >= 0
  ))
    return simpleError(
      "humanFigureCount",
      "Human figure count must be a non-negative integer.",
      "invalid_count",
    );
  if (!(
    Number.isSafeInteger(input.animalFigureCount) &&
    input.animalFigureCount >= 0
  ))
    return simpleError(
      "animalFigureCount",
      "Animal figure count must be a non-negative integer.",
      "invalid_count",
    );
  const figureTotal = input.humanFigureCount + input.animalFigureCount;
  if (!Number.isSafeInteger(figureTotal))
    return simpleError(
      "animalFigureCount",
      "The combined figure count must be a safe integer.",
      "invalid_count",
    );
  const tier = input.narrativeScene
    ? "historiated"
    : figureTotal >= 1
      ? "inhabited"
      : "decorated";
  return { tier, figureTotal };
};

export const historiatedInitialTierClassifierExample = {
  input: { humanFigureCount: 2, animalFigureCount: 1, narrativeScene: true },
  output: { tier: "historiated", figureTotal: 3 },
} satisfies ToolExample<
  HistoriatedInitialTierClassifierInput,
  HistoriatedInitialTierClassifierOutput
>;

export const historiatedInitialTierClassifierTool = createSimpleTool({
  id: "paleography/historiated-initial-tier-classifier",
  title: "Historiated Initial Tier Classifier",
  description:
    "Classify an initial on the standard catalogue ladder: an identifiable narrative scene is historiated, a non-narrative human or animal figure is inhabited, and foliage or other ornament without figures is decorated.",
  inputs: [
    {
      description: "Human figures visible inside the initial.",
      id: "humanFigureCount",
      kind: "integer",
      label: "Human figures",
      minimum: 0,
    },
    {
      description:
        "Non-narrative animal figures inside the initial; do not count foliage.",
      id: "animalFigureCount",
      kind: "integer",
      label: "Animal figures",
      minimum: 0,
    },
    {
      description:
        "True when the initial depicts a recognisable narrative scene.",
      id: "narrativeScene",
      kind: "boolean",
      label: "Narrative scene",
    },
  ],
  outputs: [
    {
      description: "Catalogue tier of the initial.",
      id: "tier",
      enum: ["decorated", "inhabited", "historiated"],
      kind: "string",
      label: "Tier",
    },
    {
      description: "Total figures of all kinds inside the initial.",
      id: "figureTotal",
      kind: "integer",
      label: "Figure total",
    },
  ],
  calculate: (input) =>
    calculateHistoriatedInitialTierClassifier({
      animalFigureCount: input.animalFigureCount as number,
      humanFigureCount: input.humanFigureCount as number,
      narrativeScene: input.narrativeScene as boolean,
    }),
});

export const runHistoriatedInitialTierClassifier =
  historiatedInitialTierClassifierTool.execute;
export default historiatedInitialTierClassifierTool;
