import { describe, expect, it } from "vitest";
import {
  BUDDING_PATTERNS,
  runYeastBuddingPatternClassifier,
  yeastBuddingPatternClassifierExample,
} from "./tool.js";

describe("Budding Pattern", () => {
  it("matches the canonical example", () =>
    expect(
      runYeastBuddingPatternClassifier(
        yeastBuddingPatternClassifierExample.input,
      ),
    ).toEqual({
      ok: true,
      output: yeastBuddingPatternClassifierExample.output,
    }));
  it("passes multilateral through unchanged", () =>
    expect(
      runYeastBuddingPatternClassifier({ pattern: "multilateral" }),
    ).toEqual({
      ok: true,
      output: { buddingClass: "multilateral" },
    }));
  it("passes bipolar through unchanged", () =>
    expect(runYeastBuddingPatternClassifier({ pattern: "bipolar" })).toEqual({
      ok: true,
      output: { buddingClass: "bipolar" },
    }));
  it("passes unipolar through unchanged", () =>
    expect(runYeastBuddingPatternClassifier({ pattern: "unipolar" })).toEqual({
      ok: true,
      output: { buddingClass: "unipolar" },
    }));
  it("passes fission through unchanged", () =>
    expect(runYeastBuddingPatternClassifier({ pattern: "fission" })).toEqual({
      ok: true,
      output: { buddingClass: "fission" },
    }));
  it("covers the whole enum", () => {
    for (const pattern of BUDDING_PATTERNS) {
      const result = runYeastBuddingPatternClassifier({ pattern });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.output.buddingClass).toBe(pattern);
    }
  });
  it("rejects patterns outside the enum", () =>
    expect(runYeastBuddingPatternClassifier({ pattern: "budding" }).ok).toBe(
      false,
    ));
});
