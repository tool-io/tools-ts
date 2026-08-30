import { describe, expect, it } from "vitest";
import {
  equityGrantApprovalExample,
  inspectEquityGrantApprovals,
  runEquityGrantApproval,
} from "./tool.js";

describe("equity grant board approval inspection", () => {
  it("reproduces its canonical example", () => {
    expect(runEquityGrantApproval(equityGrantApprovalExample.input)).toEqual({
      ok: true,
      output: equityGrantApprovalExample.output,
    });
  });

  it("accepts all grants with approval evidence", () => {
    expect(
      inspectEquityGrantApprovals({
        approvedFlags: [1, 1],
        grantIds: ["A", "B"],
      }),
    ).toMatchObject({ approvedCount: 2, unapprovedCount: 0 });
  });

  it("retains unapproved grant order", () => {
    expect(
      inspectEquityGrantApprovals({
        approvedFlags: [0, 1, 0],
        grantIds: ["A", "B", "C"],
      }).unapprovedGrantIds,
    ).toEqual(["A", "C"]);
  });

  it("rejects mismatched grant data", () => {
    expect(
      runEquityGrantApproval({ approvedFlags: [1], grantIds: ["A", "B"] }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "grant_data_length_mismatch", field: "approvedFlags" },
        ],
      },
      ok: false,
    });
  });
});
