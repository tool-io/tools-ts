import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MindUploadingFeasibilityInput = {
  readonly brainModelAccuracyPercent: number;
  readonly identityContinuityPercent: number;
  readonly memoryCoveragePercent: number;
  readonly reversibilityPercent: number;
  readonly readinessThresholdPercent: number;
};

export type MindUploadingFeasibilityOutput = {
  readonly blockerCount: number;
  readonly blockers: ReadonlyArray<string>;
  readonly feasibilityScorePercent: number;
  readonly readinessBand: "emerging" | "limited" | "low";
  readonly thresholdMet: boolean;
};

export const mapMindUploadingFeasibility = (
  input: MindUploadingFeasibilityInput,
): MindUploadingFeasibilityOutput => {
  for (const [field, value] of [
    ["brainModelAccuracyPercent", input.brainModelAccuracyPercent],
    ["identityContinuityPercent", input.identityContinuityPercent],
    ["memoryCoveragePercent", input.memoryCoveragePercent],
    ["reversibilityPercent", input.reversibilityPercent],
    ["readinessThresholdPercent", input.readinessThresholdPercent],
  ] as const)
    if (!Number.isFinite(value) || value < 0 || value > 100)
      simpleError(
        field,
        "Feasibility values must be finite values from 0 through 100.",
        "feasibility_value_out_of_range",
      );
  const feasibilityScorePercent =
    (input.brainModelAccuracyPercent +
      input.identityContinuityPercent +
      input.memoryCoveragePercent +
      input.reversibilityPercent) /
    4;
  const blockers: string[] = [];
  if (input.brainModelAccuracyPercent < input.readinessThresholdPercent)
    blockers.push("brain-model accuracy");
  if (input.identityContinuityPercent < input.readinessThresholdPercent)
    blockers.push("identity continuity");
  if (input.memoryCoveragePercent < input.readinessThresholdPercent)
    blockers.push("memory coverage");
  if (input.reversibilityPercent < input.readinessThresholdPercent)
    blockers.push("reversibility");
  return {
    blockerCount: blockers.length,
    blockers,
    feasibilityScorePercent,
    readinessBand:
      feasibilityScorePercent >= 80
        ? "emerging"
        : feasibilityScorePercent >= 50
          ? "limited"
          : "low",
    thresholdMet: feasibilityScorePercent >= input.readinessThresholdPercent,
  };
};

export const mindUploadingFeasibilityExample = {
  input: {
    brainModelAccuracyPercent: 60,
    identityContinuityPercent: 40,
    memoryCoveragePercent: 70,
    reversibilityPercent: 50,
    readinessThresholdPercent: 75,
  },
  output: {
    blockerCount: 4,
    blockers: [
      "brain-model accuracy",
      "identity continuity",
      "memory coverage",
      "reversibility",
    ],
    feasibilityScorePercent: 55,
    readinessBand: "limited",
    thresholdMet: false,
  },
} satisfies ToolExample<
  MindUploadingFeasibilityInput,
  MindUploadingFeasibilityOutput
>;

export const mindUploadingFeasibilityTool = createSimpleTool({
  calculate: (input) =>
    mapMindUploadingFeasibility({
      brainModelAccuracyPercent: input.brainModelAccuracyPercent as number,
      identityContinuityPercent: input.identityContinuityPercent as number,
      memoryCoveragePercent: input.memoryCoveragePercent as number,
      readinessThresholdPercent: input.readinessThresholdPercent as number,
      reversibilityPercent: input.reversibilityPercent as number,
    }),
  description:
    "Map caller-supplied whole-brain emulation readiness indicators to a transparent feasibility score, blockers, and readiness band.",
  id: "futurology/mind-uploading-whole-brain-emulation-feasibility-map",
  inputs: [
    {
      id: "brainModelAccuracyPercent",
      kind: "number",
      label: "Brain model accuracy percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "identityContinuityPercent",
      kind: "number",
      label: "Identity continuity percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "memoryCoveragePercent",
      kind: "number",
      label: "Memory coverage percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "readinessThresholdPercent",
      kind: "number",
      label: "Readiness threshold percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "reversibilityPercent",
      kind: "number",
      label: "Reversibility percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "blockerCount",
      kind: "integer",
      label: "Blockers",
      minimum: 0,
      maximum: 4,
    },
    { id: "blockers", kind: "stringList", label: "Blocker areas" },
    {
      id: "feasibilityScorePercent",
      kind: "number",
      label: "Feasibility score percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      enum: ["low", "limited", "emerging"],
      id: "readinessBand",
      kind: "string",
      label: "Readiness band",
    },
    { id: "thresholdMet", kind: "boolean", label: "Readiness threshold met" },
  ],
  title: "Mind Uploading Whole Brain Emulation Feasibility Map",
});

export const runMindUploadingFeasibility = mindUploadingFeasibilityTool.execute;
export default mindUploadingFeasibilityTool;
