import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly materialFinding: boolean;
  readonly reportImpact: boolean;
  readonly regulatoryImpact: boolean;
  readonly remediationComplete: boolean;
  readonly governanceNotified: boolean;
}>;
export type Output = Readonly<{
  readonly escalationScore: number;
  readonly action: string;
  readonly followUpRequired: boolean;
}>;

export const calculate = (input: Input): Output => {
  const escalationScore =
    (input.materialFinding ? 3 : 0) +
    (input.reportImpact ? 3 : 0) +
    (input.regulatoryImpact ? 2 : 0) -
    (input.remediationComplete ? 2 : 0);
  const action =
    input.regulatoryImpact && input.reportImpact
      ? "legal-review"
      : input.materialFinding && !input.governanceNotified
        ? "notify-governance"
        : !input.remediationComplete
          ? "remediate"
          : "document";
  return {
    escalationScore: Math.max(0, escalationScore),
    action,
    followUpRequired:
      !input.remediationComplete ||
      input.reportImpact ||
      input.regulatoryImpact,
  };
};

export const exampleInput = {
  materialFinding: true,
  reportImpact: false,
  regulatoryImpact: false,
  remediationComplete: false,
  governanceNotified: false,
} satisfies Input;
export const exampleOutput = {
  escalationScore: 3,
  action: "notify-governance",
  followUpRequired: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      materialFinding: input.materialFinding as boolean,
      reportImpact: input.reportImpact as boolean,
      regulatoryImpact: input.regulatoryImpact as boolean,
      remediationComplete: input.remediationComplete as boolean,
      governanceNotified: input.governanceNotified as boolean,
    }),
  description:
    "Route post-signoff cold-review findings by impact and remediation status.",
  id: "auditing/cold-review-escalation",
  inputs: [
    { id: "materialFinding", label: "Finding is material", kind: "boolean" },
    {
      id: "reportImpact",
      label: "Finding affects issued report",
      kind: "boolean",
    },
    {
      id: "regulatoryImpact",
      label: "Finding has regulatory impact",
      kind: "boolean",
    },
    {
      id: "remediationComplete",
      label: "Remediation complete",
      kind: "boolean",
    },
    { id: "governanceNotified", label: "Governance notified", kind: "boolean" },
  ],
  outputs: [
    {
      id: "escalationScore",
      label: "Escalation score",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "action",
      label: "Cold-review action",
      kind: "string",
      enum: ["document", "remediate", "notify-governance", "legal-review"],
    },
    { id: "followUpRequired", label: "Follow-up required", kind: "boolean" },
  ],
  title: "Cold-Review Escalation",
});

export const run = tool.execute;
export default tool;
