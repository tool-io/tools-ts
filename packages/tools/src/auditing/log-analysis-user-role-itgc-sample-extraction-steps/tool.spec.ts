import { describe, expect, it } from "vitest";
import {
  logAnalysisSampleExample,
  runLogAnalysisSample,
  testLogAnalysisSample,
} from "./tool.js";

describe("log analysis user role ITGC sample", () => {
  it("reproduces its canonical example", () => {
    expect(runLogAnalysisSample(logAnalysisSampleExample.input)).toEqual({
      ok: true,
      output: logAnalysisSampleExample.output,
    });
  });

  it("accepts complete sampled logs", () => {
    expect(
      testLogAnalysisSample({ logRows: [[1, 1, 1, 1, 1, 1]] }).complete,
    ).toBe(true);
  });

  it("flags a row missing an event type", () => {
    expect(
      testLogAnalysisSample({ logRows: [[1, 1, 0, 1, 1, 1]] }).issueRowIndices,
    ).toEqual([0]);
  });

  it("rejects a malformed log row", () => {
    expect(runLogAnalysisSample({ logRows: [[1, 1, 1]] })).toMatchObject({
      error: { issues: [{ code: "invalid_log_row", field: "logRows.0" }] },
      ok: false,
    });
  });
});
