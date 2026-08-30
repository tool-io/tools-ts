import { describe, expect, it } from "vitest";
import {
  agreedUponFindingsExample,
  checkAgreedUponFindingsFormat,
  runAgreedUponFindings,
} from "./tool.js";

describe("agreed-upon procedures finding format", () => {
  it("reproduces its canonical example", () => {
    expect(runAgreedUponFindings(agreedUponFindingsExample.input)).toEqual({
      ok: true,
      output: agreedUponFindingsExample.output,
    });
  });

  it("accepts findings with all selected components", () => {
    expect(
      checkAgreedUponFindingsFormat({ findingRows: [[1, 1, 1, 1]] })
        .formatComplete,
    ).toBe(true);
  });

  it("flags multiple incomplete finding rows", () => {
    expect(
      checkAgreedUponFindingsFormat({
        findingRows: [
          [0, 1, 1, 1],
          [1, 1, 1, 1],
          [1, 0, 1, 1],
        ],
      }).incompleteFindingIndices,
    ).toEqual([0, 2]);
  });

  it("rejects a non-binary finding component", () => {
    expect(
      runAgreedUponFindings({ findingRows: [[1, 1, 2, 1]] }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_finding_flag", field: "findingRows.0.2" }],
      },
      ok: false,
    });
  });
});
