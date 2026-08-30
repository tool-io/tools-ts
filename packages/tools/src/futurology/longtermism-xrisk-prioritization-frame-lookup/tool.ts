import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const reversibilityLabels = [
  "irreversible",
  "hardToReverse",
  "reversible",
] as const;
const scopeLabels = ["civilization", "global", "regional", "local"] as const;

export type XriskPriorityInput = {
  readonly impactScore: number;
  readonly planningHorizonYears: number;
  readonly reversibility: (typeof reversibilityLabels)[number];
  readonly riskScope: (typeof scopeLabels)[number];
  readonly urgencyScore: number;
};

export type XriskPriorityOutput = {
  readonly frameGuidance: string;
  readonly priorityScore: number;
  readonly scoreFactors: ReadonlyArray<string>;
};

export const prioritizeXriskWithLongtermistFrame = (
  input: XriskPriorityInput,
): XriskPriorityOutput => {
  if (
    !Number.isFinite(input.planningHorizonYears) ||
    input.planningHorizonYears < 0
  )
    simpleError(
      "planningHorizonYears",
      "Planning horizon must be finite and nonnegative.",
      "invalid_planning_horizon",
    );
  for (const [field, value] of [
    ["impactScore", input.impactScore],
    ["urgencyScore", input.urgencyScore],
  ] as const)
    if (!Number.isFinite(value) || value < 0 || value > 100)
      simpleError(
        field,
        "Impact and urgency must be finite values from 0 through 100.",
        "priority_score_out_of_range",
      );
  if (!reversibilityLabels.includes(input.reversibility))
    simpleError(
      "reversibility",
      "Reversibility label is not supported.",
      "invalid_reversibility",
    );
  if (!scopeLabels.includes(input.riskScope))
    simpleError(
      "riskScope",
      "Risk scope label is not supported.",
      "invalid_risk_scope",
    );
  const reversibilityMultiplier =
    input.reversibility === "irreversible"
      ? 1.25
      : input.reversibility === "hardToReverse"
        ? 1.1
        : 1;
  const scopeMultiplier =
    input.riskScope === "civilization"
      ? 1.25
      : input.riskScope === "global"
        ? 1.15
        : input.riskScope === "regional"
          ? 1.05
          : 1;
  const horizonMultiplier = Math.min(
    1.1,
    1 + input.planningHorizonYears / 1000,
  );
  const rawPriorityScore =
    (input.impactScore * 0.5 + input.urgencyScore * 0.5) *
    reversibilityMultiplier *
    scopeMultiplier *
    horizonMultiplier;
  const priorityScore = Math.min(100, rawPriorityScore);
  if (!Number.isFinite(priorityScore))
    simpleError("", "The priority score is not finite.", "result_not_finite");
  return {
    frameGuidance:
      "Use the frame to make irreversible, large-scale, and long-horizon effects visible while still testing near-term harms, affected people, and intervention evidence.",
    priorityScore,
    scoreFactors: [
      `impact=${input.impactScore}`,
      `urgency=${input.urgencyScore}`,
      `reversibility=${input.reversibility}`,
      `scope=${input.riskScope}`,
      `horizonYears=${input.planningHorizonYears}`,
    ],
  };
};

export const xriskPriorityExample = {
  input: {
    impactScore: 90,
    planningHorizonYears: 500,
    reversibility: "irreversible",
    riskScope: "civilization",
    urgencyScore: 40,
  },
  output: {
    frameGuidance:
      "Use the frame to make irreversible, large-scale, and long-horizon effects visible while still testing near-term harms, affected people, and intervention evidence.",
    priorityScore: 100,
    scoreFactors: [
      "impact=90",
      "urgency=40",
      "reversibility=irreversible",
      "scope=civilization",
      "horizonYears=500",
    ],
  },
} satisfies ToolExample<XriskPriorityInput, XriskPriorityOutput>;

export const xriskPriorityTool = createSimpleTool({
  calculate: (input) =>
    prioritizeXriskWithLongtermistFrame({
      impactScore: input.impactScore as number,
      planningHorizonYears: input.planningHorizonYears as number,
      reversibility:
        input.reversibility as (typeof reversibilityLabels)[number],
      riskScope: input.riskScope as (typeof scopeLabels)[number],
      urgencyScore: input.urgencyScore as number,
    }),
  description:
    "Apply a transparent longtermism-style frame to caller-supplied impact, urgency, reversibility, scope, and horizon values.",
  id: "futurology/longtermism-xrisk-prioritization-frame-lookup",
  inputs: [
    {
      id: "impactScore",
      kind: "number",
      label: "Impact score",
      maximum: 100,
      minimum: 0,
    },
    {
      id: "planningHorizonYears",
      kind: "number",
      label: "Planning horizon years",
      minimum: 0,
    },
    {
      enum: [...reversibilityLabels],
      id: "reversibility",
      kind: "string",
      label: "Reversibility",
    },
    {
      enum: [...scopeLabels],
      id: "riskScope",
      kind: "string",
      label: "Risk scope",
    },
    {
      id: "urgencyScore",
      kind: "number",
      label: "Urgency score",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    { id: "frameGuidance", kind: "string", label: "Frame guidance" },
    {
      id: "priorityScore",
      kind: "number",
      label: "Priority score",
      maximum: 100,
      minimum: 0,
    },
    { id: "scoreFactors", kind: "stringList", label: "Score factors" },
  ],
  title: "Longtermism Xrisk Prioritization Frame Lookup",
});

export const runXriskPriority = xriskPriorityTool.execute;
export default xriskPriorityTool;
