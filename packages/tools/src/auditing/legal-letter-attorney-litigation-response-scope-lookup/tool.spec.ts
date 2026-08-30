import { describe, expect, it } from "vitest";
import {
  checkLegalLetterResponseScope,
  legalLetterScopeExample,
  runLegalLetterScope,
} from "./tool.js";

describe("legal letter response scope", () => {
  it("reproduces its canonical example", () => {
    expect(runLegalLetterScope(legalLetterScopeExample.input)).toEqual({
      ok: true,
      output: legalLetterScopeExample.output,
    });
  });

  it("matches item labels without case sensitivity", () => {
    expect(
      checkLegalLetterResponseScope({
        providedItems: [" Insurance "],
        requestedItems: ["insurance"],
        responseDate: "2026-04-10",
        responseDueDate: "2026-04-10",
      }),
    ).toMatchObject({ complete: true, responseOnTime: true });
  });

  it("flags a late response even when scope is complete", () => {
    expect(
      checkLegalLetterResponseScope({
        providedItems: ["A"],
        requestedItems: ["A"],
        responseDate: "2026-04-16",
        responseDueDate: "2026-04-15",
      }).responseOnTime,
    ).toBe(false);
  });

  it("rejects a malformed response date", () => {
    expect(
      runLegalLetterScope({
        providedItems: ["A"],
        requestedItems: ["A"],
        responseDate: "04/10/2026",
        responseDueDate: "2026-04-15",
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_response_date", field: "responseDate" }],
      },
      ok: false,
    });
  });
});
