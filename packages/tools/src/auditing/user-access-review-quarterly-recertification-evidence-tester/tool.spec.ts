import { describe, expect, it } from "vitest";
import {
  accessRecertificationExample,
  runAccessRecertification,
  testAccessRecertificationEvidence,
} from "./tool.js";

describe("user access recertification evidence tester", () => {
  it("reproduces its canonical example", () => {
    expect(
      runAccessRecertification(accessRecertificationExample.input),
    ).toEqual({
      ok: true,
      output: accessRecertificationExample.output,
    });
  });

  it("accepts evidence exactly at the maximum age", () => {
    expect(
      testAccessRecertificationEvidence({
        maximumAgeDays: 90,
        reviews: [[90, 1, 1, 1]],
      }).complete,
    ).toBe(true);
  });

  it("flags missing reviewer evidence", () => {
    expect(
      testAccessRecertificationEvidence({
        maximumAgeDays: 90,
        reviews: [[10, 0, 1, 1]],
      }).issueIndices,
    ).toEqual([0]);
  });

  it("rejects a malformed review row", () => {
    expect(
      runAccessRecertification({ maximumAgeDays: 90, reviews: [[10, 1]] }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_review_row", field: "reviews.0" }] },
      ok: false,
    });
  });
});
