import { describe, expect, it } from "vitest";
import {
  semanticVersionRangeExample,
  runSemanticVersionRange,
} from "./tool.js";

describe("development/semantic-version-range", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSemanticVersionRange(semanticVersionRangeExample.input)).toEqual({
      ok: true,
      output: semanticVersionRangeExample.output,
    });
  });

  it("applies caret and tilde bump rules", () => {
    const caret = runSemanticVersionRange({
      range: "^0.2.0",
      version: "0.2.9",
    });
    expect(caret.ok && caret.output.satisfied).toBe(true);
    const caretBlocked = runSemanticVersionRange({
      range: "^0.2.0",
      version: "0.3.0",
    });
    expect(caretBlocked.ok && caretBlocked.output.satisfied).toBe(false);
    const tildeZero = runSemanticVersionRange({
      range: "~0.0.3",
      version: "0.0.4",
    });
    expect(tildeZero.ok && tildeZero.output.satisfied).toBe(false);
    const tildePatch = runSemanticVersionRange({
      range: "~1.4.2",
      version: "1.4.9",
    });
    expect(tildePatch.ok && tildePatch.output.satisfied).toBe(true);
    const tildeMinor = runSemanticVersionRange({
      range: "~1.4.2",
      version: "1.5.0",
    });
    expect(tildeMinor.ok && tildeMinor.output.satisfied).toBe(false);
  });

  it("ANDs primitive comparators and ignores build metadata", () => {
    const combined = runSemanticVersionRange({
      range: ">=1.2.0 <1.9.0",
      version: "1.9.0-beta+exp",
    });
    expect(combined.ok && combined.output.satisfied).toBe(true);
    expect(combined.ok ? combined.output.comparatorCount : 0).toBe(2);
  });

  it("rejects invalid ranges with structured errors", () => {
    const invalid = runSemanticVersionRange({
      range: ">=not-a-version",
      version: "1.0.0",
    });
    expect(invalid.ok).toBe(false);
    if (!invalid.ok)
      expect(invalid.error.issues[0]?.code).toBe("invalid_semver");
    expect(runSemanticVersionRange({ range: "", version: "1.0.0" }).ok).toBe(
      false,
    );
  });
});
