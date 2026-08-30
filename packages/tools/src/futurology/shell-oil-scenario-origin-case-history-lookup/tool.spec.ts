import { describe, expect, it } from "vitest";
import {
  lookupShellOilScenarioHistory,
  runShellOilScenarioHistory,
  shellOilScenarioHistoryExample,
} from "./tool.js";

describe("Shell oil scenario origin case history lookup", () => {
  it("reproduces its canonical example", () => {
    expect(
      runShellOilScenarioHistory(shellOilScenarioHistoryExample.input),
    ).toEqual({
      ok: true,
      output: shellOilScenarioHistoryExample.output,
    });
  });

  it("looks up historical context", () => {
    expect(
      lookupShellOilScenarioHistory({ focus: "context" }).historyEntry,
    ).toContain("Royal Dutch Shell");
  });

  it("looks up a method contribution", () => {
    expect(
      lookupShellOilScenarioHistory({ focus: "method" }).historyEntry,
    ).toContain("institutionalize");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runShellOilScenarioHistory({ focus: "forecast" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "focus" }] },
      ok: false,
    });
  });
});
