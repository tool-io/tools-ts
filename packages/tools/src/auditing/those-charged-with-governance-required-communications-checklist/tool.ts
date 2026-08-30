import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TcwgCommunicationsInput = {
  readonly communicatedAuditScope: boolean;
  readonly communicatedSignificantFindings: boolean;
  readonly communicatedUncorrectedMisstatements: boolean;
  readonly independenceConfirmed: boolean;
  readonly significantJudgmentsCommunicated: boolean;
};

export type TcwgCommunicationsOutput = {
  readonly complete: boolean;
  readonly completedCount: number;
  readonly missingCommunications: ReadonlyArray<string>;
  readonly requiredCommunicationCount: number;
};

export const checkTcwgCommunications = (
  input: TcwgCommunicationsInput,
): TcwgCommunicationsOutput => {
  const items: readonly (readonly [string, boolean])[] = [
    ["independence", input.independenceConfirmed],
    ["audit scope", input.communicatedAuditScope],
    ["significant judgments", input.significantJudgmentsCommunicated],
    ["significant findings", input.communicatedSignificantFindings],
    ["uncorrected misstatements", input.communicatedUncorrectedMisstatements],
  ];
  for (const [item, communicated] of items)
    if (typeof communicated !== "boolean")
      simpleError(
        item.replaceAll(" ", ""),
        `${item} must be a boolean.`,
        "boolean_field_required",
      );
  const missingCommunications = items
    .filter(([, communicated]) => !communicated)
    .map(([item]) => item);
  return {
    complete: missingCommunications.length === 0,
    completedCount: items.length - missingCommunications.length,
    missingCommunications,
    requiredCommunicationCount: items.length,
  };
};

export const tcwgCommunicationsExample = {
  input: {
    communicatedAuditScope: true,
    communicatedSignificantFindings: true,
    communicatedUncorrectedMisstatements: false,
    independenceConfirmed: true,
    significantJudgmentsCommunicated: true,
  },
  output: {
    complete: false,
    completedCount: 4,
    missingCommunications: ["uncorrected misstatements"],
    requiredCommunicationCount: 5,
  },
} satisfies ToolExample<TcwgCommunicationsInput, TcwgCommunicationsOutput>;

export const tcwgCommunicationsTool = createSimpleTool({
  calculate: (input) =>
    checkTcwgCommunications({
      communicatedAuditScope: input.communicatedAuditScope as boolean,
      communicatedSignificantFindings:
        input.communicatedSignificantFindings as boolean,
      communicatedUncorrectedMisstatements:
        input.communicatedUncorrectedMisstatements as boolean,
      independenceConfirmed: input.independenceConfirmed as boolean,
      significantJudgmentsCommunicated:
        input.significantJudgmentsCommunicated as boolean,
    }),
  description:
    "Check caller-defined audit communications to those charged with governance for independence, scope, judgments, findings, and uncorrected misstatements.",
  id: "auditing/those-charged-with-governance-required-communications-checklist",
  inputs: [
    {
      id: "communicatedAuditScope",
      kind: "boolean",
      label: "Scope communicated",
    },
    {
      id: "communicatedSignificantFindings",
      kind: "boolean",
      label: "Significant findings communicated",
    },
    {
      id: "communicatedUncorrectedMisstatements",
      kind: "boolean",
      label: "Uncorrected misstatements communicated",
    },
    {
      id: "independenceConfirmed",
      kind: "boolean",
      label: "Independence confirmed",
    },
    {
      id: "significantJudgmentsCommunicated",
      kind: "boolean",
      label: "Significant judgments communicated",
    },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Communications complete" },
    {
      id: "completedCount",
      kind: "integer",
      label: "Items communicated",
      minimum: 0,
    },
    {
      id: "missingCommunications",
      kind: "stringList",
      label: "Missing communications",
    },
    {
      id: "requiredCommunicationCount",
      kind: "integer",
      label: "Items checked",
      minimum: 5,
    },
  ],
  title: "Those Charged With Governance Required Communications Checklist",
});

export const runTcwgCommunications = tcwgCommunicationsTool.execute;
export default tcwgCommunicationsTool;
