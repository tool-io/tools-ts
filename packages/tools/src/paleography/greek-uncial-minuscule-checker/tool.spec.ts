import { describe, expect, it } from "vitest";
import {
  greekUncialMinusculeCheckerExample,
  runGreekUncialMinusculeChecker,
} from "./tool.js";

describe("greek-uncial-minuscule-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGreekUncialMinusculeChecker(greekUncialMinusculeCheckerExample.input),
    ).toEqual({ ok: true, output: greekUncialMinusculeCheckerExample.output });
  });

  it("returns minuscule dominance for the tenth century", () => {
    const result = runGreekUncialMinusculeChecker({ century: 10 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.dominantHand as string).toBe("minuscule_dominant");
    expect(result.output.coexistenceCentury as boolean).toBe(false);
  });

  it("rejects non-positive centuries", () => {
    expect(runGreekUncialMinusculeChecker({ century: 0 }).ok).toBe(false);
    expect(runGreekUncialMinusculeChecker({ century: 16 }).ok).toBe(false);
  });
});
