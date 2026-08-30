import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const loopStages = {
  act: {
    action: "Assign owners, resources, and reversible actions.",
    artifact: "Action register",
    owner: "Decision owner",
  },
  deliberate: {
    action: "Compare options, trade-offs, and distributional effects.",
    artifact: "Decision record",
    owner: "Governance forum",
  },
  review: {
    action: "Compare outcomes with earlier assumptions and update the policy.",
    artifact: "Learning review",
    owner: "Evaluation team",
  },
  sense: {
    action: "Collect signals, uncertainty, and stakeholder evidence.",
    artifact: "Signal register",
    owner: "Foresight team",
  },
  analyze: {
    action: "Translate evidence into implications, scenarios, and options.",
    artifact: "Scenario brief",
    owner: "Analysis team",
  },
} as const;

export type AnticipatoryLoopStage = keyof typeof loopStages;

export type AnticipatoryGovernanceInput = {
  readonly loopStage: AnticipatoryLoopStage;
};

export type AnticipatoryGovernanceOutput = {
  readonly loopAction: string;
  readonly loopArtifact: string;
  readonly loopOwner: string;
  readonly loopStage: AnticipatoryLoopStage;
};

export const lookupAnticipatoryGovernanceLoop = (
  input: AnticipatoryGovernanceInput,
): AnticipatoryGovernanceOutput => {
  const stage = loopStages[input.loopStage];
  if (stage === undefined)
    simpleError(
      "loopStage",
      "Loop stage is not supported.",
      "unsupported_loop_stage",
    );
  return {
    loopAction: stage.action,
    loopArtifact: stage.artifact,
    loopOwner: stage.owner,
    loopStage: input.loopStage,
  };
};

export const anticipatoryGovernanceExample = {
  input: { loopStage: "analyze" },
  output: {
    loopAction: "Translate evidence into implications, scenarios, and options.",
    loopArtifact: "Scenario brief",
    loopOwner: "Analysis team",
    loopStage: "analyze",
  },
} satisfies ToolExample<
  AnticipatoryGovernanceInput,
  AnticipatoryGovernanceOutput
>;

export const anticipatoryGovernanceTool = createSimpleTool({
  calculate: (input) =>
    lookupAnticipatoryGovernanceLoop({
      loopStage: input.loopStage as AnticipatoryLoopStage,
    }),
  description:
    "Return the action, artifact, and owner for one stage of a caller-selected anticipatory governance loop.",
  id: "futurology/anticipatory-governance-feedback-loop-lookup",
  inputs: [
    {
      enum: ["sense", "analyze", "deliberate", "act", "review"],
      id: "loopStage",
      kind: "string",
      label: "Feedback loop stage",
    },
  ],
  outputs: [
    { id: "loopAction", kind: "string", label: "Loop action" },
    { id: "loopArtifact", kind: "string", label: "Loop artifact" },
    { id: "loopOwner", kind: "string", label: "Loop owner" },
    { id: "loopStage", kind: "string", label: "Feedback loop stage" },
  ],
  title: "Anticipatory Governance Feedback Loop Lookup",
});

export const runAnticipatoryGovernance = anticipatoryGovernanceTool.execute;
export default anticipatoryGovernanceTool;
