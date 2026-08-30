import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EquityGrantApprovalInput = {
  readonly approvedFlags: ReadonlyArray<number>;
  readonly grantIds: ReadonlyArray<string>;
};

export type EquityGrantApprovalOutput = {
  readonly approvedCount: number;
  readonly grantCount: number;
  readonly unapprovedCount: number;
  readonly unapprovedGrantIds: ReadonlyArray<string>;
};

export const inspectEquityGrantApprovals = (
  input: EquityGrantApprovalInput,
): EquityGrantApprovalOutput => {
  if (!Array.isArray(input.grantIds) || !Array.isArray(input.approvedFlags))
    simpleError(
      "",
      "Grant IDs and approval flags must be arrays.",
      "grant_data_required",
    );
  if (input.grantIds.length !== input.approvedFlags.length)
    simpleError(
      "approvedFlags",
      "Each grant ID must have one approval flag.",
      "grant_data_length_mismatch",
    );
  const unapprovedGrantIds: string[] = [];
  let approvedCount = 0;
  for (const [index, grantId] of input.grantIds.entries()) {
    const approved = input.approvedFlags[index];
    if (typeof grantId !== "string" || grantId.trim() === "")
      simpleError(
        `grantIds.${index}`,
        "Grant IDs must be nonempty strings.",
        "invalid_grant_id",
      );
    if (approved !== 0 && approved !== 1)
      simpleError(
        `approvedFlags.${index}`,
        "Approval flags must be 0 or 1.",
        "invalid_approval_flag",
      );
    if (approved === 1) approvedCount += 1;
    else unapprovedGrantIds.push(grantId.trim());
  }
  return {
    approvedCount,
    grantCount: input.grantIds.length,
    unapprovedCount: unapprovedGrantIds.length,
    unapprovedGrantIds,
  };
};

export const equityGrantApprovalExample = {
  input: {
    approvedFlags: [1, 0, 1],
    grantIds: ["GRANT-101", "GRANT-102", "GRANT-103"],
  },
  output: {
    approvedCount: 2,
    grantCount: 3,
    unapprovedCount: 1,
    unapprovedGrantIds: ["GRANT-102"],
  },
} satisfies ToolExample<EquityGrantApprovalInput, EquityGrantApprovalOutput>;

export const equityGrantApprovalTool = createSimpleTool({
  calculate: (input) =>
    inspectEquityGrantApprovals({
      approvedFlags: input.approvedFlags as number[],
      grantIds: input.grantIds as string[],
    }),
  description:
    "Match equity-option grant IDs to supplied board-approval evidence flags and report every unapproved grant.",
  id: "auditing/equity-option-grant-board-approval-inspection-steps",
  inputs: [
    {
      description: "One binary board-approval evidence flag for each grant.",
      id: "approvedFlags",
      kind: "numberList",
      label: "Approval flags",
    },
    {
      description: "One stable identifier for each equity grant.",
      id: "grantIds",
      kind: "stringList",
      label: "Grant IDs",
    },
  ],
  outputs: [
    {
      id: "approvedCount",
      kind: "integer",
      label: "Approved grants",
      minimum: 0,
    },
    {
      id: "grantCount",
      kind: "integer",
      label: "Grants inspected",
      minimum: 0,
    },
    {
      id: "unapprovedCount",
      kind: "integer",
      label: "Unapproved grants",
      minimum: 0,
    },
    {
      id: "unapprovedGrantIds",
      kind: "stringList",
      label: "Unapproved grant IDs",
    },
  ],
  title: "Equity Option Grant Board Approval Inspection Steps",
});

export const runEquityGrantApproval = equityGrantApprovalTool.execute;
export default equityGrantApprovalTool;
