import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PremortemInput = {
  readonly failureModes: ReadonlyArray<string>;
  readonly mitigations: ReadonlyArray<string>;
  readonly warningSignals: ReadonlyArray<string>;
};

export type PremortemOutput = {
  readonly failureReviews: ReadonlyArray<string>;
  readonly fullyReviewedFailureCount: number;
  readonly uncoveredFailureModes: ReadonlyArray<string>;
};

const linkedTerms = (
  entries: ReadonlyArray<string>,
  field: string,
): Map<string, Set<string>> => {
  const linked = new Map<string, Set<string>>();
  for (const [index, entry] of entries.entries()) {
    if (typeof entry !== "string" || !entry.includes("|"))
      simpleError(
        `${field}.${index}`,
        "Linked entries must use failureMode|detail form.",
        "invalid_linked_entry",
      );
    const [failureMode, ...details] = entry.split("|");
    const detail = details.join("|").trim();
    const normalizedFailureMode = failureMode?.trim() ?? "";
    if (normalizedFailureMode === "" || detail === "")
      simpleError(
        "linkedEntries",
        "Linked entries must include a failure mode and detail.",
        "invalid_linked_entry",
      );
    const values = linked.get(normalizedFailureMode) ?? new Set<string>();
    values.add(detail);
    linked.set(normalizedFailureMode, values);
  }
  return linked;
};

export const checkProspectiveHindsightFailureCoverage = (
  input: PremortemInput,
): PremortemOutput => {
  if (!Array.isArray(input.failureModes) || input.failureModes.length === 0)
    simpleError(
      "failureModes",
      "At least one failure mode is required.",
      "failure_modes_required",
    );
  const failureModes = input.failureModes.map((failureMode, index) => {
    if (typeof failureMode !== "string" || failureMode.trim() === "")
      simpleError(
        `failureModes.${index}`,
        "Failure modes must be nonempty strings.",
        "invalid_failure_mode",
      );
    return failureMode.trim();
  });
  if (new Set(failureModes).size !== failureModes.length)
    simpleError(
      "failureModes",
      "Failure modes must be unique.",
      "duplicate_failure_mode",
    );
  if (!Array.isArray(input.warningSignals))
    simpleError(
      "warningSignals",
      "Warning signals must be an array.",
      "warning_signals_required",
    );
  if (!Array.isArray(input.mitigations))
    simpleError(
      "mitigations",
      "Mitigations must be an array.",
      "mitigations_required",
    );
  const warningTerms = linkedTerms(input.warningSignals, "warningSignals");
  const mitigationTerms = linkedTerms(input.mitigations, "mitigations");
  const failureReviews = failureModes.map(
    (failureMode) =>
      `${failureMode}: warning=${(warningTerms.get(failureMode)?.size ?? 0) > 0 ? "covered" : "missing"}; mitigation=${(mitigationTerms.get(failureMode)?.size ?? 0) > 0 ? "covered" : "missing"}`,
  );
  const uncoveredFailureModes = failureModes.filter(
    (failureMode) =>
      !warningTerms.has(failureMode) || !mitigationTerms.has(failureMode),
  );
  return {
    failureReviews,
    fullyReviewedFailureCount:
      failureModes.length - uncoveredFailureModes.length,
    uncoveredFailureModes,
  };
};

export const premortemExample = {
  input: {
    failureModes: ["Demand fails", "Supply delays"],
    mitigations: [
      "Demand fails|pre-contract customers",
      "Supply delays|dual-source critical parts",
    ],
    warningSignals: [
      "Demand fails|pilot conversion below target",
      "Supply delays|lead times increase",
    ],
  },
  output: {
    failureReviews: [
      "Demand fails: warning=covered; mitigation=covered",
      "Supply delays: warning=covered; mitigation=covered",
    ],
    fullyReviewedFailureCount: 2,
    uncoveredFailureModes: [],
  },
} satisfies ToolExample<PremortemInput, PremortemOutput>;

export const premortemTool = createSimpleTool({
  calculate: (input) =>
    checkProspectiveHindsightFailureCoverage({
      failureModes: input.failureModes as string[],
      mitigations: input.mitigations as string[],
      warningSignals: input.warningSignals as string[],
    }),
  description:
    "Check whether every caller-supplied premortem failure mode has both a linked warning signal and mitigation.",
  id: "futurology/premortem-prospective-hindsight-failure-checker",
  inputs: [
    { id: "failureModes", kind: "stringList", label: "Failure modes" },
    {
      description: "Entries in failureMode|mitigation form.",
      id: "mitigations",
      kind: "stringList",
      label: "Mitigations",
    },
    {
      description: "Entries in failureMode|warningSignal form.",
      id: "warningSignals",
      kind: "stringList",
      label: "Warning signals",
    },
  ],
  outputs: [
    { id: "failureReviews", kind: "stringList", label: "Failure reviews" },
    {
      id: "fullyReviewedFailureCount",
      kind: "integer",
      label: "Fully reviewed failure modes",
      minimum: 0,
    },
    {
      id: "uncoveredFailureModes",
      kind: "stringList",
      label: "Uncovered failure modes",
    },
  ],
  title: "Premortem Prospective Hindsight Failure Checker",
});

export const runPremortem = premortemTool.execute;
export default premortemTool;
