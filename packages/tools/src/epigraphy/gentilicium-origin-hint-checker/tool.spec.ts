import { describe, expect, it } from "vitest";
import {
  gentiliciumOriginHintCheckerExample,
  runGentiliciumOriginHintChecker,
} from "./tool.js";

describe("gentilicium-origin-hint-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGentiliciumOriginHintChecker(
        gentiliciumOriginHintCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: gentiliciumOriginHintCheckerExample.output,
    });
  });

  it("matches feminine -ia forms and rejects non-Latin endings", () => {
    const fem = runGentiliciumOriginHintChecker({ nomen: "cornelia" });
    if (!fem.ok) throw new Error("expected success");
    expect(fem.output.matchedEnding as string).toBe("ia");
    expect(runGentiliciumOriginHintChecker({ nomen: "Kastor" })).toEqual({
      ok: true,
      output: { matchedEnding: "none", suggestsItalianOrigin: false },
    });
  });
  it("rejects empty or non-alphabetic nomina", () => {
    expect(runGentiliciumOriginHintChecker({ nomen: "" }).ok).toBe(false);
    expect(runGentiliciumOriginHintChecker({ nomen: "Valeri us" }).ok).toBe(
      false,
    );
  });
});
