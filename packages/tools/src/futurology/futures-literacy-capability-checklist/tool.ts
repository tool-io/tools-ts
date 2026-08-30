import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const capabilityIds = [
  "scenarioFraming",
  "uncertaintyReasoning",
  "evidenceAssessment",
  "systemsThinking",
  "strategicResponse",
  "communication",
] as const;
const defaultRatings = [0, 0, 0, 0, 0, 0];

export type FuturesLiteracyInput = {
  readonly capabilityRatings: ReadonlyArray<number>;
  readonly minimumCompletionPercent: number;
};

export type FuturesLiteracyOutput = {
  readonly capabilityChecklist: ReadonlyArray<string>;
  readonly completionPercent: number;
  readonly nextCapabilities: ReadonlyArray<string>;
  readonly ready: boolean;
};

export const assessFuturesLiteracyCapability = (
  input: FuturesLiteracyInput,
): FuturesLiteracyOutput => {
  if (
    !Array.isArray(input.capabilityRatings) ||
    input.capabilityRatings.length !== capabilityIds.length
  )
    simpleError(
      "capabilityRatings",
      "Six capability ratings are required in canonical order.",
      "capability_ratings_length_mismatch",
    );
  for (const [index, rating] of input.capabilityRatings.entries())
    if (!Number.isSafeInteger(rating) || rating < 0 || rating > 3)
      simpleError(
        `capabilityRatings.${index}`,
        "Capability ratings must be integers from 0 through 3.",
        "invalid_capability_rating",
      );
  if (
    !Number.isFinite(input.minimumCompletionPercent) ||
    input.minimumCompletionPercent < 0 ||
    input.minimumCompletionPercent > 100
  )
    simpleError(
      "minimumCompletionPercent",
      "Minimum completion must be a value from 0 through 100.",
      "invalid_completion_threshold",
    );
  const possibleRatingPoints = capabilityIds.length * 3;
  const earnedRatingPoints = input.capabilityRatings.reduce(
    (total, rating) => total + rating,
    0,
  );
  const completionPercent = (earnedRatingPoints / possibleRatingPoints) * 100;
  return {
    capabilityChecklist: capabilityIds.map(
      (capability, index) =>
        `${capability}: ${input.capabilityRatings[index]}/3`,
    ),
    completionPercent,
    nextCapabilities: capabilityIds.filter(
      (_, index) => input.capabilityRatings[index]! < 3,
    ),
    ready: completionPercent >= input.minimumCompletionPercent,
  };
};

export const futuresLiteracyExample = {
  input: {
    capabilityRatings: [3, 3, 2, 2, 2, 1],
    minimumCompletionPercent: 75,
  },
  output: {
    capabilityChecklist: [
      "scenarioFraming: 3/3",
      "uncertaintyReasoning: 3/3",
      "evidenceAssessment: 2/3",
      "systemsThinking: 2/3",
      "strategicResponse: 2/3",
      "communication: 1/3",
    ],
    completionPercent: 72.22222222222221,
    nextCapabilities: [
      "evidenceAssessment",
      "systemsThinking",
      "strategicResponse",
      "communication",
    ],
    ready: false,
  },
} satisfies ToolExample<FuturesLiteracyInput, FuturesLiteracyOutput>;

export const futuresLiteracyTool = createSimpleTool({
  calculate: (input) =>
    assessFuturesLiteracyCapability({
      capabilityRatings:
        input.capabilityRatings === undefined
          ? defaultRatings
          : (input.capabilityRatings as number[]),
      minimumCompletionPercent: input.minimumCompletionPercent as number,
    }),
  description:
    "Score six futures-literacy capabilities and build a checklist against a caller-supplied completion threshold.",
  id: "futurology/futures-literacy-capability-checklist",
  inputs: [
    {
      default: defaultRatings,
      description:
        "Six integers from 0 through 3 in canonical capability order.",
      id: "capabilityRatings",
      kind: "numberList",
      label: "Capability ratings",
    },
    {
      id: "minimumCompletionPercent",
      kind: "number",
      label: "Minimum completion percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "capabilityChecklist",
      kind: "stringList",
      label: "Capability checklist",
    },
    {
      id: "completionPercent",
      kind: "number",
      label: "Completion percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "nextCapabilities",
      kind: "stringList",
      label: "Capabilities to develop",
    },
    { id: "ready", kind: "boolean", label: "Threshold met" },
  ],
  title: "Futures Literacy Capability Checklist",
});

export const runFuturesLiteracy = futuresLiteracyTool.execute;
export default futuresLiteracyTool;
