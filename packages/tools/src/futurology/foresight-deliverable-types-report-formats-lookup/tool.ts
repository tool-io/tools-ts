import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const deliverables = {
  monitoring: {
    audience: "Decision owners and delivery teams",
    cadence: "Monthly or when a threshold changes",
    decisionLink: "Continue, adapt, pause, or stop the current action",
    format:
      "Indicator dashboard with signposts, thresholds, owners, and response triggers",
  },
  roadmap: {
    audience: "Delivery, finance, and governance teams",
    cadence: "Quarterly",
    decisionLink: "Sequence investments and capacity commitments",
    format:
      "Outcome roadmap with dependencies, assumptions, and no-regret actions",
  },
  scan: {
    audience: "Strategy and research teams",
    cadence: "Monthly, quarterly, or semiannual",
    decisionLink: "Choose which weak signals deserve investigation",
    format:
      "Horizon scan with evidence, alternative explanations, and signposts",
  },
  scenarios: {
    audience: "Strategy, risk, and decision teams",
    cadence: "At material uncertainty or when assumptions change",
    decisionLink: "Stress-test strategy under coherent alternative conditions",
    format:
      "Scenario set with drivers, coherence checks, signposts, and implications",
  },
  strategy: {
    audience: "Senior decision makers and delivery owners",
    cadence: "At strategy reviews and major inflection points",
    decisionLink:
      "Choose options, no-regret moves, triggers, and resource allocations",
    format:
      "Strategic choice brief with options, trade-offs, robustness, and actions",
  },
} as const;

export type ForesightDeliverableType = keyof typeof deliverables;

export type ForesightDeliverableInput = {
  readonly deliverableType: ForesightDeliverableType;
};

export type ForesightDeliverableOutput = {
  readonly audience: string;
  readonly cadence: string;
  readonly decisionLink: string;
  readonly deliverableType: ForesightDeliverableType;
  readonly format: string;
};

export const lookupForesightDeliverable = (
  input: ForesightDeliverableInput,
): ForesightDeliverableOutput => {
  const deliverable = deliverables[input.deliverableType];
  if (deliverable === undefined)
    simpleError(
      "deliverableType",
      "Foresight deliverable type is not supported.",
      "unsupported_foresight_deliverable",
    );
  return {
    audience: deliverable.audience,
    cadence: deliverable.cadence,
    decisionLink: deliverable.decisionLink,
    deliverableType: input.deliverableType,
    format: deliverable.format,
  };
};

export const foresightDeliverableExample = {
  input: { deliverableType: "scenarios" },
  output: {
    audience: "Strategy, risk, and decision teams",
    cadence: "At material uncertainty or when assumptions change",
    decisionLink: "Stress-test strategy under coherent alternative conditions",
    deliverableType: "scenarios",
    format:
      "Scenario set with drivers, coherence checks, signposts, and implications",
  },
} satisfies ToolExample<ForesightDeliverableInput, ForesightDeliverableOutput>;

export const foresightDeliverableTool = createSimpleTool({
  calculate: (input) =>
    lookupForesightDeliverable({
      deliverableType: input.deliverableType as ForesightDeliverableType,
    }),
  description:
    "Return the recommended format, audience, cadence, and decision link for a foresight scan, scenario, strategy, roadmap, or monitoring deliverable.",
  id: "futurology/foresight-deliverable-types-report-formats-lookup",
  inputs: [
    {
      enum: ["scan", "scenarios", "strategy", "roadmap", "monitoring"],
      id: "deliverableType",
      kind: "string",
      label: "Foresight deliverable type",
    },
  ],
  outputs: [
    { id: "audience", kind: "string", label: "Primary audience" },
    { id: "cadence", kind: "string", label: "Review cadence" },
    { id: "decisionLink", kind: "string", label: "Decision link" },
    {
      id: "deliverableType",
      kind: "string",
      label: "Foresight deliverable type",
    },
    { id: "format", kind: "string", label: "Report format" },
  ],
  title: "Foresight Deliverable Types Report Formats Lookup",
});

export const runForesightDeliverable = foresightDeliverableTool.execute;
export default foresightDeliverableTool;
