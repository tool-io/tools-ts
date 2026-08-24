import { describe, expect, it } from "vitest";
import {
  capitalizationRandomnessIndexExample,
  runCapitalizationRandomnessIndex,
} from "./tool.js";

describe("capitalization-randomness-index", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCapitalizationRandomnessIndex(
        capitalizationRandomnessIndexExample.input,
      ),
    ).toEqual({
      ok: true,
      output: capitalizationRandomnessIndexExample.output,
    });
  });

  it("returns a rate of one for fully capitalized samples", () => {
    const result = runCapitalizationRandomnessIndex({
      text: "\u201cAlpha \u00C9ire",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.capitalizationRate as number).toBe(1);
    expect(result.output.distinctCapitalizedInitials as number).toBe(2);
  });

  it("rejects empty text", () => {
    expect(runCapitalizationRandomnessIndex({ text: "   " }).ok).toBe(false);
    expect(runCapitalizationRandomnessIndex({ text: "--- \u2026" }).ok).toBe(
      false,
    );
  });
});
