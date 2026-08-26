import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OnomasticOriginHintScorerInput = {
  readonly hasLatinGentilicium: boolean;
  readonly hasGreekElements: boolean;
  readonly hasLocalEpithet: boolean;
};

export type OnomasticOriginHintScorerOutput = {
  readonly italianScore: number;
  readonly greekScore: number;
  readonly regionalScore: number;
  readonly hint: "italian" | "greek" | "regional" | "uncertain";
};

export const calculateOnomasticOriginHintScorer = (
  input: OnomasticOriginHintScorerInput,
): OnomasticOriginHintScorerOutput => {
  for (const field of [
    "hasLatinGentilicium",
    "hasGreekElements",
    "hasLocalEpithet",
  ] as const)
    if (typeof input[field] !== "boolean")
      return simpleError(field, "Markers must be booleans.", "invalid_marker");
  const italianScore = input.hasLatinGentilicium ? 1 : 0;
  const greekScore = input.hasGreekElements ? 1 : 0;
  const regionalScore = input.hasLocalEpithet ? 1 : 0;
  const scores: ReadonlyArray<
    readonly [OnomasticOriginHintScorerOutput["hint"], number]
  > = [
    ["italian", italianScore],
    ["greek", greekScore],
    ["regional", regionalScore],
  ];
  const leaders = scores.filter(([, score]) => score === 1);
  return {
    italianScore,
    greekScore,
    regionalScore,
    hint: leaders.length === 1 ? leaders[0]![0] : "uncertain",
  };
};

export const onomasticOriginHintScorerExample = {
  input: {
    hasLatinGentilicium: true,
    hasGreekElements: false,
    hasLocalEpithet: false,
  },
  output: { italianScore: 1, greekScore: 0, regionalScore: 0, hint: "italian" },
} satisfies ToolExample<
  OnomasticOriginHintScorerInput,
  OnomasticOriginHintScorerOutput
>;

export const onomasticOriginHintScorerTool = createSimpleTool({
  id: "epigraphy/onomastic-origin-hint-scorer",
  title: "Onomastic Region Origin Probability Hint Scorer",
  description:
    "Score explicit onomastic markers one point each (Latin gentilicium toward Italian origin, Greek name elements toward Greek origin, local epithet toward a regional origin) and hint at the single leading class or 'uncertain' on ties.",
  inputs: [
    {
      description: "The name carries a Latin gentilicium.",
      id: "hasLatinGentilicium",
      kind: "boolean",
      label: "Latin gentilicium",
    },
    {
      description: "The name carries Greek name elements.",
      id: "hasGreekElements",
      kind: "boolean",
      label: "Greek elements",
    },
    {
      description: "The name carries a local/regional epithet.",
      id: "hasLocalEpithet",
      kind: "boolean",
      label: "Local epithet",
    },
  ],
  outputs: [
    {
      description: "Italian-origin marker score (0 or 1).",
      id: "italianScore",
      kind: "integer",
      label: "Italian score",
    },
    {
      description: "Greek-origin marker score (0 or 1).",
      id: "greekScore",
      kind: "integer",
      label: "Greek score",
    },
    {
      description: "Regional-origin marker score (0 or 1).",
      id: "regionalScore",
      kind: "integer",
      label: "Regional score",
    },
    {
      description: "Single highest-scoring class, or uncertain on ties.",
      enum: ["italian", "greek", "regional", "uncertain"],
      id: "hint",
      kind: "string",
      label: "Hint",
    },
  ],
  calculate: (input) =>
    calculateOnomasticOriginHintScorer(
      input as unknown as OnomasticOriginHintScorerInput,
    ),
});

export const runOnomasticOriginHintScorer =
  onomasticOriginHintScorerTool.execute;
export default onomasticOriginHintScorerTool;
