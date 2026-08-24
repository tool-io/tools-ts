import { describe, expect, it } from "vitest";
import {
  semanticVersionCompareExample,
  runSemanticVersionCompare,
} from "./tool.js";

describe("development/semantic-version-compare", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSemanticVersionCompare(semanticVersionCompareExample.input),
    ).toEqual({ ok: true, output: semanticVersionCompareExample.output });
  });

  it("orders the full semver.org precedence chain", () => {
    const chain = [
      "1.0.0-alpha",
      "1.0.0-alpha.1",
      "1.0.0-alpha.beta",
      "1.0.0-beta",
      "1.0.0-beta.2",
      "1.0.0-beta.11",
      "1.0.0-rc.1",
      "1.0.0",
    ];
    for (let index = 0; index + 1 < chain.length; index += 1) {
      const result = runSemanticVersionCompare({
        versionA: chain[index]!,
        versionB: chain[index + 1]!,
      });
      expect(result.ok && result.output.comparison === -1).toBe(true);
    }
  });

  it("ignores build metadata and rejects invalid versions with structured errors", () => {
    const buildOnly = runSemanticVersionCompare({
      versionA: "1.0.0+abc.7",
      versionB: "1.0.0+xyz",
    });
    expect(buildOnly.ok && buildOnly.output.comparison === 0).toBe(true);
    const invalid = runSemanticVersionCompare({
      versionA: "01.2.3",
      versionB: "1.0.0",
    });
    expect(invalid.ok).toBe(false);
    if (!invalid.ok)
      expect(invalid.error.issues[0]?.code).toBe("invalid_semver");
    expect(
      runSemanticVersionCompare({ versionA: "1.2", versionB: "1.0.0" }).ok,
    ).toBe(false);
  });
});
