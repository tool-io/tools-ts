import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly openDisagreements: number;
  readonly materialDisagreements: number;
  readonly resolvedDisagreements: number;
  readonly governanceNotified: boolean;
}>;
export type Output = Readonly<{
  readonly unresolvedCount: number;
  readonly resolutionPercent: number;
  readonly status: string;
}>;

export const calculate = (input: Input): Output => {
  const total = input.openDisagreements + input.resolvedDisagreements;
  if (input.materialDisagreements > input.openDisagreements)
    simpleError(
      "materialDisagreements",
      "Material open disagreements cannot exceed open disagreements.",
      "invalid_counts",
    );
  const unresolvedCount = input.openDisagreements;
  return {
    unresolvedCount,
    resolutionPercent:
      total === 0 ? 100 : (input.resolvedDisagreements / total) * 100,
    status:
      input.materialDisagreements > 0 && !input.governanceNotified
        ? "escalate"
        : unresolvedCount > 0
          ? "action-required"
          : "clear",
  };
};

export const exampleInput = {
  openDisagreements: 1,
  materialDisagreements: 1,
  resolvedDisagreements: 3,
  governanceNotified: true,
} satisfies Input;
export const exampleOutput = {
  unresolvedCount: 1,
  resolutionPercent: 75,
  status: "action-required",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      openDisagreements: input.openDisagreements as number,
      materialDisagreements: input.materialDisagreements as number,
      resolvedDisagreements: input.resolvedDisagreements as number,
      governanceNotified: input.governanceNotified as boolean,
    }),
  description:
    "Summarize draft-report disagreement resolution and escalation status.",
  id: "auditing/disagreement-resolution",
  inputs: [
    {
      id: "openDisagreements",
      label: "Open disagreements",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "materialDisagreements",
      label: "Material disagreements",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "resolvedDisagreements",
      label: "Resolved disagreements",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "governanceNotified",
      label: "Governance notified when required",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "unresolvedCount",
      label: "Unresolved disagreements",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "resolutionPercent",
      label: "Resolution rate",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "status",
      label: "Resolution status",
      kind: "string",
      enum: ["clear", "action-required", "escalate"],
    },
  ],
  title: "Disagreement Resolution",
});

export const run = tool.execute;
export default tool;
