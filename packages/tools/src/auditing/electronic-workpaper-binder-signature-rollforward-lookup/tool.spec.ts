import { describe, expect, it } from "vitest";
import {
  electronicBinderRollforwardExample,
  runElectronicBinderRollforward,
  testElectronicBinderRollforward,
} from "./tool.js";

describe("electronic workpaper binder signature rollforward", () => {
  it("reproduces its canonical example", () => {
    expect(
      runElectronicBinderRollforward(electronicBinderRollforwardExample.input),
    ).toEqual({
      ok: true,
      output: electronicBinderRollforwardExample.output,
    });
  });

  it("accepts fully signed current documents with matching hashes", () => {
    expect(
      testElectronicBinderRollforward({
        currentVersionCount: 1,
        documents: [[1, 1, 1]],
        priorVersionCount: 1,
      }).issueCount,
    ).toBe(0);
  });

  it("detects a version-count imbalance", () => {
    expect(
      testElectronicBinderRollforward({
        currentVersionCount: 2,
        documents: [[1, 1, 1]],
        priorVersionCount: 1,
      }).versionsBalanced,
    ).toBe(false);
  });

  it("rejects a malformed document row", () => {
    expect(
      runElectronicBinderRollforward({
        currentVersionCount: 1,
        documents: [[1, 1]],
        priorVersionCount: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_document_row", field: "documents.0" }],
      },
      ok: false,
    });
  });
});
