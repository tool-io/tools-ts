import { describe, expect, it } from "vitest";
import {
  calculateTeuFeuEquivalentConversion,
  teuFeuEquivalentConversionExample,
  runTeuFeuEquivalentConversion,
} from "./tool.js";

describe("teu-feu-equivalent-conversion", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTeuFeuEquivalentConversion(teuFeuEquivalentConversionExample.input),
    ).toEqual({
      ok: true,
      output: teuFeuEquivalentConversionExample.output,
    });
  });

  it("treats an odd TEU total as a half FEU", () => {
    const result = runTeuFeuEquivalentConversion({ twentyFootContainers: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.totalTeuEquivalent as number).toBe(1);
    expect(result.output.totalFeuEquivalent as number).toBe(0.5);
  });
  it("rejects negative container counts", () => {
    expect(runTeuFeuEquivalentConversion({ twentyFootContainers: -1 }).ok).toBe(
      false,
    );
  });

  it("rejects combined counts beyond safe integer precision", () => {
    expect(() =>
      calculateTeuFeuEquivalentConversion({
        fortyFootContainers: Number.MAX_SAFE_INTEGER,
      }),
    ).toThrow("safe integer range");
  });
});
