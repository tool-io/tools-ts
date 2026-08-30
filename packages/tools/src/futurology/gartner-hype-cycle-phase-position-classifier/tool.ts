import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const phases = [
  "innovation_trigger",
  "peak_of_inflated_expectations",
  "trough_of_disillusionment",
  "slope_of_enlightenment",
  "plateau_of_productivity",
] as const;

export type HypeCyclePositionInput = {
  readonly innovationTriggerScore: number;
  readonly peakScore: number;
  readonly plateauScore: number;
  readonly slopeScore: number;
  readonly troughScore: number;
};

export type HypeCyclePositionOutput = {
  readonly phase: (typeof phases)[number];
  readonly positionScore: number;
  readonly tiedPhases: ReadonlyArray<string>;
};

export const classifyHypeCyclePhase = (
  input: HypeCyclePositionInput,
): HypeCyclePositionOutput => {
  const scores: Record<(typeof phases)[number], number> = {
    innovation_trigger: input.innovationTriggerScore,
    peak_of_inflated_expectations: input.peakScore,
    plateau_of_productivity: input.plateauScore,
    slope_of_enlightenment: input.slopeScore,
    trough_of_disillusionment: input.troughScore,
  };
  for (const [phase, score] of Object.entries(scores))
    if (!Number.isFinite(score) || score < 0 || score > 100)
      simpleError(
        phase,
        "Phase scores must be finite values from 0 through 100.",
        "phase_score_out_of_range",
      );
  const positionScore = Math.max(...Object.values(scores));
  const tiedPhases = phases.filter((phase) => scores[phase] === positionScore);
  return { phase: tiedPhases[0]!, positionScore, tiedPhases };
};

export const hypeCyclePositionExample = {
  input: {
    innovationTriggerScore: 20,
    peakScore: 90,
    plateauScore: 5,
    slopeScore: 10,
    troughScore: 30,
  },
  output: {
    phase: "peak_of_inflated_expectations",
    positionScore: 90,
    tiedPhases: ["peak_of_inflated_expectations"],
  },
} satisfies ToolExample<HypeCyclePositionInput, HypeCyclePositionOutput>;

export const hypeCyclePositionTool = createSimpleTool({
  calculate: (input) =>
    classifyHypeCyclePhase({
      innovationTriggerScore: input.innovationTriggerScore as number,
      peakScore: input.peakScore as number,
      plateauScore: input.plateauScore as number,
      slopeScore: input.slopeScore as number,
      troughScore: input.troughScore as number,
    }),
  description:
    "Choose the strongest caller-assigned fit among the five published Hype Cycle phases. The scores are a user-defined assessment and are not Gartner measurements.",
  id: "futurology/gartner-hype-cycle-phase-position-classifier",
  inputs: [
    {
      id: "innovationTriggerScore",
      kind: "number",
      label: "Innovation Trigger score",
      maximum: 100,
      minimum: 0,
    },
    {
      id: "peakScore",
      kind: "number",
      label: "Peak of Inflated Expectations score",
      maximum: 100,
      minimum: 0,
    },
    {
      id: "troughScore",
      kind: "number",
      label: "Trough of Disillusionment score",
      maximum: 100,
      minimum: 0,
    },
    {
      id: "slopeScore",
      kind: "number",
      label: "Slope of Enlightenment score",
      maximum: 100,
      minimum: 0,
    },
    {
      id: "plateauScore",
      kind: "number",
      label: "Plateau of Productivity score",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    { enum: [...phases], id: "phase", kind: "string", label: "Leading phase" },
    {
      id: "positionScore",
      kind: "number",
      label: "Leading score",
      maximum: 100,
      minimum: 0,
    },
    { id: "tiedPhases", kind: "stringList", label: "Tied leading phases" },
  ],
  title: "Gartner Hype Cycle Phase Position Classifier",
});

export const runHypeCyclePosition = hypeCyclePositionTool.execute;
export default hypeCyclePositionTool;
